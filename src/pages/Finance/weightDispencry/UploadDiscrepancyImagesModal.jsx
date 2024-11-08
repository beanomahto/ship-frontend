import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadDiscrepancyImagesModal = ({ visible, onClose, discrepancyId, productName,fetchWeightDespensory }) => {
  const [fileList, setFileList] = useState([]);
  const token = localStorage.getItem('token');

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  console.log(fileList);
  const handleUpload = async () => {
    if (!productName) {
      message.error('No product name provided');
      return;
    }
  
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('image', file.originFileObj);
    });
    formData.append('productName', productName);
  
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
  
    try {
      const uploadResponse = await fetch(`http://localhost:5000/api/weightdiscrepancy/upload-images`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `${token}`,
        },
      });

      const uploadResult = await uploadResponse.json();
      console.log(uploadResponse.json());
      
      fetchWeightDespensory()
      message.success("images uploaded");
  
      console.log('Upload Result:', uploadResult);
  
      const updateResponse = await fetch(`http://localhost:5000/api/weightdiscrepancy/updateStatus/${discrepancyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ status: 'open' }),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update status');
      }
  
      const updateResult = await updateResponse.json();
      message.success('Status updated to Open');
  
      console.log('Update Result:', updateResult);
  
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