package com.example.todolist.adapter;

import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.example.todolist.R;
import com.example.todolist.model.Todo;

/**
 * RecyclerView Adapter for Todo items
 *
 * Efficiently displays a list of todos with checkboxes and delete buttons.
 * Uses ListAdapter for automatic diff calculations.
 */
public class TodoAdapter extends ListAdapter<Todo, TodoAdapter.TodoViewHolder> {

    private OnTodoClickListener listener;

    /**
     * Constructor
     */
    public TodoAdapter() {
        super(DIFF_CALLBACK);
    }

    /**
     * DiffUtil callback for efficient list updates
     */
    private static final DiffUtil.ItemCallback<Todo> DIFF_CALLBACK = new DiffUtil.ItemCallback<Todo>() {
        @Override
        public boolean areItemsTheSame(@NonNull Todo oldItem, @NonNull Todo newItem) {
            return oldItem.getId() == newItem.getId();
        }

        @Override
        public boolean areContentsTheSame(@NonNull Todo oldItem, @NonNull Todo newItem) {
            return oldItem.getText().equals(newItem.getText()) &&
                    oldItem.isCompleted() == newItem.isCompleted();
        }
    };

    @NonNull
    @Override
    public TodoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_todo, parent, false);
        return new TodoViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull TodoViewHolder holder, int position) {
        Todo currentTodo = getItem(position);
        holder.bind(currentTodo);
    }

    /**
     * Get todo at specific position
     *
     * @param position the position
     * @return the todo at that position
     */
    public Todo getTodoAt(int position) {
        return getItem(position);
    }

    // ==================== ViewHolder ====================

    /**
     * ViewHolder for Todo items
     */
    class TodoViewHolder extends RecyclerView.ViewHolder {

        private final CheckBox checkBox;
        private final TextView textView;
        private final TextView timeTextView;
        private final ImageButton deleteButton;

        public TodoViewHolder(@NonNull View itemView) {
            super(itemView);

            checkBox = itemView.findViewById(R.id.checkbox_todo);
            textView = itemView.findViewById(R.id.text_todo);
            timeTextView = itemView.findViewById(R.id.text_time);
            deleteButton = itemView.findViewById(R.id.button_delete);

            // Set up click listeners
            checkBox.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onTodoToggle(getItem(position));
                }
            });

            deleteButton.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onTodoDelete(getItem(position));
                }
            });

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onTodoClick(getItem(position));
                }
            });
        }

        /**
         * Bind todo data to views
         *
         * @param todo the todo to display
         */
        public void bind(Todo todo) {
            textView.setText(todo.getText());
            timeTextView.setText(todo.getFormattedCreatedAt());
            checkBox.setChecked(todo.isCompleted());

            // Apply strikethrough for completed todos
            if (todo.isCompleted()) {
                textView.setPaintFlags(textView.getPaintFlags() | Paint.STRIKE_THRU_TEXT_FLAG);
                textView.setAlpha(0.6f);
                timeTextView.setAlpha(0.6f);
            } else {
                textView.setPaintFlags(textView.getPaintFlags() & (~Paint.STRIKE_THRU_TEXT_FLAG));
                textView.setAlpha(1.0f);
                timeTextView.setAlpha(0.7f);
            }
        }
    }

    // ==================== Click Listener Interface ====================

    /**
     * Interface for handling todo item clicks
     */
    public interface OnTodoClickListener {
        void onTodoClick(Todo todo);

        void onTodoToggle(Todo todo);

        void onTodoDelete(Todo todo);
    }

    /**
     * Set the click listener
     *
     * @param listener the listener
     */
    public void setOnTodoClickListener(OnTodoClickListener listener) {
        this.listener = listener;
    }
}
