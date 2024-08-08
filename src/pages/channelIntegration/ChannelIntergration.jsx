import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import { Card, Button } from 'antd';
import './channelIntegration.css';
import shopify from '../../utils/shopify.png';
import woo from '../../utils/woocomerce.png';
import ChannelIntegrationModel from './channelIntegrationMoodel/ChannelIntegrationModel';
import { Helmet } from 'react-helmet';

const ChannelIntegration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');

  const showModal = (channel) => {
    setSelectedChannel(channel);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='channelINMain'>
        <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Channel Integration</title>
            </Helmet>
        <h2 >Channel Integration</h2>
      <div className='channelsToIn'>
        <Card
          title="Shopify"
          className='channelCard'
          bordered={true}
        >
          <img className='logo' src={shopify} alt="Shopify Logo" />
          <Button type="primary">
            <Link to={'/channelintegration/shopify'} >Integrate</Link>
          </Button>
        </Card>
        <Card
          title="WooCommerce"
          className='channelCard'
          bordered={true}
        >
          <img className='logo' src={woo} alt="WooCommerce Logo" />
          <Button type="primary">
          <Link to={'/channelintegration/wooCommerce'} >Integrate</Link>
          </Button>
        </Card>
      </div>

      <ChannelIntegrationModel 
        visible={isModalVisible} 
        channel={selectedChannel} 
        onOk={handleOk} 
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ChannelIntegration;
