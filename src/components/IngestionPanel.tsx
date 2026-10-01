import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Mic, 
  SlidersHorizontal, 
  Sparkles, 
  Trash2, 
  Languages, 
  Presentation, 
  FileCode, 
  Share2, 
  Check, 
  ShieldCheck, 
  FileCheck2,
  FolderOpen
} from 'lucide-react';
import { GenerationParameters, SourceFormat } from '../types';
import { SAMPLE_FIXTURES, SampleFixture } from '../data/sampleFixtures';

interface IngestionPanelProps {
  rawText: string;
  setRawText: (text: string) => void;
  sourceFormat: SourceFormat;
  setSourceFormat: (format: SourceFormat) => void;
  filename: string;
  setFilename: (name: string) => void;
  parameters: GenerationParameters;
  setParameters: React.Dispatch<React.SetStateAction<GenerationParameters>>;
  onTransform: (fileBase64?: string, mimeType?: string) => void;
  isProcessing: boolean;
  onSelectSample: (fixture: SampleFixture) => void;
}

export const IngestionPanel: React.FC<IngestionPanelProps> = ({
  rawText,
  setRawText,
  sourceFormat,
  setSourceFormat,
  filename,
  setFilename,
  parameters,
  setParameters,
  onTransform,
  isProcessing,
  onSelectSample,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection (PDF, DOCX, TXT, Image, Audio)
  const handleFile = (file: File) => {
    const reader = new FileReader();
    setFilename(file.name);

    if (file.type.startsWith('image/')) {
      setSourceFormat('image');
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setUploadedBase64(base64Data);
        setUploadedMimeType(file.type);
        setRawText(`[Uploaded Image: ${file.name} - Scanned OCR processing ready]`);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      setSourceFormat('audio');
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setUploadedBase64(base64Data);
        setUploadedMimeType(file.type);
        setRawText(`[Uploaded Audio: ${file.name} - Whisper transcription ready]`);
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith('.pdf')) {
      setSourceFormat('pdf');
      reader.onload = () => {
        const text = reader.result as string;
        setRawText(text || `[PDF Document: ${file.name} uploaded]`);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.docx')) {
      setSourceFormat('docx');
      reader.onload = () => {
        const text = reader.result as string;
        setRawText(text || `[DOCX Document: ${file.name} uploaded]`);
      };
      reader.readAsText(file);
    } else {
      setSourceFormat('text');
      reader.onload = () => {
        setRawText(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;
  const tokenEstimate = Math.round(charCount / 3.8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() && !uploadedBase64) return;
    onTransform(uploadedBase64 || undefined, uploadedMimeType || undefined);
  };

  return (
    <div className="bg-white border-2 border-black p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-black/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black text-white">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-black">
              Source Ingestion & Transformation Setup
            </h2>
            <p className="text-xs text-black/60 font-medium">
              Upload raw documents (PDF, DOCX, Scanned OCR, Audio) or paste operational text
            </p>
          </div>
        </div>

        {/* Format indicators */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['text', 'pdf', 'docx', 'image', 'audio'] as SourceFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setSourceFormat(fmt)}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase transition ${
                sourceFormat === fmt
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-[#F5F5F0] text-black/60 border border-black/15 hover:text-black hover:border-black'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Drag & Drop Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#FF5F1F] bg-[#FF5F1F]/5'
              : 'border-black/20 bg-[#F5F5F0] hover:border-black hover:bg-white'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.mp3,.wav"
            className="hidden"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="p-3 bg-black text-white">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-black uppercase tracking-wider">
                {filename ? (
                  <span className="text-[#FF5F1F] font-mono">SELECTED: {filename}</span>
                ) : (
                  <span>CLICK TO BROWSE OR DRAG & DROP SOURCE FILE</span>
                )}
              </p>
              <p className="text-[11px] text-black/50 font-medium">
                Supports PDF, DOCX, Scanned OCR Images (PNG/JPG), and Radio Audio (MP3/WAV)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector Bar */}
        <div className="bg-[#F5F5F0] p-4 border border-black/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
              Or Load Pre-Packaged Intelligence Samples:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_FIXTURES.map((fix) => (
              <button
                key={fix.id}
                type="button"
                onClick={() => onSelectSample(fix)}
                className="p-2.5 bg-white hover:bg-black hover:text-white border border-black/15 text-left transition group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-black text-white group-hover:bg-[#FF5F1F] group-hover:text-white uppercase">
                    {fix.tag}
                  </span>
                  <span className="text-[9px] text-black/50 group-hover:text-white/60 font-mono">{fix.format.toUpperCase()}</span>
                </div>
                <p className="text-xs font-bold text-black group-hover:text-white line-clamp-1">
                  {fix.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-black">
            <label className="font-black uppercase tracking-wider text-[11px] text-black">
              Source Document Text Content:
            </label>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-black/60">{wordCount} words</span>
              <span className="text-black/60">{charCount} chars</span>
              <span className="text-[#FF5F1F] font-bold">~{tokenEstimate} tokens</span>
              {rawText && (
                <button
                  type="button"
                  onClick={() => {
                    setRawText('');
                    setFilename('');
                    setUploadedBase64(null);
                  }}
                  className="text-black/40 hover:text-red-600 transition"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <textarea
            id="input-source-text"
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw text, threat telemetry, military dispatch, cyber advisory, incident reports, or drop files above..."
            className="w-full bg-[#F5F5F0] border-2 border-black/15 p-4 text-xs text-black font-mono focus:outline-none focus:border-black focus:bg-white leading-relaxed transition"
          />
        </div>

        {/* Target Output Types Selector (Problem Statement 26154 requirement) */}
        <div className="bg-[#F5F5F0] p-5 border border-black/15">
          <label className="block text-[11px] font-black text-black uppercase tracking-[0.2em] mb-3">
            Select Desired Output Formats (Multi-Channel Transformation):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Executive Summary */}
            <label
              className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition ${
                parameters.include_summary
                  ? 'bg-white border-black shadow-sm'
                  : 'bg-white/50 border-black/10 text-black/50 hover:border-black/30'
              }`}
            >
              <input
                type="checkbox"
                checked={parameters.include_summary}
                onChange={(e) =>
                  setParameters({ ...parameters, include_summary: e.target.checked })
                }
                className="mt-0.5 accent-black"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-tight">
                  <FileText className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  <span>Executive Brief</span>
                </div>
                <p className="text-[11px] text-black/60 mt-1 leading-snug">
                  Structured markdown advisory with timelines & entity matrix
                </p>
              </div>
            </label>

            {/* 2. Slide Deck */}
            <label
              className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition ${
                parameters.include_slides
                  ? 'bg-white border-black shadow-sm'
                  : 'bg-white/50 border-black/10 text-black/50 hover:border-black/30'
              }`}
            >
              <input
                type="checkbox"
                checked={parameters.include_slides}
                onChange={(e) =>
                  setParameters({ ...parameters, include_slides: e.target.checked })
                }
                className="mt-0.5 accent-black"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-tight">
                  <Presentation className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  <span>Slide Deck (.pptx)</span>
                </div>
                <p className="text-[11px] text-black/60 mt-1 leading-snug">
                  Auto-formatted PowerPoint presentation ready to download
                </p>
              </div>
            </label>

            {/* 3. Indic Translation */}
            <label
              className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition ${
                parameters.include_translation
                  ? 'bg-white border-black shadow-sm'
                  : 'bg-white/50 border-black/10 text-black/50 hover:border-black/30'
              }`}
            >
              <input
                type="checkbox"
                checked={parameters.include_translation}
                onChange={(e) =>
                  setParameters({ ...parameters, include_translation: e.target.checked })
                }
                className="mt-0.5 accent-black"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-tight">
                  <Languages className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  <span>Indic Translation</span>
                </div>
                <p className="text-[11px] text-black/60 mt-1 leading-snug">
                  Hindi & regional languages preserving technical identifiers
                </p>
              </div>
            </label>

            {/* 4. Social Pack */}
            <label
              className={`flex items-start gap-3 p-3.5 border-2 cursor-pointer transition ${
                parameters.include_social
                  ? 'bg-white border-black shadow-sm'
                  : 'bg-white/50 border-black/10 text-black/50 hover:border-black/30'
              }`}
            >
              <input
                type="checkbox"
                checked={parameters.include_social}
                onChange={(e) =>
                  setParameters({ ...parameters, include_social: e.target.checked })
                }
                className="mt-0.5 accent-black"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-tight">
                  <Share2 className="w-3.5 h-3.5 text-[#FF5F1F]" />
                  <span>Social & Storyboard</span>
                </div>
                <p className="text-[11px] text-black/60 mt-1 leading-snug">
                  LinkedIn Post, Twitter thread & tactical video storyboard
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Parameters Controls */}
        <div className="bg-white p-5 border-2 border-black/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <SlidersHorizontal className="w-4 h-4 text-[#FF5F1F]" />
              <span>Generation Controls & Parameters</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-[11px] text-black hover:text-[#FF5F1F] underline font-bold uppercase tracking-wider"
            >
              {showAdvanced ? 'Hide Options' : 'Customize Parameters'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Tone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
                Operational Tone:
              </label>
              <select
                value={parameters.tone}
                onChange={(e) =>
                  setParameters({ ...parameters, tone: e.target.value as any })
                }
                className="w-full bg-[#F5F5F0] border border-black/20 p-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="Analytical / Tactical">Analytical / Tactical</option>
                <option value="Executive / High-Level">Executive / High-Level</option>
                <option value="Formal Security Advisory">Formal Security Advisory</option>
                <option value="Public Awareness">Public Awareness</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
                Target Audience:
              </label>
              <select
                value={parameters.target_audience}
                onChange={(e) =>
                  setParameters({ ...parameters, target_audience: e.target.value as any })
                }
                className="w-full bg-[#F5F5F0] border border-black/20 p-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="Senior Leadership / NTRO">Senior Leadership / NTRO</option>
                <option value="Field Operations & Analysts">Field Operations & Analysts</option>
                <option value="Inter-Agency Taskforce">Inter-Agency Taskforce</option>
                <option value="General Public">General Public</option>
              </select>
            </div>

            {/* Target Language */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
                Translation Language:
              </label>
              <select
                value={parameters.target_language}
                onChange={(e) =>
                  setParameters({ ...parameters, target_language: e.target.value })
                }
                className="w-full bg-[#F5F5F0] border border-black/20 p-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
              </select>
            </div>

            {/* Detail Level */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 mb-1">
                Detail Density:
              </label>
              <select
                value={parameters.detail_level}
                onChange={(e) =>
                  setParameters({ ...parameters, detail_level: e.target.value as any })
                }
                className="w-full bg-[#F5F5F0] border border-black/20 p-2 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="Concise">Concise (Fast Summary)</option>
                <option value="Standard">Standard (Balanced)</option>
                <option value="Exhaustive / Detailed">Exhaustive / Detailed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-black/60 font-medium">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Parallel LLM Workers & Prefix KV-Cache Active</span>
          </div>

          <button
            id="btn-execute-transform"
            type="submit"
            disabled={isProcessing || !rawText.trim()}
            className={`w-full sm:w-auto px-8 py-3.5 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              isProcessing || !rawText.trim()
                ? 'bg-black/10 text-black/30 cursor-not-allowed border border-black/10'
                : 'bg-[#FF5F1F] hover:bg-black text-white shadow-md active:translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <span>Transforming Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Transformation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

