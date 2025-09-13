/**
 * Game Logger - Records player moves, board states, and cascading effects
 * Helps with debugging and analyzing game behavior
 */

import { TileType, Position } from './board.js';

export interface MoveLog {
  timestamp: string;
  moveNumber: number;
  swap: {
    pos1: Position;
    pos2: Position;
    tile1Type: TileType;
    tile2Type: TileType;
  };
  boardStateBefore: TileType[][];
  matchesFound: Position[][];
  cascadeEvents: CascadeEvent[];
  boardStateAfter: TileType[][];
  scoreGained: number;
  totalScore: number;
}

export interface CascadeEvent {
  level: number;
  clearedPositions: Position[];
  tilesCleared: number;
  scoreGained: number;
  fallingTiles: Array<{
    from: Position;
    to: Position;
    tileType: TileType;
  }>;
  newTilesSpawned: Array<{
    position: Position;
    tileType: TileType;
  }>;
  boardStateAfterCascade: TileType[][];
}

export class GameLogger {
  private logs: MoveLog[] = [];
  private moveCounter = 0;
  private sessionId: string;

  constructor() {
    this.sessionId = Date.now().toString();
    console.log(`🎮 Game Logger initialized - Session: ${this.sessionId}`);
  }

  /**
   * Log a complete move with all its effects
   */
  logMove(
    swap: { pos1: Position; pos2: Position; tile1Type: TileType; tile2Type: TileType },
    boardStateBefore: TileType[][],
    matchesFound: Position[][],
    cascadeEvents: CascadeEvent[],
    boardStateAfter: TileType[][],
    scoreGained: number,
    totalScore: number
  ): void {
    this.moveCounter++;
    
    const moveLog: MoveLog = {
      timestamp: new Date().toISOString(),
      moveNumber: this.moveCounter,
      swap,
      boardStateBefore: this.cloneBoard(boardStateBefore),
      matchesFound,
      cascadeEvents,
      boardStateAfter: this.cloneBoard(boardStateAfter),
      scoreGained,
      totalScore
    };

    this.logs.push(moveLog);
    
    // Console logging for immediate debugging
    console.log(`📝 Move ${this.moveCounter}: Swap (${swap.pos1.row},${swap.pos1.col}) ↔ (${swap.pos2.row},${swap.pos2.col})`);
    console.log(`🎯 Matches found: ${matchesFound.length} groups, ${cascadeEvents.length} cascade levels`);
    console.log(`💰 Score: +${scoreGained} (Total: ${totalScore})`);
    
    if (cascadeEvents.length > 0) {
      console.log(`🌊 Cascades: ${cascadeEvents.map(c => `L${c.level}(${c.tilesCleared}tiles)`).join(' → ')}`);
    }
  }

  /**
   * Log cascade event details
   */
  createCascadeEvent(
    level: number,
    clearedPositions: Position[],
    scoreGained: number,
    fallingTiles: Array<{ from: Position; to: Position; tileType: TileType }>,
    newTilesSpawned: Array<{ position: Position; tileType: TileType }>,
    boardStateAfterCascade: TileType[][]
  ): CascadeEvent {
    return {
      level,
      clearedPositions,
      tilesCleared: clearedPositions.length,
      scoreGained,
      fallingTiles,
      newTilesSpawned,
      boardStateAfterCascade: this.cloneBoard(boardStateAfterCascade)
    };
  }

  /**
   * Export logs to JSON file
   */
  async exportLogs(): Promise<string> {
    const logData = {
      sessionId: this.sessionId,
      totalMoves: this.moveCounter,
      exportTime: new Date().toISOString(),
      logs: this.logs
    };

    const jsonContent = JSON.stringify(logData, null, 2);
    // const filename = `game-session-${this.sessionId}.json`; // Removed unused variable
    
    // In browser environment, we'll just return the JSON content
    // The caller can handle saving it to the logs folder
    return jsonContent;
  }

  /**
   * Print board state for debugging
   */
  printBoard(board: TileType[][], title: string = "Board State"): void {
    console.log(`\n📋 ${title}:`);
    const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣']; // Red, Blue, Yellow, Green, Purple
    
    board.forEach((row, rowIndex) => {
      const rowStr = row.map(tile => symbols[tile] || '❓').join(' ');
      console.log(`${rowIndex}: ${rowStr}`);
    });
    console.log('');
  }

  /**
   * Get move statistics
   */
  getStats() {
    const totalScore = this.logs.length > 0 ? this.logs[this.logs.length - 1]!.totalScore : 0;
    const totalCascades = this.logs.reduce((sum, log) => sum + log.cascadeEvents.length, 0);
    const averageScore = this.logs.length > 0 ? totalScore / this.logs.length : 0;
    
    return {
      totalMoves: this.moveCounter,
      totalScore,
      totalCascades,
      averageScorePerMove: Math.round(averageScore),
      sessionDuration: this.logs.length > 0 ? 
        new Date(this.logs[this.logs.length - 1]!.timestamp).getTime() - 
        new Date(this.logs[0]!.timestamp).getTime() : 0
    };
  }

  /**
   * Print current game statistics
   */
  printStats(): void {
    const stats = this.getStats();
    console.log('\n📊 Game Statistics:');
    console.log(`🎮 Total Moves: ${stats.totalMoves}`);
    console.log(`💰 Total Score: ${stats.totalScore}`);
    console.log(`🌊 Total Cascades: ${stats.totalCascades}`);
    console.log(`📈 Average Score/Move: ${stats.averageScorePerMove}`);
    console.log(`⏱️ Session Duration: ${Math.round(stats.sessionDuration / 1000)}s\n`);
  }

  /**
   * Helper method to deep clone board state
   */
  private cloneBoard(board: TileType[][]): TileType[][] {
    return board.map(row => [...row]);
  }

  /**
   * Get all logs
   */
  getLogs(): MoveLog[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    this.moveCounter = 0;
    console.log('🗑️ Game logs cleared');
  }
}