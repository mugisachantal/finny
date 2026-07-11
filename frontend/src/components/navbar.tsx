import { Link } from "react-router";
import { LuChevronDown, LuUserRound } from "react-icons/lu";

export const Navbar = () => {
  return (
    <header className="w-screen bg-background fixed top-0 left-0 flex items-center justify-center h-20 z-50">
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
          <div className="flex items-center space-x-4">
            <LuChevronDown />
            <span>Jerome</span>
            <button className="bg-primary text-white h-9 w-9 flex items-center justify-center rounded-full">
              <LuUserRound />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
