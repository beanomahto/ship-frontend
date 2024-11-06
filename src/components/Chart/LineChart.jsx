import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const LineChart = ({ dataSource }) => {
  // Filter dataSource to get only 'UnDelivered' orders
  const unDeliveredOrders = dataSource.filter(
    (order) => order.status === "UnDelivered"
  );

  // Extract relevant data for the chart and format date
  const labels = unDeliveredOrders.map((order) =>
    new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  ); // This will display as "Oct 29", "Nov 1", etc.

  const dataValues = unDeliveredOrders.map((order) => order.productPrice); // Adjust according to your data

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: dataValues,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
        pointBackgroundColor: "blue",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "blue",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "UnDelivered Orders Chart",
        font: {
          size: 20,
        },
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="chart">
      <Line data={data} options={options} height={"300px"} />
    </div>
  );
};

export default LineChart;
