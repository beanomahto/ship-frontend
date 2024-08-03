import React, { useState } from 'react';
import './Support.css';
import { Select, message } from 'antd';

const subjects = {
    'Pickup & Delivery': [
        'Delay in Delivery',
        'Wrong Pickup Address',
        'Incorrect Delivery Address',
    ],
    'Shipment NDR & RTO': [
        'Shipment Not Delivered',
        'RTO Request',
        'NDR Issues',
    ],
    'Shipment Dispute': [
        'Damaged Goods',
        'Missing Items',
        'Wrong Item Delivered',
    ],
    'Finance': [
        'Billing Issues',
        'Payment Discrepancies',
        'Refund Request',
    ],
    'KYC & Bank Verification': [
        'KYC Documentation Issues',
        'Bank Verification Problems',
    ],
    'International Shipping': [
        'Customs Issues',
        'International Delivery Delays',
        'Shipping Cost Discrepancies',
    ],
    'Technical Support': [
        'Website Issues',
        'App Issues',
        'Technical Errors',
    ],
    'Billing & Taxation': [
        'Invoice Issues',
        'Tax Queries',
        'Billing Errors',
    ],
};

const Support = () => {
    const [awbNumbers, setAwbNumbers] = useState(['']);
    const [subject, setSubject] = useState('');
    const [relatedQuestions, setRelatedQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [description, setDescription] = useState('');

    const handleAwbChange = (index, value) => {
        const newAwbNumbers = [...awbNumbers];
        newAwbNumbers[index] = value;
        setAwbNumbers(newAwbNumbers);
    };

    const addAwbField = () => {
        setAwbNumbers([...awbNumbers, '']);
    };

    const handleSubjectChange = (value) => {
        setSubject(value);
        setRelatedQuestions(subjects[value] || []);
        setSelectedQuestion('');
    };

    const handleQuestionChange = (value) => {
        setSelectedQuestion(value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const awbString = awbNumbers.join(', ');

        const data = {
            subject,
            question: selectedQuestion,
            description,
            awb: awbString,
        };

        console.log(data);

        try {
            const response = await fetch('/api/complaint/registercomplaint', {
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
                setRelatedQuestions([]);
                setSelectedQuestion('');
                setDescription('');
            } else {
                message.error('Failed to register complaint');
            }
        } catch (error) {
            message.error('An error occurred while registering the complaint');
        }
    };

    return (
        <div className='formConsprt'>
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
                                    value={customSupport}
                                    onChange={handleCustomSupportChange}
                                />
                            </label>
                        </div>
                    )}
                </div>
                {subject !== 'other' && relatedQuestions.length > 0 && (
                    <div className='flex2sprt'>
                        <div className="flexsprt">
                            <label className='iptsprt'>
                                <span>Question</span>
                                <Select
                                    className='inputsprt iptsprt'
                                    value={selectedQuestion}
                                    onChange={handleQuestionChange}
                                >
                                    {relatedQuestions.map(question => (
                                        <Select.Option key={question} value={question}>
                                            {question}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </label>
                        </div>
                    </div>
                )}
                <div className='flex2sprt'>
                    <div className="flexsprt">
                        <label className='iptsprt'>
                            <span>AWB</span>
                            {awbNumbers.map((awb, index) => (
                                <input
                                    key={index}
                                    className="inputsprt"
                                    type="text"
                                    value={awb}
                                    onChange={(e) => handleAwbChange(index, e.target.value)}
                                />
                            ))}
                            <button type="button" onClick={addAwbField}>Add AWB</button>
                        </label>
                    </div>
                </div>
                <div className='flex2sprt'>
                    <div className="flexsprt">
                        <label>
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
    );
};

export default Support;
