import React, { useState } from 'react';
import { Table, Button } from 'antd';
import UploadDiscrepancyImagesModal from './UploadDiscrepancyImagesModal';
import { useAuthContext } from '../../../context/AuthContext';
import moment from 'moment';
import { useEffect } from 'react';

const ActionRequired = ({ dataSource, rowSelection}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  console.log(dataSource);
  const { authUser } = useAuthContext();
  
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
    ...(authUser?.role === 'company' ? [{
        title: 'Action', 
        dataIndex: 'adminData',  
        render: (_, record) => (
            <Button
              type="primary"
              onClick={() => {
                setSelectedDiscrepancyId(record?._id); 
                setSelectedProductName(record?.productName)
                setModalVisible(true);
                console.log(record);
              }}
            >
              Take Action
            </Button>
          ),
      }] : []),
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
const actionRequired = dataSource?.filter(data => data.status === 'action required')

  return (
    <>
      <Table
        className='table'
        scroll={{ y: 500 }}
        dataSource={actionRequired}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
      />
      <UploadDiscrepancyImagesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        discrepancyId={selectedDiscrepancyId}
        productName={selectedProductName}
      />
    </>
  );
};

export default ActionRequired;
