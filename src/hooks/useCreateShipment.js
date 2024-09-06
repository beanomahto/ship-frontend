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
      const fshipUrl = 'https://backend.shiphere.in/api/fship/createWarehouse'; 
      const fshipCreateShipUrl = 'https://backend.shiphere.in/api/fship/createforwardorder'; 

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
          url = 'https://backend.shiphere.in/api/xpressbees/createShipment';
          log = 'xpress hit';
          break;
        case 'Delhivery':
          url = 'http://localhost:5000/api/deliveryOne/create';
          log = 'delhivery hit';
          break;
        case 'Blue Dart':
        case 'Ekart':
        case 'DTDC':
          url = fshipUrl;
          log = 'fship hit';
          break;
        default:
          throw new Error('Invalid delivery partner');
      }

      const token = localStorage.getItem('token');

      if (['Blue Dart', 'Ekart', 'DTDC'].includes(deliveryPartnerName)) {
        console.log(warehouseId);
        const response = await axios.post(url, {
          warehouseId,
        }, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        console.log(log);
        console.log(response);

        let courierId;
        if (deliveryPartnerName === 'Ekart') courierId = 9;
        else if (deliveryPartnerName === 'Blue Dart') courierId = 14;
        else if (deliveryPartnerName === 'DTDC') courierId = 17;

        const secondResponse = await axios.post(fshipCreateShipUrl, {
          orderId,
          warehouseId,
          courierId,
        }, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        console.log('FShip second API hit');
        console.log(secondResponse);

        return secondResponse.data;
      } else {
        const response = await axios.post(url, {
          warehouseId,
          orderId,
        }, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        console.log(log);
        console.log(response);

        return response.data;
      }
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
