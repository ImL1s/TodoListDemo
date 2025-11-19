# iOS SwiftUI Todo List - 可訪問性指南

**版本**: 1.1.0
**日期**: 2025-11-19

---

## 📋 概述

本文檔詳細介紹了 iOS SwiftUI Todo List 應用的可訪問性實現，以及如何測試和使用這些功能。本應用遵循 Apple 的可訪問性指南和 WCAG 2.1 Level AA 標準。

---

## 🎯 可訪問性特性

### 1. VoiceOver 支持

#### 1.1 什麼是 VoiceOver？
VoiceOver 是 Apple 設備內置的屏幕閱讀器，為視力受損用戶提供語音反饋。

#### 1.2 支持的功能
- ✅ 所有交互元素都有清晰的標籤
- ✅ 上下文敏感的提示信息
- ✅ 自定義操作支持
- ✅ 適當的特性標記（按鈕、選中狀態等）
- ✅ 元素分組和組合

#### 1.3 實現細節

**待辦事項行** (`TodoItemRow.swift`):
```swift
.accessibilityElement(children: .combine)
.accessibilityLabel(accessibilityLabel)
.accessibilityHint(accessibilityHint)
.accessibilityAddTraits(todo.isCompleted ? [.isButton, .isSelected] : [.isButton])
.accessibilityAction(named: "Toggle Completion") {
    onToggle()
}
.accessibilityAction(named: "Delete") {
    onDelete()
}
```

**可訪問性標籤**:
```swift
private var accessibilityLabel: String {
    var components: [String] = []
    components.append(todo.title)                    // "Learn SwiftUI"
    components.append("\(todo.priority.rawValue) priority")  // "High priority"
    components.append(todo.isCompleted ? "Completed" : "Not completed")

    if let dueDate = todo.formattedDueDate {
        if todo.isOverdue {
            components.append("Overdue: \(dueDate)")
        } else {
            components.append("Due: \(dueDate)")
        }
    }

    if !todo.tags.isEmpty {
        components.append("Tags: \(todo.tags.joined(separator: ", "))")
    }

    return components.joined(separator: ". ")
}
```

**輸出示例**:
> "Learn SwiftUI. High priority. Not completed. Due: Nov 22, 2025. Tags: Learning, SwiftUI"

**可訪問性提示**:
```swift
private var accessibilityHint: String {
    if todo.isCompleted {
        return "Double tap to mark as not completed. Swipe left to delete."
    } else {
        return "Double tap to mark as completed. Swipe left to delete."
    }
}
```

---

### 2. 動態字體（Dynamic Type）

#### 2.1 什麼是 Dynamic Type？
Dynamic Type 允許用戶調整應用中文字的大小，以適應不同的視力需求。

#### 2.2 實現方式

**之前**（固定大小）:
```swift
.font(.system(size: 16, weight: .medium))  // ❌ 不支持動態調整
```

**之後**（動態字體）:
```swift
.font(.body)  // ✅ 自動適應用戶設置
```

#### 2.3 支持的文本樣式
- `.largeTitle` - 大標題
- `.title` - 標題
- `.headline` - 標題級別
- `.body` - 正文（待辦事項標題）
- `.caption` - 說明文字
- `.footnote` - 腳註

#### 2.4 測試動態字體
1. 打開 **設置 > 輔助功能 > 顯示與文字大小**
2. 調整 **更大字體** 滑塊
3. 返回應用查看變化

---

### 3. 可訪問性動作

#### 3.1 自定義操作
待辦事項支持以下可訪問性操作：

1. **Toggle Completion** - 切換完成狀態
   - VoiceOver 手勢: 向上或向下滑動選擇，雙擊執行

2. **Delete** - 刪除待辦事項
   - VoiceOver 手勢: 向上或向下滑動選擇，雙擊執行

#### 3.2 使用方法
```swift
.accessibilityAction(named: "Toggle Completion") {
    onToggle()
}
.accessibilityAction(named: "Delete") {
    onDelete()
}
```

