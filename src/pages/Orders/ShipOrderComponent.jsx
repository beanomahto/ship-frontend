import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Tag, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import Shopify from '../../utils/shopify.png';
import Woo from '../../utils/woocomerce.png'
import logo from '../../utils/logo1.jpg' 
import { useAuthContext } from '../../context/AuthContext';

const ShipOrderComponent = ({ rowSelection,dataSource, fetchOrders, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const { authUser } = useAuthContext();
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
    onFilter: (value, record) => {
      // Split the dataIndex in case it represents a nested field
      const keys = dataIndex.split('.');
      let data = record;
      keys.forEach(key => {
        data = data ? data[key] : null;
      });
      return data ? data.toString().toLowerCase().includes(value.toLowerCase()) : '';
    },
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
      className: 'centered-row',
    },
    {
      title: 'Shipping Status',
      dataIndex: 'awb',
      onFilter: (value, record) => record.s_status.indexOf(value) === 0,
      render:(value, record) => (
        <>
        <a target='_blank' href={`/tracking/shipment/${record.shippingPartner}/${record.awb}`}><Button type='link'><div>{record.awb}</div></Button></a>
        <span>{record?.shippingPartner}</span>
        </>
      ),
      className: 'centered-row',
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
      className: 'centered-row',
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
      className: 'centered-row',
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
      className: 'centered-row',
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (text) => (
        <div style={{display:'flex', justifyContent:'center'}}>
          <img
           src={text === 'shopify' ? Shopify : (text === 'Mannual' ? logo : Woo)}
            alt={text}
            style={{ width: 'max-content', height: '40px', borderRadius: '50%' }}
          />
        </div>
      ),
      className: 'centered-row',
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text, order) => moment(order?.createdAt).format('DD-MM-YYYY'),
    },
    ...(authUser?.role === 'admin' ? [{
      title: 'Seller Email',
      dataIndex: 'seller.email',  
      ...getColumnSearchProps('seller.email'),
      render: (_, record) => (
        <span style={{ textAlign: 'center' }}>
          {record?.seller?.email}
        </span>
      ),
      className: 'centered-row',
    }] : []),
  ];


  const shippedOrders = dataSource?.filter(order => order?.status === 'Shipped');
  console.log(shippedOrders);
  
  return (
    <>
      <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Orders </title>
            </Helmet>
      {
        loading ? (
          <Skeleton active title={false}
            paragraph={{ rows: 10 }} style={{ height: '100%', width: '100%' }}
          />
        ) : <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={shippedOrders}
           className="centered-table"
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
