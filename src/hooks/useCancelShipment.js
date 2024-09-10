import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useCancelShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = async (selectedOrderData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const allowedPartners = ['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax', 'Xpressbees'];

      const filteredOrders = selectedOrderData.filter(order => allowedPartners.includes(order?.shippingPartner));

      if (filteredOrders.length === 0) {
        message.info('No valid orders selected for cancellation');
        setLoading(false);
        return;
      }

      const cancelRequests = filteredOrders.map(async (order) => {
        const deliveryPartnerName = order?.shippingPartner;
        const orderAwb = order?.awb;

        let url = '';
        let log = '';

        switch (deliveryPartnerName) {
          case 'Xpressbees':
            url = 'https://backend.shiphere.in/api/xpressbees/createShipment';
            log = 'Xpressbees hit';
            break;
          case 'Blue Dart':
          case 'Ekart':
          case 'DTDC':
          case 'Shadowfax':
            url = 'https://backend.shiphere.in/api/fship/cancelOrder';
            log = 'Shiphere hit';
            break;
          default:
            return;  
        }

        if (['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax'].includes(deliveryPartnerName)) {
          const response = await axios.post(url, {
            reason: 'Something Else',
            waybill: orderAwb,
          }, {
            headers: {
              Authorization: `${token}`,
            },
          });

          console.log(log);
          return response.data;
        } else if (deliveryPartnerName === 'Xpressbees') {
          const response = await axios.post(url, {
            awb: orderAwb,
          }, {
            headers: {
              Authorization: `${token}`,
            },
          });

          console.log(log);
          return response.data;
        }
      });

      const responses = await Promise.all(cancelRequests);

      message.success('All selected orders have been processed for cancellation');
      return responses;
    } catch (err) {
      console.log(err);
      message.error(err.response?.data?.message || err.message || 'An error occurred while cancelling orders');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelOrder,
    loading,
    error,
  };
};

export default useCancelShipment;
