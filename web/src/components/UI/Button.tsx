import React from "react";
import { Palette, ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
  variant?: "primary" | "secondary" | "outline"; // bisa di-expand nanti
}

export const Button: React.FC<ButtonProps> = ({
  size = "lg",
  label = "Explore NFTs",
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  // Tentukan style berdasarkan variant
  const variantClasses = {
    primary: "bg-white text-primary-700 hover:bg-gray-100",
    secondary: "bg-primary-700 text-white hover:bg-primary-800",
    outline:
      "bg-transparent border border-primary-700 text-primary-700 hover:bg-primary-50",
  };

  return (
    <button
      className={`flex items-center gap-2 ${
        size === "sm"
          ? "px-3 py-1 text-sm"
          : size === "md"
          ? "px-4 py-2 text-base"
          : "px-5 py-3 text-lg"
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children ? (
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
