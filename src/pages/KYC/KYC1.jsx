import React, { useState, useEffect } from "react";
import "./kyc.css";
import {
  Checkbox,
  Select,
  Upload,
  Modal,
  Button,
  Input,
  message,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import useKYC from "./useKYC";
import { useAuthContext } from "../../context/AuthContext";
const { TextArea } = Input;
const KYC = () => {
  const { authUser } = useAuthContext();
  const [kycData, setKycData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    ifscCode: "",
    bankName: "",
    companyType: "",
    documentType: "",
    gstUrl: null,
    accountNumber: "",
    passbookUrl: null,
    gstin: "",
    pancard: "",
    pancardUrl: null,
    aadharNumber: "",
  });
  const { submitKYCForm, loading } = useKYC();
  const [showAadharInput, setShowAadharInput] = useState(false);

  useEffect(() => {
    const fetchKycData = async () => {
      try {
        const response = await fetch("https://backend.shiphere.in/api/kyc", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setKycData(data);
        console.log(data);
        
        setFormData({
          ...formData,
          companyType: data.companyType || "",
          name: data.name || "",
          ifscCode: data.ifscCode || "",
          bankName: data.bankName || "",
          documentType: data.documentType || "",
          gstUrl: data.gstUrl || null,
          accountNumber: data.accountNumber || "",
          passbookUrl: data.passbookUrl || null,
          gstin: data.gstin || "",
          pancard: data.pancard || "",
          pancardUrl: data.pancardUrl || null,
          aadharNumber: data.aadharNumber || "",
        });
      } catch (error) {
        message.error("Failed to fetch KYC data");
      }
    };

    fetchKycData();
  }, []);
  //console.log(kycData);
  //console.log(authUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentTypeChange = (value) => {
    setFormData({ ...formData, documentType: value });

    if (value === "adharcard") {
      setShowAadharInput(true);
    } else {
      setShowAadharInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await submitKYCForm(formData);
      setKycData(data);
      // setFormData({
      //     name: '',
      //     ifscCode: '',
      //     bankName: '',
      //     companyType: '',
      //     documentType: '',
      //     gstUrl: null,
      //     accountNumber: '',
      //     passbookUrl: null,
      //     gstin: '',
      //     pancard: '',
      //     pancardUrl: null,
      //     aadharNumber: ''
      // });
      message.success("KYC form submitted successfully");
    } catch (error) {
      message.error("Failed to save KYC information");
    }
  };
  const isDisabled = kycData && !kycData.error;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [remark, setRemark] = useState("");

  // Function to handle the click on the Reset button
  const handleResetClick = () => {
    setIsModalVisible(true); // Show the modal
  };

  // Function to handle the modal's OK button
  const handleOk = () => {
    console.log("Remark:", remark); // You can process the remark here
    setIsModalVisible(false); // Close the modal
  };

  // Function to handle the modal's Cancel button
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };
  return (
    <div className="formCon">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Your KYC</title>
      </Helmet>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">KYC</p>
        <div className="flex1">
          <div className="flex">
            <label className="ipt">
              <span>Company Type</span>
              <Select
                className="input ipt"
                style={{ padding: "0" }}
                value={formData.companyType}
                onChange={(value) =>
                  setFormData({ ...formData, companyType: value })
                }
                disabled={isDisabled}
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
                style={{ padding: "0" }}
                value={formData.documentType}
                onChange={handleDocumentTypeChange}
                disabled={isDisabled}
              >
                <Select.Option value="adharcard">Aadhar Card</Select.Option>
                <Select.Option value="gst_certificate">
                  GST Certificate
                </Select.Option>
                <Select.Option value="msme">MSME</Select.Option>
              </Select>
            </label>
            <div className="picc">
            <label>
    <span>Upload</span>
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
            accept=".png,.jpg,.jpeg,.pdf,.csv" // Acceptable file types
            disabled={isDisabled}
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
            {formData?.gstUrl instanceof File && formData?.gstUrl?.type?.startsWith("image/") ? (
                // Image preview if it's an image
                <Image
                    src={URL.createObjectURL(formData.gstUrl)}
                    alt="GST Certificate"
                    style={{ width: "100%", maxWidth: "200px" }}
                />
            ) : (
                // Download link if it's a non-image (e.g., PDF, CSV)
                <a
                    href={formData?.gstUrl instanceof File 
                        ? URL.createObjectURL(formData.gstUrl)  // For file-based URL
                        : formData?.gstUrl}  // In case the url is directly available
                    download={formData.gstUrl?.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    Download {formData.gstUrl?.name || "File"}
                </a>
            )}
        </div>
    )}
