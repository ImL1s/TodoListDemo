import React from 'react';
import { List, Checkbox, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Todo } from '../types';

const { Text } = Typography;

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <List.Item
      actions={[
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
        />
      ]}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: 12 }}
      />
      <Text
        delete={todo.completed}
        type={todo.completed ? 'secondary' : undefined}
        style={{
          flex: 1,
          fontSize: '16px',
          fontWeight: todo.completed ? 400 : 500,
        }}
      >
        {todo.text}
      </Text>
    </List.Item>
  );
};
