import { useState } from "react";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import {
  LuMessageSquareWarning,
  LuSearch,
  LuCircleCheckBig,
  LuClock,
  LuTriangleAlert,
  LuUser,
  LuBuilding2,
  LuCalendar,
  LuMessageSquare,
  LuPaperclip,
} from "react-icons/lu";

type ComplaintStatus = "open" | "in_progress" | "resolved" | "escalated";
type ComplaintCategory = "hidden_fees" | "unsolicited_loans" | "harassment" | "data_misuse" | "other";

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  filedBy: string;
  filedByType: "borrower" | "lender";
  against: string;
  againstType: "borrower" | "lender";
  filedDate: string;
  lastUpdated: string;
  priority: "low" | "medium" | "high" | "urgent";
  messages: { sender: string; text: string; time: string }[];
}

const complaints: Complaint[] = [
  {
    id: 1,
    title: "Hidden fees charged on loan disbursement",
    description:
      "I was charged a 5% processing fee that was not disclosed during the loan application. The lender only showed the principal amount and interest rate. This additional fee was deducted from my loan disbursement without prior notice.",
    category: "hidden_fees",
    status: "open",
    filedBy: "Jerome Mukasa",
    filedByType: "borrower",
    against: "Quick Sente",
    againstType: "lender",
    filedDate: "2026-07-11",
    lastUpdated: "2026-07-11",
    priority: "high",
    messages: [
      {
        sender: "Jerome Mukasa",
        text: "I applied for a UGX 500,000 loan but only received UGX 475,000. The lender said it was a 'processing fee' but this was never mentioned in the loan terms.",
        time: "2026-07-11 14:30",
      },
    ],
  },
  {
    id: 2,
    title: "Unsolicited loan offers after withdrawing consent",
    description:
      "I withdrew my consent for loan offers on the platform but I am still receiving SMS and phone calls from this lender offering me loans. This is a violation of my privacy and consent preferences.",
    category: "unsolicited_loans",
    status: "in_progress",
    filedBy: "Sarah Namukasa",
    filedByType: "borrower",
    against: "MTN MoMo Loans",
    againstType: "lender",
    filedDate: "2026-07-08",
    lastUpdated: "2026-07-10",
    priority: "urgent",
    messages: [
      {
        sender: "Sarah Namukasa",
        text: "I withdrew consent on July 5th but received 3 SMS offers from MTN MoMo on July 7th and 8th.",
        time: "2026-07-08 09:15",
      },
      {
        sender: "Admin",
        text: "We are investigating this matter. The lender has been notified.",
        time: "2026-07-10 11:00",
      },
    ],
  },
  {
    id: 3,
    title: "Harassment by debt collection agents",
    description:
      "The lender's debt collection agents have been calling my family members and colleagues about my loan repayment. They are using threatening language and sharing my loan details with people not involved in my financial matters.",
    category: "harassment",
    status: "escalated",
    filedBy: "David Ochieng",
    filedByType: "borrower",
    against: "QuickCash Uganda",
    againstType: "lender",
    filedDate: "2026-07-05",
    lastUpdated: "2026-07-11",
    priority: "urgent",
    messages: [
      {
        sender: "David Ochieng",
        text: "My mother received a call saying I owe money and they want her to pay. They also called my employer. This is unacceptable.",
        time: "2026-07-05 16:45",
      },
      {
        sender: "Admin",
        text: "This has been escalated to our legal team. The lender's practices are under investigation.",
        time: "2026-07-06 10:00",
      },
      {
        sender: "Admin",
        text: "QuickCash Uganda has been issued a formal warning. Further violations may result in license suspension.",
        time: "2026-07-11 14:30",
      },
    ],
  },
  {
    id: 4,
    title: "Affordability score not reflected in loan terms",
    description:
      "The platform showed my affordability score as low-risk but the lender offered me a loan with extremely high interest rates (45% p.a.) that doesn't align with the affordability assessment shown on Finny.",
    category: "other",
    status: "open",
    filedBy: "Grace Achieng",
    filedByType: "borrower",
    against: "Airtel Money Lending",
    againstType: "lender",
    filedDate: "2026-07-10",
    lastUpdated: "2026-07-10",
    priority: "medium",
    messages: [
      {
        sender: "Grace Achieng",
        text: "Finny showed my affordability score as good, but the lender offered 45% interest. Something doesn't add up.",
        time: "2026-07-10 08:20",
      },
    ],
  },
  {
    id: 5,
    title: "Unauthorized data sharing with third parties",
    description:
      "I noticed that after applying for a loan through the platform, I started receiving marketing calls from other companies that I never applied to. My data seems to have been shared without my explicit consent.",
    category: "data_misuse",
    status: "in_progress",
    filedBy: "Alex Tumwine",
    filedByType: "borrower",
    against: "Numida",
    againstType: "lender",
    filedDate: "2026-07-07",
    lastUpdated: "2026-07-09",
    priority: "high",
    messages: [
      {
        sender: "Alex Tumwine",
        text: "I applied to Numida on July 3rd. Since July 5th, I've received calls from at least 5 different companies offering services I never inquired about.",
        time: "2026-07-07 11:30",
      },
      {
        sender: "Admin",
        text: "We are conducting an audit of data sharing practices. Numida has been asked to provide their data processing records.",
        time: "2026-07-09 09:15",
      },
    ],
  },
];

