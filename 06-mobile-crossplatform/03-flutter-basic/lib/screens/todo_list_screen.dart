import 'package:flutter/material.dart';
import '../models/todo.dart';
import '../widgets/todo_item.dart';
import '../services/todo_storage_service.dart';

/// Todo 列表頁面
///
/// 這是一個 StatefulWidget，管理整個應用的狀態
/// 使用 setState() 來更新 UI
class TodoListScreen extends StatefulWidget {
  const TodoListScreen({Key? key}) : super(key: key);

  @override
  State<TodoListScreen> createState() => _TodoListScreenState();
}

/// TodoListScreen 的狀態類
///
/// 這個類包含了所有的狀態管理邏輯：
/// - 待辦事項列表
/// - 添加、刪除、編輯、切換待辦事項
/// - 過濾顯示（全部、未完成、已完成）
class _TodoListScreenState extends State<TodoListScreen> {
  /// 存儲所有待辦事項的列表
  final List<Todo> _todos = [];

  /// 文本輸入控制器
  final TextEditingController _textController = TextEditingController();

  /// 過濾選項：'all'（全部）、'active'（未完成）、'completed'（已完成）
  String _filter = 'all';

  /// 數據是否正在加載
  bool _isLoading = true;

  /// 錯誤信息
  String? _errorMessage;


  @override
  void initState() {
    super.initState();
    _loadTodos();
  }

