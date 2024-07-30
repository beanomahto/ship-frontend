import { Button, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import UploadWeightDespensory from './UploadWeightDespensory';
import CustomButton from '../../../components/Button/Button';
import ActionRequired from './ActionRequired';
import OpenWeightDispensory from './OpenWeightDispensory';
import SearchSellerModal from './SearchSellerModal';
import ClosedWeightDispensory from './ClosedWeightDispensory';

const { TabPane } = Tabs;

const WeightDispensory = () => {
  const [weightDispensory, setWeightDispensory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('tab1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const fetchWeightDespensory = async () => {
      try {
        const res = await fetch('/api/weightdiscrepancy/getweightdiscrepancy');
        const data = await res.json();
        setWeightDispensory(data);
      } catch (error) {
        console.error("Failed to fetch weight discrepancy data:", error);
      }
    };
    fetchWeightDespensory();
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
      // message.info(`${newSelectedRowKeys.length} item(s) selected`);
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
      tab: 'All Despute', 
      Component: OpenWeightDispensory,
      dataSource: weightDispensory.data,
    },
  ];

  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }} className="addorder">
        <CustomButton onClick={showModal}>Upload Weight</CustomButton>
        <UploadWeightDespensory visible={modalVisible} onClose={closeModal} />
        <CustomButton onClick={showSearchModal}>Search Seller</CustomButton>
        <SearchSellerModal visible={searchModalVisible} weightDispensory={weightDispensory} onClose={closeSearchModal} />
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
    </div>
  );
};

export default WeightDispensory;
