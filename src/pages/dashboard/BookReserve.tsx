import { demo_avatar, demo_Property } from "../../assets";
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
import PrimaryButton from "../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { getBookingList } from "../../api";
import OwnerCard from "../../components/OwnerCard";
import { Input } from "@mantine/core";
import { CiSearch } from "react-icons/ci";

const BookReserve = () => {
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [filteredBookingList, setFilteredBookingList] = useState<any[]>([]);
  const [searchValue, setSearchvalue] = useState<string | null>(null);


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getBookingList();
    setFilteredBookingList(unitList?.data?.data)
    setBookingList(unitList?.data?.data);
  };

  console.log("unitList => ", bookingList);
  const applyFilters = () => {
    const filteredData = bookingList.filter((item) => {
      const matchesSearch = !searchValue ||
        item?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_contact_number?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_location__area?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.property?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item?.custom_unit_number?.toLowerCase().includes(searchValue.toLowerCase())
      return matchesSearch 
    });
    setFilteredBookingList(filteredData);
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
        <div className={`flex-grow ml-80 my-5 px-4`}>
          <Header name="Booking / Reservation" />
          <div className="flex">
            <p className="text-[#7C8DB5] mt-1.5 ml-1">
              Here is the information about all your Booking / Reservation
            </p>
          </div>
          <div className="flex justify-between items-center my-8 mx-4">
            <div className="max-w-fit">
              <Link
                to={"/booking/add"}
                className="flex items-center gap-2 text-sonicsilver p-3 px-6 border rounded-lg bg-slate-100"
              >
                Add New Booking
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
          <div className="my-4 p-6 grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-10 border border-[#E6EDFF] rounded-xl">
            {filteredBookingList.map((item, i) => (
              <OwnerCard
                redirect="booking"
                key={i}
                name={item?.name}
                contact={item?.custom_contact_number}
                email={item?.custom_email}
                location={item?.custom_location__area}
                totalProperty={item?.property}
                totalUnit={item?.custom_unit_number}
                img={demo_avatar}
                getData={getData}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookReserve;
