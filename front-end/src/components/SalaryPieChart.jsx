// components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

function SalaryPieChart({ totalSalary, salaryEarned, advanceTaken }) {
  const data = {
    labels: ['Salary left', 'Salary Earned', 'Advance Taken'],
    datasets: [
      {
        label: 'Salary Details',
        data: [totalSalary, salaryEarned, advanceTaken],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'black',  // Change font color of legend labels
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export default SalaryPieChart;
