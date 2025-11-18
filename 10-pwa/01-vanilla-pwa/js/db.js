/**
 * PWA Todo List - IndexedDB 數據庫操作
 * 提供離線數據存儲和管理功能
 */

class TodoDB {
  constructor() {
    this.dbName = 'PWATodoDB';
    this.dbVersion = 1;
    this.storeName = 'todos';
    this.db = null;
  }

  /**
   * 初始化數據庫
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    return new Promise((resolve, reject) => {
      // 檢查瀏覽器是否支援 IndexedDB
      if (!window.indexedDB) {
        reject(new Error('您的瀏覽器不支援 IndexedDB'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      // 數據庫升級事件（首次創建或版本更新時觸發）
      request.onupgradeneeded = (event) => {
        console.log('[IndexedDB] Upgrading database...');
        const db = event.target.result;

        // 刪除舊的 object store（如果存在）
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }

        // 創建 object store
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true
        });

        // 創建索引
        objectStore.createIndex('completed', 'completed', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('text', 'text', { unique: false });

        console.log('[IndexedDB] Object store created');
      };

      // 成功打開數據庫
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('[IndexedDB] Database opened successfully');
        resolve(this.db);
      };

      // 打開數據庫失敗
      request.onerror = (event) => {
        console.error('[IndexedDB] Database error:', event.target.error);
        reject(event.target.error);
      };

      // 數據庫被阻塞（另一個版本正在使用）
      request.onblocked = () => {
        console.warn('[IndexedDB] Database blocked');
      };
    });
  }

  /**
   * 獲取數據庫事務
   * @param {string} mode - 事務模式（'readonly' 或 'readwrite'）
   * @returns {IDBTransaction}
   */
  getTransaction(mode = 'readonly') {
    return this.db.transaction([this.storeName], mode);
  }

  /**
   * 獲取 object store
   * @param {string} mode - 事務模式
   * @returns {IDBObjectStore}
   */
  getObjectStore(mode = 'readonly') {
    const transaction = this.getTransaction(mode);
    return transaction.objectStore(this.storeName);
  }

  /**
   * 新增待辦事項
   * @param {Object} todo - 待辦事項對象
   * @returns {Promise<number>} 新增項目的 ID
   */
  async add(todo) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite');

      const todoData = {
        text: todo.text,
        completed: todo.completed || false,
        createdAt: todo.createdAt || Date.now(),
        updatedAt: Date.now()
      };

      const request = objectStore.add(todoData);

