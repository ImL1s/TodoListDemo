/**
 * TodoInput Component
 *
 * Demonstrates SolidJS signals for local component state.
 * Signals are the most primitive reactive primitive in SolidJS.
 *
 * Key concepts:
 * - createSignal: Returns [getter, setter] tuple
 * - Signals are functions: Call inputValue() to read
 * - Fine-grained: Only dependent expressions re-execute
 * - No virtual DOM: Updates directly manipulate the DOM
 */

import { createSignal } from 'solid-js';
import { addTodo } from '../store/todoStore';
import type { Component } from 'solid-js';

const TodoInput: Component = () => {
  /**
   * Create a signal for input value
   *
   * Unlike React's useState, signals are:
   * - Always functions for reading (inputValue(), not inputValue)
   * - More granular (only update what uses them)
   * - Synchronous (no batching needed)
   */
  const [inputValue, setInputValue] = createSignal('');

  /**
   * Handle form submission
   * Adds todo and clears input
   */
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const value = inputValue();

    if (value.trim()) {
      addTodo(value);
      setInputValue(''); // Clear input after adding
    }
  };

  /**
   * Handle input changes
   * SolidJS uses native events, no synthetic event system
   */
  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  /**
   * JSX in SolidJS:
   * - Compiled to real DOM operations, not virtual DOM
   * - Reactive expressions (like {inputValue()}) automatically track dependencies
   * - Event handlers use on:event syntax or onEvent
   */
  return (
    <form onSubmit={handleSubmit} class="todo-input-form">
      <input
        type="text"
        class="todo-input"
        placeholder="What needs to be done?"
        value={inputValue()}
        onInput={handleInput}
        autofocus
      />
    </form>
  );
};

export default TodoInput;
