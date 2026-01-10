import React, { PropsWithChildren } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  hover = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm ${
        hover ? "hover:shadow-lg transition-shadow duration-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
