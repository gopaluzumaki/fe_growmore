import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import Input from "./TextInput";
import { Add_Units } from "../constants/inputdata";
import { useNavigate } from "react-router-dom";
import { createProperty, uploadFile } from "../api";

interface FormData {
  propertyName: string;
  location: string;
  city: string;
  state: string;
  country: string;
  status: string;
  rentPrice: string;
  rooms: string;
  floors: string;
  doc: string;
  amenities: string;
  view: string;
  ownerName: string;
  tenantName: string;
  Description: string;
  contact: string;
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
    propertyName: "",
    location: "",
    city: "",
    state: "",
    country: "",
    status: "",
    rentPrice: "",
    rooms: "",
    floors: "",
    doc: "",
    amenities: "",
    view: "",
    ownerName: "",
    tenantName: "",
    Description: "",
    contact: "",
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
      name1: formData.propertyName,
      custom_location: formData.location,
      custom_thumbnail_image: imgUrl,
      rent: formData.rentPrice,
      parent_property: "Build2",
      custom_units_available: formData.rooms,
      // unit_owner: formData.ownerName,
      is_group: 0,
      cost_center: "Main - SRE",
      company: "Syscort Real Estate",
      custom_number_of_units: 1,
    };
    console.log("API Data => ", apiData);
    const res = await createProperty(apiData);
    if (res) {
      navigate("/units");
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
                    {Add_Units.map(({ label, name, type }) => (
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

export default AddUnits;
