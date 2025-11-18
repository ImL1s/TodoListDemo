/**
 * TodoInput Component
 *
 * Demonstrates Jotai hooks:
 * - useAtom: Read and write atom value (like useState)
 * - useSetAtom: Write-only access (performance optimization)
 */

import { useAtom, useSetAtom } from 'jotai';
import { inputTextAtom, addTodoAtom } from '../atoms/todoAtoms';

export function TodoInput() {
  // useAtom gives us both value and setter (like useState)
  const [inputText, setInputText] = useAtom(inputTextAtom);

  // useSetAtom only gives us the setter (no re-render when value changes)
  // This is a performance optimization - component only re-renders when inputText changes
  const addTodo = useSetAtom(addTodoAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(inputText);
    // Note: addTodoAtom already clears the input, but we could also do:
    // setInputText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={inputText}
        onChange={handleChange}
        autoFocus
      />
      <button type="submit" className="add-button">
        Add Todo
      </button>
    </form>
  );
}

/*
 * KEY JOTAI CONCEPTS DEMONSTRATED:
 *
 * 1. useAtom Hook:
 *    - Similar to useState, but for atoms
 *    - Returns [value, setter]
 *    - Component re-renders when atom value changes
 *
 * 2. useSetAtom Hook:
 *    - Returns only the setter function
 *    - Component doesn't re-render when atom value changes
 *    - Better performance when you don't need the value
 *
 * 3. Write-only Atoms:
 *    - addTodoAtom is write-only (read returns null)
 *    - Perfect for actions/commands
 *    - Similar to Redux actions, but simpler
 *
 * COMPARISON WITH OTHER LIBRARIES:
 *
 * Recoil:
 *   const [inputText, setInputText] = useRecoilState(inputTextState);
 *   const addTodo = useSetRecoilState(addTodoState);
 *   - Very similar API, nearly identical usage
 *
 * Zustand:
 *   const { inputText, setInputText, addTodo } = useTodoStore();
 *   - All state in one hook
 *   - Less granular (might re-render more)
 *
 * Redux:
 *   const inputText = useSelector(state => state.inputText);
 *   const dispatch = useDispatch();
 *   const handleChange = (e) => dispatch(setInputText(e.target.value));
 *   const handleSubmit = (e) => dispatch(addTodo(inputText));
 *   - More verbose
 *   - Need action creators and reducers
 */
