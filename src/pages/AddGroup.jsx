// src/pages/AddGroup.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../store/AppStore";

function Avatar({ src, title }) {
  if (src) {
    return <img src={src} alt="" className="h-10 w-10 rounded-full object-cover bg-slate-800 ring-1 ring-white/10" />;
  }
  const letter = (title || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 text-white/80 ring-1 ring-white/10 grid place-items-center text-sm font-semibold">
      {letter}
    </div>
  );
}

function Badges({ isBot, verified }) {
  return (
    <div className="ml-2 flex items-center gap-1">
      {isBot && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-white/70">
          бот
        </span>
      )}
      {verified && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-400" fill="currentColor">
          <path d="M12 2l2.39 4.84L20 8.27l-3.8 3.7.9 5.25L12 15.9l-5.1 2.8.9-5.25L4 8.27l5.61-.43L12 2z"/>
        </svg>
      )}
    </div>
  );
}

export default function AddGroup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bots, setBots } = useApp();

  const bot = bots.find((b) => String(b.id) === String(id));

  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const all = useMemo(
    () => [
      { id: 101, title: "WireGuard PRO BOT", subtitle: "бот", members: 11849, isBot: true,  verified: false, photo: "https://i.imgur.com/Q9o8V2y.png" },
      { id: 102, title: "WireGuard VPN free INFO", subtitle: "публичный канал", members: 10019, isBot: false, verified: false, photo: "https://i.imgur.com/f2BfD0u.png" },
      { id: 103, title: "Crypto Insider", subtitle: "публичный канал", members: 9420, verified: true, isBot: false, photo: "" },
      { id: 104, title: "MEXC Русский (Official)", subtitle: "публичная группа", members: 52000, verified: true, isBot: false, photo: "https://i.imgur.com/3o9lX0u.png" },
      { id: 105, title: "Работа/Вакансии IT", subtitle: "публичная группа", members: 15873, verified: false, isBot: false, photo: "" },
      { id: 106, title: "Мемы и приколы", subtitle: "публичная группа", members: 8800, verified: false, isBot: false, photo: "" },
    ],
    []
  );

  const alreadyIds = useMemo(
    () => (bot?.groupsActive || []).map((group) => (typeof group === "string" ? g : g.id)),
    [bot]
  );

  const results = useMemo(() => {
    const s = searchQuery.trim().toLowerCase();
    return s ? all.filter((group) => group.title.toLowerCase().includes(s)) : all;
  }, [searchQuery, all]);

  const addLocal = (group) => {
    setBots((prev) =>
      prev.map((b) =>
        String(b.id) === String(id)
          ? { ...b, groupsActive: [...(b.groupsActive || []), { id: group.id, title: group.title }] }
          : b
      )
    );
  };

  const handlePick = async (group) => {
    if (alreadyIds.includes(group.id)) return;

    setLoadingId(group.id);
    try {
      await fetch("/api/groups/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId: id, groupId: group.id }),
      }).catch(() => {});

      addLocal(group);
    } finally {
      setLoadingId(null);
    }
  };

  if (!bot) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100 p-6">
        <div className="text-white/70">Бот не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-sm mx-auto flex flex-col">
      <header className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white/80">← Назад</button>
        <div className="ml-2 font-medium">Добавить группу</div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-4">
        <input
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск"
          className="w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-white/10"
        />

        <div className="rounded-2xl border border-white/10 bg-slate-900/60">
          {results.map((group, idx) => {
            const already = alreadyIds.includes(group.id);
            return (
              <div
                key={group.id}
                className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                  idx !== results.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <Avatar src={group.photo} title={group.title} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <div className="truncate font-medium">{g.title}</div>
                    <Badges isBot={group.isBot} verified={group.verified} />
                  </div>
                  <div className="text-xs text-white/60">
                    {group.subtitle}
                    {group.members ? ` • ${group.members.toLocaleString("ru-RU")} пользователей` : ""}
                  </div>
                </div>
                {already ? (
                  <span className="text-emerald-300 text-xs">✓</span>
                ) : loadingId === g.id ? (
                  <svg className="h-5 w-5 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-80" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4"/>
                  </svg>
                ) : (
                  <button
                    onClick={() => handlePick(group)}
                    className="text-xs px-2 py-1 rounded-lg border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    добавить
                  </button>
                )}
              </div>
            );
          })}
          {results.length === 0 && (
            <div className="text-center text-sm text-white/60 py-10">Ничего не найдено</div>
          )}
        </div>
      </main>
    </div>
  );
}
