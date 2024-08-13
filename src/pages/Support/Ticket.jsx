import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, message, Table } from 'antd';
import { Link } from 'react-router-dom';
// import './ticket.css';
import CustomButton from '../../components/Button/Button';
import { Helmet } from 'react-helmet';

const { Option } = Select;

const Ticket = () => {
    const [ticket, setTicket] = useState([]);
    const [visible, setVisible] = useState(false);  
    const [newModalVisible, setNewModalVisible] = useState(false);
    const [currentComplaint, setCurrentComplaint] = useState(null);
    const [remedy, setRemedy] = useState('');
    const [status, setStatus] = useState('');

    const fetchComplaints = async () => {
        try {
            const res = await fetch('https://backend-9u5u.onrender.com/api/complaint/complaints'
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
            const response = await fetch(`https://backend-9u5u.onrender.com/api/complaint/remedy/${currentComplaint._id}`, {
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
                <CustomButton onClick={() => showModal(record)} style={{color:'white'}} type="primary">
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
              <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Ticket</title>
            </Helmet>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginBottom: '1rem'
            }} className="addorder">
                <Button style={{borderRadius:'34px', backgroundColor:'#dfdfdf',color:'#494949',fontSize:'1rem',fontWeight:'600',border:'2px solid #494949'}} >
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
                            if (!visible) {
                                handleRowClick(record);
                            }
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
