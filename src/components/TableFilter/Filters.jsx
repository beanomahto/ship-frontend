import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const Filter = ({ dataIndex, onSearch, onReset }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleSearch = (confirm) => {
    confirm();
    onSearch(selectedKeys[0], dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSelectedKeys([]);
    onReset(dataIndex);
  };

  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  );
};

export default Filter;
