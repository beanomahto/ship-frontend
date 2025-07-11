import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Popover, Tabs, message } from "antd";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import { toWords } from "number-to-words";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { useWarehouseContext } from "../../context/WarehouseContext";
import useCancelShipment from "../../hooks/useCancelShipment";
import useCreateShipment from "../../hooks/useCreateShipment";
import useShipNowCost from "../../hooks/useShipNowCost";
import Logo from "../../utils/logo.png";
import BD from "../../utils/newlogo/bluedartlogo.png";
import AllOrderComponent from "./AllOrderComponent";
import BulkOrderDimension from "./BulkOrder/BulkDimension";
import BulkOrderUploadModal from "./BulkOrder/BulkOrder";
import NewOrderComponent from "./NewOrderComponent";
import ShipNowModel from "./ShipNow/ShipNowModel";
import ShipOrderComponent from "./ShipOrderComponent";
const { TabPane } = Tabs;
// import DLVRY from "../../utils/newlogo/delhivery.png";
import XPB from "../../utils/newlogo/Xpressbees.jpg";
import AS from "../../utils/newlogo/amazonShippinglogo.jpg";
import DLVRY from "../../utils/newlogo/delhivery.png";
import Dtdc from "../../utils/newlogo/dtdc.png";
import EE from "../../utils/newlogo/ecom-logo.jpg";
import Ekart from "../../utils/newlogo/ekartlogo.png";
import SF from "../../utils/newlogo/shadowfax.png";
import SM from "../../utils/shree-maruti.jpeg";
import DeliveredComponent from "./DeliveredComponent";
import InTranitComponent from "./InTransitComponent";
const { confirm } = Modal;

const partnerImages = {
  "Blue Dart": BD,
  Delhivery: DLVRY,
  "Amazon Shipping": AS,
  "Ecom Express": EE,
  Maruti: SM,
  Xpressbees: XPB,
  Ekart: Ekart,
  DTDC: Dtdc,
  Shadowfax: SF,
};

