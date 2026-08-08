import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-primary text-primary-foreground border border-primary-border",
  destructive: "bg-destructive text-destructive-foreground border border-destructive-border",
  outline: "border [border-color:var(--button-outline)] shadow-xs active:shadow-none",
  secondary: "border bg-secondary text-secondary-foreground border border-secondary-border",
  ghost: "border border-transparent",
};

const sizeStyles: Record<string, string> = {
  default: "min-h-9 px-4 py-2",
  sm: "min-h-8 rounded-md px-3 text-xs",
  lg: "min-h-10 rounded-md px-8",
  icon: "h-9 w-9 p-0 inline-flex items-center justify-center",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2";

    const computedClassName = cn(
      baseClasses,
      variantStyles[variant] || variantStyles.default,
      sizeStyles[size] || sizeStyles.default,
      className
    );

    return (
      <button className={computedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

