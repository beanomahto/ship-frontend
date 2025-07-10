import { PlusOutlined } from "@ant-design/icons";
import { Button, Image, Input, Modal, Select, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const { TextArea } = Input;
const VerifyKyc = () => {
  const { id } = useParams();

  const [kycData, setKycData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ifscCode: "",
    bankName: "",
    companyType: "",
    documentType: "",
    gstUrl: null,
    accountNumber: "",
    passbookNumber: "",
    passbookUrl: null,
    gstin: "",
    pancard: "",
    pancardUrl: null,
    aadharNumber: "",
  });

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`process.env.url/api/kyc/${id}`, {
          headers: { Authorization: `${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch KYC data");
        const data = await response.json();
        setKycData(data);
        setFormData({
          ...formData,
          ...data,
        });
      } catch (error) {
        message.error("Failed to fetch KYC data");
        console.error(error);
      }
    };

    fetchKycData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`process.env.url/api/kyc/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        message.success("KYC verified successfully");
      } else {
        message.error("Failed to verify KYC");
      }
    } catch (error) {
      message.error("An error occurred while verifying KYC");
    }
  };

  const handleUpdateKyc = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`process.env.url/api/kyc/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(formData);
        message.success("KYC updated successfully");
        setIsEditable(false);
      } else {
        console.log(formData);
        message.error("Failed to update KYC");
      }
    } catch (error) {
      console.log(formData);
      message.error("An error occurred while updating KYC");
      console.error(error);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [remark, setRemark] = useState("");

  const handleResetClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    console.log("Remark:", remark);
    try {
      const response = await fetch(`process.env.url/api/kyc/remove/${id}`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ remark }),
      });

      if (response.ok) {
        message.success("Remark added successfully");
      }
    } catch (error) {
      message.error("An error occurred while adding the remark");
      console.error(error);
    } finally {
      setIsModalVisible(false);
    }
  };
  console.log(isEditable);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="formCon">
      <form
        className="form"
        onSubmit={isEditable ? handleUpdateKyc : handleSubmit}
      >
        <p className="title">KYC</p>
        <div className="flex1">
          <div className="flex">
            <label className="ipt" style={{ padding: "0px" }}>
              <span>Company Type</span>
              <Select
                className="input ipt"
                value={formData.companyType}
                disabled={!isEditable}
                onChange={(value) =>
                  setFormData({ ...formData, companyType: value })
                }
              >
                <Select.Option value="individual">Individual</Select.Option>
                <Select.Option value="propertysip">
                  Proprietorship
                </Select.Option>
                <Select.Option value="pvt_lmt">PVT LTD</Select.Option>
                <Select.Option value="llp">LLP</Select.Option>
              </Select>
            </label>
            <label>
              <span>Document Type</span>
              <Select
                className="input ipt"
                value={formData.documentType}
                onChange={(value) =>
                  setFormData({ ...formData, documentType: value })
                }
                disabled={!isEditable}
              >
                <Select.Option value="msme">MSME</Select.Option>
                <Select.Option value="adharcard">Aadhar Card</Select.Option>
                <Select.Option value="gst_certificate">
                  GST Certificate
                </Select.Option>
              </Select>
            </label>
            <div
              className="picc"
              style={{ display: "flex", flexDirection: "col" }}
            >
              <label>
                <span>GST Document</span>
                {!formData?.gstUrl ? (
                  <Upload
                    customRequest={({ file, onSuccess, onError }) => {
                      setTimeout(() => {
                        try {
                          if (file instanceof File || file instanceof Blob) {
                            setFormData({ ...formData, gstUrl: file });
                            onSuccess(null, file);
                          } else {
                            throw new Error("Invalid file format");
                          }
                        } catch (error) {
                          onError(error);
                        }
                      }, 0);
                    }}
                    listType="picture-card"
                    accept=".png,.jpg,.jpeg,.pdf,.csv"
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                ) : (
                  <div>
                    {formData?.gstUrl instanceof File &&
                    formData?.gstUrl?.type?.startsWith("image/") ? (
                      // Image preview if it's an image
                      <Image
                        src={URL.createObjectURL(formData.gstUrl)}
                        alt="GST Certificate"
                        style={{ width: "100%", maxWidth: "200px" }}
                      />
                    ) : (
                      // Download link if it's a non-image (e.g., PDF, CSV)
                      <a
                        href={
                          formData?.gstUrl instanceof File
                            ? URL.createObjectURL(formData.gstUrl) // For file-based URL
                            : formData?.gstUrl
                        } // In case the url is directly available
                        download={formData.gstUrl?.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        View {formData.gstUrl?.name || "File"}
                      </a>
                    )}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="flex1">
          <div className="flex">
            <label>
              <span>Name of seller</span>
              <input
                className="input"
                type="text"
                name="name"
                value={formData.name}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Account No.</span>
              <input
                className="input"
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
            <div className="picc">
              <label>
                <span>Passbook</span>
                {!formData?.passbookUrl ? (
                  <Upload
                    customRequest={({ file, onSuccess, onError }) => {
                      setTimeout(() => {
                        try {
                          if (file instanceof File || file instanceof Blob) {
                            setFormData({ ...formData, passbookUrl: file });
                            onSuccess(null, file);
                          } else {
                            throw new Error("Invalid file format");
                          }
                        } catch (error) {
                          onError(error);
                        }
                      }, 0);
                    }}
                    listType="picture-card"
                    accept=".png,.jpg,.jpeg,.pdf,.csv"
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                ) : (
                  <div>
                    {formData?.passbookUrl instanceof File &&
                    formData?.passbookUrl?.type?.startsWith("image/") ? (
                      // Image preview if it's an image
                      <Image
                        src={URL.createObjectURL(formData.passbookUrl)}
                        alt="GST Certificate"
                        style={{ width: "100%", maxWidth: "200px" }}
                      />
                    ) : (
                      // Download link if it's a non-image (e.g., PDF, CSV)
                      <a
                        href={
                          formData?.passbookUrl instanceof File
                            ? URL.createObjectURL(formData.passbookUrl) // For file-based URL
                            : formData?.passbookUrl
                        } // In case the url is directly available
                        download={formData.passbookUrl?.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        View {formData.passbookUrl?.name || "File"}
                      </a>
                    )}
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="flex">
            <label>
              <span>IFSC Code</span>
              <input
                className="input"
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Bank</span>
              <input
                className="input"
                type="text"
                name="bankName"
                value={formData.bankName}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="flex1">
          <div className="flex">
            <label>
              <span>GSTIN</span>
              <input
                className="input"
                type="text"
                name="gstin"
                value={formData.gstin}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>PAN Card Number</span>
              <input
                className="input"
                type="text"
                name="pancard"
                value={formData.pancard}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
            <div className="picc">
              <label>
                <span>PAN Card</span>
                {!formData?.pancardUrl ? (
                  <Upload
                    customRequest={({ file, onSuccess, onError }) => {
                      setTimeout(() => {
                        try {
                          if (file instanceof File || file instanceof Blob) {
                            setFormData({ ...formData, pancardUrl: file });
                            onSuccess(null, file);
                          } else {
                            throw new Error("Invalid file format");
                          }
                        } catch (error) {
                          onError(error);
                        }
                      }, 0);
                    }}
                    listType="picture-card"
                    accept=".png,.jpg,.jpeg,.pdf,.csv"
                  >
                    <button
                      style={{ border: 0, background: "none" }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                  </Upload>
                ) : (
                  <div>
                    {formData?.pancardUrl instanceof File &&
                    formData?.pancardUrl?.type?.startsWith("image/") ? (
                      // Image preview if it's an image
                      <Image
                        src={URL.createObjectURL(formData.pancardUrl)}
                        alt="GST Certificate"
                        style={{ width: "100%", maxWidth: "200px" }}
                      />
                    ) : (
                      // Download link if it's a non-image (e.g., PDF, CSV)
                      <a
                        href={
                          formData?.pancardUrl instanceof File
                            ? URL.createObjectURL(formData.pancardUrl) // For file-based URL
                            : formData?.pancardUrl
                        } // In case the url is directly available
                        download={formData.pancardUrl?.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        View {formData.pancardUrl?.name || "File"}
                      </a>
                    )}
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="flex">
            <label>
              <span>Aadhar Number</span>
              <input
                className="input"
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                disabled={!isEditable}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <Button
            className="input-submit"
            type="primary"
            htmlType="submit"
            // onClick={handleSubmit}
            style={{
              background: "linear-gradient(135deg, #007bff, #035a86)",
              color: "white",
              width: "100px",
              padding: "20px",
              fontSize: "18px",
            }}
          >
            {isEditable ? "Save" : "Submit"}
          </Button>
          <Button
            htmlType="button"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #007bff, #035a86)",
              color: "white",
              padding: "20px",
              fontSize: "18px",
            }}
            onClick={() => setIsEditable(!isEditable)}
          >
            {isEditable ? "Cancel Edit" : "Edit"}
          </Button>
          <Button
            htmlType="button"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #007bff, #035a86)",
              color: "white",
              padding: "20px",
              width: "100px",
              fontSize: "18px",
            }}
            onClick={handleResetClick}
          >
            Reject
          </Button>
        </div>
      </form>
      <Modal
        title="Enter Remark"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Close"
      >
        <TextArea
          rows={6}
          placeholder="Enter your remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          style={{ fontSize: "17px" }}
        />
      </Modal>
    </div>
  );
};

export default VerifyKyc;
