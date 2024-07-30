import React from 'react'
import { Button, Table, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { useWarehouseContext } from '../../context/WarehouseContext';

const ActiveWarehouses = () => {
  const {warehouse} = useWarehouseContext();
  console.log(warehouse.warehouses);
    const newOrders = [
        {
          title: 'Warehouse Name',
          dataIndex: 'address',
        },
        {
          title: 'Contact Details',
          dataIndex: 'con_det',
          render: (text, warehouse) => (
            <>
              <div>{warehouse.contactPerson}</div>
              <div>{warehouse.contactEmail}</div>
            </>
          ),
        },
        {
          title: 'Pin Code',
          dataIndex: 'pincode',
        },
        {
          title: 'STATUS',
          dataIndex: 'stats',
        },
        {
          title: 'Action',
          dataIndex: 'action',
        }
    ];
    
  const dataSourceWithKeys = warehouse?.warehouses?.map((warehouse, index) => ({
    ...warehouse,
    key: index.toString(),
  }));
  const columns= [
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
  ]
  return (
    <div>
         <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap:'1rem',
        marginBottom:'1rem'
      }} className="addorder" >
          <Button><Link to='addwarehouse' >Add Warehouse</Link></Button>
      </div>
        <Table className='table'  scroll={{ y: 350, }} columns={newOrders} dataSource={dataSourceWithKeys} />
    </div>
  )
}

export default ActiveWarehouses
