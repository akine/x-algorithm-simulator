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
  Zap,
} from "lucide-react";
import { calculateScore } from "./scoringEngine";
import type { PostInput, MediaType, ScoreDetail } from "./types";

// スコアゲージ
function ScoreGauge({ score }: { score: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-400", ring: "stroke-emerald-400" };
    if (score >= 60) return { text: "text-blue-400", ring: "stroke-blue-400" };
    if (score >= 40) return { text: "text-yellow-400", ring: "stroke-yellow-400" };
    return { text: "text-red-400", ring: "stroke-red-400" };
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
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeDasharray={`${score * 2.64} 264`}
            strokeLinecap="round"
            className={`${color.ring} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${color.text}`}>{score}</span>
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold ${color.text}`}>{getLabel(score)}</div>
        <div className="text-sm text-gray-500">スコア / 100</div>
      </div>
    </div>
  );
}

// メディア選択
function MediaSelector({ value, onChange }: { value: MediaType; onChange: (v: MediaType) => void }) {
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            value === opt.value
              ? "bg-blue-500/20 text-blue-400"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
          }`}
        >
          <opt.icon className="w-5 h-5" />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// 統計カード
function StatCard({
  icon: Icon,
  value,
  label,
  warn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  warn?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${warn ? "bg-red-500/10" : "bg-gray-800/50"}`}>
      <Icon className={`w-5 h-5 ${warn ? "text-red-400" : "text-gray-500"}`} />
      <span className={`text-2xl font-bold ${warn ? "text-red-400" : "text-white"}`}>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

// スコア詳細アイテム
function ScoreItem({ detail, type }: { detail: ScoreDetail; type: "bonus" | "penalty" }) {
  const isBonus = type === "bonus";
  if (!detail.applied) {
    return (
      <div className="flex items-center justify-between text-sm py-1.5 text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-gray-700" />
          <span>{detail.label}</span>
        </div>
        <span>{isBonus ? "+" : ""}{detail.points}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg ${
      isBonus ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
    }`}>
      <div className="flex items-center gap-2">
        {isBonus ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        <span>{detail.label}</span>
      </div>
      <span className="font-bold">{isBonus ? "+" : ""}{detail.points}</span>
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
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold">X アルゴリズムシミュレーター</span>
          </div>
          <code className="text-sm text-gray-500 hidden sm:block">Score = 50 + 加点 - 減点</code>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* 入力エリア */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`投稿内容を入力...\n\n例: Z世代に『七人の侍』見せたら「推しは誰？」って聞かれた\n\n黒澤明、70年前に推し活の概念作ってたの天才すぎない？🎬\n\n#七人の侍 #黒澤明`}
            className="w-full h-44 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-base leading-relaxed"
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-4">
            <MediaSelector value={mediaType} onChange={setMediaType} />
            <span className={`text-base font-medium ${result.stats.charCount > 280 ? "text-red-400" : "text-gray-400"}`}>
              {result.stats.charCount} / 280
            </span>
          </div>
        </div>

        {/* ダッシュボード グリッド */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* スコア */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <ScoreGauge score={result.totalScore} />
              <div className="text-right">
                <div className="text-gray-500 text-base">基準 <span className="text-white font-bold">50</span></div>
                <div className="text-emerald-400 text-lg font-bold">+{result.bonusPoints} 加点</div>
                <div className="text-red-400 text-lg font-bold">-{result.penaltyPoints} 減点</div>
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="text-sm text-gray-500 mb-3">投稿の統計</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Type} value={result.stats.charCount} label="文字" warn={result.stats.charCount > 0 && (result.stats.charCount < 30 || result.stats.charCount > 250)} />
              <StatCard icon={Hash} value={result.stats.hashtagCount} label="タグ" warn={result.stats.hashtagCount >= 5} />
              <StatCard icon={Smile} value={result.stats.emojiCount} label="絵文字" warn={result.stats.emojiCount > 3} />
              <StatCard icon={AlignLeft} value={result.stats.lineBreakCount} label="改行" />
            </div>
          </div>

          {/* 加点要素 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">加点要素</span>
            </div>
            <div className="space-y-1.5">
              {result.bonusDetails.map((d, i) => (
                <ScoreItem key={i} detail={d} type="bonus" />
              ))}
            </div>
          </div>

          {/* 減点要素 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <TrendingDown className="w-5 h-5" />
              <span className="font-bold">減点要素</span>
            </div>
            <div className="space-y-1.5">
              {result.penaltyDetails.map((d, i) => (
                <ScoreItem key={i} detail={d} type="penalty" />
              ))}
            </div>
          </div>

          {/* アドバイス */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">アドバイス</span>
            </div>
            <div className="space-y-2">
              {result.advice.length > 0 ? (
                result.advice.map((item, i) => (
                  <p key={i} className="text-sm text-gray-300 leading-relaxed">{item}</p>
                ))
              ) : (
                <p className="text-sm text-gray-500">投稿内容を入力するとアドバイスが表示されます</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
