import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

  const handleSubmit = (event: React.FormEvent) => {
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

    localStorage.setItem(
      "finny_registration_draft",
      JSON.stringify({ full_name: fullName, phone_number: phoneNumber, email, password, password_confirmation: passwordConfirmation })
    );
    navigate("/onboarding");
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Full Name</span>
              <input type="text" placeholder="Enter your full name" autoComplete="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
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

            <button type="submit" className="mt-2 w-full rounded-xl bg-[color:var(--color-ebony)] px-4 py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-95">
              Continue
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
