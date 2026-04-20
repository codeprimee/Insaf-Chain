import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, XCircle, ArrowUpCircle, Loader2,
  AlertTriangle, ShieldCheck, ShieldOff, RefreshCw,
  ChevronRight, Clock, Brain, BarChart2,
} from 'lucide-react';
import api from '../../api/axios-config';

// ─── Risk badge ───────────────────────────────────────────────
function RiskBadge({ level }) {
  const map = {
    high:   'bg-red-100    text-red-700    border-red-200    dark:bg-red-900/30   dark:text-red-400   dark:border-red-800',
    medium: 'bg-amber-100  text-amber-700  border-amber-200  dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    low:    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  };
  const label = { high: '● High Risk', medium: '● Medium', low: '● Low Risk' };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${map[level] || map.medium}`}>
      {label[level] || level}
    </span>
  );
}

// ─── Score pill ───────────────────────────────────────────────
function ScorePill({ label, value, max = 100, colorThresholds }) {
  const pct   = Math.round((value / max) * 100);
  const color = colorThresholds
    ? (value >= colorThresholds.high   ? 'text-red-500'
     : value >= colorThresholds.medium ? 'text-amber-500'
     :                                    'text-emerald-500')
    : 'text-slate-600 dark:text-slate-300';
  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2 min-w-[72px]">
      <span className={`text-lg font-black ${color}`}>{value}</span>
      <span className="text-[10px] text-slate-400 font-medium mt-0.5">{label}</span>
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5">
        <div
          className={`h-1 rounded-full transition-all ${
            pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Action modal ─────────────────────────────────────────────
function ActionModal({ report, onClose, onSubmit, loading }) {
  const [action, setAction]   = useState('');
  const [reason, setReason]   = useState('');

  const actions = [
    { id: 'approved',  label: 'Approve',  icon: CheckCircle,    color: 'border-emerald-400 bg-emerald-50  dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' },
    { id: 'rejected',  label: 'Reject',   icon: XCircle,        color: 'border-red-400     bg-red-50      dark:bg-red-900/20     text-red-700     dark:text-red-300' },
    { id: 'escalated', label: 'Escalate', icon: ArrowUpCircle,  color: 'border-blue-400    bg-blue-50     dark:bg-blue-900/20    text-blue-700    dark:text-blue-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Review Action</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {report.title || report.category} · {report.trackingId || report._id?.slice(-8)}
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Action selector */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Select Action
            </p>
            <div className="grid grid-cols-3 gap-2">
              {actions.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setAction(id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    action === id ? color : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">
              Reason {action === 'rejected' || action === 'escalated' ? '(required)' : '(optional)'}
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={
                action === 'approved'  ? 'Why is this report credible?' :
                action === 'rejected'  ? 'Why is this report being rejected?' :
                action === 'escalated' ? 'Why does this need senior review?' :
                'Select an action above first...'
              }
              rows={3}
              disabled={!action}
              className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(report._id || report.trackingId, action, reason)}
            disabled={!action || loading || ((action === 'rejected' || action === 'escalated') && !reason.trim())}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-[#1E3A5F] dark:bg-blue-600 text-white rounded-lg transition hover:opacity-90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Report card ──────────────────────────────────────────────
function ReportCard({ report, onAction, navigate }) {
  const heuristic  = report.aiValidation?.score ?? 0;
  const aiScore    = report.aiValidation?.ai?.credibility_score ?? null;
  const allFlags   = [
    ...(report.aiValidation?.flags   ?? []),
    ...(report.aiValidation?.ai?.flags ?? []),
  ].filter((f, i, arr) => arr.indexOf(f) === i);  // dedupe

  return (
    <div
      className={`bg-white dark:bg-[#111827]/90 rounded-xl border transition-shadow hover:shadow-md cursor-pointer
        ${report.riskLevel === 'high'   ? 'border-red-200    dark:border-red-900/50' :
          report.riskLevel === 'medium' ? 'border-amber-200  dark:border-amber-900/50' :
                                          'border-emerald-200 dark:border-emerald-900/30'}`}
      onClick={() => navigate(`/dashboard/review/${report._id || report.trackingId}`)}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 dark:text-white text-sm truncate">
                {report.title || report.category}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                {report.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
              {report.trackingId || report._id?.slice(-12)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge level={report.riskLevel} />
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
          {report.description}
        </p>

        {/* Scores */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <ScorePill label="Priority" value={report.priorityScore ?? 0} colorThresholds={{ high: 70, medium: 40 }} />
          <ScorePill label="Heuristic" value={heuristic} colorThresholds={{ high: 70, medium: 40 }} />
          {aiScore != null && (
            <ScorePill label="AI Cred" value={aiScore} max={10}
              colorThresholds={{ high: 7, medium: 4 }}
            />
          )}
          {report.userId?.trustScore != null && (
            <ScorePill label="Trust" value={report.userId.trustScore} />
          )}
        </div>

        {/* AI flags */}
        {allFlags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {allFlags.slice(0, 5).map((f, i) => (
              <span key={i} className="text-[11px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 px-2 py-0.5 rounded-full font-medium">
                {f.replace(/_/g, ' ')}
              </span>
            ))}
            {allFlags.length > 5 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">+{allFlags.length - 5} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(report.createdAt).toLocaleString()}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onAction(report); }}
            className="text-xs font-semibold text-[#1E3A5F] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Take action →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
const TABS = [
  { key: 'flagged',   label: 'Pending Review', icon: AlertTriangle },
  { key: 'approved',  label: 'Approved',       icon: ShieldCheck },
  { key: 'rejected',  label: 'Rejected',       icon: ShieldOff },
  { key: 'escalated', label: 'Escalated',      icon: ArrowUpCircle },
];

export default function FlaggedReports() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab]   = useState('flagged');
  const [reports,     setReports]     = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [actionModal, setActionModal] = useState(null);   // report object | null
  const [actionBusy,  setActionBusy]  = useState(false);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchQueue = useCallback(async (tab, pg) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/review?status=${tab}&page=${pg}&limit=15`);
      if (data.success) {
        setReports(data.data.reports);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load queue.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchQueue(activeTab, 1);
  }, [activeTab, fetchQueue]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleAction = async (reportId, action, reason) => {
    if (!action) return;
    setActionBusy(true);
    try {
      await api.post(`/admin/review/${reportId}/action`, { action, reason });
      showToast(`Report ${action} successfully.`);
      setActionModal(null);
      fetchQueue(activeTab, page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    } finally {
      setActionBusy(false);
    }
  };

  const tabCount = reports.length;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all
          ${toast.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-emerald-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1E3A5F] dark:text-white">Review Queue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI-flagged reports sorted by priority score
          </p>
        </div>
        <button
          onClick={() => fetchQueue(activeTab, page)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-[#1E3A5F] text-[#1E3A5F] dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {key === activeTab && tabCount > 0 && (
              <span className="ml-1 bg-[#1E3A5F]/10 dark:bg-white/10 text-[#1E3A5F] dark:text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {pagination.total ?? tabCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> High risk (≥70)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Medium (40–69)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Low (&lt;40)</span>
        <span className="flex items-center gap-1 ml-2 text-slate-400 dark:text-slate-500">
          <Brain className="w-3 h-3" /> Priority = Heuristic×0.6 + (10−AI)×4 + (100−Trust)×0.3
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400 dark:text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Loading queue…</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-[#111827]/80 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <BarChart2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No {activeTab} reports found.
          </p>
          {activeTab === 'flagged' && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Reports flagged by AI validation will appear here.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {reports.map(r => (
              <ReportCard
                key={r._id}
                report={r}
                onAction={setActionModal}
                navigate={navigate}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} total
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => { const p = page - 1; setPage(p); fetchQueue(activeTab, p); }}
                  className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => { const p = page + 1; setPage(p); fetchQueue(activeTab, p); }}
                  className="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action modal */}
      {actionModal && (
        <ActionModal
          report={actionModal}
          onClose={() => setActionModal(null)}
          onSubmit={handleAction}
          loading={actionBusy}
        />
      )}
    </div>
  );
}
