import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  FaShoppingCart,
  FaHourglassHalf,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";
import "./dashboard.css";
import { FcShipped } from "react-icons/fc";

import sourceData from "../../components/Chart/SourceData.json";
import TopDestinationsGraph from "./TopDestinationsGraph";
import ShipmentStatusGraph from "./ShipmentStatusGraph";
import { useOrderContext } from "../../context/OrderContext";
import { useDeliveryPartner } from "../../context/DeliveryPartners";

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
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // End of the day

  useEffect(() => {
    const fetchRemittance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://backend.shiphere.in/api/remittance/getremittance",
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
  console.log(order);
  const cancelOrdersAmt = order?.filter(
    (order) => order.status === "Cancelled"
  );
  const newOrdersAmt = order?.filter((order) => order.status === "InTransit");
  const inTransitOrdersAmt = order?.filter(
    (order) => order.status === "Delivered"
  );
  const totalnewOrdersAmt = order?.filter((order) => order.status === "New");
  console.log(totalnewOrdersAmt);
  const ShippedOrdersAmt = order?.filter((order) => order.status === "Shipped");
  const RTOOrdersAmt = order?.filter(
    (order) => order.ndrstatus === "RTO" || order.ndrstatus === "RtoDone"
  );

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
        <TopDestinationsGraph />
      </div>

      <div className="dataCard topDestinationsCard">
        <ShipmentStatusGraph />
      </div>

      <div
        className="orderSummaryContainer1"
        // style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{totalnewOrdersAmt?.length}</h3>
            <p>New Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayNewOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <MdAutorenew size={40} color="#2B3FE5" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{ShippedOrdersAmt?.length}</h3>
            <p>Shipped Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayShippedOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <FcShipped size={40} color="#FD8787" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{newOrdersAmt?.length}</h3>
            <p>Pending Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayPendingOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <FaHourglassHalf size={40} color="#FAC013" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{inTransitOrdersAmt?.length}</h3>
            <p>Completed Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayCompletedOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <FaCheckCircle size={40} color="#34A853" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{cancelOrdersAmt?.length}</h3>
            <p>Cancelled Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayCancelledOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <FaTimesCircle size={40} color="#FD8787" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{order?.length}</h3>
            <p>Total Orders</p>
            <p style={{ fontWeight: "bolder", fontSize: "15px" }}>
              <strong>Today: </strong>
              {todayTotalOrders?.length || 0}
            </p>
          </div>
          <div className="orderIcon">
            <FaShoppingCart size={40} color="#2B3FE5" />
          </div>
        </div>
      </div>

      <div className="dataCard categoryCard">
        <Doughnut
          data={{
            labels: ["Shipped Orders", "COD Remmitance", "RTO"],
            datasets: [
              {
                label: "Order Status Overview",
                data: [
                  ShippedOrdersAmt?.length || 0,
                  remmitance?.length || 0,
                  RTOOrdersAmt?.length || 0,
                ],
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 1.8)",
                  "rgba(250, 192, 19, 1.8)",
                  "rgba(253, 135, 135,1.8)",
                ],
              },
            ],
          }}
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

      <div className="dataCard revenueCard">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
