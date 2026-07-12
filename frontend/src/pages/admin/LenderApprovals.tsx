import { useState } from "react";
import { AdminSidebar } from "../../components/admin/admin-sidebar";
import {
  LuBuilding2,
  LuSearch,
  LuFilter,
  LuCircleCheckBig,
  LuCircleX,
  LuClock,
  LuEye,
  LuFileText,
  LuDownload,
  LuChevronDown,
  LuX,
  LuShieldCheck,
  LuTriangleAlert,
  LuMapPin,
  LuGlobe,
  LuPhone,
  LuMail,
  LuInfo,
} from "react-icons/lu";

type LenderStatus = "pending" | "approved" | "rejected" | "under_review";

interface LenderApplication {
  id: number;
  name: string;
  type: string;
  status: LenderStatus;
  submitted: string;
  riskLevel: "low" | "medium" | "high";
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  registrationNumber: string;
  licenseType: string;
  foundedYear: number;
  loanProducts: number;
  description: string;
  documents: string[];
}

const lenders: LenderApplication[] = [
  {
    id: 1,
    name: "Centenary Bank",
    type: "Commercial Bank",
    status: "pending",
    submitted: "2026-07-12T08:30:00",
    riskLevel: "low",
    contactPerson: "James Okello",
    email: "compliance@centenarybank.co.ug",
    phone: "+256 312 345 678",
    location: "Kampala, Uganda",
    website: "www.centenarybank.co.ug",
    registrationNumber: "UBL-2024-001",
    licenseType: "Tier 1 Commercial Bank",
    foundedYear: 1983,
    loanProducts: 15,
    description:
      "Centenary Bank is one of Uganda's largest commercial banks, serving over 2 million customers with a wide range of financial products including personal loans, SME financing, and agricultural credit.",
    documents: [
      "Business Registration Certificate",
      "BOU License",
      "Tax Compliance Certificate",
      "Audited Financial Statements",
    ],
  },
  {
    id: 2,
    name: "Stanbic Bank Uganda",
    type: "Commercial Bank",
    status: "pending",
    submitted: "2026-07-12T05:15:00",
    riskLevel: "low",
    contactPerson: "Sarah Namukasa",
    email: "partnerships@stanbicbank.co.ug",
    phone: "+256 312 456 789",
    location: "Kampala, Uganda",
    website: "www.stanbicbank.co.ug",
    registrationNumber: "UBL-2024-002",
    licenseType: "Tier 1 Commercial Bank",
    foundedYear: 1906,
    loanProducts: 22,
    description:
      "Stanbic Bank Uganda is part of the Standard Bank Group, Africa's largest financial institution. They offer comprehensive lending solutions including personal loans, mortgages, and corporate finance.",
    documents: [
      "Business Registration Certificate",
      "BOU License",
      "Tax Compliance Certificate",
      "Audited Financial Statements",
      "Data Protection Policy",
    ],
  },
  {
    id: 3,
    name: "MTN MoMo Loans",
    type: "Mobile Lender",
    status: "under_review",
    submitted: "2026-07-11T14:20:00",
    riskLevel: "medium",
    contactPerson: "David Mugisha",
    email: "momo.loans@mtn.co.ug",
    phone: "+256 772 123 456",
    location: "Kampala, Uganda",
    website: "www.mtn.co.ug",
    registrationNumber: "MTN-2024-015",
    licenseType: "Mobile Money Lender",
    foundedYear: 2020,
    loanProducts: 5,
    description:
      "MTN MoMo Loans provides instant micro-loans through the MTN Mobile Money platform, serving millions of Ugandans with quick, accessible credit solutions.",
    documents: [
      "Business Registration Certificate",
      "UCC License",
      "Tax Compliance Certificate",
    ],
  },
  {
    id: 4,
    name: "Airtel Money Lending",
    type: "Mobile Lender",
    status: "pending",
    submitted: "2026-07-11T10:45:00",
    riskLevel: "medium",
    contactPerson: "Grace Achieng",
    email: "lending@airtel.co.ug",
    phone: "+256 752 987 654",
    location: "Kampala, Uganda",
    website: "www.airtel.co.ug",
    registrationNumber: "ARL-2024-008",
    licenseType: "Mobile Money Lender",
    foundedYear: 2021,
    loanProducts: 3,
    description:
      "Airtel Money Lending offers short-term loans through Airtel Money, targeting underserved populations with affordable credit products and flexible repayment terms.",
    documents: [
      "Business Registration Certificate",
      "UCC License",
    ],
  },
  {
    id: 5,
    name: "Opportunity Bank",
    type: "Microfinance",
    status: "pending",
    submitted: "2026-07-10T16:30:00",
    riskLevel: "low",
    contactPerson: "Peter Ssemakula",
    email: "info@opportunitybank.co.ug",
    phone: "+256 312 567 890",
    location: "Mbale, Uganda",
    website: "www.opportunitybank.co.ug",
    registrationNumber: "MFB-2024-012",
    licenseType: "Tier 2 Microfinance Bank",
    foundedYear: 1995,
    loanProducts: 8,
    description:
      "Opportunity Bank Uganda is a microfinance institution focused on empowering small businesses and individuals in rural and peri-urban areas with accessible financial services.",
    documents: [
      "Business Registration Certificate",
      "BOU License",
      "Tax Compliance Certificate",
      "Audited Financial Statements",
    ],
  },
  {
    id: 6,
    name: "QuickCash Uganda",
    type: "Digital Lender",
    status: "rejected",
    submitted: "2026-07-08T09:00:00",
    riskLevel: "high",
    contactPerson: "Alex Tumwine",
    email: "admin@quickcash.ug",
    phone: "+256 701 456 789",
    location: "Kampala, Uganda",
    website: "www.quickcash.ug",
    registrationNumber: "DC-2024-088",
    licenseType: "Digital Credit Provider",
    foundedYear: 2024,
    loanProducts: 2,
    description:
      "QuickCash Uganda offers short-term digital loans through a mobile app targeting young professionals.",
    documents: [
      "Business Registration Certificate",
      "UCC License",
    ],
  },
  {
    id: 7,
    name: "Kasente Finance",
    type: "Digital Lender",
    status: "approved",
    submitted: "2026-07-01T11:20:00",
    riskLevel: "low",
    contactPerson: "Mary Nabirye",
    email: "compliance@kasente.co.ug",
    phone: "+256 782 345 678",
    location: "Kampala, Uganda",
    website: "www.kasente.co.ug",
    registrationNumber: "DC-2024-045",
    licenseType: "Digital Credit Provider",
    foundedYear: 2022,
    loanProducts: 4,
    description:
      "Kasente Finance provides mobile money loans for SMEs with transparent terms and AI-powered affordability checks.",
    documents: [
      "Business Registration Certificate",
      "UCC License",
      "Tax Compliance Certificate",
      "Audited Financial Statements",
      "Data Protection Policy",
      "Consumer Protection Policy",
    ],
  },
  {
    id: 8,
    name: "Fido",
    type: "Digital Lender",
    status: "approved",
    submitted: "2026-06-28T14:00:00",
    riskLevel: "low",
    contactPerson: "Daniel Ochieng",
    email: "partnerships@fido.co.ug",
    phone: "+256 753 234 567",
    location: "Kampala, Uganda",
    website: "www.fido.co.ug",
    registrationNumber: "DC-2024-033",
    licenseType: "Digital Credit Provider",
    foundedYear: 2023,
    loanProducts: 6,
    description:
      "Fido is a digital lending platform offering instant loans with transparent terms and real-time credit scoring.",
    documents: [
      "Business Registration Certificate",
      "UCC License",
      "Tax Compliance Certificate",
      "Data Protection Policy",
    ],
  },
];

