import React, { useState } from 'react';
import { Steps, Progress } from 'antd';

const { Step } = Steps;

const Tracking = () => {
  const [current, setCurrent] = useState(0);
  const totalSteps = 5;
  const progressPercentage = (current / (totalSteps - 1)) * 100;
  const onChange = (currentStep) => {
    setCurrent(currentStep);
  };

  return (
    <div style={{ padding: '20px', backgroundColor:'#fff' }}>
      <Progress percent={progressPercentage} showInfo={false} style={{ marginBottom: '20px' }} />
      <Steps current={current} onChange={onChange} direction="horizontal">
        <Step title="Order Received" description="Your order has been received." />
        <Step title="Order Packed" description="Your order has been packed." />
        <Step title="In Transit" description="Your order is on the way." />
        <Step title="Out for Delivery" description="Your order is out for delivery." />
        <Step title="Delivered" description="Your order has been delivered." />
      </Steps>
    </div>
  );
};

export default Tracking;
