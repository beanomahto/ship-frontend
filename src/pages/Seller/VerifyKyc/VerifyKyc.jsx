import React, { useState, useEffect } from 'react';
import { Button, Select, Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const VerifyKyc = () => {
    const { id } = useParams();

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
        pancardUrl: null,
        aadharNumber: ''
    });

    useEffect(() => {
        const fetchKycData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/kyc/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                
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
                    passbookNumber: data.passbookNumber || '',
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
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/updateVerify/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                message.success('KYC verified successfully');
            } else {
                message.error('Failed to verify KYC');
            }
        } catch (error) {
            message.error('An error occurred while verifying KYC');
        }
    };

    return (
        <div className='formCon'>
            <form className="form" onSubmit={handleSubmit}>
                <p className="title">KYC</p>
                <div className='flex1'>
                    <div className="flex">
                        <label className='ipt' style={{ padding: '0px' }}>
                            <span>Company Type</span>
                            <Select
                                className='input ipt'
                                value={formData.companyType}
                                onChange={(value) => setFormData({ ...formData, companyType: value })}
                            >
                                <Select.Option value="individual">Individual</Select.Option>
                                <Select.Option value="propertysip">Proprietorship</Select.Option>
                                <Select.Option value="pvt_lmt">PVT LMT</Select.Option>
                                <Select.Option value="llp">LLP</Select.Option>
                            </Select>
                        </label>
                        <label>
                            <span>Document Type</span>
                            <Select
                                className='input ipt'
                                value={formData.documentType}
                                onChange={(value) => setFormData({ ...formData, documentType: value })}
                            >
                                <Select.Option value="msme">MSME</Select.Option>
                                <Select.Option value="adharcard">Aadhar Card</Select.Option>
                                <Select.Option value="gst_certificate">GST Certificate</Select.Option>
                            </Select>
                        </label>
                        <div className='picc'>
                            <label>
                                <span>GST Document</span>
                                {formData.gstUrl ? (
                                    <Image src={formData.gstUrl} alt={formData.gstUrl} style={{ width: '100%', maxWidth: '200px'}} />
                                ) : (
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
                                )}
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
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                            />
                        </label>
                        <div className='picc'>
                            <label>
                                <span>Passbook</span>
                                {formData.passbookUrl ? (
                                    <Image src={formData.passbookUrl} alt="Passbook" style={{ width: '100%', maxWidth: '200px'}} />
                                ) : (
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
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="flex">
                        <label>
                            <span>IFSC Code</span>
                            <input
                                className="input"
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <span>Bank</span>
                            <input
                                className="input"
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
                            <span>GSTIN</span>
                            <input
                                className="input"
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
                                type="text"
                                name="pancard"
                                value={formData.pancard}
                                onChange={handleChange}
                            />
                        </label>
                        <div className='picc'>
                            <label>
                                <span>PAN Card</span>
                                {formData.pancardUrl ? (
                                    <Image src={formData.pancardUrl} alt="PAN Card" style={{ width: '100%', maxWidth: '200px'}}/>
                                    
                                ) : (
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
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="flex">
                        <label>
                            <span>Aadhar Number</span>
                            <input
                                className="input"
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                </div>
                <Button
                    className="input-submit"
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                    style={{marginTop:'30px'}}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default VerifyKyc;
