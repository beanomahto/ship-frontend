import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Descriptions, Spin, message, Row, Col, Divider, Typography, Steps, Progress } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Step } = Steps;
export const TrackingContext = createContext();

export const useTrackingContext = () => {
  return useContext(TrackingContext);
};

export const TrackingContextProvider = ({ children }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const {shippingPartner, awb} = useParams();
//   console.log(params);

    const fetchTrackingInfo = async (shippingPartner,awb) => {
      try {
        const splitPartners = shippingPartner?.replace(/\s+/g, '');
        //console.log(splitPartners);
        
        const fShipPartner = ['Ekart', 'BlueDart', 'DTDC', 'Shadowfax','Delhivery'].includes(splitPartners);
        //console.log(fShipPartner);
        
       if (fShipPartner) {
        const response = await axios.post(`https://backend.shiphere.in/api/smartship/tracksmartshiporder`,{
          awb
        });
        setTrackingInfo(response.data);
        //console.log(response.data);
        
       } else {
        const response = await axios.get(`https://backend.shiphere.in/api/${shippingPartner?.replace(/\s+/g, '')}/track/${awb}`);

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
          //console.log(data);
          //console.log(response)
        } else {
          setTrackingInfo(response.data.trackingInfo);
        }
       }
      } catch (error) {
        console.error('API error:', error);
        message.error('Error fetching tracking information.');
      } finally {
        setLoading(false);
      }
    };
 
  useEffect(() => {
    fetchTrackingInfo();
  }, [shippingPartner,awb]);

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
  return (
    <TrackingContext.Provider
      value={{ trackingInfo, setTrackingInfo, fetchTrackingInfo }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
