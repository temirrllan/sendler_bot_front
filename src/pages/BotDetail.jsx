// src/pages/BotDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  apiGetBot, 
  apiUpdateBot, 
  apiDeleteBot, 
  apiBlockBot, 
  apiUnblockBot 
} from "../api";
import { 
  ArrowLeft, 
  Loader2, 
  Edit2, 
  Trash2, 
  Upload,
  Save,
  X,
  Power,
  PowerOff,
  Plus
} from "lucide-react";
import DeleteBotModal from "../modals/DeleteBotModal";
import Toast from "../components/Toast";

export default function BotDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Режим редактирования
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: "",
    messageText: "",
    interval: 3600,
    photoUrl: ""
  });
  
  // Модалки и тосты
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", tone: "success" });
  
  // Интервалы для выбора
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

  // Загрузка данных бота
  async function loadBot() {
    try {
      setLoading(true);
      const data = await apiGetBot(id);
      console.log("✅ Bot loaded:", data);
      
      const botData = data.bot;
      setBot(botData);
      
      // Заполняем форму текущими данными
      setForm({
        username: botData.username || "",
        messageText: botData.messageText || "",
        interval: botData.interval || 3600,
        photoUrl: botData.photoUrl || ""
      });
    } catch (e) {
      console.error("❌ Load bot error:", e);
      setError(e.message || "Ошибка загрузки бота");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBot();
  }, [id]);

  // Сохранение изменений
  async function handleSave() {
    if (!form.username.trim()) {
      showToast("Укажите имя бота", "error");
      return;
    }
    
    if (!form.messageText.trim()) {
      showToast("Укажите текст сообщения", "error");
      return;
    }

    setSaving(true);
    
    try {
      const data = await apiUpdateBot(id, {
        username: form.username.trim(),
        messageText: form.messageText.trim(),
        interval: form.interval,
        photoUrl: form.photoUrl.trim() || null
      });
      
      console.log("✅ Bot updated:", data);
      
      setBot(data.bot);
      setEditing(false);
      showToast("Бот успешно обновлен");
    } catch (e) {
      console.error("❌ Update bot error:", e);
      showToast(e.message || "Ошибка обновления", "error");
    } finally {
      setSaving(false);
    }
  }

  // Удаление бота
  async function handleDelete() {
    try {
      await apiDeleteBot(id);
      console.log("✅ Bot deleted");
      
      showToast("Бот удален");
      
      // Возвращаемся на главную через 1 секунду
      setTimeout(() => navigate("/"), 1000);
    } catch (e) {
      console.error("❌ Delete bot error:", e);
      showToast(e.message || "Ошибка удаления", "error");
    } finally {
      setShowDeleteModal(false);
    }
  }

  // Блокировка/разблокировка бота
  async function toggleBotStatus() {
    const isActive = bot.status === "active";
    
    try {
      const data = isActive 
        ? await apiBlockBot(id)
        : await apiUnblockBot(id);
      
      console.log("✅ Bot status toggled:", data);
      
      setBot(prev => ({ ...prev, status: data._id ? data.status : prev.status }));
      showToast(isActive ? "Бот остановлен" : "Бот запущен");
    } catch (e) {
      console.error("❌ Toggle status error:", e);
      showToast(e.message || "Ошибка изменения статуса", "error");
    }
  }

  // Показать toast
  function showToast(message, tone = "success") {
    setToast({ open: true, message, tone });
  }

  // Отмена редактирования
  function cancelEdit() {
    setForm({
      username: bot.username || "",
      messageText: bot.messageText || "",
      interval: bot.interval || 3600,
      photoUrl: bot.photoUrl || ""
    });
    setEditing(false);
  }

  // Загрузка
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  // Ошибка
  if (error || !bot) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-sm mb-4">
            {error || "Бот не найден"}
          </div>
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

  const isActive = bot.status === "active";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-sm mx-auto pb-24">
        
        {/* Шапка */}
        <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Назад</span>
            </button>
            
            {!editing && (
              <div className="flex items-center gap-2">
                {/* Кнопка блокировки/разблокировки */}
                <button
                  onClick={toggleBotStatus}
                  className={`p-2 rounded-xl border transition-colors ${
                    isActive 
                      ? "border-red-400/30 text-red-400 hover:bg-red-500/10" 
                      : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                  title={isActive ? "Остановить бота" : "Запустить бота"}
                >
                  {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                </button>
                
                {/* Кнопка редактирования */}
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                
                {/* Кнопка удаления */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-xl border border-red-400/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {editing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-xl text-sm text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Сохранить
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          
          {/* Аватар и имя */}
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6">
            <div className="flex items-center gap-4">
              {/* Аватар */}
              <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden shrink-0 ring-2 ring-white/10">
                {(editing ? form.photoUrl : bot.photoUrl) ? (
                  <img 
                    src={editing ? form.photoUrl : bot.photoUrl}
                    alt={editing ? form.username : bot.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/40">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8V4" />
                      <rect x="8" y="8" width="8" height="8" rx="2" />
                      <path d="M5 13H3" />
                      <path d="M21 13h-2" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Имя и статус */}
              <div className="flex-1 min-w-0">
                <div className="text-xl font-semibold truncate">
                  @{editing ? form.username : bot.username}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${
                    isActive ? "text-emerald-400" : "text-slate-500"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-emerald-400" : "bg-slate-500"
                    }`} />
                    {isActive ? "Активен" : "Остановлен"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Форма редактирования */}
          {editing ? (
            <div className="space-y-4">
              
              {/* Username */}
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
                  disabled={saving}
                />
              </div>

              {/* Avatar URL */}
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
                    disabled={saving}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Message Text */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Description
                </label>
                <textarea
                  value={form.messageText}
                  onChange={(e) => setForm({ ...form, messageText: e.target.value })}
                  placeholder="Текст для рассылки"
                  rows={5}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition resize-none"
                  disabled={saving}
                />
              </div>

              {/* Interval */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Интервал отправки
                </label>
                <select
                  value={form.interval}
                  onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-white/20 transition cursor-pointer"
                  disabled={saving}
                >
                  {intervals.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Сообщение для рассылки */}
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <div className="text-sm text-white/70 mb-2">Сообщение для рассылки</div>
                <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {bot.messageText || "—"}
                </div>
              </div>

              {/* Интервал */}
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <div className="text-sm text-white/70 mb-2">Интервал отправки</div>
                <div className="text-white font-medium">
                  {intervals.find(i => i.value === bot.interval)?.label || "—"}
                </div>
              </div>

              {/* Группы */}
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-white/70">Активные группы</div>
                  <button
                    onClick={() => navigate(`/bot/${id}/add-group`)}
                    className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Добавить
                  </button>
                </div>
                
                {bot.groups && bot.groups.length > 0 ? (
                  <div className="space-y-2">
                    {bot.groups.map((group, idx) => (
                      <div 
                        key={idx}
                        className="text-sm text-white/90 flex items-center justify-between py-2 border-t border-white/5 first:border-0 first:pt-0"
                      >
                        <span>Группа #{group._id || idx + 1}</span>
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-white/40">
                    Группы не добавлены
                  </div>
                )}
              </div>

              {/* Статистика */}
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <div className="text-sm text-white/70 mb-3">Статистика</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Отправлено</div>
                    <div className="text-lg font-semibold">{bot.sentCount || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Ошибок</div>
                    <div className="text-lg font-semibold">{bot.errorCount || 0}</div>
                  </div>
                </div>
              </div>

              {/* Дата создания */}
              {bot.createdAt && (
                <div className="text-xs text-white/40 text-center">
                  Создан {new Date(bot.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модалка удаления */}
      <DeleteBotModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        botName={bot?.username}
        onDelete={handleDelete}
      />

      {/* Toast */}
      <Toast
        open={toast.open}
        message={toast.message}
        tone={toast.tone}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}