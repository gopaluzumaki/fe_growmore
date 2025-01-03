// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import Input from "./TextInput";
import { Add_Lead } from "../constants/inputdata";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLead, uploadFile, fetchLeads, updateLead } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CustomDatePicker from "./CustomDatePicker";
import { useLocation } from "react-router-dom";
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
  description: string;
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

const EditLead = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrls, setImgUrls] = useState([]);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [imageArray, setImageArray] = useState([])
  const {id} = useParams()
  const location = useLocation();
  console.log("location-state :", id);

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
    description: "",
  });

  useEffect(() => {
    const fetchingLeadData = async () => {
      if (id) {
        try {
          const res = await fetchLeads(id);
          const item = res?.data?.data;
          console.log("booking item", item);
          if (item) {
            setFormData((prevData) => {
              return {
                ...prevData,
                // more TODO ---------->
                leadName: item?.lead_name || "",
                leadType: item?.type || "",
                contact: item?.mobile_no,
                leadStatus: item?.status,

                email: item?.email_id,
                leaseInDate: item?.custom_tentative_lease_data,
                budgetRange: item?.custom_budget_range,
                propertyPreference: item?.custom_property_preference,
                areaPreference: item?.custom_area_preference,
                communityPreference: item?.custom_community_preference,
                bedroomPreference: item?.custom_bedroom_preference,
                description: item?.custom_description,
              };
            });
            // setImgUrls(item?.custom_image_attachment || "");
          }
          if (item?.custom_attachment_table?.length > 0) {
            const imageArray = item?.custom_attachment_table?.map((item) => item.image);
            setImageArray(imageArray)
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchingLeadData();
  }, [id]);

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
  useEffect(()=>{
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  },[imgUrls])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl }));

    try {
      console.log("API Data => ", formData);
      const res = await updateLead(id, {
        first_name:formData?.leadName,
        status: formData?.leadStatus,
        type: formData?.leadType,
        mobile_no: formData?.contact,
        email_id: formData?.email,
        // custom_property:formData?.propertyPreference,
        custom_tentative_lease_data: formData?.leaseInDate,
        custom_budget_range: formData?.budgetRange,
        custom_property_preference: formData?.propertyPreference,

        custom_area_preference: formData?.areaPreference,
        custom_community_preference: formData?.communityPreference,
        custom_bedroom_preference: formData?.bedroomPreference,
        custom_description: formData?.description,
        custom_attachment_table: imageData,
        custom_imagephoto: '',
      });
      if (res) {
        navigate("/leads");
      }
    } catch (err) {
      console.log(err);
    }
  };
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
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Lead > Edit Lead"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Lead.map(({ label, name, type, values }) =>
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
                          warning={errors[name]}
                        />
                      ) : type === "dropdown" ? (
                        <div>
                        <label htmlFor="custom-dropdown" className="mb-1.5 ml-1 font-medium text-gray-700">
        {label}
      </label>
                        <Select
                          onValueChange={(value) =>
                            handleDropdownChange(name, value)
                          }
                          value={formData[name]}
                        >
                          <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
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
                                          />
                                        </div>
                  </div>
                  <div className="mt-5">
                    <p className="mb-1.5 ml-1 font-medium text-gray-700">
                      <label>Description</label>
                    </p>
                    <textarea
                      rows={8}
                      name="description"
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      onChange={handleChange}
                      value={formData.description}
                    ></textarea>
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
                    </div></>)}
                  <div className="mt-4 max-w-[200px]">
                    <PrimaryButton title="Update Lead" disabled={errors?.email?.length>0||errors?.contact?.length>0}/>
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

export default EditLead;
