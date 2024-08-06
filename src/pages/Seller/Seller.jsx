import React, { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const Seller = () => {
  const [users, setUsers] = useState([]);

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

  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
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
      <Table dataSource={users} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default Seller;
