import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useApp } from "../store/AppStore";

export default function VerifyingModal() {
  const { verifying, verifyProgress } = useApp();

  return (
    <AnimatePresence>
      {verifying && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <div className="text-sm font-semibold">Проверяем оплату…</div>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-white/80"
                initial={{ width: 0 }}
                animate={{ width: `${verifyProgress}%` }}
                transition={{ type: "tween", ease: "linear", duration: 0.25 }}
              />
            </div>
            <div className="text-right text-xs text-white/60">{verifyProgress}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
    