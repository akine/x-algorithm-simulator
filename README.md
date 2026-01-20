# ⚡ X Algorithm Simulator

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<p align="center">
  🐦 X（旧Twitter）の最新アルゴリズム <b>Phoenix / Grok-based Transformer (2026)</b> をシミュレーション！<br/>
  投稿前にスコアをチェックして、バズる投稿を目指そう 🚀
</p>

---

## ✨ Features

| 機能 | 説明 |
|------|------|
| 📝 **ツイート入力** | 下書きをリアルタイムで分析 |
| 🎯 **スコアリング** | 0-100点でアルゴリズム評価 |
| 📊 **確率表示** | 各アクション（Like, RT, Reply等）の発生確率 |
| 🎬 **メディア選択** | 画像/動画/リンク/投票の影響をシミュレート |
| 🌍 **Global Reach** | 英語併記でPhoenix Retrievalスコア評価 |
| ⚠️ **リスク警告** | 連投・炎上ワードを検知 |
| 💡 **改善アドバイス** | スコアアップのヒントを日本語で表示 |

---

## 🎮 Demo

```
📈 Score: 78/100 [Excellent]

┌─────────────────────────────────┐
│ Dwell Time      ████████░░  80% │  x2.5
│ Video View      ██████████ 100% │  x2.0
│ Follow          ██░░░░░░░░  15% │  x3.0
│ Repost          █████░░░░░  45% │  x1.5
└─────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/x-algorithm-simulator.git
cd x-algorithm-simulator

# Install
npm install

# Dev server
npm run dev
```

ブラウザで `http://localhost:5173` を開く 🎉

---

## 🧮 Algorithm Weights

Phoenix 2026 アルゴリズムの重み付け：

| Action | Weight | 説明 |
|--------|--------|------|
| 👤 Follow | **x3.0** | 最高評価！フォロー獲得 |
| ⏱️ Dwell | **x2.5** | 滞在時間 = 質の指標 |
| 🎬 Video View | **x2.0** | 動画視聴（50%以上） |
| 🔗 Share | **x1.8** | 外部シェア |
| 🔄 Repost | **x1.5** | リポスト/RT |
| 💬 Reply | **x1.0** | リプライ |
| ❤️ Like | **x0.5** | いいね |
| 🖱️ Click | **x0.3** | クリック |

### ⛔ Negative Signals

| Signal | Penalty |
|--------|---------|
| 🚨 Report | **-100** |
| 🚫 Block | **-50** |
| 🔇 Mute | **-30** |
| 👎 Not Interested | **-10** |

---

## 📁 Project Structure

```
src/
├── 🎨 App.tsx           # メインUI
├── 📋 types.ts          # TypeScript型定義
├── 🧠 scoringEngine.ts  # スコア計算ロジック
├── 🎭 index.css         # Tailwind + カスタムスタイル
└── 🚪 main.tsx          # エントリーポイント
```

---

## 🛠️ Tech Stack

- ⚛️ **React 18** - UI Framework
- 📘 **TypeScript** - Type Safety
- 🎨 **Tailwind CSS v4** - Styling
- ⚡ **Vite 6** - Build Tool
- 🎯 **Lucide React** - Icons

---

## 📝 Tips for High Score

1. 🎬 **動画を追加** - Video Viewの重みが高い（x2.0）
2. ❓ **質問形式にする** - リプライ確率UP
3. 🌐 **英語併記** - グローバルリーチ向上
4. 🧵 **スレッド形式** - 滞在時間が大幅UP
5. ⏰ **ピークタイム投稿** - 7-9時、12-13時、19-22時
6. 📊 **連投を避ける** - Author Diversityペナルティ回避

---

## 🤝 Contributing

PRs welcome! 🙌

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m '✨ Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use! 🎁

---

<p align="center">
  Made with ❤️ and ☕<br/>
  <b>Let's hack the algorithm! 🐦⚡</b>
</p>
