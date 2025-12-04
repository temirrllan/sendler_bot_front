// frontend/src/api/http.js
import { getInitData, isTelegramWebApp } from "../lib/telegram";

/**
 * Backend URL (автоматически определяется из .env)
 */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

console.log("🔧 Backend URL:", BACKEND_URL);

/**
 * Получить Authorization header
 */
function getAuthHeader() {
  // ✅ В production и dev используем initData из Telegram WebApp
  if (isTelegramWebApp()) {
    const initData = getInitData();
    
    if (initData && initData.trim()) {
      // Кодируем initData в base64 (как ожидает backend)
      const encoded = window.btoa(initData);
      console.log("✅ Using Telegram initData:", {
        raw: initData.slice(0, 50) + "...",
        encoded: encoded.slice(0, 50) + "..."
      });
      return { Authorization: encoded };
    } else {
      console.warn("⚠️ initData is empty!");
    }
  } else {
    console.warn("⚠️ Not running in Telegram WebApp");
  }

  console.error("❌ No auth token available!");
  return {};
}

/**
 * Универсальная функция для API запросов
 */
export async function request(path, options = {}) {
  const url = `${BACKEND_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(options.headers || {}),
    ...getAuthHeader(),
  };

  console.log("[HTTP] REQUEST:", {
    method: options.method || "GET",
    url,
    hasAuth: !!headers.Authorization,
    authPreview: headers.Authorization ? headers.Authorization.slice(0, 30) + "..." : "none"
  });

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e) {
    console.error("[HTTP] FETCH ERROR:", e);
    throw new Error("Не удалось подключиться к серверу");
  }

  console.log("[HTTP] RESPONSE:", res.status, res.statusText);

  // Пытаемся распарсить JSON
  const text = await res.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("[HTTP] NOT JSON RESPONSE:", text.slice(0, 300));
    throw new Error("Сервер вернул некорректный ответ");
  }

  // Обработка ошибок
  if (!res.ok) {
    const message = json?.message || json?.data?.message || `HTTP ${res.status}`;
    console.error("[HTTP] ERROR:", { status: res.status, message, json });
    const err = new Error(message);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  // Бэк всегда возвращает { status, message, data }
  return json?.data || json;
}