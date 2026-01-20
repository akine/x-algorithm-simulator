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
} from "lucide-react";
import { calculateScore } from "./scoringEngine";
import type { PostInput, MediaType, ScoreDetail } from "./types";

// スコアゲージ
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
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
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
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${score * 2.51} 251`}
            strokeLinecap="round"
            className={`${color.text} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <div className={`mt-2 inline-block px-3 py-1 rounded-full ${color.bg} bg-opacity-20`}>
        <span className={`text-sm font-medium ${color.text}`}>{getLabel(score)}</span>
      </div>
    </div>
  );
}

// スコア内訳バー
function ScoreBreakdown({
  baseScore,
  bonusPoints,
  penaltyPoints,
}: {
  baseScore: number;
  bonusPoints: number;
  penaltyPoints: number;
}) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">スコア内訳</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">基準点</span>
          <span className="text-white">{baseScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-emerald-400">+ 加点</span>
          <span className="text-emerald-400">+{bonusPoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-400">- 減点</span>
          <span className="text-red-400">-{penaltyPoints}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 flex justify-between font-medium">
          <span className="text-white">合計</span>
          <span className="text-white">{Math.max(0, Math.min(100, baseScore + bonusPoints - penaltyPoints))}</span>
        </div>
      </div>
    </div>
  );
}

// 加点・減点リスト
function ScoreDetailList({
  title,
  details,
  type,
}: {
  title: string;
  details: ScoreDetail[];
  type: "bonus" | "penalty";
}) {
  const isBonus = type === "bonus";

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{title}</h3>
      <div className="space-y-2">
        {details.map((detail, i) => (
          <div
            key={i}
            className={`flex items-center justify-between text-sm ${
              detail.applied
                ? isBonus
                  ? "text-emerald-400"
                  : "text-red-400"
                : "text-gray-500"
            }`}
          >
            <div className="flex items-center gap-2">
              {detail.applied ? (
                isBonus ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-600" />
              )}
              <span>{detail.label}</span>
            </div>
            <span className={detail.applied ? "" : "text-gray-600"}>
              {isBonus ? "+" : ""}{detail.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 投稿統計
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
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <Type className="w-4 h-4 mx-auto mb-1 text-gray-400" />
        <div className="text-lg font-bold text-white">{charCount}</div>
        <div className="text-xs text-gray-500">文字</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <Hash className="w-4 h-4 mx-auto mb-1 text-gray-400" />
        <div className="text-lg font-bold text-white">{hashtagCount}</div>
        <div className="text-xs text-gray-500">タグ</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <Smile className="w-4 h-4 mx-auto mb-1 text-gray-400" />
        <div className="text-lg font-bold text-white">{emojiCount}</div>
        <div className="text-xs text-gray-500">絵文字</div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
        <AlignLeft className="w-4 h-4 mx-auto mb-1 text-gray-400" />
        <div className="text-lg font-bold text-white">{lineBreakCount}</div>
        <div className="text-xs text-gray-500">改行</div>
      </div>
    </div>
  );
}

// メディア選択
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
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
            value === opt.value
              ? "bg-blue-500/20 border-blue-500 text-blue-400"
              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
          }`}
        >
          <opt.icon className="w-4 h-4" />
          <span className="text-xs">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// アドバイスカード
function AdviceCard({ advice }: { advice: string[] }) {
  if (advice.length === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        アドバイス
      </h3>
      <ul className="space-y-2">
        {advice.map((item, i) => (
          <li key={i} className="text-sm text-gray-300 leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold">X アルゴリズムシミュレーター</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 入力エリア */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="投稿内容を入力してください..."
            className="w-full h-32 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none resize-none text-base leading-relaxed"
          />
          <div className="border-t border-gray-800 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">メディア添付</span>
              <span className={`text-xs ${result.stats.charCount > 280 ? "text-red-400" : "text-gray-500"}`}>
                {result.stats.charCount} / 280
              </span>
            </div>
            <div className="mt-2">
              <MediaSelector value={mediaType} onChange={setMediaType} />
            </div>
          </div>
        </div>

        {/* スコア表示 */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <ScoreGauge score={result.totalScore} />
        </div>

        {/* 投稿統計 */}
        <PostStats
          charCount={result.stats.charCount}
          hashtagCount={result.stats.hashtagCount}
          emojiCount={result.stats.emojiCount}
          lineBreakCount={result.stats.lineBreakCount}
        />

        {/* スコア内訳 */}
        <ScoreBreakdown
          baseScore={result.baseScore}
          bonusPoints={result.bonusPoints}
          penaltyPoints={result.penaltyPoints}
        />

        {/* 加点・減点 */}
        <div className="grid md:grid-cols-2 gap-4">
          <ScoreDetailList
            title="加点要素"
            details={result.bonusDetails}
            type="bonus"
          />
          <ScoreDetailList
            title="減点要素"
            details={result.penaltyDetails}
            type="penalty"
          />
        </div>

        {/* アドバイス */}
        <AdviceCard advice={result.advice} />

        {/* スコア計算式 */}
        <div className="bg-gray-800/30 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">スコア計算式</p>
          <p className="text-sm text-gray-400 font-mono">
            Score = 50 + Σ(加点) - Σ(減点)
          </p>
          <p className="text-xs text-gray-600 mt-1">※ 0〜100の範囲に正規化</p>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-800 py-4 mt-8">
        <div className="max-w-2xl mx-auto px-4 text-center text-xs text-gray-600">
          X推奨アルゴリズムに基づくシミュレーションです
        </div>
      </footer>
    </div>
  );
}
