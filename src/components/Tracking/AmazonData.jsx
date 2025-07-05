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
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  FileDoneOutlined,
  CarOutlined,
  ExclamationCircleOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const AmazonData = ({ trackingInfo, advertisement }) => {
  const eventHistory = trackingInfo?.eventHistory || [];

  const stateToProgress = {
    ReadyForReceive: 10,
    AtPickupHub: 20,
    Shipped: 30,
    OutForDelivery: 70,
    Delivered: 100,
    Exception: 40,
    RTO: 60,
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

  const parsedEvents = eventHistory.map((event) => ({
    status: event.eventCode,
    date: formatDate(event.eventTime),
    progress: stateToProgress[event.eventCode] || 5,
  }));

  const latest = parsedEvents[parsedEvents.length - 1] || {};
  const progress = latest.progress || 0;

  const getStepIcon = (status) => {
    switch (status) {
      case "ReadyForReceive":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "AtPickupHub":
        return <SyncOutlined style={{ color: "#1890ff" }} />;
      case "Shipped":
        return <ArrowRightOutlined style={{ color: "#1890ff" }} />;
      case "OutForDelivery":
        return <CarOutlined style={{ color: "#faad14" }} />;
      case "Delivered":
        return <FileDoneOutlined style={{ color: "#52c41a" }} />;
      case "Exception":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "RTO":
        return <RedoOutlined style={{ color: "#faad14" }} />;
      default:
        return <PauseCircleOutlined style={{ color: "#999" }} />;
    }
  };

  return (
    <div style={{ background: "#f4f6f9", padding: "30px", minHeight: "100vh" }}>
      <Row gutter={[24, 24]} justify="center">
        {/* Left Side Card */}
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
                {trackingInfo.trackingId}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {trackingInfo.summary?.status}
              </Descriptions.Item>
              <Descriptions.Item label="Promised Delivery">
                {formatDate(trackingInfo.promisedDeliveryDate)}
              </Descriptions.Item>
            </Descriptions>

            {/* Ad or Video */}
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
                <video
                  src={statusVideo}
                  autoPlay
                  muted
                  loop
                  style={{ width: "100%", height: "auto", marginTop: "-40px" }}
                />
              )}
            </div>
          </Card>
        </Col>

        {/* Right Side Progress + Steps */}
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
                  title={event.status.replaceAll("_", " ")}
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

export default AmazonData;
