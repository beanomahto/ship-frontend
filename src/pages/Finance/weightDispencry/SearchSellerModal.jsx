import React, { useState } from 'react';
import { Modal, Input, Table, Button } from 'antd';
import moment from 'moment';

const SearchSellerModal = ({ visible, onClose, weightDispensory }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
console.log(weightDispensory.data);
  const handleSearch = () => {
    const filtered = weightDispensory?.data?.filter(weight =>
      weight?.seller?.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Weight Applied Date',
      dataIndex: 'weightAppliedDate',
    },
    {
      title: 'Entered Weight',
      dataIndex: 'enteredWeight',
    },
    {
      title: 'Entered Dimension',
      dataIndex: 'enteredDimension',
    },
    {
      title: 'Order Id',
      dataIndex: 'orderId',
    },
    {
      title: 'AWB Number',
      dataIndex: 'awbNumber',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      title: 'Applied Weight',
      dataIndex: 'appliedWeight',
    },
    {
      title: 'Weight Charges',
      dataIndex: 'weightCharges',
    },
    {
      title: 'Settled Charges',
      dataIndex: 'settledCharges',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
  ];
console.log(filteredData);
  return (
    <Modal
      title="Search Seller Remittance"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width='70rem'
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
        scroll={{x:1000, y:190}}
        dataSource={filteredData}
        rowKey="id"
      />
    </Modal>
  );
};

export default SearchSellerModal;
