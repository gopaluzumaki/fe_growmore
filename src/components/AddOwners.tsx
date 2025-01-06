// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Add_Owner,
  Type_Company,
  Type_Individual,
} from "../constants/inputdata";
import Input from "./TextInput";
import { createOwner, getCountryList, uploadFile } from "../api";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CustomDatePicker from "./CustomDatePicker";
import { formatDateToYYMMDD } from "../lib/utils";
import CustomFileUpload from "./ui/CustomFileUpload";

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

const AddOwners = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [imageArray, setImageArray] = useState<string[]>([]);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ownerType, setOwnerType] = useState(null);
  const [countryList,setCountryList]=useState([])
  const [loading, setLoading] = useState(false)

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
    country: "United Arab Emirates",
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
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLoading(true)

      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        const res = await uploadFile(file);
        setImgUrl(res?.data?.message?.file_url);
      }
      setLoading(false)

    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for mobile number validation (10 to 15 digits)
  const mobileRegex = /^[0-9]{10,15}$/;
  const maxEmailLength = 320;
  const [errors, setErrors] = useState({ ownerContact: '', email: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name==="ownerContact"){
      if (!mobileRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          ownerContact: 'Mobile number must be 10 to 15 digits.',
        }));
      } else {
        
        setErrors((prev) => ({ ...prev, ownerContact: '' }));
      }
    }
    else if(name==="email"){
      if (!emailRegex.test(value)||value?.length>320) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address.',
        }));
      } else {
        
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
    // else{
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    // }
  };
  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl }));

    try {
      console.log("API Data => ", formData);
      const res = await createOwner({
        custom_signature_image: imgUrl,
        custom_attachment_table: imageData,
        supplier_details: formData?.description,
        supplier_type: ownerType,
        supplier_name:
          ownerType === "Individual"
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
        ),
        custom_power_of_attorney_holder_name: formData?.poaHolder,

        custom_gender: formData.gender,
        custom_city: formData.city,
        country: formData.country,
        custom_nationality: formData.nationality,
        custom_passport_number: formData.passportNum,
        custom_passport_expiry_date: formatDateToYYMMDD(
          formData.passportExpiryDate
        ),
        custom_country_of_issuance: formData.countryOfIssuance,
        custom_emirates_id: formData.emiratesId,
        custom_emirates_id_expiry_date: formatDateToYYMMDD(
          formData.emiratesIdExpiryDate
        ),
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
    if (name === "ownerType") {
      setOwnerType(item);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const onSelect = (item) => {
    if (item === "Individual") {
      setOwnerType(item);
    } else if (item === "Company") {
      setOwnerType(item);
    }
  };
  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls])
  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Owners" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Owner > Add New"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Owner.map(({ label, name, type, values }) =>
                      type === "text" ? (
                        <Input
                        required={true}
                          key={name}
                          label={label}
                          name={name}
                          type={type}
                          value={formData[name as keyof FormData]}
                          onChange={handleChange}
                          borderd
                          bgLight
                          warning={errors[name]}
                        />
                      ) : type === "dropdown" ? (
                        <div>
                       <div className="flex  mb-1.5 ml-1 font-medium text-gray-700">
                            <label htmlFor="custom-dropdown">
                              {label}
                            </label>
                            <label><span style={{ color: "red" }}>*</span></label>
                          </div>
                        <Select
                        required
                          onValueChange={(item) => handleDropDown(name, item)}
                        >
                          <SelectTrigger className=" p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none">
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
                    {ownerType === "Individual" &&
                      Type_Individual.map(({ label, name, type, values }) =>
                        type === "text" ? (
                          <Input
                          required={true}
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
                        <div className="flex  mb-1.5 ml-1 font-medium text-gray-700">
                            <label htmlFor="custom-dropdown">
                              {label}
                            </label>
                            <label><span style={{ color: "red" }}>*</span></label>
                          </div>
                          <Select
                          required
                            onValueChange={(item) => handleDropDown(name, item)}
                            value={name==="country"?formData?.country:undefined}
                          >
                            <SelectTrigger className=" p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none">
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
                    {ownerType === "Company" &&
                      Type_Company.map(({ label, name, type }) =>
                        type === "text" ? (
                          <Input
                          required={true}
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
                          required
                            onValueChange={(item) => handleDropDown(name, item)}
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
                        <label>Upload Customer Signature</label>
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
                    <div>
                     
                      <div className="mb-5">
                                              <CustomFileUpload
                                                onFilesUpload={(urls) => {
                                                  setImgUrls(urls);
                                                }}
                                                type="image/*"
                                                setLoading={setLoading}
                                              />
                                            </div>
                    </div>
                  </div>
                  {imgUrl?.length > 0 && (<>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        Uploaded Signature
                      </p>
                      <div className="grid grid-cols-5 gap-4 w-25% h-25%">

                          <div key={imgUrl} className="relative w-[100px] h-[100px]">
                            <img
                              className="w-full h-full rounded-md"
                              src={
                                imgUrl
                                  ? `https://propms.erpnext.syscort.com/${imgUrl}`
                                  : "/defaultProperty.jpeg"
                              }
                              alt="propertyImg"
                            />
                            <button
                              type="button" // Prevent form submission
                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs"
                              onClick={() => setImgUrl('')}
                            >
                              X
                            </button>
                          </div>
                      </div>
                    </>)}
                  {imageArray?.length > 0 && (<>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        ID Attachments
                      </p>
                      <div className="grid grid-cols-5 gap-4 w-25% h-25%">
                        {imageArray.map((value, index) => (
                          <div key={index} className="relative w-[100px] h-[100px]">
                            <img
                              className="w-full h-full rounded-md"
                              src={
                                value
                                  ? `https://propms.erpnext.syscort.com/${value}`
                                  : "/defaultProperty.jpeg"
                              }
                              alt="propertyImg"
                            />
                            <button
                              type="button" // Prevent form submission
                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs"
                              onClick={() => handleRemoveImage(index)}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </>)}
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
                    <PrimaryButton title="Save" disabled={errors?.email?.length>0||errors?.ownerContact?.length>0||loading}/>
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

export default AddOwners;
