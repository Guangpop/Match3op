As a player I want to swap two adjacent tiles, so that I can attempt to make a match.

✅ **COMPLETED - Implementation Status**:
This story has been fully implemented with **Phaser.js interactive system and match validation**.

**Acceptance Criteria** (✅ All Completed):
- ✅ **Adjacent Tile Swapping**: Click-to-select and click-adjacent-to-swap with visual feedback
- ✅ **Match Validation**: Intelligent match detection using `MatchEngine.hasMatchAfterSwap()`
- ✅ **Successful Match Flow**: Match detected → particle effects → tiles cleared → score increase → cascade animations → board refill
- ✅ **Invalid Swap Handling**: No match created → smooth revert animation → tiles return to original positions
- ✅ **User Feedback**: Clear visual indicators for selected tiles and action feedback messages

**Implementation Details**:
- **Input System**: Phaser.js native input handling with sprite interaction
- **Visual Selection**: White border selection indicator for currently selected tile
- **Match Engine**: Comprehensive match detection with horizontal/vertical line validation
- **Score System**: Base 10 points per tile with cascade multipliers (1.5x per level)
- **State Management**: Clean separation between game logic and visual representation
- **User Experience**: Immediate feedback with status messages and smooth animations