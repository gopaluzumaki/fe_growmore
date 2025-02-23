// @ts-nocheck
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { API_URL, deleteCase, getMoveOutList } from "../../api";
import { useEffect, useState } from "react";
import { Input, Select } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const MoveOut = () => {
  const [moveOutList, setMoveOutList] = useState<any[]>([]);
  const [filteredMoveOutList, setFilteredMoveOutList] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [uniqueCustomer, setUniqueCustomer] = useState<any[]>([])
  const [uniqueUnit, setUniqueUnit] = useState<any[]>([])
  const [uniqueProperty, setUniqueProperty] = useState<any[]>([])
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const headers = [
    "Sr. No",
    "Customer",
    "Property Name",
    "Unit Number",
    "Start Date",
    "End Date",
    "Created On",
    "Status",
    "Actions ",
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const moveOutList = await getMoveOutList();
    setMoveOutList(moveOutList?.data?.data || []);
    setFilteredMoveOutList(moveOutList?.data?.data || []);
  };
  useEffect(() => {
    const uniqueCustomProperties = [...new Set(
      moveOutList
        .map(item => item.custom_property.name1) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueProperty(uniqueCustomProperties)
    const uniqueCustomCustomer = [...new Set(
      moveOutList
        .map(item => item?.custom_customer?.customer_name) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueCustomer(uniqueCustomCustomer)
    const uniqueCustomUnit = [...new Set(
      moveOutList
        .map(item => item?.custom_current_property?.name1) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueUnit(uniqueCustomUnit)
  }, [moveOutList])
  const applyFilters = () => {
    const filteredData = moveOutList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.custom_property.name1?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_current_property?.name1?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_customer?.customer_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_start_date?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_end_date?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_statusmo?.toLowerCase().includes(searchValue.toLowerCase())

      const matchesProperty =
        !selectedProperty || item.custom_property.name1 === selectedProperty;
      const matchesUnit =
        !selectedUnit || item?.custom_current_property?.name1 === selectedUnit;
      const matchesCustomer =
        !selectedCustomer || item?.custom_customer?.customer_name === selectedCustomer;
      return matchesSearch && matchesProperty && matchesUnit && matchesCustomer;
    });
    setFilteredMoveOutList(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedProperty, selectedUnit, selectedCustomer, searchValue]);
  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchvalue(e.target.value);
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
  const searchStyle = {
    input: {
      border: "1px solid gray",
      width: "20vw",
    },
  };
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header name="Move Out" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Move Out
              </p>
            </div>
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="min-w-fit mr-2">
                <Link
                  to={"/moveout/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Move Out
                  <IoAdd size={20} />
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <Select
                  placeholder="Select Properties"
                  data={uniqueProperty.map((p) => p)}
                  clearable
                  value={selectedProperty}
                  onChange={(value) => setSelectedProperty(value)}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Unit"
                  data={uniqueUnit.map((p) => p)}
                  clearable
                  value={selectedUnit}
                  onChange={(value) => setSelectedUnit(value)}
                  styles={selectStyle}
                />
                <Select
                  placeholder="Select Customer"
                  data={uniqueCustomer.map((p) => p)}
                  clearable
                  value={selectedCustomer}
                  onChange={(value) => setSelectedCustomer(value)}
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
                      <th className="p-2 py-3 font-normal"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMoveOutList.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item?.custom_customer?.customer_name}</td>
                          <td className="p-2 py-3">
                            {item?.custom_property.name1}
                          </td>
                          <td className="p-2 py-3">
                            {item?.custom_current_property?.name1}
                          </td>
                          <td className="p-2 py-3">
                            {item.custom_start_date}
                          </td>
                          <td className="p-2 py-3">{item.custom_end_date}</td>
                          <td className="p-2 py-3">{item.creation.split(" ")[0]}</td>
                          <td className="p-2 py-3">

                            {item.custom_statusmo}

                          </td>

                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <Link
                                to={`/moveout/edit/${item?.name}`}
                                state={item.name}
                                className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer"
                              >
                                <MdOutlineEdit
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </Link>

                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                               const confirmed = window.confirm(`Are you sure you want to delete this ${item.custom_property.name1}?`);
                               if (confirmed) {
                                 await deleteCase(item.name);
                                 getData();
                               }
                              }}>
                                <MdDeleteForever
                                  size={20}
                                  className="text-[#EB4335]"
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

export default MoveOut;
