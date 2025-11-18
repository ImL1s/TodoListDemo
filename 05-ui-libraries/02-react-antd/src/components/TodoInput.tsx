import React, { useState } from 'react';
import { Input, Button, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          size="large"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Space.Compact>
    </Card>
  );
};
