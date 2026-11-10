import * as React from "react";

import { cn } from "./utils";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "gradientNavy" | "gradientTeal" | "gradientBlue" | "banner";
}

function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-card text-card-foreground border border-border shadow-xs",
    gradientNavy: "bg-gradient-ip-navy text-white border-0 shadow-md",
    gradientTeal: "bg-gradient-ip-teal text-white border-0 shadow-md",
    gradientBlue: "bg-gradient-ip-blue text-white border-0 shadow-md",
    banner: "bg-gradient-ip-banner text-[#194a64] border border-[#aee2ef]/50 shadow-xs",
  }[variant];

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-5 rounded-2xl transition-all duration-200",
        variantStyles,
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-tight font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
