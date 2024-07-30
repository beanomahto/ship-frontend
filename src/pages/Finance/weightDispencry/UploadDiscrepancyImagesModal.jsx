import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UploadDiscrepancyImagesModal = ({ visible, onClose, discrepancyId }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUpload = async () => {
    if (!discrepancyId) {
      message.error('No discrepancy ID provided');
      return;
    }
  
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files', file.originFileObj);
    });
  
    try {
      const uploadResponse = await fetch(`/api/weightdiscrepancy/upload-images/${discrepancyId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images');
      }
  
      const uploadResult = await uploadResponse.json();
      message.success(uploadResult.message);
  
      const updateResponse = await fetch(`/api/weightdiscrepancy/updateStatus/${discrepancyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Open' }),
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
      title="Upload Discrepancy Images"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" onClick={handleUpload} disabled={fileList.length === 0}>
          Upload
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

export default UploadDiscrepancyImagesModal;
