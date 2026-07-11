import { useState } from "react";
import { Link } from "react-router";

const features = [
  {
    title: "Consent Control",
    description:
      "Choose which lenders can reach you with offers. Block unsolicited messages instantly and take back control of your inbox.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="14" cy="14" r="11" />
        <polyline points="9 14 12 17 19 10" />
      </svg>
    ),
    bg: "bg-brand-sage",
    textColor: "text-white",
    linkColor: "text-white/80",
  },
  {
    title: "Affordability Check",
    description:
      "Our AI evaluates whether a loan fits your real financial situation — keeping your personal data fully private throughout the process.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="22" height="18" rx="3" />
        <line x1="3" y1="12" x2="25" y2="12" />
        <line x1="8" y1="17" x2="14" y2="17" />
      </svg>
    ),
    bg: "bg-brand-forest",
    textColor: "text-white",
    linkColor: "text-white/80",
  },
  {
    title: "Transparent Pricing",
    description:
      "See the full picture — total cost, interest, fees, and repayment schedule — before you accept any loan offer. No hidden surprises.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="14" cy="14" r="11" />
        <line x1="14" y1="8" x2="14" y2="20" />
        <line x1="10" y1="11" x2="18" y2="11" />
        <line x1="10" y1="17" x2="18" y2="17" />
      </svg>
    ),
    bg: "bg-brand-sand",
    textColor: "text-charcoal",
    linkColor: "text-ebony",
  },
  {
    title: "Early Warning Alerts",
    description:
      "We monitor signs of over-indebtedness across your borrowing activity and alert you early — before small debts become serious problems.",
    icon: (
      <svg
        className="h-7 w-7"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 4 L24 22 L4 22 Z" />
        <line x1="14" y1="12" x2="14" y2="16" />
        <circle cx="14" cy="19" r="0.5" fill="currentColor" />
      </svg>
    ),
    bg: "bg-brand-terracotta",
    textColor: "text-white",
    linkColor: "text-white/80",
  },
];

const stats = [
  { value: "4.8★", label: "User rating on the Play Store" },
  { value: "50K+", label: "Users protected across Uganda" },
  { value: "100+", label: "Partner lenders connected" },
  { value: "100%", label: "Free to use, always" },
];

const steps = [
  {
    number: "01",
    title: "Set your consent",
    description:
      "Tell Finny which lenders can reach you. Block the rest instantly — takes less than 30 seconds.",
  },
  {
    number: "02",
    title: "Check affordability",
    description:
      "Our AI reviews any loan offer against your real financial situation before you accept, keeping your data private.",
  },
  {
    number: "03",
    title: "Stay protected",
    description:
      "Get early warnings about over-indebtedness and transparent pricing breakdowns on every offer you receive.",
  },
];

const whyFinny = [
  {
    pain: "Unsolicited loan offers flooding your phone daily",
    solution: "You choose exactly who can contact you — block the rest",
  },
  {
    pain: "Hidden fees and unclear repayment terms",
    solution: "Full cost breakdown displayed before you accept any offer",
  },
  {
    pain: "Borrowing more than you can realistically repay",
    solution: "AI-powered affordability checks based on your actual finances",
  },
  {
    pain: "No warning signs until debt becomes overwhelming",
    solution: "Real-time alerts that catch problems before they spiral",
  },
  {
    pain: "Personal data shared with lenders without your knowledge",
    solution:
      "Bank-level encryption — your data is never shared without consent",
  },
];

