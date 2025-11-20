package com.example.todolist;

import android.os.Bundle;
import android.text.InputType;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.todolist.adapter.TodoAdapter;
import com.example.todolist.model.Todo;
import com.example.todolist.viewmodel.TodoViewModel;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

/**
 * Main Activity
 *
 * The main screen of the TodoList application.
 * Displays todos in a RecyclerView with MVVM architecture.
 */
public class MainActivity extends AppCompatActivity {

    private TodoViewModel todoViewModel;
    private TodoAdapter adapter;

    private RecyclerView recyclerView;
    private FloatingActionButton fabAdd;

    private String currentFilter = "all"; // all, active, completed

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Set up toolbar
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("TodoList");
        }

        // Initialize views
        initViews();

        // Initialize ViewModel
        initViewModel();

        // Set up RecyclerView
        setupRecyclerView();

        // Set up FAB
        setupFab();

        // Observe data
        observeData();

        System.out.println("MainActivity created");
    }

    /**
     * Initialize views
     */
    private void initViews() {
        recyclerView = findViewById(R.id.recycler_view);
        fabAdd = findViewById(R.id.fab_add);
    }

    /**
     * Initialize ViewModel
     */
    private void initViewModel() {
        todoViewModel = new ViewModelProvider(this).get(TodoViewModel.class);
    }

    /**
     * Set up RecyclerView with adapter and layout manager
     */
    private void setupRecyclerView() {
        // Create adapter
        adapter = new TodoAdapter();

        // Set up click listeners
        adapter.setOnTodoClickListener(new TodoAdapter.OnTodoClickListener() {
            @Override
            public void onTodoClick(Todo todo) {
                // Optional: Handle todo item click
            }

            @Override
            public void onTodoToggle(Todo todo) {
                todoViewModel.toggleTodo(todo);
            }

            @Override
            public void onTodoDelete(Todo todo) {
                showDeleteConfirmation(todo);
            }
        });

        // Set up RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
        recyclerView.setHasFixedSize(true);

        // Add swipe to delete
        setupSwipeToDelete();
    }

    /**
     * Set up swipe to delete gesture
     */
    private void setupSwipeToDelete() {
        new ItemTouchHelper(new ItemTouchHelper.SimpleCallback(0,
                ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {

            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView,
                                  @NonNull RecyclerView.ViewHolder viewHolder,
                                  @NonNull RecyclerView.ViewHolder target) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                int position = viewHolder.getAdapterPosition();
                Todo todo = adapter.getTodoAt(position);
                todoViewModel.delete(todo);
                Toast.makeText(MainActivity.this, "Todo deleted", Toast.LENGTH_SHORT).show();
            }
        }).attachToRecyclerView(recyclerView);
    }

    /**
     * Set up FloatingActionButton
     */
    private void setupFab() {
        fabAdd.setOnClickListener(v -> showAddTodoDialog());
    }

    /**
     * Observe LiveData from ViewModel
     */
    private void observeData() {
        // Observe based on current filter
        updateObserver();
    }

    /**
     * Update observer based on current filter
     */
    private void updateObserver() {
        // Remove all observers first
        todoViewModel.getAllTodos().removeObservers(this);
        todoViewModel.getActiveTodos().removeObservers(this);
        todoViewModel.getCompletedTodos().removeObservers(this);

        // Observe based on filter
        switch (currentFilter) {
            case "active":
                todoViewModel.getActiveTodos().observe(this, todos -> {
                    adapter.submitList(todos);
                    updateTitle();
                });
                break;

            case "completed":
                todoViewModel.getCompletedTodos().observe(this, todos -> {
                    adapter.submitList(todos);
                    updateTitle();
                });
                break;

            default: // "all"
                todoViewModel.getAllTodos().observe(this, todos -> {
                    adapter.submitList(todos);
                    updateTitle();
                });
                break;
        }
    }

    /**
     * Update activity title with todo count
     */
    private void updateTitle() {
        if (getSupportActionBar() != null) {
            int count = adapter.getItemCount();
            String title = switch (currentFilter) {
                case "active" -> "Active (" + count + ")";
                case "completed" -> "Completed (" + count + ")";
                default -> "TodoList (" + count + ")";
            };
            getSupportActionBar().setTitle(title);
        }
    }

    /**
     * Show dialog to add a new todo
     */
    private void showAddTodoDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Add Todo");

        // Set up input field
        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        input.setHint("What needs to be done?");
        input.setPadding(50, 30, 50, 30);
        builder.setView(input);

        // Set up buttons
        builder.setPositiveButton("Add", (dialog, which) -> {
            String text = input.getText().toString().trim();
            if (!text.isEmpty()) {
                Todo todo = new Todo(text);
                todoViewModel.insert(todo);
                Toast.makeText(this, "Todo added", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Please enter a todo", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());

        builder.show();
    }

    /**
     * Show confirmation dialog before deleting
     *
     * @param todo the todo to delete
     */
    private void showDeleteConfirmation(Todo todo) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Todo")
                .setMessage("Are you sure you want to delete this todo?\n\n\"" + todo.getText() + "\"")
                .setPositiveButton("Delete", (dialog, which) -> {
                    todoViewModel.delete(todo);
                    Toast.makeText(this, "Todo deleted", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    /**
     * Show confirmation dialog before clearing completed
     */
    private void showClearCompletedConfirmation() {
        new AlertDialog.Builder(this)
                .setTitle("Clear Completed")
                .setMessage("Are you sure you want to delete all completed todos?")
                .setPositiveButton("Clear", (dialog, which) -> {
                    todoViewModel.deleteCompleted();
                    Toast.makeText(this, "Completed todos cleared", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    /**
     * Show confirmation dialog before deleting all
     */
    private void showDeleteAllConfirmation() {
        new AlertDialog.Builder(this)
                .setTitle("Delete All")
                .setMessage("Are you sure you want to delete ALL todos?")
                .setPositiveButton("Delete All", (dialog, which) -> {
                    todoViewModel.deleteAll();
                    Toast.makeText(this, "All todos deleted", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    // ==================== Menu ====================

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_filter_all) {
            currentFilter = "all";
            updateObserver();
            return true;
        } else if (id == R.id.action_filter_active) {
            currentFilter = "active";
            updateObserver();
            return true;
        } else if (id == R.id.action_filter_completed) {
            currentFilter = "completed";
            updateObserver();
            return true;
        } else if (id == R.id.action_clear_completed) {
            showClearCompletedConfirmation();
            return true;
        } else if (id == R.id.action_delete_all) {
            showDeleteAllConfirmation();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
