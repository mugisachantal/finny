import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [incomeBracket, setIncomeBracket] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [village, setVillage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const ninImageRef = useRef<HTMLInputElement>(null);
  const livelinessImageRef = useRef<HTMLInputElement>(null);
  const [ninImageName, setNinImageName] = useState("");
  const [livelinessImageName, setLivelinessImageName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EyeOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-0.42.94-1 1.83-1.72 2.63" />
      <path d="M6.11 6.11C3.6 7.76 1.68 10.12 1 12c1.73 3.89 6 7 11 7 1.25 0 2.46-.19 3.58-.54" />
    </svg>
  );

  const EyeOn = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const inputClass = "w-full rounded-xl border border-[color:var(--color-dust-grey)] bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] outline-none transition-all duration-200 placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]";
  const toggleBtnClass = "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-ebony)] transition hover:bg-[color:var(--color-soft-linen)]";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions to continue.");
      return;
    }

    if (!ninImageRef.current?.files?.[0]) {
      setError("A photo of your National ID is required.");
      return;
    }

    if (!livelinessImageRef.current?.files?.[0]) {
      setError("A verification photo is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("date_of_birth", dateOfBirth);

      // Backend expects exact format: ^\+256[0-9]{9}$ (no spaces)
      // e.g. +2567XXXXXXXX
      const normalizedPhone = phoneNumber.replace(/\s+/g, "");
      formData.append("phone_number", normalizedPhone);

      if (email) formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      formData.append("income_bracket", incomeBracket);
      formData.append("district", district);
      formData.append("education_level", educationLevel);
      if (address) formData.append("address", address);
      if (subcounty) formData.append("subcounty", subcounty);
      if (village) formData.append("village", village);
      formData.append("terms_accepted", termsAccepted ? "1" : "0");
      formData.append("nin_image", ninImageRef.current.files[0]);
      formData.append("liveliness_image", livelinessImageRef.current.files[0]);

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

      // Debug: show exact backend validation errors in the browser console
      // eslint-disable-next-line no-console
      console.log("Register response data:", data);

      if (!res.ok) {
        const firstError = Object.values(data.errors ?? {})[0]?.[0];
        setError(firstError ?? data.message ?? "Registration failed. Please check your details.");
        return;
      }

      login(data.data!.token, data.data!.borrower);
      navigate("/home");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(164,194,165,0.24),_transparent_36%),linear-gradient(180deg,_#f7f7f1_0%,_#f1f2eb_100%)] px-4 py-10 text-[color:var(--color-charcoal)] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white/92 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--color-muted-teal)] text-sm font-bold tracking-[0.28em] text-white shadow-[0_16px_32px_rgba(84,98,70,0.24)]">
              FINNY
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-ebony)]">Create Account</h1>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-ebony)]/90">
              Join us today and start managing your finances.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Full Name</span>
              <input type="text" placeholder="Enter your full name" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Date of Birth</span>
              <input type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Phone Number</span>
              <input type="tel" placeholder="+256 XXX XXX XXX" autoComplete="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">
                Email Address <span className="font-normal text-[color:var(--color-charcoal)]/50">(optional)</span>
              </span>
              <input type="email" placeholder="Enter your email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Monthly Income Bracket</span>
              <select required value={incomeBracket} onChange={(e) => setIncomeBracket(e.target.value)} className={inputClass}>
                <option value="">Select income bracket</option>
                <option value="under_100k">Under 100,000 UGX</option>
                <option value="100k_300k">100,000 - 300,000 UGX</option>
                <option value="300k_600k">300,000 - 600,000 UGX</option>
                <option value="600k_1m">600,000 - 1,000,000 UGX</option>
                <option value="over_1m">Over 1,000,000 UGX</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Education Level</span>
              <select required value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className={inputClass}>
                <option value="">Select education level</option>
                <option value="none">None</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary (University / College)</option>
                <option value="vocational">Vocational / Technical</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">District</span>
              <input type="text" placeholder="Enter your district" required value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Address <span className="font-normal text-[color:var(--color-charcoal)]/50">(optional)</span></span>
              <input type="text" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Subcounty <span className="font-normal text-[color:var(--color-charcoal)]/50">(optional)</span></span>
              <input type="text" placeholder="Enter your subcounty" value={subcounty} onChange={(e) => setSubcounty(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Village <span className="font-normal text-[color:var(--color-charcoal)]/50">(optional)</span></span>
              <input type="text" placeholder="Enter your village" value={village} onChange={(e) => setVillage(e.target.value)} className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Password</span>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Create a password (min 8 chars)" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-20`} />
                <button type="button" onClick={() => setShowPassword((c) => !c)} aria-label={showPassword ? "Hide password" : "Show password"} className={toggleBtnClass}>
                  {showPassword ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Confirm Password</span>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" autoComplete="new-password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={`${inputClass} pr-20`} />
                <button type="button" onClick={() => setShowConfirmPassword((c) => !c)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} className={toggleBtnClass}>
                  {showConfirmPassword ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </label>

            <div className="space-y-3 rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] p-4">
              <div className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--color-ebony)]">National ID Upload</span>
                <input ref={ninImageRef} type="file" accept="image/jpeg,image/png" required onChange={(e) => setNinImageName(e.target.files?.[0]?.name ?? "")} className="block w-full text-sm text-[color:var(--color-charcoal)] file:mr-4 file:rounded-lg file:border-0 file:bg-[color:var(--color-ebony)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <p className="text-xs text-[color:var(--color-charcoal)]/70">{ninImageName || "JPEG or PNG, max 4 MB"}</p>
              </div>

              <div className="space-y-2">
                <span className="block text-sm font-medium text-[color:var(--color-ebony)]">Liveliness / Selfie Upload</span>
                <input ref={livelinessImageRef} type="file" accept="image/jpeg,image/png" required onChange={(e) => setLivelinessImageName(e.target.files?.[0]?.name ?? "")} className="block w-full text-sm text-[color:var(--color-charcoal)] file:mr-4 file:rounded-lg file:border-0 file:bg-[color:var(--color-ebony)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <p className="text-xs text-[color:var(--color-charcoal)]/70">{livelinessImageName || "JPEG or PNG, max 4 MB"}</p>
              </div>

              <label className="flex items-start gap-3 text-sm text-[color:var(--color-charcoal)] cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[color:var(--color-dust-grey)]" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                <span>I agree to the Terms &amp; Conditions and Privacy Policy.</span>
              </label>
            </div>

            <button type="submit" className="mt-2 w-full rounded-xl bg-[color:var(--color-ebony)] px-4 py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-95">
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[color:var(--color-charcoal)]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[color:var(--color-ebony)] underline-offset-4 transition hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
