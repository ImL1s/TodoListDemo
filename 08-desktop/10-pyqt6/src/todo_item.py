"""Todo 任务项 Widget"""
from PyQt6.QtWidgets import (
    QWidget, QHBoxLayout, QCheckBox, QPushButton, QLabel
)
from PyQt6.QtCore import pyqtSignal
from todo_model import Todo


class TodoItemWidget(QWidget):
    """单个 Todo 任务的 Widget"""

    # 自定义信号
    toggled = pyqtSignal(str)  # todo_id
    deleted = pyqtSignal(str)  # todo_id

    def __init__(self, todo: Todo, parent=None):
        """
        初始化 Todo 项

        Args:
            todo: Todo 数据模型
            parent: 父 Widget
        """
        super().__init__(parent)
        self.todo = todo
        self._setup_ui()

    def _setup_ui(self) -> None:
        """设置 UI 组件"""
        layout = QHBoxLayout(self)
        layout.setContentsMargins(5, 5, 5, 5)

        # 复选框
        self.checkbox = QCheckBox()
        self.checkbox.setChecked(self.todo.completed)
        self.checkbox.stateChanged.connect(self._on_toggle)
        layout.addWidget(self.checkbox)

        # 任务标题
        self.label = QLabel(self.todo.title)
        if self.todo.completed:
            self.label.setStyleSheet("text-decoration: line-through; color: gray;")
        layout.addWidget(self.label, stretch=1)

        # 删除按钮
        self.delete_btn = QPushButton("删除")
        self.delete_btn.setFixedWidth(60)
        self.delete_btn.clicked.connect(self._on_delete)
        layout.addWidget(self.delete_btn)

        self.setLayout(layout)

    def _on_toggle(self) -> None:
        """处理复选框切换"""
        self.todo.toggle_completed()
        if self.todo.completed:
            self.label.setStyleSheet("text-decoration: line-through; color: gray;")
        else:
            self.label.setStyleSheet("")
        self.toggled.emit(self.todo.id)

    def _on_delete(self) -> None:
        """处理删除按钮点击"""
        self.deleted.emit(self.todo.id)
