/**
 * Tile Data Configuration - Unified tile properties and colors
 * 珠子資料配置 - 統一管理珠子屬性和顏色
 */

import { TileType } from '../core/board.js';

export interface TileConfig {
  type: TileType;
  name: string;
  displayName: string;
  color: number;
  emoji: string;
  description: string;
}

/**
 * five-color tile configuration
 */
export const TILE_CONFIGS: Record<TileType, TileConfig> = {
  [TileType.RED]: {
    type: TileType.RED,
    name: 'fire',
    displayName: '火',
    color: 0xFF3333,
    emoji: '🔴',
    description: '火屬性珠子'
  },
  [TileType.BLUE]: {
    type: TileType.BLUE,
    name: 'water',
    displayName: '水',
    color: 0x3366FF,
    emoji: '🔵',
    description: '水屬性珠子'
  },
  [TileType.GREEN]: {
    type: TileType.GREEN,
    name: 'wood',
    displayName: '木',
    color: 0x33CC33,
    emoji: '🟢',
    description: '木屬性珠子'
  },
  [TileType.YELLOW]: {
    type: TileType.YELLOW,
    name: 'light',
    displayName: '光',
    color: 0xFFCC00,
    emoji: '🟡',
    description: '光屬性珠子'
  },
  [TileType.PURPLE]: {
    type: TileType.PURPLE,
    name: 'dark',
    displayName: '暗',
    color: 0x9933CC,
    emoji: '🟣',
    description: '暗屬性珠子'
  }
};

/**
 * 獲取珠子配置
 * Get tile configuration by type
 */
export function getTileConfig(type: TileType): TileConfig {
  return TILE_CONFIGS[type];
}

/**
 * 獲取珠子顏色
 * Get tile color by type
 */
export function getTileColor(type: TileType): number {
  return TILE_CONFIGS[type]?.color || 0xFFFFFF;
}

/**
 * 獲取珠子表情符號
 * Get tile emoji by type
 */
export function getTileEmoji(type: TileType): string {
  return TILE_CONFIGS[type]?.emoji || '⚫';
}

/**
 * 獲取珠子名稱
 * Get tile display name by type
 */
export function getTileDisplayName(type: TileType): string {
  return TILE_CONFIGS[type]?.displayName || '未知';
}

/**
 * 獲取所有顏色數組（用於創建材質）
 * Get all colors array (for texture creation)
 */
export function getAllTileColors(): number[] {
  return Object.values(TILE_CONFIGS).map(config => config.color);
}

/**
 * 珠子大小和視覺配置
 * Tile size and visual configuration
 */
export const TILE_VISUAL_CONFIG = {
  SIZE: 64,
  BORDER_RADIUS: 8,
  BORDER_WIDTH: 4,
  HOVER_TINT: 0xCCCCCC,
  SELECT_TINT: 0xFFD700,
  PARTICLE_CONFIG: {
    SCALE_MIN: 0.3,
    SCALE_MAX: 0.8,
    SPEED_MIN: 50,
    SPEED_MAX: 150,
    LIFESPAN: 800,
    QUANTITY: 15
  }
} as const;

/**
 * 棋盤配置
 * Board configuration
 */
export const BOARD_CONFIG = {
  SIZE: 8,
  OFFSET_X: 100,
  OFFSET_Y: 150,
  TILE_TYPES: 5
} as const;