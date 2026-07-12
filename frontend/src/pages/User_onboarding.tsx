import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/sections/footer";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";

const INCOME_BRACKETS = [
  { label: "Under 100,000 UGX", value: "under_100k" },
  { label: "100,000 – 300,000 UGX", value: "100k_300k" },
  { label: "300,000 – 600,000 UGX", value: "300k_600k" },
  { label: "600,000 – 1,000,000 UGX", value: "600k_1m" },
  { label: "Over 1,000,000 UGX", value: "over_1m" },
];

const EDUCATION_LEVELS = [
  { label: "None", value: "none" },
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary (University / College)", value: "tertiary" },
  { label: "Vocational / Technical", value: "vocational" },
];

const STEPS = [
  { title: "Personal Details", description: "Let's start with the basics to secure your account." },
  { title: "Financial Info", description: "Help us customize your payment experience." },
  { title: "Address Details", description: "Tell us where you live so we can complete your profile." },
  { title: "Verification", description: "Final step: verify your identity to proceed." },
];

type Draft = {
  full_name: string;
  phone_number: string;
  email?: string;
  password: string;
  password_confirmation: string;
};

const selectClass = "w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]";
const inputClass = "w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]";
const labelClass = "block text-sm font-semibold text-[color:var(--color-ebony)]";

