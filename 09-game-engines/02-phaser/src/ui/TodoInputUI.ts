import Phaser from 'phaser';
import { COLORS, CONFIG, Priority } from '../types';

/**
 * TodoInputUI creates a DOM-based input field for adding new todos
 * Phaser doesn't have native text input, so we use HTML elements
 */
export class TodoInputUI {
  private scene: Phaser.Scene;
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  private addButton: HTMLButtonElement;
  private prioritySelect: HTMLSelectElement;
  private onSubmitCallback?: (text: string, priority: Priority) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.createContainer();
    this.createInput();
    this.createPrioritySelect();
    this.createAddButton();
    this.setupEventListeners();
  }

  /**
   * Create the main container
   */
  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'todo-input-container';
    this.container.style.position = 'absolute';
    this.container.style.left = '50%';
    this.container.style.top = `${CONFIG.HEADER_HEIGHT}px`;
    this.container.style.transform = 'translateX(-50%)';
    this.container.style.width = `${CONFIG.CARD_WIDTH}px`;
    this.container.style.height = `${CONFIG.INPUT_HEIGHT}px`;
    this.container.style.display = 'flex';
    this.container.style.gap = '10px';
    this.container.style.zIndex = '1000';
    this.container.style.padding = '10px';
    this.container.style.backgroundColor = 'transparent';

    document.body.appendChild(this.container);
  }

  /**
   * Create the text input field
   */
  private createInput(): void {
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'What needs to be done?';
    this.input.style.flex = '1';
    this.input.style.padding = '12px 16px';
    this.input.style.fontSize = '16px';
    this.input.style.border = '2px solid #3498db';
    this.input.style.borderRadius = '8px';
    this.input.style.outline = 'none';
    this.input.style.backgroundColor = '#ffffff';
    this.input.style.color = '#2c3e50';
    this.input.style.fontFamily = 'Arial, sans-serif';
    this.input.style.transition = 'all 0.3s ease';

    // Focus styles
    this.input.addEventListener('focus', () => {
      this.input.style.borderColor = '#2980b9';
      this.input.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.2)';
    });

    this.input.addEventListener('blur', () => {
      this.input.style.borderColor = '#3498db';
      this.input.style.boxShadow = 'none';
    });

    this.container.appendChild(this.input);
  }

  /**
   * Create priority select dropdown
   */
  private createPrioritySelect(): void {
    this.prioritySelect = document.createElement('select');
    this.prioritySelect.style.padding = '12px 16px';
    this.prioritySelect.style.fontSize = '16px';
    this.prioritySelect.style.border = '2px solid #3498db';
    this.prioritySelect.style.borderRadius = '8px';
    this.prioritySelect.style.outline = 'none';
    this.prioritySelect.style.backgroundColor = '#ffffff';
    this.prioritySelect.style.color = '#2c3e50';
    this.prioritySelect.style.fontFamily = 'Arial, sans-serif';
    this.prioritySelect.style.cursor = 'pointer';
    this.prioritySelect.style.minWidth = '120px';

    const priorities = [
      { value: Priority.LOW, label: '🟢 Low', color: '#2ecc71' },
      { value: Priority.MEDIUM, label: '🟡 Medium', color: '#f39c12' },
      { value: Priority.HIGH, label: '🔴 High', color: '#e74c3c' },
    ];

    priorities.forEach((priority) => {
      const option = document.createElement('option');
      option.value = priority.value;
      option.textContent = priority.label;
      this.prioritySelect.appendChild(option);
    });

    // Set default to medium
    this.prioritySelect.value = Priority.MEDIUM;

    this.container.appendChild(this.prioritySelect);
  }

  /**
   * Create the add button
   */
  private createAddButton(): void {
    this.addButton = document.createElement('button');
    this.addButton.textContent = '+ Add';
    this.addButton.style.padding = '12px 24px';
    this.addButton.style.fontSize = '16px';
    this.addButton.style.fontWeight = 'bold';
    this.addButton.style.border = 'none';
    this.addButton.style.borderRadius = '8px';
    this.addButton.style.backgroundColor = '#3498db';
    this.addButton.style.color = '#ffffff';
    this.addButton.style.cursor = 'pointer';
    this.addButton.style.fontFamily = 'Arial, sans-serif';
    this.addButton.style.transition = 'all 0.3s ease';
    this.addButton.style.minWidth = '100px';

    // Hover effects
    this.addButton.addEventListener('mouseenter', () => {
      this.addButton.style.backgroundColor = '#2980b9';
      this.addButton.style.transform = 'translateY(-2px)';
      this.addButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });

    this.addButton.addEventListener('mouseleave', () => {
      this.addButton.style.backgroundColor = '#3498db';
      this.addButton.style.transform = 'translateY(0)';
      this.addButton.style.boxShadow = 'none';
    });

    // Active state
    this.addButton.addEventListener('mousedown', () => {
      this.addButton.style.transform = 'translateY(0)';
    });

    this.container.appendChild(this.addButton);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Add button click
    this.addButton.addEventListener('click', () => this.handleSubmit());

    // Enter key press
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSubmit();
      }
    });
  }

  /**
   * Handle form submission
   */
  private handleSubmit(): void {
    const text = this.input.value.trim();
    if (text && this.onSubmitCallback) {
      const priority = this.prioritySelect.value as Priority;
      this.onSubmitCallback(text, priority);
      this.clear();
      this.playSubmitAnimation();
    }
  }

  /**
   * Play submit animation
   */
  private playSubmitAnimation(): void {
    this.addButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.addButton.style.transform = 'scale(1)';
    }, 100);
  }

  /**
   * Clear the input field
   */
  private clear(): void {
    this.input.value = '';
    this.prioritySelect.value = Priority.MEDIUM;
  }

  /**
   * Set the submit callback
   */
  onSubmit(callback: (text: string, priority: Priority) => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Focus the input field
   */
  focus(): void {
    this.input.focus();
  }

  /**
   * Destroy the input UI
   */
  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * Update position based on game canvas position
   */
  updatePosition(): void {
    const canvas = this.scene.game.canvas;
    const rect = canvas.getBoundingClientRect();

    this.container.style.left = `${rect.left + CONFIG.GAME_WIDTH / 2}px`;
    this.container.style.top = `${rect.top + CONFIG.HEADER_HEIGHT}px`;
  }
}
