import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import DownloadLink from "react-download-link";

const UploadCodRemittance = ({ visible, onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = ({ file }) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "process.env.url/api/remittance/uploadremittance",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      //console.log(response)
      if (response.ok) {
        message.success("File uploaded successfully!");
        onClose();
      } else {
        const errorData = await response.json();
        message.error(`Failed to upload file: ${errorData.error}`);
      }
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };
  const downloadFile = () => {
    return "sellerEmail, generatedDate, refId, generatedCOD, ecodCharge, netCODAmt, amountPaid, transactionDetail, count, status";
  };
  return (
    <Modal
      title="Upload Cod Remittance"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download">
          <DownloadLink
            label="Download Sample CSV"
            filename="sample.csv"
            exportFile={downloadFile}
            style={{ textDecoration: "none" }}
          />
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpload}>
          Upload
        </Button>,
      ]}
    >
      <Upload beforeUpload={() => false} onChange={handleFileChange}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </Modal>
  );
};

export default UploadCodRemittance;
