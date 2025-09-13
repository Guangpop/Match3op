# CLAUDE.md

本文件為 Claude Code (claude.ai/code) 在此程式庫中工作時提供指引。

## 專案概述
這是一個**已完成的三消益智遊戲**，使用 **Phaser.js 3.80** 遊戲引擎，專為 WebView 環境（iOS/Android）設計。遊戲具有硬體加速圖形、粒子效果和專業品質的 60fps 動畫。

## ⚠️ 重要規則：不創建簡化版本
**絕對不要創建簡化、基礎或測試版本**
- 不要創建名為 "simple-*"、"basic-*"、"test-*" 的文件（除非是正當的單元測試）
- 當完整架構已存在時，不要寫簡化實現
- 不要用 HTML 內聯程式碼繞過現有架構
- 總是使用現有的完整 Phaser.js 架構組件
- 如果需要修復，修復現有架構，不要創建變通方案

## 專案結構
這是一個自含的三消益智遊戲，程式庫中包含所有必要組件。

## 已實現架構 ✅ 完成
程式庫遵循清潔的模組化結構：
- `src/core/` - 遊戲邏輯（board.ts, match.ts, cascade.ts, phaser-game.ts）
- `src/ui/` - Phaser.js 渲染和動畫（phaser-renderer.ts, phaser-animator.ts）
- `dist/` - 在 http://127.0.0.1:3002 運行的編譯遊戲
- `tests/` - 只有在測試主遊戲使用的實際遊戲組件時才需要單元測試

## Technology Stack ✅ IMPLEMENTED
- **Language**: TypeScript with strict mode compliance
- **Game Engine**: Phaser.js 3.80 with WebGL/Canvas rendering (loaded from CDN)
- **Graphics**: Hardware-accelerated particle effects and physics
- **Target**: WebView (iOS/Android) - fully optimized
- **Performance**: Consistent 60 FPS with GPU acceleration

## Development Workflow ✅ COMPLETED
The project follows modern TypeScript development practices. Implementation includes:
- ✅ **Clean Architecture**: Core game logic completely separated from Phaser.js rendering
- ✅ **WebView Excellence**: Optimized for iOS/Android with hardware acceleration
- ✅ **Professional Quality**: Production-ready with particle effects and smooth animations

## Game Features ✅ ALL IMPLEMENTED
- ✅ **8x8 Grid**: Professional tile-based game board with 5 colorful tile types
- ✅ **Smart Swapping**: Adjacent tile swapping with visual selection and validation
- ✅ **Match Detection**: 3+ consecutive horizontal/vertical matching with particle effects
- ✅ **Physics Cascades**: Realistic falling tiles with bounce physics and smooth refill
- ✅ **Advanced Scoring**: Base points + 1.5x cascade multipliers with real-time updates
- ✅ **Endless Mode**: Continuous gameplay with professional visual polish

## Main Game Architecture Components
**USE THESE EXISTING COMPONENTS - DO NOT CREATE ALTERNATIVES:**
- ✅ `Match3Game` class in `dist/core/phaser-game.js` - Main game controller
- ✅ `Match3Scene` class in `dist/ui/phaser-renderer.js` - Phaser.js scene with full UI
- ✅ `PhaserAnimator` class in `dist/ui/phaser-animator.js` - Animation system
- ✅ `BoardManager` class in `dist/core/board.js` - Board logic
- ✅ `MatchEngine` class in `dist/core/match.js` - Match detection and scoring

## ES Module Configuration
- Phaser.js is loaded from CDN in index.html: `<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.0/dist/phaser.min.js"></script>`
- Game modules use ES6 imports but reference global Phaser object
- Main game loads with: `const { Match3Game } = await import('./core/phaser-game.js');`

## Quality Assurance ✅ ALL COMPLETED
- ✅ **Smart Initialization**: Board generates without pre-existing matches
- ✅ **Graceful Reverts**: Invalid swaps animate back smoothly with visual feedback
- ✅ **Smooth Performance**: Hardware-accelerated 60fps in WebView environments  
- ✅ **Production Ready**: Professional-quality game with particle effects and physics

## Quick Start
```bash
npm install
npm run build
npm run serve
# Open http://127.0.0.1:3002 to play the Phaser.js game!
```

## DEBUGGING GUIDELINES
1. If there are ES module errors, check that Phaser imports are removed (use global Phaser object)
2. If game doesn't load, verify all architecture components are using existing classes
3. NEVER create simplified versions to "fix" issues - fix the actual architecture
4. Main game should always use `new Match3Game('game-container')` in index.html

## ⚠️ CRITICAL RULE: TEST AFTER FIXES
**ALWAYS WRITE JEST TESTS TO VERIFY FIXES AFTER MAKING CODE CHANGES**
- After fixing any bug, immediately write Jest tests to verify the fix works
- Tests should verify the specific bug that was found and fixed
- Tests should use the ACTUAL game components that the main game uses
- Run tests with `npm test` to confirm fixes are working
- This prevents regression and ensures fixes are properly validated
- Example flow: Find bug → Fix code → Write test to verify fix → Run test to confirm

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create simplified, basic, test, or "simple-*" versions of existing components.
ALWAYS use the existing complete Phaser.js architecture.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.