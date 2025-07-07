import React, { useEffect, useRef } from "react";
import {
  Card,
  Descriptions,
  Row,
  Col,
  Typography,
  Steps,
  Progress,
  message,
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
import { useOrderContext } from "../../context/OrderContext";
import axios from "axios";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const MarutiData = ({ trackingInfo, advertisement }) => {
  console.log("trackingInfo:", trackingInfo);

  const stateToProgress = {
    NEW: 5, // Order received into Innofulfill
    IN_PROCESS: 10, // Seller processes order
    ON_HOLD: 15, // Seller marks order on hold
    CANCELED: 0, // Seller cancels order
    READY_FOR_DISPATCH: 25, // Seller generates a manifest
    OUT_FOR_PICKUP: 30, // Delivery boy traveling to pickup location
    NOT_PICKED_UP: 20, // Pickup failed
    PICKED_UP: 40, // Successfully picked up
    IN_TRANSIT: 50, // Moving between hubs
    OUT_FOR_DELIVERY: 75, // Last mile delivery started
    DELIVERED: 100, // Delivered to customer
    UNDELIVERED: 60, // Delivery attempt failed
    RTO: 65, // Marked for Return to Origin (RTO)
    RTO_IN_TRANSIT: 70, // Returning to pickup hub
    RTO_OUT_FOR_DELIVERY: 80, // Return delivery started
    RTO_DELIVERED: 85, // Returned to seller
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-GB", options);
  };
  const parseOrderStateInfo = (orderStateInfo) => {
    console.log("orderStateInfo:", orderStateInfo);
    return orderStateInfo.map((entry) => {
      const { state, createdAt } = entry;
      const date = formatDate(createdAt); // Use your formatDate function
      return {
        date,
        state,
        progress: stateToProgress[state] || 0,
      };
    });
  };

  const parsedOrderStates = parseOrderStateInfo(trackingInfo.orderStateInfo);

  // To get the latest order state (latest in time)
  const latestOrderState = parsedOrderStates?.[parsedOrderStates.length - 1];
  const latestState = latestOrderState?.state || "Unknown State";
  const progressPercentage = latestOrderState?.progress || 0;

  const getStepIcon = (status) => {
    switch (status) {
      case "NEW":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />; // Order received
      case "IN_PROCESS":
        return <SyncOutlined style={{ color: "#1890ff" }} />; // Processing
      case "ON_HOLD":
        return <PauseCircleOutlined style={{ color: "#faad14" }} />; // On Hold
      case "CANCELED":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />; // Canceled
      case "READY_FOR_DISPATCH":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />; // Ready for dispatch
      case "OUT_FOR_PICKUP":
        return <CarOutlined style={{ color: "#1890ff" }} />; // Pickup in progress
      case "NOT_PICKED_UP":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />; // Pickup failed
      case "PICKED_UP":
        return <ShoppingOutlined style={{ color: "#52c41a" }} />; // Picked up successfully
      case "IN_TRANSIT":
        return <ArrowRightOutlined style={{ color: "#1890ff" }} />; // Moving between hubs
      case "OUT_FOR_DELIVERY":
        return <CarOutlined style={{ color: "#faad14" }} />; // Last-mile delivery
      case "DELIVERED":
        return <FileDoneOutlined style={{ color: "#52c41a" }} />; // Delivered
      case "UNDELIVERED":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />; // Undelivered
      case "RTO":
        return <RedoOutlined style={{ color: "#faad14" }} />; // Marked for return
      case "RTO_IN_TRANSIT":
        return <ArrowRightOutlined style={{ color: "#1890ff" }} />; // Returning to seller
      case "RTO_OUT_FOR_DELIVERY":
        return <CarOutlined style={{ color: "#faad14" }} />; // Out for return delivery
      case "RTO_DELIVERED":
        return <FileDoneOutlined style={{ color: "#52c41a" }} />; // Returned to seller
      default:
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />; // Default case
    }
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
      <Row gutter={[24, 24]} justify="center">
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
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Tracking Information
            </Title>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="AWB Number">
                {trackingInfo.awb}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {trackingInfo.originalOrderId}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {trackingInfo.orderCreatedAt
                  ? new Date(trackingInfo.orderCreatedAt).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Date">
                {trackingInfo.deliveryDate
                  ? new Date(trackingInfo.deliveryDate).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Type">
                {trackingInfo.paymentType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {trackingInfo.paymentStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Order Status">
                {trackingInfo.orderStatus.replaceAll("_", " ")}
              </Descriptions.Item>
            </Descriptions>
            {/* Conditional Advertisement Section */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              {advertisement && advertisement.images?.length > 0 ? (
                <div>
                  <Carousel autoplay>
                    {advertisement.images.map((imageSrc, index) => (
                      <div key={index}>
                        <a
                          href={advertisement.url} // Use the single URL
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={imageSrc} // Use each image source
                            alt={`Advertisement ${index + 1}`}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "350px",
                              height: "350px",
                              objectFit: "cover",
                              borderRadius: "8px",
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
                    marginTop: "-50px",
                    width: "100%",
                    height: "auto",
                  }}
                />
              )}
            </div>
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
              status={progressPercentage === 100 ? "success" : "active"}
              strokeColor={progressPercentage === 100 ? "#52c41a" : "#1890ff"}
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
            <Steps
              direction="vertical"
              current={trackingInfo.orderStateInfo.length - 1}
            >
              {trackingInfo.orderStateInfo.map((state, index) => (
                <Step
                  key={state._id}
                  title={formatDate(state.createdAt)}
                  description={
                    <>
                      <p>
                        <strong>Status:</strong>{" "}
                        {state.state.replaceAll("_", " ")}
                      </p>
                    </>
                  }
                  icon={getStepIcon(state.state)}
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarutiData;