const categoryConfig: Record<ComplaintCategory, { label: string; color: string }> = {
  hidden_fees: { label: "Hidden Fees", color: "bg-amber-50 text-amber-700 border border-amber-200" },
  unsolicited_loans: { label: "Unsolicited Loans", color: "bg-orange-50 text-orange-700 border border-orange-200" },
  harassment: { label: "Harassment", color: "bg-red-50 text-red-700 border border-red-200" },
  data_misuse: { label: "Data Misuse", color: "bg-purple-50 text-purple-700 border border-purple-200" },
  other: { label: "Other", color: "bg-gray-50 text-gray-700 border border-gray-200" },
};

const statusConfig: Record<ComplaintStatus, { label: string; color: string; icon: typeof LuClock }> = {
  open: { label: "Open", color: "bg-blue-50 text-blue-700 border border-blue-200", icon: LuClock },
  in_progress: { label: "In Progress", color: "bg-amber-50 text-amber-700 border border-amber-200", icon: LuClock },
  resolved: { label: "Resolved", color: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: LuCircleCheckBig },
  escalated: { label: "Escalated", color: "bg-red-50 text-red-700 border border-red-200", icon: LuTriangleAlert },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
};

export default function ComplaintsReview() {
  const [activeTab, setActiveTab] = useState<"all" | ComplaintStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredComplaints = complaints.filter((c) => {
    const matchesTab = activeTab === "all" || c.status === activeTab;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.filedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.against.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    in_progress: complaints.filter((c) => c.status === "in_progress").length,
    escalated: complaints.filter((c) => c.status === "escalated").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
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
                Complaints Review
              </h1>
              <p className="text-[color:var(--color-charcoal)]/60 mt-1">
                Manage and resolve user complaints about lending practices
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-1 mb-6 w-fit">
            {(["all", "open", "in_progress", "escalated", "resolved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[color:var(--color-ebony)] text-white shadow-md"
                    : "text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                }`}
              >
                {tab === "in_progress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-[color:var(--color-dust-grey)] text-[color:var(--color-charcoal)]/60"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md mb-6">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-charcoal)]/40" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)]"
            />
          </div>

          <div className="flex gap-6">
            {/* Complaints List */}
            <div className={`${selectedComplaint ? "w-[50%]" : "w-full"} space-y-3 transition-all`}>
              {filteredComplaints.map((complaint) => {
                const StatusIcon = statusConfig[complaint.status].icon;
                return (
                  <div
                    key={complaint.id}
                    onClick={() => setSelectedComplaint(complaint)}
                    className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md ${
                      selectedComplaint?.id === complaint.id
                        ? "border-[color:var(--color-muted-teal)] ring-1 ring-[color:var(--color-muted-teal)]/30"
                        : "border-[color:var(--color-dust-grey)]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${priorityConfig[complaint.priority].color}`}>
                            {priorityConfig[complaint.priority].label}
                          </span>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryConfig[complaint.category].color}`}>
                            {categoryConfig[complaint.category].label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[color:var(--color-charcoal)] mt-2">
                          {complaint.title}
                        </h3>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center space-x-1 ${statusConfig[complaint.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig[complaint.status].label}</span>
                      </span>
                    </div>

                    <p className="text-sm text-[color:var(--color-charcoal)]/60 line-clamp-2 mb-3">
                      {complaint.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-[color:var(--color-charcoal)]/50">
                      <span className="flex items-center space-x-1">
                        <LuUser className="w-3 h-3" />
                        <span>By {complaint.filedBy}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <LuBuilding2 className="w-3 h-3" />
                        <span>Against {complaint.against}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <LuCalendar className="w-3 h-3" />
                        <span>{complaint.filedDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <LuMessageSquare className="w-3 h-3" />
                        <span>{complaint.messages.length} messages</span>
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredComplaints.length === 0 && (
                <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-12 text-center">
                  <LuMessageSquareWarning className="w-12 h-12 text-[color:var(--color-charcoal)]/20 mx-auto mb-3" />
                  <p className="text-[color:var(--color-charcoal)]/50">No complaints found</p>
                </div>
              )}
            </div>

            {/* Complaint Detail */}
            {selectedComplaint && (
              <div className="w-[50%] bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden h-fit sticky top-8">
                <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)]">
                  <h3 className="font-semibold text-[color:var(--color-ebony)]">Complaint Details</h3>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {/* Header */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${priorityConfig[selectedComplaint.priority].color}`}>
                        {priorityConfig[selectedComplaint.priority].label} Priority
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig[selectedComplaint.status].color}`}>
                        {statusConfig[selectedComplaint.status].label}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryConfig[selectedComplaint.category].color}`}>
                        {categoryConfig[selectedComplaint.category].label}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[color:var(--color-charcoal)] mt-3">
                      {selectedComplaint.title}
                    </h4>
                  </div>

                  {/* Parties */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">Filed By</p>
                      <p className="text-sm font-medium">{selectedComplaint.filedBy}</p>
                      <p className="text-xs text-[color:var(--color-charcoal)]/50 capitalize">{selectedComplaint.filedByType}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                      <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">Against</p>
                      <p className="text-sm font-medium">{selectedComplaint.against}</p>
                      <p className="text-xs text-[color:var(--color-charcoal)]/50 capitalize">{selectedComplaint.againstType}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] mb-2">Description</h5>
                    <p className="text-sm text-[color:var(--color-charcoal)]/70 leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] mb-3">Timeline</h5>
                    <div className="space-y-3">
                      {selectedComplaint.messages.map((msg, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.sender === "Admin" ? "bg-[color:var(--color-muted-teal)]" : "bg-[color:var(--color-ebony)]/30"}`} />
                          <div className="flex-1 p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[color:var(--color-charcoal)]">{msg.sender}</span>
                              <span className="text-[10px] text-[color:var(--color-charcoal)]/40">{msg.time}</span>
                            </div>
                            <p className="text-sm text-[color:var(--color-charcoal)]/70">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Box */}
                  <div className="pt-4 border-t border-[color:var(--color-dust-grey)]">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full h-20 px-4 py-3 rounded-xl border border-[color:var(--color-dust-grey)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)] resize-none mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-2 text-sm text-[color:var(--color-charcoal)]/50 hover:text-[color:var(--color-charcoal)]">
                        <LuPaperclip className="w-4 h-4" />
                        <span>Attach</span>
                      </button>
                      <div className="flex items-center space-x-3">
                        {selectedComplaint.status !== "resolved" && (
                          <>
                            <button
                              onClick={() => alert("Complaint marked as In Progress")}
                              className="px-4 py-2 rounded-xl border border-[color:var(--color-dust-grey)] text-sm font-medium hover:bg-[color:var(--color-soft-linen)] transition-colors"
                            >
                              Mark In Progress
                            </button>
                            <button
                              onClick={() => alert("Complaint resolved")}
                              className="px-4 py-2 rounded-xl bg-[color:var(--color-ebony)] text-white text-sm font-medium hover:bg-[color:var(--color-ebony)]/90 transition-colors flex items-center space-x-2"
                            >
                              <LuCircleCheckBig className="w-4 h-4" />
                              <span>Resolve</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
