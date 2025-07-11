import axios from "axios";
import { useEffect } from "react";

const useFetchAndUpdateOrders = (fetchOrders) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/smartship/getcurrentstatus`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const jsonObj = await res.json();
        const data = jsonObj?.data?.shipmentDetails;
        console.log(data);

        const mapStatusCodeToOrderStatus = (status) => {
          if (status === "27" || status === "10") return "InTransit";
          if (status === "4") return "Shipped";
          if (status === "11") return "Delivered";
          if (status === "340") return "Cancelled";
          if (["12", "13", "14", "15", "16", "17"].includes(status))
            return "UnDelivered";
          return null;
        };

        const updatedOrders = data
          ?.map((order) => {
            const order_status = mapStatusCodeToOrderStatus(order.status);
            if (order_status) {
              return { ...order, order_status };
            }
            return null;
          })
          .filter((order) => order !== null);

        if (updatedOrders?.length > 0) {
          await updateMultipleOrders(updatedOrders);
        } else {
          console.log("No orders to update: all statusCodes were invalid.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const updateMultipleOrders = async (orders) => {
      try {
        const updatePromises = orders.map((order) => {
          const updateBody = {
            status: order.order_status,
            reason: null,
          };

          return axios.put(
            `${import.meta.env.VITE_API_URL}/api/orders/updateOrderStatus/${
              order.orderId
            }`,
            updateBody,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        });

        // Wait for all updates to complete (optional)
        await Promise.allSettled(updatePromises);
      } catch (error) {
        console.error("Error updating orders:", error);
      }
    };

    fetchData();
    fetchOrders();

    const intervalId = setInterval(fetchData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchOrders]);
};

export default useFetchAndUpdateOrders;
