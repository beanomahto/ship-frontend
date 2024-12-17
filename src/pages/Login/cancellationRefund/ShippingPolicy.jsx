import React from 'react';
import './ShippingPolicy.css';

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy-container">
      <h1 className="shipping-policy-title">Shipping Policy</h1>

      <div className="policy-section">
        <h2 className="section-title">Order Dispatch</h2>
        <p className="section-description">
          We usually dispatch all orders within 48-72 hours of receiving them.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Global Delivery</h2>
        <p className="section-description">
          We deliver products worldwide using our logistic partners: <strong>Ecom Expres, Delhivery, Ekart, ShadowFax, DTDC, Blue Dart, Amazon Shipping, Xpressbees</strong>, and established local couriers for domestic deliveries, depending on the destination.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Delivery Time</h2>
        <p className="section-description">
          Delivery to customers may take about 3 to 12 working days, depending on geographic location. The shipping times mentioned on our website are approximate and not guaranteed. Customers are advised to place orders early if they have a deadline to meet.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Production Time</h2>
        <p className="section-description">
          If the product needs to be tailored to meet customer requirements, additional production time of 15 to 20 days may be required, depending on the production needs and order quantity.
        </p>
      </div>

      <div className="policy-section">
        <h2 className="section-title">Domestic Orders</h2>
        <p className="section-description">
          Conditions: The following conditions apply to shipping within India. No free shipping is provided unless stated during an offer on the website. Applicable shipping charges will be displayed on the site or communicated to the customer at the time of order placement.
        </p>
        <p className="section-description">
          Delivery Time: Deliveries are made from 9:00 AM to 5:00 PM (IST) on business days (Monday to Friday). Express shipping charges are additional, and free shipping does not apply to express shipping requests.
        </p>
      </div>

      {/* <div className="policy-section">
        <h2 className="section-title">International Orders</h2>
        <p className="section-description">
          Conditions: Shipping charges vary by country and service provider. Reputed shipping service providers such as DHL, FedEx, TNT, DTDC, and others are used. Express shipping charges are additional.
        </p>
        <p className="section-description">
          Mandatory Requirements: Customers must provide accurate shipping details, including name, address, and telephone numbers, to ensure proper delivery.
        </p>
      </div> */}

      <div className="policy-section">
        <h2 className="section-title">Return Policy</h2>
        <p className="section-description">
          Eligible Goods: Returns are accepted for goods damaged during transit, incorrectly delivered items, or undelivered shipments.
        </p>
        <p className="section-description">
          Timeframe: Returns must be completed within 30 days to close the order lifecycle. Requests outside this timeframe may not be accepted.
        </p>
        <p className="section-description">
          Return Procedure: Customers must contact customer service via hotline or email to initiate a return request.
        </p>
        <p className="section-description">
          Refund or Replacement: Customers can choose a full refund or a replacement shipment.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
