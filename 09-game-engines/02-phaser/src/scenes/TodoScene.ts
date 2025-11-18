import Phaser from 'phaser';
import { TodoItem } from '../objects/TodoItem';
import { TodoInputUI } from '../ui/TodoInputUI';
import { DataManager } from '../utils/DataManager';
import { Todo, GameStats, COLORS, CONFIG, Priority, ParticleConfig } from '../types';

/**
 * TodoScene is the main game scene that manages all todos
 */
export class TodoScene extends Phaser.Scene {
  private todos: Todo[] = [];
  private todoItems: TodoItem[] = [];
  private stats: GameStats;
  private inputUI!: TodoInputUI;
  private headerText!: Phaser.GameObjects.Text;
  private statsText!: Phaser.GameObjects.Text;
  private filterText!: Phaser.GameObjects.Text;
  private emptyStateText!: Phaser.GameObjects.Text;
  private scrollOffset: number = 0;
  private currentFilter: 'all' | 'active' | 'completed' = 'all';
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'TodoScene' });
    this.stats = DataManager.loadStats();
  }

  /**
   * Preload assets (called automatically by Phaser)
   */
  preload(): void {
    // Create particle texture
    this.createParticleTexture();
  }

  /**
   * Create scene (called automatically by Phaser)
   */
  create(): void {
    this.createBackground();
    this.createHeader();
    this.createStatsDisplay();
    this.createFilterButtons();
    this.createParticleSystem();
    this.createInputUI();
    this.createEmptyState();
    this.loadTodos();
    this.setupKeyboardShortcuts();
    this.setupScrolling();

    // Remove loading indicator
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Create particle texture
   */
  private createParticleTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }

  /**
   * Create background
   */
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.BACKGROUND, 1);
    bg.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
  }

  /**
   * Create header
   */
  private createHeader(): void {
    // Header background
    const headerBg = this.add.graphics();
    headerBg.fillStyle(COLORS.HEADER, 1);
    headerBg.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.HEADER_HEIGHT);

    // Header text
    this.headerText = this.add.text(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.HEADER_HEIGHT / 2,
      '📝 Phaser Todo List',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#ecf0f1',
        fontStyle: 'bold',
      }
    );
    this.headerText.setOrigin(0.5);

    // Animated glow effect
    this.tweens.add({
      targets: this.headerText,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Create statistics display
   */
  private createStatsDisplay(): void {
    this.statsText = this.add.text(20, 20, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ecf0f1',
    });

    this.updateStatsDisplay();
  }

  /**
   * Update statistics display
   */
  private updateStatsDisplay(): void {
    const completed = this.todos.filter((t) => t.completed).length;
    const total = this.todos.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.statsText.setText([
      `📊 Stats: ${completed}/${total} (${percentage}%)`,
      `🔥 Streak: ${this.stats.streak} days`,
      `⭐ Level ${this.stats.level} | ${this.stats.points} pts`,
    ]);
  }

  /**
   * Create filter buttons
   */
  private createFilterButtons(): void {
    const filters: Array<{ label: string; filter: 'all' | 'active' | 'completed' }> = [
      { label: 'All', filter: 'all' },
      { label: 'Active', filter: 'active' },
      { label: 'Completed', filter: 'completed' },
    ];

    const startX = CONFIG.GAME_WIDTH - 250;
    const y = 45;

    filters.forEach((item, index) => {
      const button = this.add.text(startX + index * 80, y, item.label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ecf0f1',
        backgroundColor: item.filter === this.currentFilter ? '#3498db' : '#34495e',
        padding: { x: 12, y: 6 },
      });

      button.setInteractive({ useHandCursor: true });

      button.on('pointerover', () => {
        if (item.filter !== this.currentFilter) {
          button.setBackgroundColor('#2c3e50');
        }
      });

      button.on('pointerout', () => {
        if (item.filter !== this.currentFilter) {
          button.setBackgroundColor('#34495e');
        }
      });

      button.on('pointerdown', () => {
        this.setFilter(item.filter);
      });

      if (item.filter === this.currentFilter) {
        this.filterText = button;
      }
    });
  }

  /**
   * Set current filter
   */
  private setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.currentFilter = filter;
    this.renderTodos();
  }

  /**
   * Create particle system for celebrations
   */
  private createParticleSystem(): void {
    this.particles = this.add.particles(0, 0, 'particle', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      gravityY: 200,
      quantity: 20,
      emitting: false,
    });
  }

  /**
   * Create input UI
   */
  private createInputUI(): void {
    this.inputUI = new TodoInputUI(this);

    this.inputUI.onSubmit((text: string, priority: Priority) => {
      this.addTodo(text, priority);
    });

    // Update input position when window resizes
    window.addEventListener('resize', () => {
      this.inputUI.updatePosition();
    });
  }

  /**
   * Create empty state message
   */
  private createEmptyState(): void {
    this.emptyStateText = this.add.text(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.GAME_HEIGHT / 2,
      '🎮 No todos yet!\n\nAdd your first task above to get started.',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#7f8c8d',
        align: 'center',
      }
    );
    this.emptyStateText.setOrigin(0.5);
    this.emptyStateText.setVisible(false);
  }

  /**
   * Load todos from storage
   */
  private loadTodos(): void {
    this.todos = DataManager.loadTodos();
    this.renderTodos();
  }

  /**
   * Render all todos
   */
  private renderTodos(): void {
    // Clear existing todo items
    this.todoItems.forEach((item) => item.destroy());
    this.todoItems = [];

    // Filter todos
    let filteredTodos = this.todos;
    if (this.currentFilter === 'active') {
      filteredTodos = this.todos.filter((t) => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filteredTodos = this.todos.filter((t) => t.completed);
    }

    // Show empty state if no todos
    this.emptyStateText.setVisible(filteredTodos.length === 0);

    // Calculate starting position
    const startY = CONFIG.HEADER_HEIGHT + CONFIG.INPUT_HEIGHT + 20;
    const itemHeight = CONFIG.CARD_HEIGHT + CONFIG.CARD_SPACING;

    // Create todo items
    filteredTodos.forEach((todo, index) => {
      const y = startY + index * itemHeight - this.scrollOffset;

      const todoItem = new TodoItem({
        scene: this,
        x: (CONFIG.GAME_WIDTH - CONFIG.CARD_WIDTH) / 2,
        y,
        todo,
        width: CONFIG.CARD_WIDTH,
      });

      // Listen to events
      todoItem.on('toggle', (updatedTodo: Todo) => {
        this.handleToggle(updatedTodo);
      });

      todoItem.on('delete', (deletedTodo: Todo) => {
        this.handleDelete(deletedTodo);
      });

      todoItem.on('complete', (x: number, y: number) => {
        this.playCompletionCelebration(x, y);
      });

      todoItem.on('dragend', (item: TodoItem) => {
        this.handleDragEnd(item);
      });

      this.todoItems.push(todoItem);
    });

    this.updateStatsDisplay();
  }

  /**
   * Add a new todo
   */
  private addTodo(text: string, priority: Priority): void {
    const todo = DataManager.createTodo(text, priority);
    this.todos.unshift(todo); // Add to beginning
    this.stats = DataManager.updateStatsOnCreate(this.stats);
    DataManager.saveTodos(this.todos);

    this.renderTodos();
    this.playAddAnimation();
  }

  /**
   * Play add animation
   */
  private playAddAnimation(): void {
    if (this.todoItems.length > 0) {
      const firstItem = this.todoItems[0];
      firstItem.setAlpha(0);
      firstItem.setScale(0.8);

      this.tweens.add({
        targets: firstItem,
        alpha: 1,
        scale: 1,
        duration: 300,
        ease: 'Back.easeOut',
      });
    }
  }

  /**
   * Handle todo toggle
   */
  private handleToggle(todo: Todo): void {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;

      if (todo.completed) {
        this.stats = DataManager.updateStatsOnComplete(this.stats);
      } else {
        this.stats = DataManager.updateStatsOnUncomplete(this.stats);
      }

      DataManager.saveTodos(this.todos);
      this.updateStatsDisplay();
    }
  }

  /**
   * Handle todo deletion
   */
  private handleDelete(todo: Todo): void {
    this.todos = this.todos.filter((t) => t.id !== todo.id);
    DataManager.saveTodos(this.todos);
    this.renderTodos();
  }

  /**
   * Handle drag end
   */
  private handleDragEnd(draggedItem: TodoItem): void {
    // Find the new position based on Y coordinate
    const draggedTodo = draggedItem.getTodo();
    const draggedIndex = this.todos.findIndex((t) => t.id === draggedTodo.id);

    if (draggedIndex === -1) return;

    // Calculate new index based on position
    const startY = CONFIG.HEADER_HEIGHT + CONFIG.INPUT_HEIGHT + 20;
    const itemHeight = CONFIG.CARD_HEIGHT + CONFIG.CARD_SPACING;
    const newIndex = Math.round((draggedItem.y - startY + this.scrollOffset) / itemHeight);
    const clampedIndex = Phaser.Math.Clamp(newIndex, 0, this.todos.length - 1);

    if (clampedIndex !== draggedIndex) {
      // Reorder todos
      const [removed] = this.todos.splice(draggedIndex, 1);
      this.todos.splice(clampedIndex, 0, removed);
      DataManager.saveTodos(this.todos);
    }

    // Re-render to snap to positions
    this.renderTodos();
  }

  /**
   * Play completion celebration
   */
  private playCompletionCelebration(x: number, y: number): void {
    // Emit particles
    this.particles.setPosition(x, y);
    this.particles.explode(30);

    // Play sound effect (if available)
    // this.sound.play('complete');

    // Show floating text
    const floatingText = this.add.text(x, y, '+10 pts', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#2ecc71',
      fontStyle: 'bold',
    });
    floatingText.setOrigin(0.5);

    this.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        floatingText.destroy();
      },
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    // Focus input on 'N' key
    this.input.keyboard?.on('keydown-N', () => {
      this.inputUI.focus();
    });

    // Clear completed on 'C' key
    this.input.keyboard?.on('keydown-C', () => {
      this.clearCompleted();
    });

    // Show all on '1' key
    this.input.keyboard?.on('keydown-ONE', () => {
      this.setFilter('all');
    });

    // Show active on '2' key
    this.input.keyboard?.on('keydown-TWO', () => {
      this.setFilter('active');
    });

    // Show completed on '3' key
    this.input.keyboard?.on('keydown-THREE', () => {
      this.setFilter('completed');
    });
  }

  /**
   * Setup scrolling
   */
  private setupScrolling(): void {
    this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      this.scrollOffset += deltaY * 0.5;
      this.scrollOffset = Math.max(0, this.scrollOffset);

      this.renderTodos();
    });
  }

  /**
   * Clear all completed todos
   */
  private clearCompleted(): void {
    const beforeCount = this.todos.length;
    this.todos = this.todos.filter((t) => !t.completed);
    const afterCount = this.todos.length;

    if (beforeCount !== afterCount) {
      DataManager.saveTodos(this.todos);
      this.renderTodos();

      // Show notification
      const notification = this.add.text(
        CONFIG.GAME_WIDTH / 2,
        CONFIG.GAME_HEIGHT - 50,
        `Cleared ${beforeCount - afterCount} completed todo(s)`,
        {
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          color: '#2ecc71',
          backgroundColor: '#34495e',
          padding: { x: 20, y: 10 },
        }
      );
      notification.setOrigin(0.5);

      this.tweens.add({
        targets: notification,
        alpha: 0,
        y: CONFIG.GAME_HEIGHT - 100,
        duration: 2000,
        delay: 1000,
        onComplete: () => {
          notification.destroy();
        },
      });
    }
  }

  /**
   * Update loop (called every frame)
   */
  update(time: number, delta: number): void {
    // Optional: Add any per-frame updates here
  }

  /**
   * Shutdown (cleanup when scene is stopped)
   */
  shutdown(): void {
    this.inputUI.destroy();
  }
}
