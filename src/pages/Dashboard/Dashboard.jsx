import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaShoppingCart,
  FaTimesCircle,
} from "react-icons/fa";
import { FcShipped } from "react-icons/fc";
import { MdAutorenew } from "react-icons/md";
import "./dashboard.css";

import { useDeliveryPartner } from "../../context/DeliveryPartners";
import { useOrderContext } from "../../context/OrderContext";
import ShipmentStatusGraph from "./ShipmentStatusGraph";
import TopDestinationsGraph from "./TopDestinationsGraph";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Dashboard = () => {
  const { orders } = useOrderContext();
  const { deliveryPartners } = useDeliveryPartner();
  const [remittanceData, setRemittanceData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("All Time");

  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // End of the day
  const oneWeekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000); // 1 week ago
  const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1)); // 1 month ago

  const filterDataByDate = (startDate, endDate, data, key = "updatedAt") =>
    data?.filter(
      (item) =>
        new Date(item[key]) >= startDate && new Date(item[key]) <= endDate
    );

  const calculateStartDate = (timeRange) => {
    switch (timeRange) {
      case "Today":
        return todayStart;
      case "1 Week":
        return oneWeekAgo;
      case "1 Month":
        return oneMonthAgo;
      default:
        return new Date(0); // Epoch for all-time data
    }
  };

  useEffect(() => {
    const fetchRemittance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "process.env.url/api/remittance/getremittance",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await res.json();
        setRemittanceData(data);
      } catch (error) {
        console.error("Failed to fetch remittance data:", error);
      }
    };
    fetchRemittance();
  }, []);

  const remmitance = remittanceData.remittances;
  const order = orders?.orders;

  const cancelOrdersAmt = order?.filter(
    (order) => order.status === "Cancelled"
  );
  const newOrdersAmt = order?.filter((order) => order.status === "InTransit");
  const inTransitOrdersAmt = order?.filter(
    (order) => order.status === "Delivered"
  );
  const totalnewOrdersAmt = order?.filter((order) => order.status === "New");
  const ShippedOrdersAmt = order?.filter((order) => order.status === "Shipped");
  const RTOOrdersAmt = order?.filter(
    (order) => order.ndrstatus === "RTO" || order.ndrstatus === "RtoDone"
  );

  const filteredOrders = filterDataByDate(
    calculateStartDate(selectedTimeRange),
    todayEnd,
    orders?.orders
  );
  const filteredRemittances = remmitance?.filter((remittance) => {
    const remittanceDate = new Date(remittance.generatedDate);
    return (
      remittanceDate >= calculateStartDate(selectedTimeRange) &&
      remittanceDate <= todayEnd
    );
  });
  const shippedOrders = filteredOrders?.filter(
    (filteredOrders) => filteredOrders.status === "Shipped"
  );
  const rtoOrders = filteredOrders?.filter(
    (order) => order.ndrstatus === "RTO" || order.ndrstatus === "RtoDone"
  );

  const doughnutData = {
    labels: ["Shipped Orders", "COD Remittance", "RTO"],
    datasets: [
      {
        label: "Order Status Overview",
        data: [
          shippedOrders?.length || 0,
          filteredRemittances?.length || 0,
          rtoOrders?.length || 0,
        ],
        backgroundColor: [
          "rgba(43, 63, 229, 0.8)",
          "rgba(250, 192, 19, 0.8)",
          "rgba(253, 135, 135, 0.8)",
        ],
        borderColor: [
          "rgba(43, 63, 229, 1)",
          "rgba(250, 192, 19, 1)",
          "rgba(253, 135, 135, 1)",
        ],
      },
    ],
  };

  const todayNewOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return (
      createdAt >= todayStart && createdAt <= todayEnd && order.status === "New"
    );
  });
  const todayShippedOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return (
      createdAt >= todayStart &&
      createdAt <= todayEnd &&
      order.status === "Shipped"
    );
  });
  const todayCompletedOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return (
      createdAt >= todayStart &&
      createdAt <= todayEnd &&
      order.status === "Delivered"
    );
  });
  const todayPendingOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return (
      createdAt >= todayStart &&
      createdAt <= todayEnd &&
      order.status === "InTransit"
    );
  });
  const todayCancelledOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return (
      createdAt >= todayStart &&
      createdAt <= todayEnd &&
      order.status === "Cancelled"
    );
  });
  const todayTotalOrders = order?.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= todayStart && createdAt <= todayEnd;
  });

  const shippingPartnerCounts = order?.reduce((acc, curr) => {
    const partnerName = curr.shippingPartner;
    if (partnerName) {
      acc[partnerName] = (acc[partnerName] || 0) + 1;
    }
    return acc;
  }, {});

  const shippingCostSums = order?.reduce((acc, curr) => {
    const partnerName = curr.shippingPartner;
    const cost = curr.shippingCost || 0;
    if (partnerName) {
      acc[partnerName] = (acc[partnerName] || 0) + cost;
      acc[partnerName] = parseFloat(acc[partnerName].toFixed(2));
    }
    return acc;
  }, {});

  const allPartnersData = deliveryPartners?.deliveryPartners?.map(
    (partner) => ({
      name: partner.name,
      count: shippingPartnerCounts?.[partner.name] || 0,
      shippingCost: shippingCostSums?.[partner.name] || 0,
    })
  );

  const barChartData = {
    labels: allPartnersData?.map((partner) => partner.name),
    datasets: [
      {
        label: "Order Count",
        data: allPartnersData?.map((partner) => partner.count),
        backgroundColor: "rgba(43, 63, 229, 0.8)",
        borderColor: "rgba(43, 63, 229, 1)",
        borderWidth: 1,
      },
      {
        label: "Shipping Cost",
        data: allPartnersData?.map((partner) => partner.shippingCost),
        backgroundColor: "rgba(250, 192, 19, 0.8)",
        borderColor: "rgba(250, 192, 19, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Courier Partner Overview",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mainCharts">
      <div className="dataCard topDestinationsCard">
        <div className="topDestinationsInnerContainer">
          <TopDestinationsGraph />
          <span className="chart-separator"></span>
          <ShipmentStatusGraph />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          margin: "0, auto",
          width: "96%",
          alignItems: "center",
        }}
      >
        <div
          className="orderSummaryContainer1"
          style={{
            width: "98%",
            gap: "0.5rem",
            position: "relative",
            marginBottom: "2rem",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
          // style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{totalnewOrdersAmt?.length}</h3>
              <p>New Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayNewOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <MdAutorenew size={50} color="#2B3FE5" />
            </div>
          </div>

          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{ShippedOrdersAmt?.length}</h3>
              <p>Shipped Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayShippedOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <FcShipped size={50} color="#FD8787" />
            </div>
          </div>

          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{newOrdersAmt?.length}</h3>
              <p>Pending Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayPendingOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <FaHourglassHalf size={50} color="#FAC013" />
            </div>
          </div>

          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{inTransitOrdersAmt?.length}</h3>
              <p>Completed Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayCompletedOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <FaCheckCircle size={50} color="#34A853" />
            </div>
          </div>

          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{cancelOrdersAmt?.length}</h3>
              <p>Cancelled Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayCancelledOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <FaTimesCircle size={50} color="#FD8787" />
            </div>
          </div>

          <div
            className="orderSummaryCard"
            style={{
              backgroundColor: "rgb(227, 225, 225)",
              height: "11rem",
              border: "1px solid black",
            }}
          >
            <div className="orderSummary">
              <h3>{order?.length}</h3>
              <p>Total Orders</p>
              <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
                <strong>Today: </strong>
                {todayTotalOrders?.length || 0}
              </p>
            </div>
            <div className="orderIcon">
              <FaShoppingCart size={50} color="#2B3FE5" />
            </div>
          </div>
        </div>

        <div
          style={{
            width: "98%",
            margin: "0, auto",
            position: "relative",
            backgroundColor: "rgb(227, 225, 225)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid black",
            borderRadius: "12px",
          }}
        >
          {/* Dropdown for time range selection */}
          <div
            className="dropdownContainer"
            style={{ padding: "20px", display: "flex", gap: "1rem" }}
          >
            <label htmlFor="timeRange">Customise Your Graph: </label>
            <select
              id="timeRange"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              style={{ height: "fit-content", margin: "auto", padding: "5px" }}
            >
              <option value="Today">Today</option>
              <option value="1 Week">This Week</option>
              <option value="1 Month">This Month</option>
              <option value="All Time">Overall</option>
            </select>
          </div>

          <div
            className="dataCard categoryCard"
            style={{
              position: "relative",
              width: "90%",
              backgroundColor: "rgb(227, 225, 225)",
            }}
          >
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Business Overview: Shipped and In Transit Orders",
                    font: {
                      size: 20,
                    },
                  },
                  datalabels: {
                    display: true,
                    color: "white",
                    font: {
                      weight: "bold",
                    },
                    formatter: (value) => `${value}`,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="dataCard revenueCard">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
