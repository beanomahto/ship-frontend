import React, { useEffect, useState } from 'react';
import {Modal, Form, Input, Button, Checkbox } from 'antd';

const ChannelIntegrationModal = ({ visible, channel,  onCancel }) => {
  console.log(channel);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Listen for screen size changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
          <span>Store Name</span>
          <input
            className={isMobile ? "Channelinput" : "input"}
            type="text"
            placeholder=""
            required
            value={channel.storeName}
          />
        </label>
      </div>
      <div className="flex">
        <label>
          <span>Channel</span>
          <input
            className={isMobile ? "Channelinput" : "input"}
            type="text"
            placeholder=""
            required
            value={channel.salesChannel}
          />
        </label>
      </div>
      <div className="flex">
        <label>
          <span>API Key</span>
          <input
            className={isMobile ? "Channelinput" : "input"}
            type="text"
            placeholder=""
            required
            value={channel.apiKey}
          />
        </label>
      </div>
      <div className="flex">
        <label>
          <span>API Secret</span>
          <input
            className={isMobile ? "Channelinput" : "input"}
            type="text"
            placeholder=""
            required
            value={channel.apiSecret}
          />
        </label>
      </div>
   {
    channel.salesChannel === "shopify" &&    <div className="flex">
    <label>
      <span>Token</span>
      <input
        className={isMobile ? "Channelinput" : "input"}
        type="text"
        placeholder=""
        required
        value={channel.token}
      />
    </label>
  </div>
   }
    </form>
  </div>
      </Modal>
    );
  };
  
export default ChannelIntegrationModal;
