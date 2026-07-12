import { Link, useNavigate } from "react-router";
import { LuBell, LuChevronDown, LuUserRound, LuSettings, LuLogOut } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    void logout().then(() => navigate("/login"));
  };

  return (
    <header className="w-full bg-background fixed top-0 left-0 flex items-center justify-center h-20 z-50">
      <div className="w-full mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-5 no-underline">
            <img src="/logo.svg" className="w-10 h-10 object-cover" />
            <h1 className="text-2xl font-semibold">finny</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <a href="#">Providers</a>
            <a href="#">Loan History</a>
            <a href="#">Providers</a>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-5">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LuBell className="h-5 w-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 pl-3 pr-1.5 py-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer">
                <LuChevronDown size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.full_name ?? "Account"}
                </span>
                <span className="bg-primary text-primary-foreground h-9 w-9 flex items-center justify-center rounded-full shrink-0">
                  <LuUserRound size={16} />
                </span>
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
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LuLogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
