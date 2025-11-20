"""PyQt6 Todo List 应用入口"""
import sys
from PyQt6.QtWidgets import QApplication
from main_window import MainWindow


def main():
    """应用程序主函数"""
    app = QApplication(sys.argv)

    # 设置应用程序信息
    app.setApplicationName("PyQt6 Todo List")
    app.setOrganizationName("TodoListDemo")

    # 创建并显示主窗口
    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
