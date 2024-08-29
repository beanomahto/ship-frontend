import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Steps, Typography, Progress, Row, Col, Spin, message, Divider } from 'antd';
import axios from 'axios';
import { FaBox, FaInfoCircle, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle, FaHourglass, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const { Title } = Typography;
const { Step } = Steps;

const Tracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shippingPartner, awb } = useParams();
  const { authUser } = useAuthContext();

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
  }, [awb, shippingPartner]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <Spin 
          indicator={<FaBox style={{ fontSize: 48, color: '#1890ff' }} spin />} 
          tip="Loading Tracking Information..." 
          size="large" 
        />
      </div>
    );
  }

  if (!trackingInfo) {
    return <p>No tracking information available.</p>;
  }

  // Adjust statusMap if necessary
  const statusMap = {
    'pending pickup': 20,
    'in transit': 50,
    'out for delivery': 80,
    'delivered': 100,
  };

  // Determine the progress based on status
  const progress = statusMap[trackingInfo.status.toLowerCase()] || 0;

  // Icons for different steps
  const icons = {
    'pending pickup': <FaBox />,
    'in transit': <FaInfoCircle />,
    'out for delivery': <FaMapMarkerAlt />,
    'delivered': <FaCheckCircle />,
    'default': <FaHourglass />,
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking Information</Title>
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
              <Descriptions.Item label="AWB Number">{trackingInfo.awb_number}</Descriptions.Item>
              <Descriptions.Item label="Order Number">{trackingInfo.order_number}</Descriptions.Item>
              <Descriptions.Item label="Order ID">{trackingInfo.order_id}</Descriptions.Item>
              <Descriptions.Item label="Courier ID">{trackingInfo.courier_id}</Descriptions.Item>
              <Descriptions.Item label="Status">{trackingInfo.status}</Descriptions.Item>
              <Descriptions.Item label="Created">{trackingInfo.created}</Descriptions.Item>
              {authUser.role === 'admin' && (
                <>
                  <Descriptions.Item label="Warehouse ID">{trackingInfo.warehouse_id}</Descriptions.Item>
                  {trackingInfo.rto_warehouse_id && (
                    <Descriptions.Item label="RTO Warehouse ID">{trackingInfo.rto_warehouse_id}</Descriptions.Item>
                  )}
                </>
              )}
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} sm={16}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <Title level={4}>Shipment Progress</Title>
            <Progress 
              percent={progress} 
              status={progress === 100 ? 'success' : 'active'} 
              strokeColor={progress === 100 ? '#52c41a' : '#1890ff'} 
              showInfo={true}
            />
          </Card>

          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical" current={trackingInfo.history.length - 1}>
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
                  icon={icons[event.status_code.toLowerCase()] || icons.default}
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>

      <Divider style={{ marginTop: '40px' }} />

      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f2f5' }}>
        <p style={{ margin: 0 }}>Powered by <strong>ShipHere</strong></p>
        <div style={{ marginTop: '10px' }}>
          <a href="https://www.facebook.com/profile.php?id=61564399084185" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com/shiphere" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaTwitter size={20} />
          </a>
          <a href="https://www.linkedin.com/company/shiphere" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaLinkedinIn size={20} />
          </a>
          <a href="https://www.instagram.com/ship_here_/?igsh=MWxmZzgzbTNzcHk0dA%3D%3D" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
