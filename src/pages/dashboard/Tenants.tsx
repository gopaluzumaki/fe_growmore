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
import { deleteCustomer, getTenantList, getTenantsFromAPI } from "../../api";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const Tenants = () => {
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [filteredTenantList, setFilteredTenantList] = useState<any[]>([]);
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const [error, setError] = useState('')
  useEffect(() => {
    setError('')
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getTenantsFromAPI(`?fields=["*"]&order_by=creation desc`);
    console.log("unitlist", unitList);
    setTenantList(unitList?.data?.data);
    setFilteredTenantList(unitList?.data?.data)
  };

  console.log("unitList => ", tenantList);

  const headers = [
    "Sr. No",
    "Customer Name",
    "Customer Type",
    "Customer Email",
    "Actions"
    // "Property Name",
    // "Owner Name",
    // "Unit Number",
    // "Location",
    // "status",
  ];
  const applyFilters = () => {
    const filteredData = tenantList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.customer_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_email?.toLowerCase().includes(searchValue.toLowerCase())
        return matchesSearch 
    });
    setFilteredTenantList(filteredData);
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
  const formatEmail = (email) => {
    if (email.length > 50) {
      const firstPart = email.slice(0, 5);
      const lastPart = email.slice(-5);
      return `${firstPart}...${lastPart}`;
    }
    return email;
  };
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80`}>
          <div className="my-5 px-2">
            <Header name="Customers" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Customers
              </p>
            </div>
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="max-w-fit">
                <Link
                  to={"/tenants/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Customer
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
                <span className="flex justify-center text-red-500">{error}</span>

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
                    {filteredTenantList.map((item, i) => {
                      {
                        console.log("tem213", item);
                      }
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item.customer_name}</td>
                          <td className="p-2 py-3">{item.customer_type}</td>
                          <td className="p-2 py-3">{formatEmail(item.custom_email)}</td>
                          {/* <td className="p-2 py-3">{item.property}</td>
                          <td className="p-2 py-3">{item.owner}</td>
                          <td className="p-2 py-3">{item.unit}</td>
                          <td className="p-2 py-3">{item.location}</td> */}
                          {/* <td className="p-2 py-3">
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
                          </td> */}
                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                                <Link
                                  to={`/tenants/edit/${item?.name}`}
                                  state={item.name}
                                >
                                  <MdOutlineEdit
                                    size={20}
                                    className="text-[#D09D4A]"
                                  />
                                </Link>
                              </button>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                                try {
                                  setError("")
                                  const confirmed = window.confirm(`Are you sure you want to delete this ${item.customer_name}?`);
                                  if (confirmed) {
                                    await deleteCustomer(item.name);
                                  }

                                }
                                catch (e) {
                                  setError(`Cannot delete ${item.customer_name} because it is linked`)
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
      </div>
    </main>
  );
};

export default Tenants;
