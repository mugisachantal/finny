import type { ComponentType } from "react";
import { LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconBg }: StatsCardProps) {
  return (
    <div className="bg-white border border-[color:var(--color-dust-grey)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-[color:var(--color-ebony)]" />
        </div>
        {changeType === "up" ? (
          <LuArrowUpRight className="w-4 h-4 text-emerald-500" />
        ) : changeType === "down" ? (
          <LuArrowDownRight className="w-4 h-4 text-red-500" />
        ) : null}
      </div>
      <p className="text-2xl font-bold text-[color:var(--color-ebony)] mb-1">{value}</p>
      <p className="text-sm text-[color:var(--color-charcoal)]/60 mb-2">{title}</p>
      <p
        className={`text-xs font-medium ${
          changeType === "up"
            ? "text-emerald-600"
            : changeType === "down"
              ? "text-red-500"
              : "text-[color:var(--color-charcoal)]/40"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
