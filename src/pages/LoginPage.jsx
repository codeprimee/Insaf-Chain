import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios-config';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('insafchain_token', token);
        localStorage.setItem('insafchain_user', JSON.stringify(user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-[#1E3A5F] dark:bg-[#4ade80]/15 p-3 rounded-full dark:shadow-lg dark:shadow-[#4ade80]/20">
              <Shield className="w-8 h-8 text-emerald-400 dark:text-[#4ade80]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">Stakeholder Login</h1>
          <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mt-1">Access the INSAF CHAIN dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-gray-200 dark:border-[#1F2937]/60 p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 dark:text-[#9CA3AF] mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-[#6B7280]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.com"
                className="w-full border border-gray-300 dark:border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280] transition-all duration-200" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 dark:text-[#9CA3AF] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-[#6B7280]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                className="w-full border border-gray-300 dark:border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280] transition-all duration-200" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#1E3A5F] dark:bg-[#4ade80] hover:bg-[#162d4a] dark:hover:bg-[#22c55e] text-white dark:text-[#0a0f1a] py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 shadow-md dark:shadow-[#4ade80]/20 hover:shadow-lg active:scale-[0.98]">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-[#6B7280] mt-4">
          Only authorized stakeholders and admins can access the dashboard.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
