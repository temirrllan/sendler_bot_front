import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiCreateBot } from "../api";

export default function BotCreate() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BOT_PRICE = process.env.BOT_PRICE || "2";

  async function handleSubmit() {
    if (!firstName.trim()) {
      setError("Введите имя бота");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Собираем username из firstName и secondName
      const username = `${firstName.trim()}${secondName.trim() ? " " + secondName.trim() : ""}`;
      
      const data = await apiCreateBot({
        username,
        messageText: description.trim() || "Бот для рассылки",
        interval: 3600, // по умолчанию 1 час
        photoUrl: null,
      });

      // Переходим на страницу созданного бота
      navigate(`/bot/${data.bot._id}`);
    } catch (e) {
      console.error(e);
      
      if (e.status === 402) {
        setError("Нужно купить доступ");
      } else {
        setError(e.message || "Ошибка создания бота");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex flex-col">
      {/* Хедер */}
      <div className="border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
          
          <div className="text-base font-semibold">
            Создать бота
          </div>
          
          <div className="w-16" /> {/* Spacer для центрирования заголовка */}
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-5">
        {/* First name */}
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-2">
            First name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Например, Кристина"
            className="w-full h-12 rounded-2xl bg-[#1a1f3a] border border-white/5 px-4 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Second name (optional) */}
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-2">
            Second name (optional)
          </label>
          <input
            type="text"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
            placeholder="Например, 😘"
            className="w-full h-12 rounded-2xl bg-[#1a1f3a] border border-white/5 px-4 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Description (optional) */}
        <div className="mb-5">
          <label className="block text-sm text-white/70 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Короткое описание бота"
            rows={4}
            className="w-full rounded-2xl bg-[#1a1f3a] border border-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none"
          />
        </div>

        {/* Цена бота */}
        <div className="text-sm text-white/50">
          Цена бота: ${BOT_PRICE}
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Кнопка создания */}
      <div className="border-t border-white/5">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !firstName.trim()}
            className="w-full h-[52px] rounded-2xl bg-white text-[#0A0E27] font-semibold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
          >
            {loading ? "Создаём..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}