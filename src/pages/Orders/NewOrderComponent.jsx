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
import Ekart from '../../utils/ekart.jpeg'
import Dtdc from '../../utils/dtdc.png'
import SF from '../../utils/shadowFax.png'
import logo from '../../utils/logo1.jpg'
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';
import useCreateShipment from '../../hooks/useCreateShipment';

const partnerImages = {
  'Blue Dart': BD,
  'Delhivery': DLVRY,
  'Amazon Shipping': AS,
  'Ecom Express': EE,
  'Xpressbees': XPB,
  'Ekart': Ekart,
  'DTDC': Dtdc,
  'Shadowfax':SF
};


const channelImages = {
  'Shopify': Shopify,
};

const NewOrderComponent = ({ tab,dataSource, rowSelection, fetchOrders, loading,setModalLoading,modalLoading,deliveryCosts,setDeliveryCosts,setSelectedOrderId,selectedOrderId,currentDeliveryCost,setCurrentDeliveryCost,warehouse,selectedWarehouse,selectedWarehouseId,selectedOrderData }) => {
  console.log(tab);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  console.log(currentDeliveryCost);
  console.log(warehouse);
  console.log(selectedWarehouseId);
  
 
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

 
 
  const { authUser,fetchBalance } = useAuthContext();
  const {shipOrder,error} = useCreateShipment()

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
  const tabs =  tab.tab.split(' ')[0];
  console.log(tabs);
  const columns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      ...getColumnSearchProps('orderId'),
      render: (text, order) => (
        <Link style={{ color: 'black', fontWeight: '400', fontFamily: 'Poppins', textAlign: 'center' }} to={`/orders/${tabs}/updateorder/${order?._id}/${order?.orderId}`}>
          {order.orderId}
        </Link>
      ),
      className: 'centered-row',
    },
    {
      title: 'Order Status',
      dataIndex: 'o_status',
      render: (text, order) => (
        <Tag style={{ display: 'flex', justifyContent: 'center', maxWidth: 'max-content', marginLeft: '3rem' }} color={order.status === 'New' ? 'green' : 'volcano'}>
          {order.status}
        </Tag>
      ),
      className: 'centered-row',
    },
    {
      title: 'Customer Info',
      dataIndex: 'customerName',
      ...getColumnSearchProps('customerName'),
      render: (text, order) => (
        <div style={{ fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500', textAlign: 'center' }}>
          <div>{order.customerName}</div>
          <div>{order.customerPhone}</div>
        </div>
      ),
      className: 'centered-row',
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '4.5rem', marginLeft: '1rem', fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500' }}>
          <div>&#8377; {order.productPrice}</div>
          <Tag color={order.paymentMethod === 'COD' ? 'green-inverse' : 'geekblue-inverse'}>
            {order.paymentMethod}
          </Tag>
        </div>
      ),
      className: 'centered-row',
    },
    {
      title: 'Package Details',
      render: (text, order) => (
        <div style={{ fontFamily: 'Poppins', fontSize: '.9rem', fontWeight: '500', textAlign: 'center' }}>
          <div>pkg Wt. {order.weight}gm</div>
          <div>({order.length}x{order.breadth}x{order.height}cm)</div>
        </div>
      ),
      className: 'centered-row',
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      render: (text) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
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
      ...getColumnSearchProps('createdAt'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text, order) => <>
      <div>{moment(order?.createdAt).format('DD-MM-YYYY')}<span style={{marginLeft:'10px', fontStyle:'italic'}}>{moment(order?.createdAt).format('HH:mm')}</span></div>
      </>,
      className: 'centered-row',
    },
    {
      title: 'Quick Assign',
      dataIndex: 'q_assign',
      render: (text, order) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ThunderboltOutlined
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#08c' }}
            onClick={() => handleExpandRow(order._id)}
          />
        </div>
      ),
      className: 'centered-row',
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

  const handleExpandRow = (key) => {
    setSelectedOrderId(key);
    setIsModalVisible(true);
  }; 

  const handleAssign = async (partner) => {
    try {
      setModalLoading(true);
      const selectedOrder = dataSource.find(order => order._id === selectedOrderId);
  
      const { codCost, forwardCost } = partner;
      const gstRate = 0.018; 
      const codCostWithGst = codCost * (1 + gstRate);
      const forwardCostWithGst = forwardCost * (1 + gstRate);
      const totalDebit = forwardCostWithGst + codCostWithGst;
  
      const sendWarehouse = Array.isArray(selectedWarehouseId) && selectedWarehouseId.length === 0
  ? warehouse?.warehouses?.[0]
  : selectedWarehouseId;

console.log(sendWarehouse);

      
      setCurrentDeliveryCost(totalDebit);
      await shipOrder(
        selectedOrder, 
        sendWarehouse, 
        partner.deliveryPartner
      );
  
      if (codCostWithGst > 0) {
        const codWalletRequestBody = {
          debit: codCostWithGst,
          userId: selectedOrder.seller._id,
          remark: `COD charge for order ${selectedOrder.orderId}`,
          orderId: selectedOrder._id,
        };
        const codWalletResponse = await axios.post(
          'https://backend.shiphere.in/api/transactions/decreaseAmount',
          codWalletRequestBody,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
  
        if (codWalletResponse.status !== 200) {
          message.error("Failed to debit COD cost from wallet");
          return; 
        }
      }
  
      const forwardWalletRequestBody = {
        debit: forwardCostWithGst,
        userId: selectedOrder.seller._id,
        remark: `Forward charge for order ${selectedOrder.orderId}`,
        orderId: selectedOrder._id,
      };
      const forwardWalletResponse = await axios.post(
        'https://backend.shiphere.in/api/transactions/decreaseAmount',
        forwardWalletRequestBody,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
  
      if (forwardWalletResponse.status === 200) {
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
        
        if (orderResponse.status === 201) {
          message.success("Shipped successfully");
          fetchOrders();
          fetchBalance();
          setIsModalVisible(false);
          setSelectedOrderId(null);
          setSelectedPartner(null);
        } else {
          message.error("Failed to update order status");
        }
      } else {
        message.error("Failed to debit forward cost from wallet");
      }
    } catch (error) {
      // message.error("Insufficient Balance");
      message.error(error.message)
      console.error('Failed to update order status', error);
    } finally {
      setModalLoading(false);
    }
  };
  
  console.log(deliveryCosts);
  
  const newOrders = dataSource?.filter(order => order.status === 'New' || order.status === 'Cancelled');
  console.log(newOrders);
  
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
            scroll={{ x: 1400,y: 430 }}
            style={{ width: '100%', height: '545px' }}
            rowClassName={(record) => (record._id === selectedOrderId ? 'selected-row' : '')}
            loading={loading}
            className="centered-table"
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
              scroll={{ x: 800 }}
              style={{ overflowX: 'auto' }}
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
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '8px',
                border: '2px solid #ddd',
              }}
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
