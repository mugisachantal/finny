import { Link } from "react-router";
import { Footer } from "../components/sections/footer";
import { LenderOnboardingCard } from "../components/sections/LenderOnboardingCard";

const features = [
	{
		marker: "C",
		title: "Consent Control",
		description: "You choose who can send you loan offers. No unwanted or unsolicited loan offers.",
	},
	{
		marker: "A",
		title: "Affordability Check",
		description: "AI checks if you can really afford a loan while keeping your data private.",
	},
	{
		marker: "P",
		title: "Transparent Pricing",
		description: "Understand the total cost, interest, fees and repayment before you accept.",
	},
	{
		marker: "W",
		title: "Early Warning Alerts",
		description: "We detect signs of over-indebtedness and alert you early to protect your future.",
	},
];

const stats = [
	{
		marker: "T",
		title: "Trusted Protection",
		description: "Your financial safety is our top priority",
	},
	{
		marker: "50K+",
		title: "Users Protected",
		description: "People using the platform",
	},
	{
		marker: "100+",
		title: "Partners & Lenders",
		description: "Connected institutions",
	},
	{
		marker: "S",
		title: "Bank-Level Security",
		description: "Your data is always encrypted",
	},
];

export default function Landing() {
	return (
		<main className="min-h-screen bg-white text-[color:var(--color-charcoal)]">
			<div className="bg-[color:var(--color-ebony)] px-[10%] py-2 text-xs font-medium text-[color:var(--color-soft-linen)]">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
					<span>Protecting you from unsolicited loans</span>
					<span>+256 200 911 882 | Kampala, Uganda</span>
				</div>
			</div>

			<header className="sticky top-0 z-20 border-b border-[color:var(--color-dust-grey)] bg-white/95 px-[10%] py-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
					<Link to="/" className="flex items-center gap-3 text-decoration-none">
						<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-muted-teal)]">
							<div className="h-[22px] w-[14px] rounded-[50%_50%_50%_50%/_10%_10%_90%_90%] border-2 border-white relative after:absolute after:left-0 after:right-0 after:top-[5px] after:h-px after:bg-white after:shadow-[0_5px_0_0_white,0_10px_0_0_white] after:content-['']" />
						</div>
						<div className="text-[22px] font-extrabold tracking-[-0.06em] text-[color:var(--color-ebony)]">
							FINNY
						</div>
					</Link>

					<nav className="hidden items-center gap-8 lg:flex">
						<a className="text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-muted-teal)]" href="#hero">
							Home
						</a>
						<a className="text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-muted-teal)]" href="#works">
							How it Works
						</a>
						<a className="text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-muted-teal)]" href="#features">
							Features
						</a>
						<a className="text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-muted-teal)]" href="#resources">
							Resources
						</a>
						<a className="text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:text-[color:var(--color-muted-teal)]" href="#contact">
							Contact
						</a>
					</nav>

					<button
						type="button"
						aria-label="Search"
						className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-dust-grey)] text-sm font-semibold text-[color:var(--color-ebony)] transition-colors hover:border-[color:var(--color-muted-teal)] hover:bg-[color:var(--color-soft-linen)]"
					>
						S
					</button>
				</div>
			</header>

			<section
				id="hero"
				className="flex min-h-[600px] items-center bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('https://images.unsplash.com/photo-1556742049-04ffbd67921d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center px-[10%] text-white"
			>
				<div className="mx-auto w-full max-w-7xl py-20">
					<div className="max-w-3xl">
						<div className="mb-4 inline-flex rounded-full bg-[rgba(164,194,165,0.9)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ebony)]">
							AI-Powered Protection
						</div>
						<h1 className="mb-5 text-5xl font-bold leading-[1.1] md:text-[3.5rem]">
							Protecting You from <span className="text-[color:var(--color-muted-teal)]">High-Cost</span> Digital Loans
						</h1>
						<p className="mb-8 max-w-2xl text-lg text-white/90">
							Finny empowers you with consent control, affordability checks, and early warnings to keep you financially safe.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link
								to="/signup"
								className="inline-flex rounded-md bg-[color:var(--color-ebony)] px-9 py-4 font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
							>
								Get Started
							</Link>
							<a
								href="#features"
								className="inline-flex rounded-md border-2 border-white px-9 py-4 font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
							>
								Learn More
							</a>
						</div>
					</div>
				</div>
			</section>

			<LenderOnboardingCard />

			<section id="features" className="bg-[color:var(--color-soft-linen)] px-[10%] py-20">
				<div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
					{features.map((feature) => (
						<article
							key={feature.title}
							className="rounded-2xl bg-white p-8 shadow-[0_5px_20px_rgba(0,0,0,0.03)] transition-transform duration-200 hover:-translate-y-2"
						>
							<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-soft-linen)] text-sm font-bold text-[color:var(--color-ebony)]">
								{feature.marker}
							</div>
							<h2 className="mb-4 text-lg font-semibold text-[color:var(--color-ebony)]">
								{feature.title}
							</h2>
							<p className="mb-5 text-sm leading-6 text-[color:var(--color-charcoal)]">
								{feature.description}
							</p>
							<a className="text-sm font-bold text-[color:var(--color-muted-teal)] no-underline" href="#contact">
								Learn more
							</a>
						</article>
					))}
				</div>
			</section>

			<section className="bg-[color:var(--color-ebony)] px-[10%] py-10 text-white">
				<div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.title} className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-[color:var(--color-muted-teal)]">
								{stat.marker}
							</div>
							<div>
								<b className="block text-lg font-bold">{stat.title}</b>
								<span className="text-xs text-white/80">{stat.description}</span>
							</div>
						</div>
					))}
				</div>
			</section>

			<section id="works" className="px-[10%] py-16">
				<div className="mx-auto max-w-7xl rounded-3xl border border-[color:var(--color-dust-grey)] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
					<div className="grid gap-8 md:grid-cols-3">
						<div>
							<p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--color-muted-teal)]">
								How it works
							</p>
							<h2 className="text-3xl font-semibold text-[color:var(--color-ebony)]">
								Safer loans start with better visibility.
							</h2>
						</div>
						<div className="space-y-3 text-sm leading-6 text-[color:var(--color-charcoal)] md:col-span-2">
							<p>
								We help you review lender behavior, protect your consent, and keep an eye on total borrowing cost before you accept any offer.
							</p>
							<p>
								The result is a simpler, calmer experience that makes risky offers easier to spot and easier to avoid.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="resources" className="px-[10%] pb-16">
				<div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
					<div className="rounded-3xl bg-[color:var(--color-soft-linen)] p-8">
						<h2 className="mb-3 text-2xl font-semibold text-[color:var(--color-ebony)]">Resources</h2>
						<p className="text-sm leading-6 text-[color:var(--color-charcoal)]">
							Practical guidance for borrowers, consent controls, and affordability checks.
						</p>
					</div>
					<div id="contact" className="rounded-3xl bg-[color:var(--color-soft-linen)] p-8">
						<h2 className="mb-3 text-2xl font-semibold text-[color:var(--color-ebony)]">Contact</h2>
						<p className="text-sm leading-6 text-[color:var(--color-charcoal)]">
							Reach the Finny team through the contact details in the top bar.
						</p>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
}
