// frontend/public/telegram-web-app.js
// Fallback скрипт для Safari и старых браузеров
// Telegram WebApp SDK обычно загружается через CDN в index.html

if (!window.Telegram) {
  window.Telegram = {
    WebApp: {
      initData: '',
      initDataUnsafe: {},
      version: '6.0',
      platform: 'unknown',
      colorScheme: 'dark',
      themeParams: {},
      isExpanded: false,
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      headerColor: '#000000',
      backgroundColor: '#000000',
      isClosingConfirmationEnabled: false,
      BackButton: { isVisible: false, onClick: function() {}, offClick: function() {}, show: function() {}, hide: function() {} },
      MainButton: { text: '', color: '', textColor: '', isVisible: false, isActive: true, isProgressVisible: false, setText: function() {}, onClick: function() {}, offClick: function() {}, show: function() {}, hide: function() {}, enable: function() {}, disable: function() {}, showProgress: function() {}, hideProgress: function() {} },
      HapticFeedback: { impactOccurred: function() {}, notificationOccurred: function() {}, selectionChanged: function() {} },
      ready: function() { console.log('Telegram WebApp fallback loaded'); },
      expand: function() {},
      close: function() {},
      sendData: function() {},
      openLink: function() {},
      openTelegramLink: function() {},
      showPopup: function() {},
      showAlert: function(message) { alert(message); },
      showConfirm: function(message, callback) { callback(confirm(message)); },
      enableClosingConfirmation: function() {},
      disableClosingConfirmation: function() {},
    }
  };
  console.warn('⚠️ Telegram WebApp SDK not loaded, using fallback');
}