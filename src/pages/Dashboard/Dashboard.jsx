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

import "./dashboard.css";

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
  const cancelOrdersAmt = order?.filter(
    (order) => order.status === "Cancelled"
  );
  const newOrdersAmt = order?.filter((order) => order.status === "New");
  const inTransitOrdersAmt = order?.filter(
    (order) => order.status === "InTransit"
  );
  const ShippedOrdersAmt = order?.filter((order) => order.status === "Shipped");

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

      <div className="orderSummaryContainer">
        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{order?.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="orderIcon">
            <FaShoppingCart size={40} color="#2B3FE5" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{newOrdersAmt?.length}</h3>
            <p>Pending Orders</p>
          </div>
          <div className="orderIcon">
            <FaHourglassHalf size={40} color="#FAC013" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{cancelOrdersAmt?.length}</h3>
            <p>Cancelled Orders</p>
          </div>
          <div className="orderIcon">
            <FaTimesCircle size={40} color="#FD8787" />
          </div>
        </div>

        <div className="orderSummaryCard">
          <div className="orderSummary">
            <h3>{inTransitOrdersAmt?.length}</h3>
            <p>Completed Orders</p>
          </div>
          <div className="orderIcon">
            <FaCheckCircle size={40} color="#34A853" />
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
                  0,
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
