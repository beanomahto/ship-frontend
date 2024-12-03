// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import ProgressBar from './ProgressBar.jsx';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// const ShipmentStatusGraph = () => {
//   const labels = [ 'Delivered', 'Returned','Shipped', 'With Incidents'];
//   const dataValues = [0,0,0,0];
//   const total = dataValues.reduce((acc, value) => acc + value, 0);

//   const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

//   const stateData = labels.map((label, index) => ({
//     state: label,
//     percentage: ((dataValues[index] / total) * 100).toFixed(2),
//     color: colors[index],
//   }));

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Labels',
//         data: dataValues,
//         backgroundColor: colors.map(color => `${color}66`),
//         borderColor: colors,
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     indexAxis: 'y',
//     scales: {
//       x: {
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       datalabels: {
//         formatter: (value, context) => {
//           const percentage = ((value / total) * 100).toFixed(2);
//           return `${value} (${percentage}%)`;
//         },
//         color: '#000',
//         anchor: 'end',
//         align: 'end',
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             const value = context.raw;
//             const percentage = ((value / total) * 100).toFixed(2);
//             return `${context.label}: ${value} (${percentage}%)`;
//           },
//         },
//       },
//       legend: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         width: '34rem',
//         height: '22rem'
//       }}
//     >
//       <span style={{ textAlign: 'center', marginTop: '20px' }}>Shipment Status</span>
//       <ProgressBar data={stateData} />
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default ShipmentStatusGraph;

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ProgressBar from "./ProgressBar.jsx";
import { useOrderContext } from "../../context/OrderContext";
import "./graph.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ShipmentStatusGraph = () => {
  // Using orders and loading from context
  const [dataValues, setDataValues] = useState([0, 0, 0, 0]); // Initial state for shipment statuses
  const { orders, loading, error } = useOrderContext();

  // Updated labels to replace "With Incidents" with "Cancelled"
  const labels = ["Delivered", "Returned", "Shipped", "Cancelled"];

  // Update the colors array for the new "Cancelled" label
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

  // Effect to calculate the shipment statuses from orders dynamically
  useEffect(() => {
    if (!loading && orders?.success && Array.isArray(orders.orders)) {
      //console.log("Valid orders data found");

      const orderCountByState = Array(labels.length).fill(0);

      orders.orders.forEach((order) => {
        // Accessing the correct 'status' property from the order
        const normalizedStatus = order.status?.toLowerCase().trim() || "";
        const stateIndex = labels.findIndex(
          (status) => status.toLowerCase().trim() === normalizedStatus
        );

        if (stateIndex !== -1) {
          // Incrementing predefined statuses count
          orderCountByState[stateIndex]++;
        } else {
          // If the status doesn't match predefined labels, ignore it
          //console.log("Unknown status found:", normalizedStatus);
        }
      });

      //console.log("Order counts by status:", orderCountByState);

      // Only update state if the new counts differ from the old
      if (JSON.stringify(orderCountByState) !== JSON.stringify(dataValues)) {
        setDataValues(orderCountByState);
      }
    } else {
      //console.log("Loading or invalid orders data");
    }
  }, [orders, loading]);

  const total = dataValues.reduce((acc, value) => acc + value, 0);
  //console.log("Total orders:", total); // Calculate total orders

  const stateData = labels.map((label, index) => ({
    state: label,
    percentage: total > 0 ? ((dataValues[index] / total) * 100).toFixed(2) : 0,
    color: colors[index],
  }));

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Orders",
        data: dataValues,
        backgroundColor: colors.map((color) => `${color}66`),
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: total + total / 10, // Set x-axis max value to the total number of orders
        title: {
          display: true,
          text: `Total Orders: ${total}`, // Display total orders on the x-axis
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#000",
        },
      },
    },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
          return `${percentage}%`; // Show percentage on the bars
        },
        color: "#000",
        anchor: "end",
        align: "end",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(2) : 0;
            return `${context.label}: ${value} (${percentage}%)`; // Show count and percentage in tooltip
          },
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      bar: {
        barThickness: 25, // Adjust bar thickness as needed
        maxBarThickness: 30,
      },
    },
  };

  return (
    <div className="graph-container">
      <span>Shipment Status</span>
      <ProgressBar data={stateData} />
      <Bar data={data} options={options} />
    </div>
  );
};

export default ShipmentStatusGraph;
