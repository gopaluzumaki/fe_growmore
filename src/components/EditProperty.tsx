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
    propertyName: "",
    location: "",
    unitCount: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    status: "",
    rentPrice: "",
    doc: "",
    leadName: "",
    contact: "",
    residence: "",
    nationality: "",
    type: "",
    email: "",
    passportNum: "",
    emiratesId: "",
    leaseInDate: "",
    leaseOutDate: "",
    ownerName: "",
    ownerContact: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await fetchProperty(id); // Fetch the property data
        if (res) {
          setFormData({
            propertyName: res.data.data.name1,
            location: res.data.data.custom_location,
            unitCount: res.data.data.custom_number_of_units.toString(),
            city: res.data.data.city || "",
            state: res.data.data.state || "",
            postcode: res.data.data.postcode || "",
            country: res.data.data.country || "",
            status: res.data.data.status || "",
            rentPrice: res.data.data.rent.toString(),
            doc: res.data.data.doc || "",
            leadName: res.data.data.leadName || "",
            contact: res.data.data.contact || "",
            residence: res.data.data.residence || "",
            nationality: res.data.data.nationality || "",
            type: res.data.data.type || "",
            email: res.data.data.email || "",
            passportNum: res.data.data.passportNum || "",
            emiratesId: res.data.data.emiratesId || "",
            leaseInDate: res.data.data.leaseInDate || "",
            leaseOutDate: res.data.data.leaseOutDate || "",
            ownerName: res.data.data.ownerName || "",
            ownerContact: res.data.data.ownerContact || "",
          });
          setImgUrl(res.data.data.custom_thumbnail_image || "");
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [id]);

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
      name1: formData.propertyName,
      custom_location: formData.location,
      custom_thumbnail_image: imgUrl,
      custom_number_of_units: formData.unitCount,
      rent: formData.rentPrice,
      is_group: 1,
      cost_center: "Main - SRE",
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
            <Header />
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Property.map(({ label, name, type }) => (
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
                      value={formData.doc} // Binding to doc field
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
