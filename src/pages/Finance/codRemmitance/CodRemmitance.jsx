import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import RemmitanceData from './RemmitanceData';
import './codremmitance.css';
import UploadCodRemittance from './UploadCodRemittance';
import SearchSellerModal from './SearchSellerModal';
import moment from 'moment';
import CustomButton from '../../../components/Button/Button';
import { useAuthContext } from '../../../context/AuthContext';
import { Helmet } from 'react-helmet';

const CodRemmitance = () => {
  const { authUser } = useAuthContext();
  const [remittanceData, setRemittanceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useEffect(() => {
    const fetchRemittance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://backend-9u5u.onrender.com/api/remittance/getremittance', {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await res.json();
        setRemittanceData(data);
      } catch (error) {
        console.error("Failed to fetch remittance data:", error);
      }
    };
    fetchRemittance();
  }, []);

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);
  console.log(remittanceData.remittances
  );
  const newOrders = [
    ...(authUser?.role === 'admin' ? [{
      title: 'Seller',
      dataIndex: 'adminData',
      render: (text, remittance) => <span>{remittance.seller.email}</span>,
    }] : []),
    {
      title: 'Generated Date',
      dataIndex: 'generatedDate',
      render: (text, remittance) => moment(remittance?.remittances?.createdAt).format('DD-MM-YYYY'),
    },
    {
      title: 'Ref ID',
      dataIndex: 'refId',
    },
    {
      title: 'Generated COD',
      dataIndex: 'generatedCOD',
    },
    {
      title: 'ECOD Charge',
      dataIndex: 'ecodCharge',
    },
    {
      title: 'Net COD Amt',
      dataIndex: 'netCODAmt',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
    },
    {
      title: 'Transaction Detail',
      dataIndex: 'transactionDetail',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      render: (text, data) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem', marginRight: '3rem' }}>{data.count}</div>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];
  console.log(remittanceData);
  return (
    <div>
         <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>COD Remmitance</title>
            </Helmet>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: '1rem'
      }} className="addorder">
        <CustomButton onClick={showModal}>Upload Remittance</CustomButton>
        <UploadCodRemittance visible={modalVisible} onClose={closeModal} />
        <CustomButton onClick={showSearchModal}>Search Seller</CustomButton>
        <SearchSellerModal visible={searchModalVisible} remittanceData={remittanceData} onClose={closeSearchModal} />
      </div>
      <RemmitanceData remittanceData={remittanceData.remittances} />
      <Table
        className='table'
        scroll={{ y: 350 }}
        columns={newOrders}
        dataSource={remittanceData.remittances}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default CodRemmitance;
