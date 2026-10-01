import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Layers 
} from 'lucide-react';
import { SearchResponse, SearchCitation } from '../types';

interface KnowledgeSearchProps {
  onSearch: (query: string) => Promise<SearchResponse | null>;
  isSearching: boolean;
  historyCount: number;
}

export const KnowledgeSearch: React.FC<KnowledgeSearchProps> = ({
  onSearch,
  isSearching,
  historyCount,
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);

  const exampleQueries = [
    'What zero-day vulnerability and threat actor targeted the Western Power Grid?',
    'What specialized equipment was detected on vessel Haiyang Explorer-9 near Andaman?',
    'How did the Bharat-Payload Android malware siphon UPI funds and what actions were taken?',
    'What drone countermeasures were deployed in the high-altitude sector?',
  ];

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    const res = await onSearch(query);
    if (res) setResult(res);
  };

  const handleExampleClick = async (eq: string) => {
    setQuery(eq);
    const res = await onSearch(eq);
    if (res) setResult(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A]">
              Cross-Document Semantic Knowledge Index & Q&A
            </h2>
            <p className="text-xs text-[#666660]">
              Query across all ingested intelligence documents with grounded synthesis and exact citations (Phase 7)
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-5">
          <div className="relative">
            <input
              id="input-knowledge-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask an intelligence question across all ingested reports, IOCs, timelines..."
              className="w-full bg-[#F5F5F0] border border-[#E5E5E0] rounded-xl py-3.5 pl-11 pr-28 text-sm text-[#1A1A1A] placeholder-[#888880] focus:outline-none focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F] transition"
            />
            <Search className="w-5 h-5 text-[#888880] absolute left-3.5 top-3.5" />
            <button
              id="btn-search-execute"
              type="submit"
              disabled={isSearching || !query.trim()}
              className="absolute right-2 top-2 px-4 py-2 rounded-lg bg-[#FF5F1F] hover:bg-[#E04F16] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Example Queries */}
        <div className="mt-4 pt-3 border-t border-[#E5E5E0]">
          <span className="text-[11px] font-semibold text-[#666660] uppercase tracking-wider block mb-2 font-mono">
            Suggested Intelligence Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((eq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleExampleClick(eq)}
                className="text-left text-xs bg-[#FAF9F5] hover:bg-[#F0EFEA] hover:text-[#FF5F1F] text-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#E5E5E0] font-mono transition"
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5F1F]" />
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                Grounded Intelligence Synthesis
              </span>
            </div>
            <span className="text-xs font-mono text-[#666660]">
              Latency: {result.search_latency_ms}ms • Grounded
            </span>
          </div>

          {/* Synthesized Answer */}
          <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5 text-[#1A1A1A] text-sm leading-relaxed font-sans shadow-xs border-l-4 border-l-[#FF5F1F]">
            {result.answer}
          </div>

          {/* Citations & Source Chunks */}
          {result.citations && result.citations.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#666660] uppercase tracking-wider block font-mono">
                Source Document Citations ({result.citations.length}):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.citations.map((cite, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 font-display">
                          <FileText className="w-3.5 h-3.5 text-[#FF5F1F]" />
                          <span className="line-clamp-1">{cite.doc_title}</span>
                        </span>
                        {cite.relevance_score && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7] font-bold">
                            {(cite.relevance_score * 100).toFixed(0)}% Match
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-[#FF5F1F] font-semibold block mb-1">
                        Section: {cite.section_heading}
                      </span>

                      <p className="text-xs text-[#333330] italic font-mono bg-white p-2.5 rounded-lg border border-[#E5E5E0]">
                        "{cite.snippet}"
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-[#666660] pt-2 border-t border-[#E5E5E0] flex justify-between">
                      <span>Doc ID: {cite.doc_id.slice(0, 16)}...</span>
                      <span className="text-emerald-600 font-semibold">Verified Citation</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
