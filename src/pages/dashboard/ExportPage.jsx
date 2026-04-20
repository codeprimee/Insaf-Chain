import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import api from '../../api/axios-config';

function ExportPage() {
  const [loading, setLoading] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = async (format) => {
    setLoading(format);
    try {
      const params = {};
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(`/export/${format}`, {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `insafchain-reports.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading('');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white mb-6">Export Data</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-5 mb-6">
        <h3 className="font-medium text-[#1E3A5F] dark:text-white mb-4">Filter before exporting (optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 dark:text-[#9CA3AF] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            >
              <option value="">All Categories</option>
              <option value="Crime">Crime</option>
              <option value="Corruption">Corruption</option>
              <option value="Harassment">Harassment</option>
              <option value="Bribery">Bribery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-[#9CA3AF] mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 dark:text-[#9CA3AF] mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('csv')}
          disabled={!!loading}
          className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-6 hover:border-[#1E3A5F] hover:shadow-sm transition flex items-center gap-4 disabled:opacity-60"
        >
          <div className="bg-emerald-50 p-3 rounded-lg">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-[#1E3A5F] dark:text-white">Export as CSV</h3>
            <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">Spreadsheet format, open in Excel</p>
          </div>
          {loading === 'csv' ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400 dark:text-[#6B7280] ml-auto" />
          ) : (
            <Download className="w-5 h-5 text-slate-400 dark:text-[#6B7280] ml-auto" />
          )}
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={!!loading}
          className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-6 hover:border-[#1E3A5F] hover:shadow-sm transition flex items-center gap-4 disabled:opacity-60"
        >
          <div className="bg-red-50 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-[#1E3A5F] dark:text-white">Export as PDF</h3>
            <p className="text-sm text-slate-500 dark:text-[#9CA3AF]">Document format, ready to print</p>
          </div>
          {loading === 'pdf' ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400 dark:text-[#6B7280] ml-auto" />
          ) : (
            <Download className="w-5 h-5 text-slate-400 dark:text-[#6B7280] ml-auto" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ExportPage;
