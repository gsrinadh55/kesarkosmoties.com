import React from "react";

export function Button({
  children,
  className = "",
  variant,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium transition-colors";
  const style =
    variant === "outline"
      ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
      : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600";

  return (
    <button type={type} className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
