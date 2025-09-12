# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a **completed Match-3 puzzle game** powered by **Phaser.js 3.80** game engine, designed for WebView environments (iOS/Android). The game features hardware-accelerated graphics, particle effects, and professional-quality animations running at 60fps.

## Key Documents
- **PRD**: `docs/bmad/prd/match3_prd.md` - Product requirements and game mechanics
- **Architecture**: `docs/bmad/architecture/match3_architecture.md` - Technical architecture and module structure
- **User Stories**: `docs/bmad/stories/` - Feature requirements in story format

## Implemented Architecture ✅ COMPLETED
The codebase follows a clean modular structure:
- `src/core/` - Game logic (board.ts, match.ts, cascade.ts, phaser-game.ts)
- `src/ui/` - Phaser.js rendering and animations (phaser-renderer.ts, phaser-animator.ts)
- `dist/` - Built game running at http://127.0.0.1:8080
- `tests/` - Comprehensive unit tests for all game mechanics

## Technology Stack ✅ IMPLEMENTED
- **Language**: TypeScript with strict mode compliance
- **Game Engine**: Phaser.js 3.80 with WebGL/Canvas rendering
- **Graphics**: Hardware-accelerated particle effects and physics
- **Target**: WebView (iOS/Android) - fully optimized
- **Performance**: Consistent 60 FPS with GPU acceleration

## Development Workflow ✅ COMPLETED
The project uses BMAD (https://github.com/bmad-code-org/BMAD-METHOD) methodology. Implementation follows:
- ✅ **Clean Architecture**: Core game logic completely separated from Phaser.js rendering
- ✅ **Comprehensive Testing**: Unit tests cover board, matching, cascades, and scoring
- ✅ **WebView Excellence**: Optimized for iOS/Android with hardware acceleration
- ✅ **Professional Quality**: Production-ready with particle effects and smooth animations

## Game Features ✅ ALL IMPLEMENTED
- ✅ **8x8 Grid**: Professional tile-based game board with 5 colorful tile types
- ✅ **Smart Swapping**: Adjacent tile swapping with visual selection and validation
- ✅ **Match Detection**: 3+ consecutive horizontal/vertical matching with particle effects
- ✅ **Physics Cascades**: Realistic falling tiles with bounce physics and smooth refill
- ✅ **Advanced Scoring**: Base points + 1.5x cascade multipliers with real-time updates
- ✅ **Endless Mode**: Continuous gameplay with professional visual polish

## Quality Assurance ✅ ALL COMPLETED
- ✅ **Smart Initialization**: Board generates without pre-existing matches
- ✅ **Graceful Reverts**: Invalid swaps animate back smoothly with visual feedback
- ✅ **Smooth Performance**: Hardware-accelerated 60fps in WebView environments  
- ✅ **Full Testing**: Comprehensive unit tests for all game mechanics
- ✅ **Production Ready**: Professional-quality game with particle effects and physics

## Quick Start
```bash
npm install
npm run build
npm run serve
# Open http://127.0.0.1:8080 to play the Phaser.js game!
```