import { Link } from "react-router";

const footerLinks = [
	{
		title: "Product",
		items: [
			{ label: "How it works", href: "#works" },
			{ label: "Features", href: "#features" },
			{ label: "Resources", href: "#resources" },
		],
	},
];

export const LenderOnboardingCard = () => {
	return (
		<section className="px-[10%] py-16">
			<div className="mx-auto max-w-7xl rounded-3xl border border-[color:var(--color-dust-grey)] bg-[linear-gradient(135deg,_rgba(164,194,165,0.16)_0%,_rgba(247,247,241,0.92)_52%,_#ffffff_100%)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-10">
				<div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div>
						<p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--color-muted-teal)]">
							For Lenders
						</p>
						<h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-ebony)] md:text-4xl">
							Onboard your lending business with Finny.
						</h2>
						<p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--color-charcoal)] md:text-base">
							List your products, manage borrower offers, and connect with users through a dedicated lender flow built for trust and clarity.
						</p>
					</div>

					<div className="rounded-[1.75rem] border border-[color:var(--color-dust-grey)] bg-white/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
						<div className="space-y-4">
							<div className="flex items-center gap-3 rounded-2xl bg-[color:var(--color-soft-linen)] px-4 py-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-muted-teal)] text-sm font-bold text-white">
									L
								</div>
								<div>
									<p className="text-sm font-semibold text-[color:var(--color-ebony)]">Business onboarding</p>
									<p className="text-xs text-[color:var(--color-charcoal)]/75">Business details, contacts, and product setup</p>
								</div>
							</div>

							<Link
								to="/lender-onboarding"
								className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--color-ebony)] px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
							>
								Start Lender Onboarding
							</Link>
							<p className="text-center text-xs text-[color:var(--color-charcoal)]/70">
								A separate onboarding flow for partner lenders and businesses.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};