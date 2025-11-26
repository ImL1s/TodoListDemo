"""Tkinter Todo List 应用入口"""
import tkinter as tk
from app import TodoApp


def main():
    """应用程序主函数"""
    root = tk.Tk()
    app = TodoApp(root)
    app.run()


if __name__ == "__main__":
    main()
