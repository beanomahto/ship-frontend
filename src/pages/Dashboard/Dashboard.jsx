import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, PolarArea, Pie } from "react-chartjs-2"; // Import Pie
// import IndiaMapChart from "./IndiaMapChart"; // Import the new component

import "./dashboard.css";

import revenueData from '../../components/Chart/RevenueData.json';
import sourceData from '../../components/Chart/SourceData.json';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Dashboard = () => {
  const polarData = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [{
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(201, 203, 207, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ],
      borderWidth: 1,
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(54, 162, 235, 1)',
      ],
    }]
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sample Polar Area Chart',
        font: {
          size: 20
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      r: {
        ticks: {
          beginAtZero: true
        }
      }
    }
  };

  const pieData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
      data: [10, 20, 30, 40, 50],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sample Pie Chart',
        font: {
          size: 20
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div className="mainCharts">
            <div className="dataCard polarCard">
        <PolarArea
          data={polarData}
          options={polarOptions}
        />
      </div>

      <div className="dataCard pieCard">
        <Pie
          data={pieData}
          options={pieOptions}
        />
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
            plugins: {
              title: {
                text: "Revenue Source",
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
            plugins: {
              title: {
                text: "Business Overview",
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
            plugins: {
              title: {
                text: "Courier Partner Overview",
              },
            },
          }}
        />
      </div>



      {/* <div className="dataCard indiaMapCard">
        <IndiaMapChart />
      </div> */}
    </div>
  );
};

export default Dashboard;
