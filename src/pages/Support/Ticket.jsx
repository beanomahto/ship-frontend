import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, message } from 'antd';
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

    console.log(currentComplaint?._id);
    console.log(remedy);
    console.log(status);
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
console.log(await response.json());
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

    return (
        <div className='complaint-list'>
            {ticket.map((complaint) => (
                <div key={complaint._id} className="complaint-item">
                    <p><strong>Seller:</strong> {complaint.seller?.email}</p>
                    <p><strong>Subject:</strong> {complaint.subject}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                    <p><strong>Status:</strong> {complaint.status}</p>
                    <p><strong>Remedy:</strong> {complaint?.remedy}</p>
                    <CustomButton onClick={() => showModal(complaint)} type="primary">
                        Remedy
                    </CustomButton>
                </div>
            ))}

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
