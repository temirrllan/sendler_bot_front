import React, { useEffect, useState } from "react";

/** Простая верхняя плашка-уведомление */
export default function Toast({ open, message, onClose, tone = "success" }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (!open) return;
    const t = setTimeout(() => {
      setVisible(false);
      // подождём анимацию и затем вызовем onClose
      const t2 = setTimeout(() => onClose?.(), 250);
      return () => clearTimeout(t2);
    }, 2500);
    return () => clearTimeout(t);
  }, [open, onClose]);

  // цвета по тону
  const border = tone === "success" ? "border-emerald-400/40" : "border-white/20";
  const bg = tone === "success" ? "bg-emerald-500/10" : "bg-white/10";
  const text = tone === "success" ? "text-emerald-100" : "text-white";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center transition-all duration-200
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto max-w-sm rounded-xl ${border} ${bg} ${text} border px-[80px] py-2 shadow-lg backdrop-blur-sm`}
      >
        {message}
      </div>
    </div>
  );
}
