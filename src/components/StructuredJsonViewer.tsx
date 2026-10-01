import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { StructuredIntelligence } from '../types';

interface StructuredJsonViewerProps {
  data: StructuredIntelligence;
}

export const StructuredJsonViewer: React.FC<StructuredJsonViewerProps> = ({ data }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `structured_intel_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#FAF9F5] border-b border-[#E5E5E0]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A] hover:text-[#FF5F1F] transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#666660]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#FF5F1F]" />
          )}
          <Code2 className="w-4 h-4 text-[#FF5F1F]" />
          <span>Structured Intelligence Artifact (JSON Schema)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#1A1A1A] border border-[#E5E5E0] font-mono">
            {data.entities?.length || 0} Entities • {data.sections?.length || 0} Sections
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-[#E5E5E0] text-[11px] font-mono">
            <span className="text-[#666660]">Confidence:</span>
            <span className={`font-bold ${
              data.confidence_score >= 0.85 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {(data.confidence_score * 100).toFixed(0)}%
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border border-[#E5E5E0] transition"
            title="Copy JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#666660]" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border border-[#E5E5E0] transition"
            title="Download JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#666660]" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-4 bg-[#1A1A1A] max-h-96 overflow-y-auto">
          {/* Quick Entity Pills */}
          {data.entities && data.entities.length > 0 && (
            <div className="mb-3 pb-3 border-b border-[#333333]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5 font-mono">
                Deduplicated Entity Graph:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.entities.map((e, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] text-neutral-200 font-mono flex items-center gap-1"
                  >
                    <span className="text-[#FF5F1F] font-semibold">{e.name}</span>
                    <span className="text-neutral-400">({e.type})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Highlighted JSON text */}
          <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap selection:bg-[#FF5F1F] selection:text-white">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
