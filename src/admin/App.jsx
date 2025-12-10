// frontend/src/admin/App.jsx
import { useState, useEffect } from 'react';
import { Menu, X, Users, Bot, Trash2, BarChart3, LogOut, ChevronRight, Search, Plus, Edit2, Power, PowerOff } from 'lucide-react';

// API helper
async function request(path, options = {}) {
  const initData = window.Telegram?.WebApp?.initData || "";
  const encoded = btoa(initData);
  
  const url = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'}${path}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": encoded,
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  
  const data = await res.json();
  return data.data || data;
}

// Компоненты
function Sidebar({ active, onNavigate, admin, onLogout, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'bots', icon: Bot, label: 'Bots' },
    { id: 'deleted', icon: Trash2, label: 'Deleted' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-white/10
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-lg font-semibold">Admin Panel</div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-colors text-left
                  ${active === item.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              {admin.avatarUrl ? (
                <img 
                  src={admin.avatarUrl} 
                  alt={admin.firstName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 grid place-items-center text-sm">
                  {admin.firstName?.[0] || 'A'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {admin.firstName} {admin.lastName}
                </div>
                <div className="text-xs text-white/50">
                  @{admin.username || admin.tgId}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Dashboard({ stats }) {
  const cards = [
    { label: 'Total Users', value: stats?.users?.total || 0, color: 'blue' },
    { label: 'Active Users', value: stats?.users?.active || 0, color: 'green' },
    { label: 'With Access', value: stats?.users?.withAccess || 0, color: 'purple' },
    { label: 'Total Bots', value: stats?.bots?.total || 0, color: 'orange' },
    { label: 'Active Bots', value: stats?.bots?.active || 0, color: 'green' },
    { label: 'Deleted Bots', value: stats?.bots?.deleted || 0, color: 'red' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900 rounded-2xl p-6 border border-white/10">
            <div className="text-sm text-white/60 mb-1">{card.label}</div>
            <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await request('/admin-panel/users?limit=100');
      setUsers(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter(u => 
    !search || 
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    String(u.tgId).includes(search)
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Пользователи</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/20"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-white/10 bg-slate-800/50">
            <div className="text-sm font-medium text-white/70">Пользователь</div>
            <div className="text-sm font-medium text-white/70">Юзернейм</div>
            <div className="text-sm font-medium text-white/70">Подписка</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-white/60 text-sm">
                Пользователи не найдены
              </div>
            ) : (
              filtered.map(user => (
                <div 
                  key={user._id} 
                  className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  {/* Пользователь */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 grid place-items-center text-sm font-medium shrink-0">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {user.firstName || user.lastName 
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : user.username || `User ${user.tgId}`
                        }
                      </div>
                      <div className="text-xs text-white/50">
                        ID: {user.tgId}
                      </div>
                    </div>
                  </div>

                  {/* Юзернейм */}
                  <div className="flex items-center">
                    <span className="text-white/80">
                      @{user.username || user.tgId}
                    </span>
                  </div>

                  {/* Подписка */}
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      user.hasAccess ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {user.hasAccess ? 'активна' : 'нет'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Counter */}
      {!loading && filtered.length > 0 && (
        <div className="text-sm text-white/50 text-center">
          Показано {filtered.length} из {users.length} пользователей
        </div>
      )}
    </div>
  );
}

function BotsPage({ onSelectBot }) {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBots();
  }, []);

  async function loadBots() {
    try {
      setLoading(true);
      const data = await request('/admin-panel/bots?limit=50');
      setBots(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = bots.filter(b => 
    !search || 
    b.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Боты</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени бота..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/20"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(bot => (
            <div 
              key={bot._id} 
              onClick={() => onSelectBot(bot._id)}
              className="bg-slate-900 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-slate-700/60 overflow-hidden shrink-0 ring-1 ring-white/10">
                  {bot.photoUrl ? (
                    <img 
                      src={bot.photoUrl}
                      alt={bot.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-white/40">
                      <Bot className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold truncate">
                        @{bot.username}
                      </div>
                      <div className="text-sm text-white/60">
                        {new Date(bot.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      bot.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border border-green-400/20'
                        : bot.status === 'blocked'
                        ? 'bg-red-500/10 text-red-400 border border-red-400/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-400/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        bot.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                      {bot.status === 'active' ? 'Готов' : bot.status === 'blocked' ? 'Приостановлен' : 'Неактивен'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span>📤 {bot.sentCount || 0}</span>
                    <span>❌ {bot.errorCount || 0}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white/40 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BotDetailPage({ botId, onBack }) {
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: '',
    messageText: '',
    interval: 3600,
    photoUrl: '',
    status: 'active'
  });

  const intervals = [
    { value: 3600, label: 'Каждый час' },
    { value: 7200, label: 'Каждые 2 часа' },
    { value: 10800, label: 'Каждые 3 часа' },
    { value: 14400, label: 'Каждые 4 часа' },
    { value: 18000, label: 'Каждые 5 часов' },
    { value: 21600, label: 'Каждые 6 часов' },
    { value: 43200, label: 'Каждые 12 часов' },
    { value: 86400, label: 'Раз в день' }
  ];

  useEffect(() => {
    loadBot();
  }, [botId]);

  async function loadBot() {
    try {
      setLoading(true);
      const data = await request(`/admin-panel/bots/${botId}`);
      setBot(data.bot);
      setForm({
        username: data.bot.username || '',
        messageText: data.bot.messageText || '',
        interval: data.bot.interval || 3600,
        photoUrl: data.bot.photoUrl || '',
        status: data.bot.status || 'active'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await request(`/admin/bots/${botId}/update`, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      await loadBot();
      setEditing(false);
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    try {
      const endpoint = bot.status === 'active' ? 'block' : 'unblock';
      await request(`/admin/bots/${botId}/${endpoint}`, { method: 'POST' });
      await loadBot();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12 text-white/60">Loading...</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12 text-white/60">Bot not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold">Детали бота</h1>
      </div>

      {/* Bot Card */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden shrink-0 ring-2 ring-white/10">
            {(editing ? form.photoUrl : bot.photoUrl) ? (
              <img 
                src={editing ? form.photoUrl : bot.photoUrl}
                alt={editing ? form.username : bot.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/40">
                <Bot className="h-7 w-7" />
              </div>
            )}
          </div>

          {/* Name & Status */}
          <div className="flex-1 min-w-0">
            <div className="text-xl font-semibold truncate">
              @{editing ? form.username : bot.username}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 text-sm ${
                bot.status === 'active' ? 'text-green-400' : 'text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  bot.status === 'active' ? 'bg-green-400' : 'bg-slate-500'
                }`} />
                {bot.status === 'active' ? 'Активен' : 'Остановлен'}
              </span>
            </div>
          </div>

          {/* Actions */}
          {!editing && (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleStatus}
                className={`p-2 rounded-xl border transition-colors ${
                  bot.status === 'active'
                    ? 'border-red-400/30 text-red-400 hover:bg-red-500/10'
                    : 'border-green-400/30 text-green-400 hover:bg-green-500/10'
                }`}
              >
                {bot.status === 'active' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {editing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm text-white/80 hover:text-white transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          )}
        </div>

        {/* Form / Display */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={form.photoUrl}
                onChange={e => setForm({ ...form, photoUrl: e.target.value })}
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Message Text
              </label>
              <textarea
                value={form.messageText}
                onChange={e => setForm({ ...form, messageText: e.target.value })}
                rows={5}
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Interval
              </label>
              <select
                value={form.interval}
                onChange={e => setForm({ ...form, interval: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-white/20 transition cursor-pointer"
              >
                {intervals.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-sm text-white/70 mb-2">Message</div>
              <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {bot.messageText || '—'}
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-sm text-white/70 mb-2">Interval</div>
              <div className="text-white font-medium">
                {intervals.find(i => i.value === bot.interval)?.label || '—'}
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4">
              <div className="text-sm text-white/70 mb-3">Statistics</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-white/50 mb-1">Sent</div>
                  <div className="text-lg font-semibold">{bot.sentCount || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Errors</div>
                  <div className="text-lg font-semibold">{bot.errorCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeletedBotsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBots();
  }, []);

  async function loadBots() {
    try {
      setLoading(true);
      const data = await request('/admin-panel/bots/deleted?limit=50');
      setBots(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Deleted Bots</h1>

      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : bots.length === 0 ? (
        <div className="text-center py-12 text-white/60">No deleted bots</div>
      ) : (
        <div className="space-y-2">
          {bots.map(bot => (
            <div key={bot._id} className="bg-slate-900 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">@{bot.username}</div>
                  <div className="text-sm text-white/60">
                    Deleted by: {bot.deletedByType}
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  {new Date(bot.deletedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App
export default function AdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState('bots');
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      
      const [adminData, statsData] = await Promise.all([
        request('/admin-panel/me'),
        request('/admin-panel/stats'),
      ]);
      
      setAdmin(adminData.admin);
      setStats(statsData);
    } catch (e) {
      console.error("Load error:", e);
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      alert('Logout');
    }
  }

  function handleNavigate(newPage) {
    setPage(newPage);
    setSelectedBotId(null);
  }

  function handleSelectBot(botId) {
    setSelectedBotId(botId);
  }

  function handleBackFromBot() {
    setSelectedBotId(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] text-white grid place-items-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3" />
          <div className="text-sm text-white/60">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E27] text-white grid place-items-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error</div>
          <div className="text-white/70 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex">
      <Sidebar
        active={page}
        onNavigate={handleNavigate}
        admin={admin}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-lg font-semibold">Admin Panel</div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedBotId ? (
            <BotDetailPage botId={selectedBotId} onBack={handleBackFromBot} />
          ) : (
            <>
              {page === 'dashboard' && <Dashboard stats={stats} />}
              {page === 'users' && <UsersPage />}
              {page === 'bots' && <BotsPage onSelectBot={handleSelectBot} />}
              {page === 'deleted' && <DeletedBotsPage />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}