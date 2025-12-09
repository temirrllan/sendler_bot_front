// src/components/DevAccessToggle.jsx
import { useState } from "react";
import { apiGrantAccessDev } from "../api";

/**
 * DEV-компонент для переключения доступа в разработке
 * Показывается только если NODE_ENV !== 'production'
 */
export default function DevAccessToggle({ hasAccess, onAccessChanged }) {
  const [loading, setLoading] = useState(false);

  const isProd = import.meta.env.PROD;
  
  // В проде не показываем
  if (isProd) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await apiGrantAccessDev();
      console.log("✅ Access granted");
      
      // Вызываем callback для обновления UI
      if (onAccessChanged) {
        onAccessChanged(true);
      }
    } catch (e) {
      console.error("❌ Failed to grant access:", e);
      alert("Ошибка: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={handleToggle}
        disabled={loading || hasAccess}
        className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-medium shadow-lg disabled:opacity-50 hover:bg-purple-700 transition-colors"
      >
        {loading ? "⏳ Активация..." : hasAccess ? "✅ Доступ активен" : "🔓 [DEV] Активировать доступ"}
      </button>
    </div>
  );
}