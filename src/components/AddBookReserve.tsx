import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useState } from "react";
import { Add_BookReserve } from "../constants/inputdata";
import Input from "./TextInput";
import { useNavigate } from "react-router-dom";
import { createBooking, uploadFile } from "../api";
import CustomDatePicker from "./CustomDatePicker";
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
  bookingDate: string;
  doc: string;
  tenantName: string;
  contact: string;
  residence: string;
  nationality: string;
  type: string;
  email: string;
  passportNum: string;
  emiratesId: string;
  endDate: string;
  startDate: string;
  chequesCount: string;
  payAmount: string;
  unitName: string;
  bookingAmount: string;
  ownerName: string;
  ownerContact: string;
}

const AddBookReserve = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    unitCount: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    status: "",
    bookingDate: "",
    doc: "",
    tenantName: "",
    contact: "",
    residence: "",
    nationality: "",
    type: "",
    email: "",
    passportNum: "",
    emiratesId: "",
    endDate: "",
    startDate: "",
    chequesCount: "",
    payAmount: "",
    unitName: "",
    bookingAmount: "",
    ownerName: "",
    ownerContact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // {
  //   "docstatus": 1,
  //   "property": "105",
  //   "book_against": "Lead",
  //   "customer": "CRM-LEAD-2024-00002",
  //   "annual_rent": 100000
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiData = {
      docstatus: 1,
      name: formData.tenantName,
      owner: formData.ownerName,
      property: formData.propertyName,
      book_against: "Lead",
      customer: "CRM-LEAD-2024-00002",
      annual_rent: 100000,
    };
    console.log("API Data => ", apiData);
    const res = await createBooking(apiData);
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
                        <Select>
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
                          selectedDate={selectedDate}
                          onChange={setSelectedDate}
                          label={label}
                          placeholder="Select Date"
                        />
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

export default AddBookReserve;
