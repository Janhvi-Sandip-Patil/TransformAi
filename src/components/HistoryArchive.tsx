import React from 'react';
import { 
  History, 
  FileText, 
  Presentation, 
  Languages, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { ProcessedJobRecord } from '../types';

interface HistoryArchiveProps {
  history: ProcessedJobRecord[];
  onSelectJob: (job: ProcessedJobRecord) => void;
  onClearHistory: () => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  history,
  onSelectJob,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E5E0] rounded-xl p-12 text-center shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E5E5E0] text-[#666660] flex items-center justify-center mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#1A1A1A]">
          No Archival Records Yet
        </h3>
        <p className="text-xs text-[#666660] max-w-sm mx-auto">
          Transform a source document or load one of the preloaded sample fixtures to build your transformation archive.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E0]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Document Transformation Archive & History
            </h2>
            <p className="text-xs text-[#666660]">
              {history.length} processed intelligence jobs stored in local persistence
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Archive</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {history.map((job) => (
          <div
            key={job.doc_id}
            onClick={() => onSelectJob(job)}
            className="bg-white hover:bg-[#FAF9F5] border border-[#E5E5E0] hover:border-[#FF5F1F]/60 rounded-xl p-5 shadow-xs transition-all cursor-pointer group space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7] font-bold uppercase">
                  {job.document.source_format}
                </span>
                <h3 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#FF5F1F] transition font-display">
                  {job.structured_data?.title || job.document.metadata.filename}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#666660]">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-[#CCCCCC]">•</span>
                <span className="text-[#FF5F1F] font-bold">{job.metrics?.total_latency_ms || 1200}ms</span>
              </div>
            </div>

            <p className="text-xs text-[#333330] line-clamp-2 leading-relaxed">
              {job.structured_data?.executive_brief || job.document.raw_text.slice(0, 200)}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E5E5E0] gap-2">
              <div className="flex items-center gap-2">
                {job.outputs.summary_markdown && (
                  <span className="flex items-center gap-1 text-[11px] bg-[#FAF9F5] px-2 py-0.5 rounded text-[#1A1A1A] border border-[#E5E5E0]">
                    <FileText className="w-3 h-3 text-[#FF5F1F]" />
                    <span>Executive Brief</span>
                  </span>
                )}
                {job.outputs.slide_deck && (
                  <span className="flex items-center gap-1 text-[11px] bg-[#FAF9F5] px-2 py-0.5 rounded text-[#1A1A1A] border border-[#E5E5E0]">
                    <Presentation className="w-3 h-3 text-[#FF5F1F]" />
                    <span>Slide Deck</span>
                  </span>
                )}
                {job.outputs.translation && (
                  <span className="flex items-center gap-1 text-[11px] bg-[#FAF9F5] px-2 py-0.5 rounded text-[#1A1A1A] border border-[#E5E5E0]">
                    <Languages className="w-3 h-3 text-emerald-600" />
                    <span>{job.outputs.translation.target_language}</span>
                  </span>
                )}
                {job.outputs.social_and_storyboard && (
                  <span className="flex items-center gap-1 text-[11px] bg-[#FAF9F5] px-2 py-0.5 rounded text-[#1A1A1A] border border-[#E5E5E0]">
                    <Share2 className="w-3 h-3 text-blue-600" />
                    <span>Social Pack</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-[#FF5F1F] group-hover:translate-x-1 transition-transform">
                <span>View Outputs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
