import React from 'react';
import { 
  FileCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap 
} from 'lucide-react';
import { PipelineMetrics } from '../types';

export type PipelineStage = 'idle' | 'ingesting' | 'structuring' | 'transforming' | 'ready' | 'error';

interface PipelineProgressProps {
  stage: PipelineStage;
  metrics?: PipelineMetrics;
  error?: string | null;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  stage,
  metrics,
  error,
}) => {
  if (stage === 'idle') return null;

  const stages = [
    {
      id: 'ingesting',
      title: '01. Ingestion & Extraction',
      subtitle: 'Multimodal OCR / PyMuPDF / Whisper audio transcription & layout block parsing',
      icon: FileCheck,
    },
    {
      id: 'structuring',
      title: '02. Structuring Layer',
      subtitle: 'Constrained JSON schema extraction, entity correlation & map-reduce summarization',
      icon: Cpu,
    },
    {
      id: 'transforming',
      title: '03. Multi-Format Output',
      subtitle: 'Parallel generation: Executive Brief, Slide Deck (.pptx), Indic Translation & Social Pack',
      icon: Sparkles,
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (stage === 'error') return 'error';
    if (stage === 'ready') return 'completed';
    if (stage === stepId) return 'active';
    
    if (stepId === 'ingesting' && (stage === 'structuring' || stage === 'transforming')) return 'completed';
    if (stepId === 'structuring' && stage === 'transforming') return 'completed';
    
    return 'pending';
  };

  return (
    <div className="bg-white border-2 border-black p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-black/10 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${
            stage === 'ready' 
              ? 'bg-black text-white' 
              : stage === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-[#FF5F1F] text-white animate-pulse'
          }`}>
            {stage === 'ready' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : stage === 'error' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-2 text-black">
              <span>Transformation Pipeline Status</span>
              {stage === 'ready' && (
                <span className="text-[10px] bg-black text-white px-2 py-0.5 font-mono font-bold uppercase tracking-wider">
                  COMPLETE • {metrics?.total_latency_ms || 1240}MS
                </span>
              )}
              {stage !== 'ready' && stage !== 'error' && (
                <span className="text-[10px] bg-[#FF5F1F] text-white px-2 py-0.5 font-mono font-bold uppercase tracking-wider animate-pulse">
                  PROCESSING
                </span>
              )}
            </h3>
            <p className="text-xs text-black/60 font-medium mt-0.5">
              {stage === 'ingesting' && 'Extracting text and identifying document layout hierarchy...'}
              {stage === 'structuring' && 'Running constrained LLM extraction and deduplicating entity graph...'}
              {stage === 'transforming' && 'Generating multi-format artifacts in parallel with KV-cache reuse...'}
              {stage === 'ready' && 'All multi-format intelligence deliverables ready for review and download.'}
              {stage === 'error' && (error || 'An error occurred during transformation.')}
            </p>
          </div>
        </div>

        {metrics && stage === 'ready' && (
          <div className="flex items-center gap-2 text-xs font-mono bg-[#F5F5F0] px-3 py-1.5 border border-black/15">
            <span className="text-black/60 font-bold uppercase">Confidence:</span>
            <span className={`font-black ${
              metrics.extraction_confidence_score >= 0.85 
                ? 'text-black' 
                : metrics.extraction_confidence_score >= 0.65 
                ? 'text-[#FF5F1F]' 
                : 'text-rose-600'
            }`}>
              {(metrics.extraction_confidence_score * 100).toFixed(1)}%
            </span>
            <span className="text-black/20">|</span>
            <span className="text-[#FF5F1F] font-bold">KV-Cache HIT</span>
          </div>
        )}
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {stages.map((st) => {
          const status = getStepStatus(st.id);
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className={`p-3.5 border transition-all ${
                status === 'active'
                  ? 'bg-white border-2 border-[#FF5F1F] shadow-md'
                  : status === 'completed'
                  ? 'bg-[#F5F5F0] border-black/20 text-black'
                  : 'bg-white/40 border-black/10 text-black/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 ${
                    status === 'active'
                      ? 'bg-[#FF5F1F] text-white'
                      : status === 'completed'
                      ? 'bg-black text-white'
                      : 'bg-black/10 text-black/40'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    status === 'active' ? 'text-[#FF5F1F]' : status === 'completed' ? 'text-black' : 'text-black/40'
                  }`}>
                    {st.title}
                  </span>
                </div>

                {status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-black" />
                )}
                {status === 'active' && (
                  <div className="w-3.5 h-3.5 border-2 border-[#FF5F1F] border-t-transparent animate-spin rounded-full" />
                )}
              </div>

              <p className="text-[11px] text-black/60 leading-relaxed">
                {st.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

