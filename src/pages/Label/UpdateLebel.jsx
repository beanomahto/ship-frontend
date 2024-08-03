import React, { useEffect, useState } from 'react';
import { message, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './label.css';
import useUpdateLabel from '../../hooks/useUpdateLabel';

const UpdateLabel = () => {
    const { updateLebel } = useUpdateLabel()
    const [inputs, setInputs] = useState({
        logoUrl: '',
        theme: '',
        hideLogo: false,
        hideCompanyName: false,
        hideCompanyGSTIN: false,
        hidePaymentType: false,
        hidePrepaidAmount: false,
        hideCustomerPhone: false,
        hideInvoiceNumber: false,
        hideInvoiceDate: false,
        showProductDetail: false,
        hideProductName: false,
        hideReturnWarehouse: false,
        hideWeight: false,
        hideDimension: false,
    });

    useEffect(() => {
        const fetchLabelInfo = async () => {
            try {
                const response = await axios.get('/api/shipping/getLabelInfo', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const fetchedData = response.data;
                setInputs({
                    logoUrl: fetchedData.logoUrl || '',
                    theme: fetchedData.theme || '',
                    hideLogo: fetchedData.hideLogo ?? false,
                    hideCompanyName: fetchedData.hideCompanyName ?? false,
                    hideCompanyGSTIN: fetchedData.hideCompanyGSTIN ?? false,
                    hidePaymentType: fetchedData.hidePaymentType ?? false,
                    hidePrepaidAmount: fetchedData.hidePrepaidAmount ?? false,
                    hideCustomerPhone: fetchedData.hideCustomerPhone ?? false,
                    hideInvoiceNumber: fetchedData.hideInvoiceNumber ?? false,
                    hideInvoiceDate: fetchedData.hideInvoiceDate ?? false,
                    showProductDetail: fetchedData.showProductDetail ?? false,
                    hideProductName: fetchedData.hideProductName ?? false,
                    hideReturnWarehouse: fetchedData.hideReturnWarehouse ?? false,
                    hideWeight: fetchedData.hideWeight ?? false,
                    hideDimension: fetchedData.hideDimension ?? false,
                });
            } catch (error) {
                message.error('Failed to fetch label info');
                console.error('Error fetching label info:', error);
            }
        };
        fetchLabelInfo();
    }, []);

    console.log(inputs);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateLebel(inputs);
        message.success("updated successfully")
    }

    return (
        <div className='ok'>
            <div className='formCon'>
                <form className="form" onSubmit={handleSubmit} >
                    <p className="title">Update Label</p>
                    <div className="flex">
                        <label>
                            <span>Label Type</span>
                            {/* <input className="labelDiv" type="text" placeholder="" required
                                value={inputs.labelType}
                                onChange={(e) => setInputs({ ...inputs, labelType: e.target.value })}
                            /> */}
                        </label>
                        <label>
                            <span>Choose Logo</span>
                            <Upload
                                action="/upload.do"
                                listType="picture-card"
                                customRequest={({ file, onSuccess }) => {
                                    setTimeout(() => {
                                        setInputs({ ...inputs, logoUrl: URL.createObjectURL(file) });
                                        onSuccess(null, file);
                                    }, 0);
                                }}
                            >
                                <button
                                    style={{ border: 0, background: 'none' }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}></div>
                                </button>
                            </Upload>
                        </label>
                        <div className="labelDiv">
                            <span>Hide Logo</span>
                            <Select
                                placeholder=''
                                value={inputs.hideLogo}
                                onChange={(value) => setInputs({ ...inputs, hideLogo: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Select Theme</span>
                            <Select
                                placeholder=''
                                value={inputs.theme}
                                onChange={(value) => setInputs({ ...inputs, theme: value })}
                                options={[
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'light', label: 'Light' },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="labelDiv">
                            <span>Hide Company Name</span>
                            <Select
                                placeholder=''
                                value={inputs.hideCompanyName}
                                onChange={(value) => setInputs({ ...inputs, hideCompanyName: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Company GSTIN</span>
                            <Select
                                placeholder=''
                                value={inputs.hideCompanyGSTIN}
                                onChange={(value) => setInputs({ ...inputs, hideCompanyGSTIN: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Payment Type</span>
                            <Select
                                placeholder=''
                                value={inputs.hidePaymentType}
                                onChange={(value) => setInputs({ ...inputs, hidePaymentType: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Amount From <br /> Prepaid Orders</span>
                            <Select
                                placeholder=''
                                value={inputs.hidePrepaidAmount}
                                onChange={(value) => setInputs({ ...inputs, hidePrepaidAmount: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="labelDiv">
                            <span>Hide Customer Phone</span>
                            <Select
                                placeholder=''
                                value={inputs.hideCustomerPhone}
                                onChange={(value) => setInputs({ ...inputs, hideCustomerPhone: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Invoice Number</span>
                            <Select
                                placeholder=''
                                value={inputs.hideInvoiceNumber}
                                onChange={(value) => setInputs({ ...inputs, hideInvoiceNumber: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Invoice Date</span>
                            <Select
                                placeholder=''
                                value={inputs.hideInvoiceDate}
                                onChange={(value) => setInputs({ ...inputs, hideInvoiceDate: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Show Product With Details</span>
                            <Select
                                placeholder=''
                                value={inputs.showProductDetail}
                                onChange={(value) => setInputs({ ...inputs, showProductDetail: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="labelDiv">
                            <span>Hide Product Name Orders</span>
                            <Select
                                placeholder=''
                                value={inputs.hideProductName}
                                onChange={(value) => setInputs({ ...inputs, hideProductName: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Return Warehouse</span>
                            <Select
                                placeholder=''
                                value={inputs.hideReturnWarehouse}
                                onChange={(value) => setInputs({ ...inputs, hideReturnWarehouse: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Weight</span>
                            <Select
                                placeholder=''
                                value={inputs.hideWeight}
                                onChange={(value) => setInputs({ ...inputs, hideWeight: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                        <div className="labelDiv">
                            <span>Hide Dimension</span>
                            <Select
                                placeholder=''
                                value={inputs.hideDimension}
                                onChange={(value) => setInputs({ ...inputs, hideDimension: value })}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { value: false, label: 'No' },
                                ]}
                            />
                        </div>
                    </div>
                    <button className="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateLabel;
