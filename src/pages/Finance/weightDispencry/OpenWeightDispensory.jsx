import { Table, Button, Modal, Image } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';

const OpenWeightDispensory = ({ dataSource }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const { authUser } = useAuthContext();
  const showModal = (images) => {
    setCurrentImages(images);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Weight Applied Date',
      dataIndex: 'weightAppliedDate',
      render: (text, data) => moment(data?.createdAt).format('DD-MM-YYYY'),
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
    {
      title: 'Actions',
      render: (text, record) => (
        <Button type="link" onClick={() => showModal(record.images)}>
          View Images
        </Button>
      ),
    },
    ...(authUser?.role === 'admin' ? [{
      title: 'Sellers', 
      dataIndex: 'seller',  
      render: (_, record) => (
          <span
          >
            {record?.seller?.email}
          </span>
        ),
    }] : []),
  ];

  const openData = dataSource?.filter(data => data.status === 'open');
console.log(openData);

  return (
    <>
      <Table
        className='table'
        scroll={{ y: 350 }}
        dataSource={openData}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title="Product Images"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {currentImages?.map((image, index) => (
            <Image
              key={index}
              src={image} 
              alt={`Product Image ${index + 1}`}
              style={{ width: '100%', maxWidth: '200px' }}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default OpenWeightDispensory;
