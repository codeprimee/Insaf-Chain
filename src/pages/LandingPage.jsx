import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Brain, Search, FileText, ArrowRight, ChevronRight } from 'lucide-react';

function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#0F2440] dark:from-[#0B0F17] dark:via-[#111827] dark:to-[#0B0F17] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-500/20 dark:bg-[#4ade80]/15 p-4 rounded-full dark:shadow-lg dark:shadow-[#4ade80]/20">
              <Shield className="w-12 h-12 text-emerald-400 dark:text-[#4ade80]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Report Without Fear</h1>
          <p className="text-lg md:text-xl text-slate-300 dark:text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
            INSAF CHAIN is a blockchain-powered anonymous reporting platform.
            Your identity stays hidden. Your voice creates change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-report" className="bg-emerald-500 dark:bg-[#4ade80] hover:bg-emerald-600 dark:hover:bg-[#22c55e] text-white dark:text-[#0a0f1a] px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[#4ade80]/25 hover:scale-[1.02] active:scale-[0.98]">
              Submit a Report <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/track-report" className="border border-white/30 hover:border-white/60 dark:border-[#374151] dark:hover:border-[#4ade80]/50 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              Track Your Report <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-white text-center mb-4">Why INSAF CHAIN?</h2>
          <p className="text-slate-500 dark:text-[#9CA3AF] text-center mb-12 max-w-xl mx-auto">
            Built on trust, powered by blockchain — designed to protect those who speak up.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Eye className="w-8 h-8" />} title="100% Anonymous" description="No login, no name, no phone number. Your identity is never collected or stored." />
            <FeatureCard icon={<Lock className="w-8 h-8" />} title="Blockchain Secured" description="Every report is hashed and stored on Ethereum. It cannot be edited, deleted, or tampered with." />
            <FeatureCard icon={<Brain className="w-8 h-8" />} title="AI Validated" description="Our validation system filters out spam and fake reports to maintain data integrity." />
            <FeatureCard icon={<FileText className="w-8 h-8" />} title="Transparent Data" description="NGOs and media can access anonymized analytics to expose patterns and drive change." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-[#111827]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-white text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <StepCard number="1" title="Choose a Category" description="Select what you're reporting — Crime, Corruption, Harassment, Bribery, or Other." />
            <StepCard number="2" title="Describe What Happened" description="Write a detailed description. Add location and evidence files if you have them." />
            <StepCard number="3" title="AI Validates Your Report" description="Our system checks the report for authenticity and filters out spam automatically." />
            <StepCard number="4" title="Stored on Blockchain" description="The validated report is hashed and permanently stored on the Ethereum blockchain." />
            <StepCard number="5" title="Track With Your ID" description="You receive a unique tracking ID. Use it anytime to check your report's status." />
          </div>
          <div className="text-center mt-12">
            <Link to="/submit-report" className="bg-[#1E3A5F] dark:bg-[#4ade80] hover:bg-[#162d4a] dark:hover:bg-[#22c55e] text-white dark:text-[#0a0f1a] px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[#4ade80]/25 hover:scale-[1.02] active:scale-[0.98]">
              Start Reporting Now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white dark:bg-[#0B0F17]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1E3A5F] dark:text-white text-center mb-4">What Can You Report?</h2>
          <p className="text-slate-500 dark:text-[#9CA3AF] text-center mb-12">Any past incident that should not happen to the next person.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Crime', 'Corruption', 'Harassment', 'Bribery', 'Other'].map((label) => (
              <div key={label} className="bg-gray-50 dark:bg-[#111827]/80 border border-gray-200 dark:border-[#1F2937] rounded-xl p-4 text-center hover:border-[#1E3A5F] dark:hover:border-[#4ade80]/50 hover:shadow-md dark:hover:shadow-[#4ade80]/10 transition-all duration-200 cursor-default hover:scale-[1.03]">
                <span className="text-sm font-medium text-[#1E3A5F] dark:text-[#E5E7EB]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-[#4ade80] dark:to-[#1E40AF] text-white relative overflow-hidden">
        <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15),_transparent_70%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Your Voice Matters</h2>
          <p className="text-lg text-emerald-100 dark:text-blue-100 mb-8">
            What happened to you should not happen to the next person. Report anonymously. Help build a safer community.
          </p>
          <Link to="/submit-report" className="bg-white text-emerald-600 dark:text-[#4ade80] hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
            Submit a Report <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-50 dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg dark:hover:shadow-[#4ade80]/5 transition-all duration-200 border border-transparent dark:border-[#1F2937] hover:scale-[1.02] group">
      <div className="flex justify-center mb-4 text-[#1E3A5F] dark:text-[#4ade80] group-hover:scale-110 transition-transform duration-200">{icon}</div>
      <h3 className="font-semibold text-[#1E3A5F] dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-[#9CA3AF] text-sm">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 w-10 h-10 bg-[#1E3A5F] dark:bg-[#4ade80] text-white dark:text-[#0a0f1a] rounded-full flex items-center justify-center font-bold shadow-md dark:shadow-[#4ade80]/30 group-hover:scale-110 transition-transform duration-200">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[#1E3A5F] dark:text-white text-lg">{title}</h3>
        <p className="text-slate-500 dark:text-[#9CA3AF]">{description}</p>
      </div>
    </div>
  );
}

export default LandingPage;
