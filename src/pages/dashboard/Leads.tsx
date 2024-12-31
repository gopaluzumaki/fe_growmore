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
import { MdDeleteForever, MdOutlineEdit } from "react-icons/md";
import { img_group } from "../../assets";
import { useEffect, useState } from "react";
import { deleteLead, getLeadList } from "../../api";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const Leads = () => {
  const [leadList, setLeadList] = useState<any[]>([]);
  const [filteredLeadList, setFilteredLeadList] = useState<any[]>([]);
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getLeadList();
    console.log(res,"mkl")
    setLeadList(res?.data?.data);
    setFilteredLeadList(res?.data?.data)
  };

  console.log("unitList => ", leadList);

  const headers = [
    "Sr. No",
    "Lead Name",
    "Customer Type",
    "Owner Name",
    "Company",
    "Status",
    "Actions",
  ];
  const applyFilters = () => {
    const filteredData = leadList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.lead_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.lead_owner?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_property?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.company?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.status?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.type?.toLowerCase().includes(searchValue.toLowerCase()) 


      return matchesSearch 
    });
    setFilteredLeadList(filteredData);
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
            <Header name="Leads" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                Here is the information about all your Leads
              </p>
            </div>
            <div className="flex justify-between items-center my-8 mx-4">
              <div className="max-w-fit">
                <Link
                  to={"/leads/add"}
                  className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
                >
                  Add New Lead
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
                    {filteredLeadList.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 text-center text-[15px]"
                        >
                          <td className="p-2 py-3">{i + 1}</td>
                          <td className="p-2 py-3">{item.lead_name}</td>
                          <td className="p-2 py-3">{item.type}</td>
                          <td className="p-2 py-3">{item.lead_owner}</td>
                          <td className="p-2 py-3">{item.company}</td>
                          <td className="p-2 py-3">
                            <div
                              className={`p-1 rounded ${item.status === "Rented"
                                ? "bg-[#FFEC1C] text-black"
                                : item.status === "Open"
                                  ? "bg-[#34A853] text-white"
                                  : "bg-[#EB4335] text-white"
                                }`}
                            >
                              {item.status}
                            </div>
                          </td>

                          <td className="p-2 py-3">
                            <div className="flex gap-3">
                              <Link to={`/leads/edit/${item?.name}`} state={item.name}>
                                <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer">
                                  {" "}
                                  <MdOutlineEdit
                                    size={20}
                                    className="text-[#D09D4A]"
                                  />
                                </button>
                              </Link>
                              <button className="bg-[#F7F7F7] border border-[#C3C3C3] p-1.5 rounded cursor-pointer" onClick={async () => {
                                const confirmed = window.confirm(`Are you sure you want to delete this ${item.lead_name}?`);
                                if (confirmed) {
                                  await deleteLead(item.name)
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

export default Leads;
