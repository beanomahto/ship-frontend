import React, { useState, useEffect } from 'react';
import { Card, Button } from 'antd';
import axios from 'axios';
import './channelIntegration.css';
import shopify from '../../utils/shopify.png';
import woo from '../../utils/woocomerce.png';
import { Link } from 'react-router-dom';
import ChannelIntegrationModel from './channelIntegrationMoodel/ChannelIntegrationModel';
import { Helmet } from 'react-helmet';

const ChannelIntegration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null); 
  const [userChannels, setUserChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/integration/getAllApi', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setUserChannels(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch channels');
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchChannels();
  }, []);

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

      <h2>Channel Integration</h2>
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

      <h2>Your Channels</h2>
      <div className='userChannels'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : userChannels.length > 0 ? (
          userChannels.map(channel => (
            <Card
              key={channel.id}
              title={channel.salesChannel}
              className='channelCard'
              bordered={true}
            >
              <img className='logo' src={channel.salesChannel === "shopify" ? shopify : woo} alt={`${channel.salesChannel} Logo`} />
              <Button type="primary" onClick={() => showModal(channel)}>
                View
              </Button>
            </Card>
          ))
        ) : (
          <p>You have no connected channels.</p>
        )}
      </div>

      {selectedChannel && (
        <ChannelIntegrationModel
          visible={isModalVisible}
          channel={selectedChannel}
          onOk={handleOk}
          onCancel={handleCancel}
          fetchChannels={fetchChannels}
        />
      )}
    </div>
  );
};

export default ChannelIntegration;
