import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { useApp } from "../store/AppStore";

export default function ConfirmPaymentModal() {
  const { confirmOpen, setConfirmOpen, setVerifying } = useApp();

  return (
    <AnimatePresence>
      {confirmOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 text-slate-100 p-4 space-y-3">
            <div className="text-base font-semibold">Вы точно оплатили?</div>
            <p className="text-xs text-white/70">Проверьте сумму и что проверочный код указан в комментарии.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Отмена</Button>
              <Button onClick={() => { setConfirmOpen(false); setVerifying(true); }}>
                Да, проверить
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
