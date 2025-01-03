// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "./TextInput";
import { Add_Units } from "../constants/inputdata";
import { useNavigate } from "react-router-dom";
import {
  createProperty,
  fetchProperty,
  getCountryList,
  getOwnerList,
  getOwnerListData,
  getPropertyList,
  uploadFile,
} from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Select as MantineSelect, Table } from "@mantine/core";
import CustomFileUpload from "./ui/CustomFileUpload";

interface FormData {
  location: string;
  city: string;
  state: string;
  country: string;
  status: string;
  rent: string;
  sellingPrice: string;
  sqFoot: string;
  sqMeter: string;
  priceSqMeter: string;
  priceSqFt: string;
  custom_unit_number: string;
  rooms: string;
  floors: string;
  bathrooms: string;
  balcony: string;
  view: string;
  premises: string;
  ownerName: string;
  tenantName: string;
  description: string;
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
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState<string[]>([]);

  const navigate = useNavigate();
  const [sqmValue, setSqmValue] = useState();
  const [priceSqFt, setPriceSqFt] = useState();
  const [priceSqMeter, setPriceSqMeter] = useState();
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [countryList,setCountryList]=useState([])

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
useEffect(()=>{
  getCountryListData()
  
},[])
const getCountryListData=async()=>{
const res=await getCountryList()

setCountryList(res?.data?.data)
}
  const [formData, setFormData] = useState<FormData>({
    parent_property: "",
    type: "",
    location: "",
    unitNumber: "",
    city: "",
    state: "",
    country: "",
    status: "",
    rent: "",
    sellingPrice: "",
    sqFoot: "0",
    sqMeter: "0",
    priceSqMeter: "0",
    priceSqFt: "0",
    custom_unit_number: "",
    rooms: "",
    floors: "",
    bathrooms: "",
    balcony: "",
    view: "",
    premises:"",
    ownerName: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("dsadas", name, value);
    if (name === "sqFoot" && value) {
      console.log("dasewa",value);
      let sqMeter = value * 0.092903;
      handleDropDown("sqMeter", Number(value * 0.092903).toFixed(2));
      handleDropDown("priceSqFt", value<=0?0:Number(formData["rent"] / value).toFixed(2));
      handleDropDown(
        "priceSqMeter",
        value<=0?0: Number(formData["rent"] / sqMeter).toFixed(2)
      );

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    }
    else if (name === "sqMeter" && value) {
      console.log("dasewa",typeof value);
      let sqFoot = value * 10.7639;
      handleDropDown("sqFoot", Number(value * 10.7639).toFixed(2));
      handleDropDown("priceSqMeter", value<=0?0:Number(formData["rent"] / value).toFixed(2));
      handleDropDown(
        "priceSqFt",
        value<=0?0:Number(formData["rent"] / sqFoot).toFixed(2)
      );

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    }
    else if (name === "rent" && value) {
      console.log("dasewa",typeof value);
      handleDropDown("priceSqMeter", value<=0?0:formData["sqMeter"]<=0?0:Number(value / formData["sqMeter"]).toFixed(2));
      handleDropDown(
        "priceSqFt",
        value<=0?0:formData["sqFoot"]<=0?0:Number(value / formData["sqFoot"]).toFixed(2)
      );

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    }
    else if (!value) {
      console.log("iadjskn");

      handleDropDown("sqMeter", 0);
      handleDropDown("priceSqFt", 0);
      handleDropDown("priceSqMeter", 0);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getOwnerData = async () => {
    const res = await getOwnerListData();
    const item = res?.data?.data;
    console.log(item,"nkl");
    setOwnerList(item);
  };

  useEffect(() => {
    getProperties();
    getOwnerData();
  }, []);

  const getProperties = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data;
    console.log(item);
    setPropertyList(item);
  };

  const handleDropDown = async (name, item) => {
    if (name === "parent_property") {
      console.log("item", item);
      const propertyList = await getPropertyList();
      let propertyName;
      propertyList?.data?.data.forEach((prop) => {
        console.log("prop132", prop);
        if (prop.property === item) {
          propertyName = prop.name;
        }
      });

      const res = await fetchProperty(propertyName);
      const propertyData = res?.data?.data;

      console.log("property data", propertyData);

      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormData((prevData) => ({
          ...prevData,
          // propertyName: propertyData?.name,
          parent_property: propertyData?.name1,
          type: propertyData?.type,
          location: propertyData?.custom_location,
          city: propertyData?.custom_city,
          state: propertyData?.custom_state,
          country: propertyData?.custom_country,
          custom_status: propertyData?.custom_status,
          // propertyRent: propertyData?.rent,
          // propertyUnits: propertyData?.custom_number_of_units,
          // propertyStatus: propertyData?.status,
          // propertyDoc: propertyData?.custom_thumbnail_image,
        }));
      }
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("formdata", formData);

    const propertyList = await getPropertyList();
    let propertyName;
    propertyList?.data?.data.forEach((prop) => {
      if (prop.property === formData.parent_property) {
        propertyName = prop.name;
      }
    });

    console.log("formData?.unitNumber", formData?.unitNumber);

    try {
      console.log("API Data => ", {
        name1: formData?.custom_unit_number,
        custom_parent_property_name: formData.parent_property,
        parent_property: propertyName,
        type: formData?.type,
        custom_location: formData?.location,
        custom_city: formData?.city,
        custom_state: formData?.state,
        custom_country: formData?.country,
        custom_status: formData?.custom_status,
        rent: formData.rent,
        custom_selling_price: formData?.sellingPrice,
        custom_square_ft_of_unit: formData?.sqFoot,
        custom_square_m_of_unit: formData?.sqMeter,
        custom_price_square_m: formData?.priceSqMeter,
        custom_price_square_ft: formData?.priceSqFt,
        custom_unit_number: formData?.custom_unit_number,
        custom_no_of_rooms: formData.rooms,
        custom_no_of_floors: formData.floors,
        common_bathroom: formData?.bathrooms,
        custom_balcony_available: formData?.balcony,
        custom_view: formData?.view,
        custom_premise_no:formData?.premises,
        unit_owner: formData?.ownerName,
        custom_thumbnail_image: imgUrls,
        is_group: 0,
        cost_center: "Main - SRE",
        description: formData?.description,
      });
      const imageData = imageArray?.map((imgUrl) => ({ image: imgUrl }));

      const res = await createProperty({
        name1: formData?.custom_unit_number,
        custom_parent_property_name: formData.parent_property,
        parent_property: propertyName,
        type: formData?.type,
        custom_location: formData?.location,
        custom_city: formData?.city,
        custom_state: formData?.state,
        custom_country: formData?.country,
        custom_status: formData?.custom_status,
        rent: formData.rent,
        custom_selling_price: formData?.sellingPrice,
        custom_square_ft_of_unit: formData?.sqFoot,
        custom_square_m_of_unit: formData?.sqMeter,
        custom_price_square_m: formData?.priceSqMeter,
        custom_price_square_ft: formData?.priceSqFt,
        custom_unit_number: formData?.custom_unit_number,
        custom_no_of_rooms: formData.rooms,
        custom_no_of_floors: formData.floors,
        common_bathroom: formData?.bathrooms,
        custom_balcony_available: formData?.balcony,
        custom_view: formData?.view,
        custom_premise_no: formData?.premises,
        unit_owner: formData?.ownerName,
        custom_thumbnail_image: '',
        custom_attachment_table_unit: imageData,
        is_group: 0,
        cost_center: "Main - SRE",
        description: formData?.description,
      });
      if (res) {
        navigate("/units");
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
            <Header name="Units" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Unit > Add New"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(px,1fr))] gap-4">
                      <MantineSelect
                      required
                        label="Property Name"
                        placeholder="Select Property"
                        data={propertyList.map((item) => ({
                          value: item?.property,
                          label: item?.property,
                        }))}
                        value={formData.propertyName}
                        onChange={(value) =>
                          handleDropDown("parent_property", value)
                        }
                        styles={{
                          label: {
                            marginBottom: "4px",
                            color: "#374151",
                            fontSize: "16px",
                          },
                          input: {
                            border: "1px solid #CCDAFF",
                            borderRadius: "8px",
                            padding: "24px",
                            fontSize: "16px",
                            color: "#374151",
                          },
                          dropdown: {
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                          },
                        }}
                        searchable
                      />
                    </div>
                    {Add_Units.map(({ label, name, type, values,readonly }) =>
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
                          readOnly={readonly}
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
                        disabled={readonly}
                        required
                          value={formData[name as keyof FormData]}
                          onValueChange={(item) => handleDropDown(name, item)}
                        >
                          <SelectTrigger className=" p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none">
                            <div className="flex items-center">
                              <SelectValue placeholder={label} />
                            </div>
                          </SelectTrigger>
                          <SelectContent onChange={() => console.log("hello")}>
                            {(name==="country"?countryList:values)?.map((item, i) => (
                              <SelectItem key={i} value={name==="country"?item.name:item}>
                                {name==="country"?item.name:item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </div>
                      ) : (
                        <></>
                      )
                    )}
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                      <MantineSelect
                      required
                        label="Owner Name"
                        placeholder="Select Property"
                        data={ownerList.map((item) => ({
                          value: item?.name,
                          label: item?.supplier_name,
                        }))}
                        value={formData.ownerName}
                        onChange={(value) => handleDropDown("ownerName", value)}
                        styles={{
                          label: {
                            marginBottom: "3px",
                            color: "#374151",
                            fontSize: "16px",
                          },
                          input: {
                            border: "1px solid #CCDAFF",
                            borderRadius: "8px",
                            padding: "24px",
                            fontSize: "16px",
                            color: "#374151",
                          },
                          dropdown: {
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                          },
                        }}
                        searchable
                      />
                    </div>
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
