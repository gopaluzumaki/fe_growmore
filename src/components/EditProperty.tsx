import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import { Add_Property } from "../constants/inputdata";
import Input from "./TextInput";
import {
  createProperty,
  fetchProperty,
  updateProperty,
  uploadFile,
} from "../api";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormData {
  propertyName: string;
  location: string;
  unitCount: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  status: string;
  rentPrice: string;
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
  const [imgUrl, setImgUrl] = useState("");
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
    status: "",
    amenities: "",
    rentPrice: "",
    description: "",
    is_group: 1,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await fetchProperty(id); // Fetch the property data
        console.log("res123", res.data.data.description);
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
            status: res.data.data.status || "",
            amenities: res.data.data.amenities || "",
            rentPrice: res.data.data.rentPrice || "",
            description: res.data.data.description || "",
            is_group: 1,
          });
          setImgUrl(res.data.data.custom_thumbnail_image || "");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      custom_thumbnail_image: imgUrl,
    };
    console.log("API Data => ", apiData);
    const res = await updateProperty(apiData, id as string);
    if (res) {
      navigate("/property");
    }
  };

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
                        <Select
                          value={formData[name as keyof FormData]}
                          onValueChange={(item) => handleDropDown(name, item)}
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
                      value={formData.description} // Binding to doc field
                      onChange={handleChange}
                      name="doc" // Set name to match state
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

export default EditProperty;
