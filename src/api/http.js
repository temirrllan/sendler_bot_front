// src/api/http.js
import { BACKEND_URL } from "./config";

/**
 * DEV: сюда можно вписать токен мини-аппы (base64 initData),
 * как у тебя был DEFAULT_MINI_TOKEN.
 * Если оставить пустым — будет смотреть в localStorage.
 */


// сделай так:
const DEV_MINI_TOKEN =
  "dXNlcj0lN0IlMjJpZCUyMiUzQTEwMDEzNDE2NTUlMkMlMjJpc19ib3QlMjIlM0FmYWxzZSUyQyUyMmZpcnN0X25hbWUlMjIlM0ElMjJBcnRlbSUyMiUyQyUyMmxhc3RfbmFtZSUyMiUzQSUyMiUyMiUyQyUyMnVzZXJuYW1lJTIyJTNBJTIyRWRpdGg1MDklMjIlMkMlMjJsYW5ndWFnZV9jb2RlJTIyJTNBJTIycnUlMjIlMkMlMjJwaG90b191cmwlMjIlM0ElMjJodHRwcyUzQSUyRiUyRmFwaS50ZWxlZ3JhbS5vcmclMkZmaWxlJTJGYnV0ODM1MzM5ODY2MiUzQUFBSHY2bXVFSU5yY1lHTHN3Yk5jMzNGbUZXWEtMcVVqOGZZJTJGcGhvdG9zJTJGcGlsZV8zLmpwZyUyMiU3RCZhdXRoX2RhdGU9MTc2NDI2NjAyNSZoYXNoPWZha2VfZGV2X2hhc2g=";

/**
 * Берём dev-токен:
 * 1) из DEV_MINI_TOKEN (если не пустой)
 * 2) из localStorage.dev_mini_token
 */
function getDevMiniToken() {
  if (DEV_MINI_TOKEN && DEV_MINI_TOKEN.trim()) {
    return DEV_MINI_TOKEN.trim();
  }

  const fromStorage = localStorage.getItem("dev_mini_token");
  if (fromStorage && fromStorage.trim()) {
    return fromStorage.trim();
  }

  return "";
}

/**
 * Достаём initData из Telegram WebApp (боевой режим).
 * Если фронт реально открыт внутри мини-аппы — будет window.Telegram.WebApp.initData
 */
function getTelegramInitData() {
  const tgInit = window?.Telegram?.WebApp?.initData;
  if (tgInit && tgInit.trim()) return tgInit.trim();

  // на всякий случай: можно заранее сохранить raw initData сюда
  const fromStorage = localStorage.getItem("tg_init_data");
  if (fromStorage && fromStorage.trim()) return fromStorage.trim();

  return "";
}

/** Формируем заголовок Authorization */
function getAuthHeader() {
  // 1) DEV-режим: готовый base64-токен (как DEFAULT_MINI_TOKEN раньше)
  const devToken = getDevMiniToken();
  if (devToken) {
    // Бэк ждёт просто base64(initData)
    return { Authorization: devToken };
  }

  // 2) Боевой режим: берём raw initData и кодируем в base64
  const initData = getTelegramInitData();
  if (initData) {
    const b64 = window.btoa(initData);
    return { Authorization: b64 };
  }

  // 3) Без авторизации
  return {};
}

/**
 * Универсальная функция запросов
 */
export async function request(path, options = {}) {
  const url = `${BACKEND_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    // чтобы ngrok не подсовывал свою HTML-страницу
    "ngrok-skip-browser-warning": "true",
    ...(options.headers || {}),
    ...getAuthHeader(),
  };

  console.log("[HTTP] REQUEST:", { url, headers, options });

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e) {
    console.error("[HTTP] FETCH ERROR:", e);
    throw e;
  }

  console.log("[HTTP] RESPONSE STATUS:", res.status);

  const text = await res.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("[HTTP] NOT JSON RESPONSE, RAW TEXT:", text.slice(0, 300));
    throw new Error(
      "Сервер вернул не JSON (скорее всего, HTML-страницу ngrok)."
    );
  }

  console.log("[HTTP] JSON BODY:", json);

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.data?.message ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  // Бэк всегда кладёт полезные данные в data
  return json?.data;
}
