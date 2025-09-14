# 🎮 三消遊戲 (Match-3 Game)

基於 Phaser.js 引擎開發的三消益智遊戲，擁有硬體加速圖形，專為 WebView 環境（iOS/Android）設計。

## ✨ 遊戲特色

### 🎯 核心玩法
- **8x8 棋盤**：經典三消遊戲棋盤，包含 5 種顏色的方塊
- **相鄰交換**：點擊相鄰的兩個方塊來交換位置
- **三消匹配**：3 個或以上連續方塊（水平/垂直）形成消除
- **智能驗證**：無效交換會自動復原並播放動畫

### 🎬 動畫與視覺效果
- **硬體加速**：Phaser.js 驅動的 60fps 流暢動畫
- **粒子效果**：方塊消除時的精美視覺反饋
- **連鎖機制**：擬真的方塊掉落物理效果，帶有彈跳效果
- **補充系統**：新方塊從上方生成，擁有流暢的動畫
- **多級連鎖**：自動連鎖反應，帶有倍數加分

### 🏆 計分系統
- 基礎：每個被消除的方塊得 **10 分**
- 連鎖：每級連鎖有 **1.5 倍**加成
- 浮動文字提供視覺反饋

## 🚀 Live Demo

**[https://your-username.github.io/match3op](https://your-username.github.io/match3op)**

部署在 GitHub Pages 上的線上版本，包含完整遊戲功能和視覺效果。

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run serve

# Open browser and navigate to:
# http://127.0.0.1:8080
```

### Production Build

```bash
# Build for production (GitHub Pages ready)
npm run build:prod

# Serve production build locally
npm run serve:prod
```

### Development Commands

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Run console demo
npm run demo

# Run tests
npm test
```

## 🎮 How to Play

1. **Select Tiles**: Click on any tile to select it
2. **Make Swaps**: Click an adjacent tile to attempt a swap
3. **Create Matches**: Form lines of 3+ same-colored tiles
4. **Watch Cascades**: Enjoy the falling animation as new matches form
5. **Score Points**: Earn points with cascade multipliers!

### 🎯 Game Rules
- Only **adjacent tiles** can be swapped (horizontal/vertical)
- Swaps that don't create matches will **automatically revert**
- **Cascades continue** until no new matches are found
- Score multiplier increases with each cascade level

## 🏗️ Architecture

### 📁 Project Structure
```
match3op/
├── src/
│   ├── core/           # Game logic
│   │   ├── board.ts    # Board management & tile swapping
│   │   ├── match.ts    # Match detection & scoring
│   │   ├── game.ts     # Game controller & flow
│   │   └── cascade.ts  # Cascade & gravity system
│   ├── ui/
│   │   ├── phaser-renderer.ts  # Phaser.js scene & game setup
│   │   └── phaser-animator.ts  # Hardware-accelerated animations
│   └── index.ts                # CLI entry point
├── tests/              # Unit tests
└── dist/               # Build output
```

### 🔧 Core Components

- **Board Manager**: Handles 2D grid, tile placement, and swapping logic
- **Match Engine**: Detects matches and calculates scores
- **Cascade System**: Manages tile gravity and refill mechanics
- **Phaser Renderer**: Manages Phaser.js scenes and game objects
- **Phaser Animator**: Hardware-accelerated animations and particle effects
- **Game Controller**: Orchestrates the complete game flow

## 🎨 Technical Details

### 🛠️ Built With
- **Phaser.js 3.80** - Professional game engine with WebGL/Canvas rendering
- **TypeScript** - Type-safe game logic
- **Hardware Acceleration** - GPU-powered graphics and physics
- **Particle Systems** - Advanced visual effects
- **Jest** - Unit testing

### 📱 WebView Compatibility
- **iOS Safari WebView** support
- **Android Chrome WebView** support
- Touch and mouse input handling
- Responsive scaling for different screen sizes

### ⚡ Performance
- **60 FPS** target with Phaser.js hardware acceleration
- **WebGL rendering** with Canvas fallback
- Optimized cascade calculations and particle effects
- Efficient match detection algorithms
- Non-blocking async animation system

## 🧪 Development Stories

This project was built following user stories:

1. **Story 1**: Basic tile swapping and matching
2. **Story 2**: Smooth swap animations with revert on invalid moves
3. **Story 3**: Complete cascade system with falling and refill animations

Each story includes comprehensive tests and documentation.

## 📚 Project Structure

- **Core Logic**: `src/core/` - Game mechanics and board management
- **UI Components**: `src/ui/` - Phaser.js rendering and animations
- **Tests**: `tests/` - Comprehensive unit tests

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific stories
npm test story1
npm test story2
npm test story3
```

## 🔧 Development

### Adding New Features
1. Implement core logic in `src/core/`
2. Add animations in `src/ui/`
3. Write tests in `tests/`
4. Update documentation as needed

### Architecture Guidelines
- Keep **game logic separate** from UI
- Use **async/await** for animations
- Follow **TypeScript strict** mode
- Write **unit tests** for all mechanics

## 🌐 GitHub Pages 部署

### 自動部署 (推薦)

1. **Fork 或 Clone** 此專案到你的 GitHub 帳號
2. **啟用 GitHub Pages**:
   - 前往 Repository Settings → Pages
   - Source 選擇 "GitHub Actions"
3. **設定權限**:
   - Settings → Actions → General
   - Workflow permissions → "Read and write permissions"
4. **推送程式碼**到 main/master branch
5. GitHub Action 會自動構建並部署到 `https://your-username.github.io/match3op`

### 手動部署

```bash
# 構建生產版本
npm run build:prod

# 將 dist/ 目錄內容部署到 gh-pages branch
# (使用你偏好的部署方法)
```

### 環境特性

- **生產環境** (GitHub Pages): 自動隱藏 Export 功能，純前端運行
- **開發環境** (Local): 完整功能，包含伺服器端 Export 和日誌功能

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure WebView compatibility

## 📄 License

MIT License - See LICENSE file for details.

---

🎮 **Enjoy the cascading fun!** 

Try creating multiple matches in sequence to see the satisfying cascade animations and score multipliers in action.