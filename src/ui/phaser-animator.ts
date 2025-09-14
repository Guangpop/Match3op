/**
 * Phaser Animator - Hardware-accelerated animations for Match-3 game
 * Handles tile swapping, cascading, particles, and visual effects
 */

// Phaser is loaded globally from CDN in HTML
import { Position, TileType } from '../core/board.js';
import { LogManager } from '../core/log-manager.js';

export class PhaserAnimator {
  private scene: Phaser.Scene;
  private logManager: LogManager;
  private readonly TILE_SIZE = 64;
  private readonly BOARD_OFFSET_X = 100;
  private readonly BOARD_OFFSET_Y = 150;

  constructor(scene: Phaser.Scene, logManager: LogManager) {
    this.scene = scene;
    this.logManager = logManager;
  }

  /**
   * Animate a valid tile swap with smooth tweening
   */
  async animateSwap(sprite1: Phaser.GameObjects.Sprite, sprite2: Phaser.GameObjects.Sprite, tileSprites: Phaser.GameObjects.Sprite[][]): Promise<void> {
    return new Promise((resolve) => {
      const pos1 = { x: sprite1.x, y: sprite1.y };
      const pos2 = { x: sprite2.x, y: sprite2.y };

      // Create swap animation timeline
      const timeline = this.scene.add.timeline([
        {
          at: 0,
          tween: {
            targets: sprite1,
            x: pos2.x,
            y: pos2.y,
            duration: 300,
            ease: 'Back.easeOut'
          }
        },
        {
          at: 0,
          tween: {
            targets: sprite2,
            x: pos1.x,
            y: pos1.y,
            duration: 300,
            ease: 'Back.easeOut'
          }
        }
      ]);

      timeline.on('complete', () => {
        // Update sprite data after swap
        const tempRow = sprite1.getData('row');
        const tempCol = sprite1.getData('col');
        const tempType = sprite1.getData('tileType');

        const sprite2Row = sprite2.getData('row');
        const sprite2Col = sprite2.getData('col');
        const sprite2Type = sprite2.getData('tileType');

        sprite1.setData('row', sprite2Row);
        sprite1.setData('col', sprite2Col);
        sprite1.setData('tileType', sprite2Type);

        sprite2.setData('row', tempRow);
        sprite2.setData('col', tempCol);
        sprite2.setData('tileType', tempType);

        // Swap sprites in the array
        tileSprites[tempRow]![tempCol] = sprite2;
        tileSprites[sprite2Row]![sprite2Col] = sprite1;

        resolve();
      });

      timeline.play();
    });
  }

  /**
   * Animate an invalid swap with shake effect and return to original position
   */
  async animateInvalidSwap(sprite1: Phaser.GameObjects.Sprite, sprite2: Phaser.GameObjects.Sprite): Promise<void> {
    return new Promise((resolve) => {
      const pos1 = { x: sprite1.x, y: sprite1.y };
      const pos2 = { x: sprite2.x, y: sprite2.y };

      // Move towards each other slightly
      const midX1 = pos1.x + (pos2.x - pos1.x) * 0.3;
      const midY1 = pos1.y + (pos2.y - pos1.y) * 0.3;
      const midX2 = pos2.x + (pos1.x - pos2.x) * 0.3;
      const midY2 = pos2.y + (pos1.y - pos2.y) * 0.3;

      const timeline = this.scene.add.timeline([
        // Move towards each other
        {
          at: 0,
          tween: {
            targets: sprite1,
            x: midX1,
            y: midY1,
            duration: 150,
            ease: 'Quad.easeOut'
          }
        },
        {
          at: 0,
          tween: {
            targets: sprite2,
            x: midX2,
            y: midY2,
            duration: 150,
            ease: 'Quad.easeOut'
          }
        },
        // Shake effect
        {
          at: 150,
          tween: {
            targets: [sprite1, sprite2],
            x: '+=5',
            duration: 50,
            ease: 'Quad.easeInOut',
            yoyo: true,
            repeat: 3
          }
        },
        // Return to original positions
        {
          at: 350,
          tween: {
            targets: sprite1,
            x: pos1.x,
            y: pos1.y,
            duration: 200,
            ease: 'Back.easeIn'
          }
        },
        {
          at: 350,
          tween: {
            targets: sprite2,
            x: pos2.x,
            y: pos2.y,
            duration: 200,
            ease: 'Back.easeIn'
          }
        }
      ]);

      timeline.on('complete', resolve);
      timeline.play();
    });
  }

