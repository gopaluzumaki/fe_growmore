// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "./TextInput";
import { Add_Units } from "../constants/inputdata";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createProperty,
  fetchProperty,
  fetchUnit,
  getPropertyList,
  updateProperty,
  uploadFile,
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
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [sqmValue, setSqmValue] = useState();
  const [priceSqFt, setPriceSqFt] = useState();
  const [priceSqMeter, setPriceSqMeter] = useState();
  const location = useLocation();
  const [propertyList, setPropertyList] = useState<any[]>([]);
  // useEffect(() => {
  //   console.log('dsads',location.state.item)
  //   // setFormData([...location.state.unitList]);
  // }, []);

  // const { state } = props.location;x

  useEffect(() => {
    console.log("location.state.item", location.state.item);
    const fetchUnitData = async () => {
      try {
        const res = await fetchUnit(location.state.item); // Fetch the property data
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
          setImgUrl(res.data.data.custom_thumbnail_image || "");
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchUnitData();
  }, [location.state.item.property]);

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
      handleDropDown("sqMeter", value * 0.092903);
      handleDropDown("priceSqFt", formData["rentPrice"] / value);
      handleDropDown("priceSqMeter", formData["rentPrice"] / sqMeter);

      // let priceSqFt
      // let priceSqMeter
      // setSqmValue(value* 0.092903)
      setPriceSqFt(priceSqFt);
      setPriceSqMeter(priceSqMeter);
    } else if (!value) {
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
    console.log(item);
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

    try {
      console.log("API Data => ", formData);
      delete formData.parent_property;
      const res = await updateProperty(
        {
          ...formData,
          name1: formData?.unitNumber,
          custom_premise_no: formData?.premises,
        },
        location.state.item.name as string
      );
      if (res) {
        navigate("/units");
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
                    {Add_Units.map(({ label, name, type, values }) =>
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
                          <SelectContent onChange={() => console.log("hello")}>
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

export default EditUnits;
