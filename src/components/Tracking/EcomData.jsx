import React from 'react';
import { Card, Descriptions, Row, Col, Typography, Steps, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useOrderContext } from '../../context/OrderContext';
import { useParams } from 'react-router-dom';

const { Title } = Typography;
const { Step } = Steps;

const EcomData = ({ trackingInfo, steps }) => {
  console.log(trackingInfo);
  const {orders,fetchOrders} = useOrderContext()
  const {awb} = useParams()
  console.log(awb);
  
  const totalSteps = 5;
  const progressPercentage = ((steps?.length / totalSteps) * 100).toFixed(2);

  const getStepIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in transit':
        return <SyncOutlined style={{ color: '#1890ff' }} spin />;
      case 'out for delivery':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'shipped':
        return <CheckOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const parseScans = (scans) => {
    const scanEntries = scans?.split(/\d{2}\s\w{3},\s\d{4},\s\d{2}:\d{2}/g).filter(entry => entry.trim() !== "");
    const dateMatches = scans?.match(/\d{2}\s\w{3},\s\d{4},\s\d{2}:\d{2}/g) || [];

    return scanEntries.map((entry, index) => {
      const date = dateMatches[index] || 'Unknown Date';

      const entryParts = entry.split('-').map(part => part.trim());

      const name = entryParts[entryParts.length - 2] + " " + entryParts[entryParts.length - 1];
      const status = entryParts[0];
      const city = entryParts[2];

      return {
        date,
        status,
        name,
        city
      };
    });
  };

  const parsedScans = parseScans(trackingInfo.scans);
  const shippedOrders = orders?.orders?.filter(order => order.status === 'Shipped');
  console.log(shippedOrders);
  const currentOrder = shippedOrders?.filter(
    (order) => order?.awb === trackingInfo?.awb_number
  );
  console.log(currentOrder);
  
  return (
    <div>
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

          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical">
              {parsedScans.map((scan, index) => (
                <Step 
                  key={index}
                  icon={getStepIcon(scan.status)}
                  title={scan.date}
                  description={
                    <>
                      <p><strong>Status:</strong> {scan.status}</p>
                      <p><strong>City:</strong> {scan.city}</p>
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
