# CLAUDE.md - X Algorithm Simulator

## Overview
Xのアルゴリズムに基づいて投稿をスコアリングするReactアプリ。
投稿前にスコアをチェックして、改善アドバイスを受けられる。

## Live
- **Demo**: https://akine.github.io/x-algorithm-simulator/
- **GitHub**: https://github.com/akine/x-algorithm-simulator

## Tech Stack
- React 18 + TypeScript
- Vite 6
- Tailwind CSS v4
- Lucide React (icons)
- GitHub Pages (hosting)

## Project Structure
```
src/
├── App.tsx           # メインUI（ダッシュボード形式）
├── types.ts          # TypeScript型定義
├── scoringEngine.ts  # スコア計算ロジック
├── main.tsx          # エントリーポイント
└── index.css         # Tailwind + カスタムスタイル
```

## Scoring Algorithm

### 計算式
```
Score = 50 + Σ(加点) - Σ(減点)
※ 0〜100の範囲に正規化
```

### 加点要素
| 要素 | 点数 |
|------|------|
| 質問形式（?） | +15 |
| 画像添付 | +20 |
| 動画添付 | +25 |
| 適切な長さ（100-200字） | +10 |
| ハッシュタグ（1-3個） | +6 |
| 絵文字（1-3個） | +5 |
| 適度な改行 | +5 |

### 減点要素
| 要素 | 点数 |
|------|------|
| 短すぎる（30字未満） | -10 |
| 長すぎる（250字超） | -15 |
| ハッシュタグ過多（5個以上） | -20 |
| URLのみ | -30 |
| 攻撃的な表現 | -25 |

## Commands
```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# デプロイ（GitHub Pages）
npm run deploy
```

## Recent Updates
- ダッシュボード形式のレイアウト
- UI/フォントサイズ拡大（見やすく）
- 日本語UI
- リアルタイムスコアリング
- 改善アドバイス機能

## Resume
```bash
cd ~/workspace/x-algorithm-simulator
claude --resume
```
