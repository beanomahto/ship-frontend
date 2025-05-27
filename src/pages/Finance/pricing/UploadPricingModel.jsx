import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import DownloadLink from "react-download-link";

const UploadPricingModel = ({ visible, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = ({ file }) => {
    // Validate the file type (only allow CSV)
    if (file.type !== "text/csv") {
      message.error("Please upload a CSV file.");
      return;
    }
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please upload a file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pricingFile", file);

    try {
      const response = await fetch(
        "https://backend.shiphere.in/api/shipping/upload-custom-pricing",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("token"),
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
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    // Sample CSV headers, could be expanded with sample data
    return "sellerEmail,deliveryPartner,weightCategory,zoneA_forward,zoneA_rto,zoneA_additional_forward,zoneA_additional_rto,zoneB_forward,zoneB_rto,zoneB_additional_forward,zoneB_additional_rto,zoneC_forward,zoneC_rto,zoneC_additional_forward,zoneC_additional_rto,zoneD_forward,zoneD_rto,zoneD_additional_forward,zoneD_additional_rto,zoneE_forward,zoneE_rto,zoneE_additional_forward,zoneE_additional_rto,codFixed,codPercentage";
  };

  return (
    <Modal
      title="Upload Pricing"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="download">
          <DownloadLink
            label="Download Pricing CSV"
            filename="sample.csv"
            exportFile={downloadFile}
            style={{ textDecoration: "none" }}
          />
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleUpload}
          loading={loading} // Add loading state to the button
        >
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

export default UploadPricingModel;
