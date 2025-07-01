import {
    CheckCircleOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    Card,
    Carousel,
    Col,
    Descriptions,
    Progress,
    Row,
    Steps,
    Typography,
    message,
} from "antd";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useOrderContext } from "../../context/OrderContext";
import statusVideo from "../../utils/DeliveryStatus2.mp4";

const { Title } = Typography;
const { Step } = Steps;

const EcomData = ({ trackingInfo, advertisement }) => {
  const { orders, fetchOrders } = useOrderContext();
  const lastUndeliveredReason = useRef(null);

  const statusToProgress = {
    "Soft data uploaded": 25,
    "Pickup Assigned": 50,
    "Out for Pickup": 75,
    "Shipment Picked Up": 100,
    "Shipment delivered": 100,
  };

  const parseScans = (scans) => {
    const scanEntries = scans
      ?.split(/\d{2}\s\w{3},\s\d{4},\s\d{2}:\d{2}/g)
      .filter((entry) => entry.trim() !== "");
    const dateMatches =
      scans?.match(/\d{2}\s\w{3},\s\d{4},\s\d{2}:\d{2}/g) || [];

    return scanEntries.map((entry, index) => {
      const date = dateMatches[index] || "Unknown Date";
      const entryParts = entry.split("-").map((part) => part.trim());
      const name =
        entryParts[entryParts.length - 2] +
        " " +
        entryParts[entryParts.length - 1];
      const status = entryParts[0];
      const city = entryParts[2];

      return {
        date,
        status,
        name,
        city,
      };
    });
  };

  const parsedScans = parseScans(trackingInfo.scans);
  const filteredScans = [];

  for (let i = parsedScans.length - 1; i >= 0; i--) {
    const scan = parsedScans[i];
    filteredScans.unshift(scan);
    if (scan.status === "Shipment Picked Up") {
      break;
    }
  }

  const latestScan = filteredScans?.[0];
  const fullLatestScan = parsedScans?.[0];
  const undeliveredScan = parsedScans?.filter(
    (status) => status?.status === "Shipment un"
  );

  const latestStatus = latestScan?.status || trackingInfo?.status;
  const fullLatestStatus = fullLatestScan?.status || trackingInfo?.status;
  const progressPercentage = statusToProgress[latestStatus] || 0;
  console.log(filteredScans);
  console.log(fullLatestStatus);
  console.log(fullLatestStatus.status);
  //   {
  //     "date": "18 Nov, 2024, 12:56",
  //     "status": "Shipment Picked Up",
  //     "name": "AGR\nGajendar . 75870",
  //     "city": "AGR\nService Center\nAGRA"
  // }

  const getStepIcon = (status) => {
    switch (status) {
      case "Shipment Picked Up":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "Out for Pickup":
        return <SyncOutlined style={{ color: "#1890ff" }} />;
      case "Pickup Assigned":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "failed":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "Soft data uploaded":
        return <CheckOutlined style={{ color: "#1890ff" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const shippedOrders = orders?.orders?.filter(
    (order) =>
      order.status === "Shipped" ||
      order.status === "InTransit" ||
      order.status === "Delivered" ||
      order.status === "UnDelivered"
  );
  const currentOrder = shippedOrders?.filter(
    (order) => order?.awb === trackingInfo?.awb_number
  );
  console.log(currentOrder);

  const updateOrderStatus = async (
    orderId,
    newStatus,
    shippingCost,
    reason = null
  ) => {
    try {
      const updateBody = {
        status: newStatus,
        shippingCost: shippingCost,
        ...(newStatus === "UnDelivered" && { reason }),
      };

      const response = await axios.put(
        `http://localhost:5000/api/orders/updateOrderStatus/${orderId}`,
        updateBody,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        message.success(`Order marked as ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    if (currentOrder?.length > 0) {
      const orderId = currentOrder[0]?._id;
      const shippingCost = currentOrder[0]?.shippingCost;
      const reason = undeliveredScan[0]?.city?.split("\n")[0];
      console.log(latestScan?.status === "Shipment Picked Up");
      console.log(latestScan);

      // Update to "InTransit"
      if (
        latestScan.status === "Shipment Picked Up" &&
        currentOrder[0]?.status !== "InTransit" &&
        currentOrder[0]?.status !== "Delivered"
      ) {
        updateOrderStatus(orderId, "InTransit", shippingCost);
      }

      // Update to "Delivered"
      if (
        fullLatestStatus.includes("Shipment delivered") &&
        currentOrder[0]?.status !== "Delivered"
      ) {
        updateOrderStatus(orderId, "Delivered", shippingCost);
      }

      // Update to "Undelivered" if the reason changes or if the status is not "UnDelivered"
      if (
        undeliveredScan?.length !== 0 &&
        (currentOrder[0]?.status !== "UnDelivered" ||
          lastUndeliveredReason.current !== reason)
      ) {
        updateOrderStatus(orderId, "UnDelivered", shippingCost, reason);
        lastUndeliveredReason.current = reason;
      }
    }
  }, [fullLatestStatus, progressPercentage, currentOrder]);

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
                {trackingInfo.awb_number}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {trackingInfo.orderid}
              </Descriptions.Item>
              <Descriptions.Item label="Destination">
                {trackingInfo.destination}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {trackingInfo.pincode}
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
            <Steps direction="vertical">
              {parsedScans.map((scan, index) => (
                <Step
                  key={index}
                  icon={getStepIcon(scan.status)}
                  title={scan.date}
                  description={
                    <>
                      <p>
                        <strong>Status:</strong> {scan.status}
                      </p>
                      <p>
                        <strong>City:</strong> {scan.city}
                      </p>
                    </>
                  }
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EcomData;
