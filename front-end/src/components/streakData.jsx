// components/StreakCalculator.js
import React from 'react';
import { Line } from 'react-chartjs-2';

function StreakCalculator({ attendanceDates }) {
  // Convert the provided dates to Date objects
  const dates = attendanceDates.map(date => new Date(date));
  
  // Sort the dates in ascending order
  dates.sort((a, b) => a - b);
  
  // Create an array of streak data
  const streakData = dates.map((date, index) => {
    let streak = 0;
    const currentDate = date.getTime();
    
    // Calculate the streak
    for (let i = index; i >= 0; i--) {
      const previousDate = dates[i].getTime();
      const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
      
      if (currentDate - previousDate <= oneDay) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  });
  
  // Create labels for the chart
  const labels = streakData.map((_, index) => `Day ${index + 1}`);
  
  // Create chart data
  const chartData = {
    labels: attendanceDates,
    datasets: [
      {
        label: 'Streak',
        data: streakData,
        fill: false,
        borderColor: '#FF6384',
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Dates',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Streak',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default StreakCalculator;
