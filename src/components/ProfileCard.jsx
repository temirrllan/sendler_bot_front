// src/components/ProfileCard.jsx
import React, { useEffect, useState } from "react";
import { apiGetMe } from "../api";

export default function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const u = await apiGetMe(); // u = { tgId, username, firstName, avatarUrl, ... }
        console.log("ProfileCard user:", u);
        if (!cancelled) setUser(u || null);
      } catch (e) {
        console.error("Failed to load profile:", e);
        if (!cancelled) setUser(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Пока user ещё не приехал – ничего не рисуем
  if (!user) return null;

  console.log("ProfileCard avatarUrl:", user.avatarUrl);

  const avatar =
    typeof user.avatarUrl === "string" && user.avatarUrl.trim()
      ? user.avatarUrl.trim()
      : "https://via.placeholder.com/64x64?text=No+Photo";

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Имя";

  const username = user.username ? `@${user.username}` : "@username";
  const hasSubscription = !!user.hasAccess;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-4 flex items-center gap-3">
      <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-inner bg-slate-700/60">
        <img
          src={avatar}
          alt={fullName}
          className="h-full w-full object-cover"
          onError={(e) => {
            console.warn("Avatar load error, fallback");
            e.currentTarget.src =
              "https://via.placeholder.com/64x64?text=No+Photo";
          }}
        />
      </div>

      <div className="flex-1">
        <div className="text-[18px] leading-5 font-semibold">
          {fullName}
        </div>
        <div className="text-white/70 text-xs">{username}</div>
      </div>

      <div
        className={`h-5 w-5 rounded-full grid place-items-center ring-1 ${
          hasSubscription
            ? "ring-emerald-400/50 bg-emerald-500/10"
            : "ring-red-400/50 bg-red-500/10"
        }`}
        title={hasSubscription ? "Есть подписка" : "Нет подписки"}
      >
        <div
          className={`h-2.5 w-2.5 rounded-sm ${
            hasSubscription ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
      </div>
    </div>
  );
}
