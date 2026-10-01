import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  PipelineProgress, 
  PipelineStage 
} from './components/PipelineProgress';
import { 
  IngestionPanel 
} from './components/IngestionPanel';
import { 
  StructuredJsonViewer 
} from './components/StructuredJsonViewer';
import { 
  SummaryViewer 
} from './components/SummaryViewer';
import { 
  SlideDeckViewer 
} from './components/SlideDeckViewer';
import { 
  TranslationViewer 
} from './components/TranslationViewer';
import { 
  SocialAndMediaViewer 
} from './components/SocialAndMediaViewer';
import { 
  MetricsPanel 
} from './components/MetricsPanel';
import { 
  KnowledgeSearch 
} from './components/KnowledgeSearch';
import { 
  HistoryArchive 
} from './components/HistoryArchive';
import { 
  TemplateManager 
} from './components/TemplateManager';
import { 
  SourceFormat, 
  GenerationParameters, 
  IngestedDocument, 
  StructuredIntelligence, 
  TransformationOutputs, 
  PipelineMetrics, 
  ProcessedJobRecord, 
  SearchResponse 
} from './types';
import { SAMPLE_FIXTURES, SampleFixture } from './data/sampleFixtures';
import { 
  FileText, 
  Presentation, 
  Languages, 
  Share2, 
  Code2, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeNavTab, setActiveNavTab] = useState<'studio' | 'search' | 'history' | 'templates'>('studio');

  // Active Output View Tab inside Studio
  const [activeOutputTab, setActiveOutputTab] = useState<'summary' | 'slides' | 'translation' | 'social' | 'json'>('summary');

  // Ingestion Inputs
  const [rawText, setRawText] = useState<string>('');
  const [sourceFormat, setSourceFormat] = useState<SourceFormat>('pdf');
  const [filename, setFilename] = useState<string>('NTRO_Advisory_2026_088.pdf');

  // Generation Parameters
  const [parameters, setParameters] = useState<GenerationParameters>({
    tone: 'Analytical / Tactical',
    target_audience: 'Senior Leadership / NTRO',
    target_language: 'Hindi',
    detail_level: 'Standard',
    include_slides: true,
    include_translation: true,
    include_social: true,
    include_summary: true,
  });

  // Pipeline State
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Data Store for Current Document
  const [currentDocument, setCurrentDocument] = useState<IngestedDocument | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredIntelligence | null>(null);
  const [transformationOutputs, setTransformationOutputs] = useState<TransformationOutputs | null>(null);
  const [pipelineMetrics, setPipelineMetrics] = useState<PipelineMetrics | null>(null);

  // History Store
  const [history, setHistory] = useState<ProcessedJobRecord[]>([]);

  // Load first sample fixture by default on initial mount for instant evaluation
  useEffect(() => {
    const firstSample = SAMPLE_FIXTURES[0];
    setRawText(firstSample.raw_text);
    setSourceFormat(firstSample.format);
    setFilename(`${firstSample.id}.pdf`);
  }, []);

  // Handle Sample Selection
  const handleSelectSample = (sample: SampleFixture) => {
    setRawText(sample.raw_text);
    setSourceFormat(sample.format);
    setFilename(`${sample.id}.${sample.format}`);
    setActiveNavTab('studio');
  };

  // Main Transformation Execution Pipeline
  const handleTransform = async (fileBase64?: string, mimeType?: string) => {
    setErrorMessage(null);
    setPipelineStage('ingesting');

    try {
      // 1. INGESTION & NORMALIZATION STAGE
      const ingestRes = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: rawText,
          source_format: sourceFormat,
          filename: filename || 'document.txt',
          file_base64: fileBase64,
          mime_type: mimeType,
        }),
      });

      if (!ingestRes.ok) {
        const errData = await ingestRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed during ingestion stage.');
      }

      const ingestData = await ingestRes.json();
      const ingestedDoc: IngestedDocument = ingestData.document;
      setCurrentDocument(ingestedDoc);

      // 2. STRUCTURING STAGE (Constrained LLM JSON Schema)
      setPipelineStage('structuring');
      const structureRes = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: ingestedDoc.doc_id,
          raw_text: ingestedDoc.raw_text,
        }),
      });

      if (!structureRes.ok) {
        const errData = await structureRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed during structuring stage.');
      }

      const structureData = await structureRes.json();
      const extractedStructured: StructuredIntelligence = structureData.structured_data;
      setStructuredData(extractedStructured);

      // 3. MULTI-FORMAT TRANSFORMATION STAGE (Parallel Fan-Out)
      setPipelineStage('transforming');
      const transformRes = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: ingestedDoc.doc_id,
          structured_data: extractedStructured,
          parameters,
        }),
      });

      if (!transformRes.ok) {
        const errData = await transformRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed during multi-format transformation stage.');
      }

      const transformData = await transformRes.json();
      const outputs: TransformationOutputs = transformData.outputs;
      const metrics: PipelineMetrics = transformData.metrics;

      setTransformationOutputs(outputs);
      setPipelineMetrics(metrics);
      setPipelineStage('ready');

      // Auto-focus default available tab
      if (outputs.summary_markdown) {
        setActiveOutputTab('summary');
      } else if (outputs.slide_deck) {
        setActiveOutputTab('slides');
      } else if (outputs.translation) {
        setActiveOutputTab('translation');
      }

      // Save to Archival Record
      const jobRecord: ProcessedJobRecord = {
        doc_id: ingestedDoc.doc_id,
        created_at: new Date().toISOString(),
        document: ingestedDoc,
        structured_data: extractedStructured,
        outputs,
        metrics,
        parameters,
      };

      setHistory((prev) => [jobRecord, ...prev]);
    } catch (err: any) {
      console.error('Pipeline failure:', err);
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setPipelineStage('error');
    }
  };

  // Retranslate specifically into a new language
  const handleRetranslate = async (targetLang: string) => {
    if (!structuredData || !currentDocument) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: currentDocument.doc_id,
          structured_data: structuredData,
          parameters: {
            ...parameters,
            target_language: targetLang,
            include_summary: false,
            include_slides: false,
            include_social: false,
            include_translation: true,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.outputs?.translation && transformationOutputs) {
          setTransformationOutputs({
            ...transformationOutputs,
            translation: data.outputs.translation,
          });
        }
      }
    } catch (e) {
      console.error('Retranslation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Cross-Document Knowledge Search
  const handleSearch = async (query: string): Promise<SearchResponse | null> => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (e) {
      console.error('Search error:', e);
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  // Restore previous job from History
  const handleSelectJob = (job: ProcessedJobRecord) => {
    setCurrentDocument(job.document);
    setStructuredData(job.structured_data);
    setTransformationOutputs(job.outputs);
    setPipelineMetrics(job.metrics);
    setParameters(job.parameters);
    setRawText(job.document.raw_text);
    setSourceFormat(job.document.source_format);
    setFilename(job.document.metadata.filename);
    setPipelineStage('ready');
    setActiveNavTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FF5F1F] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onSelectSample={handleSelectSample}
        isProcessing={pipelineStage !== 'idle' && pipelineStage !== 'ready' && pipelineStage !== 'error'}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: TRANSFORM STUDIO (Primary Workspace) */}
        {activeNavTab === 'studio' && (
          <div className="space-y-6">
            {/* Pipeline Stage Tracker */}
            <PipelineProgress
              stage={pipelineStage}
              metrics={pipelineMetrics || undefined}
              error={errorMessage}
            />

            {/* Ingestion & Parameter Panel */}
            <IngestionPanel
              rawText={rawText}
              setRawText={setRawText}
              sourceFormat={sourceFormat}
              setSourceFormat={setSourceFormat}
              filename={filename}
              setFilename={setFilename}
              parameters={parameters}
              setParameters={setParameters}
              onTransform={handleTransform}
              isProcessing={pipelineStage === 'ingesting' || pipelineStage === 'structuring' || pipelineStage === 'transforming'}
              onSelectSample={handleSelectSample}
            />

            {/* Low Confidence Banner (if applicable - Problem brief requirement) */}
            {pipelineMetrics?.confidence_status === 'low_confidence' && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Low Extraction Signal Confidence Detected ({((pipelineMetrics?.extraction_confidence_score || 0) * 100).toFixed(0)}%)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Source text may have low character density or noisy OCR artifacts. Structured intelligence was synthesized with conservative confidence boundaries.
                  </p>
                </div>
              </div>
            )}

            {/* TRANSFORMATION RESULTS SUITE */}
            {transformationOutputs && structuredData && (
              <div className="space-y-6 pt-4 animate-in fade-in duration-300">
                {/* Results Navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-[#E5E5E0] shadow-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {transformationOutputs.summary_markdown && (
                      <button
                        id="tab-view-summary"
                        onClick={() => setActiveOutputTab('summary')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                          activeOutputTab === 'summary'
                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                            : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-[#FF5F1F]" />
                        <span>Executive Brief</span>
                      </button>
                    )}

                    {transformationOutputs.slide_deck && (
                      <button
                        id="tab-view-slides"
                        onClick={() => setActiveOutputTab('slides')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                          activeOutputTab === 'slides'
                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                            : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <Presentation className="w-4 h-4 text-amber-500" />
                        <span>Slide Deck (.pptx)</span>
                        <span className="text-[10px] bg-[#333333] text-white px-1.5 py-0.5 rounded font-mono">
                          {transformationOutputs.slide_deck.slides?.length || 5}
                        </span>
                      </button>
                    )}

                    {transformationOutputs.translation && (
                      <button
                        id="tab-view-translation"
                        onClick={() => setActiveOutputTab('translation')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                          activeOutputTab === 'translation'
                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                            : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <Languages className="w-4 h-4 text-emerald-600" />
                        <span>Indic: {transformationOutputs.translation.target_language}</span>
                      </button>
                    )}

                    {transformationOutputs.social_and_storyboard && (
                      <button
                        id="tab-view-social"
                        onClick={() => setActiveOutputTab('social')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                          activeOutputTab === 'social'
                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                            : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <span>Social & Storyboard</span>
                      </button>
                    )}

                    <button
                      id="tab-view-json"
                      onClick={() => setActiveOutputTab('json')}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeOutputTab === 'json'
                          ? 'bg-[#1A1A1A] text-white shadow-sm'
                          : 'text-[#666660] hover:text-[#1A1A1A] hover:bg-[#F5F5F0]'
                      }`}
                    >
                      <Code2 className="w-4 h-4 text-indigo-500" />
                      <span>Structured Artifact</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#666660] px-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Multi-Format Deliverables Ready</span>
                  </div>
                </div>

                {/* Tab Output Views */}
                {activeOutputTab === 'summary' && transformationOutputs.summary_markdown && (
                  <SummaryViewer
                    markdownContent={transformationOutputs.summary_markdown}
                    structuredData={structuredData}
                  />
                )}

                {activeOutputTab === 'slides' && transformationOutputs.slide_deck && (
                  <SlideDeckViewer
                    slideDeck={transformationOutputs.slide_deck}
                    structuredData={structuredData}
                  />
                )}

                {activeOutputTab === 'translation' && transformationOutputs.translation && (
                  <TranslationViewer
                    translation={transformationOutputs.translation}
                    structuredData={structuredData}
                    onRetranslate={handleRetranslate}
                    isTranslating={isTranslating}
                  />
                )}

                {activeOutputTab === 'social' && transformationOutputs.social_and_storyboard && (
                  <SocialAndMediaViewer
                    socialArtifacts={transformationOutputs.social_and_storyboard}
                  />
                )}

                {activeOutputTab === 'json' && (
                  <StructuredJsonViewer data={structuredData} />
                )}

                {/* Inference Efficiency & Latency Benchmark Panel (Phase 5) */}
                {pipelineMetrics && (
                  <MetricsPanel metrics={pipelineMetrics} />
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CROSS-DOCUMENT KNOWLEDGE SEARCH (Phase 7) */}
        {activeNavTab === 'search' && (
          <KnowledgeSearch
            onSearch={handleSearch}
            isSearching={isSearching}
            historyCount={history.length}
          />
        )}

        {/* VIEW 3: ARCHIVAL HISTORY */}
        {activeNavTab === 'history' && (
          <HistoryArchive
            history={history}
            onSelectJob={handleSelectJob}
            onClearHistory={() => setHistory([])}
          />
        )}

        {/* VIEW 4: TEMPLATE ENGINE */}
        {activeNavTab === 'templates' && <TemplateManager />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E0] py-6 text-center text-xs text-[#666660] font-mono mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5F1F]"></span>
            <span className="font-semibold text-[#1A1A1A]">TransformAI • Problem Statement SIH26154 • Sponsoring Org: NTRO</span>
          </div>
          <span>GenAI Automated Content Transformation & Multimodal Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
}
