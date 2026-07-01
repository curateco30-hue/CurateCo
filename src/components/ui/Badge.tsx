import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "suspended"
  | "new"
  | "brand_accepted"
  | "awaiting_pickup"
  | "picked_up"
  | "delivered"
  | "cancelled"
  | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
}

const statusClasses: Record<BadgeStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  new: "bg-blue-50 text-blue-700 border-blue-200",
  brand_accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  awaiting_pickup: "bg-amber-50 text-amber-700 border-amber-200",
  picked_up: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-beige text-text-secondary border-border",
};

const statusLabels: Record<BadgeStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  suspended: "Suspended",
  new: "New",
  brand_accepted: "Brand Accepted",
  awaiting_pickup: "Awaiting Pickup",
  picked_up: "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
  neutral: "—",
};

function Badge({ status = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
        statusClasses[status],
        className,
      )}
      {...props}
    >
      {children ?? statusLabels[status]}
    </span>
  );
}

export { Badge };
