// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import { Add_Property } from "../constants/inputdata";
import Input from "./TextInput";
import {
  createProperty,
  fetchProperty,
  fetchProperyForEdit,
  getCountryList,
  getPropertyList,
  updateProperty,
  uploadFile,
} from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  location: string;
  unitCount: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  custom_status: string;
  rent: string;
  doc: string;
  leadName: string;
  contact: string;
  residence: string;
  nationality: string;
  type: string;
  email: string;
  passportNum: string;
  emiratesId: string;
  leaseInDate: string;
  leaseOutDate: string;
  ownerName: string;
  ownerContact: string;
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

const EditProperty = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState([])
  const [countryList, setCountryList] = useState([])
  const [loading, setLoading] = useState(false)
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
    custom_country: "",
    custom_status: "",
    amenities: "",
    rent: "",
    description: "",
    is_group: 1,
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  console.log(id, "bjk", location.state)

  useEffect(() => {
    getCountryListData()
  }, [])
  const getCountryListData = async () => {
    const res = await getCountryList()

    setCountryList(res?.data?.data)
  }
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const propertyList = await getPropertyList();
        let propertyName;
        propertyList?.data?.data.forEach((prop) => {
          if (prop.property === id) {
            propertyName = prop.name;
          }
        });
        const res = await fetchProperty(id); // Fetch the property data
        if (res) {
          setFormData({
            type: res.data.data.type || "",
            name: res.data.data.name || "",
            name1: res.data.data.name1 || "",
            cost_center: "Main - SRE",
            custom_location: res.data.data.custom_location || "",
            custom_number_of_units: res.data.data.custom_number_of_units || "",
            custom_community_name: res.data.data.custom_community_name || "",
            custom_area: res.data.data.custom_area || "",
            custom_city: res.data.data.custom_city || "",
            custom_country: res.data.data.custom_country || "",
            custom_status: res.data.data.custom_status || "",
            amenities: res.data.data.amenities || "",
            rent: res.data.data.rent || "",
            description: res.data.data.description || "",
            custom_amenities: res.data.data.custom_amenities || "",
            is_group: 1,
          });
        }
        if (res?.data?.data?.custom_attachment_table?.length > 0) {
          const imageArray = res?.data?.data?.custom_attachment_table?.map((item) => ({ url: item.image }));
          setImageArray(imageArray)
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [id]);

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
  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));
    const apiData = {
      ...formData,
      custom_attachment_table: imageData,
    };
    console.log("API Data => ", apiData);
    const res = await updateProperty(apiData, formData.name);
    if (res) {
      navigate("/property");
    }
  };
  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };
  console.log(imageArray, "bgy")
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Properties" />
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Property.map(({ label, name, type, values }) =>
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
                            value={formData[name as keyof FormData]}
                            onValueChange={(item) => handleDropDown(name, item)}
                          >
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
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
                  <div className="mt-5">
                    <p className="mb-1.5 ml-1 font-medium text-gray-700">
                      <label>Description</label>
                    </p>
                    <textarea
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      value={formData?.description ?? ""} // Binding to doc field
                      onChange={handleChange}
                      name="description" // Set name to match state
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
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save" disabled={loading} />
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

export default EditProperty;
