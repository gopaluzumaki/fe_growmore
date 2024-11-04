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
import { getPropertyList } from "../../api";

const Property = () => {
  const [propertyList, setPropertyList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const propertyList = await getPropertyList();
    setPropertyList(propertyList?.data?.data);
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-4`}>
          <Header />
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
          <div className="my-4 p-6 grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-10 border border-[#E6EDFF] rounded-xl">
            {propertyList?.map((item: any, i) => (
              <PropertyCard
                key={i}
                img={`https://propms.erpnext.syscort.com/${item?.image}`}
                name={item?.property}
                location={item?.location}
                units={item?.number_of_units}
                availUnits={item?.units_available}
                path={`/property/${item?.property}`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Property;
