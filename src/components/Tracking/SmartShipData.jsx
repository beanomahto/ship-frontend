import React, { useEffect, useState } from "react";
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
  ClockCircleOutlined,
  SyncOutlined,
  CheckOutlined,
  TruckOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { MdLocalShipping, MdOutlineDownloadDone } from "react-icons/md";

import { useOrderContext } from "../../context/OrderContext";
import axios from "axios";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const SmartShipData = ({ trackingInfo, advertisement }) => {
  console.log("oko");
  console.log("advertisement", advertisement);
  const scanData = trackingInfo?.data?.scans;
  const scanKey = scanData ? Object.keys(scanData)[0] : null;
  const trackingHistory = scanKey ? scanData[scanKey] : [];
  const { orders, fetchOrders } = useOrderContext();

  // const progressSteps = [
  //   "Shipping Label Generated",
  //   "Manifested",
  //   "Shipped",
  //   "In Transit",
  //   "Out For Delivery",
  //   "Delivered",
  // ];
  const progressSteps = [
    {
      title: "Shipping Label Generated",
      icon: <CheckOutlined style={{ color: "#69c0ff" }} />,
    },
    {
      title: "Manifested",
      icon: <ClockCircleOutlined style={{ color: "#ffa940" }} />,
    },
    {
      title: "Shipped",
      icon: <MdLocalShipping style={{ color: "#1890ff" }} />,
    },
    {
      title: "In Transit",
      icon: <TruckOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Out For Delivery",
      icon: <SyncOutlined style={{ color: "#1890ff" }} spin />,
    },
    {
      title: "Delivered",
      icon: <HomeOutlined style={{ color: "#52c41a" }} />,
    },
  ];

  const latestStatus = trackingHistory[0]?.status_description;
  console.log(latestStatus);

  // Map the latest status to the step index in progressSteps
  const statusToStepIndex = {
    "Shipping Label Generated": 0,
    Manifested: 1,
    Shipped: 2,
    "In Transit": 3,
    "Out For Delivery": 4,
    Delivered: 5,
  };

  const currentStepIndex = statusToStepIndex[latestStatus] ?? 0;
  const progressPercentage =
    ((currentStepIndex + 1) / progressSteps.length) * 100;

  // const latestStatus = trackingHistory[0]?.status_description;
  const isInTransit = trackingHistory.some((ok) =>
    ["In Transit", "Shipped"].includes(ok.status_description)
  );

  const statusCodesToCheck = ["12", "13", "14", "15"];
  const matchedStatus = trackingHistory.find((item) =>
    statusCodesToCheck.includes(item.status_code)
  );
  console.log(matchedStatus);
  const reason = matchedStatus ? matchedStatus.status_description : null;
  console.log(reason);

  const updateOrderStatus = async (orderId, newStatus, reason = null) => {
    try {
      const updateBody = {
        status: newStatus,
        reason,
      };

      const response = await axios.put(
        `https://backend.shiphere.in/api/orders/updateOrderStatus/${orderId}`,
        updateBody,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        message.success(`Order marked as ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Error updating order status");
    }
  };

  useEffect(() => {
    if (latestStatus) {
      const shippedOrders = orders?.orders?.filter(
        (order) =>
          order.status === "Shipped" ||
          order.status === "InTransit" ||
          order.status === "Delivered" ||
          order.status === "UnDelivered"
      );
      // console.log(shippedOrders);
      console.log(
        trackingHistory.map(
          (ok) => ok.status_description + " and " + ok.status_code
        )
      );

      const trackingNumber = trackingHistory[0]?.tracking_number;
      const currentOrder = shippedOrders?.find(
        (order) => order?.awb === trackingNumber?.toString()
      );

      if (currentOrder) {
        const orderId = currentOrder?._id;
        console.log(reason);
        console.log(currentOrder?.status);

        if (
          latestStatus === "Delivered" &&
          currentOrder.status !== "Delivered"
        ) {
          updateOrderStatus(orderId, "Delivered");
        } else if (
          reason &&
          currentOrder.status !== "UnDelivered" &&
          currentOrder.status !== "Delivered"
        ) {
          updateOrderStatus(orderId, "UnDelivered", reason);
        } else if (
          isInTransit &&
          currentOrder.status !== "InTransit" &&
          currentOrder.status !== "Delivered" &&
          currentOrder.status !== "UnDelivered"
        ) {
          updateOrderStatus(orderId, "InTransit");
        } else if (
          latestStatus === "Failed" &&
          currentOrder.status !== "Failed"
        ) {
          updateOrderStatus(orderId, "Failed");
        }
      }
    }
  }, [latestStatus, trackingHistory, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
      case "Completed":
        return <CheckCircleOutlined style={{ color: "green" }} />;
      case "In Transit":
        return <ClockCircleOutlined style={{ color: "grey" }} />;
      case "Pending":
        return <ClockCircleOutlined style={{ color: "orange" }} />;
      case "Shipped":
        return <MdOutlineDownloadDone style={{ color: "green" }} />;
      case "Out For Delivery":
        return <SyncOutlined style={{ color: "blue" }} />;
      case "Manifested":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Shipping Label Generated":
        return <CheckOutlined style={{ color: "#1890ff" }} />;

      default:
        return <SyncOutlined />;
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
        {/* Left Section */}
        <Col xs={24} md={10}>
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
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="AWB Number">
                <span style={{ fontWeight: "bold" }}>
                  {trackingHistory[0]?.tracking_number || "N/A"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                <span style={{ fontWeight: "bold" }}>
                  {trackingHistory[0]?.order_reference_id || "N/A"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ordered On">
                <span style={{ color: "#555" }}>
                  {new Date(trackingHistory[0]?.order_date).toLocaleString() ||
                    "N/A"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Expected Delivery">
                <span style={{ color: "#555" }}>
                  {trackingHistory[0]?.expected_delivery_date || "N/A"}
                </span>
              </Descriptions.Item>
            </Descriptions>
            {/* 
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <video
                src={statusVideo}
                autoPlay
                muted
                loop
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div> */}
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

        {/* Right Section */}
        <Col xs={24} md={14}>
          <Card
            hoverable
            style={{
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #ffffff, #f8f9fb)",
            }}
          >
            <Title
              level={3}
              style={{
                textAlign: "left",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Shipping Progress
            </Title>
            <Steps
              current={currentStepIndex}
              size="small"
              progressDot
              style={{ marginBottom: "20px" }}
            >
              {progressSteps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  icon={step.icon}
                  description={
                    index <= currentStepIndex
                      ? "Completed"
                      : index === currentStepIndex
                      ? "In Progress"
                      : "Pending"
                  }
                />
              ))}
            </Steps>
            {/* <Progress
               percent={parseFloat((((currentStepIndex + 1) / progressSteps.length) * 100).toFixed(2))}
              status={
                currentStepIndex === progressSteps.length - 1
                  ? "success"
                  : "active"
              }
              strokeColor={
                currentStepIndex === progressSteps.length - 1
                  ? "#52c41a"
                  : "#1890ff"
              }
              showInfo
            /> */}
          </Card>

          <Card
            hoverable
            style={{
              borderRadius: "16px",
              boxShadow: "0 6px 25px rgba(0, 0, 0, 0.1)",
              marginTop: "20px",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <Title level={4} style={{ color: "#333" }}>
              Tracking History
            </Title>
            <Steps direction="vertical" size="small">
              {trackingHistory.map((step, index) => (
                <Step
                  key={index}
                  title={`${step.action} - ${step.location}`}
                  description={`Date: ${step?.date_time.toLocaleString()}`}
                  icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SmartShipData;
