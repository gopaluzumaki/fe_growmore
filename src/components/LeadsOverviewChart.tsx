// src/components/RentOverviewChart.tsx
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { fetchLeadData } from "../api";

const LeadsOverviewChart: React.FC = () => {
  const [leadsData,setLeadsData]=useState([])
  useEffect(()=>{
const getLeadsData=async()=>{
  const res=await fetchLeadData()
  const data=res?.data?.data
  const monthCounts = data.reduce((acc, item) => {
    const month = new Date(item.modified).getMonth(); // Get 0-based month
    acc[month] = (acc[month] || 0) + 1; // Increment count for the month
    return acc;
}, Array(12).fill(0));
    setLeadsData(monthCounts)
}
getLeadsData()
  },[])
  const series = [
    {
      name: "Leads Overview (Column)",
      type: "column",
      data: leadsData,
    },
    {
      name: "Leads Overview (Line)",
      type: "line",
      data:leadsData,

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
    
    
    dataLabels: {
      enabled: false,
      enabledOnSeries: [1],
    },
    xaxis: {
      title: {
        text: "Months"},
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
    yaxis: {
      title: {
        text: "Leads"}},
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

export default LeadsOverviewChart;
