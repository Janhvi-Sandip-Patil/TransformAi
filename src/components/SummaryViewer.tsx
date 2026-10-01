import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Activity, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { StructuredIntelligence } from '../types';

interface SummaryViewerProps {
  markdownContent: string;
  structuredData?: StructuredIntelligence;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({
  markdownContent,
  structuredData,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    const blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence_briefing_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E5E5E0] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Executive Strategic Brief & Operational Advisory
            </h3>
            <p className="text-xs text-[#666660]">
              Synthesized from source document with threat scoring and directive roadmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] text-[#1A1A1A] text-xs font-semibold border border-[#E5E5E0] transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#666660]" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleDownload('md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Classification & Key Header Card if Structured Data Exists */}
      {structuredData && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7] tracking-wider uppercase">
              {structuredData.classification || 'CONFIDENTIAL // OFFICIAL USE'}
            </span>
            <span className="text-xs text-[#666660] font-mono">
              Model: Gemini 3.7 Flash • Confidence: {(structuredData.confidence_score * 100).toFixed(0)}%
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 font-display">
            {structuredData.title}
          </h2>

          <p className="text-xs text-[#333330] leading-relaxed bg-white p-3.5 rounded-lg border-l-2 border-[#FF5F1F] shadow-xs">
            {structuredData.executive_brief}
          </p>
        </div>
      )}

      {/* Threat Metrics & Indicators */}
      {structuredData?.threat_indicators_or_metrics && structuredData.threat_indicators_or_metrics.length > 0 && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5">
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
            <Activity className="w-4 h-4 text-[#FF5F1F]" />
            <span>Key Metrics & Threat Indicators</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {structuredData.threat_indicators_or_metrics.map((metric, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border border-[#E5E5E0] shadow-xs flex flex-col justify-between">
                <span className="text-[11px] text-[#666660] font-mono line-clamp-1">{metric.key}</span>
                <span className="text-xs font-bold text-[#1A1A1A] font-mono mt-1">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chronological Timeline */}
      {structuredData?.key_dates && structuredData.key_dates.length > 0 && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5">
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-[#1A1A1A]" />
            <span>Incident Chronology & Event Timeline</span>
          </h4>
          <div className="space-y-2.5 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E5E0]">
            {structuredData.key_dates.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 relative pl-6">
                <div className="w-2 h-2 rounded-full bg-[#FF5F1F] absolute left-2 top-1.5 ring-4 ring-[#FAF9F5]" />
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#FF5F1F] mr-2">{item.date}</span>
                  <span className="text-xs text-[#333330]">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Rendered Markdown Content */}
      <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5 font-mono text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
        {markdownContent}
      </div>
    </div>
  );
};
