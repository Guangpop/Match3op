/**
 * Match Engine - Detection and scoring for Match-3 patterns
 * Handles horizontal/vertical match detection and tile clearing logic
 */
export class MatchEngine {
    MIN_MATCH_LENGTH = 3;
    BASE_POINTS = 10;
    /**
     * Find all matches on the current board
     */
    findMatches(board) {
        const boardSize = board.length;
        const matches = [];
        const processedPositions = new Set();
        // Find horizontal matches
        for (let row = 0; row < boardSize; row++) {
            const rowData = board[row];
            if (!rowData)
                continue;
            let currentType = rowData[0];
            let matchStart = 0;
            let matchLength = 1;
            for (let col = 1; col < boardSize; col++) {
                const tileType = rowData[col];
                if (tileType === currentType && currentType !== undefined && currentType >= 0) {
                    matchLength++;
                }
                else {
                    // Check if we have a match
                    if (matchLength >= this.MIN_MATCH_LENGTH && currentType !== undefined && currentType >= 0) {
                        const positions = this.getMatchPositions(row, matchStart, matchLength, 'horizontal');
                        matches.push({
                            positions,
                            type: currentType,
                            direction: 'horizontal',
                            length: matchLength
                        });
                        // Mark positions as processed
                        positions.forEach(pos => {
                            processedPositions.add(`${pos.row},${pos.col}`);
                        });
                    }
                    // Start new sequence
                    currentType = tileType;
                    matchStart = col;
                    matchLength = 1;
                }
            }
            // Check final sequence
            if (matchLength >= this.MIN_MATCH_LENGTH && currentType !== undefined && currentType >= 0) {
                const positions = this.getMatchPositions(row, matchStart, matchLength, 'horizontal');
                matches.push({
                    positions,
                    type: currentType,
                    direction: 'horizontal',
                    length: matchLength
                });
                positions.forEach(pos => {
                    processedPositions.add(`${pos.row},${pos.col}`);
                });
            }
        }
        // Find vertical matches
        for (let col = 0; col < boardSize; col++) {
            const firstRow = board[0];
            if (!firstRow)
                continue;
            let currentType = firstRow[col];
            let matchStart = 0;
            let matchLength = 1;
            for (let row = 1; row < boardSize; row++) {
                const rowData = board[row];
                if (!rowData)
                    continue;
                const tileType = rowData[col];
                if (tileType === currentType && currentType !== undefined && currentType >= 0) {
                    matchLength++;
                }
                else {
                    // Check if we have a match
                    if (matchLength >= this.MIN_MATCH_LENGTH && currentType !== undefined && currentType >= 0) {
                        const positions = this.getMatchPositions(col, matchStart, matchLength, 'vertical');
                        matches.push({
                            positions,
                            type: currentType,
                            direction: 'vertical',
                            length: matchLength
                        });
                        positions.forEach(pos => {
                            processedPositions.add(`${pos.row},${pos.col}`);
                        });
                    }
                    // Start new sequence
                    currentType = tileType;
                    matchStart = row;
                    matchLength = 1;
                }
            }
            // Check final sequence
            if (matchLength >= this.MIN_MATCH_LENGTH && currentType !== undefined && currentType >= 0) {
                const positions = this.getMatchPositions(col, matchStart, matchLength, 'vertical');
                matches.push({
                    positions,
                    type: currentType,
                    direction: 'vertical',
                    length: matchLength
                });
                positions.forEach(pos => {
                    processedPositions.add(`${pos.row},${pos.col}`);
                });
            }
        }
        // Calculate results
        const clearedPositions = this.getAllClearedPositions(matches);
        const totalScore = this.calculateScore(clearedPositions.length);
        return {
            matches,
            totalScore,
            clearedPositions
        };
    }
    /**
     * Check if a swap would create any matches
     */
    hasMatchAfterSwap(board, pos1, pos2) {
        // Create temporary board with swapped tiles
        const tempBoard = board.map(row => [...row]);
        const row1 = tempBoard[pos1.row];
        const row2 = tempBoard[pos2.row];
        if (!row1 || !row2)
            return false;
        const tile1 = row1[pos1.col];
        const tile2 = row2[pos2.col];
        if (tile1 === undefined || tile2 === undefined)
            return false;
        row1[pos1.col] = tile2;
        row2[pos2.col] = tile1;
        // Check for matches around both swapped positions
        return this.hasMatchAtPosition(tempBoard, pos1) ||
            this.hasMatchAtPosition(tempBoard, pos2);
    }
    /**
     * Check if there's a match at a specific position
     */
    hasMatchAtPosition(board, position) {
        const { row, col } = position;
        const boardRow = board[row];
        if (!boardRow)
            return false;
        const tileType = boardRow[col];
        if (tileType === undefined || tileType < 0)
            return false;
        // Check horizontal match
        let horizontalCount = 1;
        // Count left
        for (let c = col - 1; c >= 0; c--) {
            const leftTile = boardRow[c];
            if (leftTile === tileType) {
                horizontalCount++;
            }
            else {
                break;
            }
        }
        // Count right
        for (let c = col + 1; c < board.length; c++) {
            const rightTile = boardRow[c];
            if (rightTile === tileType) {
                horizontalCount++;
            }
            else {
                break;
            }
        }
        if (horizontalCount >= this.MIN_MATCH_LENGTH) {
            return true;
        }
        // Check vertical match
        let verticalCount = 1;
        // Count up
        for (let r = row - 1; r >= 0; r--) {
            const upRow = board[r];
            if (upRow && upRow[col] === tileType) {
                verticalCount++;
            }
            else {
                break;
            }
        }
        // Count down
        for (let r = row + 1; r < board.length; r++) {
            const downRow = board[r];
            if (downRow && downRow[col] === tileType) {
                verticalCount++;
            }
            else {
                break;
            }
        }
        return verticalCount >= this.MIN_MATCH_LENGTH;
    }
    /**
     * Generate positions for a match
     */
    getMatchPositions(lineIndex, start, length, direction) {
        const positions = [];
        for (let i = 0; i < length; i++) {
            if (direction === 'horizontal') {
                positions.push({ row: lineIndex, col: start + i });
            }
            else {
                positions.push({ row: start + i, col: lineIndex });
            }
        }
        return positions;
    }
    /**
     * Get all unique positions that should be cleared
     */
    getAllClearedPositions(matches) {
        const positionSet = new Set();
        const positions = [];
        matches.forEach(match => {
            match.positions.forEach(pos => {
                const key = `${pos.row},${pos.col}`;
                if (!positionSet.has(key)) {
                    positionSet.add(key);
                    positions.push(pos);
                }
            });
        });
        return positions;
    }
    /**
     * Calculate score for cleared tiles
     */
    calculateScore(clearedTileCount, cascadeMultiplier = 1.0) {
        return Math.floor(clearedTileCount * this.BASE_POINTS * cascadeMultiplier);
    }
    /**
     * Calculate score with cascade multiplier
     */
    calculateScoreWithMultiplier(clearedTileCount, cascadeLevel) {
        const multiplier = Math.pow(1.5, cascadeLevel - 1);
        return this.calculateScore(clearedTileCount, multiplier);
    }
    /**
     * Preview what matches would be created by a swap
     */
    previewSwapMatches(board, pos1, pos2) {
        if (!this.hasMatchAfterSwap(board, pos1, pos2)) {
            return null;
        }
        // Create temporary board with swapped tiles
        const tempBoard = board.map(row => [...row]);
        const row1 = tempBoard[pos1.row];
        const row2 = tempBoard[pos2.row];
        if (!row1 || !row2)
            return null;
        const tile1 = row1[pos1.col];
        const tile2 = row2[pos2.col];
        if (tile1 === undefined || tile2 === undefined)
            return null;
        row1[pos1.col] = tile2;
        row2[pos2.col] = tile1;
        return this.findMatches(tempBoard);
    }
    /**
     * Get all possible valid swaps on the board
     */
    getAllValidSwaps(board) {
        const validSwaps = [];
        const boardSize = board.length;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const pos1 = { row, col };
                // Check right neighbor
                if (col < boardSize - 1) {
                    const pos2 = { row, col: col + 1 };
                    const matches = this.previewSwapMatches(board, pos1, pos2);
                    if (matches) {
                        validSwaps.push({ pos1, pos2, matches });
                    }
                }
                // Check bottom neighbor
                if (row < boardSize - 1) {
                    const pos2 = { row: row + 1, col };
                    const matches = this.previewSwapMatches(board, pos1, pos2);
                    if (matches) {
                        validSwaps.push({ pos1, pos2, matches });
                    }
                }
            }
        }
        return validSwaps;
    }
    /**
     * Check if board has any valid moves
     */
    hasValidMoves(board) {
        return this.getAllValidSwaps(board).length > 0;
    }
}
//# sourceMappingURL=match.js.map