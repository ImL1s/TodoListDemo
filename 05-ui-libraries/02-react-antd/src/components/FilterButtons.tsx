import React from 'react';
import { Card, Radio, Space } from 'antd';
import {
  UnorderedListOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface FilterButtonsProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <Card style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} align="center">
        <Radio.Group
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          buttonStyle="solid"
          size="large"
        >
          <Radio.Button value="all">
            <UnorderedListOutlined /> All
          </Radio.Button>
          <Radio.Button value="active">
            <ClockCircleOutlined /> Active
          </Radio.Button>
          <Radio.Button value="completed">
            <CheckCircleOutlined /> Completed
          </Radio.Button>
        </Radio.Group>
      </Space>
    </Card>
  );
};
