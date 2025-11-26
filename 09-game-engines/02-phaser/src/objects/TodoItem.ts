import Phaser from 'phaser';
import { Todo, TodoItemConfig, COLORS, PRIORITY_COLORS, CONFIG } from '../types';

/**
 * TodoItem is a custom game object that represents a single todo item
 * It's a container that holds graphics, text, and interactive elements
 */
export class TodoItem extends Phaser.GameObjects.Container {
  private todo: Todo;
  private background: Phaser.GameObjects.Graphics;
  private checkbox: Phaser.GameObjects.Graphics;
  private textObject: Phaser.GameObjects.Text;
  private deleteButton: Phaser.GameObjects.Text;
  private priorityIndicator: Phaser.GameObjects.Graphics;
  private itemWidth: number;
  private isHovered: boolean = false;

  constructor(config: TodoItemConfig) {
    super(config.scene, config.x, config.y);

    this.todo = config.todo;
    this.itemWidth = config.width;

    this.createBackground();
    this.createPriorityIndicator();
    this.createCheckbox();
    this.createText();
    this.createDeleteButton();
    this.setupInteractivity();

    // Add to scene
    config.scene.add.existing(this);

    // Make container interactive
    this.setSize(this.itemWidth, CONFIG.CARD_HEIGHT);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT),
      Phaser.Geom.Rectangle.Contains
    );
  }

  /**
   * Create the background card
   */
  private createBackground(): void {
    this.background = this.scene.add.graphics();
    const color = this.todo.completed ? COLORS.CARD_COMPLETED : COLORS.CARD;

    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT, 8);

    // Add shadow effect
    this.background.lineStyle(2, 0x000000, 0.1);
    this.background.strokeRoundedRect(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT, 8);

    this.add(this.background);
  }

  /**
   * Create priority indicator (colored bar on the left)
   */
  private createPriorityIndicator(): void {
    this.priorityIndicator = this.scene.add.graphics();
    const color = PRIORITY_COLORS[this.todo.priority];

    this.priorityIndicator.fillStyle(color, this.todo.completed ? 0.3 : 0.8);
    this.priorityIndicator.fillRoundedRect(0, 0, 6, CONFIG.CARD_HEIGHT, 8);

    this.add(this.priorityIndicator);
  }

  /**
   * Create checkbox
   */
  private createCheckbox(): void {
    this.checkbox = this.scene.add.graphics();
    this.updateCheckbox();
    this.add(this.checkbox);
  }

  /**
   * Update checkbox appearance
   */
  private updateCheckbox(): void {
    this.checkbox.clear();

    const x = 25;
    const y = CONFIG.CARD_HEIGHT / 2;
    const size = 20;

    // Draw checkbox background
    this.checkbox.fillStyle(0xffffff, 1);
    this.checkbox.fillRoundedRect(x - size / 2, y - size / 2, size, size, 4);

    // Draw checkbox border
    const borderColor = this.todo.completed ? COLORS.SUCCESS : COLORS.PRIMARY;
    this.checkbox.lineStyle(2, borderColor, 1);
    this.checkbox.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 4);

    // Draw checkmark if completed
    if (this.todo.completed) {
      this.checkbox.lineStyle(3, COLORS.SUCCESS, 1);
      this.checkbox.beginPath();
      this.checkbox.moveTo(x - 6, y);
      this.checkbox.lineTo(x - 2, y + 4);
      this.checkbox.lineTo(x + 6, y - 4);
      this.checkbox.strokePath();
    }
  }

  /**
   * Create todo text
   */
  private createText(): void {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: this.todo.completed ? '#7f8c8d' : '#2c3e50',
    };

    if (this.todo.completed) {
      textStyle.textDecoration = 'line-through';
    }

    this.textObject = this.scene.add.text(
      55,
      CONFIG.CARD_HEIGHT / 2,
      this.todo.text,
      textStyle
    );
    this.textObject.setOrigin(0, 0.5);
    this.textObject.setWordWrapWidth(this.itemWidth - 150);

    this.add(this.textObject);
  }

  /**
   * Create delete button
   */
  private createDeleteButton(): void {
    this.deleteButton = this.scene.add.text(
      this.itemWidth - 40,
      CONFIG.CARD_HEIGHT / 2,
      '×',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#e74c3c',
      }
    );
    this.deleteButton.setOrigin(0.5);
    this.deleteButton.setAlpha(0); // Initially hidden

    this.add(this.deleteButton);
  }

  /**
   * Setup interactivity
   */
  private setupInteractivity(): void {
    // Hover effects
    this.on('pointerover', () => {
      this.isHovered = true;
      this.showHoverState();
    });

    this.on('pointerout', () => {
      this.isHovered = false;
      this.hideHoverState();
    });

    // Checkbox click
    this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const localX = pointer.x - this.x;
      const localY = pointer.y - this.y;

      // Check if clicked on checkbox area
      if (localX >= 10 && localX <= 40 && localY >= 10 && localY <= CONFIG.CARD_HEIGHT - 10) {
        this.toggleComplete();
      }
      // Check if clicked on delete button
      else if (localX >= this.itemWidth - 60 && localY >= 10 && localY <= CONFIG.CARD_HEIGHT - 10) {
        this.handleDelete();
      }
    });

    // Enable dragging
    this.scene.input.setDraggable(this);

    this.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      this.y = dragY;
      this.setAlpha(0.7);
    });

    this.on('dragend', () => {
      this.setAlpha(1);
      this.emit('dragend', this);
    });
  }

  /**
   * Show hover state
   */
  private showHoverState(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.02,
      scaleY: 1.05,
      duration: 200,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: this.deleteButton,
      alpha: 1,
      duration: 200,
    });
  }

  /**
   * Hide hover state
   */
  private hideHoverState(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: this.deleteButton,
      alpha: 0,
      duration: 200,
    });
  }

  /**
   * Toggle completion status
   */
  private toggleComplete(): void {
    this.todo.completed = !this.todo.completed;

    if (this.todo.completed) {
      this.todo.completedAt = Date.now();
      this.playCompleteAnimation();
    } else {
      delete this.todo.completedAt;
    }

    this.updateAppearance();
    this.emit('toggle', this.todo);
  }

  /**
   * Play completion animation
   */
  private playCompleteAnimation(): void {
    // Scale animation
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 150,
      yoyo: true,
      ease: 'Power2',
    });

    // Emit particle event
    this.emit('complete', this.x + this.itemWidth / 2, this.y + CONFIG.CARD_HEIGHT / 2);
  }

  /**
   * Update appearance based on completion status
   */
  private updateAppearance(): void {
    const color = this.todo.completed ? COLORS.CARD_COMPLETED : COLORS.CARD;

    this.background.clear();
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT, 8);
    this.background.lineStyle(2, 0x000000, 0.1);
    this.background.strokeRoundedRect(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT, 8);

    this.updateCheckbox();

    const textColor = this.todo.completed ? '#7f8c8d' : '#2c3e50';
    this.textObject.setColor(textColor);
    this.textObject.setStyle({
      textDecoration: this.todo.completed ? 'line-through' : 'none',
    });

    // Update priority indicator opacity
    this.priorityIndicator.clear();
    const priorityColor = PRIORITY_COLORS[this.todo.priority];
    this.priorityIndicator.fillStyle(priorityColor, this.todo.completed ? 0.3 : 0.8);
    this.priorityIndicator.fillRoundedRect(0, 0, 6, CONFIG.CARD_HEIGHT, 8);
  }

  /**
   * Handle delete action
   */
  private handleDelete(): void {
    this.playDeleteAnimation();
  }

  /**
   * Play delete animation
   */
  private playDeleteAnimation(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.x + this.itemWidth + 100,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.emit('delete', this.todo);
        this.destroy();
      },
    });
  }

  /**
   * Get the todo data
   */
  getTodo(): Todo {
    return this.todo;
  }

  /**
   * Update todo data
   */
  updateTodo(todo: Todo): void {
    this.todo = todo;
    this.textObject.setText(todo.text);
    this.updateAppearance();
  }

  /**
   * Animate to position
   */
  animateToPosition(targetY: number): void {
    this.scene.tweens.add({
      targets: this,
      y: targetY,
      duration: 300,
      ease: 'Power2',
    });
  }
}
