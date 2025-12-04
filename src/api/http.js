// frontend/src/api/http.js
import { getInitData, isTelegramWebApp } from "../lib/telegram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

console.log("🔧 Backend URL:", BACKEND_URL);

/**
 * Получить Authorization header
 */
function getAuthHeader() {
  if (!isTelegramWebApp()) {
    console.warn("⚠️ Not running in Telegram WebApp");
    return {};
  }

  const initData = getInitData();
  
  if (!initData || !initData.trim()) {
    console.error("❌ initData is empty!");
    return {};
  }

  try {
    const encoded = btoa(initData);
    
    console.log("✅ Auth header created:", {
      initDataLength: initData.length,
      encodedLength: encoded.length,
      initDataPreview: initData.slice(0, 50) + "...",
      encodedPreview: encoded.slice(0, 50) + "..."
    });
    
    return { Authorization: encoded };
  } catch (error) {
    console.error("❌ Failed to encode initData:", error);
    return {};
  }
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

  console.log("📤 [HTTP REQUEST]:", {
    method: options.method || "GET",
    url,
    hasAuth: !!headers.Authorization,
    authPreview: headers.Authorization ? `${headers.Authorization.slice(0, 30)}...` : "MISSING"
  });

  let res;
  try {
    res = await fetch(url, { 
      ...options, 
      headers,
      credentials: 'include' // важно для cookies если будут
    });
  } catch (e) {
    console.error("❌ [FETCH ERROR]:", e);
    throw new Error("Не удалось подключиться к серверу");
  }

  console.log("📥 [HTTP RESPONSE]:", {
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get("content-type")
  });

  // Получаем текст ответа
  const text = await res.text();
  
  console.log("📄 [RESPONSE BODY]:", {
    length: text.length,
    preview: text.slice(0, 200),
  });

  // Пытаемся распарсить JSON
  let json = null;

  if (text) {
    try {
      json = JSON.parse(text);
      console.log("✅ [JSON PARSED]:", json);
    } catch (e) {
      console.error("❌ [JSON PARSE ERROR]:", {
        error: e.message,
        text: text.slice(0, 200)
      });
      
      // Если это HTML (404 страница), показываем понятную ошибку
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new Error(`Эндпоинт не найден: ${path}`);
      }
      
      throw new Error(`Сервер вернул некорректный ответ`);
    }
  }

  // Обработка ошибок
  if (!res.ok) {
    const message = json?.message || json?.data?.message || `HTTP ${res.status}`;
    console.error("❌ [HTTP ERROR]:", { status: res.status, message, json });
    const err = new Error(message);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  // Backend возвращает { status, message, data }
  return json?.data || json;
}