---

### 4. 語義特性（Traits）

#### 4.1 使用的特性
```swift
.accessibilityAddTraits(todo.isCompleted ? [.isButton, .isSelected] : [.isButton])
```

**特性說明**:
- `.isButton` - 標記為可點擊的按鈕
- `.isSelected` - 標記為已選中（已完成）
- `.isHeader` - 標記為標題（用於章節頭）

---

## 🧪 可訪問性測試

### 1. VoiceOver 測試

#### 1.1 啟用 VoiceOver
**方法 1: 通過設置**
1. 打開 **設置**
2. 選擇 **輔助功能**
3. 選擇 **VoiceOver**
4. 開啟 **VoiceOver**

**方法 2: 使用快捷鍵**
1. 打開 **設置 > 輔助功能 > 輔助功能快捷鍵**
2. 選擇 **VoiceOver**
3. 之後可以連按三次側邊按鈕或主屏幕按鈕來開啟/關閉

#### 1.2 基本手勢
- **單指向右滑動**: 移動到下一個元素
- **單指向左滑動**: 移動到上一個元素
- **雙擊**: 激活選中的元素
- **三指向右滑動**: 向下滾動頁面
- **三指向左滑動**: 向上滾動頁面
- **向上或向下滑動**: 選擇不同的操作

#### 1.3 測試步驟
1. **測試導航**
   - 滑動瀏覽所有元素
   - 確認所有元素都可訪問
   - 驗證閱讀順序合理

2. **測試標籤**
   - 聽取每個元素的標籤
   - 確認標籤清晰、描述性強
   - 驗證沒有重複或模糊的標籤

3. **測試提示**
   - 確認提示提供了有用的指導
   - 驗證提示簡潔明瞭

4. **測試操作**
   - 使用雙擊切換待辦事項完成狀態
   - 使用自定義操作刪除待辦事項
   - 驗證所有操作都能正常執行

5. **測試輸入**
   - 聚焦到輸入框
   - 使用屏幕鍵盤輸入文本
   - 提交新的待辦事項

### 2. 動態字體測試

#### 2.1 測試步驟
1. 打開 **設置 > 輔助功能 > 顯示與文字大小**
2. 開啟 **更大字體**
3. 調整滑塊到最大
4. 返回應用查看布局
5. 確認：
   - ✅ 文字大小正確調整
   - ✅ 布局沒有破壞
   - ✅ 所有文字都可見
   - ✅ 不會溢出屏幕

#### 2.2 測試大小級別
- 特小 (XS)
- 小 (S)
- 中 (M) - 默認
- 大 (L)
- 特大 (XL)
- 超大 (XXL)
- 超超大 (XXXL)

### 3. Accessibility Inspector（開發工具）

#### 3.1 使用 Xcode Accessibility Inspector
1. 在 Xcode 中打開專案
2. 選擇 **Xcode > Open Developer Tool > Accessibility Inspector**
3. 選擇模擬器或連接的設備
4. 點擊 **Inspection** 按鈕
5. 點擊應用中的元素查看可訪問性屬性

#### 3.2 檢查項目
- **Label**: 元素的標籤是否清晰？
- **Hint**: 提示是否有幫助？
- **Traits**: 特性是否正確？
- **Value**: 值是否準確？
- **Frame**: 觸摸區域是否足夠大？

#### 3.3 運行審計
1. 在 Accessibility Inspector 中點擊 **Audit**
2. 選擇要審計的視圖
3. 點擊 **Run Audit**
4. 查看並修復發現的問題

---

## 📋 可訪問性清單

### 實現檢查
- [x] 所有交互元素都有可訪問性標籤
- [x] 所有按鈕都有適當的提示
- [x] 使用動態字體而非固定大小
- [x] 觸摸目標至少 44x44 點
- [x] 顏色對比度符合 WCAG 標準
- [x] 支持 VoiceOver
- [x] 支持動態字體
- [x] 實現自定義可訪問性操作
- [x] 適當的元素分組
- [x] 正確的閱讀順序

