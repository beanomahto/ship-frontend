import React, { useState } from "react";
import { Modal, Button, Input, List, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./PaymentModal.css"; // Import the CSS file

const PaymentModal = ({
  visible,
  onClose,
  handleSearch,
  loading,
  searchResults,
  hoveredUser,
  handleMouseEnter,
  handleMouseLeave,
  paymentAmount,
  setPaymentAmount,
  paymentRemark,
  setPaymentRemark,
  handlePay
}) => {
  return (
    <Modal open={visible} onCancel={onClose} className="payment-modal" footer={null}>
      <div className="search-container">
        <Input.Search
          className="search-input"
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
              visible={hoveredUser === user}
            >
              <List.Item.Meta title={user.firstName} description={user.email} />
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
