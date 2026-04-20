import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { dark, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1E3A5F] dark:bg-[#0B0F17] text-white shadow-lg border-b border-transparent dark:border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="w-7 h-7 text-emerald-400 dark:text-[#4ade80]" />
            INSAF CHAIN
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`hover:text-emerald-300 dark:hover:text-[#86efac] transition ${isActive('/') ? 'text-emerald-400 dark:text-[#4ade80]' : ''}`}>
              Home
            </Link>
            <Link to="/submit-report" className={`hover:text-emerald-300 dark:hover:text-[#86efac] transition ${isActive('/submit-report') ? 'text-emerald-400 dark:text-[#4ade80]' : ''}`}>
              Submit Report
            </Link>
            <Link to="/track-report" className={`hover:text-emerald-300 dark:hover:text-[#86efac] transition ${isActive('/track-report') ? 'text-emerald-400 dark:text-[#4ade80]' : ''}`}>
              Track Report
            </Link>
            <Link to="/verify" className={`hover:text-emerald-300 dark:hover:text-[#86efac] transition ${isActive('/verify') ? 'text-emerald-400 dark:text-[#4ade80]' : ''}`}>
              Verify
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition" title="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="bg-emerald-500 dark:bg-[#4ade80] hover:bg-emerald-600 dark:hover:bg-[#22c55e] px-4 py-2 rounded-lg text-sm font-medium transition">
              Stakeholder Login
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block hover:text-emerald-300 dark:hover:text-[#86efac]" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/submit-report" className="block hover:text-emerald-300 dark:hover:text-[#86efac]" onClick={() => setMenuOpen(false)}>Submit Report</Link>
            <Link to="/track-report" className="block hover:text-emerald-300 dark:hover:text-[#86efac]" onClick={() => setMenuOpen(false)}>Track Report</Link>
            <Link to="/verify" className="block hover:text-emerald-300 dark:hover:text-[#86efac]" onClick={() => setMenuOpen(false)}>Verify</Link>
            <Link to="/login" className="block bg-emerald-500 dark:bg-[#4ade80] hover:bg-emerald-600 dark:hover:bg-[#22c55e] px-4 py-2 rounded-lg text-sm font-medium text-center" onClick={() => setMenuOpen(false)}>Stakeholder Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
