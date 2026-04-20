import { useState } from 'react';
import { Phone, X, AlertTriangle } from 'lucide-react';

const EMERGENCY_NUMBERS = [
  { number: '15', label: 'Police', color: 'bg-blue-500' },
  { number: '1122', label: 'Rescue / Ambulance', color: 'bg-red-500' },
  { number: '1099', label: 'Anti-Corruption', color: 'bg-amber-500' },
  { number: '8787', label: 'Women Helpline', color: 'bg-purple-500' },
];

function EmergencyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
        title="Emergency? Call Now"
      >
        <Phone className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Emergency</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827]/95 dark:backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-black/40 max-w-sm w-full p-6 z-10 border border-gray-200 dark:border-[#1F2937] animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-[#1E3A5F] dark:text-white">Emergency Numbers</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 dark:text-[#6B7280] hover:text-slate-600 dark:hover:text-white transition active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-[#9CA3AF] mb-5">
              If you are in immediate danger, call emergency services now. INSAF CHAIN is for reporting past incidents, not emergencies.
            </p>

            <div className="space-y-3">
              {EMERGENCY_NUMBERS.map((item) => (
                <a key={item.number} href={`tel:${item.number}`}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-[#1F2937] hover:border-[#4ade80]/50 dark:hover:border-[#4ade80]/50 hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] bg-white dark:bg-[#1F2937]/40">
                  <div className={`${item.color} text-white p-2 rounded-full`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-[#1E3A5F] dark:text-[#E5E7EB] text-sm">{item.label}</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-[#1E3A5F] dark:text-white">{item.number}</span>
                </a>
              ))}
            </div>

            <p className="text-xs text-slate-400 dark:text-[#6B7280] mt-4 text-center">Tap a number to call directly on mobile</p>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;
