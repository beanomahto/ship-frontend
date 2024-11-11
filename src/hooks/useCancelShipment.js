import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useCancelShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = async (selectedOrderData) => {
    setLoading(true);
    setError(null);
//console.log(selectedOrderData);

    try {
      const token = localStorage.getItem('token');

      const allowedPartners = ['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax','Delhivery', 'Xpressbees', 'Ecom Express'];
//console.log(allowedPartners);

      const filteredOrders = selectedOrderData.filter(order => allowedPartners.includes(order?.shippingPartner));
      //console.log(filteredOrders);
      

      if (filteredOrders.length === 0) {
        message.info('No valid orders selected for cancellation');
        setLoading(false);
        return;
      }

      const cancelRequests = filteredOrders.map(async (order) => {
        const deliveryPartnerName = order?.shippingPartner;
        const orderAwb = order?.awb;
        const orderId = order?._id;
//console.log(deliveryPartnerName);

        let url = '';
        let log = '';

        switch (deliveryPartnerName) {
          case 'Ecom Express':
            url = 'https://backend.shiphere.in/api/ecomExpress/cancleShipment';
            log = 'Ecomm hit';
            break;
          // case 'Xpressbees':
          //   url = 'https://backend.shiphere.in/api/xpressbees/cancel';
          //   log = 'Xpressbees hit';
          //   break;
          case 'Delhivery':
          case 'Xpressbees':
          case 'Blue Dart':
          case 'Ekart':
          case 'DTDC':
          case 'Shadowfax':
            url = 'https://backend.shiphere.in/api/smartship/cancelorder';
            log = 'Shiphere hit';
            break;
          default:
            return;  
        }

        if (['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax','Delhivery','Xpressbees'].includes(deliveryPartnerName)) {
          const response = await axios.post(url, {
            // reason: 'Something Else',
            // waybill: orderAwb,
            orderId:orderId,
          }, {
            headers: {
              Authorization: `${token}`,
            },
          });

          //console.log(log);
          return response.data;
        } 
        else if (deliveryPartnerName === 'Ecom Express') {
          const response = await axios.post(url, {
            awb: orderAwb,
          }, {
            headers: {
              Authorization: `${token}`,
            },
          });

          //console.log(log);
          return response.data;
        }
        // else if (deliveryPartnerName === 'Xpressbees') {
        //   const response = await axios.post(url, {
        //     awb: orderAwb,
        //   }, {
        //     headers: {
        //       Authorization: `${token}`,
        //     },
        //   });

        //   //console.log(log);
        //   return response.data;
        // }
      });

      const responses = await Promise.all(cancelRequests);

      message.success('All selected orders have been processed for cancellation');
      return responses;
    } catch (err) {
      //console.log(err);
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
