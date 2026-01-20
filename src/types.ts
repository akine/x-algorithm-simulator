// Engagement probability types based on X's Phoenix algorithm
export interface EngagementProbabilities {
  favorite: number; // P(like)
  reply: number; // P(reply)
  repost: number; // P(repost/retweet)
  click: number; // P(click) - profile, link, etc.
  videoView: number; // P(video_view) - 50%+ watch time
  photoExpand: number; // P(photo_expand)
  dwell: number; // P(dwell) - time spent on tweet
  share: number; // P(share) - external share
  followAuthor: number; // P(follow_author)
}

export interface NegativeSignals {
  notInterested: number; // P(not_interested)
  blockAuthor: number; // P(block)
  muteAuthor: number; // P(mute)
  report: number; // P(report)
}

// Weights based on X's algorithm documentation
export interface AlgorithmWeights {
  favorite: number;
  reply: number;
  repost: number;
  click: number;
  videoView: number;
  photoExpand: number;
  dwell: number;
  share: number;
  followAuthor: number;
  // Negative weights
  notInterested: number;
  blockAuthor: number;
  muteAuthor: number;
  report: number;
}

export type MediaType = "none" | "image" | "video" | "link" | "poll";
export type TargetAudience =
  | "engineer"
  | "creator"
  | "business"
  | "general"
  | "news";

export interface TweetInput {
  content: string;
  mediaType: MediaType;
  targetAudience: TargetAudience;
  hasEnglish: boolean;
  isThread: boolean;
  hasHashtags: boolean;
  hasMentions: boolean;
  postTime: "peak" | "offpeak" | "unknown";
  consecutivePosts: number; // Number of posts in last 24h
}

export interface ScoreResult {
  totalScore: number; // 0-100
  engagementProbs: EngagementProbabilities;
  negativeSignals: NegativeSignals;
  breakdown: ScoreBreakdown;
  advice: string[];
  warnings: string[];
  globalReachScore: number; // Phoenix retrieval score
  authorDiversityRisk: "low" | "medium" | "high";
}

export interface ScoreBreakdown {
  dwellContribution: number;
  videoViewContribution: number;
  engagementContribution: number;
  negativeImpact: number;
}
