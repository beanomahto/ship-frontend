import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, message, Table } from 'antd';
import { Link } from 'react-router-dom';
// import './ticket.css';
import CustomButton from '../../components/Button/Button';

const { Option } = Select;

const Ticket = () => {
    const [ticket, setTicket] = useState([]);
    const [visible, setVisible] = useState(false);  // For the "Provide Remedy" modal
    const [newModalVisible, setNewModalVisible] = useState(false);  // For the "Complaint Details" modal
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [remedy, setRemedy] = useState('');
    const [status, setStatus] = useState('');

    const fetchComplaints = async () => {
        try {
            const res = await fetch('/api/complaint/complaints'
                , {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
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
        setRemedy(complaint.remedy || '');
        setStatus(complaint.status || '');
        setVisible(true);  // Show "Provide Remedy" modal
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
                    Authorization: localStorage.getItem('token'),
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
            title: 'Ticket Number',
            dataIndex: 'ticketNumber',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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

    const handleRowClick = (record) => {
        setCurrentComplaint(record);
        setNewModalVisible(true);
    };

    const handleNewModalCancel = () => {
        setNewModalVisible(false);
    };

    return (
        <div className='complaint-list'>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginBottom: '1rem'
            }} className="addorder">
                <Button>
                    <Link to='/support'>Raise Ticket</Link>
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={ticket}
                rowKey="_id"
                size="middle"
                onRow={(record) => {
                    return {
                        onClick: () => {
                            handleRowClick(record);
                        },
                    };
                }}
            />

            <Modal
                title="Provide Remedy"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div>
                    {/* <label>
                        <span>Description</span>
                        <Input.TextArea
                            value={currentComplaint?.description}
                            readOnly
                        />
                    </label> */}
                    <label style={{ marginTop: '10px' }}>
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

            <Modal
                title="Complaint Details"
                visible={newModalVisible}
                onCancel={handleNewModalCancel}
                footer={null}
            >
                {currentComplaint && (
                    <Table
                        columns={[
                            { title: 'Field', dataIndex: 'field' },
                            { title: 'Value', dataIndex: 'value' },
                        ]}
                        dataSource={[
                            { field: 'Ticket Number', value: currentComplaint.ticketNumber },
                            { field: 'AWB', value: currentComplaint.awb },
                            { field: 'Seller', value: currentComplaint.seller.email },
                            { field: 'Subject', value: currentComplaint.subject },
                            { field: 'Description', value: currentComplaint.description },
                            { field: 'Status', value: currentComplaint.status },
                            { field: 'Remedy', value: currentComplaint.remedy },
                        ]}
                        pagination={false}
                        rowKey="field"
                    />
                )}
            </Modal>
        </div>
    );
};

export default Ticket;
