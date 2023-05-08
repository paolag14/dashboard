import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data }) => {
  const chartContainer = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (chartInstanceRef.current) {
        // Destroy previous chart instance
        chartInstanceRef.current.destroy();
      }
      const ctx = chartContainer.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: data.colors,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              align: 'center',
              labels: {
                boxWidth: 10,
                boxHeight: 10
              }
            }
          }
        }
      });
    }
  }, [chartContainer, data]);

  return (
    <canvas ref={chartContainer} style={{ width: '200px', height: '200px' }} />

  );
};

export default PieChart;
