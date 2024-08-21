import React, { useState, useEffect } from 'react';
import './kyc.css';
import { Checkbox, Select, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import useKYC from './useKYC';
import { useAuthContext } from '../../context/AuthContext';

const KYC = () => {
    const { authUser } = useAuthContext();
    const [kycData, setKycData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ifscCode: '',
        bankName: '',
        companyType: '',
        documentType: '',
        gstUrl: null,
        accountNumber: '',
        passbookUrl: null,
        gstin: '',
        pancard: '',
        pancardUrl: null,
        aadharNumber: ''
    });
    const { submitKYCForm, loading } = useKYC();
    const [showAadharInput, setShowAadharInput] = useState(false);  

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
                setFormData({
                    ...formData,
                    companyType: data.companyType || '',
                    name: data.name || '',
                    ifscCode: data.ifscCode || '',
                    bankName: data.bankName || '',
                    documentType: data.documentType || '',
                    gstUrl: data.gstUrl || null,
                    accountNumber: data.accountNumber || '',
                    passbookUrl: data.passbookUrl || null,
                    gstin: data.gstin || '',
                    pancard: data.pancard || '',
                    pancardUrl: data.pancardUrl || null,
                    aadharNumber: data.aadharNumber || '' 
                });
            } catch (error) {
                message.error('Failed to fetch KYC data');
            }
        };

        fetchKycData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleDocumentTypeChange = (value) => {
        setFormData({ ...formData, documentType: value });

        if (value === 'adharcard') {
            setShowAadharInput(true);
        } else {
            setShowAadharInput(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await submitKYCForm(formData);
            setKycData(data);
            setFormData({
                name: '',
                ifscCode: '',
                bankName: '',
                companyType: '',
                documentType: '',
                gstUrl: null,
                accountNumber: '',
                passbookUrl: null,
                gstin: '',
                pancard: '',
                pancardUrl: null,
                aadharNumber: ''
            });
        } catch (error) {
            message.error("Failed to save KYC information")
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
                                <Select.Option value="propertysip">Property Ship</Select.Option>
                                <Select.Option value="pvt_lmt">PVT LMT</Select.Option>
                                <Select.Option value="llp">LLP</Select.Option>
                            </Select>
                        </label>
                        <label>
                            <span>Document Type</span>
                            <Select
                                className='input ipt'
                                style={{padding:'0'}}
                                value={formData.documentType}
                                onChange={handleDocumentTypeChange} 
                            >
                                <Select.Option value="adharcard">Aadhar Card</Select.Option>
                                <Select.Option value="gst_certificate">GST Certificate</Select.Option>
                                <Select.Option value="msme">MSME</Select.Option>
                            </Select>
                        </label>
                        <div className='picc'>
                            <label>
                                <span>Upload</span>
                                <Upload
                                    customRequest={({ file, onSuccess, onError }) => {
                                        setTimeout(() => {
                                            try {
                                                setFormData({ ...formData, gstUrl: file });
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
                    {showAadharInput && (  
                            <label>
                                <span>Aadhar Number</span>
                                <input
                                    className="input"
                                    style={{padding:'0'}}
                                    type="text"
                                    name="aadharNumber"
                                    value={formData.aadharNumber}
                                    onChange={handleChange}
                                />
                            </label>
                        )}
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
                                name="name"
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
                                                setFormData({ ...formData, passbookUrl: file });
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
                            <span>IFSC Code</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Bank Name</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='flex1'>
                    <div className="flex">
                        <label>
                            <span>PanCard</span>
                            <input
                                className="input"
                                style={{padding:'0'}}
                                type="text"
                                name="pancard"
                                value={formData.pancard}
                                onChange={handleChange}
                            />
                        </label>
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
                        <div className='picc'>
                            <label>
                                <span>PanCard Image</span>
                                <Upload
                                    customRequest={({ file, onSuccess, onError }) => {
                                        setTimeout(() => {
                                            try {
                                                setFormData({ ...formData, pancardUrl: file });
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
                <div className="flex" style={{paddingTop:'10px'}} >
                <Checkbox>
                    I have read the <a href="">Terms and Condition</a> agreement
                </Checkbox>
                </div>
                <div className='btncont'>
               {
                authUser?.isVerified === 'true' ?      <Button htmlType="submit" className="btn" >Verified</Button> :      <Button htmlType="submit" className="btn" loading={loading}>Save</Button>
               }
                </div>
            </form>
        </div>
    );
};

export default KYC;
