/**
 * Core type definitions for the Phaser Todo List application
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  priority: Priority;
  tags: string[];
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface GameStats {
  totalCreated: number;
  totalCompleted: number;
  streak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  points: number;
  level: number;
}

export interface ParticleConfig {
  x: number;
  y: number;
  color: number;
  count: number;
}

export interface TodoItemConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  todo: Todo;
  width: number;
}

export const COLORS = {
  BACKGROUND: 0x2c3e50,
  HEADER: 0x34495e,
  CARD: 0xecf0f1,
  CARD_COMPLETED: 0x95a5a6,
  TEXT: 0x2c3e50,
  TEXT_COMPLETED: 0x7f8c8d,
  PRIMARY: 0x3498db,
  SUCCESS: 0x2ecc71,
  WARNING: 0xf39c12,
  DANGER: 0xe74c3c,
  PARTICLE_GOLD: 0xffd700,
  PARTICLE_BLUE: 0x3498db,
  PARTICLE_GREEN: 0x2ecc71,
} as const;

export const PRIORITY_COLORS = {
  [Priority.LOW]: COLORS.SUCCESS,
  [Priority.MEDIUM]: COLORS.WARNING,
  [Priority.HIGH]: COLORS.DANGER,
} as const;

export const CONFIG = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  CARD_WIDTH: 700,
  CARD_HEIGHT: 60,
  CARD_SPACING: 10,
  HEADER_HEIGHT: 80,
  INPUT_HEIGHT: 60,
  SCROLL_SPEED: 20,
  MAX_VISIBLE_TODOS: 7,
} as const;
