import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Steps, Typography, Progress, Row, Col, Spin, message } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Title } = Typography;
const { Step } = Steps;

const Tracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const {shippingPartner,awb} = useParams()

  useEffect(() => {
    axios.get(`https://backend.shiphere.in/api/${shippingPartner}/track/${awb}`)
      .then(response => {
        if (response.data.success) {
          setTrackingInfo(response.data.trackingInfo);
        } else {
          message.error('Failed to retrieve tracking information.');
        }
      })
      .catch(error => {
        console.error('API error:', error);
        message.error('Error fetching tracking information.');
      })
      .finally(() => setLoading(false));
  }, [awb]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
          tip="Loading Tracking Information..." 
          size="large" 
        />
      </div>
    );
  }

  if (!trackingInfo) {
    return <p>No tracking information available.</p>;
  }

  const statusMap = {
    'pending pickup': 20,
    'in transit': 50,
    'out for delivery': 80,
    'delivered': 100,
  };

  const progress = statusMap[trackingInfo.status.toLowerCase()] || 0;

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: '20px' }}>
        <Title level={4}>Tracking Information</Title>
        <Descriptions bordered>
          <Descriptions.Item label="AWB Number">{trackingInfo.awb_number}</Descriptions.Item>
          <Descriptions.Item label="Order Number">{trackingInfo.order_number}</Descriptions.Item>
          <Descriptions.Item label="Order ID">{trackingInfo.order_id}</Descriptions.Item>
          <Descriptions.Item label="Courier ID">{trackingInfo.courier_id}</Descriptions.Item>
          <Descriptions.Item label="Status">{trackingInfo.status}</Descriptions.Item>
          <Descriptions.Item label="Created">{trackingInfo.created}</Descriptions.Item>
          <Descriptions.Item label="Warehouse ID">{trackingInfo.warehouse_id}</Descriptions.Item>
          {trackingInfo.rto_warehouse_id && (
            <Descriptions.Item label="RTO Warehouse ID">{trackingInfo.rto_warehouse_id}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: '20px' }}>
        <Row>
          <Col span={12}>
            <Title level={4}>Shipment Progress</Title>
            <Progress percent={progress} status={progress === 100 ? 'success' : 'active'} />
          </Col>
        </Row>
      </Card>

      <Card>
        <Title level={4}>Tracking History</Title>
        <Steps direction="horizontal" current={trackingInfo.history.length - 1}>
          {trackingInfo.history.map((event, index) => (
            <Step 
              key={index} 
              title={event.message} 
              description={
                <>
                  <p>{event.location}</p>
                  <p>{event.event_time}</p>
                </>
              } 
            />
          ))}
        </Steps>
      </Card>
    </div>
  );
};

export default Tracking;
