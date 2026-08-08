import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative inline-block group">{children}</div>
);

const TooltipTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  )
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }
>(({ className, children, sideOffset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md pointer-events-none whitespace-nowrap",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

