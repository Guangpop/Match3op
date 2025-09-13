/**
 * Test for gravity and refill fixes
 * Verifies that tiles fall correctly and empty spaces are properly filled
 */

import { BoardManager, TileType, Position } from '../src/core/board.js';

describe('Gravity and Refill Fix', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should properly apply gravity after clearing tiles', () => {
    // Manually set up a board state
    const board = boardManager.getBoard();
    
    // Clear some tiles to create gaps
    const clearPositions: Position[] = [
      { row: 5, col: 0 }, // Bottom area
      { row: 6, col: 0 },
      { row: 4, col: 2 }, // Middle area
      { row: 5, col: 2 },
      { row: 3, col: 4 }, // Top area
    ];
    
    // Save original board state for logging
    const originalBoard = board.map(row => [...row]);
    console.log('🎮 Original board before clearing:');
    printBoard(originalBoard);
    
    // Clear tiles
    boardManager.clearTiles(clearPositions);
    console.log('🗑️ Board after clearing tiles:');
    printBoard(boardManager.getBoard());
    
    // Apply gravity
    const movements = boardManager.applyGravity();
    console.log('⬇️ Board after applying gravity:');
    printBoard(boardManager.getBoard());
    console.log(`📊 Tile movements: ${movements.size}`);
    
    // Check that no gaps exist in the middle of columns
    const boardAfterGravity = boardManager.getBoard();
    for (let col = 0; col < 8; col++) {
      let foundEmpty = false;
      for (let row = 7; row >= 0; row--) {
        const tile = boardAfterGravity[row]![col]!;
        if (tile < 0) {
          foundEmpty = true;
        } else if (foundEmpty) {
          // Found a non-empty tile above an empty tile - this shouldn't happen
          fail(`Column ${col}: Found non-empty tile at row ${row} above empty tile`);
        }
      }
    }
    
    console.log('✅ Gravity applied correctly - no floating tiles');
  });

  test('should properly refill board after gravity', () => {
    // Clear some tiles
    const clearPositions: Position[] = [
      { row: 6, col: 1 },
      { row: 7, col: 1 },
      { row: 5, col: 3 },
      { row: 6, col: 3 },
      { row: 7, col: 3 },
    ];
    
    boardManager.clearTiles(clearPositions);
    boardManager.applyGravity();
    
    console.log('🌊 Board before refill:');
    printBoard(boardManager.getBoard());
    
    // Refill board
    boardManager.refillBoard();
    
    console.log('🎲 Board after refill:');
    printBoard(boardManager.getBoard());
    
    // Check that no empty spaces remain
    const board = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const tile = board[row]![col]!;
        expect(tile).toBeGreaterThanOrEqual(0);
        expect(tile).toBeLessThan(5); // Valid tile type
      }
    }
    
    console.log('✅ Board completely filled with valid tiles');
  });

  test('should handle complete column clearing correctly', () => {
    // Clear an entire column
    const clearPositions: Position[] = [];
    for (let row = 0; row < 8; row++) {
      clearPositions.push({ row, col: 2 });
    }
    
    console.log('🎮 Clearing entire column 2');
    boardManager.clearTiles(clearPositions);
    boardManager.applyGravity();
    
    console.log('⬇️ After gravity (column should be empty):');
    printBoard(boardManager.getBoard());
    
    // Refill
    boardManager.refillBoard();
    
    console.log('🎲 After refill (column should be filled):');
    printBoard(boardManager.getBoard());
    
    // Check column 2 is completely filled
    const board = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = board[row]![2]!;
      expect(tile).toBeGreaterThanOrEqual(0);
      expect(tile).toBeLessThan(5);
    }
    
    console.log('✅ Entire column properly refilled');
  });

  test('should track falling tile movements correctly', () => {
    // Create a specific pattern where we can predict movements
    const board = boardManager.getBoard();
    
    // Set up a known pattern in column 0
    for (let row = 0; row < 8; row++) {
      board[row]![0] = row % 2; // Alternating pattern
    }
    
    // Clear middle tiles
    const clearPositions: Position[] = [
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 5, col: 0 },
    ];
    
    console.log('🎮 Pattern before clearing:');
    printBoard(boardManager.getBoard());
    
    boardManager.clearTiles(clearPositions);
    const movements = boardManager.applyGravity();
    
    console.log('📊 Tracked movements:');
    movements.forEach((toPos, fromKey) => {
      const [fromRow, fromCol] = fromKey.split(',').map(Number);
      console.log(`  ${fromRow},${fromCol} → ${toPos.row},${toPos.col}`);
    });
    
    console.log('⬇️ After gravity:');
    printBoard(boardManager.getBoard());
    
    // Should have tracked movements for tiles that fell
    expect(movements.size).toBeGreaterThan(0);
    
    console.log('✅ Movements tracked correctly');
  });
});

function printBoard(board: TileType[][]): void {
  const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣', '⚫']; // Red, Blue, Yellow, Green, Purple, Empty
  
  console.log('   0 1 2 3 4 5 6 7');
  board.forEach((row, rowIndex) => {
    const rowStr = row.map(tile => tile < 0 ? '⚫' : symbols[tile] || '❓').join(' ');
    console.log(`${rowIndex}: ${rowStr}`);
  });
  console.log('');
}