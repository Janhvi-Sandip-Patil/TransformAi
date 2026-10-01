import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Search, 
  History, 
  Cpu, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { SAMPLE_FIXTURES, SampleFixture } from '../data/sampleFixtures';

interface NavbarProps {
  activeTab: 'studio' | 'search' | 'history' | 'templates';
  setActiveTab: (tab: 'studio' | 'search' | 'history' | 'templates') => void;
  onSelectSample: (fixture: SampleFixture) => void;
  isProcessing: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectSample,
  isProcessing,
  historyCount,
}) => {
  const [sampleMenuOpen, setSampleMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F5F5F0]/95 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand - Artistic Editorial Look */}
          <div className="flex items-center gap-3.5">
            <div className="border-l-4 border-black pl-3 py-0.5">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase leading-none text-black">
                  TRANSFORM<span className="text-[#FF5F1F]">.AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-black text-white rounded-none">
                  SIH26154 / NTRO
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-black/50 mt-1">
                Multimodal Intelligence & Content Transformation
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Architectural Segmented Controls */}
          <nav className="flex items-center gap-1 bg-black/5 p-1 border border-black/10">
            <button
              id="nav-tab-studio"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all ${
                activeTab === 'studio'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>

            <button
              id="nav-tab-search"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all ${
                activeTab === 'search'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Knowledge Search</span>
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all ${
                activeTab === 'history'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Archive ({historyCount})</span>
            </button>

            <button
              id="nav-tab-templates"
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all ${
                activeTab === 'templates'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-3">
            {/* Quick Sample Selector Dropdown */}
            <div className="relative">
              <button
                id="btn-sample-fixtures"
                onClick={() => setSampleMenuOpen(!sampleMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-[0.1em] border border-black/20 transition shadow-sm group"
              >
                <div className="w-2 h-2 rounded-full bg-[#FF5F1F]"></div>
                <span>Load Sample</span>
                <span className="text-[10px] bg-black/10 group-hover:bg-white/20 group-hover:text-white px-1.5 py-0.2 font-mono">4</span>
              </button>

              {sampleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white border-2 border-black shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setSampleMenuOpen(false)}
                >
                  <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-black/50 border-b border-black/10 mb-1 flex items-center justify-between">
                    <span>Preloaded Intelligence</span>
                    <span className="text-[#FF5F1F]">FIXTURES</span>
                  </div>
                  {SAMPLE_FIXTURES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="w-full text-left p-2.5 hover:bg-[#F5F5F0] border-b border-black/5 last:border-none group transition flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black group-hover:text-[#FF5F1F] transition">
                          {sample.name.slice(0, 32)}...
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-black text-white font-mono uppercase">
                          {sample.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-black/60 line-clamp-1">
                        {sample.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Engine Status Badge */}
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-white border border-black/15 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-pulse"></div>
              <span className="text-black font-semibold">vLLM / GEMINI</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-black text-white font-bold tracking-wider uppercase">
                KV-CACHE
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

