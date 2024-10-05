import { Table } from 'antd';
import React from 'react'

const Invoices = () => {
    const TotalRs = <span>Total (&#8377;)</span>
    const newOrders = [
        {
          title: 'Invoice ID',
          dataIndex: 'invoice_id',
        },
        {
          title: 'Invoice Date',
          dataIndex: 'invoice_date',
        },
        {
          title: 'Due Date',
          dataIndex: 'due_date',
        },
        {
          title: TotalRs,
          dataIndex: 'total_rs',
        },
        {
          title: 'Status',
          dataIndex: 'status',
        },
        {
          title: 'Action',
          dataIndex: 'action',
        },
      ];
  return (
    <div>
        <Table className='table'  scroll={{ x:1000, y: 350, }} columns={newOrders} />
    </div>
  )
}

export default Invoices
