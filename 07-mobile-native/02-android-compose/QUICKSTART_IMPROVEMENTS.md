# 快速開始 - 應用改進

本指南幫助您快速應用所有改進到項目中。

---

## 🚀 5 分鐘快速應用

### 步驟 1: 更新 Gradle 配置

#### 根級別 `build.gradle.kts`
```kotlin
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("com.android.library") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.20" apply false  // 新增
    id("com.google.dagger.hilt.android") version "2.50" apply false               // 新增
    id("com.google.devtools.ksp") version "1.9.20-1.0.14" apply false            // 新增
}
```

#### 應用級別 `app/build.gradle.kts`

**添加插件：**
```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.serialization")  // 新增
    id("com.google.dagger.hilt.android")              // 新增
    id("com.google.devtools.ksp")                     // 新增
}
```

**添加依賴：**
```kotlin
dependencies {
    // ... 現有依賴 ...

    // Room Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Hilt
    val hiltVersion = "2.50"
    implementation("com.google.dagger:hilt-android:$hiltVersion")
    ksp("com.google.dagger:hilt-compiler:$hiltVersion")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

    // Immutable Collections
    implementation("org.jetbrains.kotlinx:kotlinx-collections-immutable:0.3.7")
}
```

**同步 Gradle！**

---

### 步驟 2: 創建 Room 數據庫文件

#### 文件 1: `data/local/TodoDao.kt`

創建新包 `data.local`，然後創建以下文件（完整代碼已在審查中提供）。

關鍵方法：
- `getAllTodos()`: 獲取所有 todos
- `insert(todo: Todo)`: 插入 todo
- `toggleCompleted(todoId: String)`: 切換完成狀態
- `deleteById(todoId: String)`: 刪除 todo

#### 文件 2: `data/local/TodoDatabase.kt`

```kotlin
@Database(entities = [Todo::class], version = 1, exportSchema = true)
abstract class TodoDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao
    companion object {
        const val DATABASE_NAME = "todo_database"
    }
}
```

---

### 步驟 3: 創建 Repository

#### 文件: `data/repository/TodoRepository.kt`

```kotlin
@Singleton
class TodoRepository @Inject constructor(
    private val todoDao: TodoDao
) {
    fun getAllTodos(): Flow<ImmutableList<Todo>> =
        todoDao.getAllTodos().map { it.toImmutableList() }

    suspend fun addTodo(text: String): Todo {
        val todo = Todo.create(text)
        todoDao.insert(todo)
        return todo
    }

    suspend fun toggleTodo(todoId: String) {
        todoDao.toggleCompleted(todoId)
    }

    suspend fun deleteTodo(todoId: String) {
        todoDao.deleteById(todoId)
    }

    // ... 其他方法
}
```

---

### 步驟 4: 設置 Hilt

