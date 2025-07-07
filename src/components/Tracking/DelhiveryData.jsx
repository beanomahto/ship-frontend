import React from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Typography,
  Steps,
  Carousel,
  Progress,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const DelhiveryData = ({ trackingInfo, advertisement }) => {
  const shipment = trackingInfo?.ShipmentData?.[0]?.Shipment;
  if (!shipment) return <p>Invalid tracking data</p>;

  const scans = shipment.Scans || [];

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  const progressMap = {
    "Order Placed": 5,
    "Shipment Created": 10,
    "In Transit": 40,
    "Out for Delivery": 75,
    Delivered: 100,
    "Delivery Attempted": 60,
    "Returned to Origin": 85,
  };

  const inferProgress = () => {
    const lastScan = scans[scans.length - 1]?.ScanDetail;
    if (!lastScan) return 0;
    return (
      progressMap[lastScan.ScanType] ||
      (lastScan.ScanType.includes("Delivered") ? 100 : 50)
    );
  };

  const getStepIcon = (type) => {
    if (type.includes("Delivered"))
      return <FileDoneOutlined style={{ color: "#52c41a" }} />;
    if (type.includes("Out for Delivery"))
      return <SyncOutlined style={{ color: "#faad14" }} />;
    if (type.includes("Transit"))
      return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
    if (type.includes("Attempted") || type.includes("Failed"))
      return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
    return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
  };

  return (
    <div
      style={{
        background: "#f4f6f9",
        padding: "30px",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Row gutter={[24, 24]} justify='center'>
        {/* Left Column: Info + Ad */}
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
              style={{ textAlign: "center", color: "#333", marginBottom: 20 }}
            >
              Tracking Information
            </Title>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label='AWB'>
                {shipment.AWB || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label='Order ID'>
                {shipment.ReferenceNo || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label='Order Date'>
                {formatDate(shipment.PickUpDate)}
              </Descriptions.Item>
              <Descriptions.Item label='Delivery Date'>
                {formatDate(shipment.DeliveryDate)}
              </Descriptions.Item>
              <Descriptions.Item label='Payment Type'>
                {shipment.OrderType || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {advertisement && advertisement.images ? (
                <div>
                  <a
                    href={advertisement.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      src={advertisement.images}
                      alt='Ad'
                      style={{
                        width: "100%",
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </a>
                  {advertisement.description && (
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#555",
                        fontSize: "20px",
                        fontWeight: "bolder",
                        marginBottom: "10px",
                      }}
                    >
                      {advertisement.description}
                    </p>
                  )}
                </div>
              ) : (
                <video
                  src={statusVideo}
                  autoPlay
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "-50px",
                  }}
                />
              )}
            </div>
          </Card>
        </Col>

        {/* Right Column: Progress + Steps */}
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
              percent={inferProgress()}
              status={inferProgress() === 100 ? "success" : "active"}
              strokeColor={inferProgress() === 100 ? "#52c41a" : "#1890ff"}
              showInfo={true}
            />
          </Card>

          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <Title level={4}>Tracking History</Title>
            <Steps direction='vertical' current={scans.length - 1}>
              {scans.map((scan, index) => (
                <Step
                  key={index}
                  title={formatDate(scan.ScanDetail.ScanDateTime)}
                  description={
                    <p>
                      <strong>Status:</strong> {scan.ScanDetail.ScanType}
                      <br />
                      <strong>Note:</strong> {scan.ScanDetail.Instructions}
                    </p>
                  }
                  icon={getStepIcon(scan.ScanDetail.ScanType)}
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