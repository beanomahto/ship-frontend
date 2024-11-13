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
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import img1 from "../../utils/trackk.jpg";
import { useOrderContext } from "../../context/OrderContext";
import axios from "axios";

const { Title } = Typography;
const { Step } = Steps;

const SmartShipData = ({ trackingInfo }) => {
  const scanData = trackingInfo?.data?.scans;
  const scanKey = scanData ? Object.keys(scanData)[0] : null;
  const trackingHistory = scanKey ? scanData[scanKey] : [];
  const { orders, fetchOrders } = useOrderContext();

  const totalSteps = trackingHistory.length;
  const completedSteps = trackingHistory.filter(
    (item) =>
      item.status_description === "Delivered" ||
      item.status_description === "Completed"
  ).length;

  const progressPercentage = (completedSteps / totalSteps) * 100;
  const currentStepIndex = totalSteps - 1;

  const latestStatus = trackingHistory[0]?.status_description;
  console.log(trackingHistory.map((ok) => ok.status_description).includes('In Transit'));
  const isInTransit =  trackingHistory.some((ok) =>
    ['In Transit', 'Shipped'].includes(ok.status_description)
  )
  console.log(
    trackingHistory.some((ok) =>
      ['In Transit', 'Shipped'].includes(ok.status_description)
    )
  );
  
  
console.log(trackingHistory.map((ok) => ok.status_description));

  // Function to update order status in the backend
  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(orderId);
    console.log(newStatus);
    
    
    try {
      const updateBody = {
        status: newStatus,
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
    console.log("Checking order and status...");
    if (latestStatus) {
      console.log("Tracking info available");
  
      const shippedOrders = orders?.orders?.filter(
        (order) =>
          order.status === "Shipped" ||
          order.status === "InTransit" ||
          order.status === "Delivered"
      );
      
      // Ensure tracking number is available
      const trackingNumber = trackingHistory[0]?.tracking_number;
      const currentOrder = shippedOrders?.find(
        (order) => order?.awb === trackingNumber?.toString()
      );
      
      if (trackingNumber) {
        console.log("Current tracking number:", trackingNumber);
      }
  
      if (currentOrder) {
        const orderId = currentOrder?._id;
        console.log("Current order ID:", orderId);
  
        if (orderId) {
          console.log("Order ID found. Checking status...");
  console.log(currentOrder);
  
          if (latestStatus === "Delivered" && currentOrder.status !== "Delivered") {
            updateOrderStatus(orderId, "Delivered");
          } else if (isInTransit && currentOrder.status !== "InTransit" && currentOrder.status !== "Delivered") {
            updateOrderStatus(orderId, "InTransit");
          } else if (latestStatus === "Pending" && currentOrder.status !== "Pending") {
            updateOrderStatus(orderId, "Pending");
          } else if (latestStatus === "Failed" && currentOrder.status !== "Failed") {
            updateOrderStatus(orderId, "Failed");
          }
        } else {
          console.log("No current order found for the tracking number.");
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
            <Descriptions bordered column={1} labelStyle={{ fontWeight: "bold" }}>
              <Descriptions.Item label="AWB Number">
                {trackingHistory[0]?.tracking_number}
              </Descriptions.Item>
              <Descriptions.Item label="Order ID">
                {trackingHistory[0]?.order_reference_id}
              </Descriptions.Item>
              <Descriptions.Item label="Ordered On">
                {new Date(trackingHistory[0]?.order_date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Expected Date">
                {trackingHistory[0]?.expected_delivery_date}
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
              strokeColor={completedSteps === totalSteps ? "green" : "blue"}
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
              {trackingHistory.map((scan, index) => (
                <Step
                  key={index}
                  icon={getStatusIcon(scan.status_description)}
                  title={scan.date}
                  description={
                    <>
                      <p>
                        <strong>Status:</strong> {scan.status_description}
                      </p>
                      <p>
                        <strong>Location:</strong> {scan.location}
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

export default SmartShipData;
