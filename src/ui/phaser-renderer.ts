/**
 * Phaser Renderer - Main Phaser.js scene for Match-3 game
 * Handles hardware-accelerated rendering, sprites, and user input
 */

// Phaser is loaded globally from CDN in HTML
import { BoardManager, TileType, Position } from '../core/board.js';
import { MatchEngine } from '../core/match.js';
import { PhaserAnimator } from './phaser-animator.js';
import { CascadeEvent } from '../core/game-logger.js';
import { logManager } from '../core/log-manager.js';
import { getAllTileColors, TILE_VISUAL_CONFIG, BOARD_CONFIG } from '../data/tile-data.js';

export class Match3Scene extends Phaser.Scene {
  private boardManager!: BoardManager;
  private matchEngine!: MatchEngine;
  private animator!: PhaserAnimator;
  
  // Game objects
  private tileSprites: Phaser.GameObjects.Sprite[][];
  private backgroundGrid!: Phaser.GameObjects.Graphics;
  private selectedTile: Position | null;
  private selectedSprite: Phaser.GameObjects.Sprite | null;
  
  // Game state
  private score: number;
  private isAnimating: boolean;
  
  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private validMovesText!: Phaser.GameObjects.Text;
  
  // Constants
  private readonly BOARD_SIZE = BOARD_CONFIG.SIZE;
  private readonly TILE_SIZE = TILE_VISUAL_CONFIG.SIZE;
  private readonly BOARD_OFFSET_X = BOARD_CONFIG.OFFSET_X;
  private readonly BOARD_OFFSET_Y = BOARD_CONFIG.OFFSET_Y;
  
  constructor() {
    super({ key: 'Match3Scene' });
    this.selectedTile = null;
    this.selectedSprite = null;
    this.score = 0;
    this.isAnimating = false;
    this.tileSprites = [];
  }

  preload(): void {
    // Create colored rectangles for tiles (can be replaced with actual sprites)
    this.createTileTextures();
    
    // Load any additional assets
    this.load.image('particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create(): void {
    // Initialize game logic
    this.boardManager = new BoardManager();
    this.matchEngine = new MatchEngine();
    this.animator = new PhaserAnimator(this, logManager);
    
    // Debug: Test logging system
    console.log('🎮 Game Scene: Testing logging system...');
    logManager.logDebug('Game scene initialized', { 
      timestamp: new Date().toISOString(),
      boardSize: this.BOARD_SIZE 
    });
    
    // Create UI
    this.createBackground();
    this.createUI();
    this.createBoard();
    
    // Enable input
    this.input.on('gameobjectdown', this.handleTileClick, this);
    
    // Initial display update
    this.updateDisplay();
    
    console.log('Phaser.js Match-3 Scene initialized');
  }

  private createTileTextures(): void {
    const colors = getAllTileColors();

    colors.forEach((color, index) => {
      const graphics = this.add.graphics();
      graphics.fillStyle(color);
      graphics.fillRoundedRect(
        0,
        0,
        this.TILE_SIZE - TILE_VISUAL_CONFIG.BORDER_WIDTH,
        this.TILE_SIZE - TILE_VISUAL_CONFIG.BORDER_WIDTH,
        TILE_VISUAL_CONFIG.BORDER_RADIUS
      );
      graphics.generateTexture(`tile_${index}`, this.TILE_SIZE, this.TILE_SIZE);
      graphics.destroy();
    });
  }

  private createBackground(): void {
    // Game background
    this.add.rectangle(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      this.cameras.main.width, 
      this.cameras.main.height, 
      0x2C3E50
    );

    // Board background
    this.backgroundGrid = this.add.graphics();
    this.backgroundGrid.fillStyle(0x34495E);
    this.backgroundGrid.fillRoundedRect(
      this.BOARD_OFFSET_X - 10,
      this.BOARD_OFFSET_Y - 10,
      this.BOARD_SIZE * this.TILE_SIZE + 20,
      this.BOARD_SIZE * this.TILE_SIZE + 20,
      10
    );

    // Grid lines
    this.backgroundGrid.lineStyle(1, 0x5D6D7E, 0.5);
    for (let i = 0; i <= this.BOARD_SIZE; i++) {
      // Vertical lines
      this.backgroundGrid.lineBetween(
        this.BOARD_OFFSET_X + i * this.TILE_SIZE,
        this.BOARD_OFFSET_Y,
        this.BOARD_OFFSET_X + i * this.TILE_SIZE,
        this.BOARD_OFFSET_Y + this.BOARD_SIZE * this.TILE_SIZE
      );
      
      // Horizontal lines
      this.backgroundGrid.lineBetween(
        this.BOARD_OFFSET_X,
        this.BOARD_OFFSET_Y + i * this.TILE_SIZE,
        this.BOARD_OFFSET_X + this.BOARD_SIZE * this.TILE_SIZE,
        this.BOARD_OFFSET_Y + i * this.TILE_SIZE
      );
    }
  }

  private createUI(): void {
    // Title
    this.add.text(this.cameras.main.centerX, 30, '🎮 Match-3 Game', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);

    // Score
    this.add.text(this.BOARD_OFFSET_X, 80, 'Score:', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF'
    });

    this.scoreText = this.add.text(this.BOARD_OFFSET_X + 80, 80, '0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#F1C40F',
      fontStyle: 'bold'
    });

