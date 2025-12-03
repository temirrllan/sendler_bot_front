import React from "react";

export default function Button({ as: Tag="button", className="", variant="solid", ...props }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none transition w-full";
  const styles =
    variant === "outline"
      ? "border border-white/20 bg-transparent text-white hover:bg-white/10"
      : variant === "ghost"
      ? "bg-transparent text-white hover:bg-white/10"
      : variant === "secondary"
      ? "bg-white/10 text-white hover:bg-white/20"
      : "bg-white text-slate-900 hover:bg-white/90";
  return <Tag className={`${base} ${styles} ${className}`} {...props} />;
}
