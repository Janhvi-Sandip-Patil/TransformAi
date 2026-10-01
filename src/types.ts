export type SourceFormat = 'pdf' | 'image' | 'docx' | 'audio' | 'text';

export interface LayoutBlock {
  type: 'heading' | 'paragraph' | 'table' | 'list_item';
  level?: number;
  text: string;
  page?: number;
}

export interface IngestionMetadata {
  filename: string;
  upload_time: string;
  page_count: number;
  ocr_used: boolean;
  ocr_confidence: number | null;
  char_count: number;
  source_format: SourceFormat;
}

export interface IngestedDocument {
  doc_id: string;
  source_format: SourceFormat;
  raw_text: string;
  layout_blocks: LayoutBlock[];
  metadata: IngestionMetadata;
}

export interface EntityItem {
  name: string;
  type: 'person' | 'org' | 'location' | 'date' | 'technology' | 'threat_actor' | 'vulnerability' | 'other';
  context?: string;
}

export interface SectionSummary {
  heading: string;
  content_summary: string;
  key_findings?: string[];
}

export interface KeyDateItem {
  date: string;
  event: string;
}

export interface ThreatMetric {
  key: string;
  value: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface StructuredIntelligence {
  title: string;
  classification?: string;
  executive_brief: string;
  summary_points: string[];
  entities: EntityItem[];
  sections: SectionSummary[];
  key_dates: KeyDateItem[];
  threat_indicators_or_metrics: ThreatMetric[];
  confidence_score: number;
  confidence_reasoning?: string;
  recommendations: string[];
}

export interface SlideContent {
  slide_number: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  speaker_notes?: string;
  visual_hint?: string;
  metrics_or_data?: Array<{ label: string; value: string }>;
}

export interface SlideDeckData {
  deck_title: string;
  theme: string;
  slides: SlideContent[];
}

export interface TranslationResult {
  target_language: string;
  language_name: string;
  translated_title: string;
  translated_executive_brief: string;
  translated_summary_points: string[];
  translated_sections: Array<{ heading: string; content_summary: string }>;
  translated_recommendations: string[];
  untranslated_entities: string[];
}

export interface SocialMediaArtifacts {
  linkedin_post: {
    hook: string;
    body: string;
    key_takeaways: string[];
    call_to_action: string;
    hashtags: string[];
  };
  twitter_thread: Array<{
    tweet_number: number;
    text: string;
  }>;
  video_storyboard: Array<{
    scene_number: number;
    timeframe: string;
    visual_action: string;
    spoken_audio_or_narration: string;
    on_screen_text: string;
  }>;
}

export interface PipelineMetrics {
  ingestion_time_ms: number;
  structuring_time_ms: number;
  transformation_time_ms: number;
  total_latency_ms: number;
  cache_hit: boolean;
  prefix_cached: boolean;
  tokens_processed?: number;
  tokens_generated?: number;
  ocr_confidence_score?: number;
  extraction_confidence_score: number;
  confidence_status: 'high' | 'moderate' | 'low_confidence';
}

export interface TransformationOutputs {
  summary_markdown: string;
  slide_deck: SlideDeckData;
  translation?: TranslationResult;
  social_and_storyboard?: SocialMediaArtifacts;
}

export interface ProcessedJobRecord {
  doc_id: string;
  created_at: string;
  document: IngestedDocument;
  structured_data: StructuredIntelligence;
  outputs: TransformationOutputs;
  metrics: PipelineMetrics;
  parameters: GenerationParameters;
}

export interface GenerationParameters {
  tone: 'Analytical / Tactical' | 'Executive / High-Level' | 'Public Awareness' | 'Formal Security Advisory';
  target_audience: 'Senior Leadership / NTRO' | 'Field Operations & Analysts' | 'Inter-Agency Taskforce' | 'General Public';
  target_language: string;
  detail_level: 'Concise' | 'Standard' | 'Exhaustive / Detailed';
  include_slides: boolean;
  include_translation: boolean;
  include_social: boolean;
  include_summary: boolean;
}

export interface SearchCitation {
  doc_id: string;
  doc_title: string;
  section_heading: string;
  relevance_score: number;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  answer: string;
  citations: SearchCitation[];
  search_latency_ms: number;
}

export interface OutputTemplate {
  id: string;
  name: string;
  description: string;
  output_format: 'markdown' | 'json' | 'slides' | 'social';
  system_instructions: string;
  is_active: boolean;
}
