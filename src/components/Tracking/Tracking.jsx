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
  const [steps, setSteps] = useState([]);
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
          updateSteps(data);
        } else {
          setTrackingInfo(response.data.trackingInfo);
          updateSteps(response.data.trackingInfo);
        }
      } catch (error) {
        console.error('API error:', error);
        message.error('Error fetching tracking information.');
      } finally {
        setLoading(false);
      }
    };

    const updateSteps = (newTrackingInfo) => {
      setSteps(prevSteps => [
        ...prevSteps,
        {
          status: newTrackingInfo.status,
          tracking_status: newTrackingInfo.tracking_status,
          updated_on: newTrackingInfo.updated_on
        }
      ]);
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

  const totalSteps = 5; 
  const progressPercentage = ((steps.length / totalSteps) * 100).toFixed(2);

  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking Information</Title>
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
              <Descriptions.Item label="AWB Number">{trackingInfo.awb_number}</Descriptions.Item>
              <Descriptions.Item label="Order ID">{trackingInfo.orderid}</Descriptions.Item>
              <Descriptions.Item label="Destination">{trackingInfo.destination}</Descriptions.Item> 
              <Descriptions.Item label="Pincode">{trackingInfo.pincode}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} sm={16}>
          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <Title level={4}>Shipment Progress</Title>
            <Progress 
              percent={parseFloat(progressPercentage)} 
              status={parseFloat(progressPercentage) === 100 ? 'success' : 'active'} 
              strokeColor={parseFloat(progressPercentage) === 100 ? '#52c41a' : '#1890ff'} 
              showInfo={true}
            />
          </Card>

          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical">
              {steps.map((step, index) => (
                <Step 
                  key={index}
                  description={
                    <>
                      <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{step.status}</p>
                      <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{step.tracking_status}</p>
                      <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{step.updated_on}</p>
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
