import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Statistic
            title="Total"
            value={totalTodos}
            prefix={<UnorderedListOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Active"
            value={activeTodos}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="Completed"
            value={completedTodos}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>
    </Card>
  );
};
