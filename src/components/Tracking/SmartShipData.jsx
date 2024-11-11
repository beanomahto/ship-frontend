import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Typography,
  Steps,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import img1 from "../../utils/trackk.jpg";
const { Title } = Typography;
const { Step } = Steps;

const SmartShipData = ({ trackingInfo }) => {
  //console.log(trackingInfo);

  // Access dynamic scan data
  const scanData = trackingInfo?.data?.scans;
  const scanKey = scanData ? Object.keys(scanData)[0] : null;
  const trackingHistory = scanKey ? scanData[scanKey] : [];
//console.log(trackingHistory);

  const totalSteps = trackingHistory.length;
  const completedSteps = trackingHistory.filter(
    (item) =>
      item.status_description === "Delivered" ||
      item.status_description === "Completed"
  ).length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const currentStepIndex = totalSteps - 1;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
      case "Completed":
        return <CheckCircleOutlined style={{ color: "green" }} />;
      case "In Transit":
        return <SyncOutlined spin style={{ color: "blue" }} />;
      case "Pending":
        return <ClockCircleOutlined style={{ color: "orange" }} />;
      case "Failed":
        return <CloseCircleOutlined style={{ color: "red" }} />;
      default:
        return <SyncOutlined />;
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={4}>Tracking Information</Title>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="AWB Number">
                {trackingHistory[0]?.tracking_number}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {trackingHistory[0]?.order_reference_id}
              </Descriptions.Item>
              <Descriptions.Item label="Ordered On">
                {new Date(trackingHistory[0]?.order_date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {trackingHistory[0]?.status_description}
              </Descriptions.Item>
            </Descriptions>
            <img
              src={img1}
              alt="Shipment Image"
              style={{
                marginTop: "20px",
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={16}>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <Title level={4}>Shipment Progress</Title>
            <Progress
              percent={progressPercentage}
              status={completedSteps === totalSteps ? "success" : "active"}
            />
          </Card>

          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={4}>Tracking History</Title>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <Steps direction="vertical" current={currentStepIndex}>
                {trackingHistory.map((step, index) => (
                  <Step
                    key={index}
                    title={`${step.action} - ${step.location}`}
                    description={`Date: ${new Date(
                      step.date_time
                    ).toLocaleString()}`}
                    icon={getStatusIcon(step.status_description)}
                  />
                ))}
              </Steps>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SmartShipData;
