import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const StackedBarChart = ({ data }) => {
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
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: data.datasets.map((dataset) => {
            return {
              label: dataset.label,
              data: dataset.values,
              backgroundColor: dataset.colors,
              stacked: true,
            };
          }),
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
              align: 'center',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
              },
            },
          },
        },
      });
    }
  }, [chartContainer, data]);

  return <canvas ref={chartContainer} style={{ width: '400px', height: '400px' }} />;
};

export default StackedBarChart;
