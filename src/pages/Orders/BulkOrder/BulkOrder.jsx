import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import Sv from './orders.csv'
import DownloadLink from 'react-download-link'

const BulkOrderUploadModal = ({ visible, onClose }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = ({ file }) => {
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://backend.shiphere.in/api/orders/createBulkOrder', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                message.success('File uploaded successfully!');
                onClose();
            } else {
                const errorData = await response.json();
                message.error(`Failed to upload file: ${errorData.error}`);
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };
    const downloadFile = () => {
        return "customerName,customerEmail,orderId,customerPhone,productName,productPrice,address,landMark,pincode,city,state,quantity,sku,weight,length,breadth,height,paymentMethod"
    }
    return (
        <Modal
            title="Upload Bulk Orders"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="download" >
                    <DownloadLink
                        label='Download Sample CSV'
                        filename='sample.csv'
                        exportFile={downloadFile}
                        style={{ textDecoration: 'none' }}
                    />
                </Button>,
                <Button key="submit" type="primary" onClick={handleUpload}>
                    Upload
                </Button>,
            ]}
        >
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
        </Modal>
    );
};

export default BulkOrderUploadModal;
