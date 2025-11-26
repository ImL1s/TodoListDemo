import React from 'react';
import { List, Card, Empty } from 'antd';
import { TodoItem } from './TodoItem';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onToggle,
  onDelete,
}) => {
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0 && todos.length > 0) {
    return (
      <Card>
        <Empty
          description={
            filter === 'active'
              ? 'No active todos'
              : filter === 'completed'
              ? 'No completed todos'
              : 'No todos yet'
          }
        />
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card>
        <Empty description="No todos yet. Add one to get started!" />
      </Card>
    );
  }

  return (
    <Card>
      <List
        dataSource={filteredTodos}
        renderItem={(todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        )}
      />
    </Card>
  );
};
