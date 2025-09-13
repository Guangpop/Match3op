# 🎮 Match-3 Game

A Phaser.js-powered Match-3 puzzle game with hardware-accelerated graphics designed for WebView environments (iOS/Android).

## ✨ Features

### 🎯 Core Gameplay
- **8x8 Grid**: Classic match-3 board with 5 colorful tile types
- **Adjacent Swapping**: Click two adjacent tiles to swap them
- **Match Detection**: 3+ consecutive tiles (horizontal/vertical) create matches
- **Smart Validation**: Invalid swaps automatically revert with animation

### 🎬 Animations & Visual Effects
- **Hardware Acceleration**: Phaser.js powered 60fps smooth animations
- **Particle Effects**: Beautiful visual feedback for tile clearing
- **Cascade Mechanics**: Realistic physics for falling tiles with bounce effects
- **Refill System**: New tiles spawn from above with smooth animations
- **Multi-level Cascades**: Automatic chain reactions with multiplier bonuses

### 🏆 Scoring System
- Base: **10 points** per cleared tile
- Cascades: **1.5x multiplier** for each cascade level
- Visual feedback with floating messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Open browser and navigate to:
# http://127.0.0.1:8080
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