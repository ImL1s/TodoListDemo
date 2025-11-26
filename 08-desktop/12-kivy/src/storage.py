"""JSON 存储管理器"""
import json
from pathlib import Path
from typing import List
from models import Todo


class TodoStorage:
    """Todo 数据持久化存储"""

    def __init__(self, filename: str = "todos.json"):
        """
        初始化存储

        Args:
            filename: JSON 文件名
        """
        self.filepath = Path(filename)

    def load(self) -> List[Todo]:
        """
        从文件加载所有 todos

        Returns:
            Todo 对象列表
        """
        if not self.filepath.exists():
            return []

        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return [Todo.from_dict(item) for item in data]
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"加载数据失败: {e}")
            return []

    def save(self, todos: List[Todo]) -> bool:
        """
        保存所有 todos 到文件

        Args:
            todos: Todo 对象列表

        Returns:
            是否保存成功
        """
        try:
            data = [todo.to_dict() for todo in todos]
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"保存数据失败: {e}")
            return False
