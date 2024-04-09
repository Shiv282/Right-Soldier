// components/BarGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";

function DayNightBarGraph({ yesCount, noCount }) {
  const data = {
    labels: ["Days", "Nights"],
    datasets: [
      {
        label: "Day Shift vs Night Shift",
        data: [yesCount, noCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
        y: {
          type: 'linear',
          beginAtZero: true,
          ticks: {
            color: 'black',  // Change font color of y-axis labels
          },
        },
        x: {
          ticks: {
            color: 'black',  // Change font color of x-axis labels
          },
        },
      },

    plugins: {
      legend: {
        labels: {
          color: "black", // Change font color of legend labels
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default DayNightBarGraph;
