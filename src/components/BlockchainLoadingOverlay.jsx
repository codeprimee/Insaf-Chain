import { useEffect, useState } from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';

const STEPS = [
  {
    label: 'Validating your report',
    desc:  'Checking format and content rules',
  },
  {
    label: 'AI analysis running',
    desc:  'Gemini is reviewing report credibility',
  },
  {
    label: 'Writing to Ethereum Sepolia',
    desc:  'Waiting for block confirmation — this may take 15–30 s',
  },
  {
    label: 'Report permanently secured',
    desc:  'Your report is now tamper-proof on-chain',
  },
];

// Auto-advance: step 0→1 after 1.2 s, step 1→2 after another 3 s.
// Step 2→3 is triggered by the parent when the API call resolves.
const AUTO_DELAYS = [1200, 3000];

/**
 * Full-screen loading overlay shown while a report is being submitted
 * and written to the blockchain.
 *
 * Props:
 *   visible  {boolean}  — mount/unmount the overlay
 *   done     {boolean}  — set true when API call succeeds (advances to step 3)
 */
export default function BlockchainLoadingOverlay({ visible, done }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStep(0);
      return;
    }
    const timers = AUTO_DELAYS.map((delay, i) =>
      setTimeout(() => setStep((prev) => Math.max(prev, i + 1)), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  // Parent signals success — jump to final step
  useEffect(() => {
    if (done) setStep(3);
  }, [done]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="bg-white dark:bg-[#0D1421] rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-[#1E3A5F]/60 animate-fadeIn">

        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mb-4 shadow-lg shadow-[#1E3A5F]/30">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-[#1E3A5F] dark:text-white tracking-tight">
            INSAF CHAIN
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
            Processing your report — please wait
          </p>
        </div>

        {/* Step list */}
        <div className="space-y-5">
          {STEPS.map((s, i) => {
            const isDone    = i < step;
            const isActive  = i === step;
            const isPending = i > step;

            return (
              <div
                key={i}
                className={`flex items-start gap-3 transition-all duration-500 ${
                  isPending ? 'opacity-25' : 'opacity-100'
                }`}
              >
                {/* Circle icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-[#1E3A5F] dark:bg-[#4ade80] text-white dark:text-[#0a0f1a]'
                      : 'bg-slate-100 dark:bg-[#1F2937] text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>

                {/* Label + description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      isDone || isActive
                        ? 'text-slate-800 dark:text-white'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {s.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {i === 2 && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5 align-middle" />
                      )}
                      {s.desc}
                    </p>
                  )}
                </div>

                {isDone && (
                  <span className="text-emerald-500 text-xs font-black shrink-0 mt-1">✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Blockchain waiting note */}
        {step === 2 && (
          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800/50">
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
              ⛓ Ethereum block confirmation in progress…
            </p>
          </div>
        )}

        {/* Do not close warning */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">
          Do not close or refresh this page
        </p>
      </div>
    </div>
  );
}
