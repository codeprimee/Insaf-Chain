import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, ScrollText, AlertTriangle,
  Download, LogOut, Shield, Menu, X, Sun, Moon, ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem('insafchain_user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('insafchain_token');
    localStorage.removeItem('insafchain_user');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/reports', label: 'Reports', icon: FileText },
    { path: '/dashboard/compromised', label: 'Compromised', icon: ShieldAlert },
    { path: '/dashboard/export', label: 'Export Data', icon: Download },
  ];

  if (isAdmin) {
    navItems.push(
      { path: '/dashboard/users', label: 'Manage Users', icon: Users },
      { path: '/dashboard/flagged', label: 'Flagged Reports', icon: AlertTriangle },
      { path: '/dashboard/logs', label: 'Audit Logs', icon: ScrollText },
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0B0F17] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#1E3A5F] dark:bg-[#0B0F17] text-white border-r border-transparent dark:border-[#1F2937]">
        <div className="p-5 border-b border-white/10 dark:border-[#1F2937]">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Shield className="w-6 h-6 text-emerald-400 dark:text-[#4ade80]" />
            INSAF CHAIN
          </div>
          <span className="text-xs text-slate-300 dark:text-[#6B7280] mt-1 block">Dashboard</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  active
                    ? 'bg-white/15 dark:bg-[#4ade80]/15 text-white font-medium shadow-sm dark:shadow-[#4ade80]/10 border-l-2 border-white dark:border-[#4ade80]'
                    : 'text-slate-300 dark:text-[#9CA3AF] hover:bg-white/10 dark:hover:bg-[#1F2937] hover:text-white hover:translate-x-1 active:scale-95'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white dark:text-[#4ade80]' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Controls */}
        <div className="p-4 border-t border-white/10 dark:border-[#1F2937]">
          <div className="mb-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-300 dark:text-[#6B7280]">{user.role === 'admin' ? 'Administrator' : 'Stakeholder'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-[#1F2937] transition-all duration-200 active:scale-90"
              title="Toggle theme"
            >
              {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1E3A5F] dark:bg-[#0B0F17] text-white z-30 px-4 py-3 flex items-center justify-between border-b border-transparent dark:border-[#1F2937]">
        <div className="flex items-center gap-2 font-bold">
          <Shield className="w-5 h-5 text-emerald-400 dark:text-[#4ade80]" />
          INSAF CHAIN
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition active:scale-90">
            {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#1E3A5F] dark:bg-[#0B0F17] text-white pt-16 px-3 py-4 border-r border-transparent dark:border-[#1F2937]">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      active
                        ? 'bg-white/15 dark:bg-[#4ade80]/15 text-white font-medium'
                        : 'text-slate-300 dark:text-[#9CA3AF] hover:bg-white/10 dark:hover:bg-[#1F2937] active:scale-95'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 px-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14 bg-gray-50 dark:bg-[#0F1219]">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
