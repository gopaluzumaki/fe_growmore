// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import Input from "./TextInput";
import { Add_Lead } from "../constants/inputdata";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const location = useLocation();
  console.log("location-state :", location.state);

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
      if (location.state) {
        try {
          const res = await fetchLeads(location.state);
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
                nationality: "",
                email: item?.email_id,
                leaseInDate: "",
                budgetRange: "",
                propertyPreference: item?.custom_property || "",
                areaPreference: "",
                communityPreference: "",
                bedroomPreference: "",
                leadStatus: item?.status || "",
                description: "",
              };
            });
            setImgUrl(item?.custom_image_attachment || "");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchingLeadData();
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    try {
      console.log("API Data => ", formData);
      const res = await updateLead(location.state, {
        // lead_owner:formData?.leadName,
        status: formData?.leadStatus,
        type: formData?.leadType,
        mobile_no: formData?.contact,
        email_id: formData?.email,
        // custom_property:formData?.propertyPreference,
      });
      if (res) {
        navigate("/leads");
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
                        />
                      ) : type === "dropdown" ? (
                        <Select
                          onValueChange={(value) =>
                            handleDropdownChange(name, value)
                          }
                          value={formData[name]}
                        >
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
                      name="description"
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Update Lead" />
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
