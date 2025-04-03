// components/SkillsRadarChart.js
"use client";

import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillsRadarChart = ({ phaseScores }) => {
  const [chartData, setChartData] = useState(null);

  // Function to map phase IDs to readable Arabic names
  const getPhaseDisplayName = (phaseId) => {
    const phaseNames = {
      behavioral: "الكفايات السلوكية",
      language_arabic: "اللغة العربية",
      language_english: "اللغة الإنجليزية",
      knowledge_iq: "اختبار الذكاء",
      knowledge_general: "معلومات عامة",
      knowledge_it: "تكنولوجيا المعلومات",
      specialization: "كفايات التخصص",
      education: "الكفايات التربوية",
    };

    return phaseNames[phaseId] || phaseId;
  };

  useEffect(() => {
    if (!phaseScores) return;

    // Prepare data for radar chart
    const phaseEntries = Object.entries(phaseScores);

    // Sort alphabetically by phase name for consistent appearance
    phaseEntries.sort((a, b) =>
      getPhaseDisplayName(a[0]).localeCompare(getPhaseDisplayName(b[0]))
    );

    const labels = phaseEntries.map(([phaseId]) =>
      getPhaseDisplayName(phaseId)
    );
    const scores = phaseEntries.map(([, score]) => score);

    setChartData({
      labels,
      datasets: [
        {
          label: "مستوى المهارة",
          data: scores,
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(99, 102, 241, 1)",
          pointBorderColor: "#fff",
          pointHoverBorderColor: "rgba(99, 102, 241, 1)",
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    });
  }, [phaseScores]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        pointLabels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Cairo",
            size: 10,
          },
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          backdropColor: "transparent",
          font: {
            family: "Cairo",
            size: 8,
          },
          // Set min, max, and step size for better readability
          min: 0,
          max: 100,
          stepSize: 20,
          showLabelBackdrop: false,
        },
        // Start scale at 0
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
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
            return `مستوى المهارة: ${context.raw}%`;
          },
        },
      },
    },
    // Animation configuration
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

  return <Radar data={chartData} options={options} />;
};

export default SkillsRadarChart;
