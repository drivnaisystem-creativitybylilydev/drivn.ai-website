import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:ring-offset-2 focus:ring-offset-[#0A0B14]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#7C3AED]/20 text-[#c4b5fd] hover:bg-[#7C3AED]/30",
        secondary:
          "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
        outline: "border-white/20 text-white/90",
        accent:
          "border-[#f472b6]/40 bg-gradient-to-r from-[#7C3AED]/25 to-[#ec4899]/20 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
