#!/bin/bash

# Flutter BLoC Todo 測試覆蓋率腳本
# 用於運行測試並生成覆蓋率報告

set -e

echo "🧪 開始運行測試..."
echo ""

# 清理之前的覆蓋率數據
echo "🗑️  清理舊的覆蓋率數據..."
rm -rf coverage/

# 運行測試並生成覆蓋率
echo "🏃 運行測試並收集覆蓋率..."
flutter test --coverage

# 檢查是否生成了 lcov.info
if [ ! -f "coverage/lcov.info" ]; then
    echo "❌ 錯誤：未能生成覆蓋率報告"
    exit 1
fi

echo ""
echo "✅ 測試完成！"
echo ""

# 檢查是否安裝了 lcov
if command -v lcov &> /dev/null; then
    echo "📊 生成 HTML 覆蓋率報告..."

    # 生成 HTML 報告
    genhtml coverage/lcov.info -o coverage/html --no-function-coverage

    echo ""
    echo "✅ HTML 覆蓋率報告已生成！"
    echo ""
    echo "📂 報告位置: coverage/html/index.html"
    echo ""

    # 在 macOS 上自動打開報告
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🌐 在瀏覽器中打開覆蓋率報告..."
        open coverage/html/index.html
    # 在 Linux 上提示打開方式
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "💡 運行以下命令查看報告:"
        echo "   xdg-open coverage/html/index.html"
        echo "   或在瀏覽器中打開: file://$(pwd)/coverage/html/index.html"
    fi
else
    echo "⚠️  未安裝 lcov，無法生成 HTML 報告"
    echo ""
    echo "安裝 lcov:"
    echo "  macOS: brew install lcov"
    echo "  Ubuntu/Debian: sudo apt-get install lcov"
    echo "  Fedora: sudo dnf install lcov"
    echo ""
    echo "📄 原始覆蓋率數據位於: coverage/lcov.info"
fi

echo ""
echo "🎉 完成！"
