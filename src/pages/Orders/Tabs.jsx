import React, { useState } from 'react';
import { Button, Popover, Table, Tabs, Modal, Upload, message  } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useOrderContext } from '../../context/OrderContext';
import BulkOrderUploadModal from './BulkOrder/BulkOrder';
import moment from 'moment';
import ShipNowModel from './ShipNow/ShipNowModel';

const { TabPane } = Tabs;

const Orders = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orders, setOrders } = useOrderContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleShipNow, setModalVisibleShipNow] = useState(false);
  //console.log(orders);

  const showModal = () => {
      setModalVisible(true);
  };

  const closeModal = () => {
      setModalVisible(false);
  };

  const showModalShipNow = () => {
      setModalVisibleShipNow(true);
  };

  const closeModalShipNow = () => {
      setModalVisibleShipNow(false);
  };

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
      // setOrders();
      // orders();
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const dataSourceWithKeys = orders?.orders?.map((order, index) => ({
    ...order,
    key: index.toString(),
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;
  const tabsData = [
    {
      key: 'tab1',
      tab: 'New Orders',
      columns: [
        { title: 'Order Id', dataIndex: 'orderId' },
        { title: 'Order Status', dataIndex: 'o_status' },
        {
          title: 'Customer Info',
          dataIndex: 'customerName',
        },
        {
          title: 'Payment Details',
          dataIndex: 'paymentMethod',
          render: (text, order) => (
            <>
              <div>&#8377; {order.productPrice}</div>
              <div style={{ color: '#fff', width: '4rem', fontWeight: '600', borderRadius: '5px', paddingLeft: '5px', backgroundColor: `${order.paymentMethod === 'COD' ? '#bce7b6' : 'rgb(194, 205, 245)'}` }}>{order.paymentMethod}</div>
            </>
          ),
        },
        {
          title: 'Package Details',
          render: (text, order) => (
            <>
              <div>pkg Wt. {order.weight}gm</div>
              <div>({order.length}x{order.breadth}x{order.height}cm)</div>
            </>
          ),
        },
        { title: 'Channel', dataIndex: 'productName' },
        { title: 'Order Date', dataIndex: 'createdAt',
          render: (text, order) => (
            moment(order?.createdAt).format('DD-MM-YYYY') 
          ),

         },
        { title: 'Quick Assign', dataIndex: 'q_assign',  render: (text, order) => (
          <div>{<ThunderboltOutlined style={{ cursor:'pointer', fontSize: '1.5rem', color: '#08c' }}/>}</div>
        ), },
      ],
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab2',
      tab: 'Ship Orders',
      columns: [
        { title: 'Order Id', dataIndex: 'orderId' },
        { title: 'Shipping Status', dataIndex: 's_status' },
        {
          title: 'Customer Info',
          dataIndex: 'customerName',
        },
        {
          title: 'Payment Details',
          dataIndex: 'paymentMethod',
          render: (text, order) => (
            <>
              <div>&#8377; {order.productPrice}</div>
              <div style={{ color: '#fff', width: '4rem', fontWeight: '500', borderRadius: '5px', paddingLeft: '5px', backgroundColor: `${order.paymentMethod === 'COD' ? '#bce7b6' : 'rgb(196, 176, 176)'}` }}>{order.paymentMethod}</div>
            </>
          ),
        },
        {
          title: 'Package Details',
          render: (text, order) => (
            <>
              <div>pkg Wt. {order.weight}gm</div>
              <div>({order.length}x{order.breadth}x{order.height}cm)</div>
            </>
          ),
        },
        { title: 'Channel', dataIndex: 'productName' },
        { title: 'Order Date', dataIndex: 'createdAt',
          render: (text, order) => (
            moment(order?.createdAt).format('DD-MM-YYYY') 
          ),

         },
        { title: 'Quick Assign', dataIndex: 'q_assign' },
      ],
      dataSource: [],
    },
    {
      key: 'tab3',
      tab: 'In Transit',
      columns: [
        { title: 'Order Details', dataIndex: 'orderDetails' },
        { title: 'Customer Details', dataIndex: 'customerDetails' },
        { title: 'Product Details', dataIndex: 'Product Detail' },
        { title: 'Package Details', dataIndex: 'Package Detail' },
      ],
      dataSource: [],
    },
    {
      key: 'tab4',
      tab: 'All Orders',
      columns: [
        { title: 'Order Id', dataIndex: 'orderId' },
        { title: 'Order Status', dataIndex: 'o_status' },
        {
          title: 'Customer Info',
          dataIndex: 'customerName',
        },
        {
          title: 'Value',
          dataIndex: 'paymentMethod',
          render: (text, order) => (
            <>
              <div>&#8377; {order.productPrice}</div>
              <div style={{ color: '#fff', width: '4rem', fontWeight: '500', borderRadius: '5px', paddingLeft: '5px', backgroundColor: `${order.paymentMethod === 'COD' ? '#bce7b6' : 'rgb(196, 176, 176)'}` }}>{order.paymentMethod}</div>
            </>
          ),
        },
        { title: 'Tracking Info', dataIndex: 'productName' },
        { title: 'Channel', dataIndex: 'productName' },
        { title: 'Dm & Wt', dataIndex: 'q_assign' },
        { title: 'Order Date', dataIndex: 'createdAt',
          render: (text, order) => (
            moment(order?.createdAt).format('DD-MM-YYYY') 
          ),

         },
        { title: 'Updated Date', dataIndex: 'createdAt' },
      ],
      dataSource: dataSourceWithKeys,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }} className="addorder">
      <Button  type="primary" style={{alignSelf:'flex-start'}} onClick={start} loading={loading}>Sync</Button>
       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }} >
        <Button onClick={showModalShipNow}>Ship Now</Button>
        <ShipNowModel visible={modalVisibleShipNow} onClose={closeModalShipNow} />

       <Button><Link to='singleorder'>Single Order</Link></Button>
        <Button onClick={showModal}>Bulk Orders</Button>
        <BulkOrderUploadModal visible={modalVisible} onClose={closeModal} />
       </div>
      </div>
      <Tabs defaultActiveKey='tab1' size='large' className='tabs'>
        {tabsData.map((tab) => (  
          <TabPane key={tab.key} tab={tab.tab}>
            <div style={{ zIndex: 2 }}>
              {tab.tab === 'Ship Orders' && <div style={{
                display:'flex',
                flexDirection:"row",
                margin:'1rem',
                justifyContent:'flex-end',
                marginTop:'-2rem',
                marginBottom:'-1rem',
                gap:'1rem'
              }}>
            <Button style={{borderColor:'black'}}>Shipping Label</Button>
            <Button style={{borderColor:'grey'}}>Invoice</Button>
            <Button style={{borderColor:'red'}}>Cancel Shipment</Button>
              </div>}
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table className='table' rowSelection={rowSelection} scroll={{ y: 350 }} columns={tab.columns} dataSource={tab.dataSource} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Orders;
