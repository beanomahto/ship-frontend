import React from 'react'
import { Table } from 'antd';
const Wallet = () => {

    const newOrders = [
        {
          title: 'Date & Time',
          dataIndex: 'd&t',
        },
        {
          title: 'Transaction ID',
          dataIndex: 'trns_id',
        },
        {
          title: 'Order Id',
          dataIndex: 'ordr_id',
        },
        {
          title: 'Tracking Id',
          dataIndex: 'trcking_id',
        },
        {
          title: 'Debit',
          dataIndex: 'debit',
        },
        {
          title: 'Credit',
          dataIndex: 'credit',
        },
        {
          title: 'Remarks',
          dataIndex: 'remaks',
        },
      ];
  return (
    <div>
        <Table className='table'  scroll={{ y: 350, }} columns={newOrders} />
    </div>
  )
}

export default Wallet
