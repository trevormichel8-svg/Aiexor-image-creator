"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glow?: boolean;
  size?: "default" | "sm" | "lg" | "iconSm" | "icon";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      glow = true,
      size = "default",
      variant = "primary",
      className = "",
      children,
      asChild = false,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const sizeClasses =
      size === "sm"
        ? "px-2 py-1 text-sm"
        : size === "lg"
        ? "px-6 py-3 text-lg"
        : size === "icon" || size === "iconSm"
        ? "p-2"
        : "px-4 py-2";

    const variantClasses =
      variant === "secondary"
        ? "bg-secondary text-secondary-foreground border border-border"
        : variant === "outline"
        ? "bg-transparent border border-border text-foreground hover:bg-muted"
        : variant === "ghost"
        ? "bg-transparent text-foreground hover:bg-muted"
        : variant === "destructive"
        ? "bg-destructive text-destructive-foreground"
        : variant === "link"
        ? "bg-transparent underline text-primary hover:text-secondary"
        : "bg-primary text-primary-foreground";

    const glowClasses = glow
      ? variant === "primary"
        ? "shadow-[0_0_10px_hsl(var(--glow))] hover:shadow-[0_0_20px_hsl(var(--glow))]"
        : variant === "secondary"
        ? "shadow-[0_0_6px_hsl(var(--glow)/0.6)] hover:shadow-[0_0_12px_hsl(var(--glow)/0.8)]"
        : variant === "outline" || variant === "ghost"
        ? "hover:shadow-[0_0_10px_hsl(var(--glow)/0.4)]"
        : variant === "destructive"
        ? "shadow-[0_0_8px_hsl(var(--destructive)/0.5)] hover:shadow-[0_0_16px_hsl(var(--destructive)/0.8)]"
        : ""
      : "";

    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed hover:shadow-none"
      : "";

    return (
      <Comp
        ref={ref}
        className={`
          ${sizeClasses}
          ${variantClasses}
          ${glowClasses}
          ${disabledClasses}
          rounded-md
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-ring
          ${className}
        `}
        type={type}
        disabled={disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
