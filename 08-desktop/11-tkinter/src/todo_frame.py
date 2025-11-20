"""Todo 任务列表 Frame"""
import tkinter as tk
from tkinter import ttk, messagebox
from typing import List, Dict, Any, Callable
import uuid
from datetime import datetime


class TodoFrame(ttk.Frame):
    """Todo 任务列表框架"""

    def __init__(self, parent, todos: List[Dict[str, Any]], on_change: Callable):
        """
        初始化 Todo Frame

        Args:
            parent: 父容器
            todos: Todo 数据列表
            on_change: 数据变更回调函数
        """
        super().__init__(parent)
        self.todos = todos
        self.on_change = on_change
        self.todo_widgets: List[Dict[str, Any]] = []

        self._setup_ui()
        self._refresh_list()

    def _setup_ui(self) -> None:
        """设置 UI 组件"""
        # 标题
        title = tk.Label(
            self,
            text="📝 Todo List",
            font=("Arial", 24, "bold"),
            bg="#f5f5f5",
            fg="#333"
        )
        title.pack(pady=(10, 20))

        # 输入区域
        input_frame = ttk.Frame(self)
        input_frame.pack(fill=tk.X, padx=20, pady=(0, 10))

        self.input_var = tk.StringVar()
        self.input_entry = ttk.Entry(
            input_frame,
            textvariable=self.input_var,
            font=("Arial", 12)
        )
        self.input_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        self.input_entry.bind('<Return>', lambda e: self._add_todo())

        self.add_button = ttk.Button(
            input_frame,
            text="添加",
            command=self._add_todo,
            width=10
        )
        self.add_button.pack(side=tk.LEFT)

        # 任务列表容器（带滚动条）
        list_frame = ttk.Frame(self)
        list_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 10))

        # 创建 Canvas 和 Scrollbar
        self.canvas = tk.Canvas(list_frame, bg="white", highlightthickness=1)
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.canvas.yview)

        self.scrollable_frame = ttk.Frame(self.canvas)

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )

        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)

        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # 统计信息区域
        stats_frame = ttk.Frame(self)
        stats_frame.pack(fill=tk.X, padx=20, pady=(0, 20))

        self.stats_label = tk.Label(
            stats_frame,
            text="",
            font=("Arial", 10),
            bg="#f5f5f5",
            fg="#666"
        )
        self.stats_label.pack(side=tk.LEFT)

        self.clear_button = ttk.Button(
            stats_frame,
            text="清除已完成",
            command=self._clear_completed
        )
        self.clear_button.pack(side=tk.RIGHT)

    def _create_todo_item(self, todo: Dict[str, Any]) -> ttk.Frame:
        """
        创建单个 Todo 项 Widget

        Args:
            todo: Todo 数据

        Returns:
            Todo 项 Frame
        """
        item_frame = ttk.Frame(self.scrollable_frame, style="TodoItem.TFrame")
        item_frame.pack(fill=tk.X, pady=2, padx=5)

        # 复选框
        var = tk.BooleanVar(value=todo.get("completed", False))
        checkbox = ttk.Checkbutton(
            item_frame,
            variable=var,
            command=lambda: self._toggle_todo(todo["id"], var.get())
        )
        checkbox.pack(side=tk.LEFT, padx=5)

        # 任务标题
        label_text = todo["title"]
        label = tk.Label(
            item_frame,
            text=label_text,
            font=("Arial", 11),
            bg="white",
            anchor="w"
        )

        if todo.get("completed", False):
            label.config(
                font=("Arial", 11, "overstrike"),
                fg="gray"
            )

        label.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        # 删除按钮
        delete_btn = ttk.Button(
            item_frame,
            text="删除",
            command=lambda: self._delete_todo(todo["id"]),
            width=8
        )
        delete_btn.pack(side=tk.RIGHT, padx=5)

        return item_frame

    def _refresh_list(self) -> None:
        """刷新任务列表"""
        # 清除现有 widgets
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        # 创建新的 widgets
        for todo in self.todos:
            self._create_todo_item(todo)

        self._update_stats()

    def _add_todo(self) -> None:
        """添加新任务"""
        title = self.input_var.get().strip()
        if not title:
            return

        todo = {
            "id": str(uuid.uuid4()),
            "title": title,
            "completed": False,
            "created_at": datetime.now().isoformat()
        }

        self.todos.append(todo)
        self.input_var.set("")
        self.on_change()
        self._refresh_list()

    def _toggle_todo(self, todo_id: str, completed: bool) -> None:
        """
        切换任务完成状态

        Args:
            todo_id: 任务 ID
            completed: 是否完成
        """
        for todo in self.todos:
            if todo["id"] == todo_id:
                todo["completed"] = completed
                break

        self.on_change()
        self._refresh_list()

    def _delete_todo(self, todo_id: str) -> None:
        """
        删除任务

        Args:
            todo_id: 任务 ID
        """
        self.todos[:] = [t for t in self.todos if t["id"] != todo_id]
        self.on_change()
        self._refresh_list()

    def _clear_completed(self) -> None:
        """清除已完成的任务"""
        completed_count = sum(1 for t in self.todos if t.get("completed", False))

        if completed_count == 0:
            messagebox.showinfo("提示", "没有已完成的任务")
            return

        result = messagebox.askyesno(
            "确认",
            f"确定要删除 {completed_count} 个已完成的任务吗？"
        )

        if result:
            self.todos[:] = [t for t in self.todos if not t.get("completed", False)]
            self.on_change()
            self._refresh_list()

    def _update_stats(self) -> None:
        """更新统计信息"""
        total = len(self.todos)
        completed = sum(1 for t in self.todos if t.get("completed", False))
        active = total - completed

        self.stats_label.config(
            text=f"总计: {total} | 进行中: {active} | 已完成: {completed}"
        )
