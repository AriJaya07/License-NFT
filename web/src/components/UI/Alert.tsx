import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react"; // Import icons from lucide-react

interface AlertProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  className?: string;
}

export const Alert = ({
  type,
  title,
  message,
  className = "",
}: AlertProps) => {
  const alertStyles = {
    success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
    error: "border-red-500/50 bg-red-500/10 text-red-500",
    info: "border-blue-500/50 bg-blue-500/10 text-blue-500",
  };

  const iconMap = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div
      className={`w-80 shadow-xl border-2 ${alertStyles[type]} ${className} p-4 rounded-md flex items-start gap-3`}
    >
      {/* Icon */}
      {iconMap[type]}

      {/* Alert content */}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
