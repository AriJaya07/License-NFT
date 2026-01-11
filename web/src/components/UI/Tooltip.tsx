import React, { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className = "",
  contentClassName = "",
}) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Tooltip Trigger (button or icon) */}
      <span className="cursor-pointer">{children}</span>

      {/* Tooltip Content */}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-2 px-3 rounded-md shadow-lg opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible ${contentClassName}`}
      >
        {content}
      </div>
    </div>
  );
};
