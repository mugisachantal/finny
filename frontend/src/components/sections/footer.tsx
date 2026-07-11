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
	{
		title: "Company",
		items: [
			{ label: "About Finny", href: "#hero" },
			{ label: "Lender Onboarding", href: "/lender-onboarding" },
			{ label: "Contact", href: "#contact" },
			{ label: "Support", href: "mailto:support@finny.ug" },
		],
	},
	{
		title: "Legal",
		items: [
			{ label: "Terms & Conditions", href: "#" },
			{ label: "Privacy Policy", href: "#" },
			{ label: "Cookie Policy", href: "#" },
		],
	},
];

export const Footer = () => {
	return (
		<footer className="border-t border-[color:var(--color-dust-grey)] bg-[linear-gradient(180deg,_rgba(247,247,241,0.8)_0%,_#f1f2eb_100%)] px-[10%] py-14 text-[color:var(--color-charcoal)]">
			<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_1fr]">
				<div className="max-w-md">
					<Link to="/" className="inline-flex items-center gap-3 text-decoration-none">
						<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-muted-teal)]">
							<div className="relative h-[22px] w-[14px] rounded-[50%_50%_50%_50%/_10%_10%_90%_90%] border-2 border-white after:absolute after:left-0 after:right-0 after:top-[5px] after:h-px after:bg-white after:content-[''] after:shadow-[0_5px_0_0_white,0_10px_0_0_white]" />
						</div>
						<div className="text-[22px] font-extrabold tracking-[-0.06em] text-[color:var(--color-ebony)]">
							FINNY
						</div>
					</Link>

					<p className="mt-5 text-sm leading-6 text-[color:var(--color-charcoal)]/90">
						Finny helps you stay protected from unsolicited loans with consent control,
						affordability checks, and early warning alerts.
					</p>

					<div className="mt-6 rounded-2xl border border-[color:var(--color-dust-grey)] bg-white/80 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-muted-teal)]">
							Contact
						</p>
						<p className="mt-2 text-sm text-[color:var(--color-charcoal)]">
							Kampala, Uganda
						</p>
						<p className="text-sm text-[color:var(--color-charcoal)]">
							+256 200 911 882
						</p>
						<p className="text-sm text-[color:var(--color-charcoal)]">
							support@finny.ug
						</p>
					</div>
				</div>

				<div className="grid gap-8 sm:grid-cols-3">
					{footerLinks.map((group) => (
						<div key={group.title}>
							<h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--color-ebony)]">
								{group.title}
							</h2>
							<ul className="mt-4 space-y-3 text-sm text-[color:var(--color-charcoal)]/90">
								{group.items.map((item) => (
									<li key={item.label}>
										<a
											href={item.href}
											className="transition-colors hover:text-[color:var(--color-muted-teal)] hover:underline"
										>
											{item.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-[color:var(--color-dust-grey)] pt-6 text-sm text-[color:var(--color-charcoal)]/80 sm:flex-row sm:items-center sm:justify-between">
				<p>© 2026 Finny. All rights reserved.</p>
				<div className="flex flex-wrap gap-4">
					<a className="transition-colors hover:text-[color:var(--color-muted-teal)]" href="#hero">
						Back to top
					</a>
					<a className="transition-colors hover:text-[color:var(--color-muted-teal)]" href="mailto:support@finny.ug">
						Support
					</a>
				</div>
			</div>
		</footer>
	);
};
