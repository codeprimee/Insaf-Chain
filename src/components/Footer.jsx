import { Shield } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#1E3A5F] dark:bg-[#0B0F17] text-white py-8 mt-auto border-t border-transparent dark:border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Shield className="w-5 h-5 text-emerald-400 dark:text-[#4ade80]" />
            INSAF CHAIN
          </div>
          <p className="text-slate-300 dark:text-[#9CA3AF] text-sm text-center">
            Secure. Anonymous. Immutable. — Empowering citizens to report without fear.
          </p>
          <p className="text-slate-400 dark:text-[#6B7280] text-xs">
            &copy; {new Date().getFullYear()} INSAF CHAIN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
