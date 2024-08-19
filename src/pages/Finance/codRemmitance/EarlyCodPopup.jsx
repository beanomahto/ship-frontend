import React, { useState } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import './earlyCodPopup.css';

const EarlyCodPopup = ({ visible, onClose }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleCardClick = (option) => {
    setSelectedCard(option);
  };

  return (
    <Modal 
      visible={visible} 
      onCancel={onClose} 
      footer={null} 
      className="early-cod-popup"
      width={1000}
    >
      <h2>Get Early COD</h2>
      <p>Why Wait? Scale your business with Daily COD remittance</p>

      <div className="cod-options">
        <div 
          className={`cod-card ${selectedCard === 'D + 2 Days' ? 'selected most-popular' : 'most-popular'}`} 
          onClick={() => handleCardClick('D + 2 Days')}
        >
          <div className="most-popular-tag">Most Popular</div>
          <h3>D + 2 Days</h3>
          <p>1% of COD Amount</p>
          <ul>
            <li>Guaranteed Remit in 2 days</li>
            <li>Steady Cash Flow</li>
            <li>50% faster business Cycle</li>
          </ul>
          <Button type="primary" disabled={!termsAccepted}>Activate</Button>
        </div>

        <div 
          className={`cod-card ${selectedCard === 'D + 3 Days' ? 'selected' : ''}`} 
          onClick={() => handleCardClick('D + 3 Days')}
        >
          <h3>D + 3 Days</h3>
          <p>0.80% of COD Amount</p>
          <ul>
            <li>Guaranteed Remit in 3 days</li>
            <li>Steady Cash Flow</li>
          </ul>
          <Button type="primary" disabled={!termsAccepted}>Activate</Button>
        </div>

        <div 
          className={`cod-card ${selectedCard === 'D + 4 Days' ? 'selected' : ''}`} 
          onClick={() => handleCardClick('D + 4 Days')}
        >
          <h3>D + 4 Days</h3>
          <p>0.65% of COD Amount</p>
          <ul>
            <li>Guaranteed Remit in 4 days</li>
            <li>Steady Cash Flow</li>
          </ul>
          <Button type="primary" disabled={!termsAccepted}>Activate</Button>
        </div>
      </div>

      <Checkbox onChange={handleTermsChange}>
        I have read the <a href="#terms">Terms and Conditions</a>
      </Checkbox>
    </Modal>
  );
};

export default EarlyCodPopup;
