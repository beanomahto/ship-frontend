import React from 'react'
import { Card, Descriptions, Spin, message, Row, Col, Divider, Typography, Steps, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { Step } = Steps;

const EcomData = ({trackingInfo, steps}) => {
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

          <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Title level={4}>Tracking History</Title>
            <Steps direction="vertical">
              {steps.map((step, index) => (
                <Step 
                  key={index}
                  icon={getStepIcon(step.status)}
                  description={
                    <>
                      <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{trackingInfo?.scan}</p>
                      {/* <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{step.tracking_status}</p>
                      <p style={{ color: index === steps.length - 1 ? '#1890ff' : '#000' }}>{step.updated_on}</p> */}
                    </>
                  }
                />
              ))}
            </Steps>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EcomData
