import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar, User } from "lucide-react";

// Используем существующий request из api/http.js
import { request } from "../api/http";

function apiGetDeletedBots() {
  return request("/bots/deleted");
}

export default function DeletedBots() {
  const navigate = useNavigate();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetDeletedBots();
        setBots(data.items || []);
      } catch (e) {
        console.error("❌ Load deleted bots error:", e);
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-sm mb-4">{error}</div>
          <button 
            onClick={() => navigate("/")}
            className="text-white/60 text-sm hover:text-white underline"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto pb-8">
        
        {/* Шапка */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Назад</span>
            </button>
            
            <div className="text-base font-semibold">
              Удаленные боты
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {bots.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-8 text-center">
              <div className="text-white/40 text-sm">
                Нет удаленных ботов
              </div>
            </div>
          ) : (
            bots.map((bot) => (
              <div
                key={bot._id}
                className="rounded-2xl bg-slate-900/80 border border-white/10 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Аватар */}
                  <div className="w-12 h-12 rounded-xl bg-slate-700/60 overflow-hidden shrink-0 ring-1 ring-white/10">
                    {bot.photoUrl ? (
                      <img 
                        src={bot.photoUrl}
                        alt={bot.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-white/40">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 8V4" />
                          <rect x="8" y="8" width="8" height="8" rx="2" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Инфо */}
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold mb-1 truncate">
                      @{bot.username}
                    </div>
                    
                    {/* Статистика */}
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-2">
                      <span>📤 {bot.sentCount || 0}</span>
                      <span>❌ {bot.errorCount || 0}</span>
                    </div>

                    {/* Дата удаления */}
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Удалён {new Date(bot.deletedAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Кто удалил */}
                    {bot.deletedByType && (
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                        <User className="h-3 w-3" />
                        <span>
                          {bot.deletedByType === "admin" ? "Удалён админом" : "Удалён владельцем"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Причина удаления (если есть) */}
                {bot.deletionReason && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="text-xs text-white/50 mb-1">Причина:</div>
                    <div className="text-sm text-white/80">{bot.deletionReason}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}