const faqs = [
  {
    question: "What is Finny?",
    answer:
      "Finny is an AI-powered financial protection tool designed to safeguard Ugandans from high-cost digital loans. It gives you control over which lenders can contact you, checks whether you can truly afford a loan, and provides early warnings about over-indebtedness.",
  },
  {
    question: "Is Finny free to use?",
    answer:
      "Yes, Finny is completely free for all users. There are no hidden charges, subscription fees, or premium tiers. We partner with licensed lenders to provide this service at no cost to you.",
  },
  {
    question: "How does consent control work?",
    answer:
      "When you sign up, you can specify which lenders are allowed to send you loan offers. Any lender not on your approved list is automatically blocked from reaching you. You can update your preferences at any time.",
  },
  {
    question: "Does Finny share my data with lenders?",
    answer:
      "No. Your personal and financial data is encrypted and stored securely. We never share your information with any third party without your explicit consent. Lenders only receive a simple yes/no affordability result — never your raw data.",
  },
  {
    question: "How does the affordability check work?",
    answer:
      "Our AI analyses your financial situation privately on your device. When a lender sends you an offer, Finny evaluates whether the loan terms are manageable for you and displays a clear affordability indicator — all without exposing your personal details to the lender.",
  },
  {
    question: "Which lenders does Finny work with?",
    answer:
      "Finny is connected with over 100 licensed digital lenders operating in Uganda. We continuously on-board new partners to expand your options while ensuring they meet our standards for transparent and fair lending.",
  },
  {
    question: "What if I'm already in debt?",
    answer:
      "Finny's early warning system monitors your borrowing patterns and alerts you when signs of over-indebtedness appear. It helps you manage existing obligations and avoid taking on additional high-cost debt that could make your situation worse.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply download the Finny app, create your free account, and set your consent preferences. The entire setup takes less than 2 minutes. Once configured, you're immediately protected from unsolicited loan offers.",
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-soft-linen text-charcoal">
      {/* Announcement Bar */}
      <div className="bg-ebony px-6 py-2 text-xs font-medium text-soft-linen">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Protecting you from unsolicited loans</span>
          <span className="hidden sm:inline">
            +256 200 911 882 | Kampala, Uganda
          </span>
        </div>
      </div>

      {/* Header / Nav — navbar layout */}
      <header className="w-screen bg-background sticky top-0 flex items-center justify-center h-20 z-50">
        <div className="w-full mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link to="/" className="flex items-center space-x-5 no-underline">
              <img src="/logo.svg" className="w-10 h-10 object-cover" />
              <h1 className="text-2xl font-semibold">finny</h1>
            </Link>
            <nav className="flex items-center space-x-6">
              {[
                ["Home", "#hero"],
                ["How it Works", "#works"],
                ["Features", "#features"],
                ["FAQ", "#faq"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm font-medium text-charcoal no-underline transition-colors hover:text-muted-teal"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center justify-end space-x-5">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-ebony no-underline md:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center rounded-xl bg-ebony px-5 text-sm font-semibold text-soft-linen no-underline transition-colors hover:bg-[#4a563c]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — pain-point driven */}
      <section id="hero" className="px-6">
        <div className="mx-auto max-w-7xl items-center gap-12 flex justify-between h-[90vh]">
          {/* Left: copy */}
          <div className="w-1/2">
            <div className="mb-5 inline-flex rounded-full bg-muted-teal/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ebony">
              AI-Powered Protection
            </div>
            <h1 className="mb-6 text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-ebony md:text-5xl lg:text-[3.5rem]">
              Tired of loan offers you
              <br />
              <span className="text-muted-teal">never asked for?</span>
            </h1>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-charcoal/80 md:text-lg">
              Finny puts you back in control. Choose which lenders can reach
              you, check if you can truly afford any offer, and get early
              warnings before debt becomes a problem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex h-11 items-center rounded-xl bg-ebony px-7 text-sm font-semibold text-soft-linen no-underline transition-colors hover:bg-[#4a563c]"
              >
                Get Started Free
              </Link>
              <a
                href="#works"
                className="inline-flex h-11 items-center rounded-xl border border-dust-grey bg-soft-linen px-7 text-sm font-semibold text-ebony no-underline transition-colors hover:border-muted-teal"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/60">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-teal" />
                Trusted by 50,000+ Ugandans
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-teal" />
                100% free to use
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-teal" />
                Your data stays private
              </span>
            </div>
          </div>

          {/* Right: illustration card — phone notification concept */}
          <div className="w-1/2 h-full">
            <img
              src="/hero.png"
              alt="hero"
              className="w-auto h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features — enriched cards with icons */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              Features
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] text-ebony md:text-4xl">
              Everything you need to borrow safely
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`${feature.bg} ${feature.textColor} rounded-3xl p-8 md:p-10`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
                <p className="mb-6 text-sm leading-relaxed opacity-90">
                  {feature.description}
                </p>
                <a
                  href="#works"
                  className={`text-sm font-semibold ${feature.linkColor} no-underline`}
                >
                  Learn more
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Finny — pain point vs. solution differentiation */}
      <section className="bg-surface-warm px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              Why Finny
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] text-ebony md:text-4xl">
              Digital lending in Uganda is broken.
              <br />
              Finny fixes it.
            </h2>
          </div>
          <div className="space-y-4">
            {whyFinny.map((item) => (
              <div
                key={item.pain}
                className="grid gap-4 rounded-2xl bg-surface-card p-6 md:grid-cols-2 md:gap-8"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-brand-terracotta" />
                  <p className="text-sm leading-relaxed text-charcoal/60">
                    {item.pain}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-muted-teal" />
                  <p className="text-sm font-medium leading-relaxed text-ebony">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — refined */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="rounded-2xl bg-surface-card p-6">
              <p className="mb-1 text-2xl font-semibold tracking-[-0.02em] text-ebony">
                {stat.value}
              </p>
              <p className="text-sm text-charcoal/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — enhanced */}
      <section id="works" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              How it works
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] text-ebony md:text-4xl">
              Safer loans start with better visibility
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
              Get set up in under 2 minutes — no paperwork, no waiting.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="space-y-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted-teal/20 text-sm font-bold text-ebony">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold text-ebony">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-charcoal/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ebony no-underline transition-colors hover:text-muted-teal"
            >
              Ready to get started?
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="8" x2="13" y2="8" />
                <polyline points="9 4 13 8 9 12" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Resources + Contact — improved */}
      <section id="resources" className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-surface-card p-8 md:p-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              Resources
            </p>
            <h2 className="mb-3 text-2xl font-semibold tracking-[-0.01em] text-ebony">
              Practical guidance for smarter borrowing
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-charcoal/70">
              Everything you need to navigate digital lending with confidence.
            </p>
            <ul className="mb-6 space-y-3 text-sm text-charcoal/70">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1 w-1 rounded-full bg-muted-teal" />
                How to evaluate loan offers before accepting
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1 w-1 rounded-full bg-muted-teal" />
                Understanding your rights as a borrower in Uganda
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1 w-1 rounded-full bg-muted-teal" />
                Tips to avoid common debt traps
              </li>
            </ul>
            <a
              href="#"
              className="text-sm font-semibold text-ebony no-underline"
            >
              Explore resources
            </a>
          </div>
          <div id="contact" className="rounded-3xl bg-surface-card p-8 md:p-10">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              Contact
            </p>
            <h2 className="mb-3 text-2xl font-semibold tracking-[-0.01em] text-ebony">
              Get in touch with Finny
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-charcoal/70">
              Questions, feedback, or partnership inquiries — we'd love to hear
              from you.
            </p>
            <div className="space-y-2 text-sm text-charcoal/70">
              <p>+256 200 911 882</p>
              <p>hello@finny.ug</p>
              <p>Kampala, Uganda</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-ebony px-8 py-16 text-center md:px-16 md:py-20">
          <h2 className="mb-4 text-3xl font-medium tracking-[-0.02em] text-soft-linen md:text-4xl">
            Start protecting your finances today
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-soft-linen/70">
            Join thousands of Ugandans who use Finny to take control of their
            borrowing. Free to use, always.
          </p>
          <Link
            to="/signup"
            className="inline-flex h-11 items-center rounded-xl bg-muted-teal px-7 text-sm font-semibold text-ebony no-underline transition-colors hover:bg-[#93b594]"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* FAQ — accordion */}
      <section id="faq" className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-teal">
              FAQ
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] text-ebony md:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="rounded-2xl bg-surface-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ebony">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-4 w-4 flex-shrink-0 text-charcoal/50 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4 6 8 10 12 6" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-charcoal/70">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dust-grey bg-surface-warm px-6 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="mb-4 flex items-center gap-2 no-underline"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted-teal">
                  <div className="relative h-[18px] w-[12px] rounded-[50%_50%_50%_50%/_10%_10%_90%_90%] border-[1.5px] border-white after:absolute after:left-0 after:right-0 after:top-[4px] after:h-px after:bg-white after:shadow-[0_4px_0_0_white,0_8px_0_0_white] after:content-['']" />
                </div>
                <span className="text-lg font-extrabold tracking-[-0.06em] text-ebony">
                  FINNY
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-charcoal/60">
                Your AI-powered shield against high-cost digital loans.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-ebony">Product</h4>
              <ul className="space-y-2.5 text-sm text-charcoal/60">
                <li>
                  <a href="#features" className="no-underline hover:text-ebony">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#works" className="no-underline hover:text-ebony">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="no-underline hover:text-ebony">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-ebony">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm text-charcoal/60">
                <li>
                  <a
                    href="#resources"
                    className="no-underline hover:text-ebony"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-ebony">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#faq" className="no-underline hover:text-ebony">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-ebony">Company</h4>
              <ul className="space-y-2.5 text-sm text-charcoal/60">
                <li>
                  <a href="#contact" className="no-underline hover:text-ebony">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-ebony">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="no-underline hover:text-ebony">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-dust-grey pt-8 text-xs text-charcoal/50 sm:flex-row">
            <span>
              &copy; {new Date().getFullYear()} Finny. All rights reserved.
            </span>
            <div className="flex gap-4">
              <a href="#" className="no-underline hover:text-ebony">
                Privacy
              </a>
              <a href="#" className="no-underline hover:text-ebony">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
