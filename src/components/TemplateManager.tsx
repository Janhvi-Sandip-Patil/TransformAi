import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Check, 
  Sparkles, 
  Edit3, 
  Save, 
  Code, 
  CheckCircle2 
} from 'lucide-react';
import { OutputTemplate } from '../types';

export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<OutputTemplate[]>([
    {
      id: 'advisory',
      name: 'National Cyber Security Threat Advisory',
      description: 'Formal operational declassified alert for inter-agency taskforces & CERT-In',
      output_format: 'markdown',
      system_instructions: 'Produce a high-fidelity operational cyber and security threat advisory with chronological incident timeline, entity correlation, threat indicators, and mitigation directives.',
      is_active: true,
    },
    {
      id: 'executive_brief',
      name: 'Strategic Executive Briefing',
      description: 'High-level executive briefing tailored for ministry leadership and decision makers',
      output_format: 'markdown',
      system_instructions: 'Summarize strategic implications, risk assessment, financial/security impact, and key recommended policy decisions.',
      is_active: true,
    },
    {
      id: 'presentation_deck',
      name: 'Slide Deck Presentation (.pptx)',
      description: 'Structured slide definitions with bullet points, visuals, and speaker notes',
      output_format: 'slides',
      system_instructions: 'Generate structured slide definitions with concise titles, max 5-6 bullets per slide, visual cues, and speaker talking notes.',
      is_active: true,
    },
    {
      id: 'indic_translation',
      name: 'Indic Regional Translation (Hindi/Multi)',
      description: 'High-precision translation for regional field offices preserving technical terms',
      output_format: 'markdown',
      system_instructions: 'Translate the strategic intelligence brief into the target Indic language. Keep entity names, CVE identifiers, and technical acronyms in their original script.',
      is_active: true,
    },
    {
      id: 'multi_channel_social',
      name: 'Multi-Channel Outreach & Storyboard Pack',
      description: 'LinkedIn outreach, Twitter/X awareness thread, and field training video storyboard',
      output_format: 'social',
      system_instructions: 'Generate tailored multi-channel messaging: professional LinkedIn post, concise numbered Twitter thread, and a 4-scene operator video storyboard.',
      is_active: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeForm, setActiveForm] = useState<OutputTemplate | null>(null);

  const handleEdit = (tpl: OutputTemplate) => {
    setEditingId(tpl.id);
    setActiveForm({ ...tpl });
  };

  const handleSave = () => {
    if (!activeForm) return;
    setTemplates(templates.map((t) => (t.id === activeForm.id ? activeForm : t)));
    setEditingId(null);
    setActiveForm(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Prompt & Transformation Template Engine
            </h2>
            <p className="text-xs text-[#666660]">
              Configure and add modular output format templates without modifying backend code
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-4 h-4" /> Template Saved!
          </span>
        )}
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white border border-[#E5E5E0] rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7] font-bold">
                  {tpl.output_format}
                </span>
                <h3 className="text-sm font-bold text-[#1A1A1A] font-display">{tpl.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                {editingId === tpl.id ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1 bg-[#FF5F1F] hover:bg-[#E04F16] text-white text-xs font-bold rounded-lg transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(tpl)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F5F0] hover:bg-[#EAEAE5] text-[#1A1A1A] text-xs font-semibold rounded-lg border border-[#E5E5E0] transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#666660]" />
                    <span>Configure</span>
                  </button>
                )}
              </div>
            </div>

            {editingId === tpl.id && activeForm ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#666660] mb-1 font-mono">
                    Template Name:
                  </label>
                  <input
                    type="text"
                    value={activeForm.name}
                    onChange={(e) => setActiveForm({ ...activeForm, name: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-[#E5E5E0] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] font-sans focus:outline-none focus:border-[#FF5F1F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#666660] mb-1 font-mono">
                    System Instruction & Prompt Spec:
                  </label>
                  <textarea
                    rows={3}
                    value={activeForm.system_instructions}
                    onChange={(e) =>
                      setActiveForm({ ...activeForm, system_instructions: e.target.value })
                    }
                    className="w-full bg-[#FAF9F5] border border-[#E5E5E0] rounded-lg p-2.5 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#FF5F1F]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#666660] mb-2 font-sans">{tpl.description}</p>
                <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E5E0]">
                  <span className="text-[10px] font-mono text-[#666660] block mb-1 uppercase font-bold">
                    System Prompt Specification:
                  </span>
                  <p className="text-xs font-mono text-[#1A1A1A] leading-relaxed">
                    {tpl.system_instructions}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
