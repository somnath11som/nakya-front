import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ labels, values }) => {
  const data = {
    labels: labels || ['A', 'B', 'C', 'D'],
    datasets: [
      {
        label: 'VCD',
        data: values || [200, 400, 150, 300],
        backgroundColor: ['#22c55e', '#f97316', '#a855f7', '#3b82f6'],
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Vi Cell',
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 10,
        },
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: '#fff',
        },
        border: {
          display: true,
          color: '#fff',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'VCD',
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 10,
        },
        grid: {
          display: true,
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: '#fff',
        },
        border: {
          display: true,
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
        },
      },
    },
  };
  
  return <Bar data={data} options={options} />;
};

export default BarChart;