  /**
   * Animate tile clearing with particle effects
   */
  async animateTileClearing(positions: Position[], tileSprites: Phaser.GameObjects.Sprite[][]): Promise<void> {
    return new Promise((resolve) => {
      const spritesToAnimate: Phaser.GameObjects.Sprite[] = [];
      const particleEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

      // Create temporary animation sprites and immediately destroy originals
      positions.forEach(pos => {
        const originalSprite = tileSprites[pos.row]?.[pos.col];
        if (originalSprite) {
          // Get sprite properties before destroying
          const x = originalSprite.x;
          const y = originalSprite.y;
          const tileType = originalSprite.getData('tileType');

          // IMMEDIATELY destroy original sprite and clear from array
          originalSprite.destroy();
          tileSprites[pos.row]![pos.col] = null as any;

          // Create temporary sprite for animation only
          const tempSprite = this.scene.add.sprite(x, y, `tile_${tileType}`)
            .setAlpha(1)
            .setScale(1);

          spritesToAnimate.push(tempSprite);

          // Create particle burst
          const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.3, end: 0 },
            tint: this.getTileColor(tileType),
            lifespan: 600,
            quantity: 8,
            blendMode: 'ADD'
          });

          particleEmitters.push(particles);
        }
      });

      // Animate tiles disappearing
      this.scene.tweens.add({
        targets: spritesToAnimate,
        alpha: 0,
        scale: 1.5,
        rotation: Math.PI / 4,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => {
          // Clean up particle emitters
          particleEmitters.forEach(emitter => emitter.destroy());

          // Destroy the temporary animation sprites
          spritesToAnimate.forEach(sprite => sprite.destroy());

          resolve();
        }
      });
    });
  }

  /**
   * Animate tiles falling due to gravity
   */
  async animateFallingTiles(movements: Map<string, Position>, tileSprites: Phaser.GameObjects.Sprite[][]): Promise<void> {
    if (movements.size === 0) return Promise.resolve();

    // Log detailed falling animation start
    this.logFallingAnimationStart(movements, tileSprites);

    // Pre-collect sprite references and clear original positions
    const spriteMovements = new Map<string, { sprite: Phaser.GameObjects.Sprite, newPos: Position }>();
    movements.forEach((newPos, oldPosKey) => {
      const [oldRow, oldCol] = oldPosKey.split(',').map(Number) as [number, number];
      const sprite = tileSprites[oldRow!]?.[oldCol!];

      if (sprite) {
        spriteMovements.set(oldPosKey, { sprite, newPos });
        // Clear the original position to prevent duplicates
        tileSprites[oldRow!]![oldCol!] = null as any;
      }
    });

    return new Promise((resolve) => {
      const animationsToComplete = spriteMovements.size;
      let completedAnimations = 0;
      const completionLog: any[] = [];

      spriteMovements.forEach(({ sprite, newPos }, oldPosKey) => {
        const [oldRow, oldCol] = oldPosKey.split(',').map(Number) as [number, number];

        if (sprite) {
          const newX = this.BOARD_OFFSET_X + newPos.col * this.TILE_SIZE + this.TILE_SIZE / 2;
          const newY = this.BOARD_OFFSET_Y + newPos.row * this.TILE_SIZE + this.TILE_SIZE / 2;

          // Calculate distance for duration scaling
          const distance = Math.abs(newPos.row - oldRow!);
          const duration = Math.min(400 + distance * 50, 800);

          this.scene.tweens.add({
            targets: sprite,
            x: newX,
            y: newY,
            duration: duration,
            ease: 'Bounce.easeOut',
            onComplete: () => {
              const startTime = Date.now();

              // Update sprite data
              sprite.setData('row', newPos.row);
              sprite.setData('col', newPos.col);

              // Original position was already cleared during pre-processing
              // Check if target position is empty before setting
              const targetSprite = tileSprites[newPos.row]![newPos.col];
              let animationResult = 'SUCCESS';
              let issue = '';

              if (targetSprite === null || targetSprite === undefined) {
                tileSprites[newPos.row]![newPos.col] = sprite;
              } else {
                // Target position already occupied
                animationResult = 'DUPLICATE_DETECTED';
                issue = `Target (${newPos.row},${newPos.col}) already occupied by sprite`;

                const warningMsg = `🚨 Duplicate sprite detected at (${newPos.row},${newPos.col}), destroying duplicate`;
                console.warn(warningMsg);

                // Log to file logger as well
                this.logManager.logDebug('Duplicate sprite in falling animation', {
                  targetPosition: { row: newPos.row, col: newPos.col },
                  originalPosition: { row: oldRow!, col: oldCol! },
                  message: warningMsg
                });

                sprite.destroy();
              }

              // Log completion details
              completionLog.push({
                spriteId: sprite.getData('id') || `sprite_${oldRow}_${oldCol}`,
                from: { row: oldRow!, col: oldCol! },
                to: { row: newPos.row, col: newPos.col },
                tileType: sprite.getData('tileType'),
                oldSpriteWas: 'PRE_CLEARED', // Original position was cleared during pre-processing
                targetWas: targetSprite ? 'OCCUPIED' : 'EMPTY',
                result: animationResult,
                issue: issue,
                completionOrder: completedAnimations + 1,
                completionTime: startTime
              });

              completedAnimations++;
              if (completedAnimations === animationsToComplete) {
                // Log completion summary
                this.logFallingAnimationComplete(completionLog);
                resolve();
              }
            }
          });
        } else {
          completedAnimations++;
          if (completedAnimations === animationsToComplete) {
            resolve();
          }
        }
      });
    });
  }

  /**
   * Animate new tiles spawning from above
   */
  async animateSpawningTiles(tileSprites: Phaser.GameObjects.Sprite[][], boardState: TileType[][]): Promise<void> {
    return new Promise((resolve) => {
      const spawnPromises: Promise<void>[] = [];

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const currentSprite = tileSprites[row]?.[col];
          const expectedType = boardState[row]?.[col];

          // Only create sprite if we have a valid tile type
          if (expectedType !== undefined && expectedType >= 0) {
            // If sprite doesn't exist or type changed, create new one
            if (!currentSprite || currentSprite.getData('tileType') !== expectedType) {
              if (currentSprite) {
                currentSprite.destroy();
              }

              const newSprite = this.createNewTileSprite(row, col, expectedType);
              tileSprites[row]![col] = newSprite;

              // Animate spawn
              const spawnPromise = this.animateTileSpawn(newSprite, row);
              spawnPromises.push(spawnPromise);
            }
          } else {
            // No valid tile, remove sprite if it exists
            if (currentSprite) {
              currentSprite.destroy();
              tileSprites[row]![col] = null as any;
            }
          }
        }
      }

      if (spawnPromises.length === 0) {
        resolve();
      } else {
        Promise.all(spawnPromises).then(() => resolve());
      }
    });
  }

  /**
   * Create a new tile sprite with proper positioning and data
   */
  private createNewTileSprite(row: number, col: number, tileType: TileType): Phaser.GameObjects.Sprite {
    const x = this.BOARD_OFFSET_X + col * this.TILE_SIZE + this.TILE_SIZE / 2;
    const y = this.BOARD_OFFSET_Y + row * this.TILE_SIZE + this.TILE_SIZE / 2;

    const sprite = this.scene.add.sprite(x, y, `tile_${tileType}`)
      .setInteractive({ useHandCursor: true })
      .setData('row', row)
      .setData('col', col)
      .setData('tileType', tileType);

    // Add hover effects
    sprite.on('pointerover', () => sprite.setTint(0xCCCCCC));
    sprite.on('pointerout', () => sprite.clearTint());

    return sprite;
  }

  /**
   * Animate individual tile spawn with drop effect
   */
  private async animateTileSpawn(sprite: Phaser.GameObjects.Sprite, targetRow: number): Promise<void> {
    return new Promise((resolve) => {
      // Start above the board
      const startY = this.BOARD_OFFSET_Y - this.TILE_SIZE * 2;
      const endY = this.BOARD_OFFSET_Y + targetRow * this.TILE_SIZE + this.TILE_SIZE / 2;

      sprite.setY(startY);
      sprite.setAlpha(0.8);

      this.scene.tweens.add({
        targets: sprite,
        y: endY,
        alpha: 1,
        duration: 400 + targetRow * 50, // Stagger based on row
        ease: 'Bounce.easeOut',
        onComplete: () => resolve()
      });
    });
  }

  /**
   * Highlight hint tiles with pulsing animation
   */
  highlightHintTiles(sprites: Phaser.GameObjects.Sprite[]): void {
    sprites.forEach(sprite => {
      this.scene.tweens.add({
        targets: sprite,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          sprite.setScale(1);
        }
      });

      // Add glowing tint
      this.scene.tweens.add({
        targets: sprite,
        tint: 0xFFD700,
        duration: 500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          sprite.clearTint();
        }
      });
    });
  }

  /**
   * Get color value for tile type (for particles)
   */
  private getTileColor(tileType: TileType): number {
    const colors = [
      0xFF6B6B, // Red
      0x4ECDC4, // Cyan
      0x45B7D1, // Blue
      0xF7DC6F, // Yellow
      0xBB8FCE  // Purple
    ];
    return colors[tileType] || 0xFFFFFF;
  }

  /**
   * Check if any animations are currently running
   */
  isAnimating(): boolean {
    return this.scene.tweens.getTweensOf(this.scene.children.getAll()).length > 0;
  }

  /**
   * Stop all running animations
   */
  stopAllAnimations(): void {
    this.scene.tweens.killAll();
  }

  /**
   * Log detailed falling animation start information
   */
  private logFallingAnimationStart(movements: Map<string, Position>, tileSprites: Phaser.GameObjects.Sprite[][]): void {
    const animationData = {
      timestamp: new Date().toISOString(),
      totalMovements: movements.size,
      movements: [] as any[],
      spriteArrayState: this.getSpriteArraySnapshot(tileSprites),
      potentialIssues: [] as string[]
    };

    // Analyze each movement
    movements.forEach((newPos, oldPosKey) => {
      const [oldRow, oldCol] = oldPosKey.split(',').map(Number) as [number, number];
      const sprite = tileSprites[oldRow!]?.[oldCol!];

      const movement = {
        from: { row: oldRow!, col: oldCol! },
        to: { row: newPos.row, col: newPos.col },
        distance: Math.abs(newPos.row - oldRow!),
        spriteExists: !!sprite,
        spriteType: sprite ? sprite.getData('tileType') : null,
        spritePosition: sprite ? { x: sprite.x, y: sprite.y } : null,
        targetCurrentlyOccupied: !!tileSprites[newPos.row]?.[newPos.col]
      };

      // Check for potential issues
      if (!sprite) {
        animationData.potentialIssues.push(`Missing sprite at source ${oldRow},${oldCol}`);
      }

      if (movement.targetCurrentlyOccupied) {
        animationData.potentialIssues.push(`Target ${newPos.row},${newPos.col} already occupied`);
      }

      if (movement.distance === 0) {
        animationData.potentialIssues.push(`Zero distance movement: ${oldRow},${oldCol}`);
      }

      animationData.movements.push(movement);
    });

    // Log to file logger
    this.logManager.logDebug('FALLING ANIMATION START - Detailed movement analysis', animationData);

    console.log('🎬 Falling animation start:', animationData);
  }

  /**
   * Log detailed falling animation completion information
   */
  private logFallingAnimationComplete(completionLog: any[]): void {
    const completionData = {
      timestamp: new Date().toISOString(),
      totalCompletions: completionLog.length,
      successfulAnimations: completionLog.filter(c => c.result === 'SUCCESS').length,
      duplicateDetections: completionLog.filter(c => c.result === 'DUPLICATE_DETECTED').length,
      completionOrder: completionLog.sort((a, b) => a.completionOrder - b.completionOrder),
      issues: completionLog.filter(c => c.issue).map(c => c.issue),
      summary: {
        allSuccessful: completionLog.every(c => c.result === 'SUCCESS'),
        hasDuplicates: completionLog.some(c => c.result === 'DUPLICATE_DETECTED'),
        hasIssues: completionLog.some(c => c.issue)
      }
    };

    // Analyze completion patterns
    const timeSpread = {
      first: Math.min(...completionLog.map(c => c.completionTime)),
      last: Math.max(...completionLog.map(c => c.completionTime)),
      spread: Math.max(...completionLog.map(c => c.completionTime)) - Math.min(...completionLog.map(c => c.completionTime))
    };

    completionData.summary = { ...completionData.summary, ...timeSpread };

    // Log to file logger
    this.logManager.logDebug('FALLING ANIMATION COMPLETE - Detailed completion analysis', completionData);

    console.log('🏁 Falling animation complete:', completionData);
  }

  /**
   * Get a snapshot of current sprite array state
   */
  private getSpriteArraySnapshot(tileSprites: Phaser.GameObjects.Sprite[][]): any {
    const snapshot = {
      totalSprites: 0,
      grid: [] as any[],
      emptyCells: 0,
      nullCells: 0
    };

    for (let row = 0; row < 8; row++) {
      const rowData = [];
      for (let col = 0; col < 8; col++) {
        const sprite = tileSprites[row]?.[col];

        if (sprite === null) {
          rowData.push(null);
          snapshot.nullCells++;
        } else if (sprite === undefined) {
          rowData.push(undefined);
          snapshot.emptyCells++;
        } else {
          rowData.push({
            type: sprite.getData('tileType'),
            x: sprite.x,
            y: sprite.y,
            alpha: (sprite as any).alpha || 1
          });
          snapshot.totalSprites++;
        }
      }
      snapshot.grid.push(rowData);
    }

    return snapshot;
  }
}