import { useState } from 'react';
import {
  Shield, Search, CheckCircle, XCircle, AlertTriangle,
  Loader2, Database, Link2, FileWarning,
} from 'lucide-react';
import api from '../api/axios-config';

function VerifyBlockchainPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError('Please enter a tracking ID.'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.get(`/reports/${trackingId.trim()}/verify`);
      if (response.data.success) setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Make sure the blockchain node is running.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    intact: { color: 'emerald', icon: CheckCircle, label: 'Integrity Verified', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    tampered: { color: 'red', icon: FileWarning, label: 'Tampering Detected', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    db_deleted: { color: 'amber', icon: AlertTriangle, label: 'Database Record Deleted', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    not_on_chain: { color: 'gray', icon: XCircle, label: 'Not on Blockchain', bg: 'bg-gray-50', border: 'border-gray-200 dark:border-[#1F2937]', text: 'text-gray-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F17] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1E3A5F]/10 p-4 rounded-full">
              <Shield className="w-10 h-10 text-[#1E3A5F] dark:text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-2">Blockchain Verification</h1>
          <p className="text-slate-500 dark:text-[#9CA3AF] text-sm">
            Verify report integrity by querying the Ethereum smart contract directly.
            Detects tampering, deletion, and data modification.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleVerify} className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-gray-200 dark:border-[#1F2937] p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-[#6B7280]" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter tracking ID (e.g. RPT-A1B2C3D4)"
              className="w-full border border-gray-300 dark:border-[#374151] rounded-lg pl-10 pr-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 focus:border-[#1E3A5F] dark:bg-[#1F2937] dark:text-[#E5E7EB]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#1E3A5F] dark:bg-[#4ade80] hover:bg-[#162d4a] dark:hover:bg-[#22c55e] text-white dark:text-[#0a0f1a] py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              : <><Shield className="w-4 h-4" /> Verify on Blockchain</>
            }
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-2xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-gray-200 dark:border-[#1F2937] overflow-hidden">
            {/* Status Banner */}
            {(() => {
              const cfg = statusConfig[result.integrityStatus] || statusConfig.not_on_chain;
              const Icon = cfg.icon;
              return (
                <div className={`px-6 py-4 ${cfg.bg} border-b ${cfg.border}`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${cfg.text}`} />
                    <div>
                      <h3 className={`font-bold ${cfg.text}`}>{cfg.label}</h3>
                      <p className={`text-sm ${cfg.text} opacity-80`}>{result.message}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-6 space-y-5">
              {/* Tracking ID */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-[#9CA3AF]">Tracking ID</span>
                <span className="font-mono font-bold text-[#1E3A5F] dark:text-white">{result.trackingId}</span>
              </div>

              {/* Storage Status */}
              <div className="flex gap-4">
                <div className={`flex-1 rounded-xl p-3 border ${result.existsOnBlockchain ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 dark:bg-[#0B0F17] border-gray-200 dark:border-[#1F2937]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className={`w-4 h-4 ${result.existsOnBlockchain ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">Blockchain</span>
                  </div>
                  <span className={`text-sm font-medium ${result.existsOnBlockchain ? 'text-emerald-700' : 'text-gray-500'}`}>
                    {result.existsOnBlockchain ? 'Stored' : 'Not Found'}
                  </span>
                </div>
                <div className={`flex-1 rounded-xl p-3 border ${result.existsInDatabase ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className={`w-4 h-4 ${result.existsInDatabase ? 'text-emerald-600' : 'text-red-500'}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">Database</span>
                  </div>
                  <span className={`text-sm font-medium ${result.existsInDatabase ? 'text-emerald-700' : 'text-red-600'}`}>
                    {result.existsInDatabase ? 'Exists' : 'Deleted'}
                  </span>
                </div>
              </div>

              {/* Blockchain Data */}
              {result.blockchain && (
                <div className="border border-gray-200 dark:border-[#1F2937] rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-[#1E3A5F] dark:text-white mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> On-Chain Record (Immutable)
                  </h4>
                  <div className="space-y-2">
                    <InfoRow label="Category" value={result.blockchain.category} />
                    <InfoRow label="Stored At" value={new Date(result.blockchain.storedAt).toLocaleString()} />
                    {result.blockchain.description && (
                      <div>
                        <span className="text-xs text-slate-400 dark:text-[#6B7280]">Description (from blockchain)</span>
                        <p className="text-sm text-slate-700 mt-1 bg-gray-50 dark:bg-[#0B0F17] rounded p-2">
                          {result.blockchain.description}
                        </p>
                      </div>
                    )}
                    {result.blockchain.location && (
                      <InfoRow label="Location (from blockchain)" value={result.blockchain.location} />
                    )}
                    <div>
                      <span className="text-xs text-slate-400 dark:text-[#6B7280]">Report Hash</span>
                      <div className="bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-[#1F2937] rounded px-3 py-2 mt-1">
                        <span className="font-mono text-xs text-slate-600 dark:text-[#9CA3AF] break-all">
                          {result.blockchain.reportHash}
                        </span>
                      </div>
                    </div>
                    {result.blockchain.fileHashes?.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 dark:text-[#6B7280]">
                          Evidence File Hashes ({result.blockchain.fileHashes.length} file{result.blockchain.fileHashes.length > 1 ? 's' : ''})
                        </span>
                        {result.blockchain.fileHashes.map((h, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-[#1F2937] rounded px-3 py-1.5 mt-1">
                            <span className="font-mono text-xs text-slate-500 dark:text-[#9CA3AF] break-all">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tampering Comparison — only show when tampered */}
              {result.integrityStatus === 'tampered' && result.database && (
                <div className="border-2 border-red-300 rounded-xl p-4 bg-red-50/50">
                  <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <FileWarning className="w-4 h-4" /> Tampering Evidence
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-red-600 font-medium">Blockchain Hash (Original)</span>
                        <div className="bg-white border border-red-200 rounded px-2 py-1.5 mt-1">
                          <span className="font-mono text-xs text-slate-600 dark:text-[#9CA3AF] break-all">
                            {result.blockchain.reportHash}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-red-600 font-medium">Current DB Hash (Modified)</span>
                        <div className="bg-white border border-red-200 rounded px-2 py-1.5 mt-1">
                          <span className="font-mono text-xs text-slate-600 dark:text-[#9CA3AF] break-all">
                            {result.database.currentHash}
                          </span>
                        </div>
                      </div>
                    </div>
                    {result.blockchain.description !== result.database.description && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-emerald-600 font-medium">Original Description (Blockchain)</span>
                          <p className="bg-white border border-emerald-200 rounded px-2 py-1.5 mt-1 text-xs text-slate-700">
                            {result.blockchain.description}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-red-600 font-medium">Modified Description (Database)</span>
                          <p className="bg-white border border-red-200 rounded px-2 py-1.5 mt-1 text-xs text-slate-700">
                            {result.database.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-5">
          <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-3 text-sm">How Verification Works</h3>
          <div className="space-y-2 text-sm text-slate-500 dark:text-[#9CA3AF]">
            <p>1. When a report is submitted, its full data and cryptographic hash are stored on the Ethereum blockchain.</p>
            <p>2. This page queries the smart contract directly — not the application database.</p>
            <p>3. If the database data has been modified, the hash comparison will detect the mismatch.</p>
            <p>4. If the database record is deleted, the blockchain still holds the original report data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 dark:text-[#9CA3AF]">{label}</span>
      <span className="text-sm font-medium text-[#1E3A5F] dark:text-white">{value}</span>
    </div>
  );
}

export default VerifyBlockchainPage;
