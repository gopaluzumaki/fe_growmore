// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Add_Tenant,
  Type_Company,
  Type_Individual_Tenant,
} from "../constants/inputdata";
import Input from "./TextInput";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTenant, fetchTenant, getCountryList, updateTenant, uploadFile } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import CustomDatePicker from "./CustomDatePicker";
import { formatDateToYYMMDD } from "../lib/utils";
import CustomFileUpload from "./ui/CustomFileUpload";
interface FormData {
  ownerName: string;
  gender: string;
  city: string;
  country: string;
  nationality: string;
  passportNum: string;
  passportExpiryDate: Date | null;
  countryOfIssuance: string;
  emiratesId: string;
  emiratesIdExpiryDate: string;
  companyName: string;
  tradeLicenseNumner: string;
  emirate: string;
  tradeLicense: Date | null;
  poaHolder: string;
  description: string;
  [key: string]: string | Date | null;
}

const AddTenants = () => {
  const [_, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState([])
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const location = useLocation();
  const [countryList, setCountryList] = useState([])
  const [loading, setLoading] = useState(false)
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    ownerType: "",
    customerContact: "",
    ownerContact: "",
    email: "",
    ownerName: "",
    gender: "",
    city: "",
    country: "",
    nationality: "",
    passportNum: "",
    passportExpiryDate: null,
    propertyCount: "",
    units: "",
    location: "",
    countryOfIssuance: "",
    emiratesId: "",
    emiratesIdExpiryDate: "",
    companyName: "",
    tradeLicenseNumner: "",
    emirate: "",
    tradeLicense: null,
    poaHolder: "",
    description: "",
  });
  useEffect(() => {
    getCountryListData()
  }, [])
  const getCountryListData = async () => {
    const res = await getCountryList()

    setCountryList(res?.data?.data)
  }
  useEffect(() => {
    console.log("from edit tenant", id);
    const fetchingTenantData = async () => {
      if (id) {
        try {
          const res = await fetchTenant(id);
          const item = res?.data?.data;
          console.log("tenant item", item);
          if (item) {
            setFormData((prevData) => {
              return {
                ...prevData,
                // more TODO ---------->
                ownerType: item?.customer_type,
                description: item?.customer_details,
                ownerName: item?.customer_name,
                companyName: item?.customer_name,
                customerContact: item?.custom_contact_number_of_customer,
                email: item?.custom_email,

                // company
                tradeLicenseNumner: item?.custom_trade_license_number,
                emirate: item?.custom_emirate,
                tradeLicense: item?.custom_trade_license_expiry_date,
                poaHolder: item?.custom_power_of_attorney_holder_name,

                // individual
                gender: item?.gender,
                city: item?.custom_city,
                country: item?.custom_country,
                nationality: item?.custom_nationality,
                passportNum: item?.custom_passport_number,
                passportExpiryDate: item?.custom_passport_expiry_date,
                countryOfIssuance: item?.custom_country_of_issuance,
                emiratesId: item?.custom_emirates_id,
                emiratesIdExpiryDate: item?.custom_emirates_id_expiry_date,
                custom_date_of_birth: item?.custom_date_of_birth,
                custom_visa_start_date: item?.custom_visa_start_date,
                custom_visa_end_date: item?.custom_visa_end_date
              };
            });
            setImgUrl(item?.custom_signature_image || "");
          }
          if (item?.custom_attachment_table?.length > 0) {
            const imageArray = item?.custom_attachment_table?.map((item) => ({ url: item.image }));
            setImageArray(imageArray)
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchingTenantData();
  }, [id]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLoading(true)
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file) {
        const res = await uploadFile(file);
        setImgUrl(res?.data?.message?.file_url);
      }
      setLoading(false)
    }
  };
  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls])
  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for mobile number validation (10 to 15 digits)
  const mobileRegex = /^[0-9]{10,15}$/;
  const maxEmailLength = 320;
  const [errors, setErrors] = useState({ customerContact: '', email: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "customerContact") {
      if (!mobileRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          customerContact: 'Mobile number must be 10 to 15 digits.',
        }));
      } else {

        setErrors((prev) => ({ ...prev, customerContact: '' }));
      }
    }
    else if (name === "email") {
      if (!emailRegex.test(value) || value?.length > 320) {
        setErrors((prev) => ({
          ...prev,
          email: 'Please enter a valid email address.',
        }));
      } else {

        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
    // else{
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // }
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleDropdownChange = (name: string, value: string) => {
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
      const res = await updateTenant(id, {
        custom_signature_image: imgUrl,
        custom_attachment_table: imageData,
        customer_type: formData.ownerType,
        customer_details: formData?.description,
        customer_name:
          formData.ownerType === "Individual"
            ? formData?.ownerName
            : formData?.companyName,
        custom_contact_number_of_customer: formData?.customerContact,
        custom_email: formData?.email,

        // company
        custom_trade_license_number: formData?.tradeLicenseNumner,
        custom_emirate: formData?.emirate,
        custom_trade_license_expiry_date: formatDateToYYMMDD(
          formData?.tradeLicense
        ),
        custom_power_of_attorney_holder_name: formData?.poaHolder,

        //individual
        gender: formData.gender,
        custom_city: formData.city,
        custom_country: formData.country,
        custom_nationality: formData.nationality,
        custom_passport_number: formData.passportNum,
        custom_passport_expiry_date: formatDateToYYMMDD(
          formData.passportExpiryDate
        ),
        custom_country_of_issuance: formData.countryOfIssuance,
        custom_emirates_id: formData.emiratesId,
        custom_emirates_id_expiry_date: formatDateToYYMMDD(
          formData.emiratesIdExpiryDate
        ),
        custom_date_of_birth: formatDateToYYMMDD(formData?.custom_date_of_birth),
        custom_visa_start_date: formatDateToYYMMDD(formData?.custom_visa_start_date),
        custom_visa_end_date: formatDateToYYMMDD(formData?.custom_visa_end_date)
      });
      if (res) {
        navigate("/tenants");
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
            <Header name="Customer" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Customer > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                    {Add_Tenant.map(({ label, name, type, values }) =>
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
                          warning={errors[name]}
                        />
                      ) : type === "dropdown" ? (
                        <div>
                          <label htmlFor="custom-dropdown" className="mb-1.5 ml-1 font-medium text-gray-700">
                            {label}
                          </label>
                          <Select
                            onValueChange={(item) => {
                              handleDropdownChange(name, item);
                            }}
                            value={formData[name]}
                          >
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
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
                        </div>
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
                    {formData.ownerType === "Individual" &&
                      Type_Individual_Tenant.map(
                        ({ label, name, type, values }) =>
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
                                onValueChange={(item) => {
                                  handleDropdownChange(name, item);
                                }}
                                value={formData[name]}
                              >
                                <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-1">
                                  <div className="flex items-center">
                                    <SelectValue placeholder={label} />
                                  </div>
                                </SelectTrigger>
                                <SelectContent
                                  onChange={() => console.log("hello")}
                                >
                                  {(name === "country" ? countryList : values)?.map((item, i) => (
                                    <SelectItem key={i} value={name === "country" ? item.name : item}>
                                      {name === "country" ? item.name : item}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
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
                    {formData.ownerType === "Company" &&
                      Type_Company.map(({ label, name, type, values }) =>
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
                            onValueChange={(item) => {
                              handleDropdownChange(name, item);
                            }}
                            value={formData[name]}
                          >
                            <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                              <div className="flex items-center">
                                <SelectValue placeholder={label} />
                              </div>
                            </SelectTrigger>
                            <SelectContent
                              onChange={() => console.log("hello")}
                            >
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
                      <div>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        <label>Upload Customer Signature</label>
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
                    <div>
                      
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
                  </div>
                  {imgUrl?.length > 0 && (<>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        Uploaded Signature
                      </p>
                      <div className="grid grid-cols-5 gap-4 w-25% h-25%">

                          <div key={imgUrl} className="relative w-[100px] h-[100px]">
                            <img
                              className="w-full h-full rounded-md"
                              src={
                                imgUrl
                                  ? `https://propms.erpnext.syscort.com/${imgUrl}`
                                  : "/defaultProperty.jpeg"
                              }
                              alt="propertyImg"
                            />
                            <button
                              type="button" // Prevent form submission
                              className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs"
                              onClick={() => setImgUrl('')}
                            >
                              X
                            </button>
                          </div>
                      </div>
                    </>)}
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
                      name="description"
                      onChange={handleChange}
                      value={formData.description}
                      rows={8}
                      className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                    ></textarea>
                  </div>
                  <div className="mt-4 max-w-[100px]">
                    <PrimaryButton title="Save" disabled={errors?.email?.length > 0 || errors?.customerContact?.length > 0 || loading} />
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

export default AddTenants;
