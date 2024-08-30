import { useState } from 'react';
import axios from 'axios';

const useCreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipOrder = async (orderId, warehouseId, deliveryPartnerName) => {
    setLoading(true);
    setError(null);

    console.log(orderId, warehouseId, deliveryPartnerName);

    try {
      let url = '';
      let log = '';

      switch (deliveryPartnerName) {
        case 'Ecom Express':
          url = 'https://backend.shiphere.in/api/ecomExpress/createShipment';
          log = 'ecom hit';
          break;
        case 'Amazon Shipping':
          url = 'https://backend.shiphere.in/api/amazon-shipping/createShipment';
          log = 'amazon hit';
          break;
        case 'Xpressbees':
        //   url = 'https://backend.shiphere.in/api/xpressbees/createShipment';
          url = 'https://backend.shiphere.in/api/xpressbees/createShipment';
          log = 'xpress hit';
          break;
        case 'Delhivery':
          url = 'https://backend.shiphere.in/api/deliveryOne/create';
          log = 'delhivery hit';
          break;
        case 'Blue Dart':
          url = 'https://backend.shiphere.in/api/bluedart/createShipment';
          log = 'bluedart hit';
          break;
        default:
          throw new Error('Invalid delivery partner');
      }

      const token = localStorage.getItem('token');

      const response = await axios.post(url, {
        orderId,
        warehouseId,
      }, {
        headers: {
          'Authorization': `${token}`, 
        },
      });

      console.log(log);
      console.log(response);

      return response.data;
    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    shipOrder,
    loading,
    error,
  };
};

export default useCreateShipment;
