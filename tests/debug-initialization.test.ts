/**
 * Debug initialization to check if board starts with matches
 */

import { BoardManager } from '../src/core/board.js';
import { MatchEngine } from '../src/core/match.js';

describe('Debug Board Initialization', () => {
  test('should verify that initialized board has no matches', () => {
    const boardManager = new BoardManager();
    const matchEngine = new MatchEngine();

    const boardState = boardManager.getBoard();

    console.log('📋 Initial Board State:');
    for (let row = 0; row < 8; row++) {
      console.log(`Row ${row}: [${boardState[row]!.join(', ')}]`);
    }

    // Check for matches
    const matchResult = matchEngine.findMatches(boardState);

    console.log('\n🔍 Match Detection Results:');
    console.log(`Found ${matchResult.matches.length} match groups`);
    console.log(`Total positions to clear: ${matchResult.clearedPositions.length}`);

    if (matchResult.matches.length > 0) {
      console.log('\n❌ FOUND INITIAL MATCHES:');
      matchResult.matches.forEach((match, index) => {
        console.log(`  Match ${index + 1}:`, match.positions);
      });
    }

    // Board should start with NO matches
    expect(matchResult.matches.length).toBe(0);
    expect(matchResult.clearedPositions.length).toBe(0);
  });

  test('should test multiple board initializations for consistency', () => {
    const matchEngine = new MatchEngine();
    let boardsWithMatches = 0;
    let totalMatches = 0;

    for (let i = 0; i < 10; i++) {
      const boardManager = new BoardManager();
      const boardState = boardManager.getBoard();
      const matchResult = matchEngine.findMatches(boardState);

      if (matchResult.matches.length > 0) {
        boardsWithMatches++;
        totalMatches += matchResult.matches.length;
        console.log(`\n❌ Board ${i + 1} has ${matchResult.matches.length} initial matches`);
      }
    }

    console.log(`\n📊 Summary of 10 board initializations:`);
    console.log(`Boards with matches: ${boardsWithMatches}/10`);
    console.log(`Total matches found: ${totalMatches}`);

    // No boards should have initial matches
    expect(boardsWithMatches).toBe(0);
  });
});