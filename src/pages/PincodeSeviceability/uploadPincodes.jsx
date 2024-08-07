import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomButton from '../../components/Button/Button'

const UploadPincodes = () => {
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError("");
      const response = await axios.post("/api/pincode/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success(response.data.message);
      setVisible(false); // Close the modal after a successful upload
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file.");
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <CustomButton type="primary" onClick={showModal}>
        <h1 style={{fontSize:'1rem'}} >Upload Pincode</h1>
      </CustomButton>
      <Modal
        title="Upload Pincodes"
        visible={visible}
        onOk={handleUpload}
        onCancel={handleCancel}
        okText="Upload"
      >
        <Upload beforeUpload={() => false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Modal>
    </div>
  );
};

export default UploadPincodes;
