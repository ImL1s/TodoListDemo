/**
 * Todo item interface
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * Filter types for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Custom event detail for todo-related events
 */
export interface TodoEventDetail {
  id?: string;
  text?: string;
  completed?: boolean;
}

/**
 * Custom events
 */
export class TodoAddEvent extends CustomEvent<{ text: string }> {
  constructor(text: string) {
    super('todo-add', {
      detail: { text },
      bubbles: true,
      composed: true
    });
  }
}

export class TodoToggleEvent extends CustomEvent<{ id: string }> {
  constructor(id: string) {
    super('todo-toggle', {
      detail: { id },
      bubbles: true,
      composed: true
    });
  }
}

export class TodoDeleteEvent extends CustomEvent<{ id: string }> {
  constructor(id: string) {
    super('todo-delete', {
      detail: { id },
      bubbles: true,
      composed: true
    });
  }
}

export class TodoEditEvent extends CustomEvent<{ id: string; text: string }> {
  constructor(id: string, text: string) {
    super('todo-edit', {
      detail: { id, text },
      bubbles: true,
      composed: true
    });
  }
}

/**
 * Declare custom event types for TypeScript
 */
declare global {
  interface HTMLElementEventMap {
    'todo-add': TodoAddEvent;
    'todo-toggle': TodoToggleEvent;
    'todo-delete': TodoDeleteEvent;
    'todo-edit': TodoEditEvent;
  }
}
