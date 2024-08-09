import { Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import UploadWeightDespensory from './UploadWeightDespensory';
import CustomButton from '../../../components/Button/Button';
import ActionRequired from './ActionRequired';
import OpenWeightDispensory from './OpenWeightDispensory';
import SearchSellerModal from './SearchSellerModal';
import TakeActionModal from './TakeActionModal';
import ClosedWeightDispensory from './ClosedWeightDispensory';
import { useAuthContext } from '../../../context/AuthContext';
import { Helmet } from 'react-helmet';

const { TabPane } = Tabs;

const WeightDispensory = () => {
  const { authUser } = useAuthContext();
  const [weightDispensory, setWeightDispensory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [takeActionModalVisible, setTakeActionModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('tab1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({ _id: null, name: '' });

  useEffect(() => {
    const fetchWeightDespensory = async () => {
      try {
        const res = await fetch('https://backend-9u5u.onrender.com/api/weightdiscrepancy/getweightdiscrepancy', {
          headers: {
              Authorization: localStorage.getItem('token'),
          },
      });
        const data = await res.json();
        setWeightDispensory(data);
      } catch (error) {
        console.error("Failed to fetch weight discrepancy data:", error);
      }
    };
    fetchWeightDespensory();
  }, []);
  console.log(selectedRowData);
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      if (selectedRows.length > 0) {
        const { _id, productName } = selectedRows[0];
        setSelectedRowData({ _id, productName });
      } else {
        setSelectedRowData({ _id: null, productName: '' });
      }
    },
  };

  const tabsData = [
    {
      key: 'tab1',
      tab: 'Action Required',
      Component: ActionRequired,
      dataSource: weightDispensory.data,
    },
    {
      key: 'tab2',
      tab: 'Open',
      Component: OpenWeightDispensory,
      dataSource: weightDispensory.data,
    },
    {
      key: 'tab3',
      tab: 'Closed',
      Component: ClosedWeightDispensory,
      dataSource: weightDispensory.data,
    },
    {
      key: 'tab4',
      tab: 'All Dispute',
      Component: OpenWeightDispensory,
      dataSource: weightDispensory.data,
    },
  ];

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);
  const showTakeActionModal = () => setTakeActionModalVisible(true);
  const closeTakeActionModal = () => setTakeActionModalVisible(false);

  return (
    <div>
         <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Weight Despensory</title>
            </Helmet>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }} className="addorder">
        {authUser.role === 'company' && <Button onClick={showTakeActionModal}>Take Action</Button>}
        <TakeActionModal
          visible={takeActionModalVisible}
          onClose={closeTakeActionModal}
          discrepancyId={selectedRowData._id}
          productName={selectedRowData.productName}
        />
        <CustomButton onClick={showModal}>Upload Weight</CustomButton>
        <UploadWeightDespensory visible={modalVisible} onClose={closeModal} />
        <CustomButton onClick={showSearchModal}>Search Seller</CustomButton>
        <SearchSellerModal weightDispensory={weightDispensory} visible={searchModalVisible} onClose={closeSearchModal} />
      </div>
      <Tabs defaultActiveKey='tab1' size='large' onChange={setCurrentTab}>
        {tabsData.map(tab => (
          <TabPane key={tab.key} tab={tab.tab}>
            {tab.Component ? (
              <tab.Component
                dataSource={tab.dataSource}
                rowSelection={rowSelection}
              />
            ) : (
              <span>No component for this tab</span>
            )}
          </TabPane>
        ))}
      </Tabs>
      <div style={{backgroundColor:'#fff', borderRadius:'34px', marginTop:'2rem', fontFamily:'Poppins', padding:'2rem', fontWeight:'500'}} >
      Disputes can be raised within 7 days of uploading the discrepancy. After that, it will be auto-accepted
      </div>
    </div>
  );
};

export default WeightDispensory;
