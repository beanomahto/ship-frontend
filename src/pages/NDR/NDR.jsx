import React, { useState } from 'react';
import { Tabs } from 'antd';
import DashboardTab from './NDRTabs/DashboardTab.jsx';
import ActionRequiredTab from './NDRTabs/ActionRequiredTab.jsx';
import ActionTakenTab from './NDRTabs/ActionTakenTab.jsx';
import DeliveredTab from './NDRTabs/DeliveredTab.jsx';
import RTOTab from './NDRTabs/RTOTab.jsx';
import { useOrderContext } from '../../context/OrderContext.jsx';

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
  ];

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
