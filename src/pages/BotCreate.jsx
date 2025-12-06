import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateBot } from "../api";
import { ArrowLeft, Loader2, Upload } from "lucide-react";

export default function BotCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    username: "",
    messageText: "",
    interval: 3600,
    photoUrl: ""
  });

  const intervals = [
    { value: 3600, label: "Каждый час" },
    { value: 7200, label: "Каждые 2 часа" },
    { value: 10800, label: "Каждые 3 часа" },
    { value: 14400, label: "Каждые 4 часа" },
    { value: 18000, label: "Каждые 5 часов" },
    { value: 21600, label: "Каждые 6 часов" },
    { value: 43200, label: "Каждые 12 часов" },
    { value: 86400, label: "Раз в день" }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.username.trim()) {
      setError("Укажите имя бота");
      return;
    }
    
    if (!form.messageText.trim()) {
      setError("Укажите текст сообщения");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiCreateBot({
        username: form.username.trim(),
        messageText: form.messageText.trim(),
        interval: form.interval,
        photoUrl: form.photoUrl.trim() || null
      });

      console.log("✅ Bot created:", data);
      
      navigate(`/bot/${data.bot._id}`);
    } catch (err) {
      console.error("❌ Create bot error:", err);
      
      if (err.status === 402) {
        setError("Нужно оплатить доступ");
      } else {
        setError(err.message || "Ошибка создания бота");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto">
        
        {/* Шапка */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">Создать бота</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
          
          {/* Имя бота */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              First name
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Например, Кристина"
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              disabled={loading}
            />
          </div>

          {/* URL аватара (опционально) */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Avatar URL <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 pr-12 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                <Upload className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-white/40 mt-1.5">
              Вставьте ссылку на изображение из интернета
            </div>
          </div>

          {/* Текст сообщения */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.messageText}
              onChange={(e) => setForm({ ...form, messageText: e.target.value })}
              placeholder="Короткое описание бота"
              rows={4}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition resize-none"
              disabled={loading}
            />
          </div>

          {/* Интервал */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Интервал отправки
            </label>
            <select
              value={form.interval}
              onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-white/20 transition cursor-pointer"
              disabled={loading}
            >
              {intervals.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </form>

        {/* Кнопка создания (фиксированная) */}
        <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none">
          <div className="max-w-sm mx-auto pointer-events-auto">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !form.username.trim() || !form.messageText.trim()}
              className="w-full rounded-2xl bg-white text-slate-900 py-4 font-semibold hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Создаём...
                </>
              ) : (
                "Создать"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}