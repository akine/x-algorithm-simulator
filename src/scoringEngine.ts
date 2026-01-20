import type { PostInput, ScoreResult, ScoreDetail, PostStats } from "./types";

// テキスト分析ヘルパー関数

// 文字数カウント（URLを除外）
function countChars(text: string): number {
  // URLを除外してカウント
  const withoutUrls = text.replace(/https?:\/\/[^\s]+/g, "");
  return withoutUrls.length;
}

// ハッシュタグカウント
function countHashtags(text: string): number {
  const matches = text.match(/#[^\s#]+/g);
  return matches ? matches.length : 0;
}

// 絵文字カウント
function countEmojis(text: string): number {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1FA00}-\u{1FAFF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
}

// 改行カウント
function countLineBreaks(text: string): number {
  const matches = text.match(/\n/g);
  return matches ? matches.length : 0;
}

// 質問形式チェック
function hasQuestion(text: string): boolean {
  return text.includes("?") || text.includes("？");
}

// URLチェック
function hasUrl(text: string): boolean {
  return /https?:\/\/[^\s]+/.test(text);
}

// URLのみチェック
function isUrlOnly(text: string): boolean {
  const withoutUrls = text.replace(/https?:\/\/[^\s]+/g, "").trim();
  return hasUrl(text) && withoutUrls.length < 10;
}

// 攻撃的な表現チェック
function hasOffensiveWords(text: string): boolean {
  const offensivePatterns = [
    /死ね/,
    /殺す/,
    /バカ/,
    /アホ/,
    /クソ/,
    /ゴミ/,
    /消えろ/,
    /うざい/,
    /きもい/,
    /しね/,
    /ころす/,
  ];
  return offensivePatterns.some((pattern) => pattern.test(text));
}

// 適度な改行チェック（2-4個が適切）
function hasProperLineBreaks(text: string, charCount: number): boolean {
  const lineBreaks = countLineBreaks(text);
  // 100文字以上で2-4個の改行があれば適切
  if (charCount >= 100 && lineBreaks >= 2 && lineBreaks <= 4) {
    return true;
  }
  // 短い投稿では1-2個でも適切
  if (charCount >= 50 && charCount < 100 && lineBreaks >= 1 && lineBreaks <= 2) {
    return true;
  }
  return false;
}

// 投稿の統計情報を取得
function analyzePost(content: string): PostStats {
  const charCount = countChars(content);
  return {
    charCount,
    hashtagCount: countHashtags(content),
    emojiCount: countEmojis(content),
    lineBreakCount: countLineBreaks(content),
    hasQuestion: hasQuestion(content),
    hasUrl: hasUrl(content),
    urlOnly: isUrlOnly(content),
  };
}

// メインのスコア計算関数
export function calculateScore(input: PostInput): ScoreResult {
  const { content, mediaType } = input;
  const stats = analyzePost(content);

  const bonusDetails: ScoreDetail[] = [];
  const penaltyDetails: ScoreDetail[] = [];

  // ========== 加点要素 ==========

  // 質問形式(?) +15
  bonusDetails.push({
    label: "質問形式（?）",
    points: 15,
    applied: stats.hasQuestion,
    reason: stats.hasQuestion ? "質問はリプライを促進します" : "質問形式にするとエンゲージメントUP",
  });

  // 画像添付 +20
  const hasImage = mediaType === "image";
  bonusDetails.push({
    label: "画像添付",
    points: 20,
    applied: hasImage,
    reason: hasImage ? "画像が視覚的な興味を引きます" : "画像を追加すると注目度UP",
  });

  // 動画添付 +25
  const hasVideo = mediaType === "video";
  bonusDetails.push({
    label: "動画添付",
    points: 25,
    applied: hasVideo,
    reason: hasVideo ? "動画は最も高いエンゲージメントを生みます" : "動画は最高の加点要素です",
  });

  // 適切な長さ (100-200字) +10
  const properLength = stats.charCount >= 100 && stats.charCount <= 200;
  bonusDetails.push({
    label: "適切な長さ（100-200字）",
    points: 10,
    applied: properLength,
    reason: properLength
      ? `${stats.charCount}字：読みやすい長さです`
      : stats.charCount < 100
        ? `${stats.charCount}字：もう少し詳しく書くと◎`
        : `${stats.charCount}字：少し長めです`,
  });

  // ハッシュタグ(1-3個) +6
  const properHashtags = stats.hashtagCount >= 1 && stats.hashtagCount <= 3;
  bonusDetails.push({
    label: "ハッシュタグ（1-3個）",
    points: 6,
    applied: properHashtags,
    reason: properHashtags
      ? `${stats.hashtagCount}個：発見性が向上します`
      : stats.hashtagCount === 0
        ? "1-3個のハッシュタグを追加すると発見されやすくなります"
        : `${stats.hashtagCount}個：多すぎるとスパム扱いされます`,
  });

  // 絵文字(1-3個) +5
  const properEmojis = stats.emojiCount >= 1 && stats.emojiCount <= 3;
  bonusDetails.push({
    label: "絵文字（1-3個）",
    points: 5,
    applied: properEmojis,
    reason: properEmojis
      ? `${stats.emojiCount}個：適度な絵文字で親しみやすさUP`
      : stats.emojiCount === 0
        ? "1-3個の絵文字を追加すると目を引きます"
        : `${stats.emojiCount}個：絵文字が多すぎます`,
  });

  // 適度な改行 +5
  const properBreaks = hasProperLineBreaks(content, stats.charCount);
  bonusDetails.push({
    label: "適度な改行",
    points: 5,
    applied: properBreaks,
    reason: properBreaks
      ? "読みやすいフォーマットです"
      : "適度に改行を入れると読みやすくなります",
  });

  // ========== 減点要素 ==========

  // 短すぎる(30字未満) -10
  const tooShort = stats.charCount < 30 && stats.charCount > 0;
  penaltyDetails.push({
    label: "短すぎる（30字未満）",
    points: -10,
    applied: tooShort,
    reason: tooShort
      ? `${stats.charCount}字：もう少し内容を追加しましょう`
      : undefined,
  });

  // 長すぎる(250字超) -15
  const tooLong = stats.charCount > 250;
  penaltyDetails.push({
    label: "長すぎる（250字超）",
    points: -15,
    applied: tooLong,
    reason: tooLong
      ? `${stats.charCount}字：長すぎると離脱されやすいです`
      : undefined,
  });

  // ハッシュタグ過多(5個以上) -20
  const tooManyHashtags = stats.hashtagCount >= 5;
  penaltyDetails.push({
    label: "ハッシュタグ過多（5個以上）",
    points: -20,
    applied: tooManyHashtags,
    reason: tooManyHashtags
      ? `${stats.hashtagCount}個：スパム判定のリスクがあります`
      : undefined,
  });

  // URLのみ -30
  penaltyDetails.push({
    label: "URLのみ",
    points: -30,
    applied: stats.urlOnly,
    reason: stats.urlOnly
      ? "URLだけでは興味を引けません。説明を追加しましょう"
      : undefined,
  });

  // 攻撃的な表現 -25
  const offensive = hasOffensiveWords(content);
  penaltyDetails.push({
    label: "攻撃的な表現",
    points: -25,
    applied: offensive,
    reason: offensive
      ? "攻撃的な表現はブロック・報告のリスクがあります"
      : undefined,
  });

  // ========== スコア計算 ==========
  // Score = 50 + Σ(加点) - Σ(減点)

  const baseScore = 50;
  const bonusPoints = bonusDetails
    .filter((d) => d.applied)
    .reduce((sum, d) => sum + d.points, 0);
  const penaltyPoints = penaltyDetails
    .filter((d) => d.applied)
    .reduce((sum, d) => sum + Math.abs(d.points), 0);

  // 0〜100の範囲に正規化
  const rawScore = baseScore + bonusPoints - penaltyPoints;
  const totalScore = Math.max(0, Math.min(100, rawScore));

  // ========== アドバイス生成 ==========
  const advice: string[] = [];

  // 空の投稿
  if (content.trim().length === 0) {
    advice.push("投稿内容を入力してください");
  } else {
    // 加点を得られていない項目からアドバイス
    bonusDetails
      .filter((d) => !d.applied && d.reason)
      .forEach((d) => {
        advice.push(`💡 ${d.reason}`);
      });

    // 減点されている項目から警告
    penaltyDetails
      .filter((d) => d.applied && d.reason)
      .forEach((d) => {
        advice.push(`⚠️ ${d.reason}`);
      });

    // 追加のアドバイス
    if (totalScore >= 80) {
      advice.unshift("🎉 素晴らしい投稿です！高いエンゲージメントが期待できます");
    } else if (totalScore >= 60) {
      advice.unshift("👍 良い投稿です。さらに改善の余地があります");
    } else if (totalScore >= 40) {
      advice.unshift("📝 改善点を参考にブラッシュアップしましょう");
    } else {
      advice.unshift("🔄 投稿内容を見直すことをおすすめします");
    }
  }

  return {
    totalScore,
    baseScore,
    bonusPoints,
    penaltyPoints,
    bonusDetails,
    penaltyDetails,
    advice,
    stats,
  };
}
