# TodoList - Android Java Application

一个功能完整的原生 Android TodoList 应用，使用 Java、Room Database、ViewModel、LiveData 构建，遵循 MVVM 架构模式。

## 技术栈

- **Java**: 原生 Android 开发语言
- **Android SDK**: API 24+ (Android 7.0+)
- **Architecture Components**:
  - **Room Database**: 2.6.1 - SQLite 数据持久化
  - **ViewModel**: 生命周期感知的数据管理
  - **LiveData**: 响应式数据观察
- **Material Design**: 3.11.0 - 现代化 UI 组件
- **RecyclerView**: 高效列表显示
- **Gradle**: 构建工具

## 项目结构

```
03-android-java/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/todolist/
│   │   │   ├── MainActivity.java              # 主 Activity
│   │   │   ├── model/
│   │   │   │   └── Todo.java                  # Room Entity
│   │   │   ├── database/
│   │   │   │   ├── TodoDao.java               # 数据访问对象
│   │   │   │   └── TodoDatabase.java          # Room 数据库
│   │   │   ├── viewmodel/
│   │   │   │   └── TodoViewModel.java         # ViewModel
│   │   │   └── adapter/
│   │   │       └── TodoAdapter.java           # RecyclerView 适配器
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml          # 主布局
│   │   │   │   └── item_todo.xml              # Todo 项布局
│   │   │   ├── menu/
│   │   │   │   └── menu_main.xml              # 菜单
│   │   │   ├── values/
│   │   │   │   ├── strings.xml                # 字符串资源
│   │   │   │   ├── colors.xml                 # 颜色资源
│   │   │   │   └── themes.xml                 # 主题样式
│   │   │   └── ...
│   │   └── AndroidManifest.xml                # 应用清单
│   └── build.gradle                            # App 模块配置
├── build.gradle                                # 项目配置
├── settings.gradle                             # Gradle 设置
├── gradle.properties                           # Gradle 属性
├── .gitignore
└── README.md
```

## 功能特性

### 核心功能

- ✅ **添加任务**: FloatingActionButton 弹出对话框添加
- ✅ **完成任务**: 点击 CheckBox 标记完成/未完成
- ✅ **删除任务**: 点击删除按钮或左右滑动删除
- ✅ **任务筛选**: 通过菜单查看全部/活动/已完成任务
- ✅ **清除已完成**: 一键删除所有已完成任务
- ✅ **删除全部**: 清空所有任务
- ✅ **数据持久化**: Room Database 自动保存
- ✅ **实时更新**: LiveData 自动刷新 UI

### 架构特性

- 🏗️ **MVVM 架构**: 清晰的代码分层
- 🔄 **LiveData**: 响应式数据流
- 💾 **Room Database**: 类型安全的 SQLite 封装
- 🔁 **ViewModel**: 生命周期感知，配置保持
- ♻️ **RecyclerView**: 高效列表渲染
- 🎨 **Material Design**: 现代化 UI 组件

### UI 特性

- 📱 **Material Design 3**: 最新设计规范
- 🎨 **CardView**: 卡片式任务项
- ✨ **FloatingActionButton**: 醒目的添加按钮
- 🔄 **Swipe to Delete**: 滑动删除手势
- 📊 **动态标题**: 显示任务数量
- 🌈 **精美配色**: 专业的视觉设计

## 快速开始

### 前置要求

- **Android Studio**: Electric Eel 或更高版本
- **Android SDK**: API 24+ (Android 7.0+)
- **JDK**: 17 或更高版本

### 安装与运行

#### 1. 克隆或打开项目

```bash
# 进入项目目录
cd 07-mobile-native/03-android-java
```

#### 2. 使用 Android Studio

1. 打开 Android Studio
2. 选择 "Open an Existing Project"
3. 选择 `03-android-java` 目录
4. 等待 Gradle 同步完成
5. 连接 Android 设备或启动模拟器
6. 点击运行按钮 ▶️

#### 3. 使用命令行

```bash
# 构建项目
./gradlew build

# 安装到已连接的设备
./gradlew installDebug

# 构建 APK
./gradlew assembleDebug
# APK 位置: app/build/outputs/apk/debug/app-debug.apk
```

### 系统要求

- **最低 Android 版本**: Android 7.0 (API 24)
- **目标 Android 版本**: Android 14 (API 34)
- **推荐设备**: Android 10+ 以获得最佳体验

## 使用指南

### 基本操作

#### 1. 添加任务

1. 点击右下角的蓝色 ➕ 按钮
2. 在弹出的对话框中输入任务描述
3. 点击 "Add" 添加任务

