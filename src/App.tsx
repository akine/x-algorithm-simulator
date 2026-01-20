import { useState, useMemo } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Clock,
  Video,
  Image,
  Link,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Globe,
  Users,
  Zap,
  TrendingUp,
  ChevronDown,
  Eye,
  UserPlus,
  MousePointer,
  Ban,
  VolumeX,
  Flag,
  ThumbsDown,
} from "lucide-react";
import { calculateScore } from "./scoringEngine";
import type { TweetInput, MediaType, TargetAudience, ScoreResult } from "./types";

// Score gauge component
function ScoreGauge({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-400";
  };

  const getGradient = (score: number) => {
    if (score >= 70) return "from-emerald-500 to-emerald-400";
    if (score >= 50) return "from-yellow-500 to-yellow-400";
    if (score >= 30) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeDasharray={`${score * 2.83} 283`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {Math.round(score)}
          </span>
          <span className="text-sm text-gray-400 mt-1">/ 100</span>
        </div>
      </div>
      <div
        className={`mt-4 px-4 py-1.5 rounded-full bg-gradient-to-r ${getGradient(score)} bg-opacity-20`}
      >
        <span className="text-sm font-medium text-white">
          {score >= 70
            ? "Excellent"
            : score >= 50
              ? "Good"
              : score >= 30
                ? "Needs Work"
                : "Low Impact"}
        </span>
      </div>
    </div>
  );
}

// Probability bar component
function ProbabilityBar({
  label,
  value,
  icon: Icon,
  color,
  weight,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  weight: number;
}) {
  const percentage = Math.round(value * 100);
  return (
    <div className="flex items-center gap-3 group">
      <div className={`p-2 rounded-lg bg-gray-800 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">x{weight}</span>
            <span className="text-sm font-medium text-white">{percentage}%</span>
          </div>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color.replace("text-", "bg-")}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Contribution chart component
function ContributionChart({ breakdown }: { breakdown: ScoreResult["breakdown"] }) {
  const total =
    breakdown.dwellContribution +
    breakdown.videoViewContribution +
    breakdown.engagementContribution;

  const items = [
    {
      label: "Dwell Time",
      value: breakdown.dwellContribution,
      color: "bg-blue-500",
      icon: Clock,
    },
    {
      label: "Video View",
      value: breakdown.videoViewContribution,
      color: "bg-purple-500",
      icon: Video,
    },
    {
      label: "Engagement",
      value: breakdown.engagementContribution,
      color: "bg-emerald-500",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        Score Contribution
      </h3>
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-800">
        {items.map((item, i) => (
          <div
            key={i}
            className={`${item.color} transition-all duration-500`}
            style={{ width: total > 0 ? `${(item.value / total) * 100}%` : "0%" }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{item.label}</span>
              <span className="text-sm font-medium text-white">
                {item.value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {breakdown.negativeImpact > 0 && (
        <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Ban className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-300">
            Negative Impact: -{breakdown.negativeImpact.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}

// Media selector
function MediaSelector({
  value,
  onChange,
}: {
  value: MediaType;
  onChange: (v: MediaType) => void;
}) {
  const options: { value: MediaType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { value: "none", icon: Ban, label: "None" },
    { value: "image", icon: Image, label: "Image" },
    { value: "video", icon: Video, label: "Video" },
    { value: "link", icon: Link, label: "Link" },
    { value: "poll", icon: BarChart3, label: "Poll" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
            value === opt.value
              ? "bg-blue-500/20 border-blue-500 text-blue-400"
              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
          }`}
        >
          <opt.icon className="w-4 h-4" />
          <span className="text-sm">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// Target audience selector
function AudienceSelector({
  value,
  onChange,
}: {
  value: TargetAudience;
  onChange: (v: TargetAudience) => void;
}) {
  const options: { value: TargetAudience; label: string; emoji: string }[] = [
    { value: "engineer", label: "Engineer", emoji: "👨‍💻" },
    { value: "creator", label: "Creator", emoji: "🎨" },
    { value: "business", label: "Business", emoji: "💼" },
    { value: "general", label: "General", emoji: "👥" },
    { value: "news", label: "News", emoji: "📰" },
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TargetAudience)}
        className="w-full appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.emoji} {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// Toggle switch
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

// Advice card
function AdviceCard({ advice }: { advice: string[] }) {
  if (advice.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Improvement Tips
      </h3>
      <ul className="space-y-3">
        {advice.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Warning card
function WarningCard({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Warnings
      </h3>
      <ul className="space-y-3">
        {warnings.map((warning, i) => (
          <li key={i} className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300">{warning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Global reach card
function GlobalReachCard({
  score,
  hasEnglish,
}: {
  score: number;
  hasEnglish: boolean;
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-cyan-400" />
        Phoenix Global Retrieval
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1f2937"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="8"
              strokeDasharray={`${score * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-cyan-400">
            {score}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">
            {hasEnglish
              ? "English content detected. Your post can reach global audiences through Phoenix retrieval."
              : "Adding English text will significantly boost global reach potential."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Author diversity card
function AuthorDiversityCard({ risk, posts }: { risk: string; posts: number }) {
  const riskColors = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    high: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-400" />
        Author Diversity Score
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Posts in last 24h: <span className="text-white font-medium">{posts}</span>
          </p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${riskColors[risk as keyof typeof riskColors]}`}
          >
            {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
          </span>
        </div>
        <p className="text-xs text-gray-500 max-w-[200px]">
          X prioritizes diverse content. Too many posts in short time reduces visibility.
        </p>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("none");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("general");
  const [hasEnglish, setHasEnglish] = useState(false);
  const [isThread, setIsThread] = useState(false);
  const [hasHashtags, setHasHashtags] = useState(false);
  const [hasMentions, setHasMentions] = useState(false);
  const [postTime, setPostTime] = useState<"peak" | "offpeak" | "unknown">("unknown");
  const [consecutivePosts, setConsecutivePosts] = useState(1);

  const input: TweetInput = useMemo(
    () => ({
      content,
      mediaType,
      targetAudience,
      hasEnglish,
      isThread,
      hasHashtags,
      hasMentions,
      postTime,
      consecutivePosts,
    }),
    [content, mediaType, targetAudience, hasEnglish, isThread, hasHashtags, hasMentions, postTime, consecutivePosts]
  );

  const result = useMemo(() => calculateScore(input), [input]);

  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                X Algorithm Simulator
              </h1>
              <p className="text-xs text-gray-500">Phoenix / Grok-based Transformer (2026)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                Tweet Draft
              </h2>

              {/* Text area */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening? Write your tweet here..."
                  className="w-full h-40 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-gray-500">
                  <span>{charCount}/280</span>
                  <span>{wordCount} words</span>
                </div>
              </div>

              {/* Media selector */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Media Attachment
                </label>
                <MediaSelector value={mediaType} onChange={setMediaType} />
              </div>

              {/* Target audience */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target Audience
                </label>
                <AudienceSelector value={targetAudience} onChange={setTargetAudience} />
              </div>

              {/* Toggle options */}
              <div className="mt-6 space-y-4">
                <Toggle
                  label="Contains English text"
                  checked={hasEnglish}
                  onChange={setHasEnglish}
                />
                <Toggle
                  label="Part of a thread"
                  checked={isThread}
                  onChange={setIsThread}
                />
                <Toggle
                  label="Contains hashtags"
                  checked={hasHashtags}
                  onChange={setHasHashtags}
                />
                <Toggle
                  label="Contains mentions"
                  checked={hasMentions}
                  onChange={setHasMentions}
                />
              </div>

              {/* Post time */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Posting Time
                </label>
                <div className="flex gap-2">
                  {(["peak", "offpeak", "unknown"] as const).map((time) => (
                    <button
                      key={time}
                      onClick={() => setPostTime(time)}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-all text-sm ${
                        postTime === time
                          ? "bg-blue-500/20 border-blue-500 text-blue-400"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {time === "peak" ? "Peak Hours" : time === "offpeak" ? "Off-Peak" : "Any Time"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consecutive posts */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Posts in last 24h: {consecutivePosts}
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={consecutivePosts}
                  onChange={(e) => setConsecutivePosts(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex flex-col items-center">
                <ScoreGauge score={result.totalScore} />
              </div>
            </div>

            {/* Contribution breakdown */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <ContributionChart breakdown={result.breakdown} />
            </div>

            {/* Engagement probabilities */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Engagement Probabilities
              </h3>
              <div className="space-y-4">
                <ProbabilityBar
                  label="Dwell Time"
                  value={result.engagementProbs.dwell}
                  icon={Clock}
                  color="text-blue-400"
                  weight={2.5}
                />
                <ProbabilityBar
                  label="Video View"
                  value={result.engagementProbs.videoView}
                  icon={Video}
                  color="text-purple-400"
                  weight={2.0}
                />
                <ProbabilityBar
                  label="Follow"
                  value={result.engagementProbs.followAuthor}
                  icon={UserPlus}
                  color="text-cyan-400"
                  weight={3.0}
                />
                <ProbabilityBar
                  label="Repost"
                  value={result.engagementProbs.repost}
                  icon={Repeat2}
                  color="text-emerald-400"
                  weight={1.5}
                />
                <ProbabilityBar
                  label="Share"
                  value={result.engagementProbs.share}
                  icon={Share}
                  color="text-pink-400"
                  weight={1.8}
                />
                <ProbabilityBar
                  label="Reply"
                  value={result.engagementProbs.reply}
                  icon={MessageCircle}
                  color="text-orange-400"
                  weight={1.0}
                />
                <ProbabilityBar
                  label="Like"
                  value={result.engagementProbs.favorite}
                  icon={Heart}
                  color="text-red-400"
                  weight={0.5}
                />
                <ProbabilityBar
                  label="Click"
                  value={result.engagementProbs.click}
                  icon={MousePointer}
                  color="text-yellow-400"
                  weight={0.3}
                />
                <ProbabilityBar
                  label="Photo Expand"
                  value={result.engagementProbs.photoExpand}
                  icon={Eye}
                  color="text-indigo-400"
                  weight={0.4}
                />
              </div>
            </div>

            {/* Negative signals */}
            {(result.negativeSignals.notInterested > 0.05 ||
              result.negativeSignals.blockAuthor > 0.01 ||
              result.negativeSignals.muteAuthor > 0.02 ||
              result.negativeSignals.report > 0.001) && (
              <div className="bg-gray-900/50 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Negative Signals Risk
                </h3>
                <div className="space-y-4">
                  <ProbabilityBar
                    label="Not Interested"
                    value={result.negativeSignals.notInterested}
                    icon={ThumbsDown}
                    color="text-red-400"
                    weight={-10}
                  />
                  <ProbabilityBar
                    label="Mute"
                    value={result.negativeSignals.muteAuthor}
                    icon={VolumeX}
                    color="text-orange-400"
                    weight={-30}
                  />
                  <ProbabilityBar
                    label="Block"
                    value={result.negativeSignals.blockAuthor}
                    icon={Ban}
                    color="text-red-500"
                    weight={-50}
                  />
                  <ProbabilityBar
                    label="Report"
                    value={result.negativeSignals.report}
                    icon={Flag}
                    color="text-red-600"
                    weight={-100}
                  />
                </div>
              </div>
            )}

            {/* Global reach */}
            <GlobalReachCard score={result.globalReachScore} hasEnglish={hasEnglish} />

            {/* Author diversity */}
            <AuthorDiversityCard
              risk={result.authorDiversityRisk}
              posts={consecutivePosts}
            />

            {/* Advice */}
            <AdviceCard advice={result.advice} />

            {/* Warnings */}
            <WarningCard warnings={result.warnings} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Based on X's Phoenix Algorithm (2026). This is a simulation for educational purposes.
          </p>
          <p className="mt-2">
            Weights: Dwell (x2.5) | Video View (x2.0) | Follow (x3.0) | Repost (x1.5)
          </p>
        </div>
      </footer>
    </div>
  );
}
