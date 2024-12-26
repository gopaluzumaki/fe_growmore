// src/components/RentOverviewChart.tsx
import React from "react";
import Chart from "react-apexcharts";

const RentOverviewChart: React.FC = () => {
  const series = [
    {
      name: "Rent Overview (Column)",
      type: "column",
      data: [60000, 65000, 70000, 75000, 100000, 110000, 130000, 140000, 175000, 190000, 210000, 260000  ],
    },
    {
      name: "Rent Overview (Line)",
      type: "line",
      data: [60000, 65000, 70000, 75000, 100000, 110000, 130000, 140000, 175000, 190000, 210000, 260000  ],

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
      title: {
        text: "Years"},
      categories: [
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024"
      ],
    },
    yaxis: {
      title: {
        text: "AED"}},
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
