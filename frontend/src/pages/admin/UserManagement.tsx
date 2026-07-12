import { useState } from "react";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import {
  LuSearch,
  LuUserRound,
  LuMail,
  LuPhone,
  LuCalendar,
  LuBan,
  LuCircleCheckBig,
  LuCircleX,
  LuEye,
  LuEllipsisVertical,
  LuDownload,
  LuUserPlus,
} from "react-icons/lu";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "borrower" | "lender_admin" | "admin";
  status: "active" | "suspended" | "pending_verification";
  joined: string;
  lastActive: string;
  consentGiven: boolean;
  loansApplied: number;
  complaintsFiled: number;
  location: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Jerome Mukasa",
    email: "jerome.mukasa@email.com",
    phone: "+256 701 234 567",
    role: "borrower",
    status: "active",
    joined: "2026-01-15",
    lastActive: "2026-07-12",
    consentGiven: true,
    loansApplied: 3,
    complaintsFiled: 0,
    location: "Kampala",
  },
  {
    id: 2,
    name: "Sarah Namukasa",
    email: "sarah.n@email.com",
    phone: "+256 782 345 678",
    role: "borrower",
    status: "active",
    joined: "2026-02-20",
    lastActive: "2026-07-11",
    consentGiven: false,
    loansApplied: 1,
    complaintsFiled: 1,
    location: "Entebbe",
  },
  {
    id: 3,
    name: "David Ochieng",
    email: "david.o@email.com",
    phone: "+256 753 456 789",
    role: "borrower",
    status: "suspended",
    joined: "2026-03-10",
    lastActive: "2026-06-15",
    consentGiven: true,
    loansApplied: 5,
    complaintsFiled: 2,
    location: "Jinja",
  },
  {
    id: 4,
    name: "Grace Achieng",
    email: "grace.a@email.com",
    phone: "+256 704 567 890",
    role: "borrower",
    status: "active",
    joined: "2026-04-05",
    lastActive: "2026-07-12",
    consentGiven: true,
    loansApplied: 2,
    complaintsFiled: 0,
    location: "Mbarara",
  },
  {
    id: 5,
    name: "Peter Ssemakula",
    email: "peter.s@email.com",
    phone: "+256 775 678 901",
    role: "borrower",
    status: "pending_verification",
    joined: "2026-07-10",
    lastActive: "2026-07-10",
    consentGiven: false,
    loansApplied: 0,
    complaintsFiled: 0,
    location: "Mbale",
  },
  {
    id: 6,
    name: "Alex Tumwine",
    email: "alex.t@email.com",
    phone: "+256 786 789 012",
    role: "borrower",
    status: "active",
    joined: "2026-05-18",
    lastActive: "2026-07-09",
    consentGiven: true,
    loansApplied: 4,
    complaintsFiled: 1,
    location: "Gulu",
  },
  {
    id: 7,
    name: "Mary Nabirye",
    email: "mary.n@kasente.co.ug",
    phone: "+256 707 890 123",
    role: "lender_admin",
    status: "active",
    joined: "2026-01-01",
    lastActive: "2026-07-12",
    consentGiven: false,
    loansApplied: 0,
    complaintsFiled: 0,
    location: "Kampala",
  },
  {
    id: 8,
    name: "James Okello",
    email: "james.o@centenarybank.co.ug",
    phone: "+256 718 901 234",
    role: "lender_admin",
    status: "active",
    joined: "2026-02-15",
    lastActive: "2026-07-12",
    consentGiven: false,
    loansApplied: 0,
    complaintsFiled: 0,
    location: "Kampala",
  },
  {
    id: 9,
    name: "Daniel Mugisha",
    email: "daniel.m@mtn.co.ug",
    phone: "+256 729 012 345",
    role: "lender_admin",
    status: "active",
    joined: "2026-03-20",
    lastActive: "2026-07-11",
    consentGiven: false,
    loansApplied: 0,
    complaintsFiled: 0,
    location: "Kampala",
  },
  {
    id: 10,
    name: "Fiona Atim",
    email: "fiona.a@email.com",
    phone: "+256 730 123 456",
    role: "borrower",
    status: "active",
    joined: "2026-06-01",
    lastActive: "2026-07-12",
    consentGiven: true,
    loansApplied: 1,
    complaintsFiled: 0,
    location: "Lira",
  },
];

