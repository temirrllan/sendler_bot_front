import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMe, apiGetMyBots, apiGrantAccessDev } from "../api";
import { X, Plus, Loader2 } from "lucide-react";

export default function BotsList() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [justActivated, setJustActivated] = useState(false); // 👈 новый флаг

  async function loadData() {
    try {
      const profile = await apiGetMe();
      console.log("✅ Profile loaded:", profile);
      setMe(profile.user);

      if (profile.user?.hasAccess) {
        const botsData = await apiGetMyBots();
        console.log("✅ Bots loaded:", botsData);
        setBots(botsData.items || []);
        
        // 👀 Проверяем, была ли только что активация
        const wasJustActivated = sessionStorage.getItem('justActivated');
        if (wasJustActivated === 'true') {
          setJustActivated(true);
          sessionStorage.removeItem('justActivated');
          
          // Через 3 секунды убираем баннер
          setTimeout(() => setJustActivated(false), 3000);
        }
      }
    } catch (e) {
      console.error("❌ Load error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
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
            onClick={() => window.location.reload()} 
            className="text-white/60 text-sm hover:text-white underline"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = me?.hasAccess;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto p-4 pb-24 space-y-4">
        
        {/* 🎉 Баннер успешной активации */}
        {justActivated && hasAccess && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 p-4 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 grid place-items-center shrink-0">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-emerald-100">Доступ активирован!</div>
                <div className="text-sm text-emerald-200/80 mt-0.5">Теперь вы можете создавать ботов 🚀</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Профиль пользователя */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Аватар */}
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-slate-700 overflow-hidden">
                {me?.avatarUrl ? (
                  <img 
                    src={me.avatarUrl} 
                    alt={me.fullName || 'User'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x64?text=User';
                    }}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/40 text-xl font-semibold">
                    {(me?.firstName || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Индикатор доступа на аватаре */}
              {!hasAccess && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 grid place-items-center shadow-lg">
                  <X className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Инфо */}
            <div>
              <div className="text-white font-semibold leading-tight">
                {me?.fullName || me?.username || `user${me?.tgId}`}
              </div>
              {me?.username && (
                <div className="text-sm text-slate-400 mt-0.5">@{me.username}</div>
              )}
            </div>
          </div>
        </div>

        {/* Блок: нужна оплата */}
        {!hasAccess && (
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 text-center space-y-3">
            <div className="text-white font-semibold text-lg leading-snug">
              Перейдите в бота и пополните баланс
            </div>
            <div className="text-sm text-slate-400 leading-relaxed">
              После пополнения купите подписку, чтобы получить доступ к созданию ботов 🚀
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full mt-4 rounded-xl bg-white text-slate-900 py-3 font-semibold hover:bg-white/90 transition-colors"
            >
              Купить доступ
            </button>
          </div>
        )}

        {/* Список ботов */}
        {hasAccess && (
          <>
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-semibold">Мои боты</h2>
              <span className="text-sm text-white/60">{bots.length}</span>
            </div>

            {bots.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-8 text-center">
                <div className="text-white/60 text-sm mb-2">
                  У вас пока нет ботов
                </div>
                <div className="text-white/40 text-xs">
                  Создайте первого бота, нажав кнопку ниже
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bots.map((bot) => (
                  <div 
                    key={bot._id}
                    onClick={() => navigate(`/bot/${bot._id}`)}
                    className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 hover:bg-slate-900 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Аватар бота */}
                      <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0 ring-1 ring-white/10">
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
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 8V4" />
                              <rect x="8" y="8" width="8" height="8" rx="2" />
                              <path d="M5 13H3" />
                              <path d="M21 13h-2" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Инфо */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          @{bot.username}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <span className={bot.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}>
                            {bot.status === 'active' ? '● Активен' : '● Остановлен'}
                          </span>
                        </div>
                        {bot.createdAt && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(bot.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Кнопка создания бота (фиксированная внизу) */}
      {hasAccess && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none">
          <div className="max-w-sm mx-auto pointer-events-auto">
            <button
              onClick={() => navigate('/create')}
              className="w-full rounded-2xl bg-white text-slate-900 py-4 font-semibold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              Создать бота
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно оплаты */}
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            // 👀 Ставим флаг что была активация
            sessionStorage.setItem('justActivated', 'true');
            loadData();
          }}
        />
      )}
    </div>
  );
}

// Модальное окно оплаты (мок)
function PaymentModal({ onClose, onSuccess }) {
  const [copied, setCopied] = useState({ wallet: false, code: false });

  const wallet = process.env.VITE_CRYPTO_WALLET || "UQD8xample9w8a7l2l3e4t5address6here7";
  const code = "123456789012"; // Генерируется на бэкенде через API

  const copy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm grid place-items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-sm rounded-2xl bg-slate-950 border border-white/10 p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Купить доступ</h3>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Адрес кошелька */}
          <div>
            <div className="text-sm text-white/70 mb-2">Адрес кошелька TON</div>
            <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-3 border border-white/10">
              <div className="flex-1 text-xs font-mono truncate text-white/90">
                {wallet}
              </div>
              <button 
                onClick={() => copy(wallet, 'wallet')}
                className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-medium"
              >
                {copied.wallet ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>

          {/* Проверочный код */}
          <div>
            <div className="text-sm text-white/70 mb-2">Проверочный код</div>
            <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-3 border border-white/10">
              <div className="flex-1 text-sm font-mono text-white">
                {code}
              </div>
              <button 
                onClick={() => copy(code, 'code')}
                className="shrink-0 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-medium"
              >
                {copied.code ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>

          {/* Инструкции */}
          <div className="text-xs text-white/60 space-y-1.5 pt-2 bg-slate-900/50 rounded-xl p-4 border border-white/5">
            <p className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <span>Отправьте минимум <span className="text-white font-semibold">$10 USDT</span></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <span>Укажите код <span className="text-white font-mono">{code}</span> в комментарии</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <span>Проверка занимает до <span className="text-white">10 минут</span></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-white/40">•</span>
              <span className="text-amber-400">После оплаты вернитесь в бота и нажмите "Проверить оплату"</span>
            </p>
          </div>
        </div>

        {/* Только кнопка закрытия */}
        <div className="flex gap-2 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 border border-white/10 py-3 font-medium hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}