const statusConfig: Record<
  LenderStatus,
  { label: string; color: string; icon: typeof LuClock }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: LuClock,
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: LuCircleCheckBig,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border border-red-200",
    icon: LuCircleX,
  },
  under_review: {
    label: "Under Review",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: LuEye,
  },
};

export default function LenderApprovals() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected" | "under_review"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLender, setSelectedLender] =
    useState<LenderApplication | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredLenders = lenders.filter((lender) => {
    const matchesTab =
      activeTab === "all" || lender.status === activeTab;
    const matchesSearch =
      lender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lender.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lender.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: lenders.length,
    pending: lenders.filter((l) => l.status === "pending").length,
    approved: lenders.filter((l) => l.status === "approved").length,
    rejected: lenders.filter((l) => l.status === "rejected").length,
    under_review: lenders.filter((l) => l.status === "under_review").length,
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
                Lender Approvals & Verification
              </h1>
              <p className="text-[color:var(--color-charcoal)]/60 mt-1">
                Review, verify, and manage lender applications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors text-sm font-medium">
                <LuDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-white border border-[color:var(--color-dust-grey)] rounded-xl p-1 mb-6 w-fit">
            {(
              ["all", "pending", "approved", "rejected", "under_review"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[color:var(--color-ebony)] text-white shadow-md"
                    : "text-[color:var(--color-charcoal)]/60 hover:bg-[color:var(--color-soft-linen)]"
                }`}
              >
                {tab === "under_review"
                  ? "Under Review"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-[color:var(--color-dust-grey)] text-[color:var(--color-charcoal)]/60"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-charcoal)]/40" />
              <input
                type="text"
                placeholder="Search lenders by name, type, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[color:var(--color-dust-grey)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)] focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-[color:var(--color-dust-grey)] bg-white hover:border-[color:var(--color-muted-teal)] transition-colors text-sm font-medium">
              <LuFilter className="w-4 h-4" />
              <span>Filters</span>
              <LuChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-6">
            {/* Lenders Table */}
            <div
              className={`bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden ${
                selectedLender ? "w-[55%]" : "w-full"
              } transition-all`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[color:var(--color-dust-grey)] bg-[color:var(--color-soft-linen)]">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Lender
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Risk
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-[color:var(--color-charcoal)]/60 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-dust-grey)]">
                    {filteredLenders.map((lender) => {
                      const StatusIcon = statusConfig[lender.status].icon;
                      return (
                        <tr
                          key={lender.id}
                          className={`hover:bg-[color:var(--color-soft-linen)]/50 transition-colors cursor-pointer ${
                            selectedLender?.id === lender.id
                              ? "bg-[color:var(--color-muted-teal)]/10"
                              : ""
                          }`}
                          onClick={() => setSelectedLender(lender)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-[color:var(--color-ebony)]/10 flex items-center justify-center">
                                <LuBuilding2 className="w-5 h-5 text-[color:var(--color-ebony)]" />
                              </div>
                              <div>
                                <p className="font-medium text-[color:var(--color-charcoal)]">
                                  {lender.name}
                                </p>
                                <p className="text-xs text-[color:var(--color-charcoal)]/50">
                                  {lender.contactPerson}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[color:var(--color-charcoal)]">
                            {lender.type}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                lender.riskLevel === "low"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : lender.riskLevel === "medium"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {lender.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center space-x-1 ${statusConfig[lender.status].color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusConfig[lender.status].label}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[color:var(--color-charcoal)]/60">
                            {new Date(lender.submitted).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLender(lender);
                              }}
                              className="text-sm font-medium text-[color:var(--color-ebony)] hover:text-[color:var(--color-muted-teal)] transition-colors"
                            >
                              <LuEye className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredLenders.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <LuBuilding2 className="w-12 h-12 text-[color:var(--color-charcoal)]/20 mx-auto mb-3" />
                  <p className="text-[color:var(--color-charcoal)]/50">
                    No lenders found matching your criteria
                  </p>
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedLender && (
              <div className="w-[45%] bg-white border border-[color:var(--color-dust-grey)] rounded-2xl overflow-hidden h-fit sticky top-8">
                <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)] flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                    Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedLender(null)}
                    className="w-8 h-8 rounded-lg hover:bg-[color:var(--color-soft-linen)] flex items-center justify-center transition-colors"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Lender Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-[color:var(--color-ebony)]/10 flex items-center justify-center flex-shrink-0">
                      <LuBuilding2 className="w-7 h-7 text-[color:var(--color-ebony)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[color:var(--color-ebony)]">
                        {selectedLender.name}
                      </h4>
                      <p className="text-sm text-[color:var(--color-charcoal)]/60">
                        {selectedLender.type}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[selectedLender.status].color}`}
                        >
                          {statusConfig[selectedLender.status].label}
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            selectedLender.riskLevel === "low"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : selectedLender.riskLevel === "medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {selectedLender.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-[color:var(--color-charcoal)]/70 leading-relaxed">
                      {selectedLender.description}
                    </p>
                  </div>

                  {/* Organization Details */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] flex items-center space-x-2">
                      <LuShieldCheck className="w-4 h-4" />
                      <span>Organization Details</span>
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                        <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">
                          Registration #
                        </p>
                        <p className="text-sm font-medium text-[color:var(--color-charcoal)]">
                          {selectedLender.registrationNumber}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                        <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">
                          License Type
                        </p>
                        <p className="text-sm font-medium text-[color:var(--color-charcoal)]">
                          {selectedLender.licenseType}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                        <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">
                          Founded
                        </p>
                        <p className="text-sm font-medium text-[color:var(--color-charcoal)]">
                          {selectedLender.foundedYear}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[color:var(--color-soft-linen)]">
                        <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-charcoal)]/50 mb-1">
                          Loan Products
                        </p>
                        <p className="text-sm font-medium text-[color:var(--color-charcoal)]">
                          {selectedLender.loanProducts}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] flex items-center space-x-2">
                      <LuPhone className="w-4 h-4" />
                      <span>Contact Information</span>
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <LuMail className="w-4 h-4 text-[color:var(--color-charcoal)]/40" />
                        <span className="text-[color:var(--color-charcoal)]">
                          {selectedLender.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <LuPhone className="w-4 h-4 text-[color:var(--color-charcoal)]/40" />
                        <span className="text-[color:var(--color-charcoal)]">
                          {selectedLender.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <LuMapPin className="w-4 h-4 text-[color:var(--color-charcoal)]/40" />
                        <span className="text-[color:var(--color-charcoal)]">
                          {selectedLender.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <LuGlobe className="w-4 h-4 text-[color:var(--color-charcoal)]/40" />
                        <span className="text-[color:var(--color-charcoal)]">
                          {selectedLender.website}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] flex items-center space-x-2">
                      <LuFileText className="w-4 h-4" />
                      <span>Submitted Documents</span>
                    </h5>
                    <div className="space-y-2">
                      {selectedLender.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--color-soft-linen)] border border-[color:var(--color-dust-grey)]"
                        >
                          <div className="flex items-center space-x-3">
                            <LuFileText className="w-4 h-4 text-[color:var(--color-ebony)]" />
                            <span className="text-sm text-[color:var(--color-charcoal)]">
                              {doc}
                            </span>
                          </div>
                          <button className="text-xs text-[color:var(--color-ebony)] hover:text-[color:var(--color-muted-teal)] font-medium">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Checklist */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-[color:var(--color-ebony)] flex items-center space-x-2">
                      <LuInfo className="w-4 h-4" />
                      <span>Compliance Checklist</span>
                    </h5>
                    <div className="space-y-2">
                      {[
                        "Business Registration Certificate",
                        "Financial Regulator License",
                        "Tax Compliance Certificate",
                        "Data Protection Policy",
                        "Consumer Protection Policy",
                        "Anti-Money Laundering Policy",
                      ].map((item, i) => {
                        const isUploaded = selectedLender.documents.some(
                          (d) =>
                            d.toLowerCase().includes(item.toLowerCase().slice(0, 8))
                        );
                        return (
                          <div
                            key={i}
                            className="flex items-center space-x-3 p-2"
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                isUploaded
                                  ? "bg-emerald-500 text-white"
                                  : "border-2 border-[color:var(--color-dust-grey)]"
                              }`}
                            >
                              {isUploaded && (
                                <LuCircleCheckBig className="w-3 h-3" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isUploaded
                                  ? "text-[color:var(--color-charcoal)]"
                                  : "text-[color:var(--color-charcoal)]/50"
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedLender.status === "pending" ||
                  selectedLender.status === "under_review" ? (
                    <div className="flex items-center space-x-3 pt-4 border-t border-[color:var(--color-dust-grey)]">
                      <button
                        onClick={() => {
                          alert(
                            `Lender "${selectedLender.name}" has been approved.`
                          );
                          setSelectedLender(null);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[color:var(--color-ebony)] text-white font-medium hover:bg-[color:var(--color-ebony)]/90 transition-colors"
                      >
                        <LuCircleCheckBig className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors"
                      >
                        <LuCircleX className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button className="flex items-center justify-center px-4 py-3 rounded-xl border border-[color:var(--color-dust-grey)] hover:border-[color:var(--color-muted-teal)] transition-colors">
                        <LuTriangleAlert className="w-4 h-4 text-[color:var(--color-charcoal)]/60" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-[color:var(--color-dust-grey)]">
                      <p className="text-sm text-[color:var(--color-charcoal)]/50 text-center">
                        This application has already been{" "}
                        <span className="font-medium">
                          {selectedLender.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[color:var(--color-dust-grey)] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[color:var(--color-ebony)]">
                Reject Application
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[color:var(--color-soft-linen)] flex items-center justify-center"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-[color:var(--color-charcoal)]/60 mb-4">
                Please provide a reason for rejecting this lender application.
                This will be included in the notification sent to the applicant.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-[color:var(--color-dust-grey)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-muted-teal)] resize-none"
              />
            </div>
            <div className="px-6 py-4 border-t border-[color:var(--color-dust-grey)] flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[color:var(--color-dust-grey)] text-sm font-medium hover:bg-[color:var(--color-soft-linen)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert("Please provide a rejection reason.");
                    return;
                  }
                  alert(
                    `Lender "${selectedLender?.name}" rejected. Reason: ${rejectReason}`
                  );
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedLender(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
