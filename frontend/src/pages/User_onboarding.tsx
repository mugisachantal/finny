import { useState } from "react";
import { Footer } from "../components/sections/footer";

const steps = [
	{
		title: "Personal Details",
		description: "Let's start with the basics to secure your account.",
		content: (
			<>
				<div className="space-y-2">
					<label htmlFor="phoneNumber" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Phone Number
					</label>
					<input
						id="phoneNumber"
						type="tel"
						placeholder="+256 XXX XXX XXX"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="dateOfBirth" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Date of Birth
					</label>
					<input
						id="dateOfBirth"
						type="date"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>
			</>
		),
	},
	{
		title: "Financial Info",
		description: "Help us customize your payment experience.",
		content: (
			<>
				<div className="space-y-2">
					<label htmlFor="workStatus" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Work Status
					</label>
					<select
						id="workStatus"
						defaultValue=""
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					>
						<option value="">Select Work Status</option>
						<option>Employed</option>
						<option>Unemployed</option>
						<option>Student</option>
					</select>
				</div>

				<div className="space-y-2">
					<label htmlFor="incomeRange" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Monthly Income Range
					</label>
					<select
						id="incomeRange"
						defaultValue=""
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					>
						<option value="">Select Range</option>
						<option>Below 1M UGX</option>
						<option>1M - 5M UGX</option>
						<option>5M - 10M UGX</option>
						<option>Above 10M UGX</option>
					</select>
				</div>
			</>
		),
	},
	{
		title: "Address Details",
		description: "Tell us where you live so we can complete your profile.",
		content: (
			<>
				<div className="space-y-2">
					<label htmlFor="address" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Address
					</label>
					<input
						id="address"
						type="text"
						placeholder="Enter your address"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="district" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						District
					</label>
					<input
						id="district"
						type="text"
						placeholder="Enter your district"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="subcounty" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Subcounty
					</label>
					<input
						id="subcounty"
						type="text"
						placeholder="Enter your subcounty"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="village" className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						Village
					</label>
					<input
						id="village"
						type="text"
						placeholder="Enter your village"
						className="w-full rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 text-sm text-[color:var(--color-charcoal)] outline-none transition-all placeholder:text-[color:var(--color-charcoal)]/40 focus:border-[color:var(--color-muted-teal)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(164,194,165,0.16)]"
					/>
				</div>
			</>
		),
	},
	{
		title: "Verification",
		description: "Final step: verify your identity to proceed.",
		content: (
			<>
				<div className="space-y-2">
					<div className="block text-sm font-semibold text-[color:var(--color-ebony)]">
						ID Card Images
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-[1.5rem] border-2 border-dashed border-[color:var(--color-dust-grey)] p-6 text-center text-[color:var(--color-ebony)] transition-colors hover:border-[color:var(--color-muted-teal)] hover:bg-[color:var(--color-soft-linen)]">
							<div className="text-sm font-semibold">Upload Front Image</div>
							<div className="mt-2 text-xs text-[color:var(--color-charcoal)]/70">
								Click to upload the front side of your ID card
							</div>
						</div>

						<div className="rounded-[1.5rem] border-2 border-dashed border-[color:var(--color-dust-grey)] p-6 text-center text-[color:var(--color-ebony)] transition-colors hover:border-[color:var(--color-muted-teal)] hover:bg-[color:var(--color-soft-linen)]">
							<div className="text-sm font-semibold">Upload Back Image</div>
							<div className="mt-2 text-xs text-[color:var(--color-charcoal)]/70">
								Click to upload the back side of your ID card
							</div>
						</div>
					</div>
				</div>

				<button type="button" className="w-full rounded-2xl border border-[color:var(--color-muted-teal)] bg-[color:var(--color-soft-linen)] px-4 py-3.5 font-semibold text-[color:var(--color-ebony)] transition-colors hover:bg-white">
					Start Liveliness Check
				</button>

				<div className="rounded-2xl border border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)] px-4 py-4">
					<div className="flex items-start gap-3 text-sm text-[color:var(--color-charcoal)]">
						<input id="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-[color:var(--color-dust-grey)]" />
						<label htmlFor="terms" className="m-0 font-normal text-[color:var(--color-charcoal)]">
							I agree to the Terms & Conditions and Privacy Policy.
						</label>
					</div>
				</div>
			</>
		),
	},
];

export default function UserOnboarding() {
	const [currentStep, setCurrentStep] = useState(0);

	const goToStep = (nextStep: number) => {
		if (nextStep < 0) {
			setCurrentStep(0);
			return;
		}

		if (nextStep >= steps.length) {
			window.alert("Registration Submitted Successfully!");
			return;
		}

		setCurrentStep(nextStep);
	};

	const activeStep = steps[currentStep];

	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(164,194,165,0.24),_transparent_36%),linear-gradient(180deg,_#f7f7f1_0%,_#f1f2eb_100%)] px-4 py-10 text-[color:var(--color-charcoal)] sm:px-6 lg:px-8">
			<section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[28rem] items-center justify-center">
				<div className="w-full overflow-hidden rounded-[1.5rem] border border-[color:var(--color-dust-grey)] bg-white/94 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-10">
					<div className="mb-8 flex items-center justify-between gap-3">
						{steps.map((step, index) => {
							const isActive = index === currentStep;
							const isComplete = index < currentStep;

							return (
								<div
									key={step.title}
									className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
										isActive
											? "bg-[color:var(--color-muted-teal)] text-white"
											: isComplete
												? "bg-[color:var(--color-ebony)] text-white"
												: "bg-[color:var(--color-dust-grey)] text-white"
									}`}
								>
									{index + 1}
								</div>
							);
						})}
					</div>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							goToStep(currentStep + 1);
						}}
					>
						<div className="animate-[fadeIn_0.4s_ease-in-out]">
							<h1 className="mb-2 text-2xl font-semibold tracking-tight text-[color:var(--color-ebony)]">
								{activeStep.title}
							</h1>
							<p className="mb-6 text-sm leading-6 text-[color:var(--color-charcoal)]/85">
								{activeStep.description}
							</p>

							<div className="space-y-4 text-sm font-medium text-[color:var(--color-ebony)]">
								{activeStep.content}
							</div>
						</div>

						<div className="mt-8 flex gap-3">
							<button
								type="button"
								onClick={() => goToStep(currentStep - 1)}
								className="flex-1 rounded-xl bg-[color:var(--color-dust-grey)] px-4 py-3 font-semibold text-[color:var(--color-charcoal)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={currentStep === 0}
							>
								Back
							</button>

							<button
								type="submit"
								className="flex-1 rounded-xl bg-[color:var(--color-ebony)] px-4 py-3 font-semibold text-white transition-opacity hover:opacity-95"
							>
								{currentStep === steps.length - 1 ? "Submit" : "Next"}
							</button>
						</div>
					</form>
				</div>
			</section>
			<Footer />
		</main>
	);
}
