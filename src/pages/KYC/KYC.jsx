import React, { useState, useEffect } from 'react';
import './kyc.css';
import { Checkbox, Select, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useKyc from '../../hooks/useKyc';
import { Helmet } from 'react-helmet';

const KYC = () => {
    const { kycIntegration } = useKyc();
    const [kycData, setKycData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ifscCode: '',
        bankName: '',
        companyType: '',
        documentType: '',
        gstUrl: null,
        accountNumber: '',
        passbookNumber: '',
        passbookUrl: null,
        gstin: '',
        pancard: '',
        pancardUrl: null
    });
    useEffect(() => {
        const fetchKycData = async () => {
            try {
                const response = await fetch('https://backend-9u5u.onrender.com/api/kyc', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                const data = await response.json();
                setKycData(data);
                console.log(data);
                setFormData({
                    ...formData,
                    companyType: data.companyType || '',
                    name: data.name || '',
                    ifscCode: data.ifscCode || '',
                    bankName: data.bankName || '',
                    documentType: data.documentType || '',
                    gstUrl: data.gstUrl || null,
                    accountNumber: data.accountNumber || '',
                    passbookNumber: data.passbookNumber || '',
                    passbookUrl: data.passbookUrl || null,
                    gstin: data.gstin || '',
                    pancard: data.pancard || '',
                    pancardUrl: data.pancardUrl || null
                });
            } catch (error) {
                message.error('Failed to fetch KYC data');
            }
        };

        fetchKycData();
    }, []);
    console.log(kycData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await kycIntegration(formData);
            message.success('KYC information saved successfully');
        } catch (error) {
            message.error('Failed to save KYC information');
        }
    };

    return (
        <div className='formCon'>
               <Helmet>
                <meta charSet='utf-8' />
                <title>Your KYC</title>
            </Helmet>
            <form className="form" onSubmit={handleSubmit}>
                <p className="title">KYC</p>
                <div className='flex1'>
                    <div className="flex">
                        <label className='ipt'>
                            <span>Company Type</span>
                            <Select
                                className='input ipt'
                                style={{padding:'0'}}
                                value={formData.companyType}
                                onChange={(value) => setFormData({ ...formData, companyType: value })}
                            >
                                <Select.Option value="individual">Individual</Select.Option>
                                <Select.Option value="msme">MSME</Select.Option>
                                <Select.Option value="adharcard">Aadhar Card</Select.Option>
                            </Select>
                        </label>
                        <label>
                            <span>Document Type</span>
                            <Select
                                className='input ipt'
                                style={{padding:'0'}}
                                value={formData.documentType}
                                onChange={(value) => setFormData({ ...formData, documentType: value })}
                            >
                                <Select.Option value="gst_certificate">GST Certificate</Select.Option>
                                <Select.Option value="propertysip">Property Ship</Select.Option>
                                <Select.Option value="pvt_lmt">PVT LMT</Select.Option>
                                <Select.Option value="llp">LLP</Select.Option>
                            </Select>
                        </label>
                        <div className='picc'>
                            <label>
                                <span>Upload GST</span>
                                <Upload
                                    customRequest={({ file, onSuccess, onError }) => {
                                        setTimeout(() => {
                                            try {
                                                setFormData({ ...formData, gstUrl: URL.createObjectURL(file) });
                                                onSuccess(null, file);
                                            } catch (error) {
                                                onError(error);
                                            }
                                        }, 0);
                                    }}
                                    listType="picture-card"
                                >
                                    <button
                                        style={{ border: 0, background: 'none' }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='flex1'>
                    <div className="flex">
                        <label>
                            <span>Name of seller</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="passbookNumber"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Account No.</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                            />
                        </label>

                        <div className='picc'>
                            <label>
                                <span>Passbook</span>
                                <Upload
                                    customRequest={({ file, onSuccess, onError }) => {
                                        setTimeout(() => {
                                            try {
                                                setFormData({ ...formData, passbookUrl: URL.createObjectURL(file) });
                                                onSuccess(null, file);
                                            } catch (error) {
                                                onError(error);
                                            }
                                        }, 0);
                                    }}
                                    listType="picture-card"
                                >
                                    <button
                                        style={{ border: 0, background: 'none' }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </label>
                        </div>
                    </div>
                    <div className="flex">
                        <label>
                            <span>IFC Code</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="passbookNumber"
                                value={formData.ifscCode}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Bank </span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="passbookNumber"
                                value={formData.bankName}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='flex1'>
                    <div className="flex">
                        <label>
                            <span>GSTIN</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>PAN Card Number</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="pancard"
                                value={formData.pancard}
                                onChange={handleChange}
                            />
                        </label>
                        <div className='picc'>
                            <label>
                                <span>Upload PAN Card</span>
                                <Upload
                                    customRequest={({ file, onSuccess, onError }) => {
                                        setTimeout(() => {
                                            try {
                                                setFormData({ ...formData, pancardUrl: URL.createObjectURL(file) });
                                                onSuccess(null, file);
                                            } catch (error) {
                                                onError(error);
                                            }
                                        }, 0);
                                    }}
                                    listType="picture-card"
                                >
                                    <button
                                        style={{ border: 0, background: 'none' }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </label>
                        </div>
                    </div>
                </div>
                <Checkbox>
                    I have read the <a href="">Terms and Condition</a> agreement
                </Checkbox>
                <button className="submit" type="submit">Submit</button>
            </form>
        </div>
    );

};

export default KYC;
