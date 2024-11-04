import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import Input from "./TextInput";
import { Add_Lead } from "../constants/inputdata";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead, uploadFile } from "../api";

interface FormData {
  leadName: string;
  ownerName: string;
  propertyName: string;
  location: string;
  country: string;
  unitCount: string;
  city: string;
  state: string;
  postcode: string;
  status: string;
  rentPrice: string;
  contact: string;
  residence: string;
  nationality: string;
  type: string;
  email: string;
  passportNum: string;
  emiratesId: string;
  leaseInDate: string;
  leaseOutDate: string;
  ownerContact: string;
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
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

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
    ownerName: "",
    propertyName: "",
    location: "",
    country: "",
    unitCount: "",
    city: "",
    state: "",
    postcode: "",
    status: "",
    rentPrice: "",
    contact: "",
    residence: "",
    nationality: "",
    type: "",
    email: "",
    passportNum: "",
    emiratesId: "",
    leaseInDate: "",
    leaseOutDate: "",
    ownerContact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiData = {
      first_name: "Saeed",
      lead_name: formData.leadName,
      lead_owner: formData.ownerName,
      type: formData.type,
      custom_property: "101",
      annual_revenue: 0,
      country: formData.country,
      qualification_status: "Unqualified",
      title: "Saeed",
    };
    console.log("API Data => ", apiData);
    const res = await createLead(apiData);
    if (res) {
      navigate("/leads");
    }
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header />
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Lead.map(({ label, name, type }) => (
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
                    ))}
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

export default AddLeads;
