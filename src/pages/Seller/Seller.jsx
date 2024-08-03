import React, { useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const Seller = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
<<<<<<< Updated upstream
    fetch('https://backend-9u5u.onrender.com/api/users'
      , {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(response => response.json())
      .then(data => {
        const companyUsers = data.filter(user => user.role === 'company');
=======
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        console.log(data);

        const companyUsers = data?.filter(user => user.role === 'company');
>>>>>>> Stashed changes
        setUsers(companyUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  console.log(users);

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
        <div>
          {text === false ? (
            <Tag color={text !== false ? 'green' : 'geekblue'}>
              Not verified
            </Tag>
          ) : (
            <h1>OK</h1>
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleGetKYC(record._id)}><Link to={`/seller/getkyc/${record._id}`} >Get KYC</Link></Button>
      ),
    },
  ];

  const handleGetKYC = (id) => {
    console.log(`Get KYC for user with id: ${id}`);
  };

  return (
    <div style={{ backgroundColor: "#fff", height: "40rem", borderRadius: '1rem' }}>
      <Table dataSource={users} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default Seller;
