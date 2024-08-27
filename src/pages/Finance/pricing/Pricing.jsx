import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import UploadPricingModel from './UploadPricingModel';
import CustomButton from '../../../components/Button/Button';
import { Helmet } from 'react-helmet';
import UploadStandardPricingModel from './UploadStandardPricing';
// import './ratecard.css'

const Pricing = () => {
  const [pricing, setPricing] = useState([]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://backend.shiphere.in/api/shipping/rateCard', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await res.json();
        setPricing(data?.pricing);
      } catch (error) {
        console.error("Failed to fetch pricing data:", error);
      }
    };
    fetchPricing();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [standardModalVisible, setStandardModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showSModal = () => setStandardModalVisible(true);
  const closeSModal = () => setStandardModalVisible(false);

  // Define your zone titles and descriptions
  const zoneA = <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Zone A</h4>
    <p>within city</p>
    <span style={{ marginTop: '5px' }}>Forward | RTO</span>
  </div>;

  const zoneB = <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Zone B</h4>
    <p>within State</p>
    <span style={{ marginTop: '5px' }}>Forward | RTO</span>
  </div>;

  const zoneC = <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Zone C</h4>
    <p>Metro to Metro</p>
    <span style={{ marginTop: '5px' }}>Forward | RTO</span>
  </div>;

  const zoneD = <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Zone D</h4>
    <p>Rest of India</p>
    <span style={{ marginTop: '5px' }}>Forward | RTO</span>
  </div>;

  const zoneE = <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <h4>Zone E</h4>
    <p>North East J&K</p>
    <span style={{ marginTop: '5px' }}>Forward | RTO</span>
  </div>;

  const COD = <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h4>COD</h4>
    <span style={{ marginTop: '5px' }}>Charges/COD%</span>
  </div>;

  // Define the table columns
  const columns = [
    {
      title: 'Couriers Name',
      dataIndex: 'deliveryPartner',
      render: (text, zones) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>{zones.deliveryPartner}</div>
        </>
      ),
    },
    {
      title: 'Weight Category',
      dataIndex: 'weightCategory',
      render: (text) => (
        <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          {text}
        </div>
      ),
    },
    {
      title: zoneA,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <div>{zones?.A?.forward || 'N/A'} || {zones?.E?.rto || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: zoneB,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <div>{zones?.B?.forward || 'N/A'} || {zones?.E?.rto || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: zoneC,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <div>{zones?.C?.forward || 'N/A'} || {zones?.E?.rto || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: zoneD,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <div>{zones?.D?.forward || 'N/A'} || {zones?.E?.rto || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: zoneE,
      dataIndex: 'zones',
      render: (zones) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>
          <div>{zones?.E?.forward || 'N/A'} || {zones?.E?.rto || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: COD,
      dataIndex: 'codFixed',
      render: (text, zones) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem' }}>{zones.codFixed} || {zones.codPercentage}</div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keyword' content={""} />
        <title>Pricing</title>
      </Helmet>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: '1rem'
      }} className="addorder">
        <CustomButton onClick={showModal}>Upload Custom Pricing</CustomButton>
        <UploadPricingModel visible={modalVisible} onClose={closeModal} />
        <CustomButton onClick={showSModal}>Upload Standard Pricing</CustomButton>
        <UploadStandardPricingModel visible={standardModalVisible} onClose={closeSModal} />
      </div>
      <Table className='table' scroll={{ y: 350 }} dataSource={pricing} columns={columns} />
    </div>
  );
};

export default Pricing;
