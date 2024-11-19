import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import DashboardTab from './NDRTabs/DashboardTab.jsx';
import ActionRequiredTab from './NDRTabs/ActionRequiredTab.jsx';
import ActionTakenTab from './NDRTabs/ActionTakenTab.jsx';
import DeliveredTab from './NDRTabs/DeliveredTab.jsx';
import RTOTab from './NDRTabs/RTOTab.jsx';
import { useOrderContext } from '../../context/OrderContext.jsx';
import axios from 'axios';

const { TabPane } = Tabs;

const NDR = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const { orders, fetchOrders } = useOrderContext();
  
  const dataSourceWithKeys = orders?.orders?.map((order) => ({
    ...order,
    key: order._id,
    order: order,
  })) || [];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = newSelectedRowKeys.map((key) =>
      orders.orders.find((order) => order._id === key)
    );
    setSelectedOrderData(selectedData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const tabsData = [
    { key: 'tab1', tab: 'Dashboard', Component: DashboardTab, dataSource: dataSourceWithKeys },
    { key: 'tab2', tab: 'Action Required', Component: ActionRequiredTab, dataSource: dataSourceWithKeys },
    { key: 'tab3', tab: 'Action Taken', Component: ActionTakenTab, dataSource: dataSourceWithKeys },
    { key: 'tab4', tab: 'Delivered', Component: ActionTakenTab, dataSource: dataSourceWithKeys },
    { key: 'tab5', tab: 'RTO', Component: ActionTakenTab, dataSource: dataSourceWithKeys },
    { key: 'tab6', tab: 'All Orders', Component: ActionRequiredTab, dataSource: dataSourceWithKeys },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://backend.shiphere.in/api/smartship/getcurrentstatus', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
  
        const jsonObj = await res.json();
        console.log(jsonObj);
  
        const data = jsonObj?.data?.shipmentDetails.filter((status) => status.status === '12' ||  status.status === '13' ||  status.status === '14' ||  status.status === '15' ||  status.status === '16' ||  status.status === '17');
  
        console.log(data.map((ok) => ok.status + "-----" + ok.client_order_reference_id));
  
        const mapStatusCodeToOrderStatus = (status) => {
          // console.log(status);
  
          if (status === '27') return 'InTransit';
          if (status === '10') return 'InTransit';
          if (status === '30') return 'InTransit';
          if (status === '4') return 'Shipped';
          if (status === '11') return 'Delivered';
          if (status === '340') return 'Cancelled';
          if (['12', '13', '14', '15', '16', '17'].includes(status)) return 'UnDelivered';
          return null;
        };
  
        const updatedOrders = data
          .map((order) => {
            console.log(order.status);
  
            const order_status = mapStatusCodeToOrderStatus(order.status);
            // console.log(order_status);
  
            if (order_status) {
              return { ...order, order_status, reason: order.reason };
            }
            return null;
          })
          .filter((order) => order !== null);
  
        if (updatedOrders?.length > 0) {
          await updateMultipleOrders(updatedOrders);
          console.log(updatedOrders);
        } else {
          console.log('No orders to update: all statusCodes were invalid.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const updateMultipleOrders = async (orders) => {
      // console.log(orders);
  
      try {
        const updatePromises = orders.map((order) => {
          // console.log(order);
          
          const updateBody = {
            status: order.order_status,
            reason: order.order_status === 'UnDelivered' ? order.status_description : null, // Include reason for UnDelivered
          };
          console.log(updateBody);
  
          return axios.put(
            `https://backend.shiphere.in/api/orders/updateOrderStatus/${order.orderId}`,
            updateBody,
            {
              headers: {
                Authorization: localStorage.getItem('token'),
              },
            }
          );
        });
  
        // Await the update promises if needed
        await Promise.all(updatePromises);
  
        // You can handle results or show messages if required
      } catch (error) {
        console.error('Error updating orders:', error);
        // message.error('Batch update failed.');
      }
    };
  
    fetchData();
    fetchOrders();
    const intervalId = setInterval(fetchData, 300000); // 5 minutes
  
    return () => clearInterval(intervalId);
  }, []);
  
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Tabs defaultActiveKey="tab1" size="large" className='tabs'>
        {tabsData.map((tab) => (
          <TabPane key={tab.key} tab={tab.tab}>
            {tab.Component ? (
              <tab.Component
                dataSource={tab.dataSource}
                rowSelection={rowSelection}
                selectedRowKeys={selectedRowKeys} 
                fetchOrders={fetchOrders}
                selectedOrderData={selectedOrderData}
              />
            ) : (
              <span>No component for this tab</span>
            )}
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default NDR;
