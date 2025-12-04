// frontend/src/api/http.js
import { getInitData, isTelegramWebApp } from "../lib/telegram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

console.log("🔧 Backend URL:", BACKEND_URL);

/**
 * Получить Authorization header
 */
function getAuthHeader() {
  if (isTelegramWebApp()) {
    const initData = getInitData();
    
    if (initData && initData.trim()) {
      const encoded = window.btoa(initData);
      console.log("✅ Auth header created:", {
        initDataLength: initData.length,
        encodedLength: encoded.length,
        initDataStart: initData.slice(0, 50),
        encodedStart: encoded.slice(0, 50)
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

  console.log("📤 [HTTP REQUEST]:", {
    method: options.method || "GET",
    url,
    hasAuth: !!headers.Authorization,
    headers: {
      ...headers,
      Authorization: headers.Authorization ? `${headers.Authorization.slice(0, 30)}...` : "MISSING"
    }
  });

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e) {
    console.error("❌ [FETCH ERROR]:", e);
    throw new Error("Не удалось подключиться к серверу");
  }

  console.log("📥 [HTTP RESPONSE]:", {
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries())
  });

  // Получаем текст ответа
  const text = await res.text();
  
  console.log("📄 [RESPONSE BODY]:", {
    length: text.length,
    contentType: res.headers.get("content-type"),
    preview: text.slice(0, 500),
    fullText: text // ⬅️ ПОЛНЫЙ текст для отладки
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
        text: text.slice(0, 500)
      });
      throw new Error(`Сервер вернул некорректный ответ: ${text.slice(0, 100)}`);
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

  // Бэк возвращает { status, message, data }
  return json?.data || json;
}