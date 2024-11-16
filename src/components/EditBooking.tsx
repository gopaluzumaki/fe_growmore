// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import { Add_BookReserve } from "../constants/inputdata";
import Input from "./TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, uploadFile, getOwnerList, fetchBooking } from "../api";
import CustomDatePicker from "./CustomDatePicker";
import { Select as MantineSelect } from "@mantine/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
}

const EditBooking = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const location = useLocation();

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
    getOwnerData();
  }, []);

  const getOwnerData = async () => {
    const res = await getOwnerList();
    const item = res?.data?.data;
    console.log(item);
    setOwnerList(item);
  };

  useEffect(() => {
    const fetchingBookedData = async () => {
      if (location.state) {
        try {
          const res = await fetchBooking("Booking-0053");
          const item = res?.data?.data;
          console.log("booking item", item);
          if (item) {
            setFormData({
              propertyName: item?.property || "",
              selectALead: item?.custom_select_a_lead || "",
              location: item?.custom_location__area || "",
              unitCount: item?.custom_unit_number || "",
              city: item?.custom_city || "",
              country: item?.custom_country || "",
              status: item?.custom_status || "",
              bookingDate:
                formatDateToYYMMDD(item?.custom_date_of_booking) || "",
              tenantName: item?.custom_name_of_customer || "",
              contact: item?.custom_contact_number || "",
              nationality: item?.custom_nationality || "",
              type: item?.custom_type || "",
              email: item?.custom_email || "",
              startDate:
                formatDateToYYMMDD(item?.custom_booking_start_date) || "",
              endDate: formatDateToYYMMDD(item?.custom_booking_end_date) || "",
              chequesCount: item?.custom_cheques_count || "",
              payAmount: item?.custom_rent_amount_to_pay || "",
              bookingAmount: item?.custom_booking_amount || "",
              ownerContact: item?.custom_contact_number_of_owner || "",
              ownerName: item?.custom_name_of_owner || "",
              description: item?.custom_description || "",
            });
            setImgUrl(item?.custom_image_attachment || "");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchingBookedData();
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log("selected file", file);

      if (file) {
        const res = await uploadFile(file);
        setImgUrl(res?.data?.message?.file_url);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const formatDateToYYMMDD = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
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

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Booking / Reservation" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Booking / Reservation > Edit your booking"}
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
                      ) : (
                        <></>
                      )
                    )}
                    <MantineSelect
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
                    />

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
                      name="description"
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div type="button" className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save Update" />
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

export default EditBooking;
