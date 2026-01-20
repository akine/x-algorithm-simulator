import { useState, useMemo } from "react";
import {
  Image,
  Video,
  Link,
  Ban,
  CheckCircle2,
  XCircle,
  Sparkles,
  Hash,
  Type,
  Smile,
  AlignLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { calculateScore } from "./scoringEngine";
import type { PostInput, MediaType, ScoreDetail } from "./types";

// スコアゲージ（コンパクト版）
function ScoreGauge({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-400", bg: "bg-emerald-500" };
    if (score >= 60) return { text: "text-blue-400", bg: "bg-blue-500" };
    if (score >= 40) return { text: "text-yellow-400", bg: "bg-yellow-500" };
    return { text: "text-red-400", bg: "bg-red-500" };
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "優秀";
    if (score >= 60) return "良好";
    if (score >= 40) return "普通";
    return "要改善";
  };

  const color = getColor(score);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${score * 2.51} 251`}
            strokeLinecap="round"
            className={`${color.text} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${color.text}`}>{score}</span>
        </div>
      </div>
      <div>
        <div className={`text-lg font-bold ${color.text}`}>{getLabel(score)}</div>
        <div className="text-xs text-gray-500">/ 100点</div>
      </div>
    </div>
  );
}

// 投稿統計（横並び）
function PostStats({
  charCount,
  hashtagCount,
  emojiCount,
  lineBreakCount,
}: {
  charCount: number;
  hashtagCount: number;
  emojiCount: number;
  lineBreakCount: number;
}) {
  const stats = [
    { icon: Type, value: charCount, label: "文字", warn: charCount < 30 || charCount > 250 },
    { icon: Hash, value: hashtagCount, label: "タグ", warn: hashtagCount >= 5 },
    { icon: Smile, value: emojiCount, label: "絵文字", warn: emojiCount > 3 },
    { icon: AlignLeft, value: lineBreakCount, label: "改行", warn: false },
  ];

  return (
    <div className="flex gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
            stat.warn ? "bg-red-500/10 text-red-400" : "bg-gray-800 text-gray-400"
          }`}
        >
          <stat.icon className="w-3 h-3" />
          <span className="font-medium">{stat.value}</span>
          <span className="text-gray-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// メディア選択（コンパクト）
function MediaSelector({
  value,
  onChange,
}: {
  value: MediaType;
  onChange: (v: MediaType) => void;
}) {
  const options: { value: MediaType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { value: "none", icon: Ban, label: "なし" },
    { value: "image", icon: Image, label: "画像" },
    { value: "video", icon: Video, label: "動画" },
    { value: "link", icon: Link, label: "リンク" },
  ];

  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all ${
            value === opt.value
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          <opt.icon className="w-3.5 h-3.5" />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// スコア詳細リスト（コンパクト）
function ScoreDetailList({
  title,
  icon: Icon,
  details,
  type,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  details: ScoreDetail[];
  type: "bonus" | "penalty";
}) {
  const isBonus = type === "bonus";
  const activeDetails = details.filter((d) => d.applied);
  const inactiveDetails = details.filter((d) => !d.applied);

  return (
    <div>
      <h3 className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${
        isBonus ? "text-emerald-400" : "text-red-400"
      }`}>
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      <div className="space-y-1">
        {activeDetails.map((detail, i) => (
          <div
            key={i}
            className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${
              isBonus ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isBonus ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              <span>{detail.label}</span>
            </div>
            <span className="font-medium">{isBonus ? "+" : ""}{detail.points}</span>
          </div>
        ))}
        {inactiveDetails.map((detail, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs px-2 py-1.5 text-gray-600"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-gray-700" />
              <span>{detail.label}</span>
            </div>
            <span>{isBonus ? "+" : ""}{detail.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// アドバイスカード
function AdviceCard({ advice }: { advice: string[] }) {
  if (advice.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        アドバイス
      </h3>
      <div className="space-y-1.5">
        {advice.map((item, i) => (
          <p key={i} className="text-xs text-gray-300 leading-relaxed">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

// メインApp
export default function App() {
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("none");

  const input: PostInput = useMemo(() => ({ content, mediaType }), [content, mediaType]);
  const result = useMemo(() => calculateScore(input), [input]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50 shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h1 className="text-sm font-bold">X アルゴリズムシミュレーター</h1>
          </div>
          <div className="text-xs text-gray-500">
            Score = 50 + 加点 - 減点
          </div>
        </div>
      </header>

      {/* メインコンテンツ - obento式レイアウト */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div className="grid lg:grid-cols-[1fr,380px] gap-4 h-full">
          {/* 左カラム: 入力 + スコア */}
          <div className="flex flex-col gap-4">
            {/* ツイート入力エリア */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex-1 flex flex-col">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="投稿内容を入力してください...&#10;&#10;例：&#10;Z世代に『七人の侍』見せたら&#10;「推しは誰？」って聞かれた&#10;&#10;黒澤明、70年前に推し活の概念作ってたの天才すぎない？🎬&#10;&#10;#七人の侍 #黒澤明"
                className="flex-1 min-h-[200px] lg:min-h-0 bg-transparent border-none text-white placeholder-gray-600 focus:outline-none resize-none text-sm leading-relaxed"
              />
              <div className="border-t border-gray-800 pt-3 mt-3 flex items-center justify-between gap-4 flex-wrap">
                <MediaSelector value={mediaType} onChange={setMediaType} />
                <span className={`text-xs ${result.stats.charCount > 280 ? "text-red-400" : "text-gray-500"}`}>
                  {result.stats.charCount} / 280
                </span>
              </div>
            </div>

            {/* スコア + 統計 */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <ScoreGauge score={result.totalScore} />
                <div className="flex flex-col gap-2 items-end">
                  <PostStats
                    charCount={result.stats.charCount}
                    hashtagCount={result.stats.hashtagCount}
                    emojiCount={result.stats.emojiCount}
                    lineBreakCount={result.stats.lineBreakCount}
                  />
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">基準 50</span>
                    <span className="text-emerald-400">+{result.bonusPoints}</span>
                    <span className="text-red-400">-{result.penaltyPoints}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム: 詳細情報 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col gap-5 lg:overflow-y-auto lg:max-h-[calc(100vh-120px)]">
            {/* アドバイス */}
            <AdviceCard advice={result.advice} />

            {/* 加点要素 */}
            <ScoreDetailList
              title="加点要素"
              icon={TrendingUp}
              details={result.bonusDetails}
              type="bonus"
            />

            {/* 減点要素 */}
            <ScoreDetailList
              title="減点要素"
              icon={TrendingDown}
              details={result.penaltyDetails}
              type="penalty"
            />

            {/* 計算式 */}
            <div className="mt-auto pt-4 border-t border-gray-800">
              <p className="text-[10px] text-gray-600 text-center">
                X推奨アルゴリズムに基づくシミュレーション
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
