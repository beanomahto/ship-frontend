import { UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload, message } from 'antd';
import React, { useState } from 'react';

const TakeActionModal = ({ visible, onClose, discrepancyId, productName }) => {
  const [fileList, setFileList] = useState([]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  //console.log(fileList);
  const handleAction = async () => {
    if (!productName) {
      message.error('Missing discrepancy ID or product name');
      return;
    }

    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('image', file.originFileObj);
    });
    formData.append('productName', productName);

    for (let pair of formData.entries()) {
      //console.log(pair[0] + ':', pair[1]);
    }
    try {
      const response = await fetch('http://localhost:5000/api/weightdiscrepancy/upload-images', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      //console.log(response);
      if (!response.ok) {
        throw new Error('Failed to take action');
      }

      const result = await response.json();
      message.success(result.message);
      const updateResponse = await fetch(`http://localhost:5000/api/weightdiscrepancy/updateStatus/${discrepancyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ status: 'open' }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update status');
      }

      const updateResult = await updateResponse.json();
      message.success('Status updated to Open');

      onClose();
    } catch (error) {
      console.error('Error:', error);
      message.error('Operation failed');
    }
  };

  return (
    <Modal
      title="Take Action"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleAction} disabled={fileList.length === 0}>
          Take Action
        </Button>,
      ]}
    >
      <Upload
        fileList={fileList}
        onChange={handleChange}
        multiple
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Select Files</Button>
      </Upload>
    </Modal>
  );
};

export default TakeActionModal;
