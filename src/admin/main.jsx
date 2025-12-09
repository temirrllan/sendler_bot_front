// frontend/src/admin/main.jsx
import { createRoot } from "react-dom/client";
import AdminPanel from "./App";
import "../index.css";

// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  console.log("🚀 Initializing Telegram WebApp for Admin Panel");
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  
  // Устанавливаем цвета темы
  window.Telegram.WebApp.setHeaderColor('#0A0E27');
  window.Telegram.WebApp.setBackgroundColor('#0A0E27');
}

createRoot(document.getElementById("root")).render(<AdminPanel />);