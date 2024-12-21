// @ts-nocheck
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { API_URL, deleteCase, getLegalList } from "../../api";
import { useEffect, useState } from "react";
import { Select } from "@mantine/core";

const Legal = () => {
  const [legalList, setLegalList] = useState<any[]>([]);
  const [filteredLegalList, setFilteredLegalList] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [uniqueOwner, setUniqueOwner] = useState<any[]>([])
  const [uniqueUnit, setUniqueUnit] = useState<any[]>([])
  const [uniqueProperty, setUniqueProperty] = useState<any[]>([])

  const headers = [
    "Sr. No",
    "Property Name",
    "Unit Number",
    "Location",
    "Owner",
    "Reason",
    "Actions ",
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const legalList = await getLegalList();
    setLegalList(legalList?.data?.data || []);
    setFilteredLegalList(legalList?.data?.data || []);

  };
  useEffect(() => {
    const uniqueCustomProperties = [...new Set(
      legalList
        .map(item => item.custom_property) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueProperty(uniqueCustomProperties)
    const uniqueCustomOwner = [...new Set(
      legalList
        .map(item => item.owner) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueOwner(uniqueCustomOwner)
    const uniqueCustomUnit = [...new Set(
      legalList
        .map(item => item.custom_unit_no) // Extract custom_property values
        .filter(value => value !== null && value !== undefined) // Exclude null and undefined
    )];
    setUniqueUnit(uniqueCustomUnit)
  }, [legalList])
  const applyFilters = () => {
    const filteredData = legalList.filter((item) => {
      const matchesProperty =
        !selectedProperty || item.custom_property === selectedProperty;
      const matchesUnit =
        !selectedUnit || item.custom_unit_no === selectedUnit;
      const matchesCustomer =
        !selectedOwner || item.owner === selectedOwner;
      return matchesProperty && matchesUnit && matchesCustomer;
    });
    setFilteredLegalList(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedProperty, selectedUnit, selectedOwner]);
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
                          <td className="p-2 py-3">{item?.custom_property}</td>
                          <td className="p-2 py-3">
                            {item.custom_unit_no}
                          </td>
                          <td className="p-2 py-3">
                            {item.custom_location__area}
                          </td>
                          <td className="p-2 py-3">
                            {item.owner}
                          </td>
                          <td className="p-2 py-3">{item.custom_reason}</td>

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
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                                await deleteCase(item.name)
                                getData()
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
