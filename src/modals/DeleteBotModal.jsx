import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";

export default function DeleteBotModal({ open, onClose, botName, onDelete }) {
  const [value, setValue] = React.useState("");
  const canDelete = value.trim() === (botName || "");

  React.useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 text-slate-100 p-4 space-y-3">
            <div className="text-base font-semibold">Вы точно хотите удалить бота?</div>
            <div className="text-xs text-white/70">
              Для удаления введите имя бота: <span className="font-semibold">{botName}</span>
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-sm"
              placeholder={botName}
            />
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={onClose}>Отмена</Button>
              <Button disabled={!canDelete} onClick={onDelete}>Удалить</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
