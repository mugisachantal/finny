import { AdminSidebar } from "../../components/admin/admin-sidebar";
import { StatsCard } from "../../components/admin/stats-card";
import {
  LuBuilding2,
  LuUsers,
  LuShieldCheck,
  LuTriangleAlert,
  LuTrendingUp,
  LuClock,
  LuCircleCheckBig,
  LuChevronRight,
  LuArrowUpRight,
} from "react-icons/lu";

const pendingLenders = [
  {
    id: 1,
    name: "Centenary Bank",
    type: "Commercial Bank",
    submitted: "2 hours ago",
    riskLevel: "low",
  },
  {
    id: 2,
    name: "Stanbic Bank Uganda",
    type: "Commercial Bank",
    submitted: "5 hours ago",
    riskLevel: "low",
  },
  {
    id: 3,
    name: "MTN MoMo Loans",
    type: "Mobile Lender",
    submitted: "1 day ago",
    riskLevel: "medium",
  },
  {
    id: 4,
    name: "Airtel Money Lending",
    type: "Mobile Lender",
    submitted: "1 day ago",
    riskLevel: "medium",
  },
  {
    id: 5,
    name: "Opportunity Bank",
    type: "Microfinance",
    submitted: "2 days ago",
    riskLevel: "low",
  },
];

const recentActivity = [
  {
    action: "Lender verified",
    detail: "Kasente Finance approved",
    time: "10 min ago",
    type: "success",
  },
  {
    action: "Complaint resolved",
    detail: "Issue #1042 - Hidden fees reported",
    time: "25 min ago",
    type: "success",
  },
  {
    action: "New user registered",
    detail: "john.doe@email.com joined",
    time: "1 hour ago",
    type: "info",
  },
  {
    action: "Lender rejected",
    detail: "QuickCash application denied",
    time: "2 hours ago",
    type: "error",
  },
  {
    action: "Consent updated",
    detail: "User #8231 withdrew consent",
    time: "3 hours ago",
    type: "warning",
  },
  {
    action: "Loan offer sent",
    detail: "Fido → 15 users with consent",
    time: "4 hours ago",
    type: "info",
  },
  {
    action: "Affordability score flagged",
    detail: "User #5521 score below threshold",
    time: "5 hours ago",
    type: "warning",
  },
  {
    action: "System backup completed",
    detail: "Daily backup at 03:00 UTC",
    time: "6 hours ago",
    type: "success",
  },
];

