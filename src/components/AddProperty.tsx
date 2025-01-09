// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import { Add_Property } from "../constants/inputdata";
import Input from "./TextInput";
import { createProperty, getCountryList, uploadFile } from "../api";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import CustomFileUpload from "./ui/CustomFileUpload";

interface FormData {
  propertyName: string;
  type: string;
  location: string;
  units: string;
  communityName: string;
  area: string;
  city: string;
  custom_country: string;
  custom_status: string;
  amenities: string;
  rent: string;
  description: string;
  imageAttachment?: File;
}

// {
//   "name1": "Build1",
//   "is_group": 1,
//   "company": "Syscort Real Estate",
//   "cost_center": "Main - SRE",
//   "custom_number_of_units": 0,
//   "custom_units_available":"1 BHK",
//   "custom_location": "Dubai",
//   "custom_thumbnail_image": "/files/build1.jpg",
//   "unit_owner": "Saeed",
//   "rent": 0.0
// }

const AddProperty = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [loading,setLoading] = useState(false)
  const [countryList, setCountryList] = useState([])
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    type: "",
    name: "",
    name1: "",
    cost_center: "Main - SRE",
    custom_location: "",
    custom_number_of_units: "",
    custom_community_name: "",
    custom_area: "",
    custom_city: "",
    custom_country: "United Arab Emirates",
    custom_status: "",
    rent: "",
    description: "",
    custom_amenities: "",
    custom_thumbnail_image: "",
    is_group: 1,
  });
  useEffect(() => {
    getCountryListData()
  }, [])
  const getCountryListData = async () => {
    const res = await getCountryList()

    setCountryList(res?.data?.data)
  }
  const handleDropDown = (name, item) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));

    try {
      console.log("API Data => ", formData);
      const res = await createProperty({
        ...formData,
        custom_attachment_table: imageData,
      });
      console.log("res,res", res);
      if (res) {
        navigate("/property");
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
  console.log(imgUrls, "nkl",imageArray)
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Property" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Property > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Property.map(({ label, name, type, values }) =>
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
                          <div className="flex mb-1.5 ml-1 font-medium text-gray-700">
                            <label htmlFor="custom-dropdown">
                              {label}
                            </label>
                            <label><span style={{ color: "red" }}>*</span></label>
                          </div>
                          <Select
                            required
                            onValueChange={(item) => handleDropDown(name, item)}
                            value={name === "custom_country" ? formData?.custom_country : undefined}
                          >
                            <SelectTrigger className=" p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none">
                              <div className="flex items-center">
                                <SelectValue placeholder={label} />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {(name === "custom_country" ? countryList : values)?.map((item, i) => (
                                <SelectItem key={i} value={name === "custom_country" ? item.name : item}>
                                  {name === "custom_country" ? item.name : item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <></>
                      )
                    )}
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
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save" disabled={loading}/>
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

export default AddProperty;
