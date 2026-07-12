import { useState } from "react";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import {
  LuActivity,
  LuSearch,
  LuRefreshCw,
  LuShield,
  LuUsers,
  LuTriangleAlert,
  LuTrendingUp,
  LuChartBar,
  LuDownload,
} from "react-icons/lu";

type ActivityType = "auth" | "loan" | "consent" | "complaint" | "system" | "admin";

interface ActivityEvent {
  id: number;
  type: ActivityType;
  action: string;
  detail: string;
  user: string;
  userType: "borrower" | "lender_admin" | "system" | "admin";
  timestamp: string;
  ipAddress?: string;
  severity: "info" | "warning" | "error" | "success";
}

const activityEvents: ActivityEvent[] = [
  {
    id: 1,
    type: "admin",
    action: "Lender verified",
    detail: "Kasente Finance application approved",
    user: "Admin User",
    userType: "admin",
    timestamp: "2026-07-12T10:30:00",
    ipAddress: "192.168.1.100",
    severity: "success",
  },
  {
    id: 2,
    type: "auth",
    action: "User login",
    detail: "Successful login from new device",
    user: "Jerome Mukasa",
    userType: "borrower",
    timestamp: "2026-07-12T10:25:00",
    ipAddress: "10.0.0.45",
    severity: "info",
  },
  {
    id: 3,
    type: "consent",
    action: "Consent withdrawn",
    detail: "User withdrew consent for loan offers from all lenders",
    user: "Sarah Namukasa",
    userType: "borrower",
    timestamp: "2026-07-12T10:20:00",
    severity: "warning",
  },
  {
    id: 4,
    type: "loan",
    action: "Loan offer sent",
    detail: "Fido sent loan offers to 15 users with active consent",
    user: "Fido",
    userType: "lender_admin",
    timestamp: "2026-07-12T10:15:00",
    severity: "info",
  },
  {
    id: 5,
    type: "complaint",
    action: "Complaint filed",
    detail: "Hidden fees complaint against Quick Sente",
    user: "Jerome Mukasa",
    userType: "borrower",
    timestamp: "2026-07-12T10:10:00",
    severity: "warning",
  },
  {
    id: 6,
    type: "system",
    action: "System backup completed",
    detail: "Daily automated backup at 03:00 UTC - 2.3GB",
    user: "System",
    userType: "system",
    timestamp: "2026-07-12T03:00:00",
    severity: "success",
  },
  {
    id: 7,
    type: "auth",
    action: "Failed login attempt",
    detail: "3 failed attempts from unrecognized IP",
    user: "unknown@email.com",
    userType: "borrower",
    timestamp: "2026-07-12T02:45:00",
    ipAddress: "203.45.67.89",
    severity: "error",
  },
  {
    id: 8,
    type: "loan",
    action: "Loan application submitted",
    detail: "New loan application for UGX 1,000,000",
    user: "David Ochieng",
    userType: "borrower",
    timestamp: "2026-07-12T01:30:00",
    severity: "info",
  },
  {
    id: 9,
    type: "admin",
    action: "User suspended",
    detail: "Account suspended due to fraud investigation",
    user: "David Ochieng",
    userType: "admin",
    timestamp: "2026-07-11T18:00:00",
    severity: "error",
  },
  {
    id: 10,
    type: "consent",
    action: "Consent given",
    detail: "User gave consent to 3 verified lenders",
    user: "Grace Achieng",
    userType: "borrower",
    timestamp: "2026-07-11T16:30:00",
    severity: "success",
  },
  {
    id: 11,
    type: "system",
    action: "API rate limit triggered",
    detail: "Lender API exceeded 1000 requests/min threshold",
    user: "MTN MoMo Loans",
    userType: "lender_admin",
    timestamp: "2026-07-11T15:00:00",
    severity: "warning",
  },
  {
    id: 12,
    type: "loan",
    action: "Loan disbursed",
    detail: "UGX 500,000 disbursed via Mobile Money",
    user: "Alex Tumwine",
    userType: "borrower",
    timestamp: "2026-07-11T14:00:00",
    severity: "success",
  },
  {
    id: 13,
    type: "admin",
    action: "Lender rejected",
    detail: "QuickCash application denied - insufficient documentation",
    user: "Admin User",
    userType: "admin",
    timestamp: "2026-07-11T12:00:00",
    severity: "error",
  },
  {
    id: 14,
    type: "auth",
    action: "Password reset requested",
    detail: "Password reset email sent",
    user: "Fiona Atim",
    userType: "borrower",
    timestamp: "2026-07-11T11:00:00",
    severity: "info",
  },
];

