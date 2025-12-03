import React, { useMemo, useState, useEffect } from "react";
import Button from "../components/Button";
import { Plus, Wallet, ShieldCheck, Loader2, Check, ShieldX, ArrowLeft } from "lucide-react";
import { useApp } from "../store/AppStore";

export default function BotsList() {
  const { bots, setBots, hasSubscription, setHasSubscription } = useApp();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ firstName: "", secondName: "", description: "" });

  // создание (как в твоём коде)
  const handleCreateBot = () => {
    if (!form.firstName.trim()) return;
    setBots((prev) => [
      ...prev,
      {
        name: `${form.firstName} ${form.secondName}`.trim() || `Мой бот #${prev.length + 1}`,
        status: "Готов",
        description: form.description || "",
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({ firstName: "", secondName: "", description: "" });
    setCreating(false);
  };

  if (creating) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 max-w-sm mx-auto flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <button onClick={() => setCreating(false)} className="flex items-center gap-1 text-white/80">
            <ArrowLeft className="h-4 w-4" /> Назад
          </button>
        </header>
        <main className="flex-1 px-4 py-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">First name</label>
            <input
              type="text"
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-sm"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Например, Мой бот"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Second name (optional)</label>
            <input
              type="text"
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-sm"
              value={form.secondName}
              onChange={(e) => setForm({ ...form, secondName: e.target.value })}
              placeholder="№1"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description (optional)</label>
            <textarea
              rows={3}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Короткое описание бота"
            />
          </div>
        </main>
        <div className="p-4 border-t border-white/10">
          <Button onClick={handleCreateBot}>Создать</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="px-4 space-y-6 max-w-sm mx-auto pb-24">
      <header className="pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Мои боты</h1>
        {hasSubscription ? <ShieldCheck className="h-4 w-4 text-emerald-400" /> : <ShieldX className="h-4 w-4 text-red-500" />}
      </header>

      {/* Пустой экран оплаты — только если нет подписки */}
      {!hasSubscription && bots.length === 0 && (
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-slate-800/80">
            <Plus className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Здесь пока пусто</h2>
          <p className="text-white/70 text-sm mb-4">Создайте своего первого бота. Для этого нужен доступ.</p>
          <Button onClick={() => setHasSubscription(true)}>Смоделировать покупку (dev)</Button>
        </section>
      )}

      {/* Зелёный блок — есть подписка и ещё нет ботов */}
      {hasSubscription && bots.length === 0 && (
        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300">
            <Check className="h-5 w-5" /> Оплата подтверждена
          </div>
          <p className="text-emerald-100 text-sm">Доступ активирован. Теперь можно создать бота 🎉</p>
          <Button onClick={() => setCreating(true)}>Создать бота</Button>
        </section>
      )}

      {/* Список ботов */}
      {bots.length > 0 && (
        <section className="space-y-3">
          {bots.map((bot, i) => (
            <div key={i} className="rounded-2xl bg-slate-900 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-800 ring-1 ring-white/10 grid place-items-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4" /><rect x="8" y="8" width="8" height="8" rx="2" />
                    <path d="M5 13H3" /><path d="M21 13h-2" /><path d="M10 16v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold leading-tight">{bot.name || `Мой бот #${i + 1}`}</div>
                  <div className="text-xs text-white/60 mt-1">{bot.createdAt ? new Date(bot.createdAt).toLocaleDateString("ru-RU") : ""}</div>
                  <div className="mt-3"><Button className="w-full">Открыть</Button></div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
