// components/PerformanceChart.js
"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = ({ examResults }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!examResults || examResults.length === 0) return;

    // Sort results by date
    const sortedResults = [...examResults].sort(
      (a, b) => new Date(a.completedAt) - new Date(b.completedAt)
    );

    // Prepare data for chart
    const labels = sortedResults.map((result) => {
      const date = new Date(result.completedAt);
      return date.toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
      });
    });

    const scores = sortedResults.map((result) => result.totalScore);

    // Set chart data
    setChartData({
      labels,
      datasets: [
        {
          label: "الدرجة الكلية",
          data: scores,
          borderColor: "rgba(99, 102, 241, 1)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(99, 102, 241, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          fill: true,
        },
      ],
    });
  }, [examResults]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            family: "Cairo",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: false,
        padding: 10,
        titleAlign: "center",
        bodyAlign: "center",
        titleFont: {
          family: "Cairo",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "Cairo",
          size: 12,
        },
        callbacks: {
          label: function (context) {
            return `الدرجة: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Cairo",
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Cairo",
          },
          // Include more ticks for better readability
          stepSize: 10,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  if (!chartData) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/60">
        جاري تحميل الرسم البياني...
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
};

export default PerformanceChart;
