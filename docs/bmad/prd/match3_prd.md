# Match-3 Game Product Requirements Document (PRD)

## 🎯 Project Overview
We have built a professional Match-3 puzzle game powered by **Phaser.js 3.80** game engine. The game runs smoothly in WebView environments with hardware-accelerated graphics, particle effects, and 60fps animations.

---

## 🧩 Core Gameplay
1. **Board**
   - Size: default 8x8 grid (can be extended by level or difficult).
   - Each cell contains one tile of a specific color/type.

2. **Tile Types**
   - At least 5 different colors (e.g., red, blue, green, yellow, purple).
   - Default 5 different colors (can be extended by level or difficult).

3. **Player Actions**
   - The player can swap two *adjacent* tiles (horizontal or vertical).
   - If the swap does not result in a valid match, revert the tiles.

4. **Matching Rules**
   - 3 or more consecutive tiles of the same color (horizontal or vertical) are considered a match.
   - Matching tiles are removed from the board.

5. **Cascade Mechanic**
   - After a match, tiles above fall down to fill empty spaces.
   - New tiles spawn from the top.
   - If new matches are created, repeat the process until no new matches remain.

6. **Scoring**
   - +10 points per tile cleared.
   - Combo chain multiplier: Each consecutive cascade increases score by x1.5.

---

## 🎮 Game Objectives
- The prototype should support an *endless mode* where the player can keep playing until no valid moves remain.
- In future iterations, we may add:
  - Move limits
  - Timed challenges
  - Level objectives (collect X tiles of a type)

---

## 📱 Platform & Technical Requirements
- **WebView Compatibility**: Runs flawlessly inside WebView on both iOS Safari and Android Chrome
- **Input Support**: Native touch gestures with mouse fallback for desktop testing
- **Technology Stack**: 
  - **Phaser.js 3.80**: Professional game engine with WebGL/Canvas rendering
  - **TypeScript**: Type-safe game logic with strict mode compliance
  - **Hardware Acceleration**: GPU-powered graphics and particle systems
- **Performance**: 
  - Consistent 60 FPS with automatic scaling for different screen sizes
  - 建議使用 requestAnimationFrame 或框架自帶的動畫系統，避免用 CSS transition 硬套。
- **Architecture**: Clean separation between core game logic and Phaser.js rendering layer

---

## 📱 WebView 特別注意

- **資源大小**
  - WebView 通常跑在行動裝置，載入速度很重要。壓縮圖片、音效，考慮 lazy load。
- **觸控操作**
  - 玩家主要用手勢操作，要測試滑動交換的靈敏度與誤判率。
  - 建議封裝一層「手勢事件」來支援點擊 / 拖曳。
- **離線資源**
  - 如果 WebView 要支援離線遊玩，可以考慮 Service Worker 或直接打包資源進 App。

---

**Future Phases**:
- **Special Tiles**: Bomb tiles, striped tiles, rainbow tiles with unique Phaser.js effects
- **Level System**: Progressive objectives with visual progression tracking
- **Audio Integration**: Phaser.js audio manager for rich sound design
- **Persistence**: Save/load functionality with local storage
- **Enhanced Effects**: Advanced particle systems and screen effects
- **Power-ups**: Special abilities with stunning visual feedback
