import React, { useState } from 'react';
import { Steps, Progress } from 'antd';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { PiHandWithdrawThin } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";

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
      <Steps current={current} onChange={onChange} direction="horizontal" icon={<HiOutlineClipboardDocumentCheck/>} >
        <Step title="Order Received" description="Your order has been received."  icon={<PiHandWithdrawThin/>} />
        <Step title="Order Packed" description="Your order has been packed."  icon={<CiDeliveryTruck/>} />
        <Step title="In Transit" description="Your order is on the way."  icon={<HiOutlineClipboardDocumentCheck/>} />
        <Step title="Out for Delivery" description="Your order is out for delivery." icon={<FaTruckFast/>} />
        <Step title="Delivered" description="Your order has been delivered."  icon={<IoLocationOutline/>} />
      </Steps>
    </div>
  );
};

export default Tracking;
