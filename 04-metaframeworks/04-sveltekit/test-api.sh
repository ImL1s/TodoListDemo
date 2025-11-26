#!/bin/bash

# SvelteKit Todo List API 測試腳本
# 確保開發伺服器正在運行（npm run dev）

API_URL="http://localhost:5173/api/todos"

echo "======================================"
echo "SvelteKit Todo List API 測試"
echo "======================================"
echo ""

# 測試 1: 獲取所有 todos
echo "測試 1: GET /api/todos - 獲取所有 todos"
echo "--------------------------------------"
curl -s -X GET "$API_URL" | jq .
echo ""
echo ""

# 測試 2: 添加新 todo
echo "測試 2: POST /api/todos - 添加新 todo"
echo "--------------------------------------"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "測試任務 - API 腳本"}' | jq .
echo ""
echo ""

# 測試 3: 獲取所有 todos（應該包含新添加的）
echo "測試 3: GET /api/todos - 驗證新增的 todo"
echo "--------------------------------------"
curl -s -X GET "$API_URL" | jq .
echo ""
echo ""

# 測試 4: 獲取單個 todo
echo "測試 4: GET /api/todos/1 - 獲取特定 todo"
echo "--------------------------------------"
curl -s -X GET "$API_URL/1" | jq .
echo ""
echo ""

# 測試 5: 更新 todo
echo "測試 5: PATCH /api/todos/1 - 更新 todo"
echo "--------------------------------------"
curl -s -X PATCH "$API_URL/1" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}' | jq .
echo ""
echo ""

# 測試 6: 批量操作 - 標記全部完成
echo "測試 6: PATCH /api/todos - 標記全部完成"
echo "--------------------------------------"
curl -s -X PATCH "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"markAllCompleted": true}' | jq .
echo ""
echo ""

# 測試 7: 清除已完成
echo "測試 7: PATCH /api/todos - 清除已完成"
echo "--------------------------------------"
curl -s -X PATCH "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"clearCompleted": true}' | jq .
echo ""
echo ""

# 測試 8: 刪除特定 todo
echo "測試 8: DELETE /api/todos/2 - 刪除特定 todo"
echo "--------------------------------------"
curl -s -X DELETE "$API_URL/2" | jq .
echo ""
echo ""

# 測試 9: 最終狀態
echo "測試 9: GET /api/todos - 最終狀態"
echo "--------------------------------------"
curl -s -X GET "$API_URL" | jq .
echo ""
echo ""

echo "======================================"
echo "測試完成"
echo "======================================"
