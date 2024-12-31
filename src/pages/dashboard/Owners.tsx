// @ts-nocheck
import { demo_avatar } from "../../assets";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import OwnerCard from "../../components/OwnerCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { VscFilter } from "react-icons/vsc";
import PrimaryButton from "../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { getOwnerList, getOwnerListData } from "../../api";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const Owners = () => {
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [filteredOwnerList, setFilteredOwnerList] = useState<any[]>([]);
  const [searchValue, setSearchvalue] = useState<string | null>(null);

  const [error,setError]=useState('')
  useEffect(() => {
    setError('')
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getOwnerListData();
    console.log("dase", unitList);
    setOwnerList(unitList?.data?.data);
    setFilteredOwnerList(unitList?.data?.data)
  };
  const applyFilters = () => {
    const filteredData = ownerList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.supplier_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_phone_number?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_number_of_property?.toLowerCase().includes(searchValue.toLowerCase())|| 
        item?.custom_number_of_units?.toLowerCase().includes(searchValue.toLowerCase())
        return matchesSearch 
    });
    setFilteredOwnerList(filteredData);
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
  console.log("unitList => ", ownerList);
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-4`}>
          <Header name="Owners" />
          <div className="flex">
            <p className="text-[#7C8DB5] mt-1.5 ml-1">
              Here is the information about all your Owners
            </p>
          </div>
          <div className="flex justify-between items-center my-8 mx-4">
            <div className="max-w-fit">
              <Link
                to={"/owners/add"}
                className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
              >
                Add New Owner
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

          <div className="my-4 grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-10 rounded-xl">
            {filteredOwnerList.map((item, i) => (
              <OwnerCard
                redirect="owners"
                key={i}
                name1={item?.name}
                name={item?.supplier_name}
                contact={item.custom_phone_number}
                email={item.custom_email}
                // location="Downtown, DSO"
                totalProperty={item.custom_number_of_property}
                totalUnit={item.custom_number_of_units}
                img={demo_avatar}
                getData={getData}
                setError={setError}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Owners;
