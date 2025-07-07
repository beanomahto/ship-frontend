import React from "react";
import { Card, Timeline, Typography, Descriptions } from "antd";

const { Title } = Typography;
const { Step } = Steps;

const DelhiveryData = ({ trackingInfo, advertisement }) => {
  const shipment = trackingInfo?.ShipmentData?.[0]?.Shipment;

  if (!shipment) {
    return <p>Invalid tracking data</p>;
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : "N/A";
  };

  return (
    <div style={{ color: "#fff" }}>
      <Title level={3} style={{ color: "#fff" }}>
        Tracking Details for AWB: {shipment.AWB}
      </Title>
      <Title level={4} style={{ color: "#fff", marginBottom: 8 }}>
        Order Details
      </Title>
      <Descriptions
        bordered
        column={1}
        style={{ marginBottom: 24 }}
        labelStyle={{ color: "#fff", fontWeight: "bold" }}
        contentStyle={{ color: "#fff" }}
      >
        <Descriptions.Item label='Order ID'>
          {shipment.ReferenceNo || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label='AWB'>
          {shipment.AWB || "N/A"}
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

      <Title level={4} style={{ color: "#fff" }}>
        Tracking Timeline
      </Title>
      <Timeline>
        {shipment.Scans?.map((scan, index) => (
          <Timeline.Item key={index} style={{ color: "#fff" }}>
            <strong style={{ color: "#fff" }}>
              {scan.ScanDetail.ScanType}
            </strong>{" "}
            - {formatDate(scan.ScanDetail.ScanDateTime)}
            <br />
            <small style={{ color: "#fff" }}>
              {scan.ScanDetail.Instructions}
            </small>
          </Timeline.Item>
        ))}
      </Timeline>

      {advertisement && (
        <Card
          title={advertisement.description}
          extra={<a href={advertisement.url}>Visit</a>}
          style={{ marginTop: 20 }}
        >
          <img src={advertisement.images} alt='Ad' style={{ width: "100%" }} />
        </Card>
      )}
    </div>
  );
};

export default DelhiveryData;
