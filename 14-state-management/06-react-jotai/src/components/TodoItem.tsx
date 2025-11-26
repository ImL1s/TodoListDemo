/**
 * TodoItem Component
 *
 * Demonstrates:
 * - useSetAtom for write-only actions
 * - Multiple atom updates in single component
 * - Optimized re-renders (only when own props change)
 */

import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { toggleTodoAtom, deleteTodoAtom, editTodoAtom } from '../atoms/todoAtoms';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // All these are write-only - component won't re-render when atoms change
  // It only re-renders when props.todo changes
  const toggleTodo = useSetAtom(toggleTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);
  const editTodo = useSetAtom(editTodoAtom);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    editTodo({ id: todo.id, text: editText });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <span className="todo-text" onDoubleClick={handleEdit}>
        {todo.text}
      </span>
      <div className="todo-actions">
        <button onClick={handleEdit} className="edit-button">
          Edit
        </button>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </li>
  );
}

/*
 * KEY JOTAI CONCEPTS DEMONSTRATED:
 *
 * 1. Fine-grained Reactivity:
 *    - Component only re-renders when props.todo changes
 *    - useSetAtom doesn't cause re-renders
 *    - This is a key performance benefit
 *
 * 2. Multiple Action Atoms:
 *    - toggleTodoAtom, deleteTodoAtom, editTodoAtom
 *    - Each is a separate, focused atom
 *    - Clean separation of concerns
 *
 * 3. Local State Mixed with Global State:
 *    - isEditing, editText are local (useState)
 *    - Todo data is global (Jotai atoms)
 *    - Natural React patterns still work
 *
 * PERFORMANCE OPTIMIZATION:
 *
 * This component demonstrates Jotai's optimization strategy:
 *
 * ❌ BAD (causes unnecessary re-renders):
 *    const todos = useAtomValue(todosAtom);
 *    const todo = todos.find(t => t.id === id);
 *    - Re-renders whenever ANY todo changes
 *
 * ✅ GOOD (current approach):
 *    <TodoItem todo={todo} />
 *    - Only re-renders when THIS todo changes
 *    - Parent filters and passes specific todo
 *
 * ⭐ EVEN BETTER (with atom family):
 *    const todo = useAtomValue(todoAtomFamily(id));
 *    - Each todo has its own atom
 *    - Maximum granularity
 *    - Best for very large lists
 *
 * COMPARISON WITH OTHER LIBRARIES:
 *
 * Recoil:
 *   const todo = useRecoilValue(todoSelectorFamily(id));
 *   const toggleTodo = useSetRecoilState(toggleTodoSelector);
 *   - Similar pattern, but needs selector families
 *
 * Zustand:
 *   const toggleTodo = useTodoStore(state => state.toggleTodo);
 *   - Need custom equality function to prevent re-renders
 *   - Less automatic optimization
 *
 * Redux:
 *   const dispatch = useDispatch();
 *   const handleToggle = () => dispatch(toggleTodo(todo.id));
 *   - More verbose
 *   - Need to define action types and creators
 */
