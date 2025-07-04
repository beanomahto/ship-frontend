//useCreateShipment.js

import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useWarehouseContext } from "../context/WarehouseContext";

const useCreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchWarehouse } = useWarehouseContext();
  const shipOrder = async (orderId, warehouseId, deliveryPartnerName) => {
    setLoading(true);
    setError(null);
    console.log(orderId);
    console.log(deliveryPartnerName);
    const warehouseIds = warehouseId?._id;
    const fShipWarehouseId = warehouseId?.smartshipHubId;
    console.log("This is the warehouse", warehouseIds);

    let orderIds = [];
    let orderWeight = [];

    if (Array.isArray(orderId)) {
      orderIds = orderId.map((ordId) => ordId?._id);
      orderWeight = orderId.map((ordWt) => ordWt?.weight);
    } else if (orderId && typeof orderId === "object") {
      orderIds = [orderId?._id];
      orderWeight = [orderId?.weight];
    }

    console.log(orderIds);
    console.log(orderWeight);

    try {
      let url = "";
      let log = "";
      const fshipUrl = "http://localhost:5000/api/smartship/hubregister";
      const fshipCreateForwardOrderUrl =
        "http://localhost:5000/api/smartship/onesteporderregister";
      const smartshipHupCheck =
        "http://localhost:5000/api/smartship/checkhubserviceability";
      const smartshipCarrierCheck =
        "http://localhost:5000/api/smartship/getrate";
      const fshipCreateShipmentUrl =
        "http://localhost:5000/api/smartship/createManifest";

      switch (deliveryPartnerName) {
        case "Ecom Express":
          url = "http://localhost:5000/api/ecomExpress/createShipment";
          log = "ecom hit";
          break;
        case "Shree Maruti":
          url = "http://localhost:5000/api/maruti/booking";
          log = "Shree Maruti hit";
          break;
        case "Delhivery":
          url = "http://localhost:5000/api/deliveryOne/create";
          log = "delhivery hit";
          break;
        case "Amazon Shipping":
          url = "http://localhost:5000/api/amazon/oneclickshipment";
          // url = "http://localhost:5000/api/amazon/purchaseshipment";
          log = "amazon hit";
          break;
        case "Xpressbees":
        case "Blue Dart":
        case "Ekart":
        case "DTDC":
        case "Shadowfax":
          break;
        default:
          throw new Error("Invalid delivery partner");
      }
      console.log(log);

      console.log("--------for delhivery checkpoint 1");

      const token = localStorage.getItem("token");
      if (
        [
          "Ekart",
          "Blue Dart",
          "DTDC",
          "Shadowfax",
          // "Delhivery",
          //"Amazon Shipping",
          "Xpressbees",
        ].includes(deliveryPartnerName)
      ) {
        console.log("---------------for delhivery checkpoint 2");

        if (fShipWarehouseId === 0) {
          const warehouseResponse = await axios.post(
            fshipUrl,
            {
              warehouseId: warehouseIds,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          console.log(
            "--------------for delhivery checkpoint 3",
            warehouseResponse
          );

          if (warehouseResponse.status === 200) {
            let courierId;
            if (deliveryPartnerName === "Ekart") courierId = 338;
            else if (deliveryPartnerName === "Blue Dart") courierId = 279;
            else if (deliveryPartnerName === "DTDC") courierId = 355;
            else if (deliveryPartnerName === "Shadowfax") courierId = 295;
            else if (deliveryPartnerName === "Delhivery") courierId = 3;
            else if (deliveryPartnerName === "Amazon Shipping") courierId = 357;
            else if (deliveryPartnerName === "Xpressbees") courierId = 368;
            fetchWarehouse();

            const hubCheckBody = {
              warehouseId: warehouseIds,
              orderId: orderIds,
              courierId,
              shippingPartner: deliveryPartnerName,
            };

            console.log("---------for delhivery checkpoint 4");

            const checkHubServiceability = await axios.post(
              smartshipHupCheck,
              hubCheckBody,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            const carrierCheckBody = {
              warehouseId: warehouseIds,
              orderId: orderIds,
              currier_id: courierId,
            };
            const checkCarrierServiceability = await axios.post(
              smartshipHupCheck,
              carrierCheckBody,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            const forwardShipBody = {
              orderId: orderIds,
              warehouseId: warehouseIds,
              courierId,
              shippingPartner: deliveryPartnerName,
            };

            console.log("-------------for delhivery checkpoint 5");

            const forwardOrderResponse = await axios.post(
              fshipCreateForwardOrderUrl,
              forwardShipBody,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            console.log("---------------for delhivery checkpoint 6");

            const createShipmentResponse = await axios.post(
              fshipCreateShipmentUrl,
              {
                orderId: orderIds,
              },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            message.success(
              "Order shipped successfully with shipment created on warehouse " +
                warehouseId?.warehouseName
            );
            console.log("FShip createShipment API hit");
            console.log(createShipmentResponse);

            return createShipmentResponse.data;
            //   if (fhipApiOrderId) {
            // } else {
            //   message.error('Failed to retrieve fhipApiOrderId');
            //   throw new Error('Failed to retrieve fhipApiOrderId');
            // }
          } else {
            message.error("Failed to create warehouse");
            throw new Error("Failed to create warehouse");
          }
        } else {
          let courierId;
          if (deliveryPartnerName === "Ekart") courierId = 338;
          else if (deliveryPartnerName === "Blue Dart") courierId = 279;
          else if (deliveryPartnerName === "DTDC") courierId = 355;
          else if (deliveryPartnerName === "Shadowfax") courierId = 295;
          else if (deliveryPartnerName === "Delhivery") courierId = 3;
          else if (deliveryPartnerName === "Xpressbees") courierId = 368;
          else if (deliveryPartnerName === "Amazon Shipping") courierId = 357;

          console.log("for delhivery checkpoint 7");

          fetchWarehouse();

          const hubCheckBody = {
            warehouseId: warehouseIds,
            orderId: orderIds,
            courierId,
            shippingPartner: deliveryPartnerName,
          };
          console.log(hubCheckBody);

          console.log("------------for delhivery checkpoint 8");

          const checkHubServiceability = await axios.post(
            smartshipHupCheck,
            hubCheckBody,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          console.log(checkHubServiceability);
          const carrierCheckBody = {
            warehouseId: warehouseIds,
            orderId: orderIds,
            currier_id: courierId,
          };
          const checkCarrierServiceability = await axios.post(
            smartshipCarrierCheck,
            carrierCheckBody,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          const forwardShipBody = {
            orderId: orderIds,
            warehouseId: warehouseIds,
            courierId,
            shippingPartner: deliveryPartnerName,
          };
          const forwardOrderResponse = await axios.post(
            fshipCreateForwardOrderUrl,
            forwardShipBody,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          console.log("-----------for delhivery checkpoint 9");

          const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
          console.log("noop", forwardOrderResponse);
          const awb =
            forwardOrderResponse.data?.data.success_order_details.orders[0]
              .awb_assigned || false;

          console.log("awb in backend", awb);
          const createShipmentResponse = await axios.post(
            fshipCreateShipmentUrl,
            {
              // apiorderid: fhipApiOrderId,
              //   courierId,
              orderId: orderIds,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          message.success(
            "Order shipped successfully with shipment created on warehouse " +
              warehouseId?.warehouseName
          );
          //console.log('FShip createShipment API hit');
          //console.log(createShipmentResponse);

          return { ...createShipmentResponse.data, awb };
          //   if (fhipApiOrderId) {
          // } else {
          //   message.error('Failed to retrieve fhipApiOrderId');
          //   throw new Error('Failed to retrieve fhipApiOrderId');
          // }
        }
      } else if (deliveryPartnerName === "Ecom Express") {
        console.log("This is the URL " + url);

        const response = await axios.post(
          url,
          {
            warehouseId: warehouseIds,
            orderId: orderIds,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        let awb = null; //updated
        if (deliveryPartnerName === "Ecom Express") {
          awb = response.data?.shipment?.shipments?.[0]?.success;
        } else if (deliveryPartnerName === "Shree Maruti") {
          awb = response.data?.data?.data?.awbNumber;
        }

        message.success(
          "Order shipped successfully on warehouse " +
            warehouseId?.warehouseName
        );
        // const awb = response.data?.shipment.shipments[0].success || false;
        // console.log("created", response.data);
        // console.log("awb in backend", awb);

        return { ...response.data, awb };
      }
      // amazon shipping
      else if (deliveryPartnerName === "Amazon Shipping") {
        console.log("Amazon URL " + url);
        //for creating shipment

        try {
          const response = await axios.post(
            url,
            {
              warehouseId: warehouseIds,
              orderId: orderIds,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          //console.log("Order creation response-----", response);
          const res = response.data;
          console.log("this is the amazon shipping response ", res);

          const waybill =
            res?.data?.payload?.packageDocumentDetails?.[0]?.trackingId;
          //const waybill = false;
          const shipId = res?.data?.payload?.shipmentId;

          console.log("waybill ---------------------", waybill);
          console.log("shipid in backend------------", shipId);
          return { awb: waybill, shipid: shipId };
        } catch (error) {
          console.log(error);
        }
      }
      //////////new code
      else if (deliveryPartnerName === "Delhivery") {
        //////code for delhivery
        //console.log("Code for delhivery");
        //console.log("This is the URL " + url);

        //for checking pincode serviceability

        const pincode = orderId?.pincode || orderId?.order?.pincode;
        console.log("There is the pincode", pincode);

        //console.log("===========", token);

        try {
          const checkPincode = await axios.get(
            `http://localhost:5000/api/deliveryOne/checkPincode/?pincode=${pincode}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          console.log("Checking pincode serviceability", checkPincode);
        } catch (error) {
          // console.log(error);
        }

        //for creating shipment

        ///for fetching waybill

        try {
          const response = await axios.post(
            url,
            {
              warehouseId: warehouseIds,
              orderId: orderIds,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          //console.log("Order creation response-----", response);
          const waybill = response?.data?.data?.packages?.[0]?.waybill;

          console.log("waybill ---------------------", waybill);
          //console.log("awb in backend", waybill.data.waybill);
          return { awb: waybill };
        } catch (error) {
          console.log(error);
        }
      }
      // shree maruti
      else if (deliveryPartnerName === "Shree Maruti") {
        try {
          const serviceability = await axios.post(
            "http://localhost:5000/api/maruti/serviceability",
            {
              warehouseId: warehouseIds,
              orderId: orderIds,
            },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (serviceability.status !== 200) {
            message.error("Order is not serviceable.");
            return;
          }

          try {
            const bookingResponse = await axios.post(
              url,
              {
                orderId: orderIds,
                warehouseId: warehouseIds,
              },
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

            if (bookingResponse.status !== 200) {
              message.error("Failed to book the order. Please try again.");
              return;
            }

            console.log("Booking response:", bookingResponse.data);

            let awb = bookingResponse?.data.data?.data?.awbNumber;
            let cawb = bookingResponse?.data?.data?.data?.cAwbNumber;

            try {
              const manifestResponse = await axios.post(
                "http://localhost:5000/api/maruti/manifest",
                {
                  awbNumber: awb,
                  cAwbNumber: cawb,
                },
                {
                  headers: {
                    Authorization: `${token}`,
                  },
                }
              );

              if (manifestResponse.status !== 200) {
                message.error("Failed to create manifest. Please try again.");
                return;
              }

              message.success(
                `Order shipped successfully on warehouse ${
                  warehouseId?.warehouseName || "N/A"
                }`
              );

              return {
                ...serviceability.data,
                bookingResponse: bookingResponse.data,
                manifestResponse: manifestResponse.data,
              };
            } catch (error) {
              message.error("Failed to create manifest. Please try again.");
            }
          } catch (error) {
            message.error("Failed to book the order. Please try again.");
          }
        } catch (error) {
          message.error("Order is not serviceable.");
        }
      }
    } catch (err) {
      console.log(err);
      message.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  console.log("shiporderres", shipOrder);
  return {
    shipOrder,
    loading,
    error,
  };
};

export default useCreateShipment;
