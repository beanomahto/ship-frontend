import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { usePaymentUserContext } from '../../../context/PaymentUserContext';
import moment from 'moment';
import {Link} from 'react-router-dom'

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const newOrders = [
    {
      title: 'Date & Time',
      dataIndex: 'd&t',
      render: (text, transaction) => moment(transaction?.updatedAt).format('DD-MM-YYYY'),
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
      dataIndex: 'remark',
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://backend.shiphere.in/api/transactions/getTransactions', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
console.log(transactions);

  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={''} />
        <title>Wallet</title>
      </Helmet>
      <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap:'1rem',
            marginBottom:'1rem',
          }} className="addorder" >
           <Button style={{borderRadius:'14px', fontSize:'1rem'}} ><Link to='/finance/history'>Recharge History</Link></Button>
           </div>
      <Table
        className='table'
        scroll={{ y: 500 }}
        columns={newOrders}
        dataSource={transactions}
        loading={loading}
        rowKey={(record) => record.trns_id} 
      />
    </div>
  );
};

export default Wallet;
