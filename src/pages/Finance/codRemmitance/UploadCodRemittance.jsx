import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadCodRemittance = ({ visible, onClose }) => {
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
            const token = localStorage.getItem('token');
            const response = await fetch('https://backend-9u5u.onrender.com/api/remittance/uploadremittance', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `${token}`,
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
    return (
        <Modal
            title="Upload Cod Remittance"
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

export default UploadCodRemittance;
