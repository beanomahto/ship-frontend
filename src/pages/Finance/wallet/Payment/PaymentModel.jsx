import { Button, Modal, Input, List, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';

const { Search } = Input;

const PaymentModel = ({ visible, onClose }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRemark, setPaymentRemark] = useState('');

  const handleSearch = async (value) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend-9u5u.onrender.com/api/users/search', {
        params: { query: value },
        headers: {
          Authorization: `${token}`
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (user) => {
    setHoveredUser(user);
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  const handlePay = async () => {
    if (!hoveredUser || !paymentAmount.trim() || !paymentRemark.trim()) {
      console.error("User, payment amount, or remark not selected");
      return;
    }

    try {
      const response = await axios.post(`https://backend-9u5u.onrender.com/api/transactions/increaseAmount`, {
        userId: hoveredUser._id,
        credit: parseFloat(paymentAmount),
        remark: paymentRemark.trim()
      });
      message.success("Payment Successful")
      console.log("Payment successful:", response.data);
    } catch (error) {
      message.error("Payment failed")
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>
      ]}
    >
      <Search
        placeholder="Search by email, name, company name"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        style={{ width: '25rem', marginBottom: '1rem' }}
      />
      <List
        // style={{display:'flex', flexDirection:'column', }}
        loading={loading}
        itemLayout="horizontal"
        dataSource={searchResults}
        renderItem={user => (
          <List.Item
            style={{ display: 'flex', flexDirection: 'row', }}
            key={user._id}
            onMouseEnter={() => handleMouseEnter(user)}
            onMouseLeave={handleMouseLeave}
          >
            <Tooltip title={`${user.firstName} ${user.lastName} - ${user.phoneNumber}, ${user.companyName}`} visible={hoveredUser === user}>
              <List.Item.Meta
                title={user.firstName}
                description={user.email}
              />
            </Tooltip>
            <div style={{ marginTop: '1rem', width: '12rem' }}>
              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <Input
                style={{ marginTop: '0.5rem' }}
                type="text"
                placeholder="Enter remark"
                value={paymentRemark}
                onChange={(e) => setPaymentRemark(e.target.value)}
              />
              <Button
                type="primary"
                style={{ marginLeft: '0.5rem' }}
                onClick={handlePay}
              >
                Pay
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default PaymentModel;
