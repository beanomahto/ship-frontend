import React, { useState } from "react";
// import './ForgotPasswordModal.css';
import { Button, Input, Modal } from "antd";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      //console.log(email);
      alert("Password reset email sent! Check email");
      onClose();
    } catch (error) {
      alert("Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Forgot Password"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </Modal>
  );
};

export default ForgotPasswordModal;
