// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import { Add_BookReserve } from "../constants/inputdata";
import Input from "./TextInput";
import { useNavigate } from "react-router-dom";
import {
  createBooking,
  uploadFile,
  getOwnerList,
  getLeadList,
  getPropertyList,
  getTenantList,
  fetchProperty,
  fetchTenant,
  fetchOwner,
} from "../api";
import CustomDatePicker from "./CustomDatePicker";
import { FileInput, Select as MantineSelect } from "@mantine/core";
import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormData {
  selectALead: string;
  propertyName: string;
  location: string;
  unitCount: string;
  city: string;
  country: string;
  status: string;
  bookingDate: string;
  tenantName: string;
  contact: string;
  nationality: string;
  type: string;
  email: string;
  startDate: string;
  endDate: string;
  chequesCount: string;
  payAmount: string;
  bookingAmount: string;
  ownerName: string;
  ownerContact: string;
  description: string;
}

const AddBookReserve = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [leadList, setLeadList] = useState<any[]>([]);
  const [properyList, setPropertyList] = useState();
  const [tenantList, setTenantList] = useState<any[]>([]);

  const [formData, setFormData] = useState<FormData>({
    selectALead: "",
    propertyName: "",
    location: "",
    unitCount: "",
    city: "",
    country: "",
    status: "",
    bookingDate: "",
    tenantName: "",
    contact: "",
    nationality: "",
    type: "",
    email: "",
    startDate: "",
    endDate: "",
    chequesCount: "",
    payAmount: "",
    bookingAmount: "",
    ownerName: "",
    ownerContact: "",
    description: "",
  });

  useEffect(() => {
    getLeadData();
    getOwnerData();
    getProperties();
    getTenants();
  }, []);

  const getProperties = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data;
    setPropertyList(item);
  };

  const getTenants = async () => {
    const res = await getTenantList();
    const item = res?.data?.data;
    setTenantList(item);
  };

  const getLeadData = async () => {
    const res = await getLeadData();
    const item = res?.data?.data;
    setLeadList(item);
  };

  const getOwnerData = async () => {
    const res = await getOwnerList();
    const item = res?.data?.data;
    setOwnerList(item);
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

  const handleFileChanges = async (files) => {
    console.log("files", files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchAndSetFormData = async (name: string, value: string) => {
    const fetchConfig: Record<
      string,
      {
        fetchFunction: (value: string) => Promise<any>;
        extractData: (data: any) => Record<string, any>;
      }
    > = {
      name1: {
        fetchFunction: () => fetchProperty("iohr6g0uud"),
        extractData: (data) => ({
          location: data?.custom_location,
          unitCount: data?.custom_number_of_units,
          city: data?.custom_city,
          country: data?.custom_country,
          status: data?.custom_status,
        }),
      },
      tenantName: {
        fetchFunction: fetchTenant,
        extractData: (data) => ({
          tenantName: data?.customer_name,
          contact: data?.custom_contact_number_of_customer,
          nationality: data?.custom_nationality,
          type: data?.customer_type,
          email: data?.custom_email,
        }),
      },
      ownerName: {
        fetchFunction: fetchOwner,
        extractData: (data) => ({
          ownerName: data?.supplier_name,
          ownerContact: data?.custom_phone_number,
        }),
      },
    };

    if (fetchConfig[name]) {
      const { fetchFunction, extractData } = fetchConfig[name];
      try {
        const response = await fetchFunction(value);
        const data = response?.data?.data;
        const extractedData = extractData(data);

        setFormData((prevData) => ({
          ...prevData,
          ...extractedData,
          selectALead: "",
          propertyName: "",
          bookingDate: "",
          startDate: "",
          endDate: "",
          chequesCount: "",
          payAmount: "",
          bookingAmount: "",
          description: "",
        }));
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
      }
    }
    // Always update the specific field value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange = async (name: string, value: string) => {
    fetchAndSetFormData(name, value);
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  // {
  //   "docstatus": 1,
  //   "property": "105",
  //   "book_against": "Lead",
  //   "customer": "CRM-LEAD-2024-00002",
  //   "annual_rent": 100000
  // }

  const formatDateToYYMMDD = (date: string): string => {
    const dateObj = new Date(date);
    if (!date) return "";
    const year = dateObj.getFullYear().toString().slice(-2);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("API Data => ", formData);

      const res = await createBooking({
        property: formData.propertyName,
        custom_select_a_lead: formData.selectALead,
        custom_location__area: formData.location,
        custom_unit_number: formData.unitCount,
        custom_city: formData.city,
        custom_country: formData.country,
        custom_status: formData.status,
        custom_date_of_booking: formatDateToYYMMDD(formData.bookingDate),
        custom_name_of_customer: formData.tenantName,
        custom_contact_number: formData.contact,
        custom_nationality: formData.nationality,
        custom_type: formData.type,
        custom_email: formData.email,
        custom_booking_start_date: formatDateToYYMMDD(formData.startDate),
        custom_booking_end_date: formatDateToYYMMDD(formData.endDate),
        custom_cheques_count: formData.chequesCount,
        custom_rent_amount_to_pay: formData.payAmount,
        custom_booking_amount: formData.bookingAmount,
        custom_contact_number_of_owner: formData.ownerContact,
        custom_name_of_owner: formData.ownerName,
        custom_image_attachment: imgUrl,
        custom_description: formData.description,
      });
      console.log(res);
      if (res) {
        navigate("/booking");
      }
    } catch (err) {
      console.error("Error while creating booking:", err);
    }
  };

  const getData = (label) => {
    console.log("label123", label);
    if (label === "selectALead") {
      return leadList.map((item) => ({
        value: item?.supplier_name,
        label: item?.supplier_name,
      }));
    } else if (label === "ownerName") {
      return ownerList.map((item) => ({
        value: item?.supplier_name,
        label: item?.supplier_name,
      }));
    } else if (label === "name1") {
      return properyList?.map((item) => ({
        value: item?.name,
        label: item?.property,
      }));
    } else if (label === "tenantName") {
      return tenantList?.map((item) => ({
        value: item?.name,
      }));
    }
  };

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Booking / Reservation" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Booking / Reservation > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_BookReserve.map(({ label, name, type, values }) =>
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
                      ) : type === "matineSelect" ? (
                        <MantineSelect
                          label={label}
                          placeholder={label}
                          data={getData(name)}
                          // value={formData.selectALead}
                          value={
                            name === "selectALead"
                              ? formData?.selectALead
                              : name === "name1"
                              ? formData?.name1
                              : name === "ownerName"
                              ? formData?.ownerName
                              : name === "unitCount"
                              ? formData?.unitCount
                              : name === "tenantName"
                              ? formData?.tenantName
                              : null
                          }
                          onChange={(value) =>
                            handleDropdownChange(name, value)
                          }
                          styles={{
                            label: {
                              marginBottom: "7px",
                              color: "black",
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
                        />
                      ) : (
                        <></>
                      )
                    )}
                    {/* <MantineSelect
                      label="Name of Owner"
                      placeholder="Select Property"
                      data={ownerList.map((item) => ({
                        value: item?.supplier_name,
                        label: item?.supplier_name,
                      }))}
                      value={formData.ownerName}
                      onChange={(value) =>
                        handleDropdownChange("ownerName", value)
                      }
                      styles={{
                        label: {
                          marginBottom: "7px",
                          color: "black",
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

                    {/* <MantineSelect
                      label="Contact Number of Owner"
                      placeholder="Select Property"
                      data={ownerList.map((item) => ({
                        value: item?.supplier_name,
                        label: item?.supplier_name,
                      }))}
                      value={formData.propertyName}
                      onChange={(value) =>
                        handleDropDown("propertyName", value)
                      }
                      styles={{
                        label: {
                          marginBottom: "7px",
                          color: "black",
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

                    <div>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        <label>Image Attachment</label>
                      </p>
                      <FileInput
                        onChange={handleFileChanges}
                        accept="image/*"
                        placeholder="Upload files"
                        multiple
                      />
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
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div type="button" className="mt-4 max-w-[100px]">
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

export default AddBookReserve;
