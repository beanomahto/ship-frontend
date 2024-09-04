import React, { useState, useMemo } from 'react';
import { Button, Table, Input } from 'antd';
import PaymentModel from './Payment/PaymentModel';
import { usePaymentUserContext } from '../../../context/PaymentUserContext';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { CSVLink } from 'react-csv';

const { Search } = Input;

const AdminWallet = () => {
  const { pUsers } = usePaymentUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Function to check if any field contains the search text
  const matchesSearchText = (record, searchText) => {
    const lowercasedText = searchText.toLowerCase();
    return (
      moment(record.updatedAt).format('DD-MM-YYYY').includes(lowercasedText) ||
      (record.user?.companyName?.toLowerCase().includes(lowercasedText) || 'N/A'.includes(lowercasedText)) ||
      (record.credit?.toString().toLowerCase().includes(lowercasedText)) ||
      (record.amount?.toString().toLowerCase().includes(lowercasedText)) ||
      (record.remark?.toLowerCase().includes(lowercasedText))
    );
  };

  // Filtered data based on the search text across all fields
  const filteredUsers = useMemo(() => {
    return pUsers.filter((user) => matchesSearchText(user, searchText));
  }, [pUsers, searchText]);

  // Function to convert data to CSV format
  const generateCsvData = () => {
    return filteredUsers.map(user => ({
      'Date & Time': moment(user.updatedAt).format('DD-MM-YYYY'),
      'Company Info': user.user?.companyName || 'N/A',
      'Payment': user.credit,
      'Total': user.amount,
      'Remark': user.remark,
    }));
  };

  const newOrders = [
    {
      title: 'Date & Time',
      dataIndex: 'updatedAt',
      render: (text, pUsers) => moment(pUsers?.updatedAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Company Info',
      dataIndex: 'user',
      render: (user) => user?.companyName || 'N/A',
    },
    {
      title: 'Payment',
      dataIndex: 'credit',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
    },
  ];

  const handleClearSearch = () => {
    setSearchText('');
  };

  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={""} />
        <title>Admin Wallet</title>
      </Helmet>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search
            placeholder="Search across all fields"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button onClick={handleClearSearch} style={{ marginLeft: '8px' }}>
            Clear
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            type="primary"
            onClick={showModal}
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
          >
            Payment
          </Button>
          <PaymentModel visible={modalVisible} onClose={closeModal} />
          {filteredUsers.length > 0 && (
            <CSVLink
              data={generateCsvData()}
              filename={"filtered_users.csv"}
              className="ant-btn ant-btn-primary"
              style={{ textDecoration: 'none' }} // Remove underline
            >
              <Button
                type="default"
                style={{ borderColor: '#d9d9d9', color: '#1890ff' }}
              >
                Download CSV
              </Button>
            </CSVLink>
          )}
        </div>
      </div>
      <Table
        className='table'
        scroll={{ y: 500 }}
        dataSource={filteredUsers}
        columns={newOrders}
      />
    </div>
  );
};

export default AdminWallet;
