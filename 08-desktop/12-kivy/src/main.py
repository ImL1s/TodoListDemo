"""Kivy Todo List 应用"""
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.properties import DictProperty
from typing import List
from pathlib import Path
import uuid

from models import Todo
from storage import TodoStorage

# 加载 KV 文件
kv_file = Path(__file__).parent / "todo.kv"
Builder.load_file(str(kv_file))


class TodoItem(BoxLayout):
    """单个 Todo 任务项"""
    todo_data = DictProperty({})

    def __init__(self, todo: Todo, parent_screen, **kwargs):
        """
        初始化 Todo 项

        Args:
            todo: Todo 数据模型
            parent_screen: 父屏幕引用
        """
        super().__init__(**kwargs)
        self.todo = todo
        self.parent_screen = parent_screen
        self.todo_data = todo.to_dict()

    def on_checkbox_active(self, active: bool) -> None:
        """
        处理复选框状态变化

        Args:
            active: 是否选中
        """
        self.todo.completed = active
        self.todo_data = self.todo.to_dict()
        self.parent_screen.on_data_changed()

    def on_delete(self) -> None:
        """处理删除操作"""
        self.parent_screen.delete_todo(self.todo.id)


class TodoListScreen(BoxLayout):
    """Todo List 主屏幕"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.storage = TodoStorage()
        self.todos: List[Todo] = []
        self._load_data()

        # 延迟刷新列表，确保 UI 已完全加载
        from kivy.clock import Clock
        Clock.schedule_once(lambda dt: self._refresh_list(), 0.1)

    def _load_data(self) -> None:
        """从存储加载数据"""
        self.todos = self.storage.load()

    def _save_data(self) -> None:
        """保存数据到存储"""
        self.storage.save(self.todos)

    def _refresh_list(self) -> None:
        """刷新任务列表"""
        container = self.ids.todo_container
        container.clear_widgets()

        for todo in self.todos:
            item = TodoItem(todo, self)
            container.add_widget(item)

        self._update_stats()

    def add_todo(self) -> None:
        """添加新任务"""
        input_field = self.ids.todo_input
        title = input_field.text.strip()

        if not title:
            return

        todo = Todo(
            id=str(uuid.uuid4()),
            title=title
        )

        self.todos.append(todo)
        input_field.text = ""

        self._save_data()
        self._refresh_list()

    def delete_todo(self, todo_id: str) -> None:
        """
        删除任务

        Args:
            todo_id: 任务 ID
        """
        self.todos = [t for t in self.todos if t.id != todo_id]
        self._save_data()
        self._refresh_list()

    def clear_completed(self) -> None:
        """清除已完成的任务"""
        completed_count = sum(1 for t in self.todos if t.completed)

        if completed_count == 0:
            self._show_info_popup("提示", "没有已完成的任务")
            return

        # 显示确认对话框
        content = BoxLayout(orientation='vertical', padding=10, spacing=10)
        content.add_widget(
            Label(text=f"确定要删除 {completed_count} 个已完成的任务吗？")
        )

        btn_layout = BoxLayout(size_hint_y=None, height=50, spacing=10)

        popup = Popup(
            title="确认",
            content=content,
            size_hint=(0.8, 0.3)
        )

        def on_yes(instance):
            self.todos = [t for t in self.todos if not t.completed]
            self._save_data()
            self._refresh_list()
            popup.dismiss()

        def on_no(instance):
            popup.dismiss()

        from kivy.uix.button import Button
        yes_btn = Button(text="确定", on_press=on_yes)
        no_btn = Button(text="取消", on_press=on_no)

        btn_layout.add_widget(yes_btn)
        btn_layout.add_widget(no_btn)
        content.add_widget(btn_layout)

        popup.open()

    def on_data_changed(self) -> None:
        """数据变更回调"""
        self._save_data()
        self._update_stats()

    def _update_stats(self) -> None:
        """更新统计信息"""
        total = len(self.todos)
        completed = sum(1 for t in self.todos if t.completed)
        active = total - completed

        self.ids.stats_label.text = (
            f"总计: {total} | 进行中: {active} | 已完成: {completed}"
        )

    def _show_info_popup(self, title: str, message: str) -> None:
        """
        显示信息弹窗

        Args:
            title: 标题
            message: 消息内容
        """
        popup = Popup(
            title=title,
            content=Label(text=message),
            size_hint=(0.8, 0.3)
        )
        popup.open()


class TodoApp(App):
    """Kivy Todo List 应用"""

    def build(self):
        """构建应用 UI"""
        self.title = "Kivy Todo List"
        return TodoListScreen()


def main():
    """应用程序主函数"""
    TodoApp().run()


if __name__ == "__main__":
    main()
