// src/pages/BotCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateBot } from "../api";

export default function BotCreate() {
  const [username, setUsername] = useState("");
  const [messageText, setMessageText] = useState("");
  const [interval, setInterval] = useState(3600); // сек
  const [photoUrl, setPhotoUrl] = useState("");   // <- теперь реально используем
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiCreateBot({
        username,
        messageText,
        interval,
        photoUrl: photoUrl || null, // если пусто — отправим null
      });

      // бэк вернёт { bot: {...} }
      navigate(`/bot/${data.bot._id}`);
    } catch (e) {
      console.error(e);
      // access_required (402) и т.п.
      if (e.status === 402) {
        setError("Нужно пополнить баланс и купить доступ.");
      } else {
        setError(e.message || "Ошибка создания бота");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen p-4 flex flex-col gap-4"
    >
      {/* имя бота */}
      <div>
        <label className="text-sm text-slate-400">First name</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
          placeholder="Например, Кристина"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* url аватарки (опционально) */}
      <div>
        <label className="text-sm text-slate-400">Avatar URL (optional)</label>
        <input
          className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
          placeholder="https://example.com/photo.jpg"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>

      {/* описание / текст сообщения */}
      <div>
        <label className="text-sm text-slate-400">Description (optional)</label>
        <textarea
          className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
          rows={4}
          placeholder="Короткое описание бота"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>

      {/* интервал в секундах */}
      <div>
        <label className="text-sm text-slate-400">Интервал отправки</label>
        <select
          className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
        >
          <option value={3600}>Каждый час</option>
          <option value={7200}>Каждые 2 часа</option>
          <option value={10800}>Каждые 3 часа</option>
          <option value={14400}>Каждые 4 часа</option>
          <option value={18000}>Каждые 5 часов</option>
          <option value={21600}>Каждые 6 часов</option>
          <option value={43200}>Каждые 12 часов</option>
          <option value={86400}>Раз в день</option>
        </select>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-auto mb-4 w-full rounded-2xl bg-slate-100 text-slate-900 py-3 font-semibold"
      >
        {loading ? "Создаём..." : "Создать"}
      </button>
    </form>
  );
}
