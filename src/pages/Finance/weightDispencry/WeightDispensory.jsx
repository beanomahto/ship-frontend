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

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = weightDispensory?.data?.find(item => item._id === newSelectedRowKeys[0]);
    setSelectedRowData(selectedData || { _id: null, name: '' });
  };
  
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchWeightDespensory = async () => {
    try {
      const res = await fetch('https://backend.shiphere.in/api/weightdiscrepancy/getweightdiscrepancy', {
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

  useEffect(() => {
    fetchWeightDespensory();
  }, []);

  const openNumber = weightDispensory?.data?.filter((amt) => amt.status === 'open');
  const closedNumber = weightDispensory?.data?.filter((amt) => amt.status === 'closed');
  const actionRequiredNumber = weightDispensory?.data?.filter((amt) => amt.status === 'action required');
  
  const dataSourceWithKeys = weightDispensory?.data?.map((data) => ({
    ...data,
    key: data._id,
  })) || [];
  
//console.log(dataSourceWithKeys);

  const tabsData = [
    {
      key: 'tab1',
      tab: `Action Required (${actionRequiredNumber?.length})`,
      Component: ActionRequired,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab2',
      tab: `Open (${openNumber?.length})`,
      Component: OpenWeightDispensory,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab3',
      tab: `Closed (${closedNumber?.length})`,
      Component: ClosedWeightDispensory,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab4',
      tab: `All Dispute (${weightDispensory?.data?.length})`,
      Component: OpenWeightDispensory,
      dataSource: dataSourceWithKeys,
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
        <meta name='keyword' content={''} />
        <title>Weight Despensory</title>
      </Helmet>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }} className="addorder">
        {authUser.role === 'company' && <Button onClick={showTakeActionModal}>Take Actions</Button>}
        <TakeActionModal
          visible={takeActionModalVisible}
          onClose={closeTakeActionModal}
          discrepancyId={selectedRowData._id}
          productName={selectedRowData.productName}
        />
        <CustomButton onClick={showModal}>Upload Weight</CustomButton>
        <UploadWeightDespensory visible={modalVisible} onClose={closeModal} fetchWeightDespensory={fetchWeightDespensory} />
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
                fetchWeightDespensory={fetchWeightDespensory}
              />
            ) : (
              <span>No component for this tab</span>
            )}
          </TabPane>
        ))}
      </Tabs>
      <div style={{ backgroundColor: '#fff', borderRadius: '34px', marginTop: '2rem', fontFamily: 'Poppins', padding: '2rem', fontWeight: '500' }}>
        Disputes can be raised within 7 days of uploading the discrepancy. After that, it will be auto-accepted.
      </div>
    </div>
  );
};

export default WeightDispensory;
