import { Select, message } from 'antd';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import sprt from '../../utils/sprtvid.mp4';
import './Support.css';

const subjects = {
    'Pickup & Delivery': [],
    'Shipment NDR & RTO': [],
    'Shipment Dispute': [],
    'Finance': [],
    'KYC & Bank Verification': [],
    'International Shipping': [],
    'Technical Support': [],
    'Billing & Taxation': [],
};

const Support = () => {
    const [awbNumbers, setAwbNumbers] = useState(['']);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleAwbChange = (index, value) => {
        if (value.includes(',')) {
            const newAwbNumbers = value.split(',').map(num => num.trim());
            setAwbNumbers(newAwbNumbers);
        } else {
            const newAwbNumbers = [...awbNumbers];
            newAwbNumbers[index] = value;
            setAwbNumbers(newAwbNumbers);
        }
    };

    const addAwbField = () => {
        setAwbNumbers([...awbNumbers, '']);
    };

    const deleteAwbField = (index) => {
        const newAwbNumbers = awbNumbers.filter((_, i) => i !== index);
        setAwbNumbers(newAwbNumbers);
    };

    const handleSubjectChange = (value) => {
        setSubject(value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const awbString = awbNumbers.join(', ');

        const data = {
            subject,
            description,
            awb: awbString,
        };

        //console.log(data);

        try {
            const response = await fetch('http://localhost:5000/api/complaint/registercomplaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                message.success('Complaint registered successfully');
                setAwbNumbers(['']);
                setSubject('');
                setDescription('');
            } else {
                message.error('Failed to register complaint');
            }
        } catch (error) {
            message.error('An error occurred while registering the complaint');
        }
    };

    return (
        <div className='support-container'>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Support</title>
            </Helmet>
            <div className='support-content'>
                <div className='form-container'>
                    <form className="formsprt" onSubmit={handleSubmit}>
                        <p className="titlesprt">Support</p>
                        <div className='flex2sprt'>
                            <div className="flexsprt">
                                <label className='iptsprt'>
                                    <span>Subject</span>
                                    <Select
                                        className='inputsprt iptsprt'
                                        value={subject}
                                        onChange={handleSubjectChange}
                                    >
                                        {Object.keys(subjects).map(subject => (
                                            <Select.Option key={subject} value={subject}>
                                                {subject}
                                            </Select.Option>
                                        ))}
                                        <Select.Option value="other">Other</Select.Option>
                                    </Select>
                                </label>
                            </div>
                            {subject === 'other' && (
                                <div className="flexsprt">
                                    <label className='iptsprt'>
                                        <span>Specify Support</span>
                                        <input
                                            className="inputsprt"
                                            type="text"
                                            value={subject}
                                            onChange={handleSubjectChange}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className='flex2sprt'>
                            <div className="flexsprt">
                                <label className='iptsprt'>
                                    <span>AWB</span>
                                    {awbNumbers.map((awb, index) => (
                                        <div key={index} className='awb-field'>
                                            <input
                                                className="inputsprt"
                                                type="text"
                                                value={awb}
                                                onChange={(e) => handleAwbChange(index, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="delete-awb-btn"
                                                onClick={() => deleteAwbField(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button className='awbBtn' type="button" onClick={addAwbField}>Add AWB</button>
                                </label>
                            </div>
                        </div>
                        <div className='flex2sprt'>
                            <div className="flexsprt">
                                <label className='iptsprt'>
                                    <span>Description</span>
                                    <input
                                        className="inputsprt"
                                        type="text"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <button className="submitsprt" type="submit">Submit</button>
                    </form>
                </div>
                <div className='image-container'>
                    <video src={sprt} autoPlay loop className='support-image' />
                </div>
            </div>
        </div>
    );
};

export default Support;
