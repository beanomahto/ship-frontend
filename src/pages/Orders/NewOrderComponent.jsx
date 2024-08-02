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
import Shopify from '../../utils/shopify.png'

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

const NewOrderComponent = ({ dataSource, rowSelection, fetchOrders, loading }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryCosts, setDeliveryCosts] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { shipNowCost } = useShipNowCost();
  const { warehouse } = useWarehouseContext();

  useEffect(() => {
    const fetchDeliveryCost = async () => {
      if (selectedOrderId) {
        const costResponse = await shipNowCost(selectedOrderId, warehouse?.warehouses?.[0]?._id);
        if (costResponse.success) {
          setDeliveryCosts(costResponse.cost || []);
        } else {
          alert(costResponse.error || 'Failed to fetch delivery cost');
        }
      }
    };
    fetchDeliveryCost();
  }, [selectedOrderId, warehouse]);

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
      render: (text, order) => (
        <Link to={`/orders/updateorder/${order?._id}/${order?.orderId}`}>{order.orderId}</Link>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'o_status',
      render: (text, order) => (
        <Tag color={order.status === 'New' ? 'green' : 'volcano'} >
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
          <di style={{ fontFamily:'sans-serif', fontSize:'.9rem'}}>{order.customerName}</di>
          <di style={{ fontFamily:'sans-serif', fontSize:'.9rem'}}>{order.customerEmail}</di>
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
      dataIndex: 'channel',
      render: (text) => (
        <div>
          <img
            src={text === 'shopify' ? Shopify : ''}
            alt={text}
            style={{ width: '75px', height: '40px', borderRadius: '50%' }}
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
  ];

  const handleExpandRow = (key) => {
    setSelectedOrderId(key);
    setIsModalVisible(true);
  };

  const handleAssign = async (partner) => {
    try {
      const response = await axios.put(`/api/orders/updateOrderStatus/${selectedOrderId}`, {
        status: 'Shipped',
      });
      if (response.status === 201) {
        message.success("Shipped successfully");
        fetchOrders();
        setIsModalVisible(false);
        setSelectedOrderId(null);
        setSelectedPartner(null);
      }
    } catch (error) {
      message.error("Issue in shipping");
      console.error('Failed to update order status', error);
    }
  };

  const newOrders = dataSource?.filter(order => order.status === 'New' || order.status === 'Cancelled');

  return (
    <>
      {loading ? (
        <Skeleton active title={false} paragraph={{ rows: 10 }} style={{ height: '100%', width: '100%' }} />
      ) : (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newOrders}
            scroll={{ y: 450 }}
            style={{ width: '100%', height: '545px' }}
            rowClassName={(record) => (record._id === selectedOrderId ? 'selected-row' : '')}
          />
          <Modal
            title="Assign Delivery Partner"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={1000}
          >
            <Table
              dataSource={deliveryCosts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
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
                      style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px', border:'2px solid #ddd' }}
                    />
                   <p style={{fontWeight:'500', fontSize:'1rem'}}> {record.deliveryPartner}</p>
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
