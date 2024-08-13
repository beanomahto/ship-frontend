import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { Helmet } from 'react-helmet';
import axios from 'axios';
// import { usePaymentUserContext } from '../../../context/PaymentUserContext';
import moment from 'moment';
import { Link } from 'react-router-dom'

const WalletHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const newOrders = [
    {
      title: 'Payment ID',
      dataIndex: '_id',
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
    },
    {
      title: 'Transaction Detail',
      dataIndex: 'transaction_id',
    },
    {
      title: 'Transaction Status',
      dataIndex: 'status',
    },
    {
      title: 'Date & Time',
      dataIndex: 'd&t',
      render: (text, transaction) => moment(transaction?.updatedAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
    }
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://backend-9u5u.onrender.com/api/transactions/getTransactions', {
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
        <title>Wallet History</title>
      </Helmet>
      <Table
        className='table'
        scroll={{ y: 350 }}
        columns={newOrders}
        dataSource={transactions}
        loading={loading}
        rowKey={(record) => record.trns_id}
      />
    </div>
  );
};

export default WalletHistory;
