import React, { useState, useEffect } from 'react';
import { Table, Button, notification } from 'antd';
import UploadDiscrepancyImagesModal from './UploadDiscrepancyImagesModal';
import { useAuthContext } from '../../../context/AuthContext';
import moment from 'moment';

const ActionRequired = ({ dataSource, rowSelection, fetchWeightDespensory }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const { authUser } = useAuthContext();
  const actionRequired = dataSource?.filter((data) => data.status === 'action required');
  useEffect(() => {
    const updateStatusToClosed = async () => {
      const entriesToUpdate = [];

      actionRequired.forEach(newEntry => {
        const duplicateEntry = actionRequired.find(
          entry => 
            entry.awbNumber === newEntry.awbNumber && 
            entry.orderId === newEntry.orderId &&
            entry._id !== newEntry._id && 
            entry.status !== 'closed'
        );

        if (duplicateEntry) {
          entriesToUpdate.push(duplicateEntry);
        }
      });

      if (entriesToUpdate.length === 0) return;

      try {
        await Promise.all(
          entriesToUpdate.map(async (entry) => {
            await fetch(`https://backend.shiphere.in/api/weightdiscrepancy/updateStatus/${entry._id}`, {
              method: 'PUT',
              headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 'closed' }),
            });
          })
        );

        // Notify success
        notification.success({
          message: 'Status Updated',
          description: 'The status of relevant entries has been updated to Closed.',
        });

      } catch (error) {
        console.error('Error updating status:', error);
        notification.error({
          message: 'Update Failed',
          description: 'There was an error updating the status.',
        });
      }
    };

    updateStatusToClosed();
  }, [dataSource]);

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
    ...(authUser?.role === 'company'
      ? [
          {
            title: 'Action',
            dataIndex: 'adminData',
            render: (_, record) => (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedDiscrepancyId(record?._id);
                  setSelectedProductName(record?.productName);
                  setModalVisible(true);
                }}
              >
                Take Action
              </Button>
            ),
          },
        ]
      : []),
    ...(authUser?.role === 'admin'
      ? [
          {
            title: 'Sellers',
            dataIndex: 'seller',
            render: (_, record) => <span>{record?.seller?.email}</span>,
          },
        ]
      : []),
  ];

  return (
    <>
      <Table
        className="table"
        scroll={{ y: 300 }}
        dataSource={actionRequired}
        columns={columns}
        rowKey="_id"
        rowSelection={rowSelection}
      />
      <UploadDiscrepancyImagesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        discrepancyId={selectedDiscrepancyId}
        productName={selectedProductName}
        fetchWeightDespensory={fetchWeightDespensory}
      />
    </>
  );
};

export default ActionRequired;
