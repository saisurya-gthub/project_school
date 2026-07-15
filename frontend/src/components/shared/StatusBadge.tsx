import { cn } from "@/utils/cn";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  approved: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  in_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  inactive: { bg: "bg-surface-100", text: "text-surface-600", dot: "bg-surface-400" },
  student: { bg: "bg-primary-50", text: "text-primary-700", dot: "bg-primary-500" },
  faculty: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  admin: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full capitalize",
        config.bg,
        config.text,
        sizeClasses[size]
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status.replace("_", " ")}
    </span>
  );
}
