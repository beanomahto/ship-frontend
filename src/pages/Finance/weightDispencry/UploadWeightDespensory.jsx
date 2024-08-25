import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import axios from 'axios';
import DownloadLink from 'react-download-link';

const UploadWeightDespensory = ({ visible, onClose }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState('');
    const [extractedData, setExtractedData] = useState([]);
    const [sellerIds, setSellerIds] = useState('');

    const handleFileChange = async ({ file }) => {
        setFile(file);

        const reader = new FileReader();
        reader.onload = async () => {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (json.length > 1) {
                const keys = json[0];
                const values = json.slice(1);

                const combined = values.map((row) => {
                    return keys.reduce((obj, key, index) => {
                        obj[key] = row[index] || '';
                        return obj;
                    }, {});
                });

                setExtractedData(combined);
                setFileData(JSON.stringify(combined, null, 2));

                const sellerEmails = combined.map(item => item.sellerEmail).filter(email => email);

                const fetchedSellerIds = await fetchSellerIds(sellerEmails);
                setSellerIds(fetchedSellerIds);
            } else {
                setFileData('Invalid file format. Expected at least one header row and one data row.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const fetchSellerIds = async (sellerEmails) => {
        const token = localStorage.getItem('token');
        const sellerIds = [];

        for (const email of sellerEmails) {
            try {
                const response = await axios.get('https://backend.shiphere.in/api/users/search', {
                    params: { query: email },
                    headers: {
                        Authorization: `${token}`
                    }
                });

                if (response.data && response.data.length > 0) {
                    sellerIds.push(response.data[0]._id);
                } else {
                    console.warn(`No user found for email: ${email}`);
                }
            } catch (error) {
                console.error(`Error fetching user for email ${email}: ${error.message}`);
            }
        }

        return sellerIds.join(',');
    };


    const handleUpload = async () => {
        if (!file) {
            message.error('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://backend.shiphere.in/api/weightdiscrepancy/uploadweightdiscrepancy', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            const result = await response.json();

            if (response.ok) {
                message.success('File uploaded successfully!');
                await callDeduceWalletAmount();
                await callIncreaseWalletAmount();
                onClose();
            } else {
                message.error(`Failed to upload file: ${result.error}`);
            }
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };
    const callIncreaseWalletAmount = async () => {
        try {
            for (const row of extractedData) {
                const { sellerEmail, settledCharges, orderId } = row;

                if (sellerEmail && settledCharges && orderId) {
                    const userId = sellerIds;

                    if (userId) {
                        const walletRequestBody = {
                            credit: settledCharges,
                            userId: userId,
                            remark: `settledCharges ${settledCharges} is added on ${sellerEmail}`,
                        };

                        console.log('Request Body:', walletRequestBody);

                        const response = await fetch('https://backend.shiphere.in/api/transactions/increaseAmount', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: localStorage.getItem('token'),
                            },
                            body: JSON.stringify(walletRequestBody),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error(`Failed to credit wallet amount for ${sellerEmail}: ${errorData.error}`); // Logging error
                            message.error(`Failed to credit wallet amount for ${sellerEmail}: ${errorData.error}`);
                        } else {
                            console.log(`Success: Wallet amount credited for ${sellerEmail}`); // Success log
                            message.success(`Wallet amount credited for ${sellerEmail}`);
                        }
                    } else {
                        console.warn(`No _id found for seller email: ${sellerEmail}`);
                    }
                } else {
                    console.warn(`Skipping row due to missing data:`, row); // Log rows that are skipped
                }
            }
        } catch (error) {
            console.error(`Error during wallet crediting: ${error.message}`); // Catch block log
            message.error(`Error during wallet crediting: ${error.message}`);
        }
    };
    const callDeduceWalletAmount = async () => {
        try {
            for (const row of extractedData) {
                const { sellerEmail, weightCharges, orderId } = row;
    
                if (sellerEmail && weightCharges && orderId) {
                    const userId = sellerIds; 
    
                    if (userId) {
                        const walletRequestBody = {
                            debit: weightCharges,
                            userId: userId,
                            remark: `Weight charges ${weightCharges} are deducted from ${sellerEmail}`,
                            orderId: orderId,
                        };
    
                        console.log('Request Body:', walletRequestBody);
    
                        const walletResponse = await axios.post(
                            'https://backend.shiphere.in/api/transactions/decreaseAmount',
                            walletRequestBody,
                            {
                                headers: {
                                    Authorization: localStorage.getItem('token'),
                                },
                            }
                        );
                        
                        console.log('Full Wallet Response:', walletResponse);
                        
    
                        if (walletResponse.status === 200) {
                            console.log(`Success: Wallet amount deducted for ${sellerEmail}`);
                            message.success(`Wallet amount deducted for ${sellerEmail}`);
                        } else {
                            console.error(`Failed to deduct wallet amount for ${sellerEmail}: ${walletResponse.data?.error || 'Unknown error'}`);
                            message.error(`Failed to deduct wallet amount for ${sellerEmail}`);
                        }
                        
                    } else {
                        console.warn(`No userId found for seller email: ${sellerEmail}`);
                    }
                } else {
                    console.warn(`Skipping row due to missing data:`, row);
                }
            }
        } catch (error) {
            console.error(`Error during wallet deduction: ${error.message}`);
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
            {fileData && (
                <div style={{ marginTop: '16px' }}>
                    <h3>File Contents:</h3>
                    <textarea
                        readOnly
                        style={{ width: '100%', height: '200px' }}
                        value={fileData}
                    />
                </div>
            )}
            {sellerIds.length > 0 && ( // Show fetched seller _ids
                <div style={{ marginTop: '16px' }}>
                    <h3>Fetched Seller IDs:</h3>
                    {sellerIds}
                </div>
            )}
        </Modal>
    );
};

export default UploadWeightDespensory;
