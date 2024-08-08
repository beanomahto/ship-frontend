import React from 'react'
import { Table } from 'antd';
import { Helmet } from 'react-helmet';
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
         <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Wallet</title>
            </Helmet>
        <Table className='table'  scroll={{ y: 350, }} columns={newOrders} />
    </div>
  )
}

export default Wallet
