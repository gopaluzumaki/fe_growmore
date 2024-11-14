import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import {
  Add_Tenant,
  Type_Company,
  Type_Individual_Tenant,
} from "../constants/inputdata";
import Input from "./TextInput";
import { useNavigate } from "react-router-dom";
import { createTenant, uploadFile } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import CustomDatePicker from "./CustomDatePicker";
interface FormData {
  ownerName: string;
  gender: string;
  city: string;
  country: string;
  nationality: string;
  passportNum: string;
  passportExpiryDate: Date | null;
  countryOfIssuance: string;
  emiratesId: string;
  emiratesIdExpiryDate: string;
  companyName: string;
  tradeLicenseNumner: string;
  emirate: string;
  tradeLicense: Date | null;
  poaHolder: string;
  description: string;
  [key: string]: string | Date | null;
}

const AddTenants = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ownerType, setOwnerType] = useState(null);

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    gender: '',
    city: '',
    country: '',
    nationality: '',
    passportNum: '',
    passportExpiryDate: null,
    countryOfIssuance: '',
    emiratesId: '',
    emiratesIdExpiryDate: '',
    companyName: '',
    tradeLicenseNumner: '',
    emirate: '',
    tradeLicense: null,
    poaHolder: '',
    description: '',
  });

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

  const onSelect = (item) => {
    if (item === "Individual") {
      setOwnerType(item);
    } else if (item === "Company") {
      setOwnerType(item);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("API Data => ", formData);
      const res = await createTenant(formData);
      if (res) {
        navigate("/tenants");
      }
    }catch(err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Customer" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Customer > Add New"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Tenant.map(({ label, name, type, values }) =>
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
                        <Select onValueChange={(item) => onSelect(item)}>
                          <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                            <div className="flex items-center">
                              <SelectValue placeholder={label} />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {values?.map((item, i) => (
                              <SelectItem key={i} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : type === "date" ? (
                        <CustomDatePicker
                          selectedDate={formData[name] as Date}
                          onChange={(date) => handleDateChange(name, date)}
                          label={label}
                          placeholder="Select Date"
                        />
                      ) : (
                        <></>
                      )
                    )}
                    {ownerType === "Individual" &&
                      Type_Individual_Tenant.map(
                        ({ label, name, type, values }) =>
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
                            <Select onValueChange={(item) => onSelect(item)}>
                              <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                                <div className="flex items-center">
                                  <SelectValue placeholder={label} />
                                </div>
                              </SelectTrigger>
                              <SelectContent
                                onChange={() => console.log("hello")}
                              >
                                {values?.map((item, i) => (
                                  <SelectItem key={i} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : type === "date" ? (
                            <CustomDatePicker
                              selectedDate={formData[name] as Date}
                              onChange={(date) => handleDateChange(name, date)}
                              label={label}
                              placeholder="Select Date"
                            />
                          ) : (
                            <></>
                          )
                      )}
                    {ownerType === "Company" &&
                      Type_Company.map(({ label, name, type }) =>
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
                          <Select onValueChange={(item) => onSelect(item)}>
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                              <div className="flex items-center">
                                <SelectValue placeholder={label} />
                              </div>
                            </SelectTrigger>
                            <SelectContent
                              onChange={() => console.log("hello")}
                            >
                              {/* {values?.map((item, i) => (
                                <SelectItem key={i} value={item}>
                                  {item}
                                </SelectItem>
                              ))} */}
                            </SelectContent>
                          </Select>
                        ) : type === "date" ? (
                          <CustomDatePicker
                            selectedDate={formData[name] as Date}
                            onChange={(date) => handleDateChange(name, date)}
                            label={label}
                            placeholder="Select Date"
                          />
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

export default AddTenants;
