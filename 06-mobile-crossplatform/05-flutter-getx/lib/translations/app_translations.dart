import 'package:get/get.dart';

/// GetX 國際化配置
///
/// GetX 提供了簡單易用的國際化方案：
/// 1. 使用 Translations 類定義翻譯
/// 2. 在 GetMaterialApp 中配置 translations 和 locale
/// 3. 使用 .tr 擴展方法獲取翻譯文本
/// 4. 使用 Get.updateLocale() 動態切換語言
class AppTranslations extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        // 繁體中文
        'zh_TW': {
          // 通用
          'app_title': 'GetX 待辦清單',
          'confirm': '確認',
          'cancel': '取消',
          'save': '儲存',
          'delete': '刪除',
          'edit': '編輯',
          'add': '新增',
          'success': '成功',
          'error': '錯誤',
          'loading': '載入中...',

          // 主頁
          'total': '全部',
          'active': '進行中',
          'completed': '已完成',
          'all': '全部',
          'clear_completed': '清除已完成',
          'toggle_all': '全選/取消全選',

          // Todo 操作
          'add_todo': '新增待辦',
          'add_todo_title': '新增待辦事項',
          'edit_todo_title': '編輯待辦事項',
          'input_hint': '輸入待辦事項...',
          'input_new_content': '輸入新內容...',
          'todo_added': '已新增待辦事項',
          'todo_deleted': '已刪除待辦事項',
          'completed_cleared': '已清除所有已完成事項',

          // 確認對話框
          'confirm_delete': '確認刪除',
          'confirm_delete_message': '確定要刪除「@title」嗎？',
          'confirm_clear': '確認清除',
          'confirm_clear_message': '確定要清除所有 @count 個已完成的事項嗎？',

          // 空狀態
          'no_todos': '還沒有任何待辦事項\n點擊下方按鈕新增',
          'no_active_todos': '沒有進行中的待辦事項',
          'no_completed_todos': '還沒有完成任何事項',

          // 歡迎 Todos
          'welcome_todo_1': '學習 Flutter GetX',
          'welcome_todo_2': '了解響應式狀態管理',
          'welcome_todo_3': '比較 GetX vs Riverpod',

          // 設置頁面
          'settings': '設置',
          'theme': '主題',
          'language': '語言',
          'light_theme': '淺色主題',
          'dark_theme': '深色主題',
          'system_theme': '跟隨系統',
          'chinese': '繁體中文',
          'english': 'English',
          'about': '關於',
          'version': '版本',
          'storage_info': '存儲資訊',
          'clear_all_data': '清除所有數據',
          'clear_data_confirm': '確定要清除所有數據嗎？此操作無法復原。',
          'data_cleared': '數據已清除',
          'has_cache': '有緩存數據',
          'no_cache': '無緩存數據',

          // 統計
          'stats_total': '共 %s 項',
          'stats_active': '%s 項進行中',
          'stats_completed': '%s 項已完成',

          // Workers 演示
          'worker_demo': 'Workers 演示',
          'search_hint': '搜索待辦事項...',
          'debounce_info': '防抖搜索（500ms）',
          'ever_info': '監聽所有變化',
          'once_info': '只監聽一次',
        },

        // English
        'en_US': {
          // General
          'app_title': 'GetX Todo List',
          'confirm': 'Confirm',
          'cancel': 'Cancel',
          'save': 'Save',
          'delete': 'Delete',
          'edit': 'Edit',
          'add': 'Add',
          'success': 'Success',
          'error': 'Error',
          'loading': 'Loading...',

          // Home
          'total': 'Total',
          'active': 'Active',
          'completed': 'Completed',
          'all': 'All',
          'clear_completed': 'Clear Completed',
          'toggle_all': 'Toggle All',

          // Todo operations
          'add_todo': 'Add Todo',
          'add_todo_title': 'Add Todo Item',
          'edit_todo_title': 'Edit Todo Item',
          'input_hint': 'Enter todo item...',
          'input_new_content': 'Enter new content...',
          'todo_added': 'Todo item added',
          'todo_deleted': 'Todo item deleted',
          'completed_cleared': 'All completed items cleared',

          // Confirm dialogs
          'confirm_delete': 'Confirm Delete',
          'confirm_delete_message': 'Delete "@title"?',
          'confirm_clear': 'Confirm Clear',
          'confirm_clear_message': 'Clear all @count completed items?',

          // Empty states
          'no_todos': 'No todos yet\nTap the button below to add one',
          'no_active_todos': 'No active todos',
          'no_completed_todos': 'No completed todos yet',

          // Welcome Todos
          'welcome_todo_1': 'Learn Flutter GetX',
          'welcome_todo_2': 'Understand reactive state management',
          'welcome_todo_3': 'Compare GetX vs Riverpod',

          // Settings
          'settings': 'Settings',
          'theme': 'Theme',
          'language': 'Language',
          'light_theme': 'Light Theme',
          'dark_theme': 'Dark Theme',
          'system_theme': 'System',
          'chinese': '繁體中文',
          'english': 'English',
          'about': 'About',
          'version': 'Version',
          'storage_info': 'Storage Info',
          'clear_all_data': 'Clear All Data',
          'clear_data_confirm':
              'Are you sure to clear all data? This cannot be undone.',
          'data_cleared': 'Data cleared',
          'has_cache': 'Has cache data',
          'no_cache': 'No cache data',

          // Statistics
          'stats_total': '%s items total',
          'stats_active': '%s active',
          'stats_completed': '%s completed',

          // Workers demo
          'worker_demo': 'Workers Demo',
          'search_hint': 'Search todos...',
          'debounce_info': 'Debounced search (500ms)',
          'ever_info': 'Listen to all changes',
          'once_info': 'Listen once',
        },
      };
}