#### 2. 完成任务

- 点击任务左侧的 CheckBox
- 已完成的任务会显示删除线

#### 3. 删除任务

**方法一**: 点击删除按钮
1. 点击任务右侧的 🗑️ 图标
2. 在确认对话框中点击 "Delete"

**方法二**: 滑动删除
- 在任务上左滑或右滑即可删除

#### 4. 筛选任务

1. 点击右上角的菜单按钮（三个点）
2. 选择 "Filter" > 选择筛选条件：
   - **All Todos**: 显示所有任务
   - **Active Only**: 仅显示未完成任务
   - **Completed Only**: 仅显示已完成任务

#### 5. 清除已完成任务

1. 点击菜单 > "Clear Completed"
2. 确认删除

#### 6. 删除全部任务

1. 点击菜单 > "Delete All"
2. 确认删除

### 手势操作

- **左滑/右滑**: 删除任务
- **点击任务**: 可扩展用于查看详情（当前未实现）

## 架构说明

### MVVM 架构模式

```
┌─────────────┐
│   Activity  │ ← UI Layer
└──────┬──────┘
       │ observes
       ▼
┌─────────────┐
│  ViewModel  │ ← Presentation Layer
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│ Repository  │ ← Data Layer (Dao)
└──────┬──────┘
       │ accesses
       ▼
┌─────────────┐
│  Database   │ ← Persistence Layer (Room)
└─────────────┘
```

### 组件说明

#### 1. Room Database

**Entity** (`Todo.java`):
```java
@Entity(tableName = "todos")
public class Todo {
    @PrimaryKey(autoGenerate = true)
    private long id;

    @ColumnInfo(name = "text")
    private String text;

    @ColumnInfo(name = "completed")
    private boolean completed;

    @ColumnInfo(name = "created_at")
    private long createdAt;
}
```

**DAO** (`TodoDao.java`):
```java
@Dao
public interface TodoDao {
    @Insert
    long insert(Todo todo);

    @Update
    int update(Todo todo);

    @Delete
    int delete(Todo todo);

    @Query("SELECT * FROM todos ORDER BY created_at DESC")
    LiveData<List<Todo>> getAllTodos();
}
```

**Database** (`TodoDatabase.java`):
```java
@Database(entities = {Todo.class}, version = 1)
public abstract class TodoDatabase extends RoomDatabase {
    public abstract TodoDao todoDao();
}
```

#### 2. ViewModel

```java
public class TodoViewModel extends AndroidViewModel {
    private TodoDao todoDao;
    private LiveData<List<Todo>> allTodos;

    public void insert(Todo todo) {
        // 在后台线程执行
    }

    public LiveData<List<Todo>> getAllTodos() {
        return allTodos;
    }
}
```

#### 3. RecyclerView Adapter

```java
public class TodoAdapter extends ListAdapter<Todo, TodoViewHolder> {
    // 使用 DiffUtil 优化性能
    // 自动处理列表更新
}
```

#### 4. Activity

```java
public class MainActivity extends AppCompatActivity {
    private TodoViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 初始化 ViewModel
        viewModel = new ViewModelProvider(this).get(TodoViewModel.class);

        // 观察 LiveData
        viewModel.getAllTodos().observe(this, todos -> {
            adapter.submitList(todos);
        });
    }
}
```

## 数据持久化

### Room Database 配置

- **数据库名称**: `todo_database`
- **版本**: 1
- **存储位置**: 应用私有存储（自动管理）
- **线程池**: 4 个后台线程

### 数据表结构

**todos 表**:

| 列名 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| text | TEXT | 任务描述 |
| completed | INTEGER | 完成状态（0/1） |
| created_at | INTEGER | 创建时间戳 |

## 开发指南

### 添加新功能

#### 1. 添加新字段到 Entity

```java
@ColumnInfo(name = "priority")
private int priority;
```

#### 2. 更新数据库版本

```java
@Database(entities = {Todo.class}, version = 2)
```

#### 3. 添加 Migration

```java
static final Migration MIGRATION_1_2 = new Migration(1, 2) {
    @Override
    public void migrate(SupportSQLiteDatabase database) {
        database.execSQL("ALTER TABLE todos ADD COLUMN priority INTEGER DEFAULT 0");
    }
};
```

#### 4. 更新 UI

修改 `item_todo.xml` 和 `TodoAdapter.java`。

### 调试技巧

#### 查看数据库

使用 Android Studio 的 Database Inspector：

1. View > Tool Windows > App Inspection
2. 选择 "Database Inspector"
3. 查看 `todo_database` 数据库

