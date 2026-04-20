import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, ArrowUpCircle, Loader2,
  Brain, BarChart2, MapPin, Calendar, User, Hash,
  ShieldCheck, AlertTriangle, Lock, Clock,
} from 'lucide-react';
import api from '../../api/axios-config';

// ─── Helpers ─────────────────────────────────────────────────

function statusColor(status) {
  const map = {
    flagged:        'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',
    ai_flagged:     'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300',
    approved:       'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    validated:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    stored_on_chain:'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',
    rejected:       'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300',
    escalated:      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    pending:        'bg-slate-100  text-slate-600  dark:bg-slate-800     dark:text-slate-300',
  };
  return map[status] || map.pending;
}

function riskColor(level) {
  return level === 'high'   ? 'text-red-500'    :
         level === 'medium' ? 'text-amber-500'  :
                               'text-emerald-500';
}

function ScoreBar({ label, value, max = 100, danger = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <span className={`font-bold ${danger
          ? (pct >= 70 ? 'text-red-500' : pct >= 40 ? 'text-amber-500' : 'text-emerald-500')
          : 'text-slate-700 dark:text-slate-200'}`}>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 break-words mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Action panel (inline) ────────────────────────────────────
function ActionPanel({ reportId, locked, currentStatus, onDone }) {
  const [action, setAction]  = useState('');
  const [reason, setReason]  = useState('');
  const [busy,   setBusy]    = useState(false);
  const [err,    setErr]     = useState('');

  const actionDefs = [
    { id: 'approved',  label: 'Approve',  icon: CheckCircle,   cls: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' },
    { id: 'rejected',  label: 'Reject',   icon: XCircle,       cls: 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' },
    { id: 'escalated', label: 'Escalate', icon: ArrowUpCircle, cls: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
  ];

  const alreadyDone = ['approved', 'rejected', 'escalated', 'validated', 'stored_on_chain'].includes(currentStatus);

  if (locked || alreadyDone) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-center">
        <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {locked ? 'Report is locked (escalated).' : `Already ${currentStatus}.`}
        </p>
      </div>
    );
  }

  const submit = async () => {
    if (!action) { setErr('Select an action.'); return; }
    if ((action === 'rejected' || action === 'escalated') && !reason.trim()) {
      setErr('Reason is required for this action.'); return;
    }
    setErr('');
    setBusy(true);
    try {
      await api.post(`/admin/review/${reportId}/action`, { action, reason });
      onDone(action);
    } catch (e) {
      setErr(e.response?.data?.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        Select Decision
      </p>
      <div className="grid grid-cols-3 gap-2">
        {actionDefs.map(({ id, label, icon: Icon, cls }) => (
          <button
            key={id}
            onClick={() => { setAction(id); setErr(''); }}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${
              action === id ? cls : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1.5">
          Reason {(action === 'rejected' || action === 'escalated') ? '(required)' : '(optional)'}
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder={
            action === 'approved'  ? 'Optional — note why this is credible' :
            action === 'rejected'  ? 'Explain why this report is being rejected…' :
            action === 'escalated' ? 'Why does this need senior review?' :
            'Choose an action above…'
          }
          rows={3}
          disabled={!action}
          className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
        />
      </div>

      {err && <p className="text-sm text-red-500 font-medium">{err}</p>}

      <button
        onClick={submit}
        disabled={!action || busy}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1E3A5F] dark:bg-blue-600 text-white font-semibold rounded-xl transition hover:opacity-90 disabled:opacity-40"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        Confirm Decision
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function ReportDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [done,    setDone]    = useState('');    // action taken

  useEffect(() => {
    api.get(`/admin/review/${id}`)
      .then(r => { if (r.data.success) setData(r.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDone = (action) => {
    setDone(action);
    // Refresh data to reflect new status
    api.get(`/admin/review/${id}`)
      .then(r => { if (r.data.success) setData(r.data.data); })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">Loading report…</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="text-slate-600 dark:text-slate-300 font-semibold">Report not found.</p>
        <button onClick={() => navigate('/dashboard/flagged')} className="mt-4 text-sm text-blue-500 hover:underline">
          ← Back to queue
        </button>
      </div>
    );
  }

  const { report, reviewHistory } = data;
  const heuristic  = report.aiValidation?.score ?? 0;
  const aiScore    = report.aiValidation?.ai?.credibility_score ?? null;
  const aiFlags    = [...(report.aiValidation?.flags ?? []), ...(report.aiValidation?.ai?.flags ?? [])]
                       .filter((f, i, a) => a.indexOf(f) === i);
  const location   = typeof report.location === 'string'
    ? report.location
    : report.location?.address || '';

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/flagged')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1E3A5F] dark:text-white">
            {report.title || report.category}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor(report.status)}`}>
              {report.status?.replace(/_/g, ' ')}
            </span>
            {report.locked && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
            <span className={`text-xs font-bold ${riskColor(report.riskLevel)}`}>
              {report.riskLevel?.toUpperCase()} RISK
            </span>
          </div>
        </div>
      </div>

      {done && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Report {done} successfully. Status has been updated.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column: report content ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Report body */}
          <div className="bg-white dark:bg-[#111827]/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Report Details
            </h2>
            <InfoRow icon={Calendar}  label="Submitted"    value={new Date(report.createdAt).toLocaleString()} />
            <InfoRow icon={User}      label="Category"     value={report.category} />
            <InfoRow icon={MapPin}    label="Location"     value={location} />
            {report.trackingId && <InfoRow icon={Hash} label="Tracking ID" value={report.trackingId} />}

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-lg p-4">
                {report.description}
              </p>
            </div>

            {report.blockchainTxHash && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide mb-1">Blockchain Receipt</p>
                <p className="font-mono text-xs text-blue-700 dark:text-blue-300 break-all">{report.blockchainTxHash}</p>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          <div className="bg-white dark:bg-[#111827]/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> AI & Heuristic Analysis
            </h2>

            <div className="space-y-3 mb-4">
              <ScoreBar label="Priority Score"    value={report.priorityScore ?? 0} danger />
              <ScoreBar label="Heuristic Score"   value={heuristic}                 danger />
              {aiScore != null && (
                <ScoreBar label="AI Credibility (Gemini)" value={aiScore} max={10} />
              )}
            </div>

            {/* Gemini verdict */}
            {report.aiValidation?.ai && (
              <div className={`rounded-lg px-4 py-3 mb-4 text-sm font-medium border ${
                report.aiValidation.ai.is_meaningful
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}>
                Gemini verdict: {report.aiValidation.ai.is_meaningful ? '✓ Meaningful report' : '✗ Not meaningful'}
                {aiScore != null && ` · Credibility ${aiScore}/10`}
              </div>
            )}

            {/* Flags */}
            {aiFlags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Detected Flags</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiFlags.map((f, i) => (
                    <span key={i} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 px-2.5 py-1 rounded-full font-medium">
                      {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {report.aiValidation?.reason && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                "{report.aiValidation.reason}"
              </p>
            )}
          </div>

          {/* Review history */}
          {reviewHistory?.length > 0 && (
            <div className="bg-white dark:bg-[#111827]/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Review History
              </h2>
              <div className="space-y-3">
                {reviewHistory.map((log) => (
                  <div key={log._id} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${statusColor(log.action)}`}>
                      {log.action}
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-600 dark:text-slate-300">{log.reason || 'No reason given'}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {log.adminEmail} · {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: submitter + action ── */}
        <div className="space-y-4">

          {/* Submitter trust */}
          <div className="bg-white dark:bg-[#111827]/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Submitter Profile
            </h2>
            {report.userId ? (
              <div className="space-y-3">
                <ScoreBar label="Trust Score" value={report.userId.trustScore ?? 50} />
                <div className="grid grid-cols-2 gap-2 text-center mt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xl font-black text-slate-700 dark:text-white">{report.userId.reportCount ?? 0}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Total reports</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xl font-black text-red-500">{report.userId.flaggedCount ?? 0}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Flagged</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  {report.userId.email || '—'}
                </p>
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-sm text-slate-400 dark:text-slate-500">Anonymous submission</p>
                {report.deviceId && (
                  <p className="text-xs font-mono text-slate-300 dark:text-slate-600 mt-1 truncate">
                    Device: {report.deviceId.slice(-12)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action panel */}
          <div className="bg-white dark:bg-[#111827]/90 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Admin Decision
            </h2>
            <ActionPanel
              reportId={report._id}
              locked={report.locked}
              currentStatus={report.status}
              onDone={handleDone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
