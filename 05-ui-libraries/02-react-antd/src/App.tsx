import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Space, ConfigProvider, theme } from 'antd';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { FilterButtons } from './components/FilterButtons';
import { Todo } from './types';

const { Header, Content } = Layout;
const { Title } = Typography;

const STORAGE_KEY = 'antd-todo-list';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDarkMode ? '#141414' : '#001529',
            padding: '0 24px',
          }}
        >
          <Space>
            <CheckSquareOutlined style={{ fontSize: 28, color: '#fff' }} />
            <Title
              level={3}
              style={{ color: '#fff', margin: 0, lineHeight: '64px' }}
            >
              Ant Design Todo List
            </Title>
          </Space>
          <Space>
            <Button
              icon={<BgColorsOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ color: '#fff', borderColor: '#fff' }}
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
            {hasCompletedTodos && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={clearCompleted}
                style={{ color: '#fff', borderColor: '#fff' }}
              >
                Clear Completed
              </Button>
            )}
          </Space>
        </Header>

        <Content style={{ padding: '24px 16px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <TodoInput onAdd={addTodo} />

            {todos.length > 0 && <TodoStats todos={todos} />}

            <FilterButtons filter={filter} onFilterChange={setFilter} />

            <TodoList
              todos={todos}
              filter={filter}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