    // Status message
    this.statusText = this.add.text(this.cameras.main.centerX, 110, 'Click two adjacent tiles to swap them!', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#BDC3C7',
      align: 'center'
    }).setOrigin(0.5);

    // Valid moves counter
    this.validMovesText = this.add.text(this.BOARD_OFFSET_X + 300, 80, 'Moves: 0', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#95A5A6'
    });

    // Control buttons
    this.createButtons();
  }

  private createButtons(): void {
    const buttonY = this.BOARD_OFFSET_Y + this.BOARD_SIZE * this.TILE_SIZE + 20;
    const buttonStyle = {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      backgroundColor: '#3498DB',
      padding: { x: 20, y: 10 }
    };

    // Hint button
    const hintBtn = this.add.text(this.BOARD_OFFSET_X, buttonY, '💡 Hint', buttonStyle)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHint())
      .on('pointerover', () => hintBtn.setStyle({ backgroundColor: '#2980B9' }))
      .on('pointerout', () => hintBtn.setStyle({ backgroundColor: '#3498DB' }));

    // Auto move button
    const autoBtn = this.add.text(this.BOARD_OFFSET_X + 120, buttonY, '🤖 Auto', buttonStyle)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.playAutoMove())
      .on('pointerover', () => autoBtn.setStyle({ backgroundColor: '#2980B9' }))
      .on('pointerout', () => autoBtn.setStyle({ backgroundColor: '#3498DB' }));

    // Reset button
    const resetBtn = this.add.text(this.BOARD_OFFSET_X + 220, buttonY, '🔄 Reset', {
      ...buttonStyle,
      backgroundColor: '#E74C3C'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.resetGame())
      .on('pointerover', () => resetBtn.setStyle({ backgroundColor: '#C0392B' }))
      .on('pointerout', () => resetBtn.setStyle({ backgroundColor: '#E74C3C' }));

    // Export logs button
    const exportBtn = this.add.text(this.BOARD_OFFSET_X + 320, buttonY, '📁 Export', {
      ...buttonStyle,
      backgroundColor: '#9B59B6'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.exportGameLogs())
      .on('pointerover', () => exportBtn.setStyle({ backgroundColor: '#8E44AD' }))
      .on('pointerout', () => exportBtn.setStyle({ backgroundColor: '#9B59B6' }));
  }

  private createBoard(): void {
    this.tileSprites = [];
    const boardState = this.boardManager.getBoard();

    for (let row = 0; row < this.BOARD_SIZE; row++) {
      this.tileSprites[row] = [];
      
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const tileType = boardState[row]![col]!;
        const sprite = this.createTileSprite(row, col, tileType);
        this.tileSprites[row]![col] = sprite;
      }
    }
  }

  private createTileSprite(row: number, col: number, tileType: TileType): Phaser.GameObjects.Sprite {
    const x = this.BOARD_OFFSET_X + col * this.TILE_SIZE + this.TILE_SIZE / 2;
    const y = this.BOARD_OFFSET_Y + row * this.TILE_SIZE + this.TILE_SIZE / 2;

    const sprite = this.add.sprite(x, y, `tile_${tileType}`)
      .setInteractive({ useHandCursor: true })
      .setData('row', row)
      .setData('col', col)
      .setData('tileType', tileType);

    // Add hover effect
    sprite.on('pointerover', () => {
      if (!this.isAnimating) {
        sprite.setTint(TILE_VISUAL_CONFIG.HOVER_TINT);
      }
    });

    sprite.on('pointerout', () => {
      if (!this.isAnimating && sprite !== this.selectedSprite) {
        sprite.clearTint();
      }
    });

    return sprite;
  }

  private handleTileClick(_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite): void {
    if (this.isAnimating) return;

    const row = gameObject.getData('row') as number;
    const col = gameObject.getData('col') as number;

    if (!this.selectedTile) {
      // First tile selection
      this.selectTile(row, col, gameObject);
      this.updateStatus(`Tile selected at (${row}, ${col}). Click an adjacent tile to swap.`);
    } else if (this.selectedTile.row === row && this.selectedTile.col === col) {
      // Deselect same tile
      this.deselectTile();
      this.updateStatus('Tile deselected. Click a tile to select.');
    } else {
      // Attempt swap
      this.attemptSwap(this.selectedTile, { row, col });
    }
  }

  private selectTile(row: number, col: number, sprite: Phaser.GameObjects.Sprite): void {
    this.selectedTile = { row, col };
    this.selectedSprite = sprite;
    sprite.setTint(TILE_VISUAL_CONFIG.SELECT_TINT); // Gold tint for selection
    sprite.setScale(1.1);
  }

  private deselectTile(): void {
    if (this.selectedSprite) {
      this.selectedSprite.clearTint();
      this.selectedSprite.setScale(1.0);
    }
    this.selectedTile = null;
    this.selectedSprite = null;
  }

  private async attemptSwap(pos1: Position, pos2: Position): Promise<void> {
    if (!this.boardManager.areAdjacent(pos1, pos2)) {
      this.updateStatus('Tiles must be adjacent to swap!');
      return;
    }

    const boardStateBefore = this.boardManager.getBoard();
    const matches = this.matchEngine.previewSwapMatches(boardStateBefore, pos1, pos2);

    if (!matches) {
      this.updateStatus('Swap would not create any matches!');
      // Animate invalid swap (shake and return)
      await this.animator.animateInvalidSwap(
        this.tileSprites[pos1.row]![pos1.col]!,
        this.tileSprites[pos2.row]![pos2.col]!
      );
      return;
    }

    // Log board state before move
    logManager.logBoardState("Before Swap", boardStateBefore);

    // Valid swap - start animation sequence
    this.isAnimating = true;
    this.deselectTile();

    // Get tile types before swap for logging
    const tile1Type = boardStateBefore[pos1.row]![pos1.col]!;
    const tile2Type = boardStateBefore[pos2.row]![pos2.col]!;

    // Perform the swap in game logic
    this.boardManager.swapTiles(pos1, pos2);

    // Animate the swap
    await this.animator.animateSwap(
      this.tileSprites[pos1.row]![pos1.col]!,
      this.tileSprites[pos2.row]![pos2.col]!,
      this.tileSprites
    );

    // Process cascading matches and collect log data
    const initialScore = this.score;
    const cascadeEvents = await this.processCascadingMatchesWithLogging();
    const scoreGained = this.score - initialScore;

    // Log the complete move
    const boardStateAfter = this.boardManager.getBoard();
    logManager.logPlayerMove(
      logManager.getMoveLogs().length + 1,
      { pos1, pos2, tile1Type, tile2Type },
      boardStateBefore,
      matches.matches.map(m => m.positions),
      cascadeEvents,
      boardStateAfter,
      scoreGained,
      this.score
    );

    logManager.logBoardState("After All Cascades", boardStateAfter);
    logManager.printGameStats();

    this.isAnimating = false;
    this.updateStatus('Swap completed! Look for your next move.');
  }

  /*
  private async processCascadingMatches(): Promise<void> { // Will be implemented later
    let cascadeLevel = 1;

    while (true) {
      const boardState = this.boardManager.getBoard();
      const matchResult = this.matchEngine.findMatches(boardState);

      if (matchResult.matches.length === 0) break;

      // Calculate score with cascade multiplier
      const cascadeScore = this.matchEngine.calculateScoreWithMultiplier(
        matchResult.clearedPositions.length,
        cascadeLevel
      );
      this.score += cascadeScore;

      this.updateStatus(`Cascade level ${cascadeLevel}! +${cascadeScore} points`);

      // Animate tile clearing with particles
      await this.animator.animateTileClearing(matchResult.clearedPositions, this.tileSprites);

      // Clear tiles in game logic
      this.boardManager.clearTiles(matchResult.clearedPositions);

      // Apply gravity and animate falling
      const movements = this.boardManager.applyGravity();
      await this.animator.animateFallingTiles(movements, this.tileSprites);

      // Refill board and animate spawning
      this.boardManager.refillBoard();
      await this.animator.animateSpawningTiles(this.tileSprites, this.boardManager.getBoard());

      cascadeLevel++;
      this.updateDisplay();
    }
  }
  */

  private async processCascadingMatchesWithLogging(): Promise<CascadeEvent[]> {
    const cascadeEvents: CascadeEvent[] = [];
    let cascadeLevel = 1;

    while (true) {
      const boardState = this.boardManager.getBoard();
      const matchResult = this.matchEngine.findMatches(boardState);

      if (matchResult.matches.length === 0) break;

      console.log(`🌊 Cascade Level ${cascadeLevel}: Found ${matchResult.matches.length} match groups`);

      // Calculate score with cascade multiplier
      const cascadeScore = this.matchEngine.calculateScoreWithMultiplier(
        matchResult.clearedPositions.length,
        cascadeLevel
      );
      this.score += cascadeScore;

      this.updateStatus(`Cascade level ${cascadeLevel}! +${cascadeScore} points`);

      // Remove unused variable - board state tracked after clearing

      // Animate tile clearing with particles
      await this.animator.animateTileClearing(matchResult.clearedPositions, this.tileSprites);

      // Clear tiles in game logic
      this.boardManager.clearTiles(matchResult.clearedPositions);

      // Apply gravity and track movements
      const boardBeforeGravity = JSON.parse(JSON.stringify(this.boardManager.getBoard()));
      const movements = this.boardManager.applyGravity();
      const boardAfterGravity = this.boardManager.getBoard();
      
      // Log falling tiles to file
      logManager.logFallingTiles(movements, boardBeforeGravity, boardAfterGravity);
      
      // Convert movements to falling tiles log format
      const fallingTiles = Array.from(movements.entries()).map(([key, toPos]) => {
        const [fromRow, fromCol] = key.split(',').map(Number);
        const fromPos = { row: fromRow!, col: fromCol! };
        const tileType = boardBeforeGravity[fromPos.row]![fromPos.col]!;
        return { from: fromPos, to: toPos, tileType };
      });

      await this.animator.animateFallingTiles(movements, this.tileSprites, boardAfterGravity);

      // Track board state before refill
      const boardBeforeRefill = JSON.parse(JSON.stringify(this.boardManager.getBoard()));

      // Refill board and track new tiles
      this.boardManager.refillBoard();
      const boardAfterRefill = this.boardManager.getBoard();
      
      // Log refill operation to file
      logManager.logRefill(boardBeforeRefill, boardAfterRefill);

      // Find newly spawned tiles (compare before and after refill)
      const newTilesSpawned: Array<{ position: Position; tileType: TileType }> = [];
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          const beforeTile = boardBeforeRefill[row]![col];
          const afterTile = boardAfterRefill[row]![col];
          // Empty space that got filled
          if ((beforeTile === undefined || beforeTile < 0) && afterTile !== undefined && afterTile >= 0) {
            newTilesSpawned.push({
              position: { row, col },
              tileType: afterTile
            });
          }
        }
      }

      await this.animator.animateSpawningTiles(this.tileSprites, boardAfterRefill);

      // Create cascade event log
      const cascadeEvent = logManager.createCascadeEvent(
        cascadeLevel,
        matchResult.clearedPositions,
        cascadeScore,
        fallingTiles,
        newTilesSpawned,
        boardAfterRefill
      );

      cascadeEvents.push(cascadeEvent);

      console.log(`📊 Cascade ${cascadeLevel}: ${matchResult.clearedPositions.length} tiles cleared, ${fallingTiles.length} tiles fell, ${newTilesSpawned.length} new tiles spawned`);

      cascadeLevel++;
      this.updateDisplay();
    }

    return cascadeEvents;
  }

  private showHint(): void {
    if (this.isAnimating) return;

    const boardState = this.boardManager.getBoard();
    const validMoves = this.matchEngine.getAllValidSwaps(boardState);

    if (validMoves.length === 0) {
      this.updateStatus('No valid moves available!');
      return;
    }

    // Show best move
    const bestMove = validMoves.reduce((best, current) =>
      current.matches.clearedPositions.length > best.matches.clearedPositions.length
        ? current
        : best
    );

    // Highlight hint tiles
    this.animator.highlightHintTiles([
      this.tileSprites[bestMove.pos1.row]![bestMove.pos1.col]!,
      this.tileSprites[bestMove.pos2.row]![bestMove.pos2.col]!
    ]);

    this.updateStatus(`💡 Hint: Swap (${bestMove.pos1.row},${bestMove.pos1.col}) ↔ (${bestMove.pos2.row},${bestMove.pos2.col}) for ${bestMove.matches.clearedPositions.length} tiles!`);
  }

  private async playAutoMove(): Promise<void> {
    if (this.isAnimating) return;

    const boardState = this.boardManager.getBoard();
    const validMoves = this.matchEngine.getAllValidSwaps(boardState);

    if (validMoves.length === 0) {
      this.updateStatus('No valid moves available!');
      return;
    }

    const bestMove = validMoves.reduce((best, current) =>
      current.matches.clearedPositions.length > best.matches.clearedPositions.length
        ? current
        : best
    );

    await this.attemptSwap(bestMove.pos1, bestMove.pos2);
  }

  private resetGame(): void {
    if (this.isAnimating) return;

    this.deselectTile();
    this.score = 0;
    this.boardManager.reset();
    
    // Recreate board sprites
    this.tileSprites.forEach(row => {
      row.forEach(sprite => sprite.destroy());
    });
    
    this.createBoard();
    this.updateDisplay();
    this.updateStatus('Game reset! Click two adjacent tiles to swap them.');
  }

  private updateDisplay(): void {
    this.scoreText.setText(this.score.toString());

    const boardState = this.boardManager.getBoard();
    const validMoves = this.matchEngine.getAllValidSwaps(boardState);
    this.validMovesText.setText(`Moves: ${validMoves.length}`);

    if (validMoves.length === 0) {
      this.updateStatus('🎯 Game Over! No more valid moves.');
    }

    // Force sync sprites with board state to fix visual inconsistencies
    this.syncSpritesWithBoard();
  }

  /**
   * Synchronize sprite array with actual board state
   * This fixes cases where sprites may be in wrong positions due to animation issues
   */
  private syncSpritesWithBoard(): void {
    const boardState = this.boardManager.getBoard();

    // First, destroy any orphaned sprites that might be lingering
    this.cleanupOrphanedSprites();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const currentSprite = this.tileSprites[row]?.[col];
        const expectedType = boardState[row]?.[col];

        if (expectedType !== undefined && expectedType >= 0) {
          // Should have a sprite here
          if (!currentSprite || currentSprite.getData('tileType') !== expectedType) {
            // Sprite is missing or wrong type, need to fix
            if (currentSprite) {
              currentSprite.destroy();
            }

            // Create new sprite at correct position
            const x = this.BOARD_OFFSET_X + col * this.TILE_SIZE + this.TILE_SIZE / 2;
            const y = this.BOARD_OFFSET_Y + row * this.TILE_SIZE + this.TILE_SIZE / 2;

            const sprite = this.add.sprite(x, y, `tile_${expectedType}`)
              .setInteractive()
              .setData('row', row)
              .setData('col', col)
              .setData('tileType', expectedType)
              .setAlpha(1)
              .setScale(1);

            this.tileSprites[row]![col] = sprite;
          } else {
            // Sprite exists and correct type, but verify position
            const expectedX = this.BOARD_OFFSET_X + col * this.TILE_SIZE + this.TILE_SIZE / 2;
            const expectedY = this.BOARD_OFFSET_Y + row * this.TILE_SIZE + this.TILE_SIZE / 2;

            if (currentSprite.x !== expectedX || currentSprite.y !== expectedY) {
              currentSprite.x = expectedX;
              currentSprite.y = expectedY;
            }

            // Ensure sprite is fully visible
            currentSprite.setAlpha(1).setScale(1);
          }
        } else {
          // Should NOT have a sprite here
          if (currentSprite) {
            currentSprite.destroy();
            this.tileSprites[row]![col] = null as any;
          }
        }
      }
    }
  }

  private updateStatus(message: string): void {
    this.statusText.setText(message);
  }

  // Public methods for external access
  public getScore(): number {
    return this.score;
  }

  public getValidMovesCount(): number {
    const boardState = this.boardManager.getBoard();
    return this.matchEngine.getAllValidSwaps(boardState).length;
  }

  public getBoardManager(): BoardManager {
    return this.boardManager;
  }

  public getMatchEngine(): MatchEngine {
    return this.matchEngine;
  }

  public getLogManager() {
    return logManager;
  }

  public async exportGameLogs(): Promise<void> {
    try {
      const sessionId = logManager.getSessionId();

      // Scan actual visual state before exporting
      const visualState = this.scanVisualState();

      // Log visual state for comparison
      logManager.logDebug('VISUAL STATE SCAN - Current screen display', visualState);

      // Export .log file to server
      const logContent = logManager.getCurrentSessionLogs();
      await this.saveLogToServer(sessionId, logContent, 'log');

      // Also export JSON logs to server
      const jsonContent = await logManager.exportLogsAsJSON();
      await this.saveLogToServer(sessionId, jsonContent, 'json');

      console.log(`📁 Logs saved to server: ${sessionId}`);
      console.log(`👁️  Visual state scan completed and added to logs`);
      this.updateStatus(`📁 Log files saved with visual state scan`);
    } catch (error) {
      console.error('Failed to save logs to server:', error);
      this.updateStatus('❌ Failed to save logs to server');
    }
  }

  private async saveLogToServer(sessionId: string, content: string, type: 'log' | 'json'): Promise<void> {
    const response = await fetch('http://localhost:3001/api/save-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        content,
        type
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Server response: ${result.message}`);
  }

  /**
   * Clean up any orphaned sprites that might be lingering in the scene
   * This prevents sprite accumulation over multiple cascades
   */
  private cleanupOrphanedSprites(): void {
    // Get all sprites in the game area
    const gameObjects = this.children.list;

    gameObjects.forEach((obj: any) => {
      if (obj instanceof Phaser.GameObjects.Sprite) {
        const sprite = obj as Phaser.GameObjects.Sprite;

        // Check if this sprite is in our tile area
        const isInTileArea =
          sprite.x >= this.BOARD_OFFSET_X &&
          sprite.x <= this.BOARD_OFFSET_X + 8 * this.TILE_SIZE &&
          sprite.y >= this.BOARD_OFFSET_Y &&
          sprite.y <= this.BOARD_OFFSET_Y + 8 * this.TILE_SIZE;

        if (isInTileArea) {
          // Check if this sprite is properly tracked in our array
          let isTracked = false;

          for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
              if (this.tileSprites[row]?.[col] === sprite) {
                isTracked = true;
                break;
              }
            }
            if (isTracked) break;
          }

          // If not tracked, it's an orphaned sprite
          if (!isTracked) {
            const cleanupMsg = `🧹 Cleaning up orphaned sprite at (${sprite.x}, ${sprite.y})`;
            console.warn(cleanupMsg);

            // Log to file logger as well
            logManager.logDebug('Orphaned sprite cleanup', {
              position: { x: sprite.x, y: sprite.y },
              message: cleanupMsg
            });

            sprite.destroy();
          }
        }
      }
    });
  }

  /**
   * Scan the actual visual state of the game board
   * Returns what is actually displayed on screen vs what should be displayed
   */
  private scanVisualState(): any {
    const boardState = this.boardManager.getBoard();
    const visualState = {
      timestamp: new Date().toISOString(),
      logicalBoard: this.formatBoardForLog(boardState),
      visualSprites: this.scanVisualSprites(),
      spriteMismatch: [] as any[],
      summary: {
        totalLogicalTiles: 0,
        totalVisualSprites: 0,
        mismatches: 0,
        orphanedSprites: 0
      }
    };

    // Count logical tiles
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const logicalTile = boardState[row]?.[col];
        if (logicalTile !== undefined && logicalTile >= 0) {
          visualState.summary.totalLogicalTiles++;
        }
      }
    }

    // Compare logical vs visual
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const logicalTile = boardState[row]?.[col];
        const visualSprite = visualState.visualSprites.grid[row]?.[col];

        if (logicalTile !== undefined && logicalTile >= 0) {
          // Should have a sprite here
          if (!visualSprite || visualSprite.tileType !== logicalTile) {
            visualState.spriteMismatch.push({
              position: { row, col },
              expected: this.getTileSymbol(logicalTile),
              actual: visualSprite ? this.getTileSymbol(visualSprite.tileType) : '❌ MISSING',
              issue: visualSprite ? 'WRONG_TYPE' : 'MISSING_SPRITE'
            });
            visualState.summary.mismatches++;
          }
        } else {
          // Should NOT have a sprite here
          if (visualSprite) {
            visualState.spriteMismatch.push({
              position: { row, col },
              expected: '⚫ EMPTY',
              actual: this.getTileSymbol(visualSprite.tileType),
              issue: 'UNEXPECTED_SPRITE'
            });
            visualState.summary.mismatches++;
          }
        }
      }
    }

    visualState.summary.totalVisualSprites = visualState.visualSprites.totalSprites;
    visualState.summary.orphanedSprites = visualState.visualSprites.orphanedSprites.length;

    return visualState;
  }

  /**
   * Scan all visual sprites currently on screen
   */
  private scanVisualSprites(): any {
    const result = {
      grid: Array(8).fill(null).map(() => Array(8).fill(null)),
      orphanedSprites: [] as any[],
      totalSprites: 0
    };

    // Check sprite array
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const sprite = this.tileSprites[row]?.[col];
        if (sprite && (sprite as any).active !== false) {
          result.grid[row]![col] = {
            x: sprite.x,
            y: sprite.y,
            tileType: sprite.getData('tileType'),
            alpha: (sprite as any).alpha || 1,
            visible: (sprite as any).visible !== false
          };
          result.totalSprites++;
        }
      }
    }

    // Check for orphaned sprites in scene
    const gameObjects = this.children.list;
    gameObjects.forEach((obj: any) => {
      if (obj instanceof Phaser.GameObjects.Sprite) {
        const sprite = obj as Phaser.GameObjects.Sprite;

        // Check if this sprite is in our tile area
        const isInTileArea =
          sprite.x >= this.BOARD_OFFSET_X &&
          sprite.x <= this.BOARD_OFFSET_X + 8 * this.TILE_SIZE &&
          sprite.y >= this.BOARD_OFFSET_Y &&
          sprite.y <= this.BOARD_OFFSET_Y + 8 * this.TILE_SIZE;

        if (isInTileArea) {
          // Check if this sprite is properly tracked in our array
          let isTracked = false;
          for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
              if (this.tileSprites[row]?.[col] === sprite) {
                isTracked = true;
                break;
              }
            }
            if (isTracked) break;
          }

          if (!isTracked) {
            result.orphanedSprites.push({
              x: sprite.x,
              y: sprite.y,
              alpha: (sprite as any).alpha || 1,
              visible: (sprite as any).visible !== false,
              tileType: sprite.getData('tileType') || 'UNKNOWN'
            });
          }
        }
      }
    });

    return result;
  }

  /**
   * Format board state for logging (same as file logger)
   */
  private formatBoardForLog(board: any[][]): string {
    let result = '   0 1 2 3 4 5 6 7\n';
    board.forEach((row, rowIndex) => {
      const rowStr = row.map(tile => this.getTileSymbol(tile)).join(' ');
      result += `${rowIndex}: ${rowStr}\n`;
    });
    return result;
  }

  /**
   * Get tile symbol for logging
   */
  private getTileSymbol(tileType: any): string {
    const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣'];
    if (tileType === undefined) return '❓';
    if (tileType < 0) return '⚫'; // Empty
    return symbols[tileType] || '❓';
  }

}