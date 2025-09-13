/**
 * Debug test to understand what's happening with gravity
 */

import { BoardManager } from '../src/core/board';

describe('Debug Gravity', () => {
  test('debug gravity step by step', () => {
    const board = new BoardManager();
    
    // Create simple test case
    const testBoard = [
      [0, 1, 2, 3, 4, 0, 1, 2],
      [1, -1, 3, 4, 0, 1, 2, 3],  // Empty in column 1
      [2, 3, 4, 0, 1, 2, 3, 4],
      [3, 4, 0, 1, 2, 3, 4, 0],
      [4, 0, 1, 2, 3, 4, 0, 1],
      [0, 1, 2, 3, 4, 0, 1, 2],
      [1, 2, 3, 4, 0, 1, 2, 3],
      [2, 3, 4, 0, 1, 2, 3, 4]
    ];
    
    console.log('Original board column 1:', testBoard.map(row => row[1]));
    
    (board as any).board = testBoard.map(row => [...row]);
    
    // Apply gravity
    const movements = board.applyGravity();
    
    const finalBoard = board.getBoard();
    console.log('After gravity column 1:', finalBoard.map(row => row[1]));
    console.log('Movements:', Array.from(movements.entries()));
    
    // Let's see what happened
    expect(finalBoard[7]![1]).not.toBe(-1); // Should not be empty
  });
});