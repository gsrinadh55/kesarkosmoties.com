import React from "react";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`}
      {...props}
    />
  );
});
