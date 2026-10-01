import React, { useState } from 'react';
import { 
  Presentation, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  MessageSquare, 
  Check, 
  Sparkles, 
  MonitorPlay 
} from 'lucide-react';
import { SlideDeckData, StructuredIntelligence } from '../types';
import { exportToPptx } from '../utils/pptxExport';

interface SlideDeckViewerProps {
  slideDeck: SlideDeckData;
  structuredData?: StructuredIntelligence;
}

export const SlideDeckViewer: React.FC<SlideDeckViewerProps> = ({
  slideDeck,
  structuredData,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const slides = slideDeck.slides || [];
  const currentSlide = slides[currentSlideIndex] || null;

  const handlePptxDownload = async () => {
    try {
      setIsExporting(true);
      await exportToPptx(slideDeck, structuredData);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to export PPTX:', e);
      alert('Could not export PowerPoint file. Please check console.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!slides.length) {
    return (
      <div className="bg-white border border-[#E5E5E0] rounded-xl p-8 text-center text-[#666660]">
        No slide deck generated.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm space-y-6">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E5E5E0] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Auto-Generated Slide Deck Briefing
            </h3>
            <p className="text-xs text-[#666660]">
              {slides.length} Slides • Ready for executive presentation & direct .pptx download
            </p>
          </div>
        </div>

        {/* Download PPTX Button */}
        <button
          id="btn-download-pptx"
          onClick={handlePptxDownload}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5F1F] hover:bg-[#E04F16] text-white font-bold text-xs shadow-sm transition-all transform hover:-translate-y-0.5"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Building .PPTX...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PowerPoint (.pptx)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Slide Interactive Stage (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full max-w-4xl mx-auto bg-[#1A1A1A] text-white rounded-xl border border-[#333333] shadow-lg p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
        {/* Top Slide Meta */}
        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#FF5F1F] text-white">
              SLIDE {(currentSlide?.slide_number || currentSlideIndex + 1).toString().padStart(2, '0')} / {slides.length.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              NTRO STRATEGIC BRIEFING
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold text-[#FF5F1F]">
            {structuredData?.classification || 'CONFIDENTIAL'}
          </span>
        </div>

        {/* Slide Body */}
        <div className="my-auto py-4 space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-display">
              {currentSlide?.title}
            </h2>
            {currentSlide?.subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-[#FF5F1F] mt-1 font-mono">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Bullet Points in Container Card */}
          <div className="bg-[#242424] border border-[#333333] rounded-lg p-4 sm:p-6 space-y-2.5">
            {currentSlide?.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF5F1F] mt-1.5 shrink-0" />
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono border-t border-[#333333] pt-2">
          <span>TransformAI Platform • Automated Generation</span>
          <span>{new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#1A1A1A] border border-[#E5E5E0] transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        {/* Thumbnail Selector Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'w-6 bg-[#FF5F1F] ring-2 ring-[#FF5F1F]/30'
                  : 'bg-[#E5E5E0] hover:bg-[#CCCCCC]'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
          disabled={currentSlideIndex === slides.length - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#1A1A1A] border border-[#E5E5E0] transition"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      {currentSlide?.speaker_notes && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-4 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1A1A1A] mb-1">
              Presenter Talking Points / Speaker Notes:
            </h4>
            <p className="text-xs text-[#666660] leading-relaxed font-mono">
              {currentSlide.speaker_notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
