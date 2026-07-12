import { NavLink } from "react-router";
import {
  LuLayoutDashboard,
  LuBuilding2,
  LuUsers,
  LuMessageSquareWarning,
  LuActivity,
  LuSettings,
  LuShield,
} from "react-icons/lu";

const links = [
  { to: "/admin", label: "Dashboard", icon: LuLayoutDashboard, end: true },
  { to: "/admin/lender-approvals", label: "Lender Approvals", icon: LuBuilding2 },
  { to: "/admin/user-management", label: "User Management", icon: LuUsers },
  { to: "/admin/complaints", label: "Complaints", icon: LuMessageSquareWarning },
  { to: "/admin/platform-activity", label: "Platform Activity", icon: LuActivity },
  { to: "/admin/settings", label: "Settings", icon: LuSettings },
];

export function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[color:var(--color-ebony)] flex flex-col z-40">
      <div className="flex items-center space-x-2 px-6 py-5 border-b border-white/10">
        <LuShield className="w-6 h-6 text-[color:var(--color-muted-teal)]" />
        <span className="text-white font-bold text-lg tracking-tight">Finny Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/30">Finny Platform v1.0</p>
      </div>
    </aside>
  );
}
