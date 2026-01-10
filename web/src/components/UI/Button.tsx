import React from "react";
import { Palette, ArrowRight, Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean; // 🔥 make this boolean
}

export const Button: React.FC<ButtonProps> = ({
  size = "lg",
  label = "Explore NFTs",
  variant = "primary",
  className = "",
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-white text-primary-700 hover:bg-gray-100",
    secondary: "bg-primary-700 text-white hover:bg-primary-800",
    outline:
      "bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-50",
  };

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "md"
      ? "px-4 py-2 text-base"
      : "px-5 py-3 text-lg";

  return (
    <button
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2
        rounded-xl font-medium transition-all
        ${sizeClasses}
        ${variantClasses[variant]}
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Loading...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          <Palette size={20} />
          {label}
          <ArrowRight size={20} />
        </>
      )}
    </button>
  );
};
