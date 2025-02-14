import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DashboardTab from "./NDRTabs/DashboardTab.jsx";
import ActionRequiredTab from "./NDRTabs/ActionRequiredTab.jsx";
import ActionTakenTab from "./NDRTabs/ActionTakenTab.jsx";
import DeliveredTab from "./NDRTabs/DeliveredTab.jsx";
import RTOTab from "./NDRTabs/RTOTab.jsx";
import { useOrderContext } from "../../context/OrderContext.jsx";
import axios from "axios";
import AllOrderTab from "./NDRTabs/All0rderTab.jsx";
import "./ndr.css";

const { TabPane } = Tabs;

const NDR = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const { orders, fetchOrders } = useOrderContext();

  const dataSourceWithKeys =
    orders?.orders?.map((order) => ({
      ...order,
      key: order._id,
      order: order,
    })) || [];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = newSelectedRowKeys.map((key) =>
      orders.orders.find((order) => order._id === key)
    );
    setSelectedOrderData(selectedData);
  };
  // console.log(dataSourceWithKeys);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const actionRequired = dataSourceWithKeys?.filter(
    (status) => status.ndrstatus === "Required" && status.status === "UnDelivered"
  );
  const actionTaken = dataSourceWithKeys?.filter(
    (status) => status.ndrstatus === "Taken" && status.status !== "Delivered"
  );
  const rtoOrder = dataSourceWithKeys?.filter(
    (status) => (status.ndrstatus === "RTO" || status.ndrstatus === 'RtoDone') && status.status !== "Delivered"
  );
  const ndrDeliveredOrder = dataSourceWithKeys?.filter(
    (status) =>
      status.status === "Delivered" &&
      (status.ndrstatus === "Taken" ||
        status.ndrstatus === "Required" ||
        status.ndrstatus === "RTO")
  );
  const allNdrOrders = [
    ...actionRequired,
    ...actionTaken,
    ...rtoOrder,
    ...ndrDeliveredOrder,
  ];

  const tabsData = [
    {
      key: "tab1",
      tab: `Dashboard`,
      Component: DashboardTab,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab2",
      tab: `Action Required (${actionRequired?.length})`,
      Component: ActionRequiredTab,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab3",
      tab: `Action Taken (${actionTaken?.length})`,
      Component: ActionTakenTab,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab4",
      tab: `Delivered (${ndrDeliveredOrder?.length})`,
      Component: DeliveredTab,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab5",
      tab: `RTO (${rtoOrder?.length})`,
      Component: RTOTab,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab6",
      tab: `All Orders (${allNdrOrders?.length})`,
      Component: AllOrderTab,
      dataSource: dataSourceWithKeys,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      await fetchOrders();
      try {
        const res = await fetch(
          "https://backend.shiphere.in/api/smartship/getcurrentstatus",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
    
        const jsonObj = await res.json();
        const data = jsonObj?.data?.shipmentDetails;
    
        if (orders?.orders?.length > 0) {
          const rtoDeduct = orders.orders.filter(
            (order) => order.ndrstatus === "RTO" && order.status !== "Delivered"
          );
    
          const processedOrders = new Set();
    
          if (rtoDeduct.length > 0) {
            await Promise.all(
              rtoDeduct.map(async (order) => {
                if (processedOrders.has(order._id)) return; 
                processedOrders.add(order._id);
    
                try {
                  const forwardWalletRequestBody = {
                    debit: order.rtoCost ?? order.shippingCost,
                    userId: order.seller._id,
                    remark: `RTO charge for order ${order.orderId}`,
                    orderId: order._id,
                  };
    
                  const forwardWalletResponse = await axios.post(
                    "https://backend.shiphere.in/api/transactions/decreaseAmount",
                    forwardWalletRequestBody,
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
    
                  if (forwardWalletResponse.status === 200) {
                    try {
                      const updateBody = {
                        ndrstatus: "RtoDone",
                        reattemptcount: order.reattemptcount + 0,
                      };
    
                      await axios.put(
                        `https://backend.shiphere.in/api/orders/updateOrderStatus/${order._id}`,
                        updateBody,
                        {
                          headers: {
                            Authorization: localStorage.getItem("token"),
                          },
                        }
                      );
                    } catch (error) {
                      console.error("Error updating order status:", error);
                    }
                  }
                } catch (error) {
                  console.error("Error processing RTO charge:", error);
                }
              })
            );
          }
        }
    
        const mapStatusCodeToOrderStatus = (status) => {
          if (["27", "30", "10", "59", "121", "108", "126", "108", "109", "110", "122", "123", "124", "125", "126", "133", "120","207", "209", "215"].includes(status)) return "InTransit";
          if (["4", "103", "101", "106", "107", "102", "104", "105", "119", "118"].includes(status)) return "Shipped";
          if (["11", "113"].includes(status)) return "Delivered";
          if (["26", "185", "340"].includes(status)) return "Cancelled";
          if (["189"].includes(status)) return "Lost";
          if (["12", "13", "14", "15", "16", "17", "22", "23", "210", "112"].includes(status)) return "UnDelivered";
          if (["214", "18", "19", "28", "198", "199", "201", "212"].includes(status)) return "RTO";
          return null;
        };
    
        const updatedOrders = data
          .map((order) => {
            const resolveStatusKey = (order) => {
              if (!isNaN(order.status)) return order.status;
              if (!isNaN(order.status_code)) return order.status_code;
              return order.status || order.status_code;
            };
    
            const statusKey = resolveStatusKey(order);
            const order_status = mapStatusCodeToOrderStatus(statusKey);
    
            if (order_status) {
              return { ...order, order_status, reason: order.reason };
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
      // console.log(orders);

      try {
        const updatePromises = orders.map((order) => {
          // console.log(order);

          if (order.order_status === "RTO") {
            
          }

          const updateBody = {
            ...(order.order_status === "RTO"
              ? { ndrStatus: order.order_status }
              : { status: order.order_status }),
            reason:
              order.order_status === "UnDelivered"
                ? order.status_description
                : null,
          };
          // console.log(updateBody);

          return axios.put(
            `https://backend.shiphere.in/api/orders/updateOrderStatus/${order.orderId}`,
            updateBody,
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        });

        await Promise.all(updatePromises);

      } catch (error) {
        console.error("Error updating orders:", error);
        // message.error('Batch update failed.');
      }
    };

    fetchData();
    fetchOrders();
    const intervalId = setInterval(fetchData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [orders]);

  return (
    <div className="ndrContainer">
  <Tabs defaultActiveKey="tab1" size="large" className="custom-tabs">
    {tabsData.map((tab) => (
      <TabPane key={tab.key} tab={tab.tab} className="custom-tab-content">
        {tab.Component ? (
          <tab.Component
            dataSource={tab.dataSource}
            rowSelection={rowSelection}
            selectedRowKeys={selectedRowKeys}
            fetchOrders={fetchOrders}
            selectedOrderData={selectedOrderData}
          />
        ) : (
          <span>No component for this tab</span>
        )}
        <span className="selected-items">
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </TabPane>
    ))}
  </Tabs>
</div>

  );
};

export default NDR;
