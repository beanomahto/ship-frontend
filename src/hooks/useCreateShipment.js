import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useWarehouseContext } from "../context/WarehouseContext";

const useCreateShipment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchWarehouse } = useWarehouseContext();
  const shipOrder = async (orderId, warehouseId, deliveryPartnerName) => {
    setLoading(true);
    setError(null);
    //console.log(orderId);

    const warehouseIds = warehouseId?._id;
    const fShipWarehouseId = warehouseId?.smartshipHubId;
    //console.log(warehouseId);

    let orderIds = [];
    let orderWeight = [];

    if (Array.isArray(orderId)) {
      orderIds = orderId.map((ordId) => ordId?._id);
      orderWeight = orderId.map((ordWt) => ordWt?.weight);
    } else if (orderId && typeof orderId === "object") {
      orderIds = [orderId?._id];
      orderWeight = [orderId?.weight];
    }

    //console.log(orderIds);
    //console.log(orderWeight);

    try {
      let url = "";
      let log = "";
      const fshipUrl = "https://backend.shiphere.in/api/smartship/hubregister";
      const fshipCreateForwardOrderUrl =
        "https://backend.shiphere.in/api/smartship/onesteporderregister";
      const smartshipHupCheck =
        "https://backend.shiphere.in/api/smartship/checkhubserviceability";
      const smartshipCarrierCheck =
        "https://backend.shiphere.in/api/smartship/getrate";
      const fshipCreateShipmentUrl =
        "https://backend.shiphere.in/api/smartship/createManifest";

      switch (deliveryPartnerName) {
        case "Ecom Express":
          url = "https://backend.shiphere.in/api/ecomExpress/createShipment";
          log = "ecom hit";
          break;
        case "Delhivery":
        case "Amazon Shipping":
        case "Xpressbees":
        case "Blue Dart":
        case "Ekart":
        case "DTDC":
        case "Shadowfax":
          break;
        default:
          throw new Error("Invalid delivery partner");
      }

      const token = localStorage.getItem("token");
      if (
        [
          "Ekart",
          "Blue Dart",
          "DTDC",
          "Shadowfax",
          "Delhivery",
          "Xpressbees",
          "Amazon Shipping",
        ].includes(deliveryPartnerName)
      ) {
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

          if (warehouseResponse.status === 200) {
            let courierId;
            if (deliveryPartnerName === "Ekart") courierId = 338;
            else if (deliveryPartnerName === "Blue Dart") courierId = 279;
            else if (deliveryPartnerName === "DTDC") courierId = 355;
            else if (deliveryPartnerName === "Shadowfax") courierId = 295;
            else if (deliveryPartnerName === "Delhivery") courierId = 374;
            else if (deliveryPartnerName === "Amazon Shipping") courierId = 357;
            else if (deliveryPartnerName === "Xpressbees") courierId = 368;
            fetchWarehouse();

            const hubCheckBody = {
              warehouseId: warehouseIds,
              orderId: orderIds,
              courierId,
              shippingPartner: deliveryPartnerName,
            };

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

            const forwardOrderResponse = await axios.post(
              fshipCreateForwardOrderUrl,
              forwardShipBody,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );

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
            //console.log('FShip createShipment API hit');
            //console.log(createShipmentResponse);

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
          else if (deliveryPartnerName === "Delhivery") courierId = 374;
          else if (deliveryPartnerName === "Xpressbees") courierId = 368;
          else if (deliveryPartnerName === "Amazon Shipping") courierId = 357;

          fetchWarehouse();

          const hubCheckBody = {
            warehouseId: warehouseIds,
            orderId: orderIds,
            courierId,
            shippingPartner: deliveryPartnerName,
          };
          console.log(hubCheckBody);

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

          // const fhipApiOrderId = forwardOrderResponse.data?.apiorderid;
          //console.log(forwardOrderResponse);

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

          return createShipmentResponse.data;
          //   if (fhipApiOrderId) {
          // } else {
          //   message.error('Failed to retrieve fhipApiOrderId');
          //   throw new Error('Failed to retrieve fhipApiOrderId');
          // }
        }
      } else {
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

        message.success(
          "Order shipped successfully on warehouse " +
            warehouseId?.warehouseName
        );
        //console.log(log);
        //console.log(response);

        return response.data;
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

  return {
    shipOrder,
    loading,
    error,
  };
};

export default useCreateShipment;
