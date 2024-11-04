import {
  icon_maintainer,
  icon_property,
  icon_tenants,
  icon_unit,
} from "../../assets";
import Header from "../../components/Header";
import DataCard from "../../components/DataCard";
import Sidebar from "../../components/Sidebar";
import RentOverviewChart from "../../components/Chart";
import { useEffect, useState } from "react";
import { getPropertyCount, getTenantCount, getUnitCount } from "../../api";

const Overview = () => {
  const [propertyCount, setPropertyCount] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [tenantCount, setTenantCount] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const property = await getPropertyCount();
    const unit = await getUnitCount();
    const tenant = await getTenantCount();
    setPropertyCount(property?.data?.message);
    setUnitCount(unit?.data?.message);
    setTenantCount(tenant?.data?.message);
  };

  const headers = [
    "No.",
    "Id",
    "Date",
    "Customer Name",
    "Units",
    "Available Units",
    "Teannts",
    "Maintenance",
  ];

  const mockData = [
    {
      No: 1,
      Id: 1012,
      Date: "Dec 1, 2021",
      Customer_Name: "Frank Murlo",
      Units: 10,
      Available_Units: 6,
      Tenants: 4,
      Maintenance: "In Progress",
    },
    {
      No: 2,
      Id: 1013,
      Date: "Jan 15, 2022",
      Customer_Name: "Alice Johnson",
      Units: 8,
      Available_Units: 3,
      Tenants: 5,
      Maintenance: "Completed",
    },
    {
      No: 3,
      Id: 1014,
      Date: "Feb 10, 2022",
      Customer_Name: "Bob Smith",
      Units: 12,
      Available_Units: 9,
      Tenants: 3,
      Maintenance: "Pending",
    },
    {
      No: 4,
      Id: 1015,
      Date: "Mar 5, 2022",
      Customer_Name: "Cathy Brown",
      Units: 15,
      Available_Units: 10,
      Tenants: 5,
      Maintenance: "In Progress",
    },
    {
      No: 5,
      Id: 1016,
      Date: "Apr 20, 2022",
      Customer_Name: "David Lee",
      Units: 20,
      Available_Units: 15,
      Tenants: 5,
      Maintenance: "Completed",
    },
  ];

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header />
            <div className="p-4 py-6 grid grid-cols-4 border border-[#E6EDFF] rounded-xl">
              <DataCard
                amount={propertyCount}
                title="Total Property"
                marginValue="10.2"
                weeklyAmount="1.01"
                icon={icon_property}
                isUp
              />
              <DataCard
                amount={unitCount}
                title="Total Unites"
                marginValue="3.1"
                weeklyAmount="0.48"
                icon={icon_unit}
                isUp
              />
              <DataCard
                amount={tenantCount}
                title="Total Tenants"
                marginValue="2.56"
                weeklyAmount="0.91"
                icon={icon_tenants}
                isUp={false}
              />
              <DataCard
                amount="6"
                title="Total Maintainer"
                marginValue="7.2"
                weeklyAmount="1.51"
                icon={icon_maintainer}
                isUp
              />
            </div>
            <div className="my-4 p-4 border border-[#E6EDFF] rounded-md">
              <RentOverviewChart />
            </div>
            <div className="my-4 p-4">
              <div className="my-4 p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-sonicsilver text-center">
                        {headers.map((header, index) => (
                          <th key={index} className="p-2 py-3 font-normal">
                            {header}
                          </th>
                        ))}
                        <th className="p-2 py-3 font-normal"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockData.map((item, i) => {
                        return (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 text-center text-[15px]"
                          >
                            <td className="p-2 py-3">{item.No}</td>
                            <td className="p-2 py-3">{item.Id}</td>
                            <td className="p-2 py-3">{item.Date}</td>
                            <td className="p-2 py-3">{item.Customer_Name}</td>
                            <td className="p-2 py-3">{item.Units}</td>
                            <td className="p-2 py-3">{item.Available_Units}</td>
                            <td className="p-2 py-3">{item.Tenants}</td>
                            <td className="p-2 py-3">{item.Maintenance}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Overview;
