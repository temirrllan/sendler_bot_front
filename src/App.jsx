import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStore";

import BotsList from "./pages/BotsList";
import AddGroup from "./pages/AddGroup";
import BotDetail from "./pages/BotDetail";
import BotCreate from "./pages/BotCreate";
import DeletedBots from "./pages/DeletedBots";

/** Примитивный ErrorBoundary, чтобы не было "пустого экрана" */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }
  componentDidCatch(err, info) {
    console.error("UI error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center p-6 bg-slate-950 text-slate-100">
          <div className="max-w-sm text-center">
            <div className="text-xl font-semibold mb-2">Что-то пошло не так</div>
            <div className="text-white/70 text-sm break-all">
              {String(this.state.err)}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppStoreProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Routes>
            <Route path="/" element={<BotsList />} />
            <Route path="/create" element={<BotCreate />} />
            <Route path="/bot/:id" element={<BotDetail />} />
            <Route path="/bot/:id/add-group" element={<AddGroup />} />
            {/* Фолбэк на главную для любых других путей */}
            <Route path="/deleted" element={<DeletedBots />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </AppStoreProvider>
  );
}
