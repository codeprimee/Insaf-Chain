import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Copy, Search, Shield, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

function statusDisplay(status) {
  const map = {
    stored_on_chain: { label: 'Stored on Blockchain',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    validated:       { label: 'Validated',              color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    flagged:         { label: 'Under AI Review',        color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    ai_flagged:      { label: 'Under AI Review',        color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    approved:        { label: 'Approved',               color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    pending:         { label: 'Pending',                color: 'text-slate-600 dark:text-slate-400',     bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  };
  return map[status] || map.pending;
}

function ReportSubmittedPage() {
  const location = useLocation();
  const [copiedId,   setCopiedId]   = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!location.state?.trackingId) return <Navigate to="/" replace />;
  const { trackingId, category, status, blockchainTxHash } = location.state;

  const { label: statusLabel, color: statusColor, bg: statusBg } = statusDisplay(status);
  const isOnChain = status === 'stored_on_chain';

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-4">

        {/* Main card */}
        <div className="bg-white dark:bg-[#111827]/90 rounded-2xl shadow-sm border border-gray-200 dark:border-[#1F2937]/60 p-8 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#1E3A5F] flex items-center justify-center shadow-lg shadow-[#1E3A5F]/25">
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#1E3A5F] dark:text-white mb-1">
            Report Submitted
          </h1>
          <p className="text-slate-500 dark:text-[#9CA3AF] mb-6 text-sm">
            Your {category.toLowerCase()} report has been received and secured.
          </p>

          {/* Tracking ID */}
          <div className="bg-gray-50 dark:bg-[#1F2937]/60 border border-gray-200 dark:border-[#374151] rounded-xl p-4 mb-4">
            <span className="text-xs font-semibold text-slate-400 dark:text-[#6B7280] uppercase tracking-wide block mb-2">
              Tracking ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-xl font-black text-[#1E3A5F] dark:text-white">
                {trackingId}
              </span>
              <button
                onClick={() => copy(trackingId, setCopiedId)}
                className="text-slate-400 hover:text-[#1E3A5F] dark:hover:text-[#4ade80] transition"
                title="Copy"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copiedId && <span className="text-xs text-emerald-500 mt-1 block">Copied!</span>}
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-2">
            <div className="bg-white border border-gray-200 dark:border-[#374151] rounded-xl p-3">
              <QRCodeSVG value={trackingId} size={100} level="H" />
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-[#6B7280] mb-5">
            Screenshot this QR code to save your tracking ID
          </p>

          {/* Save warning */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-3 mb-5">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Save this ID!</strong> We do not store your identity — this is the only way to track your report.
            </p>
          </div>

          {/* Status + Category */}
          <div className={`rounded-xl p-4 mb-5 border text-left ${statusBg}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500 dark:text-[#9CA3AF] font-medium">Category</span>
              <span className="font-semibold text-[#1E3A5F] dark:text-white">{category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-[#9CA3AF] font-medium">Status</span>
              <span className={`font-bold ${statusColor}`}>{statusLabel}</span>
            </div>
          </div>

          {/* Blockchain receipt */}
          {blockchainTxHash && (
            <div className="bg-[#1E3A5F]/5 dark:bg-[#4ade80]/10 border border-[#1E3A5F]/20 dark:border-[#4ade80]/30 rounded-xl p-4 mb-5 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#1E3A5F] dark:text-[#4ade80] shrink-0" />
                <span className="text-xs font-bold text-[#1E3A5F] dark:text-[#4ade80] uppercase tracking-wide">
                  Blockchain Receipt
                </span>
              </div>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all leading-relaxed mb-2">
                {blockchainTxHash}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => copy(blockchainTxHash, setCopiedHash)}
                  className="text-xs font-semibold text-[#1E3A5F] dark:text-[#4ade80] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedHash ? 'Copied!' : 'Copy hash'}
                </button>
                <a
                  href={`https://sepolia.etherscan.io/tx/${blockchainTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Etherscan
                </a>
              </div>
            </div>
          )}

          {/* Pending blockchain note */}
          {!blockchainTxHash && status !== 'stored_on_chain' && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-5">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {status === 'flagged' || status === 'ai_flagged'
                  ? '⚠ Report is under review — blockchain receipt will be issued after admin approval.'
                  : '⏳ Blockchain receipt is being processed.'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/track-report"
              className="bg-[#1E3A5F] dark:bg-[#4ade80] hover:opacity-90 text-white dark:text-[#0a0f1a] px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
            >
              <Search className="w-4 h-4" /> Track Report Status
            </Link>
            {blockchainTxHash && (
              <Link
                to="/verify"
                className="bg-emerald-500 dark:bg-emerald-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
              >
                <Shield className="w-4 h-4" /> Verify on Blockchain
              </Link>
            )}
            <Link to="/" className="text-slate-500 dark:text-[#9CA3AF] hover:text-[#1E3A5F] dark:hover:text-[#4ade80] text-sm transition text-center">
              Return to Home
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 px-4">
          INSAF CHAIN uses Ethereum Sepolia blockchain to ensure your report cannot be altered or deleted by any party.
        </p>
      </div>
    </div>
  );
}

export default ReportSubmittedPage;
