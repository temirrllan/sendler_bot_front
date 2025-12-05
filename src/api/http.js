// frontend/src/api/http.js
import { getInitData, isTelegramWebApp } from "../lib/telegram";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

console.log("🔧 Backend URL:", BACKEND_URL);

/**
 * Получить Authorization header с base64-encoded initData
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
    // Кодируем initData в base64
    const encoded = btoa(initData);
    
    console.log("✅ Auth header created:", {
      initDataLength: initData.length,
      encodedLength: encoded.length,
      initDataPreview: initData.slice(0, 50) + "...",
      encodedPreview: encoded.slice(0, 50) + "...",
    });
    
    return { Authorization: encoded };
  } catch (error) {
    console.error("❌ Failed to encode initData:", error);
    return {};
  }
}

/**
 * Универсальная функция для API запросов
 * 
 * @param {string} path - путь к API эндпоинту
 * @param {RequestInit} options - опции fetch
 * @returns {Promise<any>} - данные от сервера
 */
export async function request(path, options = {}) {
  const url = `${BACKEND_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(options.headers || {}),
    ...getAuthHeader(), // ← добавляем Authorization
  };

  console.log("📤 [HTTP] Request:", {
    method: options.method || "GET",
    url,
    hasAuth: !!headers.Authorization,
    authPreview: headers.Authorization 
      ? `${headers.Authorization.slice(0, 30)}...` 
      : "MISSING",
  });

  let res;
  try {
    res = await fetch(url, { 
      ...options, 
      headers,
      credentials: 'include', // для cookies
    });
  } catch (fetchError) {
    console.error("❌ [HTTP] Fetch error:", fetchError);
    throw new Error("Не удалось подключиться к серверу");
  }

  console.log("📥 [HTTP] Response:", {
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get("content-type"),
  });

  // Получаем текст ответа
  const text = await res.text();
  
  console.log("📄 [HTTP] Response body:", {
    length: text.length,
    preview: text.slice(0, 200),
  });

  // Парсим JSON
  let json = null;

  if (text) {
    try {
      json = JSON.parse(text);
      console.log("✅ [HTTP] JSON parsed:", json);
    } catch (parseError) {
      console.error("❌ [HTTP] JSON parse error:", {
        error: parseError.message,
        text: text.slice(0, 200),
      });
      
      // HTML = 404 страница
      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new Error(`Эндпоинт не найден: ${path}`);
      }
      
      throw new Error(`Сервер вернул некорректный ответ`);
    }
  }

  // Обработка HTTP ошибок
  if (!res.ok) {
    const message = json?.message || json?.data?.message || `HTTP ${res.status}`;
    console.error("❌ [HTTP] Error:", { 
      status: res.status, 
      message, 
      json,
    });
    
    const err = new Error(message);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  // Возвращаем data из { status, message, data }
  return json?.data || json;
}