  /// 從本地存儲加載待辦事項
  Future<void> _loadTodos() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final todos = await TodoStorageService.loadTodos();
      setState(() {
        _todos.clear();
        if (todos.isEmpty) {
          // 如果是首次使用，添加一些示例數據
          _todos.addAll([
            Todo(title: '學習 Flutter 基礎'),
            Todo(title: '理解 StatefulWidget', isCompleted: true),
            Todo(title: '掌握 setState 用法'),
          ]);
          _saveTodos(); // 保存示例數據
        } else {
          _todos.addAll(todos);
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = '加載數據失敗: $e';
        _isLoading = false;
      });
    }
  }

  /// 保存待辦事項到本地存儲
  Future<void> _saveTodos() async {
    try {
      await TodoStorageService.saveTodos(_todos);
    } catch (e) {
      _showSnackBar('保存失敗: $e');
    }
  }

  @override
  void dispose() {
    // 釋放資源
    _textController.dispose();
    super.dispose();
  }

  /// 添加新的待辦事項
  void _addTodo(String title) {
    if (title.trim().isEmpty) {
      _showSnackBar('請輸入待辦事項內容');
      return;
    }

    setState(() {
      _todos.add(Todo(title: title.trim()));
      _textController.clear();
    });

    _saveTodos();
    _showSnackBar('已添加：$title');
  }

  /// 切換待辦事項的完成狀態
  void _toggleTodo(String id) {
    setState(() {
      final todo = _todos.firstWhere((t) => t.id == id);
      todo.toggleCompleted();
    });
    _saveTodos();
  }

  /// 刪除待辦事項
  void _deleteTodo(String id) {
    final todo = _todos.firstWhere((t) => t.id == id);
    setState(() {
      _todos.removeWhere((t) => t.id == id);
    });
    _saveTodos();
    _showSnackBar('已刪除：${todo.title}');
  }

  /// 編輯待辦事項
  void _editTodo(Todo todo) {
    final controller = TextEditingController(text: todo.title);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('編輯待辦事項'),
          content: TextField(
            controller: controller,
            autofocus: true,
            decoration: const InputDecoration(
              labelText: '待辦事項',
              border: OutlineInputBorder(),
            ),
            onSubmitted: (value) {
              if (value.trim().isNotEmpty) {
                setState(() {
                  todo.title = value.trim();
                });
                _saveTodos();
                Navigator.of(context).pop();
                _showSnackBar('已更新');
              }
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('取消'),
            ),
            ElevatedButton(
              onPressed: () {
                if (controller.text.trim().isNotEmpty) {
                  setState(() {
                    todo.title = controller.text.trim();
                  });
                  _saveTodos();
                  Navigator.of(context).pop();
                  _showSnackBar('已更新');
                }
              },
              child: const Text('保存'),
            ),
          ],
        );
      },
    );
  }

  /// 清除所有已完成的待辦事項
  void _clearCompleted() {
    final completedCount = _todos.where((t) => t.isCompleted).length;

    if (completedCount == 0) {
      _showSnackBar('沒有已完成的待辦事項');
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('清除已完成'),
          content: Text('確定要清除 $completedCount 個已完成的待辦事項嗎？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('取消'),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _todos.removeWhere((t) => t.isCompleted);
                });
                _saveTodos();
                Navigator.of(context).pop();
                _showSnackBar('已清除 $completedCount 個已完成項目');
              },
              style: TextButton.styleFrom(
                foregroundColor: Colors.red,
              ),
              child: const Text('清除'),
            ),
          ],
        );
      },
    );
  }

  /// 根據過濾條件獲取待辦事項列表
  List<Todo> get _filteredTodos {
    switch (_filter) {
      case 'active':
        return _todos.where((t) => !t.isCompleted).toList();
      case 'completed':
        return _todos.where((t) => t.isCompleted).toList();
      default:
        return _todos;
    }
  }

  /// 顯示 SnackBar 提示
  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  /// 顯示添加待辦事項對話框
  void _showAddTodoDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('添加待辦事項'),
          content: TextField(
            controller: _textController,
            autofocus: true,
            decoration: const InputDecoration(
              labelText: '待辦事項',
              hintText: '請輸入待辦事項內容',
              border: OutlineInputBorder(),
            ),
            onSubmitted: (value) {
              _addTodo(value);
              Navigator.of(context).pop();
            },
          ),
          actions: [
            TextButton(
              onPressed: () {
                _textController.clear();
                Navigator.of(context).pop();
              },
              child: const Text('取消'),
            ),
            ElevatedButton(
              onPressed: () {
                _addTodo(_textController.text);
                Navigator.of(context).pop();
              },
              child: const Text('添加'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // 如果正在加載，顯示加載指示器
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // 如果有錯誤，顯示錯誤信息
    if (_errorMessage != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadTodos,
                child: const Text('重試'),
              ),
            ],
          ),
        ),
      );
    }

    final filteredTodos = _filteredTodos;
    final totalCount = _todos.length;
    final activeCount = _todos.where((t) => !t.isCompleted).length;
    final completedCount = _todos.where((t) => t.isCompleted).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter 基礎 Todo List'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          // 清除已完成按鈕
          if (completedCount > 0)
            IconButton(
              icon: const Icon(Icons.cleaning_services),
              onPressed: _clearCompleted,
              tooltip: '清除已完成',
            ),
        ],
      ),

      body: Column(
        children: [
          // 統計信息卡片
          Card(
            margin: const EdgeInsets.all(16),
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem('總計', totalCount, Colors.blue),
                  _buildStatItem('未完成', activeCount, Colors.orange),
                  _buildStatItem('已完成', completedCount, Colors.green),
                ],
              ),
            ),
          ),

          // 過濾按鈕組
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: _buildFilterChip('全部', 'all'),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildFilterChip('未完成', 'active'),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildFilterChip('已完成', 'completed'),
                ),
              ],
            ),
          ),

          // 待辦事項列表
          Expanded(
            child: filteredTodos.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    physics: const BouncingScrollPhysics(),
                    itemCount: filteredTodos.length,
                    itemBuilder: (context, index) {
                      final todo = filteredTodos[index];
                      // 使用 AnimatedSwitcher 為每個項目添加過渡動畫
                      return AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        transitionBuilder: (child, animation) {
                          return FadeTransition(
                            opacity: animation,
                            child: SlideTransition(
                              position: Tween<Offset>(
                                begin: const Offset(0.2, 0),
                                end: Offset.zero,
                              ).animate(CurvedAnimation(
                                parent: animation,
                                curve: Curves.easeOut,
                              )),
                              child: child,
                            ),
                          );
                        },
                        child: TodoItem(
                          key: ValueKey(todo.id),
                          todo: todo,
                          onToggle: () => _toggleTodo(todo.id),
                          onDelete: () => _deleteTodo(todo.id),
                          onEdit: () => _editTodo(todo),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),

      // 浮動操作按鈕
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddTodoDialog,
        icon: const Icon(Icons.add),
        label: const Text('添加'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
    );
  }

  /// 構建統計項目
  Widget _buildStatItem(String label, int count, Color color) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  /// 構建過濾選項芯片
  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filter == value;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _filter = value;
        });
      },
      selectedColor: Colors.blue.withOpacity(0.3),
      checkmarkColor: Colors.blue,
    );
  }

  /// 構建空狀態視圖
  Widget _buildEmptyState() {
    String message;
    IconData icon;

    switch (_filter) {
      case 'active':
        message = '沒有未完成的待辦事項\n太棒了！';
        icon = Icons.check_circle_outline;
        break;
      case 'completed':
        message = '沒有已完成的待辦事項\n開始完成一些任務吧！';
        icon = Icons.assignment_turned_in;
        break;
      default:
        message = '還沒有待辦事項\n點擊下方按鈕添加';
        icon = Icons.inbox;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 80,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}
