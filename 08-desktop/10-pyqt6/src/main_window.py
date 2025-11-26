"""主窗口实现"""
from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QLineEdit, QPushButton, QListWidget, QListWidgetItem,
    QMessageBox
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont
from typing import List
from pathlib import Path
import uuid

from todo_model import Todo
from todo_item import TodoItemWidget
from storage import TodoStorage


class MainWindow(QMainWindow):
    """Todo List 主窗口"""

    def __init__(self):
        """初始化主窗口"""
        super().__init__()
        self.storage = TodoStorage()
        self.todos: List[Todo] = []

        self._setup_ui()
        self._load_data()

    def _setup_ui(self) -> None:
        """设置 UI 组件"""
        self.setWindowTitle("PyQt6 Todo List")
        self.setMinimumSize(600, 500)

        # 中心 Widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # 主布局
        main_layout = QVBoxLayout(central_widget)
        main_layout.setSpacing(10)
        main_layout.setContentsMargins(20, 20, 20, 20)

        # 标题
        title = QLabel("📝 Todo List")
        title_font = QFont()
        title_font.setPointSize(20)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(title)

        # 输入区域
        input_layout = QHBoxLayout()

        self.input_field = QLineEdit()
        self.input_field.setPlaceholderText("输入新任务...")
        self.input_field.returnPressed.connect(self._add_todo)
        input_layout.addWidget(self.input_field)

        self.add_button = QPushButton("添加")
        self.add_button.setFixedWidth(80)
        self.add_button.clicked.connect(self._add_todo)
        input_layout.addWidget(self.add_button)

        main_layout.addLayout(input_layout)

        # 任务列表
        self.todo_list = QListWidget()
        self.todo_list.setSpacing(2)
        main_layout.addWidget(self.todo_list)

        # 统计信息
        stats_layout = QHBoxLayout()

        self.stats_label = QLabel()
        self.stats_label.setStyleSheet("color: gray;")
        stats_layout.addWidget(self.stats_label)

        stats_layout.addStretch()

        self.clear_button = QPushButton("清除已完成")
        self.clear_button.clicked.connect(self._clear_completed)
        stats_layout.addWidget(self.clear_button)

        main_layout.addLayout(stats_layout)

        # 应用样式
        self._apply_styles()

    def _apply_styles(self) -> None:
        """应用样式"""
        # 尝试加载外部 QSS 文件
        qss_path = Path(__file__).parent.parent / "resources" / "style.qss"

        if qss_path.exists():
            try:
                with open(qss_path, 'r', encoding='utf-8') as f:
                    self.setStyleSheet(f.read())
                return
            except Exception as e:
                print(f"加载 QSS 文件失败: {e}")

        # 如果外部文件不存在或加载失败，使用内嵌样式作为后备
        self.setStyleSheet("""
            QMainWindow {
                background-color: #f5f5f5;
            }
            QLineEdit {
                padding: 8px;
                border: 2px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            QLineEdit:focus {
                border-color: #4CAF50;
            }
            QPushButton {
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QPushButton:pressed {
                background-color: #3d8b40;
            }
            QListWidget {
                border: 2px solid #ddd;
                border-radius: 4px;
                background-color: white;
            }
        """)

    def _load_data(self) -> None:
        """从存储加载数据"""
        self.todos = self.storage.load()
        self._refresh_list()

    def _save_data(self) -> None:
        """保存数据到存储"""
        self.storage.save(self.todos)

    def _refresh_list(self) -> None:
        """刷新任务列表显示"""
        self.todo_list.clear()

        for todo in self.todos:
            item = QListWidgetItem(self.todo_list)
            widget = TodoItemWidget(todo)
            widget.toggled.connect(self._on_todo_toggled)
            widget.deleted.connect(self._on_todo_deleted)

            item.setSizeHint(widget.sizeHint())
            self.todo_list.addItem(item)
            self.todo_list.setItemWidget(item, widget)

        self._update_stats()

    def _add_todo(self) -> None:
        """添加新任务"""
        title = self.input_field.text().strip()
        if not title:
            return

        todo = Todo(
            id=str(uuid.uuid4()),
            title=title
        )
        self.todos.append(todo)
        self.input_field.clear()

        self._save_data()
        self._refresh_list()

    def _on_todo_toggled(self, todo_id: str) -> None:
        """处理任务状态切换"""
        self._save_data()
        self._update_stats()

    def _on_todo_deleted(self, todo_id: str) -> None:
        """处理任务删除"""
        self.todos = [t for t in self.todos if t.id != todo_id]
        self._save_data()
        self._refresh_list()

    def _clear_completed(self) -> None:
        """清除已完成的任务"""
        completed_count = sum(1 for t in self.todos if t.completed)
        if completed_count == 0:
            QMessageBox.information(self, "提示", "没有已完成的任务")
            return

        reply = QMessageBox.question(
            self, "确认",
            f"确定要删除 {completed_count} 个已完成的任务吗？",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )

        if reply == QMessageBox.StandardButton.Yes:
            self.todos = [t for t in self.todos if not t.completed]
            self._save_data()
            self._refresh_list()

    def _update_stats(self) -> None:
        """更新统计信息"""
        total = len(self.todos)
        completed = sum(1 for t in self.todos if t.completed)
        active = total - completed

        self.stats_label.setText(
            f"总计: {total} | 进行中: {active} | 已完成: {completed}"
        )
