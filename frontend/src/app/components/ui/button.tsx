import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#1f4563] shadow-xs active:translate-y-[0.5px]",
        navy: "bg-[#265275] text-white hover:bg-[#1e4361] shadow-xs active:translate-y-[0.5px]",
        cyan: "bg-[#2eb4d6] text-white hover:bg-[#259ebc] shadow-xs active:translate-y-[0.5px]",
        banner: "bg-gradient-to-r from-[#c0ecf7] to-[#e4f7fc] text-[#1c5573] hover:from-[#b1e5f2] hover:to-[#d8f2f9] border border-[#aee1ee]/40 shadow-xs",
        navPill: "bg-white text-[#205c80] shadow-sm font-semibold hover:bg-white/95",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground shadow-2xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#d6ecf3]",
        ghost:
          "hover:bg-secondary/60 hover:text-foreground",
        link: "text-[#265275] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9.5 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 text-base has-[>svg]:px-4",
        icon: "size-9.5 rounded-xl",
        pill: "h-10 px-6 rounded-full text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
