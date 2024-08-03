import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DownloadLink from 'react-download-link' 

const UploadWeightDespensory = ({ visible, onClose }) => {
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
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }
        try {
            const response = await fetch('https://backend-9u5u.onrender.com/api/weightdiscrepancy/upload-images', {
                method: 'POST',
                body: formData,
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
        return "sellerEmail,discrepancyDetails,productDetails,appliedWeight,courierWeight,chargedWeight,excessWeightCharge,status,action"
    }
    return (
        <Modal
            title="Upload"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="download" >
                <DownloadLink 
                label='Download Weight Dispensory CSV'
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
                <Button icon={<UploadOutlined />}>Select Weight Disputensory</Button>
            </Upload>
        </Modal>
    );
};

export default UploadWeightDespensory;
