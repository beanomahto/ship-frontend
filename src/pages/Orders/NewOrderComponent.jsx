import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Skeleton, message, Modal, Progress } from 'antd';
import { SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import useShipNowCost from '../../hooks/useShipNowCost';
import { useWarehouseContext } from '../../context/WarehouseContext';
import BD from '../../utils/bluedart.png';
import DLVRY from '../../utils/delhivery.png';
import AS from '../../utils/amazon-shipping.png';
import EE from '../../utils/ecom-express.png';
import XPB from '../../utils/xpressbees.png';
import Column from 'antd/es/table/Column';
import Shopify from '../../utils/shopify.png';
import Woo from '../../utils/woocomerce.png'
import logo from '../../utils/logo1.jpg'
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';

const partnerImages = {
  'Blue Dart': BD,
  'Delhivery': DLVRY,
  'Amazon Shipping': AS,
  'Ecom Express': EE,
  'Xpressbees': XPB,
};


const channelImages = {
  'Shopify': Shopify,
};

const NewOrderComponent = ({ dataSource, rowSelection, fetchOrders, loading,setModalLoading,modalLoading,deliveryCosts,setDeliveryCosts,setSelectedOrderId,selectedOrderId,currentDeliveryCost,setCurrentDeliveryCost }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  console.log(currentDeliveryCost);
  
 
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

 
 
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
      render: (text, order) => (
        <Link style={{ color: 'black', fontWeight: '400', fontFamily: 'Poppins' }} to={`/orders/updateorder/${order?._id}/${order?.orderId}`}>{order.orderId}</Link>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'o_status',
      render: (text, order) => (
        <Tag style={{ display: 'flex', maxWidth: 'max-content', marginLeft: '3rem' }} color={order.status === 'New' ? 'green' : 'volcano'} >
          {order.status}
        </Tag>
      ),
    },
    {
      title: 'Customer Info',
      dataIndex: 'customerName',
      ...getColumnSearchProps('customerName'),
      render: (text, order) => (
        <>
          <div style={{ fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500' }}>{order.customerName}</div>
          <div style={{ fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500' }}>{order.customerEmail}</div>
        </>
      ),
    },
    {
      title: 'Payment Details',
      dataIndex: 'paymentMethod',
      filters: [
        { text: 'COD', value: 'COD' },
        { text: 'Prepaid', value: 'prepaid' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
      render: (text, order) => (
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '4.5rem', marginLeft: '1rem', fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500' }}>
          <div>&#8377; {order.productPrice}</div>
          <Tag color={order.paymentMethod === 'COD' ? 'green-inverse' : 'geekblue-inverse'} >
            {order.paymentMethod}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Package Details',
      render: (text, order) => (
        <div style={{ fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500' }}>
          <div>pkg Wt. {order.weight}gm</div>
          <div>
            ({order.length}x{order.breadth}x{order.height}cm)
          </div>
        </div>
      ),
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (text) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft:'25px' }}>
          <img
            // src={text === 'shopify' ? Shopify : Woo}
            src={text === 'shopify' ? Shopify : (text === 'Mannual' ? logo : Woo)}
            alt={text}
            style={{ width: 'max-content', height: '40px', borderRadius: '50%' }}
          />
        </div>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      ...getColumnSearchProps('createdAt'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text, order) => moment(order?.createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Quick Assign',
      dataIndex: 'q_assign',
      render: (text, order) => (
        <div style={{ position: 'absolute', left: '2.3rem', top: '2rem' }} >
          <ThunderboltOutlined
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#08c' }}
            onClick={() => handleExpandRow(order._id)}
          />
        </div>
      ),
    },
    ...(authUser?.role === 'admin' ? [{
      title: 'Seller Email',
      dataIndex: 'seller',
      render: (_, record) => (
          <span
          >
            {record?.seller?.email}
          </span>
        ),
    }] : []),
  ];

  const handleExpandRow = (key) => {
    setSelectedOrderId(key);
    setIsModalVisible(true);
  };
  const handleAssign = async (partner) => {
    try {
      setModalLoading(true);
      const selectedOrder = dataSource.find(order => order._id === selectedOrderId);
      const partnerCost = partner.cost;
      const totalDebit = partnerCost;
      
      setCurrentDeliveryCost(totalDebit);
      
      const walletRequestBody = {
        debit: totalDebit,
        userId: selectedOrder.seller._id,
        remark: `Shipping charge for order ${selectedOrder.orderId}`,
        orderId: selectedOrder._id,
      };
      console.log(walletRequestBody);
      
      const walletResponse = await axios.post(
        'https://backend.shiphere.in/api/transactions/decreaseAmount',
        walletRequestBody,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      console.log(walletResponse);
      
      if (walletResponse.status === 200) {
        const updateBody = {
          status: 'Shipped',
          shippingCost: totalDebit,
        };
        const orderResponse = await axios.put(
          `https://backend.shiphere.in/api/orders/updateOrderStatus/${selectedOrderId}`,
          updateBody,
          {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          }
        );
        console.log(updateBody);
      
        if (orderResponse.status === 201) {
          message.success("Shipped successfully");
          fetchOrders();
          setIsModalVisible(false);
          setSelectedOrderId(null);
          setSelectedPartner(null);
        } else {
          message.error("Failed to update order status");
        }
      } else {
        message.error("Failed to debit wallet");
      }
    } catch (error) {
      message.error("Issue in shipping");
      console.error('Failed to update order status', error);
    } finally {
      setModalLoading(false);
    }
  };
  
  const newOrders = dataSource?.filter(order => order.status === 'New' || order.status === 'Cancelled');
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={""} />
        <title>Orders </title>
      </Helmet>
      {loading ? (
        <Skeleton active title={false} paragraph={{ rows: 10 }} style={{ height: '100%', width: '100%' }} />
      ) : (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newOrders}
            scroll={{ y: 430 }}
            style={{ width: '100%', height: '545px' }}
            rowClassName={(record) => (record._id === selectedOrderId ? 'selected-row' : '')}
            loading={loading}
          />
          <Modal
            title="Assign Delivery Partner"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={1000}
            confirmLoading={modalLoading}
          >
            <Table
              dataSource={deliveryCosts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              loading={modalLoading}
            // style={{fontSize:'4rem'}}
            // className="delivery-cost-table"

            >
              <Column
                title="Partner"
                dataIndex="deliveryPartner"
                key="deliveryPartner"
                render={(text, record) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={partnerImages[record.deliveryPartner]}
                      alt={record.deliveryPartner}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px', border: '2px solid #ddd' }}
                    />
                    <p style={{ fontWeight: '500', fontSize: '1rem' }}> {record.deliveryPartner}</p>
                  </div>
                )}
              />
              <Column
                title="Rating"
                key="rating"
                render={() => (
                  <Progress
                    type="circle"
                    percent={84}
                    format={() => '4.2'}
                    width={40}
                    strokeColor="#52c41a"
                    strokeWidth={8}
                  />
                )}
              />
              <Column
                title="Cost"
                dataIndex="cost"
                key="cost"
                render={(text) => `₹ ${text}`}
              />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <Button
                    type="primary"
                    onClick={() => handleAssign(record)}
                    disabled={selectedPartner === record}
                    style={{ cursor: 'pointer' }}
                  >
                    Assign
                  </Button>
                )}
              />
            </Table>
          </Modal>
        </>
      )}
    </>
  );
};

export default NewOrderComponent;