const topLenders = [
  { name: "Kasente Finance", loans: 1243, approval: 94, status: "verified" },
  { name: "Quick Sente", loans: 987, approval: 89, status: "verified" },
  { name: "Fido", loans: 876, approval: 92, status: "verified" },
  { name: "Numida", loans: 654, approval: 87, status: "verified" },
  { name: "MTN MoMo", loans: 543, approval: 78, status: "pending" },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[color:var(--color-soft-linen)]">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[color:var(--color-ebony)]">
              Admin Dashboard
            </h1>
            <p className="text-[color:var(--color-charcoal)]/60 mt-1">
              Overview of platform activity and lender management
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatsCard
              title="Pending Approvals"
              value="12"
              change="+3 new today"
              changeType="up"
              icon={LuClock}
              iconBg="bg-amber-100"
            />
            <StatsCard
              title="Verified Lenders"
              value="48"
              change="+5 this month"
              changeType="up"
              icon={LuShieldCheck}
              iconBg="bg-emerald-100"
            />
            <StatsCard
              title="Total Users"
              value="12,847"
              change="+8.2%"
              changeType="up"
              icon={LuUsers}
              iconBg="bg-[color:var(--color-muted-teal)]/30"
            />
            <StatsCard
              title="Open Complaints"
              value="3"
              change="-2 from last week"
              changeType="down"
              icon={LuTriangleAlert}
              iconBg="bg-red-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--color-dust-grey)]">
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                    Pending Lender Approvals
                  </h2>
                  <p className="text-xs text-[color:var(--color-charcoal)]/50 mt-0.5">
                    Applications awaiting review
                  </p>
                </div>
                <a
                  href="/admin/lender-approvals"
                  className="text-sm font-medium text-[color:var(--color-ebony)] hover:text-[color:var(--color-muted-teal)] flex items-center space-x-1 transition-colors"
                >
                  <span>View All</span>
                  <LuChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="divide-y divide-[color:var(--color-dust-grey)]">
                {pendingLenders.map((lender) => (
                  <div
                    key={lender.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-[color:var(--color-soft-linen)]/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-[color:var(--color-ebony)]/10 flex items-center justify-center">
                        <LuBuilding2 className="w-5 h-5 text-[color:var(--color-ebony)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[color:var(--color-charcoal)]">
                          {lender.name}
                        </p>
                        <p className="text-xs text-[color:var(--color-charcoal)]/50">
                          {lender.type} • Submitted {lender.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          lender.riskLevel === "low"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {lender.riskLevel} risk
                      </span>
                      <a
                        href={`/admin/lender-approvals?id=${lender.id}`}
                        className="text-sm font-medium text-[color:var(--color-ebony)] hover:text-[color:var(--color-muted-teal)] transition-colors"
                      >
                        Review →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)]">
                <h2 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[color:var(--color-charcoal)]/50 mt-0.5">
                  Platform-wide events
                </p>
              </div>
              <div className="divide-y divide-[color:var(--color-dust-grey)] max-h-[420px] overflow-y-auto">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="px-6 py-3">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.type === "success"
                            ? "bg-emerald-500"
                            : activity.type === "error"
                              ? "bg-red-500"
                              : activity.type === "warning"
                                ? "bg-amber-500"
                                : "bg-[color:var(--color-muted-teal)]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[color:var(--color-charcoal)]">
                          {activity.action}
                        </p>
                        <p className="text-xs text-[color:var(--color-charcoal)]/50 truncate">
                          {activity.detail}
                        </p>
                      </div>
                      <span className="text-[10px] text-[color:var(--color-charcoal)]/40 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Top Lenders + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performing Lenders */}
            <div className="lg:col-span-2 bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--color-dust-grey)]">
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                    Top Performing Lenders
                  </h2>
                  <p className="text-xs text-[color:var(--color-charcoal)]/50 mt-0.5">
                    Ranked by total loan volume
                  </p>
                </div>
                <LuTrendingUp className="w-5 h-5 text-[color:var(--color-muted-teal)]" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)]">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Lender
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Total Loans
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Approval Rate
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-dust-grey)]">
                    {topLenders.map((lender, i) => (
                      <tr
                        key={i}
                        className="hover:bg-[color:var(--color-soft-linen)]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-[color:var(--color-charcoal)]/30">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-[color:var(--color-charcoal)]">
                              {lender.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[color:var(--color-charcoal)]">
                          {lender.loans.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-1.5 bg-[color:var(--color-dust-grey)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[color:var(--color-muted-teal)] rounded-full"
                                style={{ width: `${lender.approval}%` }}
                              />
                            </div>
                            <span className="text-sm text-[color:var(--color-charcoal)]">
                              {lender.approval}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              lender.status === "verified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {lender.status === "verified" ? (
                              <span className="flex items-center space-x-1">
                                <LuCircleCheckBig className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1">
                                <LuClock className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)]">
                <h2 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <a
                  href="/admin/lender-approvals"
                  className="flex items-center justify-between p-4 rounded-xl bg-[color:var(--color-ebony)] text-white hover:bg-[color:var(--color-ebony)]/90 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <LuShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Review Lenders</span>
                  </div>
                  <LuArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="/admin/users"
                  className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <LuUsers className="w-5 h-5 text-[color:var(--color-ebony)]" />
                    <span className="font-medium text-[color:var(--color-charcoal)]">
                      Manage Users
                    </span>
                  </div>
                  <LuArrowUpRight className="w-4 h-4 text-[color:var(--color-charcoal)]/30 group-hover:text-[color:var(--color-ebony)] transition-colors" />
                </a>
                <a
                  href="/admin/complaints"
                  className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <LuTriangleAlert className="w-5 h-5 text-[color:var(--color-ebony)]" />
                    <span className="font-medium text-[color:var(--color-charcoal)]">
                      View Complaints
                    </span>
                  </div>
                  <LuArrowUpRight className="w-4 h-4 text-[color:var(--color-charcoal)]/30 group-hover:text-[color:var(--color-ebony)] transition-colors" />
                </a>
                <a
                  href="/admin/activity"
                  className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <LuBuilding2 className="w-5 h-5 text-[color:var(--color-ebony)]" />
                    <span className="font-medium text-[color:var(--color-charcoal)]">
                      Platform Activity
                    </span>
                  </div>
                  <LuArrowUpRight className="w-4 h-4 text-[color:var(--color-charcoal)]/30 group-hover:text-[color:var(--color-ebony)] transition-colors" />
                </a>
              </div>

              {/* System Status */}
              <div className="px-6 pb-6">
                <div className="p-4 rounded-xl bg-[color:var(--color-muted-teal)]/10 border border-[color:var(--color-muted-teal)]/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-semibold text-[color:var(--color-ebony)]">
                      System Status
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[color:var(--color-charcoal)]/60">
                        API Response
                      </span>
                      <span className="font-medium text-emerald-600">
                        42ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[color:var(--color-charcoal)]/60">
                        Uptime
                      </span>
                      <span className="font-medium text-emerald-600">
                        99.98%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[color:var(--color-charcoal)]/60">
                        Active Sessions
                      </span>
                      <span className="font-medium text-[color:var(--color-charcoal)]">
                        1,247
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
