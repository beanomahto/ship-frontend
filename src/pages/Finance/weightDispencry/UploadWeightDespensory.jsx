import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import DownloadLink from 'react-download-link';

const UploadWeightDespensory = ({ visible, onClose }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState('');
    const [extractedData, setExtractedData] = useState([]); // New state to store extracted data

    const handleFileChange = ({ file }) => {
        setFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (json.length > 1) {
                const keys = json[0]; // First row as header (keys)
                const values = json.slice(1); // Remaining rows as values

                const combined = values.map((row) => {
                    return keys.reduce((obj, key, index) => {
                        obj[key] = row[index] || ''; // Safeguard against missing data
                        return obj;
                    }, {});
                });

                setExtractedData(combined); // Store extracted data
                setFileData(JSON.stringify(combined, null, 2)); // Convert combined data to JSON for display
            } else {
                setFileData('Invalid file format. Expected at least one header row and one data row.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/weightdiscrepancy/uploadweightdiscrepancy', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            const result = await response.json();

            if (response.ok) {
                message.success('File uploaded successfully!');
                await callDeduceWalletAmount(); // Call the deduceWalletAmount API
                onClose();
            } else {
                message.error(`Failed to upload file: ${result.error}`);
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };

    const callDeduceWalletAmount = async () => {
        try {
            for (const row of extractedData) {
                const { sellerEmail, weightCharges, orderId } = row;
    
                if (sellerEmail && weightCharges && orderId) {
                    const walletRequestBody = {
                        debit: weightCharges,
                        userId: sellerEmail,
                        remark: `kat gye`,
                        orderId: orderId,
                    };
                    
                    console.log('Request Body:', walletRequestBody); // Debugging log
                    
                    const response = await fetch('https://backend.shiphere.in/api/transactions/decreaseAmount', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: localStorage.getItem('token'),
                        },
                        body: JSON.stringify(walletRequestBody),
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Failed to deduce wallet amount for ${sellerEmail}: ${errorData.error}`); // Logging error
                        message.error(`Failed to deduce wallet amount for ${sellerEmail}: ${errorData.error}`);
                    } else {
                        console.log(`Success: Wallet amount deduced for ${sellerEmail}`); // Success log
                        message.success(`Wallet amount deduced for ${sellerEmail}`);
                    }
                } else {
                    console.warn(`Skipping row due to missing data:`, row); // Log rows that are skipped
                }
            }
        } catch (error) {
            console.error(`Error during wallet deduction: ${error.message}`); // Catch block log
            message.error(`Error during wallet deduction: ${error.message}`);
        }
    };
    

    const downloadFile = () => {
        const header = `"sellerEmail","weightAppliedDate","enteredWeight","enteredDimension","orderId","awbNumber","productName","appliedWeight","weightCharges","settledCharges","remarks"`;
        const row1 = `"seller@email.com","2023_01_01","10.5","10x10x10","ORD123","AWB123","Product1","10","100","95","None"`;
        return `${header}\n${row1}`;
    };

    return (
        <Modal
            title="Upload"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="download">
                    <DownloadLink 
                        label='Download Weight Dispensory CSV'
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
            <Upload beforeUpload={() => false} onChange={handleFileChange} accept=".xlsx">
                <Button icon={<UploadOutlined />}>Select Weight Dispensory</Button>
            </Upload>
            {/* {fileData && (
                <div style={{ marginTop: '16px' }}>
                    <h3>File Contents:</h3>
                    <textarea
                        readOnly
                        style={{ width: '100%', height: '200px' }}
                        value={fileData}
                    />
                </div>
            )} */}
        </Modal>
    );
};

export default UploadWeightDespensory;