#### 文件 1: `di/DatabaseModule.kt`

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides
    @Singleton
    fun provideTodoDatabase(@ApplicationContext context: Context): TodoDatabase {
        return Room.databaseBuilder(
            context,
            TodoDatabase::class.java,
            TodoDatabase.DATABASE_NAME
        )
        .fallbackToDestructiveMigration()
        .build()
    }

    @Provides
    fun provideTodoDao(database: TodoDatabase): TodoDao {
        return database.todoDao()
    }
}
```

#### 文件 2: 更新 `TodoApplication.kt`

```kotlin
@HiltAndroidApp  // 添加此註解
class TodoApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
```

#### 文件 3: 更新 `MainActivity.kt`

```kotlin
@AndroidEntryPoint  // 添加此註解
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TodoComposeTheme {
                Surface {
                    // 使用 hiltViewModel() 而不是 viewModel()
                    TodoListScreen(viewModel = hiltViewModel())
                }
            }
        }
    }
}
```

---

### 步驟 5: 更新 Todo.kt

添加 Room 和 Immutable 註解：

```kotlin
@Entity(tableName = "todos")  // 新增
@Serializable
@Immutable  // 新增
data class Todo(
    @PrimaryKey  // 新增
    val id: String,
    val text: String,
    val completed: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
) {
    companion object {
        fun create(text: String, completed: Boolean = false): Todo {
            return Todo(
                id = java.util.UUID.randomUUID().toString(),
                text = text,
                completed = completed,
                timestamp = System.currentTimeMillis()
            )
        }
    }
}
```

---

### 步驟 6: 更新 ViewModel（簡化版）

如果你想保持簡單，只需更改 ViewModel 構造函數：

```kotlin
@HiltViewModel  // 新增
class TodoViewModel @Inject constructor(  // 改為使用 @Inject
    private val repository: TodoRepository  // 使用 Repository 而不是 Context
) : ViewModel() {

    // 使用 Repository 的方法
    val todos: StateFlow<ImmutableList<Todo>> = repository.getAllTodos()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = persistentListOf()  // 使用 ImmutableList
        )

    fun addTodo(text: String) {
        if (text.isBlank()) return
        viewModelScope.launch {
            repository.addTodo(text)
        }
    }

    fun toggleTodo(todoId: String) {
        viewModelScope.launch {
            repository.toggleTodo(todoId)
        }
    }

    fun deleteTodo(todoId: String) {
        viewModelScope.launch {
            repository.deleteTodo(todoId)
        }
    }

    // ... 其他方法類似更新
}
```

**移除舊的 Factory 類！**

---

## ✅ 驗證

### 1. 編譯檢查
```bash
./gradlew clean build
```

### 2. 運行應用
- 在 Android Studio 中運行應用
- 添加一些 todos
- 關閉並重新打開應用
- Todos 應該保留（Room 持久化）

### 3. 檢查 Hilt 是否工作
- 如果應用成功啟動且沒有 DI 錯誤，Hilt 正常工作
- 檢查 Logcat 沒有 Hilt 相關錯誤

---

## 🐛 常見問題

### 問題 1: "Unresolved reference: hiltViewModel"

**解決：**
```kotlin
// 確保導入正確
import androidx.hilt.navigation.compose.hiltViewModel

// 在 build.gradle 中
implementation("androidx.hilt:hilt-navigation-compose:1.2.0")
```

### 問題 2: "No implementation found for TodoDatabase"

**解決：**
- 確保 KSP plugin 已添加
- 同步 Gradle
- Rebuild 項目

### 問題 3: "Cannot access database on the main thread"

**解決：**
- 確保所有 Room 操作在 `viewModelScope.launch { }` 中
- 或者使用 Flow（自動在後台線程）

### 問題 4: "@HiltAndroidApp 未找到"

**解決：**
```kotlin
// 在項目級 build.gradle.kts
id("com.google.dagger.hilt.android") version "2.50" apply false

// 在 app/build.gradle.kts
id("com.google.dagger.hilt.android")
```

---

## 📚 完整文件列表

需要創建/修改的文件：

### 新建文件 ✨
- `data/local/TodoDao.kt`
- `data/local/TodoDatabase.kt`
- `data/repository/TodoRepository.kt`
- `di/DatabaseModule.kt`
- `viewmodel/UiState.kt` (可選，用於錯誤處理)

### 修改文件 📝
- `build.gradle.kts` (根級別)
- `app/build.gradle.kts`
- `TodoApplication.kt`
- `MainActivity.kt`
- `data/Todo.kt`
- `viewmodel/TodoViewModel.kt`

---

## 🎯 下一步

完成基本改進後：

1. **添加錯誤處理** - 使用 UiState 模式
2. **添加測試** - ViewModel 和 Repository 單元測試
3. **實現滑動刪除** - 使用 SwipeToDismiss
4. **性能監控** - 使用 Layout Inspector 檢查重組

---

## 💡 提示

- 每次修改後都重新編譯，盡早發現錯誤
- 使用 Git 跟蹤更改，方便回滾
- 參考完整代碼示例在 CODE_REVIEW.md
- 如有疑問，查看 Android 官方文檔

---

**Good Luck! 🚀**
