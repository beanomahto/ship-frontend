import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

const Seller = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        const companyUsers = data.filter(user => user.role === 'company');
        setUsers(companyUsers);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
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
  ];

  return (
    <div  style={{backgroundColor:"#fff", height:"40rem", borderRadius:'1rem'}}>
      <Table dataSource={users} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default Seller;
