// @ts-nocheck
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { API_URL, deleteCase, getLegalList } from "../../api";
import { useEffect, useState } from "react";
import { Input, Select } from "@mantine/core";
import { CiSearch } from "react-icons/ci";
const Legal = () => {
  const [legalList, setLegalList] = useState<any[]>([]);
  const [filteredLegalList, setFilteredLegalList] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [uniqueOwner, setUniqueOwner] = useState<any[]>([])
  const [uniqueUnit, setUniqueUnit] = useState<any[]>([])
  const [uniqueProperty, setUniqueProperty] = useState<any[]>([])
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const headers = [
    "Sr. No",
    "Property Name",
    "Unit Number",
    "Location",
    "Owner",
    "Reason",
    "Created On",
    "Status",
    "Actions ",
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const legalList = await getLegalList();
    console.log(legalList, "nht")
    setLegalList(legalList?.data?.data || []);
    setFilteredLegalList(legalList?.data?.data || []);

  };
  useEffect(() => {
    const uniqueCustomProperties = [...new Set(
      legalList
        .map(item => item?.custom_property.name1) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueProperty(uniqueCustomProperties)
    const uniqueCustomOwner = [...new Set(
      legalList
        .map(item => item?.custom_supplier?.supplier_name) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueOwner(uniqueCustomOwner)
    const uniqueCustomUnit = [...new Set(
      legalList
        .map(item => item?.custom_current_property?.name1) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueUnit(uniqueCustomUnit)
  }, [legalList])
  const applyFilters = () => {
    const filteredData = legalList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.custom_property.name1?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_current_property?.name1?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_current_property?.custom_location?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_legal_reason?.custom_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_supplier?.supplier_name?.toLowerCase().includes(searchValue.toLowerCase())


      const matchesProperty =
        !selectedProperty || item?.custom_property.name1 === selectedProperty;
      const matchesUnit =
        !selectedUnit || item?.custom_current_property?.name1 === selectedUnit;
      const matchesCustomer =
        !selectedOwner || item?.custom_supplier?.supplier_name === selectedOwner;
      return matchesSearch && matchesProperty && matchesUnit && matchesCustomer;
    });
    setFilteredLegalList(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedProperty, selectedUnit, selectedOwner, searchValue]);
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
            <Header name="Legal" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Legal
              </p>
            </div>
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="min-w-fit mr-2">
                <Link
                  to={"/legal/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Legal
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
                  placeholder="Select Owner"
                  data={uniqueOwner.map((p) => p)}
                  clearable
                  value={selectedOwner}
                  onChange={(value) => setSelectedOwner(value)}
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
                    {filteredLegalList.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item?.custom_property.name1}</td>
                          <td className="p-2 py-3">
                            {item?.custom_current_property?.name1}
                          </td>
                          <td className="p-2 py-3">
                            {item?.custom_current_property?.custom_location}
                          </td>
                          <td className="p-2 py-3">
                            {item?.custom_supplier?.supplier_name}
                          </td>
                          <td className="p-2 py-3">{item?.custom_legal_reason?.custom_name}</td>
                          <td className="p-2 py-3">{item.creation.split(" ")[0]}</td>
                          <td className="p-2 py-3">{item.custom_status_legal}</td>

                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <Link
                                to={`/legal/edit/${item?.name}`}
                                state={item.name}
                                className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer"
                              >
                                <MdOutlineEdit
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </Link>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                                const confirmed = window.confirm(`Are you sure you want to delete this ${item?.custom_property.name1}?`);
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

export default Legal;
