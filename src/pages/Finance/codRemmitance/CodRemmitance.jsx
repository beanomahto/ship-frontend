import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Input } from 'antd';
import RemmitanceData from './RemmitanceData';
import './codremmitance.css';
import UploadCodRemittance from './UploadCodRemittance';
import SearchSellerModal from './SearchSellerModal';
import moment from 'moment';
import CustomButton from '../../../components/Button/Button';
import { useAuthContext } from '../../../context/AuthContext';
import { Helmet } from 'react-helmet';
import EarlyCodPopup from './EarlyCodPopup';
import { CSVLink } from 'react-csv';

const { Search } = Input;

const CodRemmitance = () => {
  const { authUser } = useAuthContext();
  const [remittanceData, setRemittanceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [earlyCodVisible, setEarlyCodVisible] = useState(false); 
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchRemittance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://backend.shiphere.in/api/remittance/getremittance', {
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
  const showEarlyCodModal = () => setEarlyCodVisible(true); 
  const closeEarlyCodModal = () => setEarlyCodVisible(false); 

  // Function to check if any field contains the search text
  const matchesSearchText = (record, searchText) => {
    const lowercasedText = searchText.toLowerCase();
    return (
      moment(record?.remittances?.createdAt).format('DD-MM-YYYY').includes(lowercasedText) ||
      (record?.refId?.toLowerCase().includes(lowercasedText)) ||
      (record?.generatedCOD?.toString().toLowerCase().includes(lowercasedText)) ||
      (record?.ecodCharge?.toString().toLowerCase().includes(lowercasedText)) ||
      (record?.netCODAmt?.toString().toLowerCase().includes(lowercasedText)) ||
      (record?.amountPaid?.toString().toLowerCase().includes(lowercasedText)) ||
      (record?.transactionDetail?.toLowerCase().includes(lowercasedText)) ||
      (record?.count?.toString().toLowerCase().includes(lowercasedText)) ||
      (record?.status?.toLowerCase().includes(lowercasedText))
    );
  };

  // Filtered data based on the search text across all fields
  const filteredData = useMemo(() => {
    return remittanceData.remittances?.filter((record) => matchesSearchText(record, searchText)) || [];
  }, [remittanceData.remittances, searchText]);

  // Function to convert data to CSV format
  const generateCsvData = () => {
    return filteredData.map(record => ({
      'Generated Date': moment(record?.remittances?.createdAt).format('DD-MM-YYYY'),
      'Ref ID': record.refId,
      'Generated COD': record.generatedCOD,
      'ECOD Charge': record.ecodCharge,
      'Net COD Amt': record.netCODAmt,
      'Amount Paid': record.amountPaid,
      'Transaction Detail': record.transactionDetail,
      'Count': record.count,
      'Status': record.status,
    }));
  };

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
        <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: '1rem', marginRight: '3rem' }}>{data.count}</div>
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
        <title>COD Remittance</title>
      </Helmet>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <CustomButton onClick={showModal}>Upload Remittance</CustomButton>
        <UploadCodRemittance visible={modalVisible} onClose={closeModal} />
        <CustomButton onClick={showSearchModal}>Search Seller</CustomButton>
        <SearchSellerModal visible={searchModalVisible} remittanceData={remittanceData} onClose={closeSearchModal} />
        <Button style={{ borderRadius: '34px' }} onClick={showEarlyCodModal}>Early COD</Button>
      </div>  
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <Search
          placeholder="Search across all fields"
          onSearch={value => setSearchText(value)}
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
        />
        <Button onClick={() => setSearchText('')} style={{ borderRadius: '34px' }}>
          X
        </Button>
        {filteredData.length > 0 && (
          <CSVLink
            data={generateCsvData()}
            filename={"filtered_remittance_data.csv"}
            className="ant-btn ant-btn-primary"
          >
            <Button style={{ borderRadius: '34px' }}>Download CSV</Button>
          </CSVLink>
        )}
      </div>
      <RemmitanceData remittanceData={filteredData} />
      <Table
        className='table'
        scroll={{ y: 350 }}
        columns={newOrders}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
      />
      <EarlyCodPopup visible={earlyCodVisible} onClose={closeEarlyCodModal} />
    </div>
  );
  
};

export default CodRemmitance;
