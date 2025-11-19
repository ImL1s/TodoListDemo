import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../../models/todo.interface';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * TodoItemComponent
 *
 * Standalone component representing a single todo item.
 * Supports inline editing, toggle, and deletion.
 *
 * Features:
 * - Checkbox toggle with animation
 * - Inline editing mode
 * - Swipe-to-delete gesture (Ionic ItemSliding)
 * - Haptic feedback on interactions
 * - Completed state styling
 * - OnPush change detection for performance
 */
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; text: string }>();

  isEditing = false;
  editText = '';

  /**
   * Toggle the completed status of the todo
   */
  async onToggle(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics might not be available on web
      // Silent fail on web platform
    }
    this.toggle.emit(this.todo.id);
  }

  /**
   * Delete the todo item
   */
  async onDelete(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Silent fail on web platform
    }
    this.delete.emit(this.todo.id);
  }

  /**
   * Start editing mode
   */
  startEdit(): void {
    if (!this.todo.completed) {
      this.isEditing = true;
      this.editText = this.todo.text;
    }
  }

  /**
   * Save the edited todo
   */
  saveEdit(): void {
    if (this.editText.trim() && this.editText !== this.todo.text) {
      this.update.emit({ id: this.todo.id, text: this.editText });
    }
    this.isEditing = false;
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.isEditing = false;
    this.editText = '';
  }

  /**
   * Handle key press in edit mode
   */
  onEditKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}
