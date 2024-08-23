import React, { useEffect, useState } from 'react';
import { Button, Tabs, Modal, Popover, message } from 'antd';
import { Link } from 'react-router-dom';
import { useOrderContext } from '../../context/OrderContext';
import BulkOrderUploadModal from './BulkOrder/BulkOrder';
import BulkOrderDimension from './BulkOrder/BulkDimension';
import ShipNowModel from './ShipNow/ShipNowModel';
import NewOrderComponent from './NewOrderComponent';
import ShipOrderComponent from './ShipOrderComponent';
import * as XLSX from 'xlsx';
import { DownloadOutlined } from '@ant-design/icons';
import AllOrderComponent from './AllOrderComponent';
import axios from 'axios';
import useShipNowCost from '../../hooks/useShipNowCost';
import { useWarehouseContext } from '../../context/WarehouseContext';

const { TabPane } = Tabs;

const Orders = () => {
  const { shipNowCost } = useShipNowCost();
  const { warehouse } = useWarehouseContext();
  const [deliveryCosts, setDeliveryCosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orders, setOrders, fetchOrders } = useOrderContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBD, setModalVisibleBD] = useState(false);
  const [modalVisibleShipNow, setModalVisibleShipNow] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [currentTab, setCurrentTab] = useState('tab1');
  console.log(orders);
