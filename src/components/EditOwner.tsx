// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState, useEffect } from "react";
import {
  Add_Owner,
  Type_Company,
  Type_Individual,
} from "../constants/inputdata";
import Input from "./TextInput";
import { uploadFile, fetchOwner, updateOwner, getCountryList } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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

// {
//   "supplier_name":"Emaar",
//   "supplier_type": "Company"
//   }

const EditOwner = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const location = useLocation();
  console.log(location.state);
  const [countryList,setCountryList]=useState([])

  const [formData, setFormData] = useState<FormData>({
    ownerType: "",
    ownerContact: "",
    email: "",
    propertyCount: "",
    units: "",
    location: "",
    ownerName: "",
    gender: "",
    city: "",
    country: "",
    nationality: "",
    passportNum: "",
    passportExpiryDate: null,
    countryOfIssuance: "",
    emiratesId: "",
    emiratesIdExpiryDate: "",
    companyName: "",
    tradeLicenseNumner: "",
    emirate: "",
    tradeLicense: null,
    poaHolder: "",
    description: "",
  });
useEffect(()=>{
  getCountryListData()
},[])
const getCountryListData=async()=>{
const res=await getCountryList()

setCountryList(res?.data?.data)
}
  useEffect(() => {
    console.log("from edit owner", location.state);
    const fetchingOwnerData = async () => {
      if (location.state) {
        try {
          const res = await fetchOwner(location.state);
          const item = res?.data?.data;
          console.log("owner item", item);
          if (item) {
            setFormData((prevData) => {
              return {
                ...prevData,
                // more TODO ---------->
                ownerType: item?.supplier_type,
                description: item?.supplier_details,
                ownerName: item?.supplier_name,
                companyName: item?.supplier_name,
                ownerContact: item?.custom_phone_number,
                email: item?.custom_email,
                propertyCount: item?.custom_number_of_property,
                units: item?.custom_number_of_units,
                location: item?.custom_location__area,

                tradeLicenseNumner: item?.custom_trade_license_number,
                emirate: item?.custom_emirate,
                tradeLicense: item?.custom_trade_license_expiry_date,
                poaHolder: item?.custom_power_of_attorney_holder_name,

                gender: item?.custom_gender,
                city: item?.custom_city,
                country: item?.country,
                nationality: item?.custom_nationality,
                passportNum: item?.custom_passport_number,
                passportExpiryDate: item?.custom_passport_expiry_date,
                countryOfIssuance: item?.custom_country_of_issuance,
                emiratesId: item?.custom_emirates_id,
                emiratesIdExpiryDate: item?.custom_emirates_id_expiry_date,
                custom_date_of_birth:item?.custom_date_of_birth,
        custom_visa_start_date:item?.custom_visa_start_date,
        custom_visa_end_date:item?.custom_visa_end_date
              };
            });
            setImgUrl(item?.custom_image_attachment || "");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchingOwnerData();
  }, [location.state]);

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

  const formatDateToYYMMDD = (date: string): string => {
    const dateObj = new Date(date);
    if (!date) return "";
    const year = dateObj.getFullYear().toString().slice(-2);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("API Data => ", formData);
      const res = await updateOwner(location.state, {
        image: imgUrl,
        supplier_details: formData?.description,
        supplier_name:
          formData.ownerType === "Individual"
            ? formData?.ownerName
            : formData?.companyName,
        custom_phone_number: formData?.ownerContact,
        custom_email: formData?.email,
        custom_number_of_property: formData?.propertyCount,
        custom_number_of_units: formData?.units,
        custom_location__area: formData?.location,

        custom_trade_license_number: formData?.tradeLicenseNumner,
        custom_emirate: formData?.emirate,
        custom_trade_license_expiry_date: formatDateToYYMMDD(
          formData?.tradeLicense
        ), //TODO
        custom_power_of_attorney_holder_name: formData?.poaHolder,

        custom_gender: formData.gender,
        custom_city: formData.city,
        country: formData.country,
        custom_nationality: formData.nationality,
        custom_passport_number: formData.passportNum,
        custom_passport_expiry_date: formatDateToYYMMDD(
          formData.passportExpiryDate
        ), //TODO
        custom_country_of_issuance: formData.countryOfIssuance,
        custom_emirates_id: formData.emiratesId,
        custom_emirates_id_expiry_date: formatDateToYYMMDD(
          formData.emiratesIdExpiryDate
        ), //TODO
        custom_date_of_birth:formatDateToYYMMDD(formData?.custom_date_of_birth),
        custom_visa_start_date:formatDateToYYMMDD(formData?.custom_visa_start_date),
        custom_visa_end_date:formatDateToYYMMDD(formData?.custom_visa_end_date)
      });
      if (res) {
        navigate("/owners");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDropDown = async (name, item) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Owners" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Owner > Edit Owner"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Owner.map(({ label, name, type, values }) =>
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
                          value={formData[name]}
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
                    {formData.ownerType === "Individual" &&
                      Type_Individual.map(({ label, name, type, values }) =>
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
                          <div>
                          <label htmlFor="custom-dropdown" className="mb-1.5 ml-1 font-medium text-gray-700">
          {label}
        </label>
                          <Select
                            onValueChange={(item) => handleDropDown(name, item)}
                            value={formData[name]}
                          >
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
                              <div className="flex items-center">
                                <SelectValue placeholder={label} />
                              </div>
                            </SelectTrigger>
                            <SelectContent
                              onChange={() => console.log("hello")}
                            >
                              {(name==="country"?countryList:values)?.map((item, i) => (
                                <SelectItem key={i} value={name==="country"?item.name:item}>
                                  {name==="country"?item.name:item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          </div>
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
                    {formData.ownerType === "Company" &&
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
                          <Select
                            onValueChange={(item) => handleDropDown(name, item)}
                            value={formData[name]}
                          >
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
                      name="description"
                      onChange={handleChange}
                      value={formData.description}
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Update Owner" />
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

export default EditOwner;
