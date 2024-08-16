import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, 
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "./dashboard.css";

import revenueData from '../../components/Chart/RevenueData.json';
import sourceData from '../../components/Chart/SourceData.json';
import TopDestinationsGraph from './TopDestinationsGraph'; 
import ShipmentStatusGraph from "./ShipmentStatusGraph";

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
  return (
    <div className="mainCharts">
      <div className="dataCard topDestinationsCard">
        <TopDestinationsGraph /> 
      </div>

      <div className="dataCard topDestinationsCard">
        <ShipmentStatusGraph />
      </div>

      <div className="dataCard customerCard">
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "#dcfce7",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Revenue Source",
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
