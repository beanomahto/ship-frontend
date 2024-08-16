import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ProgressBar from './ProgressBar.jsx'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const TopDestinationsGraph = () => {
  const labels = ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Haryana', 'Telangana'];
  const dataValues = [77, 61, 49, 43, 43];
  const total = dataValues.reduce((acc, value) => acc + value, 0); 

  const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0']; 

  const stateData = labels.map((label, index) => ({
    state: label,
    percentage: ((dataValues[index] / total) * 100).toFixed(2),
    color: colors[index],
  }));

  const data = {
    labels: labels,
    datasets: [
        {
          label: 'Labels',
          data: dataValues,
          backgroundColor: colors.map(color => `${color}66`), 
          borderColor: colors,
          borderWidth: 1,
        },
      ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const percentage = ((value / total) * 100).toFixed(2);
          return `${value} (${percentage}%)`;
        },
        color: '#000', 
        anchor: 'end',
        align: 'end',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: false, 
      },
    },
  };
  

  return (
    <div
style={{display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center',width:'34rem', height:'22rem'}} 
    >
        <span style={{textAlign:'center', marginTop:'20px', }}>Top Destination</span>
      <ProgressBar data={stateData} /> 
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopDestinationsGraph;