const roleConfig = {
  borrower: { label: "Borrower", color: "bg-blue-50 text-blue-700 border border-blue-200" },
  lender_admin: { label: "Lender Admin", color: "bg-purple-50 text-purple-700 border border-purple-200" },
  admin: { label: "Admin", color: "bg-[color:var(--color-muted-teal)]/20 text-[color:var(--color-ebony)] border border-[color:var(--color-muted-teal)]/50" },
};

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  suspended: { label: "Suspended", color: "bg-red-50 text-red-700 border border-red-200" },
  pending_verification: { label: "Pending", color: "bg-amber-50 text-amber-700 border border-amber-200" },
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "borrower" | "lender_admin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesTab = activeTab === "all" || user.role === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    totalUsers: users.length,
    borrowers: users.filter((u) => u.role === "borrower").length,
    lenderAdmins: users.filter((u) => u.role === "lender_admin").length,
    activeUsers: users.filter((u) => u.status === "active").length,
  };

  return (
    <div className="flex min-h-screen bg-[color:var(--color-soft-linen)]">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--color-ebony)]">
                User Management
              </h1>
              <p className="text-[color:var(--color-charcoal)]/60 mt-1">
                Manage borrowers, lender administrators, and platform users
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors text-sm font-medium">
                <LuDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-ebony)] text-white hover:bg-[color:var(--color-ebony)]/90 transition-colors text-sm font-medium">
                <LuUserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-bold text-[color:var(--color-ebony)] mt-1">{stats.totalUsers}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Borrowers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.borrowers}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Lender Admins</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.lenderAdmins}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Active Users</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activeUsers}</p>
            </div>
          </div>

          {/* Tabs + Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-1 bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-1">
              {(["all", "borrower", "lender_admin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[color:var(--color-ebony)] text-white shadow-md"
                      : "text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                  }`}
                >
                  {tab === "all"
                    ? "All Users"
                    : tab === "lender_admin"
                      ? "Lender Admins"
                      : "Borrowers"}
                </button>
              ))}
            </div>
            <div className="relative w-80">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-charcoal)]/40" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)]"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Consent</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Loans</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Last Active</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-dust-grey)]">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-[color:var(--color-soft-linen)]/50 transition-colors cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-[color:var(--color-muted-teal)]/10" : ""
                      }`}
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-[color:var(--color-ebony)]/10 flex items-center justify-center">
                            <LuUserRound className="w-4 h-4 text-[color:var(--color-ebony)]" />
                          </div>
                          <div>
                            <p className="font-medium text-[color:var(--color-charcoal)]">{user.name}</p>
                            <p className="text-xs text-[color:var(--color-charcoal)]/50">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleConfig[user.role].color}`}>
                          {roleConfig[user.role].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[user.status].color}`}>
                          {statusConfig[user.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.consentGiven ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-medium">
                            <LuCircleCheckBig className="w-3.5 h-3.5" />
                            <span>Given</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-[color:var(--color-charcoal)]/40">
                            <LuCircleX className="w-3.5 h-3.5" />
                            <span>None</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[color:var(--color-charcoal)]">{user.loansApplied}</td>
                      <td className="px-6 py-4 text-sm text-[color:var(--color-charcoal)]/60">{user.lastActive}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-[color:var(--color-soft-linen)] flex items-center justify-center transition-colors"
                          >
                            <LuEye className="w-4 h-4 text-[color:var(--color-charcoal)]/50" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg hover:bg-[color:var(--color-soft-linen)] flex items-center justify-center transition-colors"
                          >
                            <LuEllipsisVertical className="w-4 h-4 text-[color:var(--color-charcoal)]/50" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Side Panel */}
          {selectedUser && (
            <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-[color:var(--color-dust-grey)] z-50 shadow-2xl overflow-y-auto">
              <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)] flex items-center justify-between">
                <h3 className="font-semibold text-[color:var(--color-ebony)]">User Details</h3>
                <button onClick={() => setSelectedUser(null)} className="text-[color:var(--color-charcoal)]/50 hover:text-[color:var(--color-charcoal)]">
                  <LuCircleX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[color:var(--color-ebony)]/10 flex items-center justify-center mx-auto mb-3">
                    <LuUserRound className="w-8 h-8 text-[color:var(--color-ebony)]" />
                  </div>
                  <h4 className="text-lg font-bold text-[color:var(--color-ebony)]">{selectedUser.name}</h4>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleConfig[selectedUser.role].color}`}>
                      {roleConfig[selectedUser.role].label}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[selectedUser.status].color}`}>
                      {statusConfig[selectedUser.status].label}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm"><LuMail className="w-4 h-4 text-[color:var(--color-charcoal)]/40" /><span>{selectedUser.email}</span></div>
                  <div className="flex items-center space-x-3 text-sm"><LuPhone className="w-4 h-4 text-[color:var(--color-charcoal)]/40" /><span>{selectedUser.phone}</span></div>
                  <div className="flex items-center space-x-3 text-sm"><LuCalendar className="w-4 h-4 text-[color:var(--color-charcoal)]/40" /><span>Joined {selectedUser.joined}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)] text-center">
                    <p className="text-2xl font-bold text-[color:var(--color-ebony)]">{selectedUser.loansApplied}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50">Loans Applied</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)] text-center">
                    <p className="text-2xl font-bold text-[color:var(--color-ebony)]">{selectedUser.complaintsFiled}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50">Complaints</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-[color:var(--color-ebony)]">Consent Status</h5>
                  <div className={`p-3 rounded-lg border ${selectedUser.consentGiven ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                    <p className={`text-sm font-medium ${selectedUser.consentGiven ? "text-emerald-700" : "text-amber-700"}`}>
                      {selectedUser.consentGiven ? "Consent Given — Lenders may send offers" : "No Consent — Lenders cannot send offers"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[color:var(--color-dust-grey)]">
                  {selectedUser.status === "active" ? (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors text-sm">
                      <LuBan className="w-4 h-4" />
                      <span>Suspend User</span>
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[color:var(--color-ebony)] text-white font-medium hover:bg-[color:var(--color-ebony)]/90 transition-colors text-sm">
                      <LuCircleCheckBig className="w-4 h-4" />
                      <span>Reactivate User</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
