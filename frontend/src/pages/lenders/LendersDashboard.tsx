import { useState } from "react";
import {
  LuChevronDown,
  LuUserRound,
  LuSettings,
  LuLogOut,
  LuSearch,
  LuBell,
} from "react-icons/lu";
import ApplicationsTab from "@/components/lenders/ApplicationsTab";
import DashboardTab from "@/components/lenders/DashboardTab";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-center border-b border-border bg-background px-6 py-3">
        <div className="flex items-center justify-between w-full max-w-7xl">
          <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" className="w-8 h-8 shrink-0" />
            <h1 className="text-xl font-semibold text-foreground">finny</h1>
          </div>

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
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors cursor-pointer">
            <LuSearch size={18} />
          </button>
          <button className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors cursor-pointer">
            <LuBell size={18} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 pl-3 pr-1.5 py-1.5 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer outline-none">
              <LuChevronDown size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">John Doe</span>
              <button className="bg-primary text-primary-foreground h-9 w-9 flex items-center justify-center rounded-full">
                <LuUserRound size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuItem>
                <LuUserRound size={16} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LuSettings size={16} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LuLogOut size={16} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </header>

      <main className="flex-1 bg-background p-8 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-semibold text-foreground mb-6">
            {titles[active]}
          </h1>
          {active === "dashboard" && <DashboardTab />}
          {active === "applications" && <ApplicationsTab />}
        </div>
      </main>
    </div>
  );
};

export default LendersDashboard;