      request.onsuccess = () => {
        console.log('[IndexedDB] Todo added:', request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Add error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 獲取所有待辦事項
   * @returns {Promise<Array>}
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readonly');
      const request = objectStore.getAll();

      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved all todos:', request.result.length);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('[IndexedDB] GetAll error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 根據 ID 獲取待辦事項
   * @param {number} id - 待辦事項 ID
   * @returns {Promise<Object>}
   */
  async get(id) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readonly');
      const request = objectStore.get(id);

      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved todo:', id);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('[IndexedDB] Get error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 更新待辦事項
   * @param {Object} todo - 包含 id 的待辦事項對象
   * @returns {Promise<void>}
   */
  async update(todo) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite');

      const todoData = {
        ...todo,
        updatedAt: Date.now()
      };

      const request = objectStore.put(todoData);

      request.onsuccess = () => {
        console.log('[IndexedDB] Todo updated:', todo.id);
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Update error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 刪除待辦事項
   * @param {number} id - 待辦事項 ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite');
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('[IndexedDB] Todo deleted:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Delete error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 切換待辦事項完成狀態
   * @param {number} id - 待辦事項 ID
   * @returns {Promise<void>}
   */
  async toggleComplete(id) {
    try {
      const todo = await this.get(id);
      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }

      todo.completed = !todo.completed;
      await this.update(todo);

      console.log('[IndexedDB] Todo toggled:', id);
    } catch (error) {
      console.error('[IndexedDB] Toggle error:', error);
      throw error;
    }
  }

  /**
   * 清除所有已完成的待辦事項
   * @returns {Promise<number>} 刪除的數量
   */
  async clearCompleted() {
    return new Promise(async (resolve, reject) => {
      try {
        const objectStore = this.getObjectStore('readwrite');
        const index = objectStore.index('completed');
        const request = index.openCursor(IDBKeyRange.only(true));

        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            console.log('[IndexedDB] Cleared completed todos:', deletedCount);
            resolve(deletedCount);
          }
        };

        request.onerror = () => {
          console.error('[IndexedDB] Clear completed error:', request.error);
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 清除所有待辦事項
   * @returns {Promise<void>}
   */
  async clearAll() {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite');
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('[IndexedDB] All todos cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Clear all error:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 根據條件過濾待辦事項
   * @param {Function} filterFn - 過濾函數
   * @returns {Promise<Array>}
   */
  async filter(filterFn) {
    const todos = await this.getAll();
    return todos.filter(filterFn);
  }

  /**
   * 獲取已完成的待辦事項
   * @returns {Promise<Array>}
   */
  async getCompleted() {
    return this.filter(todo => todo.completed);
  }

  /**
   * 獲取未完成的待辦事項
   * @returns {Promise<Array>}
   */
  async getActive() {
    return this.filter(todo => !todo.completed);
  }

  /**
   * 搜尋待辦事項
   * @param {string} query - 搜尋關鍵字
   * @returns {Promise<Array>}
   */
  async search(query) {
    const todos = await this.getAll();
    const lowercaseQuery = query.toLowerCase();

    return todos.filter(todo =>
      todo.text.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * 獲取統計資訊
   * @returns {Promise<Object>}
   */
  async getStats() {
    const todos = await this.getAll();

    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  }

  /**
   * 批量新增待辦事項
   * @param {Array} todos - 待辦事項陣列
   * @returns {Promise<void>}
   */
  async bulkAdd(todos) {
    return new Promise((resolve, reject) => {
      const transaction = this.getTransaction('readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      todos.forEach(todo => {
        const todoData = {
          text: todo.text,
          completed: todo.completed || false,
          createdAt: todo.createdAt || Date.now(),
          updatedAt: Date.now()
        };
        objectStore.add(todoData);
      });

      transaction.oncomplete = () => {
        console.log('[IndexedDB] Bulk add completed:', todos.length);
        resolve();
      };

      transaction.onerror = () => {
        console.error('[IndexedDB] Bulk add error:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  /**
   * 匯出所有數據為 JSON
   * @returns {Promise<string>}
   */
  async exportToJSON() {
    const todos = await this.getAll();
    return JSON.stringify({
      version: this.dbVersion,
      exportDate: new Date().toISOString(),
      todos: todos
    }, null, 2);
  }

  /**
   * 從 JSON 匯入數據
   * @param {string} jsonString - JSON 字串
   * @returns {Promise<number>} 匯入的數量
   */
  async importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (!data.todos || !Array.isArray(data.todos)) {
        throw new Error('Invalid JSON format');
      }

      // 清除現有數據（可選）
      // await this.clearAll();

      // 批量新增
      await this.bulkAdd(data.todos);

      console.log('[IndexedDB] Import completed:', data.todos.length);
      return data.todos.length;
    } catch (error) {
      console.error('[IndexedDB] Import error:', error);
      throw error;
    }
  }

  /**
   * 關閉數據庫連接
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('[IndexedDB] Database closed');
    }
  }

  /**
   * 刪除數據庫
   * @returns {Promise<void>}
   */
  async deleteDatabase() {
    return new Promise((resolve, reject) => {
      this.close();

      const request = indexedDB.deleteDatabase(this.dbName);

      request.onsuccess = () => {
        console.log('[IndexedDB] Database deleted');
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Delete database error:', request.error);
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn('[IndexedDB] Delete blocked');
      };
    });
  }
}

// 創建全局實例
const todoDB = new TodoDB();

// 自動初始化
if (typeof window !== 'undefined') {
  todoDB.init().catch(error => {
    console.error('[IndexedDB] Initialization failed:', error);
  });
}