console.log(selectedOrderData);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showModalBD = () => setModalVisibleBD(true);
  const closeModalBD = () => setModalVisibleBD(false);
  const showModalShipNow = () => setModalVisibleShipNow(true);
  const closeModalShipNow = () => setModalVisibleShipNow(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentDeliveryCost, setCurrentDeliveryCost] = useState(null);
  const start = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend.shiphere.in/api/integration/syncButton', {
        headers: {
            Authorization: localStorage.getItem('token'),
        },
    });
      if (response.ok) {
        const result = await response.json();
        console.log('Sync successful', result);
      } else {
        console.error('Sync failed', response.statusText);
      }
    } catch (error) {
      console.error('Sync error', error);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };


  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = newSelectedRowKeys.map(key => 
      orders.orders.find(order => order._id === key)
    );
    setSelectedOrderData(selectedData);
  };

  const handleShipNow = async () => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    console.log(selectedRowKeys);
    const updatedOrders = await Promise.all(selectedRowKeys?.map(async (orderId) => {
      const order = orders?.orders[orderId];
      console.log(order);
      await fetch(`https://backend.shiphere.in/api/orders/updateOrderStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Shipped' }),
      });

      return { ...order, status: 'Shipped' };
    }));

    const newOrdersCopy = orders.orders.filter((_, index) => !selectedRowKeys.includes(index));
    setOrders({
      orders: newOrdersCopy.concat(updatedOrders),
    });

    setSelectedRowKeys([]);
    closeModalShipNow();
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(orders.orders);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'Orders.xlsx');
  };

  const dataSourceWithKeys = orders?.orders?.map((order) => ({
    ...order,
    key: order._id,
    order:order
    // key: index.toString(),
  })) || [];

  console.log(orders);

  // const dataSourceShipOrdersWithKeys = orders?.shipOrders?.map((order, index) => ({
  //   ...order,
  //   key: order._id,
  // })) || [];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // onSelect: showModalShipNow,
  };
console.log(rowSelection);

  const hasSelected = selectedRowKeys.length > 1;
  console.log(dataSourceWithKeys);
  const tabsData = [
    {
      key: 'tab1',
      tab: 'New Orders',
      Component: NewOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab2',
      tab: 'Ship Orders',
      Component: ShipOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab3',
      tab: 'In Transit',
      Component: NewOrderComponent,
      dataSource: [],
    },
    {
      key: 'tab4',
      tab: 'All Orders',
      Component: AllOrderComponent,
      dataSource: dataSourceWithKeys
    },
  ];

  console.log(tabsData);
  console.log(selectedRowKeys);
  
  const cancelShipment = async () => {
    console.log('Selected Row Keys:', selectedRowKeys);
    
    const token = localStorage.getItem('token');
    try {
      
      const response = await axios.put(`https://backend.shiphere.in/api/orders/updateOrderStatus/${selectedRowKeys}`, {
        status: 'Cancelled'
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
  
      if (response.status === 201) { 
        if (selectedOrderData.length > 0) {
          const walletRequestBody = {
            userId: selectedOrderData[0].seller._id,
            credit: selectedOrderData[0].shippingCost,
            remark: `Credit charges for order ${selectedOrderData[0].orderId}`,
          };
          console.log('Wallet Request Body:', walletRequestBody);
  
          const increaseAmountResponse = await axios.post(`https://backend.shiphere.in/api/transactions/increaseAmount`, walletRequestBody, {
            headers: {
              Authorization: `${token}`
            }
          });
          console.log('Increase Amount Response:', increaseAmountResponse);
  
          if (increaseAmountResponse.status === 200) {
            message.success('Order cancelled and amount updated successfully');
            fetchOrders();
            setSelectedRowKeys([]);
          } else {
            message.error('Failed to update amount');
          }
        } else {
          message.error('No order data available for wallet update');
        }
      } else {
        message.error('Failed to cancel order');
      }
      
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error.message);
      message.error('Failed to cancel order');
    }
  };
  
  useEffect(() => {
    const fetchDeliveryCost = async () => {
      if (selectedOrderId) {
        setModalLoading(true); 
        const costResponse = await shipNowCost(selectedOrderId, warehouse?.warehouses?.[0]?._id);
        if (costResponse.success) {
          setDeliveryCosts(costResponse.cost || []);
        } else {
          alert(costResponse.error || 'Failed to fetch delivery cost');
        }
        setModalLoading(false); 
      }
    };
    fetchDeliveryCost();
  }, [selectedOrderId, warehouse]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }} className="addorder">
       {currentTab === 'tab1' &&  <Button type="primary" style={{ alignSelf: 'flex-start', borderRadius:'34px',fontFamily:'Poppins', fontSize:'1rem', fontWeight:'500' }} onClick={start} loading={loading}>Sync</Button>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', fontSize:'2rem',fontFamily:'Poppins' }}>
          {currentTab === 'tab1' && <Button style={{borderRadius:'34px'}} disabled={!hasSelected} onClick={showModalShipNow}>Ship Now</Button>}

{
  <div>
  <div style={{ display: 'flex', justifyContent: 'space-between',flexDirection:'row', gap: '65rem' }}>
  <Button type="primary" shape="round" onClick={exportToExcel} icon={<DownloadOutlined />} size='middle'>
            Download
          </Button>
  {
      currentTab === 'tab2' &&   <div style={{display:'flex',justifyContent:'space-evenly', gap:'2rem'}} >
        <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'black', borderRadius:'50px' }}>
              <Link to={`/shipping/getlabel/${selectedRowKeys[0]}`}>Shipping Label</Link>
            </Button>
            <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'gray', borderRadius:'50px' }}>
              <Link to={`/shipping/getInvoice/${selectedRowKeys[0]}`}>Invoice</Link>
            </Button>
            <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'red', borderRadius:'50px' }} onClick={cancelShipment} >Cancel Shipment</Button>
        </div>
  }
        </div>
  </div>
}
          {(currentTab === 'tab1') && (
            <>
              <Button style={{
                backgroundColor: '#668fa0',
                color: 'white',
                border: '2px solid #a5ffe7',
                boxShadow: 'inherit',
                borderRadius: '35px',
                padding: '10px 20px',
                // fontSize: '16px',
                transition: 'background-color 0.3s',
                fontSize:'1rem', fontWeight:'500'
              }} >
                <Link to='singleorder'>Single Order</Link>
              </Button>
              <Popover
                trigger={'click'}
                placement="leftTop"
                title={
                  <div style={{
                    display: 'flex',
                    flexDirection: "column",
                    margin: '1rem',
                    gap: '1rem'
                  }}>
                    <Button style={{borderRadius:'35px', fontFamily:'Poppins'}} onClick={showModal}>Bulk Orders</Button>
                    <Button style={{borderRadius:'35px', fontFamily:'Poppins'}} onClick={showModalBD}>Bulk Dimensions</Button>
                  </div>
                }
              >
                <Button style={{borderRadius:'35px', fontFamily:'Poppins'}}>Bulk Actions</Button>
              </Popover>
            </>
          )}
       
          <BulkOrderUploadModal visible={modalVisible} onClose={closeModal} />
          <BulkOrderDimension visible={modalVisibleBD} onClose={closeModalBD} />
          <ShipNowModel hasSelected={hasSelected} selectedRowKeys={selectedRowKeys} visible={modalVisibleShipNow} onClose={closeModalShipNow} onShipNow={handleShipNow} />
        </div>
      </div>
      <Tabs defaultActiveKey='tab1' size='large' className='tabs' onChange={setCurrentTab}>
        {tabsData.map(tab => (
          <TabPane key={tab.key} tab={tab.tab}>
            {tab.Component ? (
              <tab.Component
                dataSource={tab.dataSource}
                // rowSelection={tab.key === 'tab1' ? rowSelection : null}
                rowSelection={rowSelection}
                fetchOrders={fetchOrders}
                loading={loading}
                setModalLoading={setModalLoading}
                modalLoading={modalLoading}
                deliveryCosts={deliveryCosts}
                setDeliveryCosts={setDeliveryCosts}
                setSelectedOrderId={setSelectedOrderId}
                selectedOrderId={selectedOrderId}
                setCurrentDeliveryCost={setCurrentDeliveryCost}
                currentDeliveryCost={currentDeliveryCost}
              />
            ) : (
              <span>No component for this tab</span>
            )}
            <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Orders;
