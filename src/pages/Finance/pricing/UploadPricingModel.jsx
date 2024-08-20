import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DownloadLink from 'react-download-link' 

const UploadPricingModel = ({ visible, onClose }) => {
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
        formData.append('pricingFile', file);

        try {
            const response = await fetch('https://backend.shiphere.in/api/shipping/upload-custom-pricing', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            console.log(response)
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
        return "deliveryPartner,weightCategory,zoneA,zoneB,zoneC,zoneD,zoneE,codFixed,codPercentage"
    }
    return (
        <Modal
            title="Upload Pricing"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="download" >
                <DownloadLink 
                label='Download Pricing CSV'
                filename='sample.csv'
                exportFile={downloadFile}
                style={{textDecoration:'none'}}
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

export default UploadPricingModel;
