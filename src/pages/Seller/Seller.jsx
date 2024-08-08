import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined} from '@ant-design/icons';
import { Helmet } from 'react-helmet';

const Seller = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend-9u5u.onrender.com/api/users', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        const data = await response.json();
        const companyUsers = data.filter((user) => user.role === 'company');
        setUsers(companyUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : 'black' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      ...getColumnSearchProps('companyName'),
      key: 'companyName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      ...getColumnSearchProps('firstName'),
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      ...getColumnSearchProps('lastName'),
      key: 'lastName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber'),
      key: 'phoneNumber',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      ...getColumnSearchProps('amount'),
      key: 'amount',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'verify',
      render: (text) => (
        <Tag color={text ? 'green' : 'geekblue'}>
          {text ? 'Verified' : 'Not verified'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleGetKYC(record._id)}>
          <Link to={`/seller/getkyc/${record._id}`}>Get KYC</Link>
        </Button>
      ),
    },
  ];

  const handleGetKYC = (id) => {
    console.log(`Get KYC for user with id: ${id}`);
  };

  return (
    <div style={{ backgroundColor: '#fff', height: '45rem', borderRadius: '1rem' }}>
        <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Sellers</title>
            </Helmet>
      <Table dataSource={users} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default Seller;
