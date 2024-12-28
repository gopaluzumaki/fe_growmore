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

const Property = () => {
  const [propertyList, setPropertyList] = useState([]);
  const [error, setError] = useState('')
  const headers = [
    "Sr. No",
    "Name of property",
    "Property Type",
    "Location",
    "Country",
    "Status",
    "Actions",
  ];
  useEffect(() => {
    setError('')

    getData();
  }, []);

  const getData = async () => {
    const propertyList = await getPropertyListData();
    console.log("nbv", propertyList.data.data);
    setPropertyList(propertyList?.data?.data);
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
            <div>
              <Select>
                <SelectTrigger className="w-[190px] p-3 py-6 text-[16px] text-sonicsilver bg-slate-100 outline-none">
                  <div className="flex items-center gap-3">
                    <VscFilter size={18} />
                    <SelectValue placeholder="All Properties" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Property1">Property 1</SelectItem>
                    <SelectItem value="Property2">Property 2</SelectItem>
                    <SelectItem value="Property3">Property 3</SelectItem>
                    <SelectItem value="Property4">Property 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                  {propertyList.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 text-center text-[15px]"
                      >
                        <td className="p-2 py-3">{i + 1}</td>
                        <td className="p-2 py-3">{item?.name1}</td>
                        <td className="p-2 py-3">{item?.type}</td>
                        <td className="p-2 py-3">{item?.custom_location}</td>
                        <td className="p-2 py-3">{item?.custom_country}</td>
                        <td className="p-2 py-3">{item?.custom_status}</td>
                        <td className="p-2 py-3">
                          <div className="flex gap-3">
                            <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                              <Link to={"/property/edit"} state={item?.name}>
                                <MdOutlineEdit
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </Link>
                            </button>
                            <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                              try {
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
