import { message } from "antd";
import axios from "axios";
import { useState } from "react";

const useCancelShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = async (selectedOrderData) => {
    setLoading(true);
    setError(null);
    //console.log(selectedOrderData);

    try {
      const token = localStorage.getItem("token");

      const allowedPartners = [
        "Ekart",
        "Blue Dart",
        "DTDC",
        "Shadowfax",
        "Delhivery",
        "Xpressbees",
        "Ecom Express",
        "Shree Maruti",
        "Amazon Shipping",
      ];
      //console.log(allowedPartners);
      // console.log("1st check in line 28");
      const filteredOrders = selectedOrderData.filter((order) =>
        allowedPartners.includes(order?.shippingPartner)
      );
      //console.log(filteredOrders);

      if (filteredOrders.length === 0) {
        message.info("No valid orders selected for cancellation");
        setLoading(false);
        return;
      }

      const cancelRequests = filteredOrders.map(async (order) => {
        console.log("order:", order);
        const deliveryPartnerName = order?.shippingPartner;
        const orderAwb = order?.awb;
        const orderId = order?._id;
        const shipid = order?.shipid;
        // console.log("orderAwb:", orderAwb);
        // console.log("orderId:", orderId);
        // console.log(deliveryPartnerName);

        let url = "";
        let log = "";

        switch (deliveryPartnerName) {
          case "Ecom Express":
            url = `${
              import.meta.env.VITE_API_URL
            }/api/ecomExpress/cancleShipment`;
            log = "Ecomm hit";
            break;
          case "Shree Maruti":
            url = `${import.meta.env.VITE_API_URL}/api/maruti/cancel`;
            log = "Maruti hit";
            break;
          // case 'Xpressbees':
          //   url = 'https://backend.shiphere.in/api/xpressbees/cancel';
          //   log = 'Xpressbees hit';
          //   break;
          case "Delhivery":
            url = `${
              import.meta.env.VITE_API_URL
            }/api/deliveryOne/cancelShipment`;
            log = "Delhivery hit";
            break;
          case "Xpressbees":
          case "Amazon Shipping":
            url = `${import.meta.env.VITE_API_URL}/api/amazon/cancel/${shipid}`;
            log = "Amazon hit";
            break;
          case "Blue Dart":
          case "Ekart":
          case "DTDC":
          case "Shadowfax":
            url = `${import.meta.env.VITE_API_URL}/api/smartship/cancelorder`;
            log = "Shiphere hit";
            break;
          default:
            return;
        }

        if (
          ["Ekart", "Blue Dart", "DTDC", "Shadowfax", "Xpressbees"].includes(
            deliveryPartnerName
          )
        ) {
          const response = await axios.post(
            url,
            {
              // reason: 'Something Else',
              // waybill: orderAwb,
              orderId: orderId,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          //console.log(log);
          return response.data;
        } else if (deliveryPartnerName === "Ecom Express") {
          const response = await axios.post(
            url,
            {
              awb: orderAwb,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          //console.log(log);
          return response.data;
        } else if (deliveryPartnerName === "Shree Maruti") {
          // console.log("in lint 117");
          const response = await axios.post(
            url,
            {
              orderId: order?.orderId,
              cancelReason: "cancel",
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          // console.log("response", response);
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
        else if (deliveryPartnerName === "Delhivery") {
          console.log("OrderAWB", orderAwb);
          const response = await axios.post(
            url,
            {
              waybill: orderAwb,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          return response.data;
        }
        //amazon
        else if (deliveryPartnerName === "Amazon Shipping") {
          console.log("shipID", shipid);
          const response = await axios.put(
            url,
            {},
            {
              headers: {
                Authorization: `${token}`,
                "x-shiphere-token":
                  "28f73931ced05010359f13149a8f5861f30b822ac12fb1cfdfcfbe94239efcf7",
              },
            }
          );
          return response.data;
        }
      });

      const responses = await Promise.all(cancelRequests);

      message.success(
        "All selected orders have been processed for cancellation"
      );
      return responses;
    } catch (err) {
      //console.log(err);
      message.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while cancelling orders"
      );
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
