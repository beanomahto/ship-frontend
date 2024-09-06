import React from 'react';
import {Modal, Form, Input, Button, Checkbox } from 'antd';

const ChannelIntegrationModal = ({ visible, channel,  onCancel }) => {
  console.log(channel);
  
    return (
      <Modal 
        title={`${channel.salesChannel
        }`} 
        visible={visible} 
        onCancel={onCancel}
      >
        <div className="inte" style={{ marginTop: "0rem" }}>
    <form className="form" >
      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            value={channel.storeName}
          />
          <span>Store Name</span>
        </label>
      </div>
      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            value={channel.salesChannel}
          />
          <span>Channel</span>
        </label>
      </div>
      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            value={channel.apiKey}
          />
          <span>API Key</span>
        </label>
      </div>
      <div className="flex">
        <label>
          <input
            className="input"
            type="text"
            placeholder=""
            required
            value={channel.apiSecret}
          />
          <span>API Secret</span>
        </label>
      </div>
   {
    channel.salesChannel === "shopify" &&    <div className="flex">
    <label>
      <input
        className="input"
        type="text"
        placeholder=""
        required
        value={channel.token}
      />
      <span>Token</span>
    </label>
  </div>
   }
    </form>
  </div>
      </Modal>
    );
  };
  
export default ChannelIntegrationModal;
