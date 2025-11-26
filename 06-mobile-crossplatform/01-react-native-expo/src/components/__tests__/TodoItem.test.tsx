import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoItem from '../TodoItem';
import { Todo } from '../../types';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    createdAt: Date.now(),
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Test todo')).toBeTruthy();
  });

  it('displays completed state correctly', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const { getByText } = render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const text = getByText('Test todo');
    expect(text.props.style).toContainEqual(
      expect.objectContaining({ textDecorationLine: 'line-through' })
    );
  });

  it('calls onToggle when checkbox is pressed', () => {
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Test todo'));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByA11yLabel } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByA11yLabel('Delete todo'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('formats timestamp correctly', () => {
    const now = Date.now();
    const recentTodo = { ...mockTodo, createdAt: now - 60000 }; // 1 minute ago

    const { getByText } = render(
      <TodoItem
        todo={recentTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText(/min.*ago/)).toBeTruthy();
  });

  it('shows "Just now" for very recent todos', () => {
    const recentTodo = { ...mockTodo, createdAt: Date.now() };

    const { getByText } = render(
      <TodoItem
        todo={recentTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Just now')).toBeTruthy();
  });
});
