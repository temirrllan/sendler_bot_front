import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { apiGetBot, apiBlockBot, apiUnblockBot, apiDeleteBot } from "../api";

export default function BotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGetBot(id);
      setBot(data.bot);
    } catch (e) {
      console.error(e);
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleBlockToggle() {
    if (!bot) return;
    
    setActionLoading(true);
    try {
      const isBlocked = bot.status === "blocked";
      
      if (isBlocked) {
        const res = await apiUnblockBot(bot._id);
        setBot((prev) => ({ ...prev, status: res.status || "active" }));
      } else {
        const res = await apiBlockBot(bot._id);
        setBot((prev) => ({ ...prev, status: res.status || "blocked" }));
      }
    } catch (e) {
      alert(e.message || "Ошибка");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!bot) return;
    
    const confirmed = window.confirm("Вы уверены, что хотите удалить бота?");
    if (!confirmed) return;
    
    setActionLoading(true);
    try {
      await apiDeleteBot(bot._id);
      navigate("/");
    } catch (e) {
      alert(e.message || "Ошибка удаления");
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="text-white/60 text-sm">Загрузка...</div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
        <div className="text-red-400 text-center">
          <div className="text-base font-semibold mb-1">Ошибка</div>
          <div className="text-sm text-white/70">{error || "Бот не найден"}</div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm text-white/50 hover:text-white/80"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const isBlocked = bot.status === "blocked";

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      {/* Хедер */}
      <div className="border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-md mx-auto px-4 py-5 space-y-4">
        {/* Аватар бота */}
        <div className="flex justify-center mb-2">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/10 flex items-center justify-center overflow-hidden">
            {bot.photoUrl ? (
              <img
                src={bot.photoUrl}
                alt={bot.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8V4" />
                <rect x="8" y="8" width="8" height="8" rx="2" />
                <path d="M5 13H3" />
                <path d="M21 13h-2" />
                <path d="M10 16v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2" />
              </svg>
            )}
          </div>
        </div>

        {/* Информация о боте */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-4">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-white/50 mb-1">first name:</div>
              <div className="text-[15px] font-medium">{bot.username}</div>
            </div>
            
            <div>
              <div className="text-xs text-white/50 mb-1">second name:</div>
              <div className="text-[15px] font-medium">
                {bot.messageText?.split(' ')[1] || "—"}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-white/50 mb-1">Описание:</div>
              <div className="text-[15px] font-medium">
                {bot.messageText || "—"}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-white/50">
                Создан: {new Date(bot.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Сообщение для рассылки */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-4">
          <div className="text-xs text-white/50 mb-2">
            Сообщение для рассылки
          </div>
          <div className="text-[15px] font-medium">
            {bot.messageText || "Привет! 👋 новый бот 🤖"}
          </div>
          <div className="text-xs text-white/40 mt-3">
            Отправится через: 10 мин.
          </div>
        </div>

        {/* Активные группы */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-4">
          <div className="text-sm font-medium mb-3">Активные группы</div>
          <div className="text-sm text-white/50 mb-3">
            Пока нет активных групп
          </div>
          <button
            onClick={() => navigate(`/bot/${id}/add-group`)}
            className="w-full h-11 rounded-2xl border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        {/* Заблокировали бота */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-4">
          <div className="text-sm font-medium mb-2">Заблокировали бота</div>
          <div className="text-sm text-white/50">
            Пока нет заблокированных групп
          </div>
        </div>

        {/* Кнопка блокировки/разблокировки */}
        <button
          onClick={handleBlockToggle}
          disabled={actionLoading}
          className={`w-full h-12 rounded-2xl border font-medium text-sm transition-colors disabled:opacity-50 ${
            isBlocked
              ? "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
              : "border-white/10 text-white/80 hover:border-white/20 hover:text-white"
          }`}
        >
          {actionLoading ? "..." : isBlocked ? "Разблокировать бота" : "Заблокировать бота"}
        </button>

        {/* Кнопка удаления */}
        <button
          onClick={handleDelete}
          disabled={actionLoading}
          className="w-full h-12 rounded-2xl border border-red-400/30 text-red-400 hover:bg-red-400/10 font-medium text-sm transition-colors disabled:opacity-50"
        >
          {actionLoading ? "..." : "Удалить бота"}
        </button>
      </div>
    </div>
  );
}