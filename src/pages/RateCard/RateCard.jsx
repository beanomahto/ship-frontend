import React from 'react';
import { Table, Typography, Divider } from 'antd';
import { Helmet } from 'react-helmet';
import './ratecard.css';
import useShippingRateCard from '../../hooks/useGetRateCard';
import BD from '../../utils/bluedart.png';
import DLVRY from '../../utils/delhivery.png';
import AS from '../../utils/amazon-shipping.png';
import EE from '../../utils/ecom-express.png';
import XPB from '../../utils/xpressbees.png';
import Ekart from '../../utils/ekart.jpeg'
import Dtdc from '../../utils/dtdc.png'
import SF from '../../utils/shadowFax.png'

const { Title, Paragraph } = Typography;

const partnerImages = {
  'Blue Dart': BD,
  'Delhivery': DLVRY,
  'Amazon Shipping': AS,
  'Ecom Express': EE,
  'Xpressbees': XPB,
  'Ekart': Ekart,
  'DTDC': Dtdc,
  'Shadowfax':SF
};

const RateCard = () => {
  const { data } = useShippingRateCard();
  const pricing = data?.pricing;

  // Define your zone titles and descriptions
  const zoneA = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Zone A</h4>
      <p>within city</p>
      <span style={{ marginTop: '5px' }}>Forward | RTO</span>
    </div>
  );

  const zoneB = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Zone B</h4>
      <p>within State</p>
      <span style={{ marginTop: '5px' }}>Forward | RTO</span>
    </div>
  );

  const zoneC = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Zone C</h4>
      <p>Metro to Metro</p>
      <span style={{ marginTop: '5px' }}>Forward | RTO</span>
    </div>
  );

  const zoneD = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Zone D</h4>
      <p>Rest of India</p>
      <span style={{ marginTop: '5px' }}>Forward | RTO</span>
    </div>
  );

  const zoneE = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Zone E</h4>
      <p>North East J&K</p>
      <span style={{ marginTop: '5px' }}>Forward | RTO</span>
    </div>
  );

  const COD = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>COD</h4>
      <span style={{ marginTop: '5px' }}>Charges/COD%</span>
    </div>
  );

  // Define the table columns
  const columns = [
    {
      title: 'Couriers Name',
      dataIndex: 'deliveryPartner',
      render: (deliveryPartner) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={partnerImages[deliveryPartner]}
            alt={deliveryPartner}
            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '8px', border: '2px solid #ddd' }}
          />
          <div style={{ fontFamily: 'sans-serif', fontSize: '1rem', marginLeft: '1rem' }}>{deliveryPartner}</div>
        </div>
      ),
    },
    {
      title: 'Weight Category',
      dataIndex: 'weightCategory',
      render: (weightCategory) => (
        <div style={{ fontFamily: 'sans-serif', fontSize: '1rem', textAlign: 'center' }}>
          {weightCategory}
        </div>
      ),
    },
    {
      title: zoneA,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{zones?.A?.forward || 'N/A'} || {zones?.A?.rto}</span>
        </div>
      ),
    },
    {
      title: zoneB,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{zones?.B?.forward || 'N/A'} || {zones?.B?.rto}</span>
        </div>
      ),
    },
    {
      title: zoneC,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{zones?.C?.forward || 'N/A'} || {zones?.C?.rto}</span>
        </div>
      ),
    },
    {
      title: zoneD,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{zones?.D?.forward || 'N/A'} || {zones?.D?.rto}</span>
        </div>
      ),
    },
    {
      title: zoneE,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{zones?.E?.forward || 'N/A'} || {zones?.E?.rto}</span>
        </div>
      ),
    },
    {
      title: COD,
      dataIndex: 'zones',
      render: (zones, { codFixed, codPercentage }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <span>{codFixed || 'N/A'} || {codPercentage || 'N/A'}</span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={""} />
        <title>Rate Card</title>
      </Helmet>
      <Table pagination={false} scroll={{ y: 350 }} className='table' dataSource={pricing} columns={columns} />
      <Divider />
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
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
            <li>For any queries, a ticket should be raised via support@shipshed.in.</li>
            <li>Refer to the detailed terms and conditions for further information.</li>
          </ul>
        </Paragraph>
      </div>
    </div>
  );
};

export default RateCard;
