using UnityEngine;
using UnityEditor;
using TodoList.Core;

namespace TodoList.Editor
{
    /// <summary>
    /// Unity Editor 菜單項
    /// 提供快速訪問和調試功能
    /// </summary>
    public static class TodoListMenuItems
    {
        #region Menu Items

        [MenuItem("Tools/Todo List/Clear All Data")]
        private static void ClearAllData()
        {
            if (EditorUtility.DisplayDialog(
                "Clear All Data",
                "Are you sure you want to clear all Todo data? This cannot be undone.",
                "Yes, Clear All",
                "Cancel"))
            {
                TodoManager.Instance.ResetData();
                Debug.Log("All Todo data cleared");
            }
        }

        [MenuItem("Tools/Todo List/Add Sample Data")]
        private static void AddSampleData()
        {
            TodoManager manager = TodoManager.Instance;

            manager.AddTodo("Learn Unity Basics", 1, "Learning");
            manager.AddTodo("Build Todo List App", 2, "Development");
            manager.AddTodo("Read Unity Documentation", 0, "Learning");
            manager.AddTodo("Optimize Performance", 2, "Development");
            manager.AddTodo("Test on Mobile Device", 1, "Testing");
            manager.AddTodo("Deploy to Production", 2, "Deployment");
            manager.AddTodo("Write Unit Tests", 1, "Development");
            manager.AddTodo("Update README", 0, "Documentation");

            Debug.Log("Sample data added: 8 todos");
        }

        [MenuItem("Tools/Todo List/Print Statistics")]
        private static void PrintStatistics()
        {
            TodoManager manager = TodoManager.Instance;
            string stats = manager.GetStatistics();
            Debug.Log($"Todo List Statistics:\n{stats}");
        }

        [MenuItem("Tools/Todo List/Open Persistent Data Path")]
        private static void OpenPersistentDataPath()
        {
            string path = Application.persistentDataPath;
            EditorUtility.RevealInFinder(path);
            Debug.Log($"Persistent Data Path: {path}");
        }

        [MenuItem("Tools/Todo List/Export Data")]
        private static void ExportData()
        {
            string path = EditorUtility.SaveFilePanel(
                "Export Todo Data",
                Application.persistentDataPath,
                "todos_export.json",
                "json");

            if (!string.IsNullOrEmpty(path))
            {
                var persistence = new TodoList.Utils.DataPersistence();
                var todos = TodoManager.Instance.Todos;
                string json = persistence.ExportToJson(new System.Collections.Generic.List<TodoList.Data.Todo>(todos));

                System.IO.File.WriteAllText(path, json);
                Debug.Log($"Data exported to: {path}");
            }
        }

        [MenuItem("Tools/Todo List/Import Data")]
        private static void ImportData()
        {
            string path = EditorUtility.OpenFilePanel(
                "Import Todo Data",
                Application.persistentDataPath,
                "json");

            if (!string.IsNullOrEmpty(path))
            {
                if (EditorUtility.DisplayDialog(
                    "Import Data",
                    "This will replace all existing data. Continue?",
                    "Yes, Import",
                    "Cancel"))
                {
                    var persistence = new TodoList.Utils.DataPersistence();
                    string json = System.IO.File.ReadAllText(path);
                    var todos = persistence.ImportFromJson(json);

                    TodoManager.Instance.ClearAll();
                    foreach (var todo in todos)
                    {
                        TodoManager.Instance.AddTodo(todo.Text, todo.Priority, todo.Category);
                    }

                    Debug.Log($"Data imported from: {path}");
                }
            }
        }

        #endregion

        #region Validation

        [MenuItem("Tools/Todo List/Clear All Data", true)]
        [MenuItem("Tools/Todo List/Add Sample Data", true)]
        [MenuItem("Tools/Todo List/Print Statistics", true)]
        [MenuItem("Tools/Todo List/Export Data", true)]
        [MenuItem("Tools/Todo List/Import Data", true)]
        private static bool ValidateMenuItems()
        {
            // 只在 Play Mode 時可用
            return Application.isPlaying;
        }

        #endregion

        #region Shortcuts

        [MenuItem("Tools/Todo List/Play Scene %&p")] // Ctrl+Alt+P
        private static void PlayScene()
        {
            if (EditorApplication.isPlaying)
            {
                EditorApplication.isPlaying = false;
            }
            else
            {
                EditorApplication.isPlaying = true;
            }
        }

        #endregion

        #region Window

        [MenuItem("Window/Todo List/Settings")]
        private static void OpenSettings()
        {
            TodoListSettingsWindow.ShowWindow();
        }

        #endregion
    }

    /// <summary>
    /// Todo List 設置窗口
    /// </summary>
    public class TodoListSettingsWindow : EditorWindow
    {
        private bool autoSave = true;
        private float autoSaveInterval = 30f;

        public static void ShowWindow()
        {
            TodoListSettingsWindow window = GetWindow<TodoListSettingsWindow>("Todo List Settings");
            window.minSize = new Vector2(300, 200);
            window.Show();
        }

        private void OnGUI()
        {
            GUILayout.Label("Todo List Settings", EditorStyles.boldLabel);

            EditorGUILayout.Space();

            autoSave = EditorGUILayout.Toggle("Auto Save", autoSave);

            if (autoSave)
            {
                autoSaveInterval = EditorGUILayout.FloatField("Auto Save Interval (seconds)", autoSaveInterval);
            }

            EditorGUILayout.Space();

            if (GUILayout.Button("Apply Settings"))
            {
                Debug.Log("Settings applied");
            }

            EditorGUILayout.Space();

            EditorGUILayout.HelpBox(
                "These settings control the Todo List behavior.\n\n" +
                "Auto Save: Automatically save data at regular intervals.\n" +
                "Auto Save Interval: Time between automatic saves.",
                MessageType.Info);
        }
    }
}
