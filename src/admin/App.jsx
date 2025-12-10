// frontend/src/admin/App.jsx
import { useState, useEffect } from 'react';
import { Menu, X, Users, Bot, Trash2, BarChart3, LogOut } from 'lucide-react';

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
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-white/10
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-lg font-semibold">Admin Panel</div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu */}
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

          {/* Admin profile */}
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
      const data = await request('/admin-panel/users?limit=50');
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
    String(u.tgId).includes(search)
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/20"
      />

      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user._id} className="bg-slate-900 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-white/60">
                    @{user.username || user.tgId}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.hasAccess 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {user.hasAccess ? 'Access' : 'No Access'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'active' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BotsPage() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bots</h1>

      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <div className="space-y-2">
          {bots.map(bot => (
            <div key={bot._id} className="bg-slate-900 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">@{bot.username}</div>
                  <div className="text-sm text-white/60">
                    Owner: @{bot.owner?.username || bot.owner?.tgId}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-white/60">
                    📤 {bot.sentCount || 0}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bot.status === 'active' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {bot.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
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
      
      console.log("✅ Admin data loaded:", adminData);
      console.log("✅ Stats loaded:", statsData);
      
      setAdmin(adminData.admin);
      setStats(statsData);
    } catch (e) {
      console.error("❌ Load error:", e);
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
      {/* Sidebar */}
      <Sidebar
        active={page}
        onNavigate={setPage}
        admin={admin}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-lg font-semibold">Admin Panel</div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {page === 'dashboard' && <Dashboard stats={stats} />}
          {page === 'users' && <UsersPage />}
          {page === 'bots' && <BotsPage />}
          {page === 'deleted' && <DeletedBotsPage />}
        </div>
      </div>
    </div>
  );
}