import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMe, apiGetMyBots } from "../api";
import { X, Plus } from "lucide-react";

export default function BotsList() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const profile = await apiGetMe();
        setMe(profile.user);

        const botsData = await apiGetMyBots();
        setBots(botsData.items || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="text-white/60">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
        <div className="text-red-400 text-center">
          <div className="text-lg font-semibold mb-2">Ошибка</div>
          <div className="text-sm text-white/70">{error}</div>
        </div>
      </div>
    );
  }

  const hasAccess = me?.hasAccess || false;

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Профиль пользователя */}
        {me && (
          <div className="mb-6">
            <div className="relative rounded-[28px] bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-5">
              {/* Аватар и имя */}
              <div className="flex items-center gap-4 mb-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden border border-white/10">
                    {me.avatarUrl ? (
                      <img
                        src={me.avatarUrl}
                        alt={me.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/64x64?text=" + (me.firstName?.[0] || "U");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/80 text-xl font-semibold">
                        {me.firstName?.[0] || "U"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[19px] font-semibold leading-tight mb-1">
                    {me.fullName || "Пользователь"}
                  </div>
                  {me.username && (
                    <div className="text-sm text-white/50">
                      @{me.username}
                    </div>
                  )}
                </div>

                {/* Индикатор доступа */}
                <button 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    hasAccess 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20" 
                      : "bg-red-500/10 text-red-400 border border-red-400/20"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Блок "Перейдите в бота и пополните баланс" */}
        {!hasAccess && (
          <div className="mb-6">
            <div className="rounded-[24px] bg-[#1a1f3a]/40 border border-white/5 p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-7 h-7 text-white/40" />
              </div>
              <div className="text-[17px] font-semibold mb-2">
                Перейдите в бота и пополните баланс
              </div>
              <div className="text-[14px] text-white/50 leading-relaxed">
                После пополнения купите подписку, чтобы получить доступ к созданию ботов 🚀
              </div>
            </div>
          </div>
        )}

        {/* Список ботов */}
        {hasAccess && bots.length > 0 && (
          <div className="space-y-3 mb-6">
            {bots.map((bot) => (
              <div
                key={bot._id}
                onClick={() => navigate(`/bot/${bot._id}`)}
                className="rounded-[24px] bg-gradient-to-br from-[#1a1f3a] to-[#0f1329] border border-white/5 p-5 cursor-pointer hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Аватар бота */}
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden border border-white/10 flex-shrink-0">
                    {bot.photoUrl ? (
                      <img
                        src={bot.photoUrl}
                        alt={bot.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 8V4" />
                          <rect x="8" y="8" width="8" height="8" rx="2" />
                          <path d="M5 13H3" />
                          <path d="M21 13h-2" />
                          <path d="M10 16v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Информация о боте */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-semibold mb-1">
                      @{bot.username}
                    </div>
                    <div className="text-[13px] text-white/50">
                      {new Date(bot.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Пустое состояние для пользователей с доступом */}
        {hasAccess && bots.length === 0 && (
          <div className="mb-6">
            <div className="rounded-[24px] bg-[#1a1f3a]/40 border border-white/5 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-[17px] font-semibold mb-2">
                У вас пока нет ботов
              </div>
              <div className="text-[14px] text-white/50 mb-5">
                Создайте первого бота для рассылки сообщений
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Фиксированная кнопка создания бота */}
      {hasAccess && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0E27] via-[#0A0E27] to-transparent pt-6 pb-6">
          <div className="max-w-md mx-auto px-4">
            <button
              onClick={() => navigate("/create")}
              className="w-full h-14 rounded-[18px] bg-white text-[#0A0E27] font-semibold text-[16px] flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
            >
              <Plus className="w-5 h-5" />
              Создать бота
            </button>
          </div>
        </div>
      )}
    </div>
  );
}