#### 日志输出

在 `TodoViewModel` 和 `MainActivity` 中已添加日志：

```bash
# 过滤日志
adb logcat | grep "Todo"
```

## 性能优化

### 已实现的优化

- ✅ **DiffUtil**: RecyclerView 高效更新
- ✅ **ViewHolder 复用**: 减少内存分配
- ✅ **后台线程**: 数据库操作不阻塞 UI
- ✅ **LiveData**: 避免内存泄漏
- ✅ **Room 缓存**: 自动查询优化

### 建议的优化

- [ ] 添加分页加载（Paging 3）
- [ ] 实现数据预加载
- [ ] 使用 WorkManager 进行后台同步
- [ ] 添加内存缓存层
- [ ] 实现图片懒加载（如果添加图片功能）

## 测试

### 单元测试

```bash
# 运行单元测试
./gradlew test
```

### 仪器化测试

```bash
# 运行 Android 测试
./gradlew connectedAndroidTest
```

### 手动测试清单

- [ ] 添加任务
- [ ] 完成/取消完成任务
- [ ] 删除单个任务
- [ ] 滑动删除任务
- [ ] 筛选任务（全部/活动/已完成）
- [ ] 清除已完成任务
- [ ] 删除全部任务
- [ ] 旋转屏幕（数据保持）
- [ ] 杀死应用重启（数据持久化）

## 构建与发布

### Debug 版本

```bash
# 构建 Debug APK
./gradlew assembleDebug

# APK 位置
app/build/outputs/apk/debug/app-debug.apk
```

### Release 版本

1. **创建 Keystore**:
   ```bash
   keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
   ```

2. **配置签名** (在 `app/build.gradle`):
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("my-release-key.jks")
               storePassword "password"
               keyAlias "my-key-alias"
               keyPassword "password"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **构建 Release APK**:
   ```bash
   ./gradlew assembleRelease
   ```

## 常见问题

### Q: Room 数据库迁移失败？

A: 清除应用数据或卸载重装应用（开发阶段）。

### Q: LiveData 不更新 UI？

A: 确保在主线程观察，并检查 lifecycle owner。

### Q: RecyclerView 显示异常？

A: 检查 DiffUtil 的实现，确保 `areItemsTheSame` 和 `areContentsTheSame` 正确。

### Q: Gradle 同步失败？

A: 检查网络连接，清除 Gradle 缓存：
```bash
./gradlew clean
rm -rf ~/.gradle/caches
```

## 扩展功能建议

- [ ] 添加任务优先级（高/中/低）
- [ ] 实现任务分类/标签
- [ ] 添加任务到期日期和提醒
- [ ] 支持任务拖拽排序
- [ ] 实现搜索功能
- [ ] 添加任务备注/详情页
- [ ] 支持深色模式
- [ ] 实现数据导出（JSON/CSV）
- [ ] 添加小部件（Widget）
- [ ] 云端同步（Firebase）
- [ ] 多语言支持
- [ ] 任务统计图表
- [ ] 语音输入任务

## 截图说明

### 主界面

- **顶部**: ActionBar 显示标题和任务数量
- **中间**: RecyclerView 滚动列表
  - 每个 Todo 项包含：CheckBox、文本、时间、删除按钮
- **右下**: FloatingActionButton 添加按钮
- **菜单**: 筛选、清除、删除选项

### 配色方案

- **主色**: 蓝色 (#3B82F6) - 品牌色
- **背景**: 浅灰 (#F5F7FA) - 舒适
- **卡片**: 白色 (#FFFFFF) - 清晰
- **文本**: 深灰 (#1F2937) - 易读
- **删除**: 红色 (#EF4444) - 警告

## 许可证

MIT License

## 作者

TodoList Demo Project

## 版本历史

- **v1.0.0** (2025-11-20)
  - 初始版本发布
  - MVVM 架构实现
  - Room Database 集成
  - RecyclerView + LiveData
  - Material Design 3 UI
  - 完整 CRUD 功能
  - 滑动删除手势
  - 任务筛选功能

## 相关资源

- [Android Developers](https://developer.android.com/)
- [Room Database Guide](https://developer.android.com/training/data-storage/room)
- [ViewModel Overview](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [LiveData Overview](https://developer.android.com/topic/libraries/architecture/livedata)
- [RecyclerView Guide](https://developer.android.com/guide/topics/ui/layout/recyclerview)
- [Material Design](https://material.io/design)

---

**享受使用 Android TodoList 提升您的移动生产力！** 📱✨
