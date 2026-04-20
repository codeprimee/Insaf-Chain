import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios-config';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/logs', { params: { page, limit: 20 } });
      if (response.data.success) {
        setLogs(response.data.data.logs);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('login')) return 'text-blue-600 bg-blue-50';
    if (action.includes('created') || action.includes('registered')) return 'text-emerald-600 bg-emerald-50';
    if (action.includes('deleted') || action.includes('rejected')) return 'text-red-600 bg-red-50';
    if (action.includes('submitted')) return 'text-purple-600 bg-purple-50';
    if (action.includes('approved')) return 'text-emerald-600 bg-emerald-50';
    return 'text-slate-600 dark:text-[#9CA3AF] bg-slate-50';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-6">Audit Logs</h1>

      <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#0B0F17] border-b border-gray-200 dark:border-[#1F2937]">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Action</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Performed By</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Target</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Details</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">No logs found</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#1F2937]">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getActionColor(log.action)}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#9CA3AF] text-xs">
                      {log.performedBy?.name || 'System'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 dark:bg-[#1F2937] text-slate-600 dark:text-[#9CA3AF] px-2 py-0.5 rounded">
                        {log.targetType}
                      </span>
                      {log.targetId && (
                        <span className="font-mono text-xs text-slate-400 dark:text-[#6B7280] ml-1">{log.targetId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-[#9CA3AF] text-xs max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-slate-400 dark:text-[#6B7280] text-xs">
                      {new Date(log.createdAt).toLocaleString()}
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
              Page {pagination.currentPage} of {pagination.totalPages}
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

export default AuditLogs;