### 測試檢查
- [ ] 使用 VoiceOver 完整測試所有功能
- [ ] 測試所有動態字體大小
- [ ] 使用 Accessibility Inspector 審計
- [ ] 測試不同設備尺寸
- [ ] 測試橫屏和豎屏模式
- [ ] 測試暗黑模式下的對比度

---

## 🎓 最佳實踐

### 1. 編寫可訪問性標籤

#### ✅ 良好的標籤
```swift
.accessibilityLabel("Learn SwiftUI. High priority. Not completed")
```
- 描述性強
- 包含所有重要信息
- 使用自然語言

#### ❌ 不良的標籤
```swift
.accessibilityLabel("Todo item")
```
- 過於籠統
- 缺少上下文
- 沒有提供足夠信息

### 2. 編寫可訪問性提示

#### ✅ 良好的提示
```swift
.accessibilityHint("Double tap to mark as completed")
```
- 告訴用戶如何操作
- 簡潔明瞭
- 以"Double tap to"開頭

#### ❌ 不良的提示
```swift
.accessibilityHint("This is a todo item that you can complete")
```
- 重複標籤信息
- 過於冗長
- 沒有告訴用戶如何操作

### 3. 使用動態字體

#### ✅ 推薦做法
```swift
Text("Todo title")
    .font(.body)  // 動態字體
```

#### ❌ 避免做法
```swift
Text("Todo title")
    .font(.system(size: 16))  // 固定大小
```

### 4. 元素分組

#### ✅ 適當分組
```swift
HStack {
    Image(systemName: "checkmark")
    Text("Title")
    Text("Description")
}
.accessibilityElement(children: .combine)  // 組合為一個元素
```

#### ❌ 不當分組
```swift
// 每個小元素都可單獨訪問，導致導航繁瑣
HStack {
    Image(systemName: "checkmark")  // 單獨元素
    Text("Title")                   // 單獨元素
    Text("Description")             // 單獨元素
}
```

---

## 🔧 故障排除

### 問題 1: VoiceOver 沒有讀取元素
**可能原因**:
- 元素沒有可訪問性標籤
- 元素被標記為 `.accessibilityHidden(true)`
- 元素太小或不可見

**解決方案**:
```swift
.accessibilityLabel("Your label")
.accessibilityHidden(false)
.frame(minWidth: 44, minHeight: 44)  // 確保足夠大
```

### 問題 2: 文字在大字體下被截斷
**可能原因**:
- 使用了 `.lineLimit(1)`
- 使用了固定的 `frame` 高度

**解決方案**:
```swift
Text("Title")
    .font(.body)
    .lineLimit(nil)  // 允許多行
    .fixedSize(horizontal: false, vertical: true)  // 自動調整高度
```

### 問題 3: 顏色對比度不足
**可能原因**:
- 前景色和背景色對比度低於 4.5:1

**解決方案**:
- 使用系統顏色（自動適配）
- 測試暗黑模式
- 使用對比度檢查工具

---

## 📚 資源

### Apple 官方文檔
- [Accessibility (Apple Developer)](https://developer.apple.com/accessibility/)
- [Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [SwiftUI Accessibility Modifiers](https://developer.apple.com/documentation/swiftui/view-accessibility)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/)

### WCAG 標準
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 工具
- Xcode Accessibility Inspector
- VoiceOver（iOS 內建）
- Color Contrast Analyzer

### 教程
- [Hacking with Swift - Accessibility](https://www.hackingwithswift.com/books/ios-swiftui/accessibility)
- [A11y in SwiftUI](https://www.a11y-guidelines.orange.com/en/mobile/ios/)

---

## 📞 反饋

如果您在使用可訪問性功能時遇到問題，或有改進建議，請提供反饋。

---

**文檔版本**: 1.0
**最後更新**: 2025-11-19
**維護者**: iOS SwiftUI Todo List Team
