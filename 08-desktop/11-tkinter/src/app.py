"""Tkinter 主窗口应用"""
import tkinter as tk
from tkinter import ttk
from typing import List, Dict, Any

from storage import TodoStorage
from todo_frame import TodoFrame


class TodoApp:
    """Todo List 应用程序"""

    def __init__(self, root: tk.Tk):
        """
        初始化应用

        Args:
            root: Tk 根窗口
        """
        self.root = root
        self.storage = TodoStorage()
        self.todos: List[Dict[str, Any]] = []

        self._setup_window()
        self._setup_styles()
        self._load_data()
        self._setup_ui()

    def _setup_window(self) -> None:
        """设置窗口属性"""
        self.root.title("Tkinter Todo List")
        self.root.geometry("600x500")
        self.root.minsize(500, 400)
        self.root.configure(bg="#f5f5f5")

    def _setup_styles(self) -> None:
        """设置 ttk 样式"""
        style = ttk.Style()
        style.theme_use('clam')

        # 按钮样式
        style.configure(
            "TButton",
            padding=8,
            background="#4CAF50",
            foreground="white",
            font=("Arial", 10, "bold")
        )
        style.map(
            "TButton",
            background=[("active", "#45a049")]
        )

        # Entry 样式
        style.configure(
            "TEntry",
            padding=8,
            fieldbackground="white",
            font=("Arial", 12)
        )

        # Frame 样式
        style.configure(
            "TodoItem.TFrame",
            background="white",
            relief="flat"
        )

    def _load_data(self) -> None:
        """从存储加载数据"""
        self.todos = self.storage.load()

    def _save_data(self) -> None:
        """保存数据到存储"""
        self.storage.save(self.todos)

    def _on_data_change(self) -> None:
        """数据变更回调"""
        self._save_data()

    def _setup_ui(self) -> None:
        """设置 UI"""
        self.todo_frame = TodoFrame(
            self.root,
            self.todos,
            self._on_data_change
        )
        self.todo_frame.pack(fill=tk.BOTH, expand=True)

    def run(self) -> None:
        """运行应用"""
        self.root.mainloop()
