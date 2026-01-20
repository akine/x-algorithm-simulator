import type {
  TweetInput,
  ScoreResult,
  EngagementProbabilities,
  NegativeSignals,
  AlgorithmWeights,
  ScoreBreakdown,
} from "./types";

// X Algorithm Weights (2026 Phoenix Update)
// Based on public documentation and research
const ALGORITHM_WEIGHTS: AlgorithmWeights = {
  // Positive engagement weights
  favorite: 0.5, // Base engagement signal
  reply: 1.0, // Strong conversation signal
  repost: 1.5, // High amplification value
  click: 0.3, // Interest indicator
  videoView: 2.0, // Heavy emphasis on video consumption
  photoExpand: 0.4, // Visual engagement
  dwell: 2.5, // Highest weight - quality indicator
  share: 1.8, // External distribution
  followAuthor: 3.0, // Ultimate conversion

  // Negative weights (penalties)
  notInterested: -10.0,
  blockAuthor: -50.0,
  muteAuthor: -30.0,
  report: -100.0,
};

// Text analysis helpers
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countEmojis(text: string): number {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu;
  return (text.match(emojiRegex) || []).length;
}

function countHashtags(text: string): number {
  return (text.match(/#\w+/g) || []).length;
}

function countMentions(text: string): number {
  return (text.match(/@\w+/g) || []).length;
}

function hasQuestion(text: string): boolean {
  return text.includes("?") || /\?$/.test(text);
}

function hasCallToAction(text: string): boolean {
  const ctaPatterns =
    /(\bRT\b|リツイート|拡散|シェア|フォロー|チェック|見て|教えて|コメント|返信|いいね|確認)/i;
  return ctaPatterns.test(text);
}

function hasEnglishText(text: string): boolean {
  const englishRegex = /[a-zA-Z]{3,}/g;
  const matches = text.match(englishRegex) || [];
  return matches.length >= 2;
}

function hasControversialWords(text: string): boolean {
  // Words that might trigger negative reactions
  const controversial =
    /(炎上|批判|問題|最悪|クソ|死ね|バカ|アホ|嫌い|うざい)/i;
  return controversial.test(text);
}

function hasSensationalWords(text: string): boolean {
  const sensational =
    /(衝撃|暴露|緊急|速報|必見|ヤバい|激震|炎上|闇|真実)/i;
  return sensational.test(text);
}

// Calculate engagement probabilities based on tweet content
function calculateEngagementProbs(
  input: TweetInput
): EngagementProbabilities {
  const { content, mediaType, targetAudience, hasHashtags, hasMentions } =
    input;

  const wordCount = countWords(content);
  const emojiCount = countEmojis(content);
  const hashtagCount = hasHashtags ? countHashtags(content) : 0;
  const mentionCount = hasMentions ? countMentions(content) : 0;
  const isQuestion = hasQuestion(content);
  const hasCTA = hasCallToAction(content);
  const hasEnglish = hasEnglishText(content);

  // Base probabilities
  let favorite = 0.15;
  let reply = 0.05;
  let repost = 0.03;
  let click = 0.1;
  let videoView = 0;
  let photoExpand = 0;
  let dwell = 0.2;
  let share = 0.02;
  let followAuthor = 0.01;

  // Content length impact on dwell time
  if (wordCount > 50) {
    dwell += 0.15;
  } else if (wordCount > 20) {
    dwell += 0.08;
  } else if (wordCount < 10) {
    dwell -= 0.05;
  }

  // Media type impact
  switch (mediaType) {
    case "video":
      videoView = 0.4;
      dwell += 0.25;
      favorite += 0.1;
      repost += 0.05;
      share += 0.03;
      break;
    case "image":
      photoExpand = 0.35;
      dwell += 0.1;
      favorite += 0.08;
      break;
    case "link":
      click += 0.15;
      dwell += 0.05;
      break;
    case "poll":
      reply += 0.1;
      dwell += 0.12;
      favorite += 0.05;
      break;
  }

  // Emoji impact (moderate use is good)
  if (emojiCount >= 1 && emojiCount <= 3) {
    favorite += 0.05;
    dwell += 0.03;
  } else if (emojiCount > 5) {
    favorite -= 0.03;
    dwell -= 0.02;
  }

  // Hashtag impact (1-2 is optimal)
  if (hashtagCount >= 1 && hashtagCount <= 2) {
    click += 0.03;
    repost += 0.02;
  } else if (hashtagCount > 3) {
    favorite -= 0.05;
    click -= 0.02;
  }

  // Mention impact
  if (mentionCount >= 1 && mentionCount <= 2) {
    reply += 0.08;
    click += 0.05;
  } else if (mentionCount > 3) {
    favorite -= 0.03;
  }

  // Question increases reply probability
  if (isQuestion) {
    reply += 0.12;
    dwell += 0.05;
  }

  // Call to action impact
  if (hasCTA) {
    repost += 0.04;
    followAuthor += 0.02;
    reply += 0.03;
  }

  // Target audience modifiers
  switch (targetAudience) {
    case "engineer":
      reply += 0.05;
      repost += 0.02;
      break;
    case "creator":
      favorite += 0.08;
      share += 0.02;
      break;
    case "business":
      click += 0.05;
      followAuthor += 0.02;
      break;
    case "news":
      repost += 0.08;
      click += 0.05;
      break;
  }

  // English text for global reach
  if (hasEnglish) {
    repost += 0.03;
    click += 0.02;
    followAuthor += 0.01;
  }

  // Thread bonus
  if (input.isThread) {
    dwell += 0.15;
    followAuthor += 0.02;
    click += 0.05;
  }

  // Time of posting
  if (input.postTime === "peak") {
    favorite += 0.05;
    reply += 0.03;
    repost += 0.03;
  } else if (input.postTime === "offpeak") {
    favorite -= 0.02;
    reply -= 0.01;
  }

  // Clamp all values between 0 and 1
  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  return {
    favorite: clamp(favorite),
    reply: clamp(reply),
    repost: clamp(repost),
    click: clamp(click),
    videoView: clamp(videoView),
    photoExpand: clamp(photoExpand),
    dwell: clamp(dwell),
    share: clamp(share),
    followAuthor: clamp(followAuthor),
  };
}

// Calculate negative signal probabilities
function calculateNegativeSignals(input: TweetInput): NegativeSignals {
  const { content, consecutivePosts } = input;

  let notInterested = 0.02;
  let blockAuthor = 0.001;
  let muteAuthor = 0.005;
  let report = 0.0001;

  // Controversial content
  if (hasControversialWords(content)) {
    notInterested += 0.08;
    blockAuthor += 0.02;
    muteAuthor += 0.05;
    report += 0.01;
  }

  // Sensational/clickbait content
  if (hasSensationalWords(content)) {
    notInterested += 0.05;
    muteAuthor += 0.02;
  }

  // Too many consecutive posts (spam signal)
  if (consecutivePosts > 10) {
    notInterested += 0.1;
    muteAuthor += 0.08;
  } else if (consecutivePosts > 5) {
    notInterested += 0.05;
    muteAuthor += 0.03;
  }

  // Excessive hashtags
  if (countHashtags(content) > 5) {
    notInterested += 0.06;
    muteAuthor += 0.03;
  }

  // Clamp values
  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  return {
    notInterested: clamp(notInterested),
    blockAuthor: clamp(blockAuthor),
    muteAuthor: clamp(muteAuthor),
    report: clamp(report),
  };
}

// Calculate score breakdown
function calculateBreakdown(
  probs: EngagementProbabilities,
  negatives: NegativeSignals
): ScoreBreakdown {
  const dwellContribution = probs.dwell * ALGORITHM_WEIGHTS.dwell * 10;
  const videoViewContribution =
    probs.videoView * ALGORITHM_WEIGHTS.videoView * 10;

  const engagementContribution =
    probs.favorite * ALGORITHM_WEIGHTS.favorite * 10 +
    probs.reply * ALGORITHM_WEIGHTS.reply * 10 +
    probs.repost * ALGORITHM_WEIGHTS.repost * 10 +
    probs.click * ALGORITHM_WEIGHTS.click * 10 +
    probs.photoExpand * ALGORITHM_WEIGHTS.photoExpand * 10 +
    probs.share * ALGORITHM_WEIGHTS.share * 10 +
    probs.followAuthor * ALGORITHM_WEIGHTS.followAuthor * 10;

  const negativeImpact =
    negatives.notInterested * Math.abs(ALGORITHM_WEIGHTS.notInterested) * 0.5 +
    negatives.blockAuthor * Math.abs(ALGORITHM_WEIGHTS.blockAuthor) * 0.5 +
    negatives.muteAuthor * Math.abs(ALGORITHM_WEIGHTS.muteAuthor) * 0.5 +
    negatives.report * Math.abs(ALGORITHM_WEIGHTS.report) * 0.5;

  return {
    dwellContribution,
    videoViewContribution,
    engagementContribution,
    negativeImpact,
  };
}

// Generate improvement advice
function generateAdvice(
  input: TweetInput,
  _probs: EngagementProbabilities
): string[] {
  const advice: string[] = [];
  const content = input.content;
  const wordCount = countWords(content);

  // Content length advice
  if (wordCount < 15) {
    advice.push(
      "もう少し具体的な内容を追加すると滞在時間(Dwell)が向上します"
    );
  }

  // Media advice
  if (input.mediaType === "none") {
    advice.push(
      "動画を追加するとアルゴリズムスコアが大幅に向上します（Video View重み: +2.0）"
    );
  } else if (input.mediaType === "image") {
    advice.push(
      "画像は良いですが、動画の方がより高いエンゲージメントが期待できます"
    );
  }

  // Question advice
  if (!hasQuestion(content)) {
    advice.push("質問形式にするとリプライ確率が上がります");
  }

  // CTA advice
  if (!hasCallToAction(content)) {
    advice.push(
      "「いいね・RT歓迎」などのCTAを追加するとエンゲージメントが向上します"
    );
  }

  // English advice
  if (!hasEnglishText(content)) {
    advice.push(
      "英語併記でPhoenix Retrievalによるグローバルリーチが向上します"
    );
  }

  // Thread advice
  if (!input.isThread && wordCount > 100) {
    advice.push(
      "長文はスレッド形式にすると滞在時間とフォロー率が向上します"
    );
  }

  // Emoji advice
  const emojiCount = countEmojis(content);
  if (emojiCount === 0) {
    advice.push("1-3個の絵文字を追加すると視認性が向上します");
  } else if (emojiCount > 5) {
    advice.push("絵文字が多すぎるとスパム判定のリスクがあります");
  }

  // Hashtag advice
  const hashtagCount = countHashtags(content);
  if (hashtagCount === 0) {
    advice.push("1-2個の関連ハッシュタグを追加すると発見性が向上します");
  } else if (hashtagCount > 3) {
    advice.push(
      "ハッシュタグは2個以下に抑えると、スパム判定を回避できます"
    );
  }

  // Time advice
  if (input.postTime === "offpeak") {
    advice.push(
      "投稿時間をピークタイム（7-9時、12-13時、19-22時）に変更すると効果的です"
    );
  }

  return advice;
}

// Generate warnings
function generateWarnings(
  input: TweetInput,
  negatives: NegativeSignals
): string[] {
  const warnings: string[] = [];
  const content = input.content;

  // Consecutive posts warning
  if (input.consecutivePosts > 5) {
    warnings.push(
      `Author Diversity警告: 24時間以内に${input.consecutivePosts}回投稿しています。連投はフィード表示優先度が下がります`
    );
  }

  // Controversial content warning
  if (hasControversialWords(content)) {
    warnings.push(
      "攻撃的な表現が検出されました。ネガティブシグナルのリスクがあります"
    );
  }

  // Sensational content warning
  if (hasSensationalWords(content)) {
    warnings.push(
      "センセーショナルな表現が検出されました。短期的なリーチは増えますが、長期的な評価に影響する可能性があります"
    );
  }

  // High negative signals
  if (negatives.notInterested > 0.1) {
    warnings.push(
      "「興味なし」判定のリスクが高いです。コンテンツの見直しを推奨します"
    );
  }

  // Excessive hashtags
  if (countHashtags(content) > 5) {
    warnings.push(
      "ハッシュタグが多すぎます。スパムフィルターに引っかかる可能性があります"
    );
  }

  return warnings;
}

// Calculate global reach score (Phoenix Retrieval)
function calculateGlobalReachScore(input: TweetInput): number {
  let score = 30; // Base score

  if (hasEnglishText(input.content)) {
    score += 35;
  }

  if (input.mediaType === "video") {
    score += 20;
  } else if (input.mediaType === "image") {
    score += 10;
  }

  if (input.targetAudience === "engineer" || input.targetAudience === "news") {
    score += 10;
  }

  // Hashtags help discovery
  const hashtagCount = countHashtags(input.content);
  if (hashtagCount >= 1 && hashtagCount <= 2) {
    score += 5;
  }

  return Math.min(100, score);
}

// Calculate author diversity risk
function calculateAuthorDiversityRisk(
  consecutivePosts: number
): "low" | "medium" | "high" {
  if (consecutivePosts <= 3) return "low";
  if (consecutivePosts <= 7) return "medium";
  return "high";
}

// Main scoring function
export function calculateScore(input: TweetInput): ScoreResult {
  const engagementProbs = calculateEngagementProbs(input);
  const negativeSignals = calculateNegativeSignals(input);
  const breakdown = calculateBreakdown(engagementProbs, negativeSignals);

  // Calculate total score (0-100)
  const rawScore =
    breakdown.dwellContribution +
    breakdown.videoViewContribution +
    breakdown.engagementContribution -
    breakdown.negativeImpact;

  // Normalize to 0-100 scale
  const totalScore = Math.min(100, Math.max(0, rawScore));

  const advice = generateAdvice(input, engagementProbs);
  const warnings = generateWarnings(input, negativeSignals);
  const globalReachScore = calculateGlobalReachScore(input);
  const authorDiversityRisk = calculateAuthorDiversityRisk(
    input.consecutivePosts
  );

  return {
    totalScore,
    engagementProbs,
    negativeSignals,
    breakdown,
    advice,
    warnings,
    globalReachScore,
    authorDiversityRisk,
  };
}