</label>

            </div>
          </div>
          <div className="flex">
            {showAadharInput && (
              <label>
                <span>Aadhar Number</span>
                <input
                  className="input"
                  style={{ padding: "0" }}
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  disabled={isDisabled}
                />
              </label>
            )}
          </div>
        </div>
        <div className="flex1">
          <div className="flex">
            <label>
              <span>Name of seller</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>
            <label>
              <span>Account No.</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>

            <div className="picc">
            <label>
    <span>Passbook</span>
    {formData.passbookUrl ? (
        <div>
            {formData.passbookUrl instanceof File && formData.passbookUrl.type?.startsWith("image/") ? (
                <Image
                    src={URL.createObjectURL(formData.passbookUrl)}
                    alt="Passbook Preview"
                    style={{ width: "100%", maxWidth: "200px" }}
                />
            ) : (
                <a
                    href={formData.passbookUrl instanceof File 
                        ? URL.createObjectURL(formData.passbookUrl) 
                        : formData.passbookUrl}  // For URL-based files
                    download={formData.passbookUrl?.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    {formData.passbookUrl?.name || "File"}
                </a>
            )}
        </div>
    ) : (
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
            disabled={isDisabled}
        >
            <button
                style={{ border: 0, background: "none" }}
                type="button"
            >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </button>
        </Upload>
    )}
</label>



            </div>
          </div>
          <div className="flex">
            <label>
              <span>IFSC Code</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>
            <label>
              <span>Bank Name</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>
          </div>
        </div>
        <div className="flex1">
          <div className="flex">
            <label>
              <span>PanCard</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="pancard"
                value={formData.pancard}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>
            <label>
              <span>GSTIN</span>
              <input
                className="input"
                style={{ padding: "0" }}
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </label>
            <div className="picc">
            <label>
    <span>PanCard Image</span>
    {formData.pancardUrl ? (
        <div>
            {formData.pancardUrl?.endsWith(".pdf") || formData.pancardUrl?.endsWith(".csv") ? (
                <a
                    href={formData.pancardUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    Download {formData.pancardUrl.split("/").pop()}
                </a>
            ) : (
                <Image
                    src={formData.pancardUrl}
                    alt="PanCard"
                    style={{ width: "100%", maxWidth: "200px" }}
                />
            )}
        </div>
    ) : (
        <Upload
            customRequest={({ file, onSuccess, onError }) => {
                setTimeout(() => {
                    try {
                        setFormData({ ...formData, pancardUrl: URL.createObjectURL(file) });
                        onSuccess(null, file);
                    } catch (error) {
                        onError(error);
                    }
                }, 0);
            }}
            listType="picture-card"
            accept=".png,.jpg,.jpeg,.pdf,.csv"
            disabled={isDisabled}
        >
            <button
                style={{ border: 0, background: "none" }}
                type="button"
            >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </button>
        </Upload>
    )}
</label>


            </div>
          </div>
        </div>
        <div className="flex" style={{ paddingTop: "10px" }}>
          <Checkbox>
            I have read the <a href="">Terms and Condition</a> agreement
          </Checkbox>
        </div>
        <div className="btncont">
          {!kycData?.error ? (
            authUser?.isVerified ? (
              <Button
                htmlType="submit"
                className="btn11"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Verified
              </Button>
            ) : (
              <Button
                htmlType="submit"
                className="btn"
                disabled
                style={{
                  background: "linear-gradient(135deg, #007bff, #035a86)",
                  color: "white",
                  padding: "20px",
                  fontSize: "18px",
                }}
              >
                Pending
              </Button>
            )
          ) : (
            <Button
              htmlType="submit"
              className="btn"
              loading={loading}
              style={{
                background: "linear-gradient(135deg, #007bff, #035a86)",
                color: "white",
                padding: "20px",
                fontSize: "18px",
              }}
            >
              Save
            </Button>
          )}{" "}
          <Button
            htmlType="button"
            className="btn"
            style={{
              background: "linear-gradient(135deg, #007bff, #035a86)",
              color: "white",
              padding: "20px",
              fontSize: "18px",
            }}
            onClick={handleResetClick}
          >
            Reset
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

export default KYC;
