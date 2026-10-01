import React, { useState } from 'react';
import { 
  Languages, 
  Copy, 
  Check, 
  Download, 
  ArrowRightLeft, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { TranslationResult, StructuredIntelligence } from '../types';

interface TranslationViewerProps {
  translation: TranslationResult;
  structuredData?: StructuredIntelligence;
  onRetranslate?: (lang: string) => void;
  isTranslating?: boolean;
}

export const TranslationViewer: React.FC<TranslationViewerProps> = ({
  translation,
  structuredData,
  onRetranslate,
  isTranslating,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState(translation.target_language || 'Hindi');

  const fullTranslatedText = `
${translation.translated_title}

[कार्यकारी सारांश / Executive Summary]
${translation.translated_executive_brief}

[प्रमुख बिंदु / Key Findings]
${translation.translated_summary_points?.map((p, i) => `${i + 1}. ${p}`).join('\n')}

[रणनीतिक अनुशंसाएं / Strategic Recommendations]
${translation.translated_recommendations?.map((r, i) => `• ${r}`).join('\n')}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTranslatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullTranslatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_${translation.target_language.toLowerCase()}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languagesList = [
    { code: 'Hindi', label: 'Hindi (हिंदी)' },
    { code: 'Marathi', label: 'Marathi (मराठी)' },
    { code: 'Bengali', label: 'Bengali (বাংলা)' },
    { code: 'Tamil', label: 'Tamil (தமிழ்)' },
    { code: 'Telugu', label: 'Telugu (తెలుగు)' },
    { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
    { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'Malayalam', label: 'Malayalam (മലയാളം)' },
    { code: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  ];

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E5E5E0] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Indic Regional Translation Engine
            </h3>
            <p className="text-xs text-[#666660]">
              High-accuracy contextual translation • Technical entities preserved in original script
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Retranslate Lang Dropdown */}
          {onRetranslate && (
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                onRetranslate(e.target.value);
              }}
              disabled={isTranslating}
              className="bg-[#F5F5F0] border border-[#E5E5E0] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#FF5F1F]"
            >
              {languagesList.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          )}

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
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Entity Preservation Badge */}
      {translation.untranslated_entities && translation.untranslated_entities.length > 0 && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#666660]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preserved Technical Identifiers & Proper Nouns:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {translation.untranslated_entities.slice(0, 8).map((term, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#1A1A1A] border border-[#E5E5E0] font-semibold"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source English */}
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2">
            <span className="text-xs font-bold text-[#666660] uppercase tracking-wider font-mono">
              Source Intelligence (English)
            </span>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-[#666660] border border-[#E5E5E0]">
              ORIGINAL
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A] mb-2 font-display">
              {structuredData?.title || 'Source Strategic Title'}
            </h4>
            <p className="text-xs text-[#333330] leading-relaxed bg-white p-3.5 rounded-lg border border-[#E5E5E0]">
              {structuredData?.executive_brief}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#666660] mb-2 uppercase font-mono">
              Key Strategic Findings:
            </h5>
            <ul className="space-y-1.5">
              {structuredData?.summary_points.map((p, i) => (
                <li key={i} className="text-xs text-[#333330] flex items-start gap-2">
                  <span className="text-[#FF5F1F] font-mono font-bold">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#666660] mb-2 uppercase font-mono">
              Mandatory Directives:
            </h5>
            <ul className="space-y-1.5">
              {structuredData?.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-[#333330] flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Translated Output */}
        <div className="bg-white border-2 border-[#FF5F1F]/40 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2">
            <span className="text-xs font-bold text-[#FF5F1F] uppercase tracking-wider font-mono">
              {translation.language_name} Translation ({translation.target_language})
            </span>
            <span className="text-[10px] font-mono bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7] px-2 py-0.5 rounded font-bold">
              TRANSLATED
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A] mb-2 font-display">
              {translation.translated_title}
            </h4>
            <p className="text-xs text-[#1A1A1A] leading-relaxed bg-[#FAF9F5] p-3.5 rounded-lg border-l-2 border-[#FF5F1F]">
              {translation.translated_executive_brief}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#FF5F1F] mb-2 uppercase font-mono">
              मुख्य निष्कर्ष / Key Findings:
            </h5>
            <ul className="space-y-1.5">
              {translation.translated_summary_points?.map((p, i) => (
                <li key={i} className="text-xs text-[#1A1A1A] flex items-start gap-2">
                  <span className="text-[#FF5F1F] font-mono font-bold">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#FF5F1F] mb-2 uppercase font-mono">
              रणनीतिक दिशा-निर्देश / Strategic Directives:
            </h5>
            <ul className="space-y-1.5">
              {translation.translated_recommendations?.map((r, i) => (
                <li key={i} className="text-xs text-[#1A1A1A] flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
