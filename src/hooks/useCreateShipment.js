import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useCreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shipOrder = async (orderId, warehouseId, deliveryPartnerName) => {
    setLoading(true);
    setError(null);
    console.log(orderId);
  
    const warehouseIds = warehouseId?._id;
    const fShipWarehouseId = warehouseId?.fshipWarehouseId;
    console.log(warehouseIds);
  
    let orderIds = [];
  
    if (Array.isArray(orderId)) {
      orderIds = orderId.map((ordId) => ordId?._id);  
    } else if (orderId && typeof orderId === 'object') {
      orderIds = [orderId?._id]; 
    }
  
    console.log(orderIds); 
  
    try {
      let url = '';
      let log = '';
      const fshipUrl = 'https://backend.shiphere.in/api/fship/createWarehouse'; 
      const fshipCreateForwardOrderUrl = 'https://backend.shiphere.in/api/fship/createforwardorder'; 
      const fshipCreateShipmentUrl = 'http://backend.shiphere.in/api/fship/shipOrder'; 
  
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
          url = 'https://backend.shiphere.in/api/deliveryOne/create';
          log = 'delhivery hit';
          break;
        case 'Blue Dart':
        case 'Ekart':
        case 'DTDC':
        case 'Shadowfax':
          break;
        default:
          throw new Error('Invalid delivery partner');
      }
  
      const token = localStorage.getItem('token');
  
      if (['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax'].includes(deliveryPartnerName)) {
        if (fShipWarehouseId === 0) {
          const warehouseResponse = await axios.post(fshipUrl, {
            warehouseId: warehouseIds,
          }, {
            headers: {
              'Authorization': `${token}`,
            },
          });
  
          if (warehouseResponse.status === 200) {
            let courierId;
            if (deliveryPartnerName === 'Ekart') courierId = 9;
            else if (deliveryPartnerName === 'Blue Dart') courierId = 14;
            else if (deliveryPartnerName === 'DTDC') courierId = 17;
            else if (deliveryPartnerName === 'Shadowfax') courierId = 43;
  
            const forwardShipBody = {
              orderId: orderIds, // Using normalized orderIds array
              warehouseId: warehouseIds,
              courierId,
              shippingPartner: deliveryPartnerName,
            };
  
            const forwardOrderResponse = await axios.post(fshipCreateForwardOrderUrl, forwardShipBody, {
              headers: {
                'Authorization': `${token}`,
              },
            });
  
            const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
            console.log(forwardOrderResponse);
            
            if (fhipApiOrderId) {
              const createShipmentResponse = await axios.post(fshipCreateShipmentUrl, {
                apiorderid: fhipApiOrderId,
                courierId,
              }, {
                headers: {
                  'Authorization': `${token}`,
                },
              });
  
              message.success("Order shipped successfully with shipment created on warehouse " + warehouseId?.warehouseName);
              console.log('FShip createShipment API hit');
              console.log(createShipmentResponse);
  
              return createShipmentResponse.data;
            } else {
              message.error('Failed to retrieve fhipApiOrderId');
              throw new Error('Failed to retrieve fhipApiOrderId');
            }
          } else {
            message.error('Failed to create warehouse');
            throw new Error('Failed to create warehouse');
          }
        } else {
          let courierId;
          if (deliveryPartnerName === 'Ekart') courierId = 9;
          else if (deliveryPartnerName === 'Blue Dart') courierId = 14;
          else if (deliveryPartnerName === 'DTDC') courierId = 17;
          else if (deliveryPartnerName === 'Shadowfax') courierId = 43;
  
          const forwardShipBody = {
            orderId: orderIds, // Using normalized orderIds array
            warehouseId: warehouseIds,
            courierId,
            shippingPartner: deliveryPartnerName,
          };
  
          const forwardOrderResponse = await axios.post(fshipCreateForwardOrderUrl, forwardShipBody, {
            headers: {
              'Authorization': `${token}`,
            },
          });
  
          const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
          console.log(forwardOrderResponse);
          if (fhipApiOrderId) {
            const createShipmentResponse = await axios.post(fshipCreateShipmentUrl, {
              apiorderid: fhipApiOrderId,
              courierId,
            }, {
              headers: {
                'Authorization': `${token}`,
              },
            });
  
            message.success("Order shipped successfully with shipment created on warehouse " + warehouseId?.warehouseName);
            console.log('FShip createShipment API hit');
            console.log(createShipmentResponse);
  
            return createShipmentResponse.data;
          } else {
            message.error('Failed to retrieve fhipApiOrderId');
            throw new Error('Failed to retrieve fhipApiOrderId');
          }
        }
      } else {
        const response = await axios.post(url, {
          warehouseId: warehouseIds,
          orderId: orderIds, // Using normalized orderIds array
        }, {
          headers: {
            'Authorization': `${token}`,
          },
        });
  
        message.success("Order shipped successfully on warehouse " + warehouseId?.warehouseName);
        console.log(log);
        console.log(response);
  
        return response.data;
      }
    } catch (err) {
      console.log(err);
      message.error(err.response?.data?.message || err.message || 'An error occurred');
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
