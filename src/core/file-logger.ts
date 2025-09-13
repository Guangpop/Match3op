/**
 * File Logger - Writes game logs to .log files in the logs directory
 * Handles server-side file writing for debugging purposes
 */

import { TileType, Position } from './board.js';
import { CascadeEvent } from './game-logger.js';

export class FileLogger {
  private sessionId: string;
  private logFilePath: string;
  // private moveCount: number = 0; // Removed unused variable

  constructor() {
    this.sessionId = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = `logs/${this.sessionId}.log`;
    this.initializeLogFile();
  }

  private initializeLogFile(): void {
    const header = `🎮 Match-3 Game Session Log
📅 Session ID: ${this.sessionId}
🕐 Started: ${new Date().toLocaleString()}
=====================================

`;
    this.writeToLog(header);
  }

  /**
   * Log a player move with full details
   */
  logPlayerMove(
    moveNumber: number,
    swapPositions: { pos1: Position; pos2: Position; tile1Type: TileType; tile2Type: TileType },
    boardBefore: TileType[][],
    matchesFound: Position[][],
    cascadeEvents: CascadeEvent[],
    boardAfter: TileType[][],
    scoreGained: number,
    totalScore: number
  ): void {
    // this.moveCount = moveNumber; // Removed unused assignment
    
    const logEntry = `
📝 MOVE ${moveNumber} - ${new Date().toLocaleTimeString()}
=====================================
🔄 Swap: (${swapPositions.pos1.row},${swapPositions.pos1.col})[${this.getTileSymbol(swapPositions.tile1Type)}] ↔ (${swapPositions.pos2.row},${swapPositions.pos2.col})[${this.getTileSymbol(swapPositions.tile2Type)}]

📋 Board BEFORE Swap:
${this.formatBoard(boardBefore)}

🎯 Matches Found: ${matchesFound.length} groups
${matchesFound.map((group, i) => `  Group ${i + 1}: ${group.map(p => `(${p.row},${p.col})`).join(', ')}`).join('\n')}

🌊 Cascade Events: ${cascadeEvents.length} levels
${cascadeEvents.map(event => this.formatCascadeEvent(event)).join('\n')}

📋 Board AFTER All Cascades:
${this.formatBoard(boardAfter)}

💰 Score: +${scoreGained} (Total: ${totalScore})
=====================================

`;

    this.writeToLog(logEntry);
  }

  /**
   * Log board state at any point
   */
  logBoardState(title: string, board: TileType[][]): void {
    const logEntry = `
📋 ${title} - ${new Date().toLocaleTimeString()}
${this.formatBoard(board)}

`;
    this.writeToLog(logEntry);
  }

  /**
   * Log falling tile movements
   */
  logFallingTiles(movements: Map<string, Position>, boardBefore: TileType[][], boardAfter: TileType[][]): void {
    const logEntry = `
⬇️  FALLING TILES - ${new Date().toLocaleTimeString()}
=====================================
📊 Total Movements: ${movements.size}

🎯 Movement Details:
${Array.from(movements.entries()).map(([fromKey, toPos]) => {
  const [fromRow, fromCol] = fromKey.split(',').map(Number);
  const tileType = boardBefore[fromRow!]?.[fromCol!];
  return `  ${this.getTileSymbol(tileType!)} (${fromRow},${fromCol}) → (${toPos.row},${toPos.col})`;
}).join('\n')}

📋 Before Gravity:
${this.formatBoard(boardBefore)}

📋 After Gravity:
${this.formatBoard(boardAfter)}
=====================================

`;
    this.writeToLog(logEntry);
  }

