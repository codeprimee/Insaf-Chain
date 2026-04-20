import { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Brain, TrendingUp, ShieldCheck, ShieldAlert, Database } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import api from '../../api/axios-config';

const PIE_COLORS = ['#EF4444', '#F59E0B', '#F97316', '#8B5CF6', '#64748B'];

function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStats(); fetchIntegrity(); }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) setStats(response.data.data);
    } catch (err) { setError('Failed to load dashboard data.'); }
    finally { setLoading(false); }
  };

  const fetchIntegrity = async () => {
    try {
      const response = await api.get('/reports/integrity/stats');
      if (response.data.success) setIntegrity(response.data.data);
    } catch (err) { /* blockchain may not be running */ }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-slate-400 dark:text-[#6B7280]">Loading dashboard...</div></div>;
  if (error) return <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">{error}</div>;

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText className="w-6 h-6" />} label="Total Reports" value={stats.totalReports} color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" />
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Flagged Reports" value={stats.flaggedCount} color="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        <StatCard icon={<Brain className="w-6 h-6" />} label="Avg AI Score" value={`${stats.averageAiScore}/100`} color="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Categories" value={stats.byCategory.length} color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Data Integrity Health */}
      {integrity && (
        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-[#1F2937]/60 p-5 mb-8">
          <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4ade80]" /> Data Integrity Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <IntegrityCard label="On Blockchain" value={integrity.onChainCount} icon={<ShieldCheck className="w-4 h-4" />} color="text-[#4ade80]" />
            <IntegrityCard label="In Database" value={integrity.databaseCount} icon={<Database className="w-4 h-4" />} color="text-slate-500 dark:text-[#9CA3AF]" />
            <IntegrityCard label="On-Chain Stored" value={integrity.onChainStoredCount} icon={<ShieldCheck className="w-4 h-4" />} color="text-emerald-500" />
            <IntegrityCard label="Intact" value={integrity.intactCount} icon={<ShieldCheck className="w-4 h-4" />} color="text-emerald-500" />
            <IntegrityCard label="Tampered" value={integrity.tamperedCount} icon={<ShieldAlert className="w-4 h-4" />} color={integrity.tamperedCount > 0 ? "text-red-500" : "text-slate-400 dark:text-[#6B7280]"} />
            <IntegrityCard label="Deleted from DB" value={integrity.deletedFromDb} icon={<AlertTriangle className="w-4 h-4" />} color={integrity.deletedFromDb > 0 ? "text-amber-500" : "text-slate-400 dark:text-[#6B7280]"} />
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Reports by Category">
          {stats.byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', color: '#E5E7EB' }} />
                <Bar dataKey="count" fill="#4ade80" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>

        <ChartCard title="Reports by Status">
          {stats.byStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, count }) => `${status} (${count})`}>
                  {stats.byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', color: '#E5E7EB' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </ChartCard>
      </div>

      {/* Trend */}
      <ChartCard title="Reports Trend (Last 30 Days)" className="mb-8">
        {stats.trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', color: '#E5E7EB' }} />
              <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <EmptyChart message="No reports in the last 30 days" />}
      </ChartCard>

      {/* Top Locations */}
      {stats.byLocation.length > 0 && (
        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-[#1F2937]/60 p-5">
          <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-4">Top Reported Locations</h3>
          <div className="space-y-3">
            {stats.byLocation.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-[#9CA3AF]">{item.location}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-100 dark:bg-[#1F2937] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4ade80] rounded-full transition-all duration-500" style={{ width: `${(item.count / stats.byLocation[0].count) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-[#1E3A5F] dark:text-white w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-[#1F2937]/60 p-5 flex items-center gap-4 hover:shadow-md dark:hover:shadow-[#4ade80]/5 transition-all duration-200">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">{label}</p>
        <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-[#1F2937]/60 p-5 ${className}`}>
      <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart({ message = 'No data available yet' }) {
  return <div className="flex items-center justify-center h-[250px] text-slate-400 dark:text-[#6B7280] text-sm">{message}</div>;
}

function IntegrityCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-50 dark:bg-[#0F1219] rounded-xl p-3 text-center border border-gray-100 dark:border-[#1F2937]">
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">{label}</p>
    </div>
  );
}

export default DashboardHome;
