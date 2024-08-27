import React, { useEffect, useState } from 'react';
import { Steps, Progress } from 'antd';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import {useParams} from 'react-router-dom'
import { PiHandWithdrawThin } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import xml2js from 'xml2js';
const { Step } = Steps;

const Tracking = () => {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState({});
  const {value} = useParams()
  console.log(value);
  const totalSteps = 5;
  const progressPercentage = (current / (totalSteps - 1)) * 100;
  const onChange = (currentStep) => {
    setCurrent(currentStep);
  };
  
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ecomExpress/track/${value}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const jsonResponse = await response.json();
        console.log('JSON response:', jsonResponse);
  
        // Extract the XML string from the JSON object
        const xml = jsonResponse.data;
        if (!xml.trim().startsWith('<?xml')) {
          throw new Error('Extracted data is not valid XML');
        }
  
        // Parse the XML string
        const result = await xml2js.parseStringPromise(xml);
        console.log('Parsed XML:', result); // Log the parsed XML
  
        // Check if the XML contains relevant data
        if (!result['ecomexpress-objects'] || !result['ecomexpress-objects'].length) {
          throw new Error('No tracking information found in XML.');
        }
  
        // Example handling of steps - adjust this based on actual XML structure
        const steps = result['ecomexpress-objects']?.[0]?.step || []; // Adjust if necessary
        if (!steps.length) {
          throw new Error('No steps found in tracking information.');
        }
  
        // Set the current step based on the tracking data
        setCurrent(steps.findIndex(step => step.title === jsonResponse.status));
  
        setData(result); // Store the parsed data
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };
  
    fetchTrackingData();
  }, [value]);
  
  
  
  console.log(data);
  
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
