import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

Chart.register(WordCloudController, WordElement);


const WordCloudChart = ({ data }) => {
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
        type: WordCloudController.id,
        data: {
          datasets: [{
            data: data.map((item) => ({
              text: item.text,
              weight: item.value,
            })),
            backgroundColor: data.map((item) => item.color),
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Word Cloud Chart',
              fontSize: 16,
            },
            wordcloud: {
              color: (context) => context.dataset.backgroundColor[context.dataIndex],
              minRotation: -90,
              maxRotation: 90,
              rotationStep: 45,
              fontSize: (context) => context.dataset.data[context.dataIndex].weight / 2,
            },
          },
        },
      });
    }
  }, [chartContainer, data]);

  return (
    <canvas ref={chartContainer} style={{ width: '400px', height: '400px' }} />
  );
};

export default WordCloudChart;
