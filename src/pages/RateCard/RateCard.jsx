import React, { useEffect } from 'react'
import { Button, Table,Typography, Divider } from 'antd';
import { Link } from 'react-router-dom';
const { Title, Text, Paragraph } = Typography;
import './ratecard.css'
import useShippingRateCard from '../../hooks/useGetRateCard';
// import useGetRateCard from '../../hooks/useGetRateCard';
import BD from '../../utils/bluedart.png';
import DLVRY from '../../utils/delhivery.png';
import AS from '../../utils/amazon-shipping.png';
import EE from '../../utils/ecom-express.png';
import XPB from '../../utils/xpressbees.png';

const partnerImages = {
  'Blue Dart': BD,
  'Delhivery': DLVRY,
  'Amazon Shipping': AS,
  'Ecom Express': EE,
  'Xpressbees': XPB,
};


const RateCard = () => {
  const {data} = useShippingRateCard();
  console.log(data);
  const pricing = data?.pricing;
  console.log(pricing);
    const zoneA = <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} >
        <h4>Zone A</h4>
        <p>within city</p>
        <span style={{marginTop:'5px'}} >Forward | RTO</span>
    </div>
    const zoneB = <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} >
        <h4>Zone B</h4>
        <p>within State</p>
        <span style={{marginTop:'5px'}} >Forward | RTO</span>
    </div>
    const zoneC = <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} >
        <h4>Zone C</h4>
        <p>Metro to Metro</p>
        <span style={{marginTop:'5px'}} >Forward | RTO</span>
    </div>
    const zoneD = <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} >
        <h4>Zone D</h4>
        <p>Rest of India</p>
        <span style={{marginTop:'5px'}} >Forward | RTO</span>
    </div>
    const zoneE = <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}} >
        <h4>Zone E</h4>
        <p>North East J&K</p>
        <span style={{marginTop:'5px'}} >Forward | RTO</span>
    </div>
    const COD = <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} >
      <h4>COD</h4>
        <span style={{marginTop:'5px'}} >Charges/COD%</span>
    </div>
    const newOrders = [
        {
          title: 'Couriers Name',
          dataIndex: 'deliveryPartner',
          render: (deliveryPartner) => (
            <div style={{display:'flex', alignItems:'center'}}>
             <img
                      src={partnerImages[deliveryPartner]}
                      alt={deliveryPartner}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px', border:'2px solid #ddd' }}
                    />
              <div style={{fontFamily:'sans-serif', fontSize:'1rem', marginLeft:'1rem'}} >{deliveryPartner}</div>
            </div>
          ),
        },
        {
          title: 'Weight Category',
          dataIndex: 'weightCategory',
          render: (weightCategory) => (
            <>
              <div style={{fontFamily:'sans-serif', fontSize:'1rem',position:'absolute', left:'4rem'}} >{weightCategory}</div>
            </>
          ),
        },
        {
          title: zoneA,
          dataIndex: 'A',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}} >{pricing.zones.A}</div>
            </>
          ),

        },
        {
          title: zoneB,
          dataIndex: 'B',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}} >{pricing.zones.B}</div>
            </>
          ),
        },
        {
          title: zoneC,
          dataIndex: 'C',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}} >{pricing.zones.C}</div>
            </>
          ),
        },
        {
          title: zoneD,
          dataIndex: 'D',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}} >{pricing.zones.D}</div>
            </>
          ),
        },
        {
          title: zoneE,
          dataIndex: 'E',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}}>{pricing.zones.E}</div>
            </>
          ),
        },
        {
          title: COD,
          dataIndex: 'codPercentage',
          render: (text, pricing) => (
            <>
              <div style={{display:'flex', justifyContent:'center', fontFamily:'sans-serif', fontSize:'1rem'}} >{pricing.codFixed} || {pricing.codPercentage}</div>
            </>
          ),
        },
    ];
  return (
    <div>
        <Table pagination={false} scroll={{ y: 350 }} className='table' dataSource={pricing} columns={newOrders} />
        <Divider />
        <div style={{backgroundColor:'white', padding:'2rem', borderRadius:'1rem'}} >
        <Title level={4}>Terms and Conditions</Title>
      <Paragraph>
        <ul>
          <li>The above prices are exclusive of GST.</li>
          <li>Freight charges are based on the higher value between dead/dry weight and volumetric weight.</li>
          <li>Volumetric weight is calculated as (Length x Breadth x Height) / 5000 for all courier companies. (Dimensions should be taken in centimeters and divided by the denominator to get the weight in kilograms).</li>
          <li>COD charges are determined by either fixed COD charges or a percentage of the order value, whichever is higher.</li>
          <li>Prices are subject to change based on fuel surcharges and courier company base rates.</li>
          <li>Shipway will not assist or be held responsible for shipping goods categorized as prohibited, dangerous, or restricted.</li>
          <li>The sender is liable for any costs, charges, and fees incurred in returning, storing, or disposing of an undelivered shipment.</li>
          <li>If a shipment cannot be delivered, cleared through customs, or returned, it may be transferred.</li>
          <li>For any queries, a ticket should be raised via support@shipshed.com.</li>
          <li>Refer to the detailed terms and conditions for further information.</li>
        </ul>
      </Paragraph>
        </div>
    </div>
  )
}

export default RateCard