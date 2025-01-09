// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import Input from "./TextInput";
import { Add_Lead } from "../constants/inputdata";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead, uploadFile } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CustomDatePicker from "./CustomDatePicker";
import CustomFileUpload from "./ui/CustomFileUpload";

interface FormData {
  leadName: string;
  leadType: string;
  contact: string;
  nationality: string;
  email: string;
  leaseInDate: Date | null;
  budgetRange: string;
  propertyPreference: string;
  areaPreference: string;
  communityPreference: string;
  bedroomPreference: string;
  leadStatus: string;
  [key: string]: string | Date | null;
}

// {
//   "first_name": "Saeed",
//   "lead_name": "Saeed",
//   "lead_owner": "Administrator",
//   "custom_property": "101",
//   "annual_revenue": 0,
//   "country": "United Arab Emirates",
//   "qualification_status": "Unqualified",
//   "title": "Saeed",
// }

const AddLeads = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        const res = await uploadFile(file);
        setImgUrls(res?.data?.message?.file_url);
      }
    }
  };
  const [formData, setFormData] = useState<FormData>({
    leadName: "",
    leadType: "",
    contact: "",
    nationality: "",
    email: "",
    leaseInDate: null,
    budgetRange: "",
    propertyPreference: "",
    areaPreference: "",
    communityPreference: "",
    bedroomPreference: "",
    leadStatus: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for mobile number validation (10 to 15 digits)
  const mobileRegex = /^[0-9]{10,15}$/;
  const maxEmailLength = 320;
  const [errors, setErrors] = useState({ contact: '', email: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name==="contact"){
      if (!mobileRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          contact: 'Mobile number must be 10 to 15 digits.',
        }));
      } else {
        
        setErrors((prev) => ({ ...prev, contact: '' }));
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

  const handleDropdownChange = (name: string, value: string) => {
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
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));

    try {
      console.log("API Data => ", formData);
      const res = await createLead({
        first_name:formData?.leadName,
        lead_owner: "saeed.m@syscort.com",
        status: formData?.leadStatus,
        type: formData?.leadType,
        mobile_no: formData?.contact,
        email_id: formData?.email,
        custom_tentative_lease_data: formData?.leaseInDate,
        custom_budget_range: formData?.budgetRange,
        custom_property_preference: formData?.propertyPreference,
        custom_attachment_table: imageData,
        custom_area_preference: formData?.areaPreference,
        custom_community_preference: formData?.communityPreference,
        custom_bedroom_preference: formData?.bedroomPreference,
        custom_description: formData?.description,

        custom_imagephoto: "",
      });
      if (res) {
        navigate("/leads");
      }
    } catch (err) {
      console.log(err);
    }
  };
 useEffect(()=>{
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  },[imgUrls])
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
            <Header name="Leads" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Lead > Add New"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Lead.map(({ label, name, type, values }) =>
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
                          onValueChange={(value) =>
                            handleDropdownChange(name, value)
                          }
                        >
                          <SelectTrigger className=" p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none">
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
                     {/* Attachment */}
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
                  {imageArray?.length > 0 && (<>
                    <p className="mb-1.5 ml-1 font-medium text-gray-700">
                          Attachments
                      </p>
                    <div className="grid grid-cols-5 gap-4 w-25% h-25%">
                      {imageArray.map((value, index) => (
                        <div key={index} className="relative w-[100px] h-[100px]">
                          <img
                            className="w-full h-full rounded-md"
                            src={
                              value.url
                                ? `https://propms.erpnext.syscort.com/${value.url}`
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
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      onChange={(e) => handleChange(e)}
                      name="description"
                      value={formData?.description}
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save" disabled={errors?.email?.length>0||errors?.contact?.length>0||loading}/>
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

export default AddLeads;
