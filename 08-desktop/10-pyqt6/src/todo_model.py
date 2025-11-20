"""Todo 数据模型"""
from dataclasses import dataclass, asdict
from typing import Optional
from datetime import datetime


@dataclass
class Todo:
    """待办事项数据模型"""
    id: str
    title: str
    completed: bool = False
    created_at: Optional[str] = None

    def __post_init__(self):
        """初始化后处理"""
        if self.created_at is None:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> dict:
        """转换为字典"""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> 'Todo':
        """从字典创建"""
        return cls(**data)

    def toggle_completed(self) -> None:
        """切换完成状态"""
        self.completed = not self.completed
