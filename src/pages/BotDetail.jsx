// src/pages/BotDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  apiGetBot,
  apiBlockBot,
  apiUnblockBot,
  apiDeleteBot,
} from "../api";

export default function BotDetail() {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetBot(id);
      setBot(data.bot);
    } catch (e) {
      console.error(e);
      setError(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (!bot) return null;

  const isBlocked = bot.status === "blocked";

  async function handleBlockToggle() {
    try {
      if (isBlocked) {
        const res = await apiUnblockBot(bot._id);
        setBot((prev) => ({ ...prev, status: res.status }));
      } else {
        const res = await apiBlockBot(bot._id);
        setBot((prev) => ({ ...prev, status: res.status }));
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Удалить бота?")) return;
    try {
      await apiDeleteBot(bot._id);
      window.history.back();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* шапка карточки как в твоём дизайне */}
      <div className="rounded-2xl bg-slate-900/80 p-4">
        <div className="text-white font-semibold">@{bot.username}</div>
        <div className="text-xs text-slate-400 mt-1">
          Статус: {bot.status}
        </div>
      </div>

      {/* кнопки */}
      <button
        onClick={handleBlockToggle}
        className="rounded-xl bg-slate-800 py-3 text-sm"
      >
        {isBlocked ? "Разблокировать" : "Остановить отправку"}
      </button>

      <button
        onClick={handleDelete}
        className="rounded-xl bg-red-500 py-3 text-sm"
      >
        Удалить бота
      </button>
    </div>
  );
}
