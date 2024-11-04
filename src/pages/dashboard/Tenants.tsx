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
import { img_group } from "../../assets";
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import { getTenantList } from "../../api";

const Tenants = () => {
  const [tenantList, setTenantList] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getTenantList();
    setTenantList(unitList?.data?.data);
  };

  console.log("unitList => ", tenantList);

  const headers = [
    "Sr. No",
    "Tenant Name",
    "Property Name",
    "Owner Name",
    "Unit Number",
    "Location",
    "status",
    "Images",
    " ",
  ];

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header />
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="max-w-fit">
                <Link
                  to={"/tenants/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Tenant
                  <IoAdd size={20} />
                </Link>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="w-[190px] p-3 py-6 text-[16px] text-sonicsilver bg-slate-100 outline-none">
                    <div className="flex items-center gap-3">
                      <VscFilter size={18} />
                      <SelectValue placeholder="All Units" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="unit1">Unit 1</SelectItem>
                      <SelectItem value="unit2">Unit 2</SelectItem>
                      <SelectItem value="unit3">Unit 3</SelectItem>
                      <SelectItem value="unit4">Unit 4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                    {tenantList.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item.tenant}</td>
                          <td className="p-2 py-3">{item.property}</td>
                          <td className="p-2 py-3">{item.owner}</td>
                          <td className="p-2 py-3">{item.unit}</td>
                          <td className="p-2 py-3">{item.location}</td>
                          <td className="p-2 py-3">
                            <div
                              className={`p-1 rounded ${
                                item.status === "Rented"
                                  ? "bg-[#FFEC1C] text-black"
                                  : item.status === "Available"
                                  ? "bg-[#34A853] text-white"
                                  : "bg-[#EB4335] text-white"
                              }`}
                            >
                              {item.status}
                            </div>
                          </td>
                          <td className="p-2 py-3">
                            <div className="flex justify-center">
                              <img src={img_group} />
                            </div>
                          </td>
                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                                <MdOutlineEdit
                                  size={20}
                                  className="text-[#D09D4A]"
                                />
                              </button>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
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

export default Tenants;
