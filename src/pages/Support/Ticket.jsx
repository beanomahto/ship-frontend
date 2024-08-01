import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, message, Table } from 'antd';
import './ticket.css';
import CustomButton from '../../components/Button/Button';

const { Option } = Select;

const Ticket = () => {
    const [ticket, setTicket] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [remedy, setRemedy] = useState('');
    const [status, setStatus] = useState('');

    const fetchComplaints = async () => {
        try {
            const res = await fetch('/api/complaint/complaints');
            const data = await res.json();
            setTicket(data.complaints || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const showModal = (complaint) => {
        setCurrentComplaint(complaint);
        setRemedy('');
        setStatus('');
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setRemedy('');
        setStatus('');
    };

    const handleOk = async () => {
        if (!remedy || !status) {
            message.error('Please provide remedy and select a status');
            return;
        }

        if (!currentComplaint) {
            message.error('No complaint selected');
            return;
        }

        try {
            const response = await fetch(`/api/complaint/remedy/${currentComplaint._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ remedy, status }),
            });

            if (response.ok) {
                message.success('Complaint updated successfully');
                fetchComplaints();
                setVisible(false);
                setRemedy('');
                setStatus('');
            } else {
                message.error('Failed to update complaint');
            }
        } catch (error) {
            message.error('An error occurred while updating the complaint');
        }
    };

    const columns = [
        {
            title: 'Ticket Id',
            dataIndex: 'ticketId',
        },
        {
            title: 'Seller',
            dataIndex: ['seller', 'email'],
            key: 'seller',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Remedy',
            dataIndex: 'remedy',
            key: 'remedy',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <CustomButton onClick={() => showModal(record)} type="primary">
                    Remedy
                </CustomButton>
            ),
        },
    ];

    return (
        <div className='complaint-list'>
            <Table columns={columns} dataSource={ticket} rowKey="_id" />

            {currentComplaint && (
                <Modal
                    title="Provide Remedy"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <div>
                        <label>
                            <span>Remedy</span>
                            <Input
                                value={remedy}
                                onChange={(e) => setRemedy(e.target.value)}
                            />
                        </label>
                        <label style={{ marginTop: '10px' }}>
                            <span>Status</span>
                            <Select
                                value={status}
                                onChange={(value) => setStatus(value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="Pending">Pending</Option>
                                <Option value="Resolved">Resolved</Option>
                                <Option value="In Progress">In Progress</Option>
                            </Select>
                        </label>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Ticket;
