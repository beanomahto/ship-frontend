import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, message, Row, Col, Divider, Typography, Steps, Progress } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import EcomData from './EcomData';
import Footer from './Footer';
import FShipData from './FShipData';
import Xressbees from './Xressbees';

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
        const splitPartners = shippingPartner.replace(/\s+/g, '');
        console.log(splitPartners);
        
        const fShipPartner = ['Ekart', 'BlueDart', 'DTDC', 'Shadowfax','Delhivery'].includes(splitPartners);
        console.log(fShipPartner);
        
       if (fShipPartner) {
        const response = await axios.post(`http://localhost:5000/api/fship/trackingHistory`,{
          waybill:awb
        });
        setTrackingInfo(response.data);
        console.log(response.data);
        
       } else {
        const response = await axios.get(`http://localhost:5000/api/${shippingPartner.replace(/\s+/g, '')}/track/${awb}`);

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
          
          updateSteps(data);
        } else {
          setTrackingInfo(response.data.trackingInfo);
          updateSteps(response.data.trackingInfo);
        }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#ffffff' }}>
      {
        shippingPartner && shippingPartner.toLowerCase() === 'ecom express' ? (
          <EcomData trackingInfo={trackingInfo} steps={steps} />
        ) : (
          shippingPartner && shippingPartner === 'Xpressbees' ? (
            <Xressbees trackingInfo={trackingInfo} />
          ) : (
            <FShipData trackingInfo={trackingInfo} />
          )
        )
      }
      </div>
      <Footer />
    </div>
  );
};

export default Tracking;