export default function UserOnboarding() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 0 — Personal Details
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Step 1 — Financial Info
  const [workStatus, setWorkStatus] = useState("");
  const [incomeBracket, setIncomeBracket] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  // Step 2 — Address
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [village, setVillage] = useState("");

  // Step 3 — Verification
  const ninImageRef = useRef<HTMLInputElement>(null);
  const livelinessImageRef = useRef<HTMLInputElement>(null);
  const [ninImageName, setNinImageName] = useState("");
  const [livelinessImageName, setLivelinessImageName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleNext = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Final step — submit registration
    if (!termsAccepted) {
      setError("You must accept the Terms & Conditions to continue.");
      return;
    }

    const draft = (() => {
      try {
        return JSON.parse(localStorage.getItem("finny_registration_draft") ?? "{}") as Draft;
      } catch {
        return {} as Draft;
      }
    })();

    const formData = new FormData();
    formData.append("full_name", draft.full_name ?? "");
    formData.append("phone_number", draft.phone_number ?? "");
    if (draft.email) formData.append("email", draft.email);
    formData.append("password", draft.password ?? "");
    formData.append("password_confirmation", draft.password_confirmation ?? "");
    formData.append("date_of_birth", dateOfBirth);
    formData.append("business_type", workStatus);
    formData.append("income_bracket", incomeBracket);
    formData.append("education_level", educationLevel);
    formData.append("district", district);
    if (address) formData.append("address", address);
    if (subcounty) formData.append("subcounty", subcounty);
    if (village) formData.append("village", village);
    formData.append("terms_accepted", "1");
    if (ninImageRef.current?.files?.[0]) {
      formData.append("nin_image", ninImageRef.current.files[0]);
    }
    if (livelinessImageRef.current?.files?.[0]) {
      formData.append("liveliness_image", livelinessImageRef.current.files[0]);
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = (await res.json()) as {
        message: string;
        data?: { token: string; borrower: AuthUser };
        errors?: Record<string, string[]>;
      };

      if (!res.ok) {
        const firstError = Object.values(data.errors ?? {})[0]?.[0];
        setError(firstError ?? data.message ?? "Registration failed. Please check your details.");
        return;
      }

      localStorage.removeItem("finny_registration_draft");
      login(data.data!.token, data.data!.borrower);
      navigate("/home");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = [
    // Step 0 — Personal Details
    <div key="personal" className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
        <input id="dateOfBirth" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
      </div>
    </div>,

    // Step 1 — Financial Info
    <div key="financial" className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="workStatus" className={labelClass}>Work Status</label>
        <select id="workStatus" required value={workStatus} onChange={(e) => setWorkStatus(e.target.value)} className={selectClass}>
          <option value="">Select Work Status</option>
          <option value="Employed">Employed</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Student">Student</option>
          <option value="Unemployed">Unemployed</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="incomeBracket" className={labelClass}>Monthly Income Range</label>
        <select id="incomeBracket" required value={incomeBracket} onChange={(e) => setIncomeBracket(e.target.value)} className={selectClass}>
          <option value="">Select Range</option>
          {INCOME_BRACKETS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="educationLevel" className={labelClass}>Education Level</label>
        <select id="educationLevel" required value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className={selectClass}>
          <option value="">Select Level</option>
          {EDUCATION_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>,

    // Step 2 — Address Details
    <div key="address" className="space-y-4">
      {[
        { id: "address", label: "Address", value: address, set: setAddress, required: false, placeholder: "Enter your address" },
        { id: "district", label: "District", value: district, set: setDistrict, required: true, placeholder: "Enter your district" },
        { id: "subcounty", label: "Subcounty", value: subcounty, set: setSubcounty, required: false, placeholder: "Enter your subcounty" },
        { id: "village", label: "Village", value: village, set: setVillage, required: false, placeholder: "Enter your village" },
      ].map((field) => (
        <div key={field.id} className="space-y-2">
          <label htmlFor={field.id} className={labelClass}>{field.label}</label>
          <input id={field.id} type="text" placeholder={field.placeholder} required={field.required} value={field.value} onChange={(e) => field.set(e.target.value)} className={inputClass} />
        </div>
      ))}
    </div>,

    // Step 3 — Verification
    <div key="verification" className="space-y-4">
      <div className="space-y-2">
        <p className={labelClass}>ID / NIN Image</p>
        <label className="block cursor-pointer rounded-[1.5rem] border-2 border-dashed border-[color:var(--color-dust-grey)] p-6 text-center text-[color:var(--color-ebony)] transition-colors hover:border-[color:var(--color-muted-teal)] hover:bg-[color:var(--color-soft-linen)]">
          <div className="text-sm font-semibold">{ninImageName || "Upload NIN / National ID"}</div>
          <div className="mt-2 text-xs text-[color:var(--color-charcoal)]/70">JPEG or PNG, max 4 MB</div>
          <input
            ref={ninImageRef}
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => setNinImageName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>

      {/* Liveliness / Selfie Image upload disabled for now. */}


      <div className="space-y-2">
        <p className={labelClass}>Liveliness / Selfie Image</p>
        <label className="block cursor-pointer rounded-[1.5rem] border-2 border-dashed border-[color:var(--color-dust-grey)] p-6 text-center text-[color:var(--color-ebony)] transition-colors hover:border-[color:var(--color-muted-teal)] hover:bg-[color:var(--color-soft-linen)]">
          <div className="text-sm font-semibold">{livelinessImageName || "Upload Selfie (Liveliness Check)"}</div>
          <div className="mt-2 text-xs text-[color:var(--color-charcoal)]/70">JPEG or PNG, max 4 MB</div>
          <input
            ref={livelinessImageRef}
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => setLivelinessImageName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>
      <div className="rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-4">
        <label className="flex items-start gap-3 text-sm text-[color:var(--color-charcoal)] cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-[color:var(--color-dust-grey)]"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          I agree to the Terms &amp; Conditions and Privacy Policy.
        </label>
      </div>
    </div>,
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(164,194,165,0.24),_transparent_36%),linear-gradient(180deg,_#f7f7f1_0%,_#f1f2eb_100%)] px-4 py-10 text-[color:var(--color-charcoal)] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[28rem] items-center justify-center">
        <div className="w-full overflow-hidden rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white/94 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-10">
          <div className="mb-8 flex items-center justify-between gap-3">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <div
                  key={step.title}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isActive ? "bg-[color:var(--color-muted-teal)] text-white" :
                    isComplete ? "bg-[color:var(--color-ebony)] text-white" :
                    "bg-[color:var(--color-dust-grey)] text-white"
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={(e) => void handleNext(e)}>
            <div>
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[color:var(--color-ebony)]">
                {STEPS[currentStep].title}
              </h1>
              <p className="mb-6 text-sm leading-6 text-[color:var(--color-charcoal)]/85">
                {STEPS[currentStep].description}
              </p>
              <div className="text-sm font-medium text-[color:var(--color-ebony)]">
                {stepContent[currentStep]}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => { setError(null); setCurrentStep((prev) => Math.max(0, prev - 1)); }}
                disabled={currentStep === 0 || isSubmitting}
                className="flex-1 rounded-xl bg-[color:var(--color-dust-grey)] px-4 py-3 font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-[color:var(--color-ebony)] px-4 py-3 font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : currentStep === STEPS.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
