// Todo 項目接口定義
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 應用狀態接口
interface AppState {
  todos: Todo[];
}

// TodoList 類
class TodoList {
  private state: AppState;
  private inputElement: HTMLInputElement;
  private addButton: HTMLElement;
  private todoListElement: HTMLUListElement;

  constructor() {
    this.state = {
      todos: this.loadTodos(),
    };

    // 獲取 DOM 元素
    this.inputElement = document.getElementById('myInput') as HTMLInputElement;
    this.addButton = document.getElementById('addButton') as HTMLElement;
    this.todoListElement = document.getElementById('myUL') as HTMLUListElement;

    this.init();
  }

  // 初始化
  private init(): void {
    this.render();
    this.bindEvents();
  }

  // 綁定事件
  private bindEvents(): void {
    // 添加按鈕點擊事件
    this.addButton.addEventListener('click', () => this.handleAdd());

    // 回車鍵添加
    this.inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.handleAdd();
      }
    });

    // 列表點擊事件（事件委託）
    this.todoListElement.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      // 點擊關閉按鈕
      if (target.classList.contains('close')) {
        const li = target.parentElement as HTMLLIElement;
        const id = li.dataset.id;
        if (id) {
          this.deleteTodo(id);
        }
      }
      // 點擊 li 切換完成狀態
      else if (target.tagName === 'LI') {
        const id = target.dataset.id;
        if (id) {
          this.toggleTodo(id);
        }
      }
    });
  }

  // 處理添加
  private handleAdd(): void {
    const text = this.inputElement.value.trim();

    if (!text) {
      alert('請先輸入一個具體任務。');
      return;
    }

    this.addTodo(text);
    this.inputElement.value = '';
  }

  // 添加 Todo
  private addTodo(text: string): void {
    const newTodo: Todo = {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: new Date(),
    };

    this.state.todos.push(newTodo);
    this.saveTodos();
    this.render();
  }

  // 切換完成狀態
  private toggleTodo(id: string): void {
    const todo = this.state.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
    }
  }

  // 刪除 Todo
  private deleteTodo(id: string): void {
    this.state.todos = this.state.todos.filter((t) => t.id !== id);
    this.saveTodos();
    this.render();
  }

  // 渲染列表
  private render(): void {
    // 清空列表
    this.todoListElement.innerHTML = '';

    // 渲染每個 Todo
    this.state.todos.forEach((todo) => {
      const li = this.createTodoElement(todo);
      this.todoListElement.appendChild(li);
    });
  }

  // 創建 Todo 元素
  private createTodoElement(todo: Todo): HTMLLIElement {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.dataset.id = todo.id;

    if (todo.completed) {
      li.classList.add('checked');
    }

    // 添加關閉按鈕
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '\u00D7';
    closeBtn.className = 'close';
    li.appendChild(closeBtn);

    return li;
  }

  // 生成唯一 ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 保存到 LocalStorage
  private saveTodos(): void {
    try {
      localStorage.setItem('todos', JSON.stringify(this.state.todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }

  // 從 LocalStorage 讀取
  private loadTodos(): Todo[] {
    try {
      const stored = localStorage.getItem('todos');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 恢復 Date 對象
        return parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
    return this.getDefaultTodos();
  }

  // 默認 Todos
  private getDefaultTodos(): Todo[] {
    return [
      {
        id: '1',
        text: '七點半起床',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        text: '洗漱',
        completed: true,
        createdAt: new Date(),
      },
      {
        id: '3',
        text: '去上班',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: '4',
        text: '完成報表',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: '5',
        text: '和小明吃午飯',
        completed: false,
        createdAt: new Date(),
      },
      {
        id: '6',
        text: '去超市',
        completed: false,
        createdAt: new Date(),
      },
    ];
  }
}

// DOM 載入完成後初始化
window.addEventListener('DOMContentLoaded', () => {
  new TodoList();
});
