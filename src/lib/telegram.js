// frontend/src/lib/telegram.js

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
  const tg = getTelegramWebApp();
  const hasInitData = !!tg?.initData && tg.initData.length > 0;
  
  console.log("🔍 isTelegramWebApp:", { 
    hasTelegram: !!tg, 
    hasInitData,
    initDataLength: tg?.initData?.length || 0,
    platform: tg?.platform,
    version: tg?.version
  });
  
  return !!tg && hasInitData;
}

/**
 * Получить initData (валидированная строка от Telegram)
 */
export function getInitData() {
  const tg = getTelegramWebApp();
  const initData = tg?.initData || "";
  
  console.log("🔑 getInitData:", {
    length: initData.length,
    preview: initData.slice(0, 100) + (initData.length > 100 ? "..." : ""),
    hasHash: initData.includes("hash="),
    hasUser: initData.includes("user=")
  });
  
  return initData;
}

/**
 * Получить объект пользователя из Telegram
 */
export function getTelegramUser() {
  const tg = getTelegramWebApp();
  const user = tg?.initDataUnsafe?.user || null;
  
  console.log("👤 getTelegramUser:", user);
  
  return user;
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

  const params = tg.themeParams;
  console.log("🎨 Telegram theme params:", params);
}

/**
 * Развернуть WebApp на весь экран
 */
export function expandWebApp() {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  console.log("📱 Expanding WebApp...");
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

  console.log("✅ Telegram WebApp initialized", {
    user: getTelegramUser(),
    platform: tg.platform,
    version: tg.version,
    initDataLength: tg.initData?.length || 0
  });

  // Сообщаем Telegram что приложение готово
  tg.ready();
  
  // Разворачиваем на весь экран
  expandWebApp();
  
  // Применяем тему
  setThemeParams();

  return true;
}