const Orders = () => {
  const { shipNowCost } = useShipNowCost();
  const { warehouse, fetchWarehouse } = useWarehouseContext();
  const { cancelOrder } = useCancelShipment();
  const { shipOrder, error } = useCreateShipment();
  const { orders, setOrders, fetchOrders } = useOrderContext();
  const { fetchBalance, balance } = useAuthContext();
  const { authUser } = useAuthContext();

  // states
  const [deliveryCosts, setDeliveryCosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBD, setModalVisibleBD] = useState(false);
  const [modalVisibleShipNow, setModalVisibleShipNow] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState([]);
  const [currentTab, setCurrentTab] = useState("tab1");
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentDeliveryCost, setCurrentDeliveryCost] = useState(null);
  const [loadingShippinglabel, setloadingShippinglabel] = useState(false);
  const [loadingInvoice, setloadingInvoice] = useState(false);
  const [loadingdownload, setloadingdownload] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // React State and Functionality
  const [email, setEmail] = useState("");
  //console.log(orders);
  //console.log(selectedOrderData);
  // models
  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showModalBD = () => setModalVisibleBD(true);
  const closeModalBD = () => setModalVisibleBD(false);
  const showModalShipNow = () => setModalVisibleShipNow(true);
  const closeModalShipNow = () => setModalVisibleShipNow(false);
  const start = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "process.env.url/api/integration/syncButton",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Sync successful", result);
        message.success("Sync successful");
        fetchOrders();
      } else {
        message.error("okokok");
        console.error("Sync failed", response);
      }
    } catch (error) {
      message.error("Sync Failed");
      console.error("Sync error", error);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    // //console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = newSelectedRowKeys.map((key) =>
      orders.orders.find((order) => order._id === key)
    );
    setSelectedOrderData(selectedData);
  };

  const handleShipNow = async (
    selectedRowKeys,
    selectedWarehouse,
    selectedDeliveryPartner
  ) => {
    setSelectedWarehouseId(selectedWarehouse);
    const selectedRows = selectedOrderData?.map((ordId) => ordId?._id);

    if (selectedRows.length === 0) {
      message.warning("Please select at least one order to ship.");
      return;
    }

    message.loading({
      content: "Processing shipment...",
      key: "processing",
      duration: 0,
    });

    try {
      const updatedOrders = [];
      const unmatchedOrders = [];

      for (const orderId of selectedRowKeys) {
        const order = orders?.orders.find((order) => order._id === orderId);
        if (!order) continue;

        let forwardCharge, codCharge, rtoCharge;

        try {
          const costData = await shipNowCost(orderId, selectedWarehouse?._id);
          console.log("Cost Data for Order:", costData);

          const matchedCost = costData?.cost?.find(
            (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
          );

          if (!matchedCost) {
            unmatchedOrders.push(order.orderId); // Track unmatched orders
            continue;
          }

          forwardCharge = matchedCost.forwardCost;
          codCharge = matchedCost.codCost;
          rtoCharge = matchedCost.rtoCost;
        } catch (error) {
          console.error("Error in shipOrder or shipNowCost:", error);
          message.error(
            "Failed to calculate shipping cost or ship order. Please try again."
          );
          continue;
        }

        let awb = null;
        let shipid = null;
        try {
          // Call `shipOrder` to ship the order and get AWB
          const response = await shipOrder(
            order,
            selectedWarehouse,
            selectedDeliveryPartner.name
          );

          console.log("line373", selectedDeliveryPartner.name);
          console.log("Ship Order response", response);

          awb = response?.awb;

          if (selectedDeliveryPartner.name === "Shree Maruti") {
            awb = response.bookingResponse?.data?.data?.awbNumber;
            shipid = response?.shipid;
          }

          if (selectedDeliveryPartner.name === "Amazon Shipping") {
            shipid = response?.shipid;
          }

          console.log("Generated AWB:", awb);
          console.log("generated shipid", shipid);

          if (!awb) {
            message.error(
              `Failed to generate AWB for order ${order.orderId}. Skipping...`
            );
            continue; // Skip deductions and updates for this order
          }

          message.success(`AWB generated for order ${order.orderId}`);
        } catch (error) {
          console.error("Error generating AWB:", error);
          message.error(
            `Error shipping order ${order.orderId}. Please try again.`
          );
          continue;
        }

        if (forwardCharge === undefined || codCharge === undefined) {
          message.error(
            `No cost found for delivery partner for order ${orderId}.`
          );
        }

        const gstRate = 1.8 / 100;
        const forwardChargeWithGST = forwardCharge * 1.18;
        const codChargeWithGST = codCharge * (1 + gstRate);
        const rtoChargeWithGST = rtoCharge * (1 + gstRate);

        // Update order status only if AWB is generated
        console.log(
          "selectedWarehouse?._id-----------",
          selectedWarehouse?._id
        );
        await fetch(`${process.env.REACT_APP_API_URL}/api/orders/updateOrderStatus/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            awb: awb,
            shippingPartner: selectedDeliveryPartner.name,
            warehouse: selectedWarehouse?._id,
            status: "Shipped",
            shippingCost: forwardChargeWithGST,
            rtoCost: rtoChargeWithGST,
            codCost: codChargeWithGST,
            shipid: shipid,
          }),
        });

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
          try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/decreaseAmount`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
              body: JSON.stringify(walletRequest),
            });
          } catch (error) {
            console.error("Error deducting wallet amount:", error);
            message.error(
              `Failed to deduct wallet amount for order ${order.orderId}`
            );
          }
        }

        updatedOrders.push({ ...order, status: "Shipped" });
      }

      if (unmatchedOrders.length > 0) {
        message.warning(
          `Orders ${unmatchedOrders.join(
            ", "
          )} do not match the selected delivery partner and were not shipped.`
        );
      }

      fetchOrders();
      fetchBalance();
      const newOrdersCopy = orders.orders.filter(
        (order) => !selectedRows.includes(order._id)
      );
      setOrders({
        orders: newOrdersCopy.concat(updatedOrders),
      });

      message.success({
        content: "Orders shipped successfully!",
        key: "processing",
      });
    } catch (error) {
      console.error("Error processing shipment:", error);
      message.error({
        content: "Failed to process the shipment. Please try again.",
        key: "processing",
      });
    } finally {
      setSelectedRowKeys([]);
      closeModalShipNow();
    }
  };

  const exportToExcel = () => {
    setloadingdownload(true);
    const ordersToExport =
      selectedRowKeys.length > 0
        ? orders.orders.filter((order) => selectedRowKeys.includes(order._id))
        : orders.orders;

    if (ordersToExport.length === 0) {
      message.warning("No orders available to export.");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(ordersToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "Orders.xlsx");
    setloadingdownload(false);
  };

  const dataSourceWithKeys =
    orders?.orders?.map((order) => ({
      ...order,
      key: order._id,
      order: order,
    })) || [];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // onSelect: showModalShipNow,
  };
  // //console.log(rowSelection);
  const hasSelected = selectedRowKeys.length > 0;
  // //console.log(dataSourceWithKeys);

  const newOrdersAmt = dataSourceWithKeys?.filter(
    (order) => order.status === "New" || order.status === "Cancelled"
  );
  const shipOrdersAmt = dataSourceWithKeys?.filter(
    (order) => order.status === "Shipped"
  );
  const inTransitOrdersAmt = dataSourceWithKeys?.filter(
    (order) => order.status === "InTransit"
  );
  const deliveredOrdersAmt = dataSourceWithKeys?.filter(
    (order) => order.status === "Delivered"
  );
  const outfordeliveryOrders = dataSourceWithKeys?.filter(
    (order) =>
      order?.shipmentDetails.status_code === "121" ||
      order?.shipmentDetails.status_code === "120"
  );

  const tabsData = [
    {
      key: "tab1",
      tab: `New Orders (${newOrdersAmt?.length})`,
      Component: NewOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab2",
      tab: `Ship Orders (${shipOrdersAmt?.length})`,
      Component: ShipOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab3",
      tab: `In Transit (${inTransitOrdersAmt?.length})`,
      Component: InTranitComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab4",
      tab: `All Orders (${dataSourceWithKeys?.length})`,
      Component: AllOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: "tab5",
      tab: `Delivered (${deliveredOrdersAmt?.length})`,
      Component: DeliveredComponent,
      dataSource: dataSourceWithKeys,
    },
    // {
    //   key: "tab6",
    //   tab: `Out For Delivery (${outfordeliveryOrders?.length})`,
    //   Component: OutForDelivery,
    //   dataSource: dataSourceWithKeys,
    // },
  ];

  //console.log(tabsData);
  //console.log(selectedOrderData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/smartship/getcurrentstatus`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const jsonObj = await res.json();
        // console.log(jsonObj);

        const data = jsonObj?.data?.shipmentDetails;

        // console.log(data.map((ok) => ok.status + "-----" + ok.client_order_reference_id));
        console.log(data.filter((ok) => ok.client_order_reference_id === "67"));

        const mapStatusCodeToOrderStatus = (status) => {
          // console.log(status);

          if (
            [
              "27",
              "30",
              "10",
              "59",
              "121",
              "108",
              "126",
              "108",
              "109",
              "110",
              "122",
              "123",
              "124",
              "125",
              "126",
              "133",
              "120",
              "207",
              "209",
              "215",
            ].includes(status)
          )
            return "InTransit";
          if (
            [
              "4",
              "103",
              "101",
              "106",
              "107",
              "102",
              "104",
              "105",
              "119",
              "118",
            ].includes(status)
          )
            return "Shipped";
          if (["11", "113"].includes(status)) return "Delivered";
          if (
            status === "340" ||
            status === "185" ||
            status === "Pickup cancelled by shipper" ||
            status === "Pickup cancelled by ecom"
          )
            return "Cancelled";
          if (["189"].includes(status)) return "Lost";
          if (
            [
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "22",
              "23",
              "210",
              "112",
            ].includes(status)
          )
            return "UnDelivered";
          return null;
        };

        const updatedOrders = data
          .map((order) => {
            // console.log(order);

            const resolveStatusKey = (order) => {
              if (/^\d+$/.test(order.status)) return order.status;
              if (/^\d+$/.test(order.status_code)) return order.status_code;

              return order.status || order.status_code;
            };

            const statusKey = resolveStatusKey(order);
            const order_status = mapStatusCodeToOrderStatus(statusKey);
            // console.log(order_status);

            if (order_status) {
              return { ...order, order_status, reason: order.reason };
            }
            return null;
          })
          .filter((order) => order !== null);

        if (updatedOrders?.length > 0) {
          await updateMultipleOrders(updatedOrders);
          // console.log(updatedOrders);
        } else {
          console.log("No orders to update: all statusCodes were invalid.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const updateMultipleOrders = async (orders) => {
      try {
        const batchData = orders.map((order) => ({
          orderId: order.orderId,
          status: order.order_status,
          reason:
            order.order_status === "UnDelivered"
              ? order.status_description
              : null,
          ndrstatus:
            order.order_status === "UnDelivered"
              ? "Required"
              : order.order_status === "Lost"
              ? "Lost"
              : null,
        }));

        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/orders/updateMultipleOrderStatus`,
          { updates: batchData },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        console.log("✅ Orders updated in batch.");
      } catch (error) {
        console.error("❌ Batch update failed:", error);
      }
    };

    fetchData();
    fetchOrders();
    const intervalId = setInterval(fetchData, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  const cancelShipment = async () => {
    console.log("at cancel shipment line 526");
    if (selectedRowKeys.length === 0) {
      message.error("No orders selected");
      return;
    }
    setIsDisabled(true);

    const token = localStorage.getItem("token");

    try {
      console.log("selectedOrderData:", selectedOrderData);
      const test = await cancelOrder(selectedOrderData);

      console.log("test:", test);
      let counter = 0;
      for (const orderId of selectedRowKeys) {
        const order = selectedOrderData.find((order) => order._id === orderId);
        console.log("order 546", order);
        if (
          order.awb == "false" ||
          test[counter]?.data?.order_cancellation_details?.successful ||
          test[counter]?.data?.status == true ||
          test[counter]?.data?.status == 200 ||
          test[counter]?.message == "Shipment canceled successfully"
        ) {
          console.log("at line 540 and counter is " + counter);

          // try {
          //   const cancelResponse = await axios.put(
          //     `https://backend.shiphere.in/api/orders/updateOrderStatus/${orderId}`,
          //     { status: "Cancelled" },
          //     { headers: { Authorization: `${token}` } }
          //   );
          console.log("current orderId", orderId);

          try {
            // console.log("cancelResponse", cancelResponse);

            console.log("hello");
            const walletRequestBodies = [
              {
                userId: order.seller._id,
                credit: order.shippingCost,
                remark: `Credit charges for order ${order.orderId}`,
                orderId: order._id,
              },
            ];
            let codCharge = 0;
            codCharge = order.codCost;
            if (codCharge > 0) {
              walletRequestBodies.push({
                credit: codCharge,
                userId: order.seller._id,
                remark: `COD charge for order ${order.orderId}`,
                orderId: order._id,
              });
            }
            for (const walletRequestBody of walletRequestBodies) {
              const walletResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/transactions/increaseAmount`,
                walletRequestBody,
                { headers: { Authorization: `${token}` } }
              );

              if (walletResponse.status === 200) {
                console.log("wallet updated successfully");
                // Wallet updated successfully
              } else {
                message.error(
                  `Failed to update wallet for order ${order.orderId}`
                );
              }
            }

            setTimeout(() => {
              setIsDisabled(false);
            }, 2000);

            const cancelResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/api/orders/updateOrderStatus/${orderId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                  status: "Cancelled",
                }),
              }
            );
          } catch (error) {
            console.error(
              `Error while processing order ${order.orderId}:`,
              error
            );
            message.error(
              `Error occurred while canceling order ${order.orderId}`
            );
          }
        } else {
          console.log("1:", order.awb);
          console.log("2:", test[counter].data);
          console.log("3", test[counter].data?.status == true);
          console.log("error at line 575 cancel order");
        }
        counter++;
      }

      await fetchOrders();
      await fetchBalance();
      setSelectedRowKeys([]);
      message.success("Orders cancelled and amounts updated successfully");
    } catch (error) {
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      message.error("Failed to cancel orders");
    }
  };

  useEffect(() => {
    const fetchDeliveryCost = async () => {
      if (selectedOrderId) {
        setModalLoading(true);
        const costResponse = await shipNowCost(
          selectedOrderId,
          warehouse?.warehouses?.[0]?._id
        );
        console.log("-------costResponse", costResponse);

        if (costResponse.success) {
          setDeliveryCosts(costResponse.cost || []);
        } else {
          alert(costResponse.error || "Failed to fetch delivery cost");
        }
        setModalLoading(false);
      }
    };
    fetchDeliveryCost();
  }, [selectedOrderId, warehouse]);
  //console.log(selectedRowKeys);

  function generateLabelHTML(labelData) {
    console.log(labelData);

    const partnerLogo = labelData?.shippingPartner
      ? partnerImages[labelData.shippingPartner] || ""
      : "";
    return `
        <style>
        .label-container {
          font-weight: bold;
          border: 1px solid black;
          margin:0.5rem;
        }
        .label-section {
          margin-bottom: 0.5rem;
        }
          .companySection{
           margin-bottom: 0.5rem;
           position:relative;
           width:100%;
              height:auto;
           display:flex;
        
            
          }
           .companyName{
           position:relative;
           border:1px solid black;
           width:50%;
           display:flex;
           align-items:center;
           justify-content:center;
           }
           .companylogo{
           position:relative;
          border:1px solid black;
           width:50%;
           display:flex;
           flex-direction:column;
           align-items:center;
           justify-content:center;
              padding-bottom:4px;
           }
           .companylogo p{
           font-size:10px;
           }
           .companylogo img{
           height:35px;
           }
        .labelSection img {
        padding:5px 0px;
          width: 10rem;
        }
          p{
           font-weight: 500;
          }
        .label-section div {
          margin-bottom: 0.5rem;
        }
          .OrderSection{
          margin-bottom: 0.5rem;
           position:relative;
           width:100%;
           height:auto;
           display:flex;
          }
          .orderDetail{
          position:relative;
          border:1px solid black;
          width:33%;
          display:flex;
          flex-direction:column;
          align-items:center;
          
          padding:7px;
          }

      </style>
      <div class="label-container">
        <div class="companySection">
          <div class="companyName">
          <img src="${Logo}" style="width: 70px;"/>
            
          </div>
          <div class="companylogo">
          <p style="margin-top: 2px;"> Delivered By:  </p>
            ${
              partnerLogo
                ? `<img src="${partnerLogo}" alt="${labelData.shippingPartner}" style="width: 100px;"/>`
                : `<p>${labelData?.shippingPartner || ""}</p>`
            }
              
          </div>
        </div>

        <div style="${labelData?.logoUrl ? "display: flex;" : ""}">
          <div class="labelSection">
            <img src="data:image/png;base64,${
              labelData?.barcode || ""
            }" alt="Barcode" />
          </div>
        </div>

        <div class="labelSection">
          <p><strong>Ship To:</strong> <span> ${
            labelData?.customerName || ""
          }</span></p>
          <p>${labelData?.address?.address || ""} ${
      labelData?.address?.city || ""
    } ${labelData?.address?.state || ""}</p>
          <p><strong>PIN:</strong> ${labelData?.address?.pincode || ""}</p>
        </div>
         
        <div class="OrderSection">
        <div class="orderDetail">
            <p><strong>Order Date</strong></p>
            <p>${
              moment(labelData?.invoiceDate).format("MMMM Do YYYY") || ""
            }</p>
        </div>
        ${
          labelData?.dimension
            ? `
          <div class="orderDetail">
          <p><strong>Dimensions</strong></p>
            <p><span>${labelData?.dimension?.length || ""} x ${
                labelData?.dimension?.breadth || ""
              } x ${labelData?.dimension?.height || ""}</span> CM</p>
        </div>
        `
            : `<div class="orderDetail">
          <p><strong></strong></p>
            <p><span></span></p>
        </div>`
        }
        ${
          labelData?.weight
            ? `
          <div class="orderDetail">
          <p><strong>Weight</strong></p>
          <p><span>${labelData?.weight || ""}</span> grm</p> 
          </div>
          `
            : `   <div class="orderDetail">
          <p><strong></strong></p>
          <p><span></span></p> 
          </div>`
        }
          </div>
        <div class="OrderSection">
          <div class="orderDetail">
            <p><strong>Order Id:</strong> </p><p>${
              labelData?.orderId || ""
            }</p> 
          </div>
          <div class="orderDetail">
            <p><strong>${labelData?.paymentType || ""}</strong></p>
            <p>${
              labelData?.amount ? `${labelData?.amount} INR` : ``
            }INR <span></span></p>
          </div>
          <div class="orderDetail">
            <p><strong>Price Total</strong></p>
                <p>${
                  labelData?.amount ? `${labelData?.amount} INR` : ``
                }INR <span></span></p>
            <p>Surface</p>
          </div>
        </div>
        ${
          labelData?.productName
            ? `
          <div style="display: flex;">
          <div class="labelSection" style="width: 12rem;">
          <p><strong>Product (QTY)</strong></p>
          </div>
          <div class="labelSection" style="width: 12rem;">
            <p>${labelData?.productName || ""}<span>(${
                labelData?.productDetail?.quantity || ""
              })</span></p>
              </div>
              `
            : `  <div style="display: flex;">
          <div class="labelSection" style="width: 12rem;">
          <p><strong></p>
          </div>
          <div class="labelSection" style="width: 12rem;">
            <p></span></p>
              </div>`
        }
        </div>
        ${
          labelData?.amount
            ? `
          <div style="display: flex;">
          <div class="labelSection" style="width: 12rem;">
            <p><strong>Total INR</strong></p>
          </div>
          <div class="labelSection" style="width: 12rem;">
          <p>${labelData?.amount || ""}</p>
          </div>
          </div>
          `
            : `<div style="display: flex;">
          <div class="labelSection" style="width: 12rem;">
            <p><strong></strong></p>
          </div>
          <div class="labelSection" style="width: 12rem;">
          <p></p>
          </div>
          </div>`
        }
        ${
          labelData?.returnWarehouse
            ? `
          <div class="labelSection">
          <p><strong>Return Address:</strong></p>
          <p>${labelData?.returnWarehouse?.address || ""} ${
                labelData?.returnWarehouse?.state || ""
              } ${labelData?.returnWarehouse?.city || ""} ${
                labelData?.returnWarehouse?.country || ""
              }</p>
      </div>
      `
            : `  <div class="labelSection">
          <p><strong></strong></p>
          <p></p>
      </div>`
        }

        <p>Powered by <strong>ShipHere</strong></p>
      </div>
      `;
  }
  const downloadMultipleLabels = async () => {
    setloadingShippinglabel(true);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [4, 6],
    });

    const token = localStorage.getItem("token");
    let currentCount = 0;

    const batchSize = 5;

    const processBatch = async (batch, isLastBatch) => {
      const requests = batch.map((orderId) =>
        axios.get(`${process.env.REACT_APP_API_URL}/api/shipping/getlabel/${orderId}`, {
          headers: { Authorization: `${token}` },
        })
      );

      const responses = await Promise.all(requests);

      for (const [index, response] of responses.entries()) {
        try {
          const labelData = response.data;
          const labelHtml = generateLabelHTML(labelData);
          const labelContainer = document.createElement("div");
          labelContainer.style.position = "absolute";
          labelContainer.style.top = "-9999px";
          labelContainer.style.width = "400px"; // **Fixed Width for Consistency**
          labelContainer.style.height = "670px";
          labelContainer.innerHTML = labelHtml;
          document.body.appendChild(labelContainer);

          const scaleFactor = window.innerWidth < 768 ? 2.5 : 2;

          const canvas = await html2canvas(labelContainer, {
            scale: scaleFactor,
            useCORS: true,
          });

          const imgData = canvas.toDataURL("image/jpeg", 0.7);
          pdf.addImage(imgData, "JPEG", 0, 0, 4, 6);

          currentCount++;
          message.info(
            `Generated ${currentCount}/${selectedRowKeys.length} labels.`
          );

          const isLastLabelInBatch = index === batch.length - 1;
          const isLastLabelOverall = isLastBatch && isLastLabelInBatch;

          if (!isLastLabelOverall) {
            pdf.addPage();
          }

          document.body.removeChild(labelContainer);
        } catch (error) {
          console.error("Error generating label:", error.message);
          message.error(`Error generating label for order ID ${batch[index]}`);
        }
      }
    };

    try {
      for (let i = 0; i < selectedRowKeys.length; i += batchSize) {
        const batch = selectedRowKeys.slice(i, i + batchSize);
        const isLastBatch = i + batchSize >= selectedRowKeys.length;
        await processBatch(batch, isLastBatch);
      }

      pdf.save("labels.pdf");
      message.success("All labels downloaded successfully!");
    } catch (error) {
      console.error("Error downloading labels:", error);
      message.error("An error occurred while downloading labels.");
    } finally {
      // Set loading to false once the operation is complete
      setloadingShippinglabel(false);
    }
  };

  const getBase64ImageFromUrl = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Error converting image to base64:", error.message);
      return null;
    }
  };
  const downloadInvoices = async () => {
    setloadingInvoice(true);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = 595.28;
    const pageHeight = 841.89;

    const promises = selectedRowKeys.map((orderId) =>
      fetch(`${process.env.REACT_APP_API_URL}/api/shipping/getinvoice/${orderId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const invoiceData = data.invoiceData;
          //console.log(invoiceData);

          // Create a hidden div to render the invoice
          const invoiceDiv = document.createElement("div");
          // invoiceDiv.style.position = 'absolute';
          // invoiceDiv.style.left = '-9999px';
          invoiceDiv.style.width = `${pageWidth}px`;
          invoiceDiv.style.height = `${pageHeight}px`;
          // invoiceDiv.style.maxHeight = `${pageHeight}px`;
          invoiceDiv.style.padding = "20px";
          invoiceDiv.style.fontFamily = "Arial, sans-serif";
          // invoiceDiv.style.boxSizing = 'border-box';
          // invoiceDiv.style.overflow = 'hidden';
          const formattedInvoiceDate = moment(invoiceData.invoiceDate).format(
            "MMMM Do YYYY"
          );
          const formattedOrderDate = moment(invoiceData.orderDate).format(
            "MMMM Do YYYY"
          );

          console.log("halla bol--------------", invoiceData);

          const totalAmountInWords = toWords(invoiceData?.totalPrice);
          invoiceDiv.innerHTML = `
  <div class="invoice-container" style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #000;">
    
    <!-- Top header: Image in the left, logo text in the right -->
    <div class="invoice-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <!-- Top left image -->
      <div class="logo-image" style="width: 50%;">
        <img src=${Logo} alt="Logo" style="width: 100px; height: auto;" />
      </div>
      <!-- Top right text (logo) -->
    </div>
    
    <!-- Invoice Details Section (Sold By / Delivered To) -->
    <div class="invoice-section" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div class="sold-by" style="width: 48%; border: 1px solid #000; padding: 12px;">
        <h2 style="font-size: 14pt; margin-bottom: 10px; padding-left: 50px">Sold By:</h2>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">${invoiceData?.sellerName}</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">${invoiceData?.sellerAddress}</p>
        <p style="font-size: 10pt; margin: 0;">.</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">GSTIN No.: ${invoiceData?.sellerGSTIN}</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">Pincode : ${invoiceData?.order?.pincode}</p>
      </div>
      
      <div class="delivered-to" style="width: 48%; border: 1px solid #000; padding: 12px;">
        <h2 style="font-size: 14pt; margin-bottom: 10px;">Delivered To:</h2>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">${invoiceData?.customerName}</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">${invoiceData?.customerAddress}</p>
        <p style="font-size: 10pt; margin: 0;">.</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">Mobile No.: ${invoiceData?.customerPhone}</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">Shipped By.: ${invoiceData?.order?.shippingPartner}</p>
        <p style="font-size: 10pt; margin: 0; font-weight: 600;">Payment Method: ${invoiceData?.paymentMethod}</p>
      </div>
    </div>

    <!-- Invoice Number, Date, and Order Info -->
    <div class="invoice-details" style="border: 1px solid #000; display:flex; gap:.5rem; flex-direction:column; padding: 12px; margin-bottom: 20px;">
      <p style="font-size: 10pt; margin: 0; font-weight: 600;"><strong>Invoice No.:</strong> ${invoiceData.invoiceNumber}</p>
      <p style="font-size: 10pt; margin: 0; font-weight: 600;"><strong>Invoice Date:</strong> ${formattedInvoiceDate}</p>
      <p style="font-size: 10pt; margin: 0; font-weight: 600;"><strong>Order Date:</strong> ${formattedOrderDate}</p>
      <p style="font-size: 10pt; margin: 0; font-weight: 600;"><strong>Order ID:</strong> ${invoiceData?.order?.orderId}</p>
    </div>

    <!-- Itemized Table -->
    <div class="invoice-items" style="border: 1px solid #000;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 5px; background-color: #f4f4f4; font-size: 10pt;">Description</th>
            <th style="border: 1px solid #000; padding: 5px; background-color: #f4f4f4; font-size: 10pt;">Qty</th>
            <th style="border: 1px solid #000; padding: 5px; background-color: #f4f4f4; font-size: 10pt;">Dimensions</th>
            <th style="border: 1px solid #000; padding: 5px; background-color: #f4f4f4; font-size: 10pt;">Unit Price</th>
            <th style="border: 1px solid #000; padding: 5px; background-color: #f4f4f4; font-size: 10pt;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 5px; font-size: 10pt;">
              ${invoiceData?.productName}, SKU ${invoiceData?.sku}
            </td>
            <td style="border: 1px solid #000; padding: 5px; font-size: 10pt; font-weight: 600;">${invoiceData?.quantity}</td>
            <td style="border: 1px solid #000; padding: 5px; font-size: 10pt; font-weight: 600;">${invoiceData?.dimensions.length}x${invoiceData?.dimensions.breadth}x${invoiceData?.dimensions.height}</td>
            <td style="border: 1px solid #000; padding: 5px; font-size: 10pt; font-weight: 600;">${invoiceData?.unitPrice}</td>
            <td style="border: 1px solid #000; padding: 5px; font-size: 10pt; font-weight: 600;">${invoiceData?.totalPrice}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invoice Footer -->
    <div class="invoice-footer" style="border: 1px solid #000; padding: 12px; margin-top: 20px;">
      <p style="font-size: 10pt; font-weight: 600;">Net Amount Payable (In Words): <strong>${totalAmountInWords}</strong></p>
    </div>

    <!-- Terms Section -->
    <div class="invoice-terms" style="border: 1px solid #000; padding: 12px; margin-top: 100px;">
      <p style="font-size: 10pt; margin: 0; font-weight: 600;">All disputes are subject to Delhi jurisdiction only.</p>
      <p style="font-size: 10pt; margin: 0; font-weight: 600;">Goods once sold will only be taken back or exchanged as per the store's return policy.</p>
      <p style="font-size: 10pt; margin: 0; font-weight: 600;">Payment is due within 30 days from the invoice date.</p>
      <!-- Add more terms if needed -->
    </div>
  </div>
`;

          document.body.appendChild(invoiceDiv);

          return html2canvas(invoiceDiv, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            if (orderId !== selectedRowKeys[0]) {
              pdf.addPage();
            }

            while (heightLeft > 0) {
              pdf.addImage(
                imgData,
                "PNG",
                0,
                position,
                imgWidth,
                Math.min(imgHeight, pageHeight)
              );
              heightLeft -= pageHeight;
              position = heightLeft > 0 ? -pageHeight : 0;

              if (heightLeft > 0) {
                pdf.addPage();
              }
            }

            document.body.removeChild(invoiceDiv);
          });
        })
        .catch((error) => {
          console.error("Error generating invoice:", error);
        })
    );

    Promise.all(promises).then(() => {
      pdf.save("all_invoices.pdf");
      setloadingInvoice(false);
    });
  };
  const handleTabChange = (key) => {
    setCurrentTab(key);
    setSelectedRowKeys([]);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/deleteOrder/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      message.success("Order deleted successfully");
      fetchOrders(); // Refresh orders after deletion
    } catch (error) {
      console.error("Error deleting Order:", error);
      message.error("Failed to delete Order");
    }
  };

  const handleBulkDelete = () => {
    const { selectedRowKeys } = rowSelection; // Extract selected row keys
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning("No orders selected for deletion");
      return;
    }

    confirm({
      title: "Are you sure you want to delete the selected orders?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          // Use Promise.all to delete all selected orders
          const promises = selectedRowKeys.map((id) => handleDelete(id));
          await Promise.all(promises);
          message.success("Selected orders deleted successfully");
          fetchOrders(); // Refresh orders after deletion
        } catch (error) {
          console.error("Error during bulk deletion:", error);
          message.error("Failed to delete selected orders");
        }
      },
    });
  };

  const [visible, setVisible] = useState(false);

  const handleOpenChange = (newVisible) => {
    setVisible(newVisible);
  };

  const handleClose = (callback) => {
    setVisible(false); // Close the popover
    if (callback) callback(); // Execute the function passed (showModal or showModalBD)
  };

  const handleSendEmail = async () => {
    if (!email) {
      message.warning("Please enter an email.");
      return;
    }
    console.log("emailllll", email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.warning("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/movedelivered`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message || "Orders moved successfully.");
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to move orders.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("An unexpected error occurred.");
    }
  };

  //console.log(currentTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
        }}
        className="addorder"
      >
        {currentTab === "tab1" && (
          <Button
            type="primary"
            style={{
              alignSelf: "flex-start",
              borderRadius: "34px",
              fontFamily: "Poppins",
              fontSize: "1rem",
              fontWeight: "500",
            }}
            onClick={start}
            loading={loading}
          >
            Sync
          </Button>
        )}
        <div className="tab1_managingBtns">
          {authUser.role === "admin" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px", // Adds spacing between the input and button
              }}
            >
              <input
                type="email"
                placeholder="Enter email"
                style={{
                  padding: "8px 4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={handleSendEmail}
              >
                Submit
              </button>
            </div>
          )}
          {currentTab === "tab1" && (
            <Button
              style={{ borderRadius: "34px" }}
              disabled={!hasSelected && currentTab === "tab1"}
              onClick={showModalShipNow}
            >
              Ship Now
            </Button>
          )}
          {
            <div className="download_extra_box">
              <div className="download_extra">
                {(authUser.role === "admin" ||
                  (authUser.role !== "admin" &&
                    (currentTab === "tab1" || currentTab === "tab2"))) && (
                  <Button
                    type="primary"
                    shape="round"
                    onClick={exportToExcel}
                    icon={<DownloadOutlined />}
                    className="downloadBtn"
                    size="middle"
                    style={{ marginRight: "10px" }}
                    disabled={loadingdownload}
                  >
                    {loadingdownload ? "Downloading..." : "Download"}
                  </Button>
                )}

                {currentTab === "tab2" && (
                  <div className="tab2_managingBtns">
                    {authUser.role === "admin" && (
                      <div
                        style={{
                          display: "flex",
                        }}
                      ></div>
                    )}
                    <Button
                      disabled={
                        selectedRowKeys.length === 0 || loadingShippinglabel
                      }
                      style={{ borderColor: "black", borderRadius: "50px" }}
                      onClick={downloadMultipleLabels}
                    >
                      {loadingShippinglabel
                        ? "Downloading..."
                        : " Shipping Label"}
                    </Button>
                    <Button
                      disabled={selectedRowKeys.length === 0 || loadingInvoice}
                      style={{ borderColor: "gray", borderRadius: "50px" }}
                      onClick={downloadInvoices}
                    >
                      {loadingInvoice ? "Downloading..." : " Invoice"}
                    </Button>
                    <Button
                      disabled={isDisabled}
                      style={{ borderColor: "red", borderRadius: "50px" }}
                      onClick={cancelShipment}
                    >
                      Cancel Shipment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          }

          {currentTab === "tab1" && (
            <>
              <Button
                style={{
                  backgroundColor: "#668fa0",
                  color: "white",
                  border: "2px solid #a5ffe7",
                  boxShadow: "inherit",
                  borderRadius: "35px",
                  padding: "10px 20px",
                  // fontSize: '16px',
                  transition: "background-color 0.3s",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                <Link to="singleorder">Single Order</Link>
              </Button>
              <Popover
                trigger={"click"}
                placement="leftTop"
                open={visible}
                onVisibleChange={handleOpenChange}
                title={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "1rem",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      style={{ borderRadius: "35px", fontFamily: "Poppins" }}
                      onClick={() => handleClose(showModal)}
                    >
                      Bulk Orders
                    </Button>
                    <Button
                      style={{ borderRadius: "35px", fontFamily: "Poppins" }}
                      onClick={() => handleClose(showModalBD)}
                    >
                      Bulk Dimensions
                    </Button>
                  </div>
                }
              >
                <Button
                  style={{ borderRadius: "35px", fontFamily: "Poppins" }}
                  onClick={() => setVisible(!visible)}
                >
                  Bulk Actions
                </Button>
              </Popover>
            </>
          )}
          {(currentTab === "tab3" ||
            currentTab === "tab2" ||
            currentTab === "tab1" ||
            currentTab === "tab4" ||
            currentTab === "tab5") &&
            authUser.role === "admin" && (
              <div
                style={{
                  display: "flex",
                }}
              >
                {rowSelection.selectedRowKeys.length > 0 && (
                  <Button
                    type="danger"
                    onClick={handleBulkDelete}
                    className="delete_btn"
                    disabled={rowSelection.selectedRowKeys.length === 0}
                    style={{
                      marginBottom: "16px",
                      backgroundColor: "white",
                      borderColor: "#ff4d4f",
                      fontWeight: "500",
                      borderRadius: "8px",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease", // Smooth transition on hover
                    }}
                    icon={<span className="delete-btn-span-icon">🗑️</span>}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)"; // Reset scale
                    }}
                  >
                    Delete Selected Orders
                  </Button>
                )}
              </div>
            )}

          <BulkOrderUploadModal visible={modalVisible} onClose={closeModal} />
          <BulkOrderDimension visible={modalVisibleBD} onClose={closeModalBD} />
          <ShipNowModel
            hasSelected={hasSelected}
            selectedRowKeys={selectedRowKeys}
            visible={modalVisibleShipNow}
            onClose={closeModalShipNow}
            onShipNow={handleShipNow}
          />
        </div>
      </div>
      <Tabs
        defaultActiveKey="tab1"
        size="large"
        className="tabs"
        onChange={handleTabChange}
      >
        {tabsData.map((tab) => (
          <TabPane key={tab.key} tab={tab.tab}>
            {tab.Component ? (
              <tab.Component
                fetchWarehouse={fetchWarehouse}
                tab={tab}
                dataSource={tab.dataSource}
                // rowSelection={tab.key === 'tab1' ? rowSelection : null}
                rowSelection={rowSelection}
                fetchOrders={fetchOrders}
                loading={loading}
                selectedWarehouseId={selectedWarehouseId}
                warehouse={warehouse}
                setModalLoading={setModalLoading}
                modalLoading={modalLoading}
                deliveryCosts={deliveryCosts}
                setDeliveryCosts={setDeliveryCosts}
                setSelectedOrderId={setSelectedOrderId}
                selectedOrderId={selectedOrderId}
                setCurrentDeliveryCost={setCurrentDeliveryCost}
                currentDeliveryCost={currentDeliveryCost}
                selectedOrderData={selectedOrderData}
              />
            ) : (
              <span>No component for this tab</span>
            )}
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Orders;
