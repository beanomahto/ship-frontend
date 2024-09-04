import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, message, Row, Col, Divider, Typography, Steps, Progress } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const { Title } = Typography;
const { Step } = Steps;

const Tracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const { shippingPartner, awb } = useParams();

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await axios.get(`https://backend.shiphere.in/api/${shippingPartner.replace(/\s+/g, '')}/track/${awb}`);
        
        if (shippingPartner.toLowerCase() === 'ecom express') {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data.data, "application/xml");
          const fields = xmlDoc.getElementsByTagName('field');
          const data = {};
          Array.from(fields).forEach(field => {
            const name = field.getAttribute('name');
            const value = field.textContent.trim();
            data[name] = value;
          });
          setTrackingInfo(data);
          console.log(data);
        } else {
          setTrackingInfo(response.data.trackingInfo);
          setTrackingHistory(response.data.trackingInfo.trackingHistory || []);
        }
      } catch (error) {
        console.error('API error:', error);
        message.error('Error fetching tracking information.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [awb, shippingPartner]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <Spin 
          tip="Loading Tracking Information..." 
          size="large" 
        />
      </div>
    );
  }

  if (!trackingInfo) {
    return <p>No tracking information available.</p>;
  }

  const progress = (trackingHistory.length / 3) * 100; // Assuming 3 is the maximum steps; adjust based on your data

  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking Information</Title>
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
              <Descriptions.Item label="AWB Number">{trackingInfo.awb_number}</Descriptions.Item>
              <Descriptions.Item label="Order ID">{trackingInfo.orderid}</Descriptions.Item>
              <Descriptions.Item label="Actual Weight">{trackingInfo.actual_weight}</Descriptions.Item>
              <Descriptions.Item label="Origin">{trackingInfo.origin}</Descriptions.Item>
              <Descriptions.Item label="Destination">{trackingInfo.destination}</Descriptions.Item>
              <Descriptions.Item label="Current Location Name">{trackingInfo.current_location_name}</Descriptions.Item>
              <Descriptions.Item label="Current Location Code">{trackingInfo.current_location_code}</Descriptions.Item>
              <Descriptions.Item label="Customer">{trackingInfo.customer}</Descriptions.Item>
              <Descriptions.Item label="Pincode">{trackingInfo.pincode}</Descriptions.Item>
              <Descriptions.Item label="City">{trackingInfo.city}</Descriptions.Item>
              <Descriptions.Item label="State">{trackingInfo.state}</Descriptions.Item>
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
            <Steps direction="vertical" current={trackingHistory.length - 1}>
              {trackingHistory.map((step, index) => (
                <Step 
                  key={index} 
                  title={step.tracking_status} 
                  description={
                    <>
                      <p>{step.location}</p>
                      <p>{step.updated_time}</p>
                    </>
                  }
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
