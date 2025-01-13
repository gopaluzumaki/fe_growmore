import Header from "../../components/Header";
import PropertyCard from "../../components/PropertyCard";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
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
import { deleteProperty, getPropertyListData } from "../../api";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const Property = () => {
  const [propertyList, setPropertyList] = useState([]);
  const [filteredPropertyList, setFilteredPropertyList] = useState([]);
  const [error, setError] = useState('')
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const headers = [
    "Sr. No",
    "Property Name",
    "Property Type",
    "Location",
    "Country",
    "Actions",
  ];
  useEffect(() => {
    setError('')

    getData();
  }, []);

  const getData = async () => {
    const propertyList = await getPropertyListData();
    console.log("data ", propertyList.data.data);
    setPropertyList(propertyList?.data?.data);
    setFilteredPropertyList(propertyList?.data?.data)
  };
  const applyFilters = () => {
    const filteredData = propertyList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.name1?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_location?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_country?.country_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_status?.toLowerCase().includes(searchValue.toLowerCase())
      return matchesSearch
    });
    setFilteredPropertyList(filteredData);
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
      padding: "24px"
    },
  };
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-4`}>
          <Header name="Property" />
          <div className="flex">
            <p className="text-[#7C8DB5] mt-1.5 ml-1">
              Here is the information about all your Property
            </p>
          </div>
          <div className="flex justify-between items-center my-8 mx-4">
            <div className="max-w-fit">
              <Link
                to={"/property/add"}
                className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
              >
                Add New Property
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
          <span className="flex justify-center text-red-500">{error}</span>


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
                  {filteredPropertyList.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 text-center text-[15px]"
                      >
                        <td className="p-2 py-3">{i + 1}</td>
                        <td className="p-2 py-3">{item?.name1}</td>
                        <td className="p-2 py-3">{item?.type?.name}</td>
                        <td className="p-2 py-3">{item?.custom_location}</td>
                        <td className="p-2 py-3">{item?.custom_country?.country_name}</td>
                        <td className="p-2 py-3">
                          <div className="flex gap-3">
                            <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                              <Link to={`/property/edit/${item?.name}`} state={item?.name}>
                                <MdOutlineEdit
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </Link>
                            </button>
                            <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                              try {
                                setError("")
                                const confirmed = window.confirm(`Are you sure you want to delete this ${item?.name1}?`);
                                if (confirmed) {
                                  await deleteProperty(item?.name);
                                }
                              }
                              catch (e) {
                                setError(`Cannot delete ${item?.name1} because it is linked`)
                                console.log(e?.response?.data?._server_messages)
                              }
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
    </main>
  );
};

export default Property;
