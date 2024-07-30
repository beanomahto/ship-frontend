import React from 'react'
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';

const PinCodeServicecability = () => {
    const newOrders = [
        {
          title: 'Courier Name',
          dataIndex: 'c_name',
        },
        {
          title: 'Serviceability',
          dataIndex: 'serviceability',
        },
        {
          title: 'Serviceable Pincode',
          dataIndex: 's_pinCode',
        },
        {
          title: 'STATUS',
          dataIndex: 'stats',
        }
    ];
  return (
    <div>
        <Table className='table'  scroll={{ y: 350, }} columns={newOrders} />
    </div>
  )
}

export default PinCodeServicecability
