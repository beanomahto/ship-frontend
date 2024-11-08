import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useWarehouseContext } from '../context/WarehouseContext';

const useCreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const {fetchWarehouse} = useWarehouseContext()
  const shipOrder = async (orderId, warehouseId, deliveryPartnerName) => {
    setLoading(true);
    setError(null);
    console.log(orderId);

    const warehouseIds = warehouseId?._id;
    const fShipWarehouseId = warehouseId?.smartshipHubId;
    console.log(warehouseId);

    let orderIds = [];
    let orderWeight = [];

    if (Array.isArray(orderId)) {
      orderIds = orderId.map((ordId) => ordId?._id);
      orderWeight = orderId.map((ordWt) => ordWt?.weight);
    } else if (orderId && typeof orderId === 'object') {
      orderIds = [orderId?._id];
      orderWeight = [orderId?.weight];
    }

    console.log(orderIds);
    console.log(orderWeight);

    try {
      let url = '';
      let log = '';
      const fshipUrl = 'http://localhost:5000/api/smartship/hubregister';
      const fshipCreateForwardOrderUrl = 'http://localhost:5000/api/smartship/onesteporderregister';
      const fshipCreateShipmentUrl = 'http://localhost:5000/api/smartship/createManifest';

      switch (deliveryPartnerName) {
        case 'Ecom Express':
          url = 'http://localhost:5000/api/ecomExpress/createShipment';
          log = 'ecom hit';
          break;
        // case 'Amazon Shipping':
        //   url = 'http://localhost:5000/api/amazon-shipping/createShipment';
        //   log = 'amazon hit';
        //   break;
        // case 'Xpressbees':
        //   url = 'http://localhost:5000/api/xpressbees/createShipment';
        //   log = 'xpress hit';
        //   break;
        case 'Delhivery':
        case 'Amazon Shipping':
        case 'Xpressbees':
        case 'Blue Dart':
        case 'Ekart':
        case 'DTDC':
        case 'Shadowfax':
          break;
        default:
          throw new Error('Invalid delivery partner');
      }

      const token = localStorage.getItem('token');

      if (['Ekart', 'Blue Dart', 'DTDC', 'Shadowfax', 'Delhivery','Xpressbees','Amazon Shipping'].includes(deliveryPartnerName)) {
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
            if (deliveryPartnerName === 'Ekart') courierId = 338;
            else if (deliveryPartnerName === 'Blue Dart') courierId = 279;
            else if (deliveryPartnerName === 'DTDC') courierId = 355;
            else if (deliveryPartnerName === 'Shadowfax') courierId = 295;
            else if (deliveryPartnerName === 'Delhivery')  courierId = 3;
            else if (deliveryPartnerName === 'Amazon Shipping')  courierId = 357;
            else if (deliveryPartnerName === 'Xpressbees')  courierId = 2;
            fetchWarehouse()
            const forwardShipBody = {
              orderId: orderIds,
              warehouseId: warehouseIds,
              courierId,
              shippingPartner: deliveryPartnerName,
            };

            const forwardOrderResponse = await axios.post(fshipCreateForwardOrderUrl, forwardShipBody, {
              headers: {
                'Authorization': `${token}`,
              },
            });

            // const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
            console.log(forwardOrderResponse);

            const createShipmentResponse = await axios.post(fshipCreateShipmentUrl, {
              // apiorderid: fhipApiOrderId,
              //   courierId,
              orderId: orderIds,
              }, {
                headers: {
                  'Authorization': `${token}`,
                },
              });

              message.success("Order shipped successfully with shipment created on warehouse " + warehouseId?.warehouseName);
              console.log('FShip createShipment API hit');
              console.log(createShipmentResponse);

              return createShipmentResponse.data;
            //   if (fhipApiOrderId) {
            // } else {
            //   message.error('Failed to retrieve fhipApiOrderId');
            //   throw new Error('Failed to retrieve fhipApiOrderId');
            // }
          } else {
            message.error('Failed to create warehouse');
            throw new Error('Failed to create warehouse');
          }
        } else {
          let courierId;
          if (deliveryPartnerName === 'Ekart') courierId = 338;
          else if (deliveryPartnerName === 'Blue Dart') courierId = 279;
          else if (deliveryPartnerName === 'DTDC') courierId = 355;
          else if (deliveryPartnerName === 'Shadowfax') courierId = 295;
          else if (deliveryPartnerName === 'Delhivery')  courierId = 3;
          else if (deliveryPartnerName === 'Xpressbees')  courierId = 2;
          else if (deliveryPartnerName === 'Amazon Shipping')  courierId = 357;

          fetchWarehouse()
          const forwardShipBody = {
            orderId: orderIds,
            warehouseId: warehouseIds,
            courierId,
            shippingPartner: deliveryPartnerName,
          };

          const forwardOrderResponse = await axios.post(fshipCreateForwardOrderUrl, forwardShipBody, {
            headers: {
              'Authorization': `${token}`,
            },
          });

          // const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
          console.log(forwardOrderResponse);

          const createShipmentResponse = await axios.post(fshipCreateShipmentUrl, {
            // apiorderid: fhipApiOrderId,
            //   courierId,
            orderId: orderIds,
            }, {
              headers: {
                'Authorization': `${token}`,
              },
            });

            message.success("Order shipped successfully with shipment created on warehouse " + warehouseId?.warehouseName);
            console.log('FShip createShipment API hit');
            console.log(createShipmentResponse);
            
            return createShipmentResponse.data;
          //   if (fhipApiOrderId) {
          // } else {
          //   message.error('Failed to retrieve fhipApiOrderId');
          //   throw new Error('Failed to retrieve fhipApiOrderId');
          // }
        }
      } else {
        const response = await axios.post(url, {
          warehouseId: warehouseIds,
          orderId: orderIds,
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
