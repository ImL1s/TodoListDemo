# Material-UI (MUI) Todo List

一個使用 React 和 Material-UI (MUI) 構建的現代化待辦事項應用，展示了 Material Design 設計系統的實現。

## 特色功能

### Material-UI 核心特色

1. **Material Design 設計語言**
   - 遵循 Google Material Design 規範
   - 統一的視覺風格和交互體驗
   - 優雅的動畫和過渡效果

2. **豐富的組件庫**
   - 60+ 即用型組件
   - 高度可定制化
   - 響應式設計

3. **強大的主題系統**
   - 自定義顏色調色板
   - Typography 配置
   - 全局樣式覆蓋

4. **完整的 TypeScript 支持**
   - 類型安全
   - IntelliSense 支持
   - 更好的開發體驗

## 使用的 MUI 組件

### 布局組件
- **Container**: 響應式容器，限制最大寬度
- **Box**: 靈活的盒子組件，使用 sx prop 進行樣式化
- **Grid**: 響應式網格系統
- **Paper**: 卡片式容器，帶有陰影效果

### 輸入組件
- **TextField**: 文本輸入框
  ```tsx
  <TextField
    fullWidth
    variant="outlined"
    placeholder="What needs to be done?"
    value={text}
    onChange={(e) => setText(e.target.value)}
  />
  ```

- **Checkbox**: 複選框
  ```tsx
  <Checkbox
    edge="start"
    checked={todo.completed}
    color="primary"
  />
  ```

- **Button**: 按鈕組件
  ```tsx
  <Button
    variant="contained"
    color="primary"
    startIcon={<AddIcon />}
  >
    Add
  </Button>
  ```

### 導航組件
- **AppBar**: 應用頂欄
  ```tsx
  <AppBar position="static" elevation={4}>
    <Toolbar>
      <Typography variant="h5">Material-UI Todo List</Typography>
    </Toolbar>
  </AppBar>
  ```

- **ToggleButtonGroup**: 切換按鈕組
  ```tsx
  <ToggleButtonGroup
    value={filter}
    exclusive
    onChange={handleChange}
  >
    <ToggleButton value="all">All</ToggleButton>
    <ToggleButton value="active">Active</ToggleButton>
  </ToggleButtonGroup>
  ```

### 數據展示組件
- **List / ListItem**: 列表組件
  ```tsx
  <List>
    <ListItem>
      <ListItemButton>
        <ListItemIcon>
          <Checkbox />
        </ListItemIcon>
        <ListItemText primary="Task" />
      </ListItemButton>
    </ListItem>
  </List>
  ```

- **Typography**: 文字組件
  ```tsx
  <Typography variant="h6" fontWeight="bold">
    Statistics
  </Typography>
  ```

- **Chip**: 標籤/徽章組件
  ```tsx
  <Chip
    label="100% Complete"
    color="success"
    size="medium"
  />
  ```

### 圖標組件
- **@mui/icons-material**: Material Icons 圖標庫
  ```tsx
  import ChecklistIcon from '@mui/icons-material/Checklist';
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddIcon from '@mui/icons-material/Add';
  ```

## 主題系統

### 自定義主題配置 (`src/theme.ts`)

```tsx
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
```

### 主題特色
- **調色板 (Palette)**: 定義主色、次色、成功色等
- **Typography**: 自定義字體和文字樣式
- **組件覆蓋**: 全局覆蓋組件默認樣式
- **形狀 (Shape)**: 自定義圓角等

## sx prop 樣式系統

MUI 提供強大的 `sx` prop 用於快速樣式化：

```tsx
<Box
  sx={{
    display: 'flex',
    gap: 2,
    p: 2,
    bgcolor: 'primary.light',
    borderRadius: 1,
    '&:hover': {
      bgcolor: 'primary.main',
    },
  }}
>
  Content
</Box>
```

### sx prop 優勢
- **主題感知**: 直接訪問主題值
- **響應式**: 支持斷點值
- **類型安全**: TypeScript 支持
- **性能優化**: CSS-in-JS 優化

## 響應式設計

使用 MUI 的響應式系統：

```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Card />
  </Grid>
</Grid>
```

### 斷點
- xs: 0px+
- sm: 600px+
- md: 900px+
- lg: 1200px+
- xl: 1536px+

## 項目結構

```
01-react-mui/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx      # 輸入組件 (TextField, Button)
│   │   ├── TodoItem.tsx       # 單項組件 (Checkbox, IconButton)
│   │   ├── TodoList.tsx       # 列表組件 (List, ListItem)
│   │   ├── TodoStats.tsx      # 統計組件 (Grid, Chip, Paper)
│   │   └── FilterButtons.tsx  # 過濾組件 (ToggleButton)
│   ├── App.tsx                # 主組件 (AppBar, Container)
│   ├── theme.ts               # 主題配置
│   ├── types.ts               # TypeScript 類型
│   └── main.tsx               # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 安裝與運行

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 構建生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

## 核心依賴

- **@mui/material**: MUI 核心組件庫
- **@mui/icons-material**: Material Icons 圖標庫
- **@emotion/react**: CSS-in-JS 引擎
- **@emotion/styled**: 樣式化組件
- **React**: UI 庫
- **TypeScript**: 類型系統
- **Vite**: 構建工具

## MUI vs 其他 UI 庫

### MUI 優勢
1. **成熟穩定**: 使用廣泛，社區活躍
2. **Material Design**: Google 設計規範
3. **組件豐富**: 60+ 組件
4. **主題系統**: 強大的定制能力
5. **企業級**: 適合大型項目

### 適用場景
- 企業應用
- 管理後台
- 數據密集型應用
- 需要 Material Design 的項目

## 學習資源

- [MUI 官方文檔](https://mui.com/)
- [Material Design 規範](https://material.io/design)
- [MUI 組件示例](https://mui.com/components/)
- [主題定制指南](https://mui.com/customization/theming/)
- [sx prop 文檔](https://mui.com/system/the-sx-prop/)

## 最佳實踐

1. **使用主題系統**: 集中管理顏色和樣式
2. **sx prop 優先**: 快速樣式化
3. **組件組合**: 利用 MUI 組件組合
4. **響應式設計**: 使用 Grid 和 Container
5. **類型安全**: 充分利用 TypeScript
6. **圖標使用**: 使用 @mui/icons-material
7. **性能優化**: 按需導入組件

## 特色展示

### 1. 統計卡片
使用 Grid + Paper + 自定義背景色展示統計數據。

### 2. 過濾按鈕組
使用 ToggleButtonGroup 實現互斥選擇。

### 3. 響應式佈局
使用 Container 和 Grid 實現自適應佈局。

### 4. 主題一致性
所有組件使用統一的主題配置，確保視覺一致性。

## 總結

這個 MUI Todo List 展示了：
- Material-UI 核心組件的使用
- 主題系統的配置和定制
- sx prop 樣式系統
- TypeScript 集成
- 響應式設計
- 組件化架構

Material-UI 是構建現代 React 應用的優秀選擇，特別適合需要專業外觀和豐富功能的企業級應用。
