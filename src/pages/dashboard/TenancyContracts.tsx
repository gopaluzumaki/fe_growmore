// @ts-nocheck

import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { Select } from "@mantine/core";
import { VscFilter } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

import {
  API_URL,
  getTenancyContractList,
  getPropertyList,
  getTenantList,
  getOwnerList,
  deleteTanencyContract,
  fetchCaseFromMaintenance,
} from "../../api";
import { APP_AUTH } from "../../constants/config";

interface Unit {
  start_date: string;
  end_date: string;
  custom_number_of_unit: string;
  custom_location__area: string;
  custom_name_of_owner: string;
  lease_customer: string;
  custom_rent_amount_to_pay: string;
  property: string;
  lease_status: string;
  name: string;
}

interface Property {
  property: string;
}

interface Tenant {
  name: string;
}

const TenancyContracts = () => {
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [propertyList, setPropertyList] = useState<Property[]>([]);
  const [tenantList, setTenantList] = useState<Tenant[]>([]);
  const [ownerList, setOwnerList] = useState<Tenant[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  console.log("Owner_list : ", ownerList);
  console.log("unit_list : ", unitList);

  const headers = [
    "Sr. No",
    "Property Name",
    "Unit Number",
    "Location / Area",
    "Owner Name",
    "Customer Name",
    "Price / Rent Annually",
    "Start-date",
    "End-Date",
    "Expiry Days",
    "Status",
    // "Case Status",
    "Actions ",
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const unitListRes = await getTenancyContractList();
    const propertyListRes = await getPropertyList();
    const tenantListRes = await getTenantList();
    const ownerListRes = await getOwnerList();

    setUnitList(await getStatus(unitListRes?.data?.data || []));
    setPropertyList(propertyListRes?.data?.data || []);
    setTenantList(tenantListRes?.data?.data || []);
    setOwnerList(ownerListRes?.data?.data || []);
  };

  const calculateExpiryDays = (startDate: string, endDate: string): number => {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    // Calculate the difference in milliseconds
    const diffMs = new Date(endDate).getTime() - new Date().getTime();
    return Math.round(diffMs / oneDay);
  };

  const getStatus = async(records) =>{
    const results = await Promise.all(records.map(async (record, index) => {
      // Fetch case data (assuming fetchCaseFromMaintenance is an async function)
      const caseData = await fetchCaseFromMaintenance(record.custom_property_name, record.custom_number_of_unit, record.lease_customer);
      console.log(caseData?.data?.data, "bvf", index);
      let caseStatus = caseData?.data?.data[0]?.custom_status
      return { ...record, caseStatus }; // Return record with days left and caseData
    }));

    return results;
  }

  const statusOptions = [
    "Active",
    "Closed",
    "Draft",
    "Extend",
    "Renewal",
    "Termination",
  ];

  const expiry_Options = ["This Week", "This Month", "This Year"];

  const filteredUnits = unitList.filter((item) => {
    const expiryDays = calculateExpiryDays(item.start_date, item.end_date);

    const matchesSearch =
      !searchValue ||
      item.property.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.lease_customer.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.custom_location__area
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      item.custom_name_of_owner
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      item.custom_number_of_unit
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      item.custom_rent_amount_to_pay
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      item.lease_status.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.start_date.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.end_date.toLowerCase().includes(searchValue.toLowerCase());

    return (
      matchesSearch &&
      (!selectedProperty || item.property === selectedProperty) &&
      (!selectedUnit || item.name === selectedUnit) &&
      (!selectedTenant || item.lease_customer === selectedTenant) &&
      (!selectedOwner || item.custom_name_of_owner === selectedOwner) &&
      (!selectedStatus || item.lease_status === selectedStatus) &&
      (!selectedExpiry ||
        (selectedExpiry === "This Week" && expiryDays <= 7) ||
        (selectedExpiry === "This Month" && expiryDays <= 31) ||
        (selectedExpiry === "This Year" && expiryDays <= 365))
    );
  });

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchvalue(e.target.value);
  };

  console.log("search value:", searchValue);

  const formatDate = (dateString) => {
    const months = [
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
    ];
    const [year, month, day] = dateString.split("-");
    // return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    return `${day}-${month}-${year}`;
  };

  const searchStyle = {
    input: {
      border: "1px solid gray",
      width: "30vw",
    },
  };

  const selectStyle = {
    input: {
      border: "1px solid gray",
      backgroundColor: "#F5F5F5",
      color: "#000",
      padding: "20px 12px",
      borderRadius: "5px",
    },
    dropdown: {
      backgroundColor: "#F5F5F5",
      color: "#000",
    },
  };
  const username = APP_AUTH.USERNAME;
  const password = APP_AUTH.PASSWORD;
  const credentials = btoa(`${username}:${password}`);
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header name="Tenancy Contracts" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Tenancy Contract
              </p>
            </div>
            <div className="flex justify-between flex-wrap items-center my-8 mx-4 gap-5">
              <div className="min-w-fit mr-2">
                <Link
                  to={"/contracts/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Tenancy Contracts
                  <IoAdd size={20} />
                </Link>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Select
                  placeholder="Select Properties"
                  data={propertyList.map((p) => p.property)}
                  clearable
                  value={selectedProperty}
                  onChange={setSelectedProperty}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Unit"
                  data={[...new Set(unitList.map((u) => u.name))]}
                  clearable
                  value={selectedUnit}
                  onChange={setSelectedUnit}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Customer"
                  data={tenantList.map((t) => t.name)}
                  clearable
                  value={selectedTenant}
                  onChange={setSelectedTenant}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Owner"
                  data={ownerList.map((o) => o.supplier_name)}
                  clearable
                  value={selectedOwner}
                  onChange={setSelectedOwner}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Status"
                  data={statusOptions}
                  clearable
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  styles={selectStyle}
                />

                <Select
                  placeholder="Select Expiry"
                  data={expiry_Options}
                  clearable
                  value={selectedExpiry}
                  onChange={setSelectedExpiry}
                  styles={selectStyle}
                />
                <Input
                  onChange={handleSearchValue}
                  value={searchValue}
                  styles={searchStyle}
                  placeholder="search"
                  leftSection={<CiSearch size={16} />}
                />
              </div>
            </div>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUnits.map((item, i) => {
                      const expiryDays = calculateExpiryDays(
                        item.start_date,
                        item.end_date
                      );
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">
                            {item?.custom_property_name ?? item?.property}
                          </td>
                          <td className="p-2 py-3">
                            {item?.custom_number_of_unit ??
                              item?.custom_unit_name}
                          </td>
                          <td className="p-2 py-3">
                            {item.custom_location__area}
                          </td>
                          <td className="p-2 py-3">
                            {item.custom_name_of_owner}
                          </td>
                          <td className="p-2 py-3">{item.lease_customer}</td>
                          <td className="p-2 py-3">
                            {item?.custom_price__rent_annually ||
                              item.custom_rent_amount_to_pay}
                          </td>
                          <td className="p-2 py-3 whitespace-nowrap">
                            {formatDate(item.start_date)}
                          </td>
                          <td className="p-2 py-3 whitespace-nowrap">
                            {formatDate(item.end_date)}
                          </td>
                          <td className="p-2 py-3">{expiryDays}</td>
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
                              {item.lease_status}
                            </div>
                          </td>
                          {/* <td className="p-2 py-3"><div
                              className={`p-1 rounded whitespace-nowrap ${item?.caseStatus?.length > 0
                                  ? "bg-[#ff8d00] text-black"
                                  :
                                  ""

                                }`}
                            >{item?.caseStatus ? item?.caseStatus : '-'}</div></td> */}
                          <td className="p-2 py-3">
                            <div className="flex gap-3">
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
                              <div
                                onClick={async () => {
                                  try {
                                    const response = await fetch(
                                      `https://propms.erpnext.syscort.com/api/method/frappe.utils.print_format.download_pdf?doctype=Lease&format=Tenancy+Contract&name=` +
                                        item.name,
                                      {
                                        method: "GET",
                                        credentials: "include", // Ensures cookies for authenticated sessions are included
                                        headers: {
                                          Authorization: `Basic ${credentials}`, // Attach Basic Auth header
                                        },
                                      }
                                    );

                                    if (!response.ok) {
                                      throw new Error("Failed to fetch PDF");
                                    }

                                    const blob = await response.blob();
                                    const url =
                                      window.URL.createObjectURL(blob);

                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `${item.name}.pdf`; // Set the desired filename
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  } catch (error) {
                                    console.error(
                                      "Error downloading PDF:",
                                      error
                                    );
                                    alert("Failed to download PDF.");
                                  }
                                }}
                                className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer"
                              >
                                <FaRegEye
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </div>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                                <MdDeleteForever
                                  size={20}
                                  className="text-[#EB4335]"
                                  onClick={async () => {
                                    const confirmed = window.confirm(`Are you sure you want to delete this ${item.custom_property_name}?`);
                             if (confirmed) {
                                    await deleteTanencyContract(item.name);
                                    getData();
                             }
                                  }}
                                />
                              </button>
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
    </main>
  );
};

export default TenancyContracts;
