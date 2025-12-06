import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMe, apiGetMyBots } from "../api";
import { X, Plus, Loader2 } from "lucide-react";

export default function BotsList() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profile = await apiGetMe();
        setMe(profile.user);

        if (profile.user?.hasAccess) {
          const botsData = await apiGetMyBots();
          setBots(botsData.items || []);
        }
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
      <div className="min-h-screen bg-slate-950 grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-white/60 text-sm hover:text-white"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = me?.hasAccess;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto p-4 pb-24 space-y-4">
        
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
                  <div className="w-full h-full grid place-items-center text-white/40 text-xl">
                    {(me?.firstName || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Индикатор доступа на аватаре */}
              {!hasAccess && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 grid place-items-center">
                  <X className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Инфо */}
            <div>
              <div className="text-white font-semibold">
                {me?.fullName || me?.username || `user${me?.tgId}`}
              </div>
              {me?.username && (
                <div className="text-sm text-slate-400">@{me.username}</div>
              )}
            </div>
          </div>
        </div>

        {/* Блок: нужна оплата */}
        {!hasAccess && (
          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 text-center space-y-3">
            <div className="text-white font-semibold text-lg">
              Перейдите в бота и пополните баланс
            </div>
            <div className="text-sm text-slate-400">
              После пополнения купите подписку, чтобы получить доступ к созданию ботов 🚀
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full mt-4 rounded-xl bg-white text-slate-900 py-3 font-semibold hover:bg-white/90 transition"
            >
              Купить доступ
            </button>
          </div>
        )}

        {/* Список ботов */}
        {hasAccess && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Мои боты</h2>
              <span className="text-sm text-white/60">{bots.length}</span>
            </div>

            {bots.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-8 text-center">
                <div className="text-white/60 text-sm mb-4">
                  У вас пока нет ботов
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {bots.map((bot) => (
                  <div 
                    key={bot._id}
                    onClick={() => navigate(`/bot/${bot._id}`)}
                    className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 hover:bg-slate-900 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Аватар бота */}
                      <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0">
                        {bot.photoUrl ? (
                          <img 
                            src={bot.photoUrl} 
                            alt={bot.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-white/40">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 8V4" />
                              <rect x="8" y="8" width="8" height="8" rx="2" />
                              <path d="M5 13H3" />
                              <path d="M21 13h-2" />
                              <path d="M10 16v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-2" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Инфо */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium">@{bot.username}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {bot.status === 'active' ? '🟢 Активен' : '⚫ Остановлен'}
                        </div>
                        {bot.createdAt && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(bot.createdAt).toLocaleDateString('ru-RU')}
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
        <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
          <div className="max-w-sm mx-auto">
            <button
              onClick={() => navigate('/create')}
              className="w-full rounded-2xl bg-white text-slate-900 py-4 font-semibold hover:bg-white/90 transition flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
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
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// Модальное окно оплаты (мок)
function PaymentModal({ onClose, onSuccess }) {
  const [step, setStep] = useState('payment'); // payment | verifying | success
  const [progress, setProgress] = useState(0);

  const wallet = "UQD...example...wallet";
  const code = "123456789012";
  const [copied, setCopied] = useState({ wallet: false, code: false });

  const copy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handlePayment = async () => {
    setStep('verifying');
    
    // Мок проверки оплаты
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('success');
          
          // Мок: активируем доступ на бэкенде
          fetch('/api/dev/grant-access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.Telegram?.WebApp?.initData 
                ? btoa(window.Telegram.WebApp.initData)
                : ''
            }
          }).catch(console.error);
          
          setTimeout(() => onSuccess(), 1500);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-white/10 p-6 space-y-4">
        
        {step === 'payment' && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Купить доступ</h3>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/70 mb-1">Адрес кошелька TON</div>
                <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-3">
                  <div className="flex-1 text-xs font-mono truncate">{wallet}</div>
                  <button 
                    onClick={() => copy(wallet, 'wallet')}
                    className="shrink-0 px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {copied.wallet ? '✓' : 'Копировать'}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-white/70 mb-1">Проверочный код</div>
                <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-3">
                  <div className="flex-1 text-sm font-mono">{code}</div>
                  <button 
                    onClick={() => copy(code, 'code')}
                    className="shrink-0 px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {copied.code ? '✓' : 'Копировать'}
                  </button>
                </div>
              </div>

              <div className="text-xs text-white/60 space-y-1 pt-2">
                <p>• Отправьте минимум $10 USDT</p>
                <p>• Укажите код в комментарии</p>
                <p>• Проверка занимает до 10 минут</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-800 py-3 font-medium hover:bg-slate-700 transition"
              >
                Отмена
              </button>
              <button 
                onClick={handlePayment}
                className="flex-1 rounded-xl bg-white text-slate-900 py-3 font-semibold hover:bg-white/90 transition"
              >
                Я оплатил
              </button>
            </div>
          </>
        )}

        {step === 'verifying' && (
          <div className="text-center py-6 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-white/60" />
            <div>
              <div className="text-lg font-semibold mb-2">Проверяем оплату...</div>
              <div className="text-sm text-white/60">Это займёт несколько секунд</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 mx-auto grid place-items-center">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">Оплата подтверждена!</div>
              <div className="text-sm text-white/60">Доступ активирован 🎉</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}