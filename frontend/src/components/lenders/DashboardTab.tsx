import { useRef, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LuDownload, LuFileSpreadsheet, LuFileText, LuFileType } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportCSV,
  exportXLS,
  exportPDF,
  type DashboardData,
} from "@/lib/export";

const COLORS = {
  forest: "#3d5a3d",
  sage: "#7a9e7c",
  moss: "#8fb88a",
  terracotta: "#c49a6c",
  sand: "#d4c9a8",
  teal: "#a4c2a5",
  charcoal: "#4a4a48",
};

const kpis = [
  { label: "Total Loans Disbursed", value: "UGX 12.4M", sub: "342 loans" },
  { label: "Active Loans", value: "UGX 5.8M", sub: "148 active" },
  { label: "Loans Repaid", value: "UGX 5.1M", sub: "162 completed" },
  { label: "Default Rate", value: "4.7%", sub: "16 defaulted" },
];

const monthlyVolume = [
  { month: "Jan", disbursed: 1800000, repaid: 1200000 },
  { month: "Feb", disbursed: 2200000, repaid: 1600000 },
  { month: "Mar", disbursed: 1950000, repaid: 1400000 },
  { month: "Apr", disbursed: 2600000, repaid: 1900000 },
  { month: "May", disbursed: 2100000, repaid: 1700000 },
  { month: "Jun", disbursed: 1750000, repaid: 2000000 },
  { month: "Jul", disbursed: 2400000, repaid: 1850000 },
];

const repaymentStatus = [
  { name: "Paid", value: 162 },
  { name: "Active", value: 148 },
  { name: "Overdue", value: 16 },
  { name: "Pending", value: 16 },
];

const portfolioRanges = [
  { range: "< UGX 50k", count: 45 },
  { range: "UGX 50–150k", count: 98 },
  { range: "UGX 150–300k", count: 112 },
  { range: "UGX 300–500k", count: 58 },
  { range: "> UGX 500k", count: 29 },
];

const repaymentTrends = [
  { month: "Jan", expected: 1400000, actual: 1200000 },
  { month: "Feb", expected: 1700000, actual: 1600000 },
  { month: "Mar", expected: 1500000, actual: 1400000 },
  { month: "Apr", expected: 2000000, actual: 1900000 },
  { month: "May", expected: 1800000, actual: 1700000 },
  { month: "Jun", expected: 1600000, actual: 2000000 },
  { month: "Jul", expected: 1900000, actual: 1850000 },
];

const topBorrowers = [
  { name: "Amina Okafor", amount: 500000 },
  { name: "Ngozi Eze", amount: 420000 },
  { name: "Chukwu Emeka", amount: 380000 },
  { name: "Fatima Bello", amount: 350000 },
  { name: "Yusuf Abdullahi", amount: 310000 },
];

const fmt = (n: number) =>
  `UGX ${(n / 1000).toFixed(0)}k`;

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const ChartTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const dashboardData: DashboardData = {
  kpis,
  monthlyVolume,
  repaymentStatus,
  portfolioRanges,
  repaymentTrends,
  topBorrowers,
};

const DashboardTab = () => {
  const [exporting, setExporting] = useState(false);
  const chart0 = useRef<HTMLDivElement>(null);
  const chart1 = useRef<HTMLDivElement>(null);
  const chart2 = useRef<HTMLDivElement>(null);
  const chart3 = useRef<HTMLDivElement>(null);
  const chart4 = useRef<HTMLDivElement>(null);

  const handlePDF = async () => {
    setExporting(true);
    try {
      await exportPDF(dashboardData, [
        chart0.current,
        chart1.current,
        chart2.current,
        chart3.current,
        chart4.current,
      ]);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" disabled={exporting} />
            }
          >
            <LuDownload className="size-4 mr-1.5" />
            {exporting ? "Exporting…" : "Export"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportCSV(dashboardData)}>
              <LuFileText className="size-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportXLS(dashboardData)}>
              <LuFileSpreadsheet className="size-4" />
              Export as XLS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePDF}>
              <LuFileType className="size-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {kpi.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div ref={chart0} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Loan Volume Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyVolume}>
              <defs>
                <linearGradient id="gradDisbursed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.forest} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.forest} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRepaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={{ stroke: "#d8dad3" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="disbursed"
                name="Disbursed"
                stroke={COLORS.forest}
                fill="url(#gradDisbursed)"
                strokeWidth={2}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="repaid"
                name="Repaid"
                stroke={COLORS.teal}
                fill="url(#gradRepaid)"
                strokeWidth={2}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div ref={chart1} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Repayment Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repaymentStatus}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-out"
                stroke="none"
              >
                {repaymentStatus.map((_, i) => (
                  <Cell
                    key={i}
                    fill={[COLORS.forest, COLORS.sage, COLORS.terracotta, COLORS.sand][i]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #d8dad3",
                  background: "#f1f2eb",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div ref={chart2} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Portfolio by Amount
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" />
              <XAxis
                dataKey="range"
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={{ stroke: "#d8dad3" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="count"
                name="Loans"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {portfolioRanges.map((_, i) => (
                  <Cell key={i} fill={COLORS.sage} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div ref={chart3} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Monthly Repayment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={repaymentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={{ stroke: "#d8dad3" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fill: "#4a4a48", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
              />
              <Bar
                dataKey="expected"
                name="Expected"
                fill={COLORS.sand}
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="actual"
                name="Actual"
                fill={COLORS.forest}
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div ref={chart4} className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Top Borrowers
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topBorrowers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={fmt}
              tick={{ fill: "#4a4a48", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: "#4a4a48", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="amount"
              name="Loan Amount"
              radius={[0, 6, 6, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {topBorrowers.map((_, i) => (
                <Cell
                  key={i}
                  fill={[COLORS.forest, COLORS.sage, COLORS.moss, COLORS.teal, COLORS.sand][i]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardTab;
