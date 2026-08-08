import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantStyles: Record<string, string> = {
  default: "border-transparent bg-primary text-primary-foreground shadow-xs",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground shadow-xs",
  outline: "border [border-color:var(--badge-outline)] shadow-xs",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClasses =
    "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate";

  return (
    <div
      className={cn(baseClasses, variantStyles[variant] || variantStyles.default, className)}
      {...props}
    />
  );
}

export { Badge };

