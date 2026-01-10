// src/components/ui/Input.tsx
"use client";

import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerClassName?: string;
};

export default function Input({
  label,
  containerClassName = "",
  id,
  ...props
}: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className="
          w-full px-4 py-3
          border-2 border-gray-200
          rounded-xl
          bg-white text-gray-900
          placeholder:text-gray-400
          shadow-sm
          transition-all
          outline-none
          hover:border-gray-300
          focus:ring-2 focus:ring-primary-500
          focus:border-primary-500
          disabled:bg-gray-50 disabled:opacity-60
        "
        {...props}
      />
    </div>
  );
}
