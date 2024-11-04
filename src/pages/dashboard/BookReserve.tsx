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

const BookReserve = () => {
  const [bookingList, setBookingList] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const unitList = await getBookingList();
    setBookingList(unitList?.data?.data);
  };

  console.log("unitList => ", bookingList);

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-4`}>
          <Header />
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
              <Select>
                <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-slate-100 outline-none">
                  <div className="flex items-center gap-3">
                    <VscFilter size={18} />
                    <SelectValue placeholder="Select Properties" />
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
              <Select>
                <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-slate-100 outline-none">
                  <div className="flex items-center gap-3">
                    <VscFilter size={18} />
                    <SelectValue placeholder="Select Unit" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Unit1">Unit 1</SelectItem>
                    <SelectItem value="Unit2">Unit 2</SelectItem>
                    <SelectItem value="Unit3">Unit 3</SelectItem>
                    <SelectItem value="Unit4">Unit 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-slate-100 outline-none">
                  <div className="flex items-center gap-3">
                    <VscFilter size={18} />
                    <SelectValue placeholder="Select Tenant" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Tenant1">Tenant 1</SelectItem>
                    <SelectItem value="Tenant2">Tenant 2</SelectItem>
                    <SelectItem value="Tenant3">Tenant 3</SelectItem>
                    <SelectItem value="Tenant4">Tenant 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="w-[100px]">
                <PrimaryButton title="Apply" />
              </div>
            </div>
          </div>
          <div className="my-4 p-6 grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-10 border border-[#E6EDFF] rounded-xl">
            {bookingList.map((item, i) => (
              <OwnerCard
                key={i}
                name={item?.customer}
                contact="971 52 489 1755"
                email="John@gmail.com"
                location="Downtown, DSO"
                totalProperty={item?.property}
                totalUnit="03"
                img={demo_avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookReserve;
