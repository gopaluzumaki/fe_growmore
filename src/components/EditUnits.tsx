// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "./TextInput";
import { Add_Units } from "../constants/inputdata";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createProperty,
  fetchProperty,
  fetchUnit,
  fetchUnitDatas,
  getCountryList,
  getPropertyList,
  updateProperty,
  uploadFile,
  getOwnerListData
} from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Select as MantineSelect, Table } from "@mantine/core";
import CustomFileUpload from "./ui/CustomFileUpload";

interface FormData {
  location: string;
  city: string;
  state: string;
  country: string;
  status: string;
  rentPrice: string;
  sellingPrice: string;
  sqFoot: string;
  sqMeter: string;
  priceSqMeter: string;
  priceSqFt: string;
  unitNumber: string;
  rooms: string;
  floors: string;
  bathrooms: string;
  balcony: string;
  view: string;
  premises: string;
  ownerName: string;
  tenantName: string;
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

const EditUnits = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState([])
  const navigate = useNavigate();
  const [sqmValue, setSqmValue] = useState();
  const [priceSqFt, setPriceSqFt] = useState();
  const [priceSqMeter, setPriceSqMeter] = useState();
  const location = useLocation();
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [countryList, setCountryList] = useState([])
  const { id } = useParams();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCountryListData()
    getOwnerData();
  }, [])


  const getOwnerData = async () => {
    const res = await getOwnerListData();
    const item = res?.data?.data;
    console.log(item, "nkl");
    setOwnerList(item);
  };

  const getCountryListData = async () => {
    const res = await getCountryList()
    setCountryList(res?.data?.data)
  }

  useEffect(() => {
    console.log("location.state.item", id);
    const fetchUnitData = async () => {
      try {
        const res = await fetchUnitDatas(id); // Fetch the property data
        console.log("dasdas", res);
        if (res) {
          setFormData({
            type: res.data.data.type || "",
            parent_property: res.data.data.custom_parent_property_name || "",
            location: res.data.data.custom_location || "",
            city: res.data.data.custom_city || "",
            state: res.data.data.custom_city || "",
            country: res.data.data.custom_country || "",
            custom_status: res.data.data.custom_status || "",
            rent: res.data.data.rent || "",
            sellingPrice: res.data.data.custom_selling_price || "",
            sqFoot: res.data.data.custom_square_ft_of_unit || "",
            sqMeter: res.data.data.custom_square_m_of_unit || "",
            priceSqMeter: res.data.data.custom_price_square_m || "",
            priceSqFt: res.data.data.custom_price_square_ft || "",
            custom_unit_number: res.data.data.custom_unit_number || "",
            rooms: res.data.data.custom_no_of_rooms || "",
            floors: res.data.data.custom_no_of_floors || "",
            bathrooms: res.data.data.common_bathroom || "",
            balcony: res.data.data.custom_balcony_available || "",
            view: res.data.data.custom_view,
            premises: res.data.data.custom_premise_no || "",
            ownerName: res.data.data.unit_owner || "",
            description: res.data.data.description || "",
            cost_center: "Main - SRE",
            is_group: 0,
          });
          // setImgUrls(res.data.data.custom_thumbnail_image || "");
        }
        if (res?.data?.data?.custom_attachment_table_unit?.length > 0) {
          const imageArray = res?.data?.data?.custom_attachment_table_unit?.map((item) => ({ url: item.image }));
          setImageArray(imageArray)
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchUnitData();
  }, [id]);

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
    location: "",
    city: "",
    state: "",
    country: "",
    status: "",
    rentPrice: "",
    sellingPrice: "",
    sqFoot: "",
    sqMeter: "",
    priceSqMeter: "",
    priceSqFt: "",
    custom_unit_number: "",
    rooms: "",
    floors: "",
    bathrooms: "",
    balcony: "",
    view: "",
    premises: "",
    ownerName: "",
    tenantName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("dsadas", formData);
    if (name === "sqFoot" && value) {
      let sqMeter = value * 0.092903;
      console.log(formData["rent"])
      handleDropDown("sqMeter", Number(value * 0.092903).toFixed(2));
      handleDropDown("priceSqFt", value <= 0 ? 0 : Number(formData["rent"] / value).toFixed(2));
      handleDropDown("priceSqMeter", value <= 0 ? 0 : Number(formData["rent"] / sqMeter).toFixed(2));

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    } else if (name === "sqMeter" && value) {
      console.log("dasewa");
      let sqFoot = value * 10.7639;
      handleDropDown("sqFoot", Number(value * 10.7639).toFixed(2));
      handleDropDown("priceSqMeter", value <= 0 ? 0 : Number(formData["rent"] / value).toFixed(2));
      handleDropDown(
        "priceSqFt",
        value <= 0 ? 0 : Number(formData["rent"] / sqFoot).toFixed(2)
      );

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    }
    else if (name === "rent" && value) {
      console.log("dasewa", typeof value);
      handleDropDown("priceSqMeter", value <= 0 ? 0 : formData["sqMeter"] <= 0 ? 0 : Number(value / formData["sqMeter"]).toFixed(2));
      handleDropDown(
        "priceSqFt",
        value <= 0 ? 0 : formData["sqFoot"] <= 0 ? 0 : Number(value / formData["sqFoot"]).toFixed(2)
      );

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    }

    else if (name === "rent" || name === "sqFoot" || name === "sqMeter" && !value) {
      console.log("iadjskn");
      handleDropDown("sqFoot", 0);
      handleDropDown("sqMeter", 0);
      handleDropDown("priceSqFt", 0);
      handleDropDown("priceSqMeter", 0);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data;
    console.log(item, "njk");
    setPropertyList(item);
  };

  const handleDropDown = async (name, item) => {
    // if (name === "parent_property") {
    //   console.log('item',item)
    //   const propertyList = await getPropertyList();
    //   let propertyName;
    //   propertyList?.data?.data.forEach((prop) => {
    //     console.log('prop132',prop)
    //     if (prop.property === item) {
    //       propertyName = prop.name;
    //     }
    //   });

    //   const res = await fetchProperty(propertyName);
    //   const propertyData = res?.data?.data;

    //   console.log("property data", propertyData);

    //   if (propertyData) {
    //     // Fill all the fields with the fetched data
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       // propertyName: propertyData?.name,
    //       parent_property:propertyData?.name1,
    //       type: propertyData?.type,
    //       location: propertyData?.custom_location,
    //       city: propertyData?.custom_city,
    //       state: propertyData?.custom_state,
    //       country: propertyData?.custom_country,
    //       custom_status: propertyData?.custom_status,
    //       // propertyRent: propertyData?.rent,
    //       // propertyUnits: propertyData?.custom_number_of_units,
    //       // propertyStatus: propertyData?.status,
    //       // propertyDoc: propertyData?.custom_thumbnail_image,
    //     }));
    //   }
    //   return;
    // }
    setFormData((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));

    try {
      console.log("API Data => ", formData);
      delete formData.parent_property;
      const res = await updateProperty(
        {
          ...formData,
          name1: formData?.unitNumber,
          custom_premise_no: formData?.premises,
          custom_attachment_table_unit: imageData,
          rent: formData?.rent,
          custom_selling_price: formData?.sellingPrice,
          custom_square_ft_of_unit: formData?.sqFoot,
          custom_square_m_of_unit: formData?.sqMeter,
          custom_price_square_m: formData?.priceSqMeter,
          custom_price_square_ft: formData?.priceSqFt,
          custom_no_of_rooms: formData?.rooms,
          custom_no_of_floors: formData?.floors,
          common_bathroom: formData?.bathrooms,
          custom_balcony_available: formData?.balcony,
          custom_view: formData?.view,
          unit_owner: formData?.ownerName,
          custom_city: formData?.city,
          custom_location: formData?.location,
        },
        id as string
      );
      if (res) {
        navigate("/units");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };
  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls])
  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Units" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">{"Unit > Edit Unit"}</p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(px,1fr))] gap-4">
                      {/* <MantineSelect
                        label="Property Name"
                        placeholder="Select Property"
                        data={propertyList.map((item) => ({
                          value: item?.property,
                          label: item?.property,
                        }))}
                        value={formData.parent_property}
                        // onChange={(value) =>
                        //   handleDropDown("parent_property", value)
                        // }
                        styles={{
                          label: {
                            marginBottom: "7px",
                            color: "#7C8DB5",
                            fontSize: "16px",
                          },
                          input: {
                            border: "1px solid #CCDAFF",
                            borderRadius: "8px",
                            padding: "24px",
                            fontSize: "16px",
                            color: "#1A202C",
                          },
                          dropdown: {
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                          },
                        }}
                        searchable
                      /> */}

                      <Input
                        key={"Property Name"}
                        label="Property Name"
                        name={"Property Name"}
                        // type={type}
                        value={formData.parent_property}
                        // onChange={handleChange}
                        borderd
                        disabled
                        bgLight
                      />
                    </div>
                    {Add_Units.map(({ label, name, type, values, readonly }) =>
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
                          readOnly={readonly}

                        />
                      ) : type === "dropdown" ? (
                        <div>
                          <label htmlFor="custom-dropdown" className="mb-1.5 ml-1 font-medium text-gray-700">
                            {label}
                          </label>
                          <Select
                            disabled={readonly}
                            value={formData[name as keyof FormData]}
                            onValueChange={(item) => handleDropDown(name, item)}
                          >
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
                              <div className="flex items-center">
                                <SelectValue placeholder={label} />
                              </div>
                            </SelectTrigger>
                            <SelectContent onChange={() => console.log("hello")}>
                              {(name === "country" ? countryList : values)?.map((item, i) => (
                                <SelectItem key={i} value={name === "country" ? item.name : item}>
                                  {name === "country" ? item.name : item}
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
                        readOnly
                        data={ownerList.map((item) => ({
                          value: item?.name,
                          label: item?.supplier_name,

                        }))}
                        value={formData.ownerName}
                        onChange={(value) => {
                          const selectedOption = ownerList.find((item) => item.name === value);
                          handleDropDown("ownerName", value, selectedOption?.supplier_name);
                        }}
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
                        setLoading={setLoading}
                      />
                    </div>
                  </div>
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
                    </div></>)}
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

export default EditUnits;
