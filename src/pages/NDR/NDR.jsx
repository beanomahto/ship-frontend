import React, { useState } from 'react';
import { Button, Popover, Table, Tabs, theme } from 'antd';
import {MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import LineChart from '../../components/Chart/LineChart';
// import Orders from './Orders';
// import './orders.css'


const columns = [
  {
    title: 'Order Details',
    dataIndex: 'orderDetails',
  },
  {
    title: 'Customer Details',
    dataIndex: 'customerDetails',
  },
  {
    title: 'Product Details',
    dataIndex: 'Product Detail',
  },
  {
    title: 'Package Details',
    dataIndex: 'Package Detail',
  },
];

const newOrders = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [];
for (let i = 0; i < 55; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
const NDR = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <Tabs defaultActiveKey='tab1' size='large' className='tabs'>
        <Tabs.TabPane tab='Dashboard' key='tab1' className='chart'>
         <div style={{
          width:'70%',
          height:'40%',
         }} className='chart'>
         <LineChart />
         </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab='Action Required' key='tab2'>
          <div style={{ marginBottom: 16, zIndex: 2 }}>
            {/* <Button type="primary" onClick={start} loading={loading}>Sync</Button> */}
            <div style={{
            width: 80,
            float:'inline-end'
          }} >
          <Popover placement="leftTop" title={
            <div style={{
              display:'flex',
              flexDirection:"column",
              margin:'1rem',
              gap:'1rem'
            }}>
            <Button>Re attempt</Button>
            <Button>RTO</Button>
            <Button>Reschedule</Button>
            </div>
          }>
          <Button type='primary'><MenuFoldOutlined /></Button>
        </Popover>
          </div>
            </div>
        
            <span style={{ marginLeft: 8, }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          <Table className='table' rowSelection={rowSelection} scroll={{ y: 350, }} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Action Taken' key='tab3'>
          <div style={{ marginBottom: 16, zIndex: 2 }}>
            {/* <Button type="primary" onClick={start} loading={loading}>Sync</Button> */}
            <span style={{ marginLeft: 8, }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table className='table' rowSelection={rowSelection} scroll={{ y: 350, }} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Delivered' key='tab4'>
          <div style={{ marginBottom: 16, zIndex: 2 }}>
            {/* <Button type="primary" onClick={start} loading={loading}>Sync</Button> */}
            <span style={{ marginLeft: 8, }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table className='table' rowSelection={rowSelection} scroll={{ y: 350, }} columns={columns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab='RTO' key='tab5'>
          <div style={{ marginBottom: 16, zIndex: 2 }}>
            {/* <Button type="primary" onClick={start} loading={loading}>Sync</Button> */}
            <span style={{ marginLeft: 8, }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table className='table' rowSelection={rowSelection} scroll={{ y: 350, }} columns={columns} />
        </Tabs.TabPane>
      </Tabs>
      {/* <Orders/> */}
    </>
  );
};
export default NDR;