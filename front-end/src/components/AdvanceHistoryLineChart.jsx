// components/LineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart({ advanceDates, advanceAmounts}) {
  const data = {
    labels: advanceDates,  // Dates
    datasets: [
      {
        label: 'Advance History',
        data: advanceAmounts,  // Advance Amounts
        fill: false,
        borderColor: '#FF6384',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          color:'black'
        },
        ticks: {
            color: 'black',  // Change font color of x-axis labels
          },
      },
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Advance Amount (Rs)',
          color: 'black'
        },
        ticks: {
            color: 'black',  // Change font color of x-axis labels
          },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default LineChart;
