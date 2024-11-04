// src/components/RentOverviewChart.tsx
import React from "react";
import Chart from "react-apexcharts";

const RentOverviewChart: React.FC = () => {
  const series = [
    {
      name: "Rent Overview (Column)",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
    {
      name: "Rent Overview (Line)",
      type: "line",
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
  ];

  const options: any = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false, // Disable zooming
      },
      toolbar: {
        show: false,
      },
      legend: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      width: [0, 4],
      colors: ["#D09D4A"],
      curve: "smooth",
    },
    title: {
      text: "Rent Overview",
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    plotOptions: {
      bar: {
        columnWidth: "50%", // Adjust column width if needed
        colors: {
          ranges: [
            {
              from: 0,
              to: 1000,
              color: "#ffffff", // Set column background color
            },
          ],
          background: {
            enabled: true,
            color: "rgba(230, 237, 255, 0)", // Fallback color if gradient isn't supported
            opacity: 1,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical", // Change to 'horizontal' for horizontal gradients
        shadeIntensity: 0.5,
        gradientToColors: ["rgba(230, 237, 255, 0), rgba(230, 237, 255, 1)"], // Color at the top of the gradient
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.5,
        stops: [0, 100],
      },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default RentOverviewChart;
