import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Tag, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShipOrderComponent = ({ dataSource, fetchOrders, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const cancelShipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://backend-9u5u.onrender.com/api/orders/updateOrderStatus/${selectedRowKeys}`, {
        status: 'Cancelled'
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      if (response.status === 201) {
        message.success('Order canceled successfully');
        fetchOrders();
        setSelectedRowKeys([]);
      }

    } catch (error) {
      message.error('Failed to cancel order');
    }
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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
      title: 'Order Id',
      dataIndex: 'orderId',
      ...getColumnSearchProps('orderId'),
    },
    {
      title: 'Shipping Status',
      dataIndex: 's_status',
      // filters: [
      //   { text: 'Shipped', value: 'Shipped' },
      //   { text: 'InTransit', value: 'InTransit' },
      //   { text: 'Delivered', value: 'Delivered' },
      //   { text: 'Cancelled', value: 'Cancelled' },
      // ],
      onFilter: (value, record) => record.s_status.indexOf(value) === 0,
    },
    {
      title: 'Customer Info',
      dataIndex: 'customerName',
      ...getColumnSearchProps('customerName'),
      render: (text, order) => (
        <>
          <div>{order.customerName}</div>
          <div>{order.customerEmail}</div>
        </>
      ),
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentMethod',
      filters: [
        { text: 'COD', value: 'COD' },
        { text: 'Prepaid', value: 'Prepaid' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <>
          <div>&#8377; {order.productPrice}</div>
          <Tag color={order.paymentMethod === 'COD' ? 'green-inverse' : 'geekblue-inverse'} >
            {order.paymentMethod}
          </Tag>
        </>
      ),
    },
    {
      title: 'Package Details',
      render: (text, order) => (
        <>
          <div>pkg Wt. {order.weight}gm</div>
          <div>
            ({order.length}x{order.breadth}x{order.height}cm)
          </div>
        </>
      ),
    },
    {
      title: 'Channel',
      dataIndex: 'productName',
      ...getColumnSearchProps('productName'),
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text, order) => moment(order?.createdAt).format('DD-MM-YYYY'),
    },
  ];


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  const shippedOrders = dataSource?.filter(order => order?.status === 'Shipped');
  // console.log(rowSelection);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {/* <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'black' }}>
          <Link to={`/shipping/tracking/${selectedRowKeys[0]}`}>Track Order</Link>
        </Button> */}
        <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'black' }}>
          <Link to={`/shipping/getlabel/${selectedRowKeys[0]}`}>Shipping Label</Link>
        </Button>
        {/* getInvoice */}
        <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'gray' }}>
          <Link to={`/shipping/getInvoice/${selectedRowKeys[0]}`}>Invoice</Link>
        </Button>
        <Button style={{ borderColor: 'red' }} onClick={cancelShipment}>Cancel Shipment</Button>
      </div>
      {
        loading ? (
          <Skeleton active title={false}
            paragraph={{ rows: 10 }} style={{ height: '100%', width: '100%' }}
          />
        ) : <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={shippedOrders}
          rowKey="_id"
          scroll={{ y: 450 }}
          pagination={false}
          style={{ width: '100%', height: '505px' }}
        />
      }
    </>
  );
};

export default ShipOrderComponent;
