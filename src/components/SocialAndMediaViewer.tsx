import React, { useState } from 'react';
import { 
  Share2, 
  Linkedin, 
  Twitter, 
  Video, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Film 
} from 'lucide-react';
import { SocialMediaArtifacts } from '../types';

interface SocialAndMediaViewerProps {
  socialArtifacts: SocialMediaArtifacts;
}

export const SocialAndMediaViewer: React.FC<SocialAndMediaViewerProps> = ({
  socialArtifacts,
}) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'video'>('linkedin');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const { linkedin_post, twitter_thread, video_storyboard } = socialArtifacts;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getLinkedInFormatted = () => {
    if (!linkedin_post) return '';
    return `${linkedin_post.hook}\n\n${linkedin_post.body}\n\nKey Takeaways:\n${linkedin_post.key_takeaways.map((t) => `🔹 ${t}`).join('\n')}\n\n${linkedin_post.call_to_action}\n\n${linkedin_post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;
  };

  const getTwitterFormatted = () => {
    if (!twitter_thread) return '';
    return twitter_thread.map((t, idx) => `[${idx + 1}/${twitter_thread.length}] ${t.text}`).join('\n\n---\n\n');
  };

  const getVideoFormatted = () => {
    if (!video_storyboard) return '';
    return video_storyboard
      .map(
        (s) =>
          `SCENE ${s.scene_number} (${s.timeframe})\nVISUAL: ${s.visual_action}\nVOICEOVER: "${s.spoken_audio_or_narration}"\nON-SCREEN: ${s.on_screen_text}`
      )
      .join('\n\n====================\n\n');
  };

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E5E5E0] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FFF2EB] text-[#FF5F1F] border border-[#FFD8C7]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">
              Multi-Channel Outreach & Media Storyboard
            </h3>
            <p className="text-xs text-[#666660]">
              Repackaged for LinkedIn, Twitter/X thread, and tactical 60-second video storyboard
            </p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-1 bg-[#F5F5F0] p-1 rounded-lg border border-[#E5E5E0]">
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'linkedin'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'text-[#666660] hover:text-[#1A1A1A]'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-400" />
            <span>LinkedIn Post</span>
          </button>

          <button
            onClick={() => setActiveTab('twitter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'twitter'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'text-[#666660] hover:text-[#1A1A1A]'
            }`}
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            <span>X Thread ({twitter_thread?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'video'
                ? 'bg-[#1A1A1A] text-white font-bold shadow-xs'
                : 'text-[#666660] hover:text-[#1A1A1A]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#FF5F1F]" />
            <span>Video Storyboard</span>
          </button>
        </div>
      </div>

      {/* Tab 1: LinkedIn */}
      {activeTab === 'linkedin' && linkedin_post && (
        <div className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-2">
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 font-mono">
              <Linkedin className="w-4 h-4" />
              <span>Professional LinkedIn Post Draft</span>
            </span>
            <button
              onClick={() => copyToClipboard(getLinkedInFormatted(), 'linkedin')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] text-xs font-semibold border border-[#E5E5E0] transition"
            >
              {copiedTab === 'linkedin' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Post</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#666660]" />
                  <span>Copy Post</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 font-sans text-xs text-[#1A1A1A] leading-relaxed max-w-2xl">
            <p className="font-bold text-sm text-[#1A1A1A] font-display">{linkedin_post.hook}</p>
            <p className="text-[#333330]">{linkedin_post.body}</p>

            <div className="bg-white p-3.5 rounded-lg border border-[#E5E5E0] space-y-2 shadow-xs">
              <span className="font-bold text-[#1A1A1A] block text-[11px] uppercase tracking-wider font-mono">
                Key Strategic Takeaways:
              </span>
              {linkedin_post.key_takeaways.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-[#333330]">
                  <span className="text-blue-600 font-bold">🔹</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <p className="text-[#1A1A1A] font-medium">{linkedin_post.call_to_action}</p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {linkedin_post.hashtags.map((h, i) => (
                <span key={i} className="text-xs text-blue-600 font-mono font-semibold">
                  {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Twitter Thread */}
      {activeTab === 'twitter' && twitter_thread && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-sky-600 flex items-center gap-1.5 font-mono">
              <Twitter className="w-4 h-4" />
              <span>Twitter / X Thread ({twitter_thread.length} Tweets)</span>
            </span>
            <button
              onClick={() => copyToClipboard(getTwitterFormatted(), 'twitter')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] text-xs font-semibold border border-[#E5E5E0] transition"
            >
              {copiedTab === 'twitter' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Entire Thread</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#666660]" />
                  <span>Copy Entire Thread</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {twitter_thread.map((tweet, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-4 flex items-start gap-3.5 shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-[#FFF2EB] border border-[#FFD8C7] text-[#FF5F1F] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#1A1A1A] leading-relaxed font-sans">
                    {tweet.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5E0] text-[10px] text-[#666660] font-mono">
                    <span>Tweet {idx + 1} of {twitter_thread.length}</span>
                    <span>{tweet.text.length} / 280 chars</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Video Storyboard */}
      {activeTab === 'video' && video_storyboard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-[#FF5F1F] flex items-center gap-1.5 font-mono">
              <Film className="w-4 h-4" />
              <span>Tactical 60-Second Video Storyboard & Script</span>
            </span>
            <button
              onClick={() => copyToClipboard(getVideoFormatted(), 'video')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] text-xs font-semibold border border-[#E5E5E0] transition"
            >
              {copiedTab === 'video' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Storyboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#666660]" />
                  <span>Copy Storyboard</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {video_storyboard.map((scene, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl p-4 space-y-2.5 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-1.5">
                  <span className="text-xs font-bold text-[#FF5F1F] font-mono">
                    SCENE {scene.scene_number}
                  </span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#666660] border border-[#E5E5E0]">
                    {scene.timeframe}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#666660] tracking-wider block font-mono">
                      Visual Direction:
                    </span>
                    <p className="text-xs text-[#333330] font-sans leading-relaxed">
                      {scene.visual_action}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#1A1A1A] tracking-wider block font-mono">
                      Voiceover Narration:
                    </span>
                    <p className="text-xs text-[#1A1A1A] italic font-mono bg-white p-2.5 rounded border border-[#E5E5E0]">
                      "{scene.spoken_audio_or_narration}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E5E0] text-[11px] font-mono text-[#666660]">
                  <span className="text-[#666660]">On-Screen Text: </span>
                  <span className="text-[#FF5F1F] font-bold">{scene.on_screen_text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
