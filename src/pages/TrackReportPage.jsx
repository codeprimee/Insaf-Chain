import { useState } from 'react';
import { Search, CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios-config';

function TrackReportPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError('Please enter your tracking ID.'); return; }
    setLoading(true); setError(''); setReport(null);
    try {
      const response = await api.get(`/reports/${trackingId.trim()}`);
      if (response.data.success) setReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] py-12 px-4">
      <div className="max-w-lg mx-auto animate-fadeIn">
        <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white text-center mb-2">Track Your Report</h1>
        <p className="text-slate-500 dark:text-[#9CA3AF] text-center mb-8">Enter the tracking ID you received when you submitted your report.</p>

        <form onSubmit={handleSearch} className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-gray-200 dark:border-[#1F2937]/60 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-[#6B7280]" />
            <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value.toUpperCase())} placeholder="Enter tracking ID (e.g. RPT-A1B2C3D4)"
              className="w-full border border-gray-300 dark:border-[#374151] rounded-xl pl-10 pr-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80] dark:bg-[#1F2937]/60 dark:text-[#E5E7EB] dark:placeholder-[#6B7280] transition-all duration-200" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-4 bg-[#1E3A5F] dark:bg-[#4ade80] hover:bg-[#162d4a] dark:hover:bg-[#22c55e] text-white dark:text-[#0a0f1a] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 shadow-md dark:shadow-[#4ade80]/20 hover:shadow-lg active:scale-[0.98]">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching...</> : <><Search className="w-4 h-4" /> Search</>}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {report && (
          <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-xl rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-gray-200 dark:border-[#1F2937]/60 p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-mono text-lg font-bold text-[#1E3A5F] dark:text-white">{report.trackingId}</span>
                <span className="ml-3 inline-block bg-gray-100 dark:bg-[#1F2937] text-slate-600 dark:text-[#9CA3AF] text-xs px-2 py-1 rounded-full">{report.category}</span>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-4 text-sm">Report Progress</h3>
            <div className="space-y-4">
              {report.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  {item.completed
                    ? <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-[#22C55E] flex-shrink-0" />
                    : <Circle className="w-6 h-6 text-gray-300 dark:text-[#374151] flex-shrink-0" />
                  }
                  <span className={`text-sm font-medium ${item.completed ? 'text-[#1E3A5F] dark:text-white' : 'text-gray-400 dark:text-[#6B7280]'}`}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>

            {report.blockchainTxHash && (
              <div className="mt-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase block mb-1">Blockchain Transaction</span>
                <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300 break-all">{report.blockchainTxHash}</span>
              </div>
            )}

            <div className="mt-4 text-xs text-slate-400 dark:text-[#6B7280]">
              Submitted on {new Date(report.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: { style: 'bg-gray-100 dark:bg-[#1F2937] text-gray-600 dark:text-[#9CA3AF]', label: 'Pending' },
    validated: { style: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400', label: 'Validated' },
    stored_on_chain: { style: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', label: 'On Blockchain' },
    flagged: { style: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400', label: 'Flagged' },
    rejected: { style: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400', label: 'Rejected' },
  };
  const c = config[status] || config.pending;
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.style}`}>{c.label}</span>;
}

export default TrackReportPage;
