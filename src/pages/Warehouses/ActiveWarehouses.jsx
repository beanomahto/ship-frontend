import React from 'react';
import { Button, Table, Tag, message, Modal } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { useWarehouseContext } from '../../context/WarehouseContext';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ActiveWarehouses = () => {
  const { warehouse, fetchWarehouse } = useWarehouseContext();
  const { authUser } = useAuthContext();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend.shiphere.in/api/warehouses/deleteWarehouse/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      message.success('Warehouse deleted successfully');
      fetchWarehouse();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      message.error('Failed to delete warehouse');
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this warehouse?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id); 
      },
      onCancel() {
        console.log('Cancel deletion');
      },
    });
  };

  const newOrders = [
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouseName',
    },
    {
      title: 'Contact Details',
      dataIndex: 'contactDetails',
      render: (text, warehouse) => (
        <>
          <div>{warehouse.contactPerson}</div>
          <div>{warehouse.contactEmail}</div>
        </>
      ),
    },
    {
      title: 'Pin Code',
      dataIndex: 'pincode',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'red' : 'green'}>
         Active
        </Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, warehouse) => (
        <>
          <NavLink to={`${warehouse?._id}`}>
            <EditOutlined />
          </NavLink>
          <DeleteOutlined
            style={{ color: 'red', marginLeft: '1rem', cursor: 'pointer' }}
            onClick={() => showDeleteConfirm(warehouse._id)} 
          />
        </>
      ),
    },
    ...(authUser?.role === 'admin'
      ? [
          {
            title: 'Seller',
            dataIndex: 'seller',
            render: (text, warehouse) => <div>{warehouse?.seller?.email}</div>,
          },
        ]
      : []),
  ];

  const dataSourceWithKeys = warehouse?.warehouses?.map((warehouse, index) => ({
    ...warehouse,
    key: index.toString(),
  }));

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content="" />
        <title>Warehouses</title>
      </Helmet>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <Button>
          <Link to="addwarehouse">Add Warehouse</Link>
        </Button>
      </div>
      <div style={{ backgroundColor: '#fff', height: '40rem', borderRadius: '1rem' }}>
        <Table className="table" pagination={false} columns={newOrders} dataSource={dataSourceWithKeys} />
      </div>
    </>
  );
};

export default ActiveWarehouses;
