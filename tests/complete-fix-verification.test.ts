/**
 * Complete Fix Verification Test
 * Tests both the missing tile fix and logging functionality
 */

import { BoardManager, TileType, Position } from '../src/core/board.js';

describe('Complete Match-3 Fix Verification', () => {
  let boardManager: BoardManager;

  beforeEach(() => {
    boardManager = new BoardManager();
  });

  test('should completely fill board after clearing and refilling', () => {
    console.log('🎮 Testing complete board refill...');
    
    // Clear multiple random positions to simulate real game scenario
    const clearPositions: Position[] = [
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
      { row: 1, col: 3 }, { row: 1, col: 4 },
      { row: 2, col: 2 }, { row: 2, col: 5 }, { row: 2, col: 6 },
      { row: 3, col: 1 }, { row: 3, col: 7 },
      { row: 7, col: 0 }, { row: 7, col: 7 },
    ];

    console.log('🗑️ Clearing tiles at positions:', clearPositions.map(p => `(${p.row},${p.col})`).join(', '));
    
    // Clear tiles
    boardManager.clearTiles(clearPositions);
    
    // Apply gravity
    console.log('⬇️ Applying gravity...');
    const movements = boardManager.applyGravity();
    console.log(`📊 Gravity movements: ${movements.size}`);
    
    // Refill board
    console.log('🎲 Refilling board...');
    boardManager.refillBoard();
    
    // Verify no empty spaces remain
    const board = boardManager.getBoard();
    let emptyCount = 0;
    let invalidCount = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const tile = board[row]![col]!;
        if (tile === undefined || tile < 0) {
          emptyCount++;
          console.error(`❌ Empty tile found at (${row},${col}): ${tile}`);
        }
        if (tile < 0 || tile >= 5) {
          invalidCount++;
          console.error(`❌ Invalid tile type at (${row},${col}): ${tile}`);
        }
      }
    }
    
    console.log(`📋 Final board verification:`);
    console.log(`   Empty tiles: ${emptyCount}`);
    console.log(`   Invalid tiles: ${invalidCount}`);
    
    // Print final board
    printBoard(board);
    
    expect(emptyCount).toBe(0);
    expect(invalidCount).toBe(0);
    
    console.log('✅ Board completely filled with valid tiles!');
  });

  test('should handle multiple cascading clears correctly', () => {
    console.log('🌊 Testing multiple cascade scenario...');
    
    // Create a scenario with multiple potential cascades
    const clearSets = [
      [{ row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }],
      [{ row: 7, col: 3 }, { row: 7, col: 4 }],
      [{ row: 5, col: 5 }, { row: 6, col: 5 }, { row: 7, col: 5 }],
    ];

    for (let cascade = 0; cascade < clearSets.length; cascade++) {
      console.log(`🌊 Cascade ${cascade + 1}:`);
      
      const positions = clearSets[cascade]!;
      console.log(`   Clearing: ${positions.map(p => `(${p.row},${p.col})`).join(', ')}`);
      
      // Clear tiles
      boardManager.clearTiles(positions);
      
      // Apply gravity
      const movements = boardManager.applyGravity();
      console.log(`   Gravity movements: ${movements.size}`);
      
      // Refill
      boardManager.refillBoard();
      
      // Verify board state
      const board = boardManager.getBoard();
      let emptyCount = 0;
      
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const tile = board[row]![col]!;
          if (tile === undefined || tile < 0) {
            emptyCount++;
          }
        }
      }
      
      console.log(`   Empty tiles after cascade ${cascade + 1}: ${emptyCount}`);
      expect(emptyCount).toBe(0);
    }
    
    console.log('✅ All cascades handled correctly!');
  });

  test('should track movements correctly for animation', () => {
    console.log('📊 Testing movement tracking...');
    
    // Create a specific pattern to test movement tracking
    const board = boardManager.getBoard();
    
    // Manually set tiles to create predictable movements
    for (let row = 0; row < 8; row++) {
      board[row]![0] = row % 2; // Alternating pattern in column 0
    }
    
    // Clear bottom half of column 0
    const clearPositions = [
      { row: 4, col: 0 }, { row: 5, col: 0 }, 
      { row: 6, col: 0 }, { row: 7, col: 0 }
    ];
    
    console.log('🗑️ Clearing bottom half of column 0');
    printColumn(board, 0, 'Before clearing');
    
    boardManager.clearTiles(clearPositions);
    printColumn(boardManager.getBoard(), 0, 'After clearing');
    
    // Apply gravity and track movements
    const movements = boardManager.applyGravity();
    printColumn(boardManager.getBoard(), 0, 'After gravity');
    
    console.log('📊 Movement tracking results:');
    movements.forEach((toPos, fromKey) => {
      const [fromRow, fromCol] = fromKey.split(',').map(Number);
      console.log(`   (${fromRow},${fromCol}) → (${toPos.row},${toPos.col})`);
    });
    
    // Should have tracked movements for the top 4 tiles
    expect(movements.size).toBeGreaterThan(0);
    expect(movements.size).toBeLessThanOrEqual(4);
    
    console.log('✅ Movement tracking working correctly!');
  });

  test('should handle edge case: complete column clearing', () => {
    console.log('🎯 Testing complete column clearing...');
    
    // Clear entire middle column
    const clearPositions: Position[] = [];
    for (let row = 0; row < 8; row++) {
      clearPositions.push({ row, col: 4 });
    }
    
    console.log('🗑️ Clearing entire column 4');
    boardManager.clearTiles(clearPositions);
    
    // Apply gravity (should do nothing since column is empty)
    const movements = boardManager.applyGravity();
    console.log(`📊 Movements for empty column: ${movements.size}`);
    
    // Refill should fill entire column
    boardManager.refillBoard();
    
    // Verify column 4 is completely filled
    const board = boardManager.getBoard();
    for (let row = 0; row < 8; row++) {
      const tile = board[row]![4]!;
      expect(tile).toBeGreaterThanOrEqual(0);
      expect(tile).toBeLessThan(5);
    }
    
    printColumn(board, 4, 'After complete refill');
    console.log('✅ Complete column clearing handled correctly!');
  });
});

function printBoard(board: TileType[][]): void {
  const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣']; // Red, Blue, Yellow, Green, Purple
  
  console.log('   0 1 2 3 4 5 6 7');
  board.forEach((row, rowIndex) => {
    const rowStr = row.map(tile => {
      if (tile === undefined) return '❓';
      if (tile < 0) return '⚫'; // Empty
      return symbols[tile] || '❓';
    }).join(' ');
    console.log(`${rowIndex}: ${rowStr}`);
  });
  console.log('');
}

function printColumn(board: TileType[][], col: number, title: string): void {
  const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣'];
  console.log(`📋 ${title} - Column ${col}:`);
  
  for (let row = 0; row < 8; row++) {
    const tile = board[row]![col]!;
    const symbol = tile < 0 ? '⚫' : (symbols[tile] || '❓');
    console.log(`   Row ${row}: ${symbol} (${tile})`);
  }
  console.log('');
}