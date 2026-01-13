import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glow?: boolean;
  size?: "default" | "sm" | "lg" | "iconSm" | "icon";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
}

export function Button({
  glow = true,
  size = "default",
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  // Handle size variations
  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : size === "icon" || size === "iconSm"
      ? "p-2"
      : "px-4 py-2";

  // Handle color style variations
  const variantClasses =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground border border-border"
      : variant === "outline"
      ? "bg-transparent border border-border text-foreground"
      : variant === "ghost"
      ? "bg-transparent text-foreground hover:bg-muted"
      : variant === "destructive"
      ? "bg-destructive text-destructive-foreground"
      : "bg-primary text-primary-foreground"; // default primary

  return (
    <button
      {...props}
      className={`
        ${sizeClasses}
        ${variantClasses}
        rounded-md
        transition-all duration-300
        shadow-[0_0_10px_hsl(var(--glow))] 
        hover:shadow-[0_0_20px_hsl(var(--glow))] 
        focus:ring-2 focus:ring-ring
        ${glow ? "glow" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
