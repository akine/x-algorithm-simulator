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
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
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
          <span className={`text-lg font-bold ${color.text}`}>{score}</span>
        </div>
      </div>
      <div>
        <div className={`text-xl font-bold ${color.text}`}>{getLabel(score)}</div>
        <div className="text-xs text-gray-500">スコア / 100</div>
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
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
            value === opt.value
              ? "bg-blue-500/20 text-blue-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <opt.icon className="w-3.5 h-3.5" />
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
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${warn ? "bg-red-500/10" : "bg-gray-800/50"}`}>
      <Icon className={`w-4 h-4 ${warn ? "text-red-400" : "text-gray-500"}`} />
      <span className={`text-lg font-bold ${warn ? "text-red-400" : "text-white"}`}>{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

// スコア詳細アイテム
function ScoreItem({ detail, type }: { detail: ScoreDetail; type: "bonus" | "penalty" }) {
  const isBonus = type === "bonus";
  if (!detail.applied) {
    return (
      <div className="flex items-center justify-between text-xs py-1 text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-gray-700" />
          <span>{detail.label}</span>
        </div>
        <span>{isBonus ? "+" : ""}{detail.points}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-between text-xs py-1.5 px-2 rounded ${
      isBonus ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
    }`}>
      <div className="flex items-center gap-1.5">
        {isBonus ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{detail.label}</span>
      </div>
      <span className="font-medium">{isBonus ? "+" : ""}{detail.points}</span>
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
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold">X アルゴリズムシミュレーター</span>
          </div>
          <code className="text-[10px] text-gray-600 hidden sm:block">Score = 50 + 加点 - 減点</code>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        {/* 入力エリア */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`投稿内容を入力...\n\n例: Z世代に『七人の侍』見せたら「推しは誰？」って聞かれた\n\n黒澤明、70年前に推し活の概念作ってたの天才すぎない？🎬\n\n#七人の侍 #黒澤明`}
            className="w-full h-36 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-2">
            <MediaSelector value={mediaType} onChange={setMediaType} />
            <span className={`text-xs ${result.stats.charCount > 280 ? "text-red-400" : "text-gray-500"}`}>
              {result.stats.charCount} / 280
            </span>
          </div>
        </div>

        {/* ダッシュボード グリッド */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* スコア */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <ScoreGauge score={result.totalScore} />
              <div className="text-right text-sm">
                <div className="text-gray-500">基準 <span className="text-white">50</span></div>
                <div className="text-emerald-400">+{result.bonusPoints} 加点</div>
                <div className="text-red-400">-{result.penaltyPoints} 減点</div>
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2">投稿の統計</div>
            <div className="grid grid-cols-4 gap-2">
              <StatCard icon={Type} value={result.stats.charCount} label="文字" warn={result.stats.charCount < 30 || result.stats.charCount > 250} />
              <StatCard icon={Hash} value={result.stats.hashtagCount} label="タグ" warn={result.stats.hashtagCount >= 5} />
              <StatCard icon={Smile} value={result.stats.emojiCount} label="絵文字" warn={result.stats.emojiCount > 3} />
              <StatCard icon={AlignLeft} value={result.stats.lineBreakCount} label="改行" />
            </div>
          </div>

          {/* 加点要素 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-medium">加点要素</span>
            </div>
            <div className="space-y-1">
              {result.bonusDetails.map((d, i) => (
                <ScoreItem key={i} detail={d} type="bonus" />
              ))}
            </div>
          </div>

          {/* 減点要素 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-red-400 mb-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="font-medium">減点要素</span>
            </div>
            <div className="space-y-1">
              {result.penaltyDetails.map((d, i) => (
                <ScoreItem key={i} detail={d} type="penalty" />
              ))}
            </div>
          </div>

          {/* アドバイス */}
          <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">アドバイス</span>
            </div>
            <div className="space-y-1.5">
              {result.advice.length > 0 ? (
                result.advice.map((item, i) => (
                  <p key={i} className="text-xs text-gray-300 leading-relaxed">{item}</p>
                ))
              ) : (
                <p className="text-xs text-gray-500">投稿内容を入力するとアドバイスが表示されます</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
