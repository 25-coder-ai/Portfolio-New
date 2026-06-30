import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color = "#4F8EF7", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono-custom",
        className
      )}
      style={{
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}
