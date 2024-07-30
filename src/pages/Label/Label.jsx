import React, { useEffect, useState } from 'react';
import { message, Select, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import useCreateLebel from '../../hooks/useCreateLabel';
import './label.css'

const Label = () => {
    const { createLebel } = useCreateLebel()
    const [inputs, setInputs] = useState({
// labelType:'',
logoUrl:'',
theme:null,
hideLogo:null,
hideCompanyName:null,
hideCompanyGSTIN:null,
hidePaymentType:null,
hidePrepaidAmount:null,
hideCustomerPhone:null,
hideInvoiceNumber:null,
hideInvoiceDate:null,
showProductDetail:null,
hideProductName:null,
hideReturnWarehouse:null,
hideWeight:null,
hideDimension:null,
    });
    const handleLabelSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLebel(inputs);
            message.success('Label updated successfully!');
        } catch (err) {
            message.error('Failed to update label.');
        }
    };
  return (
   <div className='ok'
    // style={{maxWidth:'80vw', marginLeft:'6rem', marginTop:'-5rem'}}
     >
     <div className='formCon'>
    <form className="form" onSubmit={handleLabelSubmit} >
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
                                    style={{
                                        border: 0,
                                        background: 'none',
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                    </div>
                                </button>
                            </Upload>
                {/* Upload */}
               
            </label>
            <div className="labelDiv"  >
                        <span>Hide Logo</span>
                        <Select placeholder=''
                            value={inputs.hideLogo}
                            onChange={(e) => setInputs({ ...inputs, hideLogo: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                            >

                        </Select>
                        </div>
            <div className="labelDiv" style={{
                    }}  >
                           <span>Select Theme</span>
                        <Select placeholder=''
                            value={inputs.theme}
                            onChange={(e) => setInputs({ ...inputs, theme: e })}
                            options={[
                                { value: 'Type 1', label: 'type1' },
                                { value: 'Type 2', label: 'type2' },
                            ]}
                        >

                        </Select>
                        </div>
        </div>
        <div className="flex">
        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Company Name</span>
                        <Select placeholder=''
                            value={inputs.hideCompanyName}
                            onChange={(e) => setInputs({ ...inputs, hideCompanyName: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Company GSTIN</span>
                        <Select placeholder=''
                            value={inputs.hideCompanyGSTIN}
                            onChange={(e) => setInputs({ ...inputs, hideCompanyGSTIN: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Payment Type</span>
                        <Select placeholder=''
                            value={inputs.hidePaymentType}
                            onChange={(e) => setInputs({ ...inputs, hidePaymentType: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Amount From <br /> Prepaid Orders</span>
                        <Select placeholder=''
                            value={inputs.hidePrepaidAmount}
                            onChange={(e) => setInputs({ ...inputs, hidePrepaidAmount: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
        </div>
        <div className="flex">
        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Customer Phone</span>
                        <Select placeholder=''
                            value={inputs.hideCustomerPhone}
                            onChange={(e) => setInputs({ ...inputs, hideCustomerPhone: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Invoice Number</span>
                        <Select placeholder=''
                            value={inputs.hideInvoiceNumber}
                            onChange={(e) => setInputs({ ...inputs, hideInvoiceNumber: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Invoice Date</span>
                        <Select placeholder=''
                            value={inputs.hideInvoiceDate}
                            onChange={(e) => setInputs({ ...inputs, hideInvoiceDate: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Show Product With Details</span>
                        <Select placeholder=''
                            value={inputs.showProductDetail}
                            onChange={(e) => setInputs({ ...inputs, showProductDetail: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
        </div>
        <div className="flex">
        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Product Name Orders</span>
                        <Select placeholder=''
                            value={inputs.hideProductName}
                            onChange={(e) => setInputs({ ...inputs, hideProductName: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Return Warehouse</span>
                        <Select placeholder=''
                            value={inputs.hideReturnWarehouse}
                            onChange={(e) => setInputs({ ...inputs, hideReturnWarehouse: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Weight</span>
                        <Select placeholder=''
                            value={inputs.hideWeight}
                            onChange={(e) => setInputs({ ...inputs, hideWeight: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
                        <div className="labelDiv" style={{
                    }}  >
                           <span>Hide Dimension</span>
                        <Select placeholder=''
                            value={inputs.hideDimension}
                            onChange={(e) => setInputs({ ...inputs, hideDimension: e })}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' },
                            ]}
                        >

                        </Select>
                        </div>
        </div>

        <button className="submit">Submit</button>
    </form>
</div>
   </div>
  )
}

export default Label