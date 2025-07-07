import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Typography,
  Steps,
  Progress,
  Carousel,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  RedoOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Step } = Steps;

const DelhiveryData = ({ trackingInfo, advertisement }) => {
  const shipment = trackingInfo?.ShipmentData?.[0]?.Shipment;

  if (!shipment) {
    return <p>Invalid tracking data</p>;
  }

  const scans = shipment.Scans || [];

  // Convert scan data to steps format
  const stateToProgress = {
    // You can define these better based on real status
    "Shipment Created": 10,
    "In Transit": 30,
    "Out for Delivery": 70,
    Delivered: 100,
    RTO: 60,
    Exception: 50,
  };

  const getStepIcon = (status) => {
    if (status.includes("Delivered"))
      return <FileDoneOutlined style={{ color: "#52c41a" }} />;
    if (status.includes("Out for Delivery"))
      return <CarOutlined style={{ color: "#faad14" }} />;
    if (status.includes("In Transit"))
      return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
    if (status.includes("RTO"))
      return <RedoOutlined style={{ color: "#faad14" }} />;
    if (status.includes("Exception"))
      return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
    if (status.includes("Created"))
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    return <PauseCircleOutlined style={{ color: "#999" }} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parsedEvents = scans.map((scan) => ({
    status: scan.ScanDetail?.Instructions || "Unknown",
    date: formatDate(scan.ScanDetail?.ScanDateTime),
    progress: stateToProgress[scan.ScanDetail?.Instructions] || 10,
  }));

  const latest = parsedEvents[parsedEvents.length - 1] || {};
  const progress = latest.progress || 0;

  return (
    <div style={{ background: "#f4f6f9", padding: "30px", minHeight: "100vh" }}>
      <Row gutter={[24, 24]} justify="center">
        {/* Left Column: Shipment Info + Advertisement */}
        <Col xs={24} sm={8}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #ffffff, #fafafa)",
            }}
          >
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Tracking Information
            </Title>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="AWB Number">
                {shipment.AWB}
              </Descriptions.Item>
              <Descriptions.Item label="Order Type">
                {shipment.OrderType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {shipment.Addresses?.[0]?.Name || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {/* Advertisement */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              {advertisement && advertisement.images?.length > 0 ? (
                <>
                  <Carousel autoplay>
                    {advertisement.images.map((img, index) => (
                      <div key={index}>
                        <a
                          href={advertisement.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={img}
                            alt={`Ad ${index}`}
                            style={{
                              width: "350px",
                              height: "350px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        </a>
                      </div>
                    ))}
                  </Carousel>
                  {advertisement.description && (
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#555",
                        fontSize: "20px",
                        fontWeight: "bolder",
                      }}
                    >
                      {advertisement.description}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ color: "#999" }}>No Advertisement</p>
              )}
            </div>
          </Card>
        </Col>

        {/* Right Column: Progress Bar + Timeline */}
        <Col xs={24} sm={16}>
          <Card style={{ marginBottom: 20, borderRadius: 10 }}>
            <Title level={4}>Shipment Progress</Title>
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
              strokeColor={progress === 100 ? "#52c41a" : "#1890ff"}
            />
          </Card>

          <Card
            style={{ maxHeight: "600px", overflowY: "auto", borderRadius: 10 }}
          >
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical" current={parsedEvents.length - 1}>
              {parsedEvents.map((event, idx) => (
                <Step
                  key={idx}
                  title={event.status}
                  description={event.date}
                  icon={getStepIcon(event.status)}
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DelhiveryData;
