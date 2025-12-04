// frontend/src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ Импортируем инициализацию Telegram WebApp
import { initTelegramWebApp } from "./lib/telegram";

// ✅ Инициализируем Telegram WebApp перед рендером
initTelegramWebApp();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);