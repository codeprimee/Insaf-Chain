import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '../../api/axios-config';

const CATEGORIES = ['', 'Crime', 'Corruption', 'Harassment', 'Bribery', 'Other'];
const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'validated', label: 'Validated' },
  { value: 'stored_on_chain', label: 'On Blockchain' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'rejected', label: 'Rejected' },
];

function DashboardReports() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [page, category, status, startDate, endDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/dashboard/reports', { params });
      if (response.data.success) {
        setReports(response.data.data.reports);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-6">Reports</h1>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-[#6B7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tracking ID, description, or location..."
              className="w-full border border-gray-300 dark:border-[#374151] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 focus:border-[#1E3A5F] dark:bg-[#1F2937] dark:text-[#E5E7EB]"
            />
          </div>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
          />

          <button
            type="submit"
            className="bg-[#1E3A5F] dark:bg-[#0B0F17] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#162d4a] transition flex items-center gap-1"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="text-slate-500 dark:text-[#9CA3AF] hover:text-slate-700 px-3 py-2 text-sm transition"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#0B0F17] border-b border-gray-200 dark:border-[#1F2937]">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Tracking ID</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Category</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Description</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Location</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Source</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">AI Score</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">Loading...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">No reports found</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.trackingId} className={`border-b border-gray-100 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#1F2937] ${report.isRecovered ? 'bg-amber-50/40' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#1E3A5F] dark:text-white">
                      {report.trackingId}
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={report.category} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#9CA3AF] max-w-xs truncate">
                      {report.description}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-[#9CA3AF] text-xs">
                      {report.location?.address || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-3">
                      {report.isRecovered ? (
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                          Blockchain
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                          Database
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#9CA3AF]">
                      {report.aiValidation?.score ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-[#9CA3AF] text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#1F2937] bg-gray-50">
            <span className="text-sm text-slate-500 dark:text-[#9CA3AF]">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-gray-300 dark:border-[#374151] hover:bg-gray-100 dark:bg-[#1F2937] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded border border-gray-300 dark:border-[#374151] hover:bg-gray-100 dark:bg-[#1F2937] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const colors = {
    Crime: 'bg-red-100 text-red-700',
    Corruption: 'bg-yellow-100 text-yellow-700',
    Harassment: 'bg-orange-100 text-orange-700',
    Bribery: 'bg-purple-100 text-purple-700',
    Other: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[category] || colors.Other}`}>
      {category}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-gray-100 dark:bg-[#1F2937] text-gray-600',
    validated: 'bg-blue-100 text-blue-700',
    stored_on_chain: 'bg-emerald-100 text-emerald-700',
    flagged: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const labels = {
    pending: 'Pending',
    validated: 'Validated',
    stored_on_chain: 'On Blockchain',
    flagged: 'Flagged',
    rejected: 'Rejected',
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}

export default DashboardReports;
