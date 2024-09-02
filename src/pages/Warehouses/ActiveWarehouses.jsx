import React from 'react'
import { Button, Table, Tabs, Tag } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { useWarehouseContext } from '../../context/WarehouseContext';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '../../context/AuthContext';
const ActiveWarehouses = () => {
  const {warehouse,fetchWarehouse} = useWarehouseContext();
  const {authUser} = useAuthContext()
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
          render: (warehouse) => (
            <>
              <Tag color='green' >Active</Tag>
            </>
          ),
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: (text, warehouse) => (
            <>
              <NavLink to={`${warehouse?._id}`} >Edit</NavLink>
            </>
          ),
        },
        ...(authUser?.role === 'admin'
          ? [
              {
                title: 'Seller',
                dataIndex: 'seller',
                render: (text, warehouse) => (
                  <>
                    <div>{warehouse?.seller?.email}</div>
                  </>
                ),
              },
            ]
          : []),
    ];
    
  const dataSourceWithKeys = warehouse?.warehouses?.map((warehouse, index) => ({
    ...warehouse,
    key: index.toString(),
  }));
  return (
   <>
     <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Warehouses</title>
            </Helmet>
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap:'1rem',
      marginBottom:'1rem'
    }} className="addorder" >
        <Button><Link to='addwarehouse' >Add Warehouse</Link></Button>
    </div>
    <div style={{backgroundColor:'#fff', height:'40rem', borderRadius:'1rem'}}>
        <Table className='table' pagination={false} columns={newOrders} dataSource={dataSourceWithKeys} />
    </div>
   </>
  )
}

export default ActiveWarehouses
