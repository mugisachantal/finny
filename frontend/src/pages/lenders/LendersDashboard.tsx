import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "@/components/navbar";
import ApplicationsTab from "@/components/lenders/ApplicationsTab";
import DashboardTab from "@/components/lenders/DashboardTab";
import LoansTab from "@/components/lenders/LoansTab";

type TabId = "dashboard" | "applications" | "loans";

const navLinks: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "applications", label: "Applications" },
  { id: "loans", label: "Loans" },
];

const titles: Record<TabId, string> = {
  dashboard: "Dashboard",
  applications: "Applications",
  loans: "Loans",
};

const LendersDashboard = () => {
  const [active, setActive] = useState<TabId>("dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <div className="sticky top-20 z-40 border-b border-border bg-background px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {navLinks.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <main className="flex-1 p-8 overflow-auto pt-6">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-semibold text-foreground mb-6">
            {titles[active]}
          </h1>
          {active === "dashboard" && <DashboardTab />}
          {active === "applications" && <ApplicationsTab />}
          {active === "loans" && <LoansTab />}
        </div>
      </main>
    </div>
  );
};

export default LendersDashboard;
