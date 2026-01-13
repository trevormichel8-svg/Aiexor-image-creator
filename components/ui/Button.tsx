import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glow?: boolean;
}

export function Button({ glow = true, className = "", children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        bg-primary text-primary-foreground 
        border border-border rounded-md px-4 py-2 
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
