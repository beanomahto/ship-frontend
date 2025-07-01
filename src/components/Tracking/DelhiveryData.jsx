import React from "react";
import { Card, Timeline, Typography } from "antd";

const { Title } = Typography;

const DelhiveryData = ({ trackingInfo, advertisement }) => {
  const shipment = trackingInfo?.ShipmentData?.[0]?.Shipment;

  if (!shipment) {
    return <p>Invalid tracking data</p>;
  }

  return (
    <div style={{ color: "#fff" }}>
      <Title level={3} style={{ color: "#fff" }}>
        Tracking Details for AWB: {shipment.AWB}
      </Title>
      <Timeline>
        {shipment.Scans?.map((scan, index) => (
          <Timeline.Item key={index}>
            <strong>{scan.ScanType}</strong> - {scan.ScanDateTime}
          </Timeline.Item>
        ))}
      </Timeline>

      {advertisement && (
        <Card
          title={advertisement.description}
          extra={<a href={advertisement.url}>Visit</a>}
          style={{ marginTop: 20 }}
        >
          <img src={advertisement.images} alt="Ad" style={{ width: "100%" }} />
        </Card>
      )}
    </div>
  );
};

export default DelhiveryData;
