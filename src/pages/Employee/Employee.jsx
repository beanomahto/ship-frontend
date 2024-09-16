import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import CustomButton from '../../components/Button/Button';

const Employee = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  console.log(users);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://backend.shiphere.in/api/employee/getEmployees', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
console.log(users);

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
console.log(users);

const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Professional Email',
      dataIndex: 'professionalEmail',
      ...getColumnSearchProps('professionalEmail'),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      ...getColumnSearchProps('contact'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Father’s Name',
      dataIndex: 'fatherName',
      ...getColumnSearchProps('fatherName'),
    },
    {
      title: 'Emergency Contact',
      dataIndex: 'emergencyContact',
      ...getColumnSearchProps('emergencyContact'),
    },
    {
      title: 'Date of Joining',
      dataIndex: 'dateOfJoining',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      ...getColumnSearchProps('employeeCode'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record.employeeCode)}>
          <Link to={`/employee/details/${record.employeeCode}`}>View Details</Link>
        </Button>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#fff', height: '45rem', borderRadius: '1rem' }}>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={""} />
        <title>Employee</title>
      </Helmet>
     <div style={{display:'flex', justifyContent:'flex-end', marginRight:'2rem'}} >
     <CustomButton ><NavLink to={'addEmployee'} >Add Employee</NavLink></CustomButton>
     </div>
      <Table dataSource={users} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default Employee;
