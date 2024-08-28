import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaShoppingCart, FaHourglassHalf, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';  // Import icons

import "./dashboard.css";

import revenueData from '../../components/Chart/RevenueData.json';
import sourceData from '../../components/Chart/SourceData.json';
import TopDestinationsGraph from './TopDestinationsGraph'; 
import ShipmentStatusGraph from "./ShipmentStatusGraph";
import { useOrderContext } from "../../context/OrderContext";

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
  const {orders} = useOrderContext()
  const order = orders?.orders
  const cancelOrdersAmt = order?.filter(order => order.status === 'Cancelled');
const newOrdersAmt = order?.filter(order => order.status === 'New');
const inTransitOrdersAmt = order?.filter(order => order.status === 'InTransit');
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
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
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
                text: "Business Overview",
                font: {
                  size: 20
                }
              },
            },
          }}
        />
      </div>

      <div className="dataCard revenueCard">
        <Bar
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Revenue",
                data: revenueData.map((data) => data.revenue),
                backgroundColor: "rgba(43, 63, 229, 0.8)",
                borderColor: "rgba(43, 63, 229, 1)",
                borderWidth: 1,
              },
              {
                label: "Cost",
                data: revenueData.map((data) => data.cost),
                backgroundColor: "rgba(253, 135, 135, 0.8)",
                borderColor: "rgba(253, 135, 135, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Courier Partner Overview",
                font: {
                  size: 20
                }
              },
            },
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