  /**
   * Log refill operations
   */
  logRefill(boardBefore: TileType[][], boardAfter: TileType[][]): void {
    const newTiles: Array<{pos: Position, tile: TileType}> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const beforeTile = boardBefore[row]?.[col];
        const afterTile = boardAfter[row]?.[col];
        if ((beforeTile === undefined || beforeTile < 0) && afterTile !== undefined && afterTile >= 0) {
          newTiles.push({pos: {row, col}, tile: afterTile});
        }
      }
    }

    const logEntry = `
🎲 BOARD REFILL - ${new Date().toLocaleTimeString()}
=====================================
🆕 New Tiles Spawned: ${newTiles.length}

📍 New Tile Positions:
${newTiles.map(({pos, tile}) => `  ${this.getTileSymbol(tile)} at (${pos.row},${pos.col})`).join('\n')}

📋 Before Refill:
${this.formatBoard(boardBefore)}

📋 After Refill:
${this.formatBoard(boardAfter)}
=====================================

`;
    this.writeToLog(logEntry);
  }

  /**
   * Log game statistics
   */
  logGameStats(stats: any): void {
    const logEntry = `
📊 GAME STATISTICS - ${new Date().toLocaleTimeString()}
=====================================
🎮 Total Moves: ${stats.totalMoves}
💰 Total Score: ${stats.totalScore}
🌊 Total Cascades: ${stats.totalCascades}
📈 Average Score/Move: ${stats.averageScorePerMove}
⏱️ Session Duration: ${Math.round(stats.sessionDuration / 1000)}s
=====================================

`;
    this.writeToLog(logEntry);
  }

  private formatBoard(board: TileType[][]): string {
    const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣']; // Red, Blue, Yellow, Green, Purple
    
    let result = '   0 1 2 3 4 5 6 7\n';
    board.forEach((row, rowIndex) => {
      const rowStr = row.map(tile => {
        if (tile === undefined) return '❓';
        if (tile < 0) return '⚫'; // Empty
        return symbols[tile] || '❓';
      }).join(' ');
      result += `${rowIndex}: ${rowStr}\n`;
    });
    
    return result;
  }

  private formatCascadeEvent(event: CascadeEvent): string {
    return `  Level ${event.level}: ${event.tilesCleared} tiles cleared, ${event.fallingTiles.length} tiles fell, ${event.newTilesSpawned.length} new tiles, +${event.scoreGained} points`;
  }

  private getTileSymbol(tileType: TileType): string {
    const symbols = ['🔴', '🔵', '🟡', '🟢', '🟣'];
    if (tileType < 0 || tileType === undefined) return '⚫';
    return symbols[tileType] || '❓';
  }

  private writeToLog(content: string): void {
    // Always log to console for immediate debugging
    console.log(content);
    
    // In browser environment, store in localStorage and provide download functionality
    if (typeof window !== 'undefined') {
      const existingLogs = localStorage.getItem(this.logFilePath) || '';
      localStorage.setItem(this.logFilePath, existingLogs + content);
      
      // Also store in sessionStorage for current session
      const sessionKey = `current-session-${this.sessionId}`;
      const sessionLogs = sessionStorage.getItem(sessionKey) || '';
      sessionStorage.setItem(sessionKey, sessionLogs + content);
    } else {
      // Node.js environment - would write to actual file
      console.log(`[LOG] ${content}`);
    }
  }

  /**
   * Get log file path for downloads
   */
  getLogFilePath(): string {
    return this.logFilePath;
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Export logs as downloadable file
   */
  exportLogsAsFile(): void {
    if (typeof window !== 'undefined') {
      const logContent = localStorage.getItem(this.logFilePath) || '';
      
      // Create downloadable blob
      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `game-session-${this.sessionId}.log`;
      downloadLink.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
      console.log(`📁 Log file exported: game-session-${this.sessionId}.log`);
    }
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.logFilePath);
      const sessionKey = `current-session-${this.sessionId}`;
      sessionStorage.removeItem(sessionKey);
    }
  }

  /**
   * Log error with detailed information
   */
  logError(error: Error, context: string = ''): void {
    const errorEntry = `
🚨 ERROR - ${new Date().toLocaleTimeString()}
=====================================
📍 Context: ${context}
❌ Error: ${error.message}
📋 Stack: ${error.stack || 'No stack trace available'}
=====================================

`;
    this.writeToLog(errorEntry);
  }

  /**
   * Log debug information
   */
  logDebug(message: string, data?: any): void {
    const debugEntry = `
🐛 DEBUG - ${new Date().toLocaleTimeString()}
=====================================
💬 Message: ${message}
${data ? `📊 Data: ${JSON.stringify(data, null, 2)}` : ''}
=====================================

`;
    this.writeToLog(debugEntry);
  }

  /**
   * Log game state change
   */
  logGameStateChange(changeType: string, details: any): void {
    const stateEntry = `
🔄 STATE CHANGE - ${new Date().toLocaleTimeString()}
=====================================
📝 Type: ${changeType}
📊 Details: ${JSON.stringify(details, null, 2)}
=====================================

`;
    this.writeToLog(stateEntry);
  }

  /**
   * Get current session logs from memory
   */
  getCurrentSessionLogs(): string {
    if (typeof window !== 'undefined') {
      const sessionKey = `current-session-${this.sessionId}`;
      return sessionStorage.getItem(sessionKey) || '';
    }
    return '';
  }

  /**
   * Get all stored logs
   */
  getAllStoredLogs(): { [key: string]: string } {
    if (typeof window !== 'undefined') {
      const logs: { [key: string]: string } = {};
      
      // Get all localStorage keys that start with 'logs/'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('logs/')) {
          logs[key] = localStorage.getItem(key) || '';
        }
      }
      
      return logs;
    }
    return {};
  }
}