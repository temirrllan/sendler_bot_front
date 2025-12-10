// frontend/src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import App from "./App";
import AdminPanel from "./admin/App";
import "./index.css";
import { initTelegramWebApp } from "./lib/telegram";
import { apiGetMe } from "./api";

initTelegramWebApp();

function Root() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        console.log("🔄 Loading user profile...");
        const data = await apiGetMe();
        
        // ✅ ВАЖНО: apiGetMe возвращает { user: {...} }
        const userData = data?.user;
        
        console.log("✅ User loaded:", {
          tgId: userData?.tgId,
          username: userData?.username,
          isAdmin: userData?.isAdmin,
          rawData: userData, // полный объект для дебага
        });
        
        setUser(userData);
      } catch (err) {
        console.error("❌ Failed to load user:", err);
        setError(err.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, []);

  // Загрузка
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] text-white grid place-items-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3" />
          <div className="text-sm text-white/60">Загрузка...</div>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E27] text-white grid place-items-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-red-400 text-lg font-semibold mb-2">Ошибка</div>
          <div className="text-white/70 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  // ✅ ПРОВЕРКА: Выводим в консоль перед рендером
  console.log("🎯 Render decision:", {
    isAdmin: user?.isAdmin,
    userObject: user,
  });

  // ✅ Админ-панель для админов (строгая проверка)
  if (user?.isAdmin === true) {
    console.log("👑 Rendering Admin Panel for:", user.username);
    return <AdminPanel />;
  }

  // ✅ Обычное приложение для пользователей
  console.log("👤 Rendering User App for:", user?.username);
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);