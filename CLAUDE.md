# CLAUDE.md - X Algorithm Simulator

## Overview
X（旧Twitter）のPhoenix / Grok-based Transformerアルゴリズム（2026年版）をシミュレーションするReactアプリ。
投稿内容を分析し、アルゴリズムスコアを0-100点で評価する。

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State**: React useState/useMemo（外部ライブラリ不要）

## Project Structure
```
src/
├── App.tsx           # Main UI component
├── types.ts          # TypeScript型定義
├── scoringEngine.ts  # アルゴリズムスコア計算ロジック
├── main.tsx          # エントリーポイント
└── index.css         # Tailwind imports + カスタムスタイル
```

## Algorithm Details (Phoenix 2026)

### Score Formula
```
Total Score = Σ (weight_i × P(action_i)) - Negative Impact
```

### Engagement Weights (Positive)
| Action | Weight | Description |
|--------|--------|-------------|
| Follow | 3.0 | 最高評価 - フォロー獲得 |
| Dwell | 2.5 | 滞在時間 - 質の指標 |
| Video View | 2.0 | 動画視聴（50%以上） |
| Share | 1.8 | 外部シェア |
| Repost | 1.5 | リポスト |
| Reply | 1.0 | リプライ |
| Favorite | 0.5 | いいね |
| Photo Expand | 0.4 | 画像拡大 |
| Click | 0.3 | クリック |

### Negative Weights (Penalties)
| Signal | Weight |
|--------|--------|
| Report | -100 |
| Block | -50 |
| Mute | -30 |
| Not Interested | -10 |

## Commands
```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

## Features
1. **Input Section**: ツイート下書き、メディア選択、ターゲット層選択
2. **Scoring Engine**: リアルタイムスコア計算、確率表示
3. **Feedback Section**: 改善アドバイス、警告表示
4. **Phoenix Retrieval**: 英語併記によるグローバルリーチ評価
5. **Author Diversity**: 連投リスク警告

## Design Tokens
- **Background**: #0a0a0a (メイン), #111 (カード)
- **Text**: #fff (プライマリ), #9ca3af (セカンダリ)
- **Accent**: Blue (#3b82f6), Purple (#8b5cf6)
- **Success**: Emerald (#10b981)
- **Warning**: Yellow (#eab308), Orange (#f97316)
- **Error**: Red (#ef4444)

## Session Memory
このプロジェクトを再開する場合:
```bash
cd ~/workspace/x-algorithm-simulator
claude --resume
```

### 現在の状態
- [x] プロジェクト初期化
- [x] Tailwind CSS v4 セットアップ
- [x] スコアリングエンジン実装
- [x] UI実装（入力フォーム、スコア表示、フィードバック）
- [x] ダークモードUI

### 次のステップ（オプション）
- [ ] LocalStorageで下書き保存
- [ ] 複数ツイート比較機能
- [ ] スコア履歴グラフ
- [ ] PWA対応
- [ ] エクスポート機能（画像/JSON）

## Philosophy
- **Mobile First**: レスポンシブ対応最優先
- **最小変更**: 依頼範囲のみ修正
- **壊さない**: 既存デザイン・動作維持

## Don'ts
- 過度な最適化（必要になったら）
- 外部API依存（オフラインで動作）
- 複雑な状態管理ライブラリ
