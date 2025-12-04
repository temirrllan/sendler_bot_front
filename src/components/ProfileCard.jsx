// frontend/src/components/ProfileCard.jsx
import React, { useEffect, useState } from "react";
import { apiGetMe } from "../api";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiGetMe();
        console.log("ProfileCard data:", data);
        
        // ✅ Бэк возвращает { user: {...} }
        if (!cancelled) setUser(data?.user || null);
      } catch (e) {
        console.error("Failed to load profile:", e);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-32" />
            <div className="h-3 bg-slate-700 rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const avatar =
    typeof user.avatarUrl === "string" && user.avatarUrl.trim()
      ? user.avatarUrl.trim()
      : "https://via.placeholder.com/64x64?text=User";

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Пользователь";

  const username = user.username ? `@${user.username}` : "";
  const hasSubscription = !!user.hasAccess;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-4 flex items-center gap-3">
      <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-inner bg-slate-700/60">
        <img
          src={avatar}
          alt={fullName}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/64x64?text=User";
          }}
        />
      </div>

      <div className="flex-1">
        <div className="text-[18px] leading-5 font-semibold">
          {fullName}
        </div>
        {username && (
          <div className="text-white/70 text-xs">{username}</div>
        )}
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