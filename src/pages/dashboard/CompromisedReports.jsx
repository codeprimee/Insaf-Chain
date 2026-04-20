import { useState, useEffect } from 'react';
import { ShieldAlert, FileWarning, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../api/axios-config';

function CompromisedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ tamperedCount: 0, deletedCount: 0 });

  useEffect(() => {
    fetchCompromised();
  }, []);

  const fetchCompromised = async () => {
    try {
      const response = await api.get('/dashboard/compromised');
      if (response.data.success) {
        setReports(response.data.data.reports);
        setStats({
          tamperedCount: response.data.data.tamperedCount,
          deletedCount: response.data.data.deletedCount,
        });
      }
    } catch (err) {
      console.error('Fetch compromised error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 dark:text-[#6B7280]" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-2">Compromised Reports</h1>
      <p className="text-slate-500 dark:text-[#9CA3AF] text-sm mb-6">
        Reports with integrity issues detected through blockchain verification.
        Original data recovered from the Ethereum smart contract.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-red-200 p-4 flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <FileWarning className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">Tampered Reports</p>
            <p className="text-2xl font-bold text-red-600">{stats.tamperedCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-amber-200 p-4 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">Deleted from Database</p>
            <p className="text-2xl font-bold text-amber-600">{stats.deletedCount}</p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-12 text-center">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 dark:text-[#6B7280]">No compromised reports detected.</p>
          <p className="text-slate-400 dark:text-[#6B7280] text-sm">All reports are intact and match their blockchain records.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.trackingId}
              className={`bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border-2 p-5 ${
                report.integrityStatus === 'tampered'
                  ? 'border-red-200'
                  : 'border-amber-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#1E3A5F] dark:text-white">
                    {report.trackingId}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    report.integrityStatus === 'tampered'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {report.integrityStatus === 'tampered' ? 'Tampered' : 'DB Deleted'}
                  </span>
                  <CategoryBadge category={report.category} />
                </div>
                <span className="text-xs text-slate-400 dark:text-[#6B7280]">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Tampered — show side by side */}
              {report.integrityStatus === 'tampered' && report.blockchain && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <span className="text-xs font-medium text-emerald-700 block mb-2">
                        Original (Blockchain)
                      </span>
                      <p className="text-sm text-slate-700">{report.blockchain.description}</p>
                      {report.blockchain.location && (
                        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-1">Location: {report.blockchain.location}</p>
                      )}
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <span className="text-xs font-medium text-red-700 block mb-2">
                        Modified (Database)
                      </span>
                      <p className="text-sm text-slate-700">{report.description}</p>
                      {report.location?.address && (
                        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-1">Location: {report.location.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Hash comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-emerald-600 font-medium">Blockchain Hash</span>
                      <div className="bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-[#1F2937] rounded px-2 py-1.5 mt-1">
                        <span className="font-mono text-xs text-slate-500 dark:text-[#9CA3AF] break-all">{report.storedHash}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-red-600 font-medium">Current DB Hash</span>
                      <div className="bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-[#1F2937] rounded px-2 py-1.5 mt-1">
                        <span className="font-mono text-xs text-slate-500 dark:text-[#9CA3AF] break-all">{report.currentHash}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DB Deleted — show blockchain recovered data */}
              {report.integrityStatus === 'db_deleted' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <span className="text-xs font-medium text-amber-700 block mb-2">
                    Recovered from Blockchain
                  </span>
                  <p className="text-sm text-slate-700">{report.description}</p>
                  {report.location?.address && (
                    <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-1">Location: {report.location.address}</p>
                  )}
                  <p className="text-xs text-amber-600 mt-2">
                    This report was deleted from the database but its full content was recovered from the Ethereum blockchain.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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

export default CompromisedReports;
