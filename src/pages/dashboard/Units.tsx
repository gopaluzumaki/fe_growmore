import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { VscFilter } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { deletePropertyUnit, getUnitList } from "../../api";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { img_group } from "../../assets";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const Units = () => {
  const [unitList, setUnitList] = useState<any[]>([]);
  const [filteredUnitList,setFilteredUnitList] = useState([]);
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const headers = [
    "Sr. No",
    "Property Name",
    "Unit Number",
    "Location / Area",
    "Owner Name",
    "Tenant Name",
    "Status",
    "Actions",
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getUnitList();
    console.log('eqwads', unitList)
    setUnitList(unitList?.data?.data);
    setFilteredUnitList(unitList?.data?.data)
  };
  const applyFilters = () => {
    const filteredData = unitList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.property?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.unit_number?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.location?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.unit_owner?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.tenantName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_status?.toLowerCase().includes(searchValue.toLowerCase())
      return matchesSearch 
    });
    setFilteredUnitList(filteredData);
  };
  useEffect(() => {
    applyFilters();
  }, [searchValue]);

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchvalue(e.target.value);
  };
  const searchStyle = {
    input: {
      border: "1px solid gray",
      width: "20vw",
      padding:"24px"
    },
  };
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header name="Unit" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Units
              </p>
            </div>
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="max-w-fit">
                <Link
                  to={"/units/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Unit
                  <IoAdd size={20} />
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                                       <Input
                                         onChange={handleSearchValue}
                                         value={searchValue}
                                         styles={searchStyle}
                                         placeholder="Search"
                                         leftSection={<CiSearch className="mr-2" size={24} />}
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
                    {filteredUnitList.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item?.property}</td>
                          <td className="p-2 py-3">{item.unit_number}</td>
                          <td className="p-2 py-3">{item.location}</td>
                          <td className="p-2 py-3">{item.unit_owner}</td>
                          <td className="p-2 py-3">{item.tenantName}</td>
                          <td className="p-2 py-3">
                            <div
                              className={`p-1 rounded ${item.custom_status === "Occupied"
                                ? "bg-[#FFEC1C] text-black"
                                : item.custom_status === "Vacant"
                                  ? "bg-[#34A853] text-white"
                                  : item.custom_status === "Legal" && "bg-[#EB4335] text-white"
                                }`}
                            >
                              {item.custom_status}
                            </div>
                          </td>
                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                                <Link to={"/units/edit"} state={{ item }}>
                                  <MdOutlineEdit
                                    size={20}
                                    className="text-[#D09D4A]"
                                  />
                                </Link>
                              </button>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                                const confirmed = window.confirm(`Are you sure you want to delete this ${item.property} property ${item.unit_number} unit?`);
                                if (confirmed) {
                                  await deletePropertyUnit(item.name);
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

export default Units;
