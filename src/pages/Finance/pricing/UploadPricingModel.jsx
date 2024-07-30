import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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
            const response = await fetch('/api/shipping/upload-custom-pricing', {
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
    return (
        <Modal
            title="Upload Pricing"
            visible={visible}
            onCancel={onClose}
            footer={[
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
