import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, List, Modal, Tooltip } from "antd";
import axios from "axios";
import React, { useState } from "react";
import "./PaymentModal.css"; // Import the CSS file

const PaymentModal = ({
  visible,
  onClose,
 
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRemark, setPaymentRemark] = useState('');
  const handleSearch = async (value) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend.shiphere.in/api/users/search', {
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
      const response = await axios.post(
        'https://backend.shiphere.in/api/recharge/recharge',
        {
          userId: hoveredUser._id,
          credit: parseFloat(paymentAmount),
          remark: paymentRemark.trim()
        },
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
      );
      
      message.success("Payment Successful")
      //console.log("Payment successful:", response.data);
    } catch (error) {
      message.error("Payment failed")
      console.error("Error updating user:", error);
    }
  };
  return (
    <Modal open={visible} onCancel={onClose} className="payment-modal" footer={null}>
      <div className="search-container">
        <Input.Search
          className="search-input"
          style={{ padding: "0"}}
          placeholder="Search by email, name, company name"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
        />
      </div>

      <List
        className="user-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={searchResults}
        renderItem={(user) => (
          <List.Item
            className="user-list-item"
            key={user._id}
            onMouseEnter={() => handleMouseEnter(user)}
            onMouseLeave={handleMouseLeave}
          >
            <Tooltip
              title={`${user.firstName} ${user.lastName} - ${user.phoneNumber}, ${user.companyName}`}
              open={hoveredUser === user}
            >
              <List.Item.Meta style={{ width: "100%", padding: "10px 5px", borderRadius: "8px", marginBottom: "10px" }} title={user.firstName} description={user.email} />
            </Tooltip>

            <div className="payment-inputs">
              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter remark"
                value={paymentRemark}
                onChange={(e) => setPaymentRemark(e.target.value)}
              />
              <Button type="primary" onClick={handlePay}>
                Pay
              </Button>
            </div>
          </List.Item>
        )}
      />

      <div className="modal-footer">
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
