import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

const ChannelIntegrationModal = ({ visible, channel, onCancel }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
console.log(channel);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle the delete API call
  const handleDelete = async () => {
    try {
      // Example of a delete API call
      const response = await fetch(`http://localhost:5000/api/integration/deleteApi/${channel?.salesChannel}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        message.success('Channel deleted successfully');
        onCancel(); // Close the modal
      } else {
        const errorData = await response.json();
        message.error(`Failed to delete the channel: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      message.error('An error occurred while deleting the channel');
    }
  };
  

  return (
    <Modal
      title={channel.salesChannel}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="delete" type="danger" onClick={handleDelete}>
          Delete
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div className="inte" style={{ marginTop: '0rem' }}>
        <form className="form">
          <div className="flex">
            <label>
              <span>Store Name</span>
              <input
                className={isMobile ? 'Channelinput' : 'input'}
                type="text"
                required
                value={channel.storeName}
                readOnly
              />
            </label>
          </div>
          <div className="flex">
            <label>
              <span>Channel</span>
              <input
                className={isMobile ? 'Channelinput' : 'input'}
                type="text"
                required
                value={channel.salesChannel}
                readOnly
              />
            </label>
          </div>
          <div className="flex">
            <label>
              <span>API Key</span>
              <input
                className={isMobile ? 'Channelinput' : 'input'}
                type="text"
                required
                value={channel.apiKey}
                readOnly
              />
            </label>
          </div>
          <div className="flex">
            <label>
              <span>API Secret</span>
              <input
                className={isMobile ? 'Channelinput' : 'input'}
                type="text"
                required
                value={channel.apiSecret}
                readOnly
              />
            </label>
          </div>
          {channel.salesChannel === 'shopify' && (
            <div className="flex">
              <label>
                <span>Token</span>
                <input
                  className={isMobile ? 'Channelinput' : 'input'}
                  type="text"
                  required
                  value={channel.token}
                  readOnly
                />
              </label>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default ChannelIntegrationModal;
