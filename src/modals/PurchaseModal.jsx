import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { Wallet } from "lucide-react";
import { useApp } from "../store/AppStore";

export default function PurchaseModal() {
  const { buyOpen, setBuyOpen, copied, copy, walletAddress, verificationCode, minAmount, agree, setAgree, setConfirmOpen } = useApp();

  return (
    <AnimatePresence>
      {buyOpen && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 text-slate-100 p-4 space-y-4">
            <div className="text-lg font-semibold">Купить доступ</div>
            <div className="space-y-2">
              <div className="text-sm text-white/70">Адрес кошелька</div>
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 p-2 rounded-xl">
                <Wallet className="h-4 w-4 text-white/60" />
                <span className="truncate" title={walletAddress}>{walletAddress}</span>
                <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => copy(walletAddress, "addr")}>
                  {copied.addr ? "✔" : "Копировать"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-white/70">Проверочный код</div>
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 p-2 rounded-xl">
                {verificationCode}
                <Button variant="secondary" className="px-2 py-1 text-xs ml-auto" onClick={() => copy(verificationCode, "code")}>
                  {copied.code ? "✔" : "Копировать"}
                </Button>
              </div>
            </div>
            <div className="text-xs text-white/70 space-y-1">
              <p>Отправьте минимум ${minAmount}. Укажите код в комментарии.</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
                Я понимаю, что без кода платеж может не найтись
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>setBuyOpen(false)}>Отмена</Button>
              <Button disabled={!agree} onClick={()=>{ setBuyOpen(false); }}>Я оплатил</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
