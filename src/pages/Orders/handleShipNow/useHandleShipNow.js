// useShipNow.js
import { message } from "antd";
import { useCallback, useState } from "react";
import { useOrderContext } from "../../../context/OrderContext";
import useShipNowCost from "../../../hooks/useShipNowCost";
import useCreateShipment from "../../../hooks/useCreateShipment";

const useShipNow = (fetchOrders, setOrders, closeModalShipNow) => {
  console.log("hulala...........");
  const { shipNowCost } = useShipNowCost();
  const { shipOrder } = useCreateShipment();
  const [loading, setLoading] = useState(false);
  const { orders, setOrders, fetchOrders } = useOrderContext();
  const handleShipNow = useCallback(
    async (selectedRowKeys, selectedWarehouse, selectedDeliveryPartner) => {
      //console.log(selectedRowKeys);
      //console.log(selectedWarehouse);
      //console.log(selectedDeliveryPartner);

      const selectedRows = selectedRowKeys.map((ordId) => ordId?._id);
      //console.log(selectedRows);

      if (selectedRows.length === 0) {
        message.warning("Please select at least one order to ship.");
        return;
      }

      message.loading({
        content: "Processing shipment...",
        key: "processing",
        duration: 0,
      });
      setLoading(true);

      try {
        const updatedOrders = [];

        // for (const orderId of selectedRowKeys) {
        //   const order = orders?.orders.find((order) => order._id === orderId);
        //   if (!order) continue;

        //   //console.log(orderId);
        //   //console.log(order);

        //   let forwardCharge, codCharge;

        //   try {
        //     const costData = await shipNowCost(orderId, selectedWarehouse?._id);
        //     //console.log("Cost Data for Order:", costData);

        //     forwardCharge = costData?.cost?.find(
        //       (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
        //     )?.forwardCost;

        //     codCharge = costData?.cost?.find(
        //       (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
        //     )?.codCost;
        //   } catch (error) {
        //     console.error("Error in shipOrder or shipNowCost:", error);
        //     message.error(
        //       "Failed to calculate shipping cost or ship order. Please try again."
        //     );
        //     continue;
        //   }

        //   try {
        //     console.log("Calling shipOrder with:", {
        //       order,
        //       selectedWarehouse,
        //       selectedDeliveryPartner,
        //     });
        //     await shipOrder(
        //       order,
        //       selectedWarehouse,
        //       selectedDeliveryPartner.name
        //     );

        //     console.log("Order shipped:", orderId);
        //     message.success("AWB generated");
        //   } catch (error) {
        //     console.log("Error in shipping with this partner:", error);
        //     message.error("Error in shipping with this partner");
        //     continue;
        //   }

        //   if (forwardCharge === undefined || codCharge === undefined) {
        //     message.error(
        //       `No cost found for delivery partner for order ${orderId}.`
        //     );
        //   }

        //   const gstRate = 1.8 / 100;
        //   const forwardChargeWithGST = forwardCharge * (1 + gstRate);
        //   const codChargeWithGST = codCharge * (1 + gstRate);

        //   await fetch(
        //     `process.env.url/api/orders/updateOrderStatus/${orderId}`,
        //     {
        //       method: "PUT",
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: localStorage.getItem("token"),
        //       },
        //       body: JSON.stringify({
        //         status: "Shipped",
        //         shippingCost: forwardChargeWithGST,
        //       }),
        //     }
        //   );

        //   const walletRequests = [
        //     {
        //       debit: forwardChargeWithGST,
        //       userId: order.seller._id,
        //       remark: `Forward charge for order ${order.orderId}`,
        //       orderId: order._id,
        //     },
        //   ];

        //   if (codCharge > 0) {
        //     walletRequests.push({
        //       debit: codChargeWithGST,
        //       userId: order.seller._id,
        //       remark: `COD charge for order ${order.orderId}`,
        //       orderId: order._id,
        //     });
        //   }

        //   for (const walletRequest of walletRequests) {
        //     //console.log(walletRequest);

        //     await fetch(
        //       `process.env.url/api/transactions/decreaseAmount`,
        //       {
        //         method: "POST",
        //         headers: {
        //           "Content-Type": "application/json",
        //           Authorization: localStorage.getItem("token"),
        //         },
        //         body: JSON.stringify(walletRequest),
        //       }
        //     );
        //   }

        //   updatedOrders.push({ ...order, status: "Shipped" });
        // }
        // fetchOrders();
        // const newOrdersCopy = orders.orders.filter(
        //   (order) => !selectedRows.includes(order._id)
        // );
        // setOrders({
        //   orders: newOrdersCopy.concat(updatedOrders),
        // });

        // message.success({
        //   content: "Orders shipped successfully!",
        //   key: "processing",
        // });
        for (const orderId of selectedRowKeys) {
          const order = orders?.orders.find((order) => order._id === orderId);
          if (!order) continue;

          // Step 1: Get Shipping Costs
          let forwardCharge, codCharge;
          try {
            const costData = await shipNowCost(orderId, selectedWarehouse?._id);
            forwardCharge = costData?.cost?.find(
              (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
            )?.forwardCost;

            codCharge = costData?.cost?.find(
              (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
            )?.codCost;

            if (forwardCharge === undefined || codCharge === undefined) {
              message.error(
                `No cost found for delivery partner for order ${orderId}.`
              );
              continue;
            }
          } catch (error) {
            console.error("Error calculating cost:", error);
            message.error(
              "Failed to calculate shipping cost. Please try again."
            );
            continue;
          }

          // Step 2: Calculate GST Charges
          const gstRate = 1.8 / 100;
          const forwardChargeWithGST = forwardCharge * (1 + gstRate);
          const codChargeWithGST = codCharge * (1 + gstRate);
          const totalCost = forwardChargeWithGST + codChargeWithGST;

          // Step 3: Fetch Wallet Balance
          const { authUser, balance } = useAuthContext();
          let walletBalance = 0;
          walletBalance = balance;
          console.log("--------------walletbalance---------", walletBalance);

          // Step 4: Check Wallet Balance
          if (walletBalance < totalCost) {
            message.error(
              `Insufficient balance for order ${order.orderId}. Please recharge your wallet.`
            );
            continue;
          }

          // Step 5: Generate Shipment + AWB
          let awbGenerated = false;
          try {
            await shipOrder(
              order,
              selectedWarehouse,
              selectedDeliveryPartner.name
            );
            awbGenerated = true;
            message.success("AWB generated");
          } catch (error) {
            console.log("Error generating AWB:", error);
            message.error("Shipment failed. AWB not generated.");
            continue;
          }

          // Step 6: Only if AWB is generated, proceed
          if (awbGenerated) {
            try {
              // Update Order Status
              await fetch(
                `process.env.url/api/orders/updateOrderStatus/${orderId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                  },
                  body: JSON.stringify({
                    status: "Shipped",
                    shippingCost: forwardChargeWithGST,
                  }),
                }
              );

              // Deduct Charges from Wallet
              const walletRequests = [
                {
                  debit: forwardChargeWithGST,
                  userId: order.seller._id,
                  remark: `Forward charge for order ${order.orderId}`,
                  orderId: order._id,
                },
              ];

              if (codCharge > 0) {
                walletRequests.push({
                  debit: codChargeWithGST,
                  userId: order.seller._id,
                  remark: `COD charge for order ${order.orderId}`,
                  orderId: order._id,
                });
              }

              for (const walletRequest of walletRequests) {
                await fetch(`process.env.url/api/transactions/decreaseAmount`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                  },
                  body: JSON.stringify(walletRequest),
                });
              }

              updatedOrders.push({ ...order, status: "Shipped" });
            } catch (error) {
              console.error("Error after AWB:", error);
              message.error("Error finalizing shipment after AWB.");
              continue;
            }
          }
        }
      } catch (error) {
        console.error("Error processing shipment:", error);
        message.error({
          content: "Failed to process the shipment. Please try again.",
          key: "processing",
        });
      } finally {
        setLoading(false);
        closeModalShipNow();
      }
    },
    [fetchOrders, setOrders, closeModalShipNow]
  );

  return { handleShipNow, loading };
};

export default useShipNow;
