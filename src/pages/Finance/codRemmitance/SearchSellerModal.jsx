import React, { useState } from 'react';
import { Modal, Input, Table, Button } from 'antd';
import moment from 'moment';

const SearchSellerModal = ({ visible, onClose, remittanceData }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    const filtered = remittanceData?.remittances?.filter(remittance =>
      remittance?.seller?.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      render: (text, remittance) => moment(remittance?.remittances?.createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Ref ID',
      dataIndex: 'refId',
    },
    {
      title: 'Generated COD',
      dataIndex: 'generatedCOD',
    },
    {
      title: 'ECOD Charge',
      dataIndex: 'ecodCharge',
    },
    {
      title: 'Net COD Amt',
      dataIndex: 'netCODAmt',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
    },
    {
      title: 'Transaction Detail',
      dataIndex: 'transactionDetail',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      render: (text, data) => (
        <>
          <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem', marginRight:'3rem'}}>{data.count}</div>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];
//console.log(filteredData);
  return (
    <Modal
      title="Search Seller Remittance"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width='58rem'
    >
      <Input
        placeholder="Enter seller email"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button onClick={handleSearch} type="primary" style={{ marginTop: '10px' }}>
        Search
      </Button>
      <Table
        style={{ marginTop: '20px' }}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
      />
    </Modal>
  );
};

export default SearchSellerModal;
