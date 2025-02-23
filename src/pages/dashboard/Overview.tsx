import {
  icon_maintainer,
  icon_property,
  icon_tenants,
  icon_unit,
} from "../../assets";
import Header from "../../components/Header";
import DataCard from "../../components/DataCard";
import Sidebar from "../../components/Sidebar";
import RentOverviewChart from "../../components/RentOverviewChart";
import { useEffect, useState } from "react";
import {
  fetchCaseFromMaintenance,
  fetchTenancyData,
  getPropertyCount,
  getTenantCount,
  getUnitCount,
} from "../../api";
import LeadsOverviewChart from "../../components/LeadsOverviewChart";
import { Link } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";

const Overview = () => {
  const [propertyCount, setPropertyCount] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [tenantCount, setTenantCount] = useState("");
  const [tenancyData, setTenancyData] = useState<any[]>([]);
  useEffect(() => {
    getData();
  }, []);
  async function calculateDaysLeft(records) {
    const currentDate = new Date(); // Get the current date
    const results = await Promise.all(
      records.map(async (record, index) => {
        const endDate = new Date(record.end_date); // Convert end date to Date object
        const timeDiff = endDate.getTime() - currentDate.getTime(); // Difference in milliseconds
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

        // Fetch case data (assuming fetchCaseFromMaintenance is an async function)
        const caseData = await fetchCaseFromMaintenance(
          record.property,
          record.custom_current_property
        );
        console.log(caseData?.data?.data, "bvf", index);
        const caseDataList1 = caseData?.data?.data?.map(
          (item) => item.custom_status
        );
        const caseDataList = [...new Set(caseDataList1)];
        return { ...record, daysLeft, caseDataList }; // Return record with days left and caseData
      })
    );

    return results; // Return the array of resolved records
  }

  console.log(tenancyData, "ngt");
  const getData = async () => {
    const property = await getPropertyCount();
    const unit = await getUnitCount();
    const tenant = await getTenantCount();
    const tenancyData = await fetchTenancyData();
    setPropertyCount(property?.data?.message);
    setUnitCount(unit?.data?.message);
    setTenantCount(tenant?.data?.message);
    setTenancyData(await calculateDaysLeft(tenancyData?.data?.data));
  };

  const headers = [
    "Sr. No",
    "Customer Name",
    "Property Name",
    "Unit Number",
    "Location / Area",
    "Status",
    "Case Status",
    "No. of Days Left",
    "Action",
  ];

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header name="Welcome Back!" />
            <div className="p-4 py-6 grid grid-cols-4 border border-[#E6EDFF] rounded-xl">
              <DataCard
                amount={propertyCount}
                title="Total Properties"
                marginValue="10.2"
                weeklyAmount="1.01"
                icon={icon_property}
                isUp
                link="/property"
              />
              <DataCard
                amount={unitCount}
                title="Total Units"
                marginValue="3.1"
                weeklyAmount="0.48"
                icon={icon_unit}
                isUp
                link="/units"
              />
              <DataCard
                amount={tenantCount}
                title="Total Tenants"
                marginValue="2.56"
                weeklyAmount="0.91"
                icon={icon_tenants}
                isUp={false}
                link="/tenants"
              />
              <DataCard
                amount="6"
                title="Total Owners"
                marginValue="7.2"
                weeklyAmount="1.51"
                icon={icon_maintainer}
                isUp
                link="/owners"
              />
            </div>
            <div className="my-4 p-4 border border-[#E6EDFF] rounded-md">
              <RentOverviewChart />
            </div>
            <div className="my-4 p-4 border border-[#E6EDFF] rounded-md">
              <LeadsOverviewChart />
            </div>

            <div className="my-4 p-4">
              <div className="my-4 p-4">
                <div className="overflow-x-auto">
                  <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4">
                    <span className="pb-1 border-b border-[#7C8DB5]">
                      Tenancy
                    </span>
                    <span className="pb-1">Contracts</span>
                  </p>
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
                      {tenancyData.map((item, i) => {
                        return (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 text-center text-[15px]"
                          >
                            <td className="p-2 py-3">{i + 1}</td>
                            <td className="p-2 py-3">{item.customer}</td>
                            <td className="p-2 py-3">
                              {item.custom_property_name}
                            </td>
                            <td className="p-2 py-3">
                              {item.custom_number_of_unit}
                            </td>
                            <td className="p-2 py-3">
                              {item.custom_location__area}
                            </td>
                            <td className="p-2 py-3">
                              <div
                                className={`p-1 rounded ${
                                  item.lease_status === "Draft"
                                    ? "bg-red-400 text-black"
                                    : item.lease_status === "Active"
                                    ? "bg-[#34A853] text-white"
                                    : "bg-blue-400 text-white"
                                }`}
                              >
                                {item.lease_status === "Renewal"
                                  ? "Finished"
                                  : item.lease_status}
                              </div>
                            </td>
                            <td className="p-2 py-3">
                              {item?.caseDataList?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {item?.caseDataList?.map((value) => (
                                    <div
                                      style={{
                                        wordWrap: "break-word",
                                        wordBreak: "break-word",
                                        overflow: "hidden",
                                      }}
                                      className={`p-1 mb-1 rounded ${
                                        value.length > 0
                                          ? "bg-[#ff8d00] text-black"
                                          : ""
                                      }`}
                                    >
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            <td className="p-2 py-3">
                              <div
                                className={`p-1 rounded ${
                                  item.daysLeft === "Expired"
                                    ? "bg-[#ff0000] text-black"
                                    : item?.daysLeft <= 15
                                    ? "bg-[#ff8d00] text-black"
                                    : ""
                                }`}
                              >
                                {item.daysLeft}
                              </div>
                            </td>
                            <td className="p-2 py-3">
                              <div className="flex ml-4">
                                <Link
                                  to={"/contracts/edit"}
                                  state={item.name}
                                  className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer"
                                >
                                  <MdOutlineEdit
                                    size={20}
                                    className="text-[#D09D4A]"
                                  />
                                </Link>
                              </div>
                            </td>
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
