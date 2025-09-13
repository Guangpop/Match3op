/**
 * Match Engine - Detection and scoring for Match-3 patterns
 * Handles horizontal/vertical match detection and tile clearing logic
 */
import { TileType, Position } from './board.js';
export interface Match {
    positions: Position[];
    type: TileType;
    direction: 'horizontal' | 'vertical';
    length: number;
}
export interface MatchResult {
    matches: Match[];
    totalScore: number;
    clearedPositions: Position[];
}
export declare class MatchEngine {
    private readonly MIN_MATCH_LENGTH;
    private readonly BASE_POINTS;
    /**
     * Find all matches on the current board
     */
    findMatches(board: TileType[][]): MatchResult;
    /**
     * Check if a swap would create any matches
     */
    hasMatchAfterSwap(board: TileType[][], pos1: Position, pos2: Position): boolean;
    /**
     * Check if there's a match at a specific position
     */
    private hasMatchAtPosition;
    /**
     * Generate positions for a match
     */
    private getMatchPositions;
    /**
     * Get all unique positions that should be cleared
     */
    private getAllClearedPositions;
    /**
     * Calculate score for cleared tiles
     */
    private calculateScore;
    /**
     * Calculate score with cascade multiplier
     */
    calculateScoreWithMultiplier(clearedTileCount: number, cascadeLevel: number): number;
    /**
     * Preview what matches would be created by a swap
     */
    previewSwapMatches(board: TileType[][], pos1: Position, pos2: Position): MatchResult | null;
    /**
     * Get all possible valid swaps on the board
     */
    getAllValidSwaps(board: TileType[][]): Array<{
        pos1: Position;
        pos2: Position;
        matches: MatchResult;
    }>;
    /**
     * Check if board has any valid moves
     */
    hasValidMoves(board: TileType[][]): boolean;
}
//# sourceMappingURL=match.d.ts.map