const typeConfig: Record<ActivityType, { label: string; color: string; icon: typeof LuShield }> = {
  auth: { label: "Authentication", color: "bg-blue-100 text-blue-700", icon: LuShield },
  loan: { label: "Loan Activity", color: "bg-emerald-100 text-emerald-700", icon: LuTrendingUp },
  consent: { label: "Consent", color: "bg-purple-100 text-purple-700", icon: LuUsers },
  complaint: { label: "Complaint", color: "bg-amber-100 text-amber-700", icon: LuTriangleAlert },
  system: { label: "System", color: "bg-gray-100 text-gray-700", icon: LuActivity },
  admin: { label: "Admin Action", color: "bg-[color:var(--color-muted-teal)]/20 text-[color:var(--color-ebony)]", icon: LuChartBar },
};

const severityConfig = {
  info: "border-l-blue-400",
  warning: "border-l-amber-400",
  error: "border-l-red-400",
  success: "border-l-emerald-400",
};

export default function PlatformActivity() {
  const [activeFilter, setActiveFilter] = useState<ActivityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = activityEvents.filter((event) => {
    const matchesFilter = activeFilter === "all" || event.type === activeFilter;
    const matchesSearch =
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalEvents: activityEvents.length,
    todayEvents: activityEvents.filter((e) => e.timestamp.startsWith("2026-07-12")).length,
    warnings: activityEvents.filter((e) => e.severity === "warning").length,
    errors: activityEvents.filter((e) => e.severity === "error").length,
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
                Platform Activity
              </h1>
              <p className="text-[color:var(--color-charcoal)]/60 mt-1">
                Monitor all platform events, logins, and system activity
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors text-sm font-medium">
                <LuRefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors text-sm font-medium">
                <LuDownload className="w-4 h-4" />
                <span>Export Logs</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Total Events</p>
              <p className="text-2xl font-bold text-[color:var(--color-ebony)] mt-1">{stats.totalEvents}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Today</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.todayEvents}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Warnings</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.warnings}</p>
            </div>
            <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-4">
              <p className="text-xs text-[color:var(--color-charcoal)]/50 uppercase tracking-wider">Errors</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.errors}</p>
            </div>
          </div>

          {/* Filter Chips + Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 flex-wrap">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === "all"
                    ? "bg-[color:var(--color-ebony)] text-white"
                    : "bg-white border border-[color:var(--color-dust-grey)] text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                }`}
              >
                All Events
              </button>
              {(Object.keys(typeConfig) as ActivityType[]).map((type) => {
                const config = typeConfig[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
                      activeFilter === type
                        ? "bg-[color:var(--color-ebony)] text-white"
                        : "bg-white border border-[color:var(--color-dust-grey)] text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                    }`}
                  >
                    <config.icon className="w-3 h-3" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative w-72">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-charcoal)]/40" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)]"
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[color:var(--color-ebony)]">Activity Timeline</h2>
                <p className="text-xs text-[color:var(--color-charcoal)]/50 mt-0.5">
                  {filteredEvents.length} events found
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs text-[color:var(--color-charcoal)]/50">
                <span className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-blue-400" /><span>Info</span></span>
                <span className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span>Warning</span></span>
                <span className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span>Error</span></span>
                <span className="flex items-center space-x-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span>Success</span></span>
              </div>
            </div>

            <div className="divide-y divide-[color:var(--color-dust-grey)]">
              {filteredEvents.map((event) => {
                const typeCfg = typeConfig[event.type];
                return (
                  <div
                    key={event.id}
                    className={`px-6 py-4 border-l-4 ${severityConfig[event.severity]} hover:bg-[color:var(--color-soft-linen)]/30 transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-9 h-9 rounded-lg ${typeCfg.color} flex items-center justify-center flex-shrink-0`}>
                          <typeCfg.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                              {event.action}
                            </p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeCfg.color}`}>
                              {typeCfg.label}
                            </span>
                          </div>
                          <p className="text-sm text-[color:var(--color-charcoal)]/60 mt-0.5">
                            {event.detail}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-[color:var(--color-charcoal)]/40">
                            <span>{event.user}</span>
                            {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-[color:var(--color-charcoal)]/50">
                          {new Date(event.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-[color:var(--color-charcoal)]/40">
                          {new Date(event.timestamp).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="px-6 py-12 text-center">
                <LuActivity className="w-12 h-12 text-[color:var(--color-charcoal)]/20 mx-auto mb-3" />
                <p className="text-[color:var(--color-charcoal)]/50">No activity events found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-[color:var(--color-dust-grey)] flex items-center justify-between text-xs text-[color:var(--color-charcoal)]/50">
              <span>Showing {filteredEvents.length} of {activityEvents.length} events</span>
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1.5 rounded-lg border border-[color:var(--color-dust-grey)] hover:bg-[color:var(--color-soft-linen)] transition-colors">Previous</button>
                <button className="px-3 py-1.5 rounded-lg bg-[color:var(--color-ebony)] text-white">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-[color:var(--color-dust-grey)] hover:bg-[color:var(--color-soft-linen)] transition-colors">2</button>
                <button className="px-3 py-1.5 rounded-lg border border-[color:var(--color-dust-grey)] hover:bg-[color:var(--color-soft-linen)] transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
