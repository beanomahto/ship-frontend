import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select, Upload, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import useUpdateLabel from "../../hooks/useUpdateLabel";
import "./newLabelStyles.css";
const { Option } = Select;

const UpdateLabel = () => {
  const [form] = Form.useForm();
  const { updateLebel } = useUpdateLabel();
  const [inputs, setInputs] = useState({
    logoUrl: "",
    theme: "",
    hideLogo: false,
    hideCompanyName: false,
    hideCompanyGSTIN: false,
    hidePaymentType: false,
    hidePrepaidAmount: false,
    hideCustomerPhone: false,
    hideInvoiceNumber: false,
    hideInvoiceDate: false,
    showProductDetail: false,
    hideProductName: false,
    hideReturnWarehouse: false,
    hideWeight: false,
    hideDimension: false,
  });

  useEffect(() => {
    const fetchLabelInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shipping/getLabelInfo`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const fetchedData = response.data;
        console.log(fetchedData);

        const updatedInputs = {
          logoUrl: fetchedData?.logoUrl || "",
          theme: fetchedData.theme || "",
          hideLogo: fetchedData.hideLogo ?? false,
          hideCompanyName: fetchedData.hideCompanyName ?? false,
          hideCompanyGSTIN: fetchedData.hideCompanyGSTIN ?? false,
          hidePaymentType: fetchedData.hidePaymentType ?? false,
          hidePrepaidAmount: fetchedData.hidePrepaidAmount ?? false,
          hideCustomerPhone: fetchedData.hideCustomerPhone ?? false,
          hideInvoiceNumber: fetchedData.hideInvoiceNumber ?? false,
          hideInvoiceDate: fetchedData.hideInvoiceDate ?? false,
          showProductDetail: fetchedData.showProductDetail ?? false,
          hideProductName: fetchedData.hideProductName ?? false,
          hideReturnWarehouse: fetchedData.hideReturnWarehouse ?? false,
          hideWeight: fetchedData.hideWeight ?? false,
          hideDimension: fetchedData.hideDimension ?? false,
        };
        setInputs(updatedInputs);
        form.setFieldsValue(updatedInputs);
      } catch (error) {
        message.error("Failed to fetch label info");
        console.error("Error fetching label info:", error);
      }
    };
    fetchLabelInfo();
  }, [form]);

  const handleSubmit = async (values) => {
    await updateLebel(values);
    message.success("Updated successfully");
  };

  return (
    <div className="update-label-container">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="keyword" content={""} />
        <title>Update Label</title>
      </Helmet>
      <div className="form-container">
        <Form
          layout="vertical"
          form={form} // Link the form instance
          onFinish={handleSubmit}
          initialValues={inputs}
        >
          <h2 className="form-title">Update Label</h2>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Choose Logo" name="logoUrl">
                <Upload
                  listType="picture-card"
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      setInputs((prev) => ({
                        ...prev,
                        logoUrl: URL.createObjectURL(file),
                      }));
                      onSuccess(null, file);
                    }, 0);
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Select Theme" name="theme">
                <Select placeholder="Select a theme">
                  <Option value="dark">Dark</Option>
                  <Option value="light">Light</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Logo" name="hideLogo">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Hide Company Name" name="hideCompanyName">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Company GSTIN" name="hideCompanyGSTIN">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Payment Type" name="hidePaymentType">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Hide Amount From Prepaid Orders"
                name="hidePrepaidAmount"
              >
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Customer Phone" name="hideCustomerPhone">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Invoice Number" name="hideInvoiceNumber">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Hide Invoice Date" name="hideInvoiceDate">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Show Product With Details"
                name="showProductDetail"
              >
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Hide Product Name Orders"
                name="hideProductName"
              >
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Hide Return Warehouse"
                name="hideReturnWarehouse"
              >
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Weight" name="hideWeight">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hide Dimension" name="hideDimension">
                <Select placeholder="Select an option">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateLabel;
