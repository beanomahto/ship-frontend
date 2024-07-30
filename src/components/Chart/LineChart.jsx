import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const LineChart = () => {

  const data = {
    labels: ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17'],
    datasets: [{
      label: 'Sample Data',
      data: [8, 7, 6, 5, 4, 3, 2, 1],
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: true,
      pointBackgroundColor: 'blue',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'blue',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sample Line Chart',
        font: {
          size: 20
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          beginAtZero: true
        }
      }
    }
  };

  return (
    <div className='chart'>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
