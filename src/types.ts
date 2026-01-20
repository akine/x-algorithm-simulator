// X推奨アルゴリズム 18種類の評価アクション

// エンゲージメント
export interface EngagementActions {
  like: number; // いいね
  reply: number; // リプライ
  repost: number; // リポスト
  quote: number; // 引用RT
}

// 閲覧行動
export interface ViewActions {
  click: number; // クリック
  imageExpand: number; // 画像展開
  profileView: number; // プロフィール閲覧
  dwellTime: number; // 滞在時間
}

// 共有・その他
export interface ShareActions {
  share: number; // シェア
  dmShare: number; // DM共有
  linkCopy: number; // リンクコピー
  videoView: number; // 動画視聴
  follow: number; // フォロー
}

// ネガティブ（減点）
export interface NegativeActions {
  notInterested: number; // 興味なし
  block: number; // ブロック
  mute: number; // ミュート
  report: number; // 報告
}

// メディアタイプ
export type MediaType = "none" | "image" | "video" | "link";

// 投稿入力
export interface PostInput {
  content: string;
  mediaType: MediaType;
}

// 加点・減点の詳細
export interface ScoreDetail {
  label: string;
  points: number;
  applied: boolean;
  reason?: string;
}

// スコア結果
export interface ScoreResult {
  totalScore: number; // 0-100
  baseScore: number; // 基準点 50
  bonusPoints: number; // 加点合計
  penaltyPoints: number; // 減点合計
  bonusDetails: ScoreDetail[]; // 加点詳細
  penaltyDetails: ScoreDetail[]; // 減点詳細
  advice: string[]; // 改善アドバイス
  stats: PostStats; // 投稿の統計
}

// 投稿の統計情報
export interface PostStats {
  charCount: number;
  hashtagCount: number;
  emojiCount: number;
  lineBreakCount: number;
  hasQuestion: boolean;
  hasUrl: boolean;
  urlOnly: boolean;
}
