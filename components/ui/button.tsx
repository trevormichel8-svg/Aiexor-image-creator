import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glow?: boolean;
  size?: "default" | "sm" | "lg" | "iconSm" | "icon"; // 👈 Added size support
}

export function Button({
  glow = true,
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : size === "icon" || size === "iconSm"
      ? "p-2"
      : "px-4 py-2";

  return (
    <button
      {...props}
      className={`
        ${sizeClasses}
        bg-primary text-primary-foreground 
        border border-border rounded-md
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
