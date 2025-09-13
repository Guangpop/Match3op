/**
 * Log Manager - Centralized logging system for Match-3 game debugging
 * Provides easy access to logs, export functionality, and log analysis
 */

import { FileLogger } from './file-logger.js';
import { GameLogger } from './game-logger.js';

export class LogManager {
  private fileLogger: FileLogger;
  private gameLogger: GameLogger;
  private isEnabled: boolean = true;

  constructor() {
    this.fileLogger = new FileLogger();
    this.gameLogger = new GameLogger();
    
    // Log initialization
    this.logDebug('LogManager initialized', {
      sessionId: this.fileLogger.getSessionId(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Enable or disable logging
   */
  setLoggingEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.logDebug(`Logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if logging is enabled
   */
  isLoggingEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Log a player move with full details
   */
  logPlayerMove(
    moveNumber: number,
    swapPositions: { pos1: any; pos2: any; tile1Type: any; tile2Type: any },
    boardBefore: any[][],
    matchesFound: any[][],
    cascadeEvents: any[],
    boardAfter: any[][],
    scoreGained: number,
    totalScore: number
  ): void {
    if (!this.isEnabled) return;

    this.fileLogger.logPlayerMove(
      moveNumber,
      swapPositions,
      boardBefore,
      matchesFound,
      cascadeEvents,
      boardAfter,
      scoreGained,
      totalScore
    );

    this.gameLogger.logMove(
      swapPositions,
      boardBefore,
      matchesFound,
      cascadeEvents,
      boardAfter,
      scoreGained,
      totalScore
    );
  }

  /**
   * Log board state
   */
  logBoardState(title: string, board: any[][]): void {
    if (!this.isEnabled) return;
    this.fileLogger.logBoardState(title, board);
  }

  /**
   * Log falling tiles
   */
  logFallingTiles(movements: Map<string, any>, boardBefore: any[][], boardAfter: any[][]): void {
    if (!this.isEnabled) return;
    this.fileLogger.logFallingTiles(movements, boardBefore, boardAfter);
  }

  /**
   * Log refill operations
   */
  logRefill(boardBefore: any[][], boardAfter: any[][]): void {
    if (!this.isEnabled) return;
    this.fileLogger.logRefill(boardBefore, boardAfter);
  }

  /**
   * Log error
   */
  logError(error: Error, context: string = ''): void {
    if (!this.isEnabled) return;
    this.fileLogger.logError(error, context);
  }

  /**
   * Log debug information
   */
  logDebug(message: string, data?: any): void {
    if (!this.isEnabled) return;
    this.fileLogger.logDebug(message, data);
  }

  /**
   * Log game state change
   */
  logGameStateChange(changeType: string, details: any): void {
    if (!this.isEnabled) return;
    this.fileLogger.logGameStateChange(changeType, details);
  }

  /**
   * Log game statistics
   */
  logGameStats(stats: any): void {
    if (!this.isEnabled) return;
    this.fileLogger.logGameStats(stats);
  }

  /**
   * Export current session logs as downloadable file
   */
  exportLogsAsFile(): void {
    this.fileLogger.exportLogsAsFile();
  }

  /**
   * Export logs as JSON
   */
  async exportLogsAsJSON(): Promise<string> {
    return await this.gameLogger.exportLogs();
  }

  /**
   * Get current session logs
   */
  getCurrentSessionLogs(): string {
    return this.fileLogger.getCurrentSessionLogs();
  }

  /**
   * Get all stored logs
   */
  getAllStoredLogs(): { [key: string]: string } {
    return this.fileLogger.getAllStoredLogs();
  }

  /**
   * Get game statistics
   */
  getGameStats(): any {
    return this.gameLogger.getStats();
  }

  /**
   * Print game statistics to console
   */
  printGameStats(): void {
    this.gameLogger.printStats();
  }

  /**
   * Clear all logs
   */
  clearAllLogs(): void {
    this.fileLogger.clearLogs();
    this.gameLogger.clearLogs();
    this.logDebug('All logs cleared');
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.fileLogger.getSessionId();
  }

  /**
   * Create a cascade event for logging
   */
  createCascadeEvent(
    level: number,
    clearedPositions: any[],
    scoreGained: number,
    fallingTiles: Array<{ from: any; to: any; tileType: any }>,
    newTilesSpawned: Array<{ position: any; tileType: any }>,
    boardStateAfterCascade: any[][]
  ): any {
    return this.gameLogger.createCascadeEvent(
      level,
      clearedPositions,
      scoreGained,
      fallingTiles,
      newTilesSpawned,
      boardStateAfterCascade
    );
  }

  /**
   * Print board state to console
   */
  printBoard(board: any[][], title: string = "Board State"): void {
    this.gameLogger.printBoard(board, title);
  }

  /**
   * Get all move logs
   */
  getMoveLogs(): any[] {
    return this.gameLogger.getLogs();
  }

  /**
   * Log a complete game session summary
   */
  logSessionSummary(): void {
    const stats = this.getGameStats();
    const sessionId = this.getSessionId();
    
    const summary = `
🎮 GAME SESSION SUMMARY
=====================================
📅 Session ID: ${sessionId}
🕐 Ended: ${new Date().toLocaleString()}
🎮 Total Moves: ${stats.totalMoves}
💰 Total Score: ${stats.totalScore}
🌊 Total Cascades: ${stats.totalCascades}
📈 Average Score/Move: ${stats.averageScorePerMove}
⏱️ Session Duration: ${Math.round(stats.sessionDuration / 1000)}s
=====================================

`;
    
    this.fileLogger['writeToLog'](summary);
  }
}

// Global log manager instance
export const logManager = new LogManager();
