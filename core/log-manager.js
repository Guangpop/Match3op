/**
 * Log Manager - Centralized logging system for Match-3 game debugging
 * Provides easy access to logs, export functionality, and log analysis
 */
import { FileLogger } from './file-logger.js';
import { GameLogger } from './game-logger.js';
export class LogManager {
    fileLogger;
    gameLogger;
    isEnabled = true;
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
    setLoggingEnabled(enabled) {
        this.isEnabled = enabled;
        this.logDebug(`Logging ${enabled ? 'enabled' : 'disabled'}`);
    }
    /**
     * Check if logging is enabled
     */
    isLoggingEnabled() {
        return this.isEnabled;
    }
    /**
     * Log a player move with full details
     */
    logPlayerMove(moveNumber, swapPositions, boardBefore, matchesFound, cascadeEvents, boardAfter, scoreGained, totalScore) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logPlayerMove(moveNumber, swapPositions, boardBefore, matchesFound, cascadeEvents, boardAfter, scoreGained, totalScore);
        this.gameLogger.logMove(swapPositions, boardBefore, matchesFound, cascadeEvents, boardAfter, scoreGained, totalScore);
    }
    /**
     * Log board state
     */
    logBoardState(title, board) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logBoardState(title, board);
    }
    /**
     * Log falling tiles
     */
    logFallingTiles(movements, boardBefore, boardAfter) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logFallingTiles(movements, boardBefore, boardAfter);
    }
    /**
     * Log refill operations
     */
    logRefill(boardBefore, boardAfter) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logRefill(boardBefore, boardAfter);
    }
    /**
     * Log error
     */
    logError(error, context = '') {
        if (!this.isEnabled)
            return;
        this.fileLogger.logError(error, context);
    }
    /**
     * Log debug information
     */
    logDebug(message, data) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logDebug(message, data);
    }
    /**
     * Log game state change
     */
    logGameStateChange(changeType, details) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logGameStateChange(changeType, details);
    }
    /**
     * Log game statistics
     */
    logGameStats(stats) {
        if (!this.isEnabled)
            return;
        this.fileLogger.logGameStats(stats);
    }
    /**
     * Export current session logs as downloadable file
     */
    exportLogsAsFile() {
        this.fileLogger.exportLogsAsFile();
    }
    /**
     * Export logs as JSON
     */
    async exportLogsAsJSON() {
        return await this.gameLogger.exportLogs();
    }
    /**
     * Get current session logs
     */
    getCurrentSessionLogs() {
        return this.fileLogger.getCurrentSessionLogs();
    }
    /**
     * Get all stored logs
     */
    getAllStoredLogs() {
        return this.fileLogger.getAllStoredLogs();
    }
    /**
     * Get game statistics
     */
    getGameStats() {
        return this.gameLogger.getStats();
    }
    /**
     * Print game statistics to console
     */
    printGameStats() {
        this.gameLogger.printStats();
    }
    /**
     * Clear all logs
     */
    clearAllLogs() {
        this.fileLogger.clearLogs();
        this.gameLogger.clearLogs();
        this.logDebug('All logs cleared');
    }
    /**
     * Get session ID
     */
    getSessionId() {
        return this.fileLogger.getSessionId();
    }
    /**
     * Create a cascade event for logging
     */
    createCascadeEvent(level, clearedPositions, scoreGained, fallingTiles, newTilesSpawned, boardStateAfterCascade) {
        return this.gameLogger.createCascadeEvent(level, clearedPositions, scoreGained, fallingTiles, newTilesSpawned, boardStateAfterCascade);
    }
    /**
     * Print board state to console
     */
    printBoard(board, title = "Board State") {
        this.gameLogger.printBoard(board, title);
    }
    /**
     * Get all move logs
     */
    getMoveLogs() {
        return this.gameLogger.getLogs();
    }
    /**
     * Log a complete game session summary
     */
    logSessionSummary() {
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
//# sourceMappingURL=log-manager.js.map