// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import Input from "./TextInput";
import { Add_Units } from "../constants/inputdata";
import { useNavigate } from "react-router-dom";
import { createProperty, uploadFile } from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface FormData {
  location: string;
  city: string;
  state: string;
  country: string;
  status: string;
  rentPrice: string;
  sellingPrice: string;
  sqFoot: string;
  sqMeter: string;
  priceSqMeter: string;
  priceSqFt: string;
  unitNumber: string;
  rooms: string;
  floors: string;
  bathrooms: string;
  balcony: string;
  view: string;
  ownerName: string;
  tenantName: string;
}

// {
//   "name1": "101",
//   "is_group": 0,
//   "parent_property": "Build1",
//   "company": "Syscort Real Estate",
//   "cost_center": "Main - SRE",
//   "custom_number_of_units": 0,
//   "custom_units_available":"1 BHK",
//   "custom_location": "Dubai",
//   "custom_thumbnail_image": "",
//   "unit_owner": "Saeed",
//   "rent": 0.0
// }

const AddUnits = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [sqmValue, setSqmValue] = useState();
  const [priceSqFt, setPriceSqFt] = useState();
  const [priceSqMeter, setPriceSqMeter] = useState();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        const res = await uploadFile(file);
        setImgUrl(res?.data?.message?.file_url);
      }
    }
  };

  const [formData, setFormData] = useState<FormData>({
    location: "",
    city: "",
    state: "",
    country: "",
    status: "",
    rentPrice: "",
    sellingPrice: "",
    sqFoot: "",
    sqMeter: "",
    priceSqMeter: "",
    priceSqFt: "",
    unitNumber: "",
    rooms: "",
    floors: "",
    bathrooms: "",
    balcony: "",
    view: "",
    ownerName: "",
    tenantName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("dsadas", formData);
    if (name === "sqFoot" && value) {
      let sqMeter = value * 0.092903;
      handleDropDown("sqMeter", value * 0.092903);
      handleDropDown("priceSqFt", formData["rentPrice"] / value);
      handleDropDown("priceSqMeter", formData["rentPrice"] / sqMeter);

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    } else if (!value) {
      handleDropDown("sqMeter", 0);
      handleDropDown("priceSqFt", 0);
      handleDropDown("priceSqMeter", 0);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropDown = (name, item) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("API Data => ", formData);
      const res = await createProperty(formData);
      if (res) {
        navigate("/units");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Units" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Unit > Add New"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Units.map(({ label, name, type, values }) =>
                      type === "text" ? (
                        <Input
                          key={name}
                          label={label}
                          name={name}
                          type={type}
                          value={formData[name as keyof FormData]}
                          onChange={handleChange}
                          borderd
                          bgLight
                        />
                      ) : type === "dropdown" ? (
                        <Select
                          onValueChange={(item) => handleDropDown(name, item)}
                        >
                          <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                            <div className="flex items-center">
                              <SelectValue placeholder={label} />
                            </div>
                          </SelectTrigger>
                          <SelectContent onChange={() => console.log("hello")}>
                            {values?.map((item, i) => (
                              <SelectItem key={i} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <></>
                      )
                    )}
                    <div>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        <label>Image Attachment</label>
                      </p>
                      <div
                        className={`flex items-center gap-3 p-2.5 bg-white border border-[#CCDAFF] rounded-md overflow-hidden`}
                      >
                        <input
                          className={`w-full bg-white outline-none`}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="mb-1.5 ml-1 font-medium text-gray-700">
                      <label>Description</label>
                    </p>
                    <textarea
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddUnits;
