import { Todo, GameStats, Priority } from '../types';

/**
 * DataManager handles all data persistence and statistics
 * Uses localStorage for data persistence
 */
export class DataManager {
  private static readonly STORAGE_KEY = 'phaser-todos';
  private static readonly STATS_KEY = 'phaser-stats';

  /**
   * Load all todos from localStorage
   */
  static loadTodos(): Todo[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  /**
   * Save todos to localStorage
   */
  static saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  /**
   * Create a new todo
   */
  static createTodo(text: string, priority: Priority = Priority.MEDIUM): Todo {
    return {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      tags: [],
    };
  }

  /**
   * Generate a unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load game statistics
   */
  static loadStats(): GameStats {
    try {
      const data = localStorage.getItem(this.STATS_KEY);
      if (!data) return this.getDefaultStats();
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Save game statistics
   */
  static saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }

  /**
   * Get default statistics
   */
  private static getDefaultStats(): GameStats {
    return {
      totalCreated: 0,
      totalCompleted: 0,
      streak: 0,
      longestStreak: 0,
      points: 0,
      level: 1,
    };
  }

  /**
   * Update statistics when a todo is completed
   */
  static updateStatsOnComplete(stats: GameStats): GameStats {
    const today = new Date().toDateString();
    const lastDate = stats.lastCompletedDate;

    // Update streak
    if (lastDate === today) {
      // Same day, don't change streak
    } else if (this.isConsecutiveDay(lastDate, today)) {
      stats.streak++;
    } else {
      stats.streak = 1;
    }

    // Update longest streak
    if (stats.streak > stats.longestStreak) {
      stats.longestStreak = stats.streak;
    }

    stats.totalCompleted++;
    stats.lastCompletedDate = today;

    // Award points
    const basePoints = 10;
    const streakBonus = Math.floor(stats.streak / 5) * 5;
    stats.points += basePoints + streakBonus;

    // Level up
    stats.level = Math.floor(stats.points / 100) + 1;

    this.saveStats(stats);
    return stats;
  }

  /**
   * Check if two dates are consecutive days
   */
  private static isConsecutiveDay(lastDate: string | undefined, today: string): boolean {
    if (!lastDate) return true;

    const last = new Date(lastDate);
    const current = new Date(today);
    const diffTime = current.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 1;
  }

  /**
   * Update statistics when a todo is created
   */
  static updateStatsOnCreate(stats: GameStats): GameStats {
    stats.totalCreated++;
    this.saveStats(stats);
    return stats;
  }

  /**
   * Reset statistics when a todo is uncompleted
   */
  static updateStatsOnUncomplete(stats: GameStats): GameStats {
    if (stats.totalCompleted > 0) {
      stats.totalCompleted--;
    }
    this.saveStats(stats);
    return stats;
  }

  /**
   * Clear all data
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STATS_KEY);
  }

  /**
   * Export todos as JSON
   */
  static exportTodos(): string {
    const todos = this.loadTodos();
    return JSON.stringify(todos, null, 2);
  }

  /**
   * Import todos from JSON
   */
  static importTodos(jsonData: string): boolean {
    try {
      const todos = JSON.parse(jsonData);
      if (!Array.isArray(todos)) return false;
      this.saveTodos(todos);
      return true;
    } catch (error) {
      console.error('Error importing todos:', error);
      return false;
    }
  }
}
