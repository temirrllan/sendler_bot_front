// frontend/src/lib/telegram.js

/**
 * Утилиты для работы с Telegram WebApp
 */

/**
 * Проверка что Telegram WebApp SDK загружен
 */
function waitForTelegram(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window?.Telegram?.WebApp) {
      resolve(window.Telegram.WebApp);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window?.Telegram?.WebApp) {
        clearInterval(interval);
        resolve(window.Telegram.WebApp);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error("Telegram WebApp SDK not loaded"));
      }
    }, 100);
  });
}

/**
 * Получить объект Telegram WebApp
 */
export function getTelegramWebApp() {
  return window?.Telegram?.WebApp || null;
}

/**
 * Проверка что приложение запущено в Telegram
 */
export function isTelegramWebApp() {
  return !!getTelegramWebApp();
}

/**
 * Получить initData (валидированная строка от Telegram)
 */
export function getInitData() {
  const tg = getTelegramWebApp();
  return tg?.initData || "";
}

/**
 * Получить объект пользователя из Telegram
 */
export function getTelegramUser() {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
}

/**
 * Показать главную кнопку
 */
export function showMainButton(text, onClick) {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
}

/**
 * Скрыть главную кнопку
 */
export function hideMainButton() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.MainButton.hide();
}

/**
 * Установить цвет темы приложения
 */
export function setThemeParams() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  // Telegram передаёт цвета темы автоматически
  const params = tg.themeParams;
  
  // Можно использовать для кастомизации
  console.log("Telegram theme params:", params);
}

/**
 * Развернуть WebApp на весь экран
 */
export function expandWebApp() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.expand();
}

/**
 * Показать подтверждение перед закрытием
 */
export function enableClosingConfirmation() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.enableClosingConfirmation();
}

/**
 * Закрыть WebApp
 */
export function closeWebApp() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.close();
}

/**
 * Отправить данные боту (через data query)
 */
export function sendDataToBot(data) {
  const tg = getTelegramWebApp();
  if (!tg) return;

  tg.sendData(JSON.stringify(data));
}

/**
 * Показать всплывающее уведомление
 */
export function showAlert(message) {
  const tg = getTelegramWebApp();
  if (!tg) {
    alert(message);
    return;
  }

  tg.showAlert(message);
}

/**
 * Показать всплывающее подтверждение
 */
export function showConfirm(message, callback) {
  const tg = getTelegramWebApp();
  if (!tg) {
    const result = confirm(message);
    callback(result);
    return;
  }

  tg.showConfirm(message, callback);
}

/**
 * Haptic feedback (вибрация)
 */
export function hapticFeedback(type = "medium") {
  const tg = getTelegramWebApp();
  if (!tg?.HapticFeedback) return;

  // type: "light" | "medium" | "heavy" | "rigid" | "soft"
  tg.HapticFeedback.impactOccurred(type);
}

/**
 * Инициализация WebApp при загрузке приложения
 */
export function initTelegramWebApp() {
  const tg = getTelegramWebApp();
  
  if (!tg) {
    console.warn("⚠️ Not running inside Telegram WebApp");
    return false;
  }

  // Сообщаем Telegram что приложение готово
  tg.ready();
  
  // Разворачиваем на весь экран
  expandWebApp();
  
  // Применяем тему
  setThemeParams();
  
  console.log("✅ Telegram WebApp initialized", {
    user: getTelegramUser(),
    platform: tg.platform,
    version: tg.version,
  });

  return true;
}