import { Link, useNavigate } from "react-router";

export default function LenderOnboarding() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(164,194,165,0.24),_transparent_36%),linear-gradient(180deg,_#f7f7f1_0%,_#f1f2eb_100%)] px-4 py-10 text-[color:var(--color-charcoal)] sm:px-6 lg:px-8">
			<section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[42rem] items-center justify-center">
				<div className="w-full rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white/92 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-10">
					<div className="mb-8 text-center">
						<div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--color-muted-teal)] text-sm font-bold tracking-[0.28em] text-white shadow-[0_16px_32px_rgba(84,98,70,0.24)]">
							FINNY
						</div>
						<h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-ebony)]">
							Lender Onboarding
						</h1>
						<p className="mt-3 text-sm leading-6 text-[color:var(--color-ebony)]/90">
							Set up your lending business profile and start listing products.
						</p>
					</div>

					<form
						className="space-y-4"
						onSubmit={(event) => {
							event.preventDefault();
							navigate("/home");
						}}
					>
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Business Name</span>
							<input
								type="text"
								name="businessName"
								placeholder="Enter your business name"
								className="w-full rounded-xl border border-[color:var(--color-dust-grey)] bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] outline-none transition-all duration-200 placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
							/>
						</label>

						<label className="block">
							<span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Business Email</span>
							<input
								type="email"
								name="businessEmail"
								placeholder="Enter your business email"
								autoComplete="email"
								className="w-full rounded-xl border border-[color:var(--color-dust-grey)] bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] outline-none transition-all duration-200 placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
							/>
						</label>

						<label className="block">
							<span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Business Type</span>
							<select
								name="businessType"
								defaultValue=""
								className="w-full rounded-xl border border-[color:var(--color-dust-grey)] bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] outline-none transition-all duration-200 focus:border-[color:var(--color-muted-teal)] focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
							>
								<option value="">Select business type</option>
								<option>Digital lender</option>
								<option>Microfinance institution</option>
								<option>Cooperative</option>
								<option>Other</option>
							</select>
						</label>

						<label className="block">
							<span className="mb-2 block text-sm font-medium text-[color:var(--color-ebony)]">Business Description</span>
							<textarea
								name="description"
								rows={4}
								placeholder="Tell us about your lending products and target users"
								className="w-full rounded-xl border border-[color:var(--color-dust-grey)] bg-white px-4 py-3 text-sm text-[color:var(--color-charcoal)] outline-none transition-all duration-200 placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
							/>
						</label>

						<div className="flex gap-3 pt-2">
							<Link
								to="/"
								className="flex-1 rounded-xl bg-[color:var(--color-dust-grey)] px-4 py-3.5 text-center text-sm font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-95"
							>
								Back
							</Link>
							<button
								type="submit"
								className="flex-1 rounded-xl bg-[color:var(--color-ebony)] px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
							>
								Continue
							</button>
						</div>
					</form>
				</div>
			</section>
		</main>
	);
}