// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import {
  Add_TenancyContractOwner,
  Add_TenancyContractTenant,
  Add_TenancyContractProperty,
  Add_Contract_Details,
  Owner_Type_Individual,
  Owner_Type_Company,
  Tenant_Type_Individual,
  Tenant_Type_Company,
} from "../constants/inputdata";
import Input from "./TextInput";
import { ChangeEvent, useEffect, useState } from "react";
import {
  fetchProperty,
  getPropertyList,
  getTenantList,
  getOwnerList,
  fetchTenant,
  fetchOwner,
  createTanencyContract,
  uploadFile,
  fetchUnitsfromProperty,
  getTenantLeaseList,
  fetchTenancyContract,
  createCase,
  getMoveInList,
  getMoveInListData,
} from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Checkbox from "./CheckBox";
import CustomDatePicker from "./CustomDatePicker";
import { em, Select as MantineSelect, Table } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { APP_AUTH } from "../constants/config";
import { formatDateToYYMMDD } from "../lib/utils";
import CustomFileUpload from "./ui/CustomFileUpload";
import { it } from "node:test";

const AddMoveIn = () => {
  const statusSelect = [
    {
      label: "Status",
      name: "status",
      type: "dropdown",
      values: ["Active", "Resolve"],
    },
  ]
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const [property, setProperty] = useState();
  const [checked, setChecked] = useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [singlePropertyData, setSinglePropertyData] = useState<any[]>([]);
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [numberOfChecks, setNumberOfChecks] = useState();
  const [tableData, setTableData] = useState<
    {
      rent: string;
      chequeNumber: string;
      chequeDate: string;
      bankName: string;
    }[]
  >([]);
  const [ownerImgUrl, setOwnerImgUrl] = useState("");
  const [propertyImgUrl, setPropertyImgUrl] = useState("");
  const [propertyUnits, setPropertyUnits] = useState([]);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({
    tenancyStatus: "Draft",

    numberOfChecks: "",
    bankName: "",
    chequeNo: "",
    chequeDate: "",
    startDate: null,
    endDate: null,
    anualPriceRent: "",
    securityDepositeAmt: "",
    brokerageAmt: "",
    notice_period: "",

    propertyName: "",
    propertyType: "",
    propertyLocation: "",
    propertyRent: "",
    propertyUnits: "",
    propertyStatus: "",
    propertyDoc: "",

    ownerName: "",
    ownerType: "",
    ownerContact: "",
    ownerEmail: "",
    ownerCountry: "",
    ownerEmiratesId: "",
    ownerMobile: "",
    ownerDoc: "",
    ownerSign: "",
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [showSecurityDepositeAmt, setShowSecurityDepositeAmt] = useState(false);
  const [showBrokarageAmt, setShowBrokarageAmt] = useState(false);
  const [propertyName, setPropertyName] = useState('')
  const [alreadyAdded,setAlreadyAdded] = useState(true)
  const [showError,setShowError] = useState('')
  useEffect(() => {
    getProperties();
    setFormValues((prevData) => ({
      ...prevData,
      "status": "Active",
    }));
  }, []);

  const getProperties = async () => {
    // const res = await getPropertyList();
    const res = await getTenantLeaseList()
    const item = res?.data?.data;
    const mergedData = item.reduce((acc, item) => {
      const existingProperty = acc.find(obj => obj.property === item.property);
      if (existingProperty) {
        item.custom_number_of_unit?.length>0&&existingProperty.custom_number_of_unit.push(item.custom_number_of_unit);
        item.custom_number_of_unit?.length>0&&existingProperty.names.push(item.name);
      } else {
        acc.push({
          property: item.property,
          custom_number_of_unit: item.custom_number_of_unit?.length>0?[item.custom_number_of_unit]:[],
          names: [item.name]
        });
      }
      return acc;
    }, []);
    setPropertyList(mergedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  function getCustomNumberOfUnit(propertyName) {
    const propertyData = propertyList.find(item => item.property === propertyName);
    return propertyData ? propertyData.custom_number_of_unit : null;
  }

  useEffect(() => {
    const data = async () => {
      const res = await fetchTenancyContract(propertyName)
      const propertyData = res?.data?.data;
      const moveInList = await getMoveInListData(formValues?.propertyName,formValues?.propertyUnits);
      if(moveInList?.data?.data?.length>0){
        setAlreadyAdded(true)
        setShowError(`This ${formValues?.propertyName} property with ${formValues?.propertyUnits} unit is under Move in`)
      }
      else{
      if (propertyData) {
        setAlreadyAdded(false)

        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          property: propertyData?.property,
          propertyName: propertyData?.name,
          propertyType: propertyData?.custom_type,
          propertyLocation: propertyData?.custom_location__area,
          propertyCity: propertyData?.custom_city,
          propertyCountry: propertyData?.custom_country,
          propertyRent: propertyData?.rent_amount_to_pay,
          propertyUnits: propertyData?.custom_number_of_unit,
          sqFoot: propertyData?.custom_price__rent_annually / propertyData?.custom_price_sq_ft,
          sqMeter: propertyData?.custom_price__rent_annually / propertyData?.custom_price_sq_m,
          priceSqMeter: propertyData.custom_price_sq_m,
          priceSqFt: propertyData.custom_price_sq_ft,
          // propertyStatus: propertyData?.status,
          propertyDoc: propertyData?.custom_image,
          ownerName: propertyData?.custom_name_of_owner,
          ownerContact: propertyData?.custom_contact_number_of_owner,
          ownerEmail: propertyData?.custom_owner_email,
          ownerType: propertyData?.custom_type_of_owner,

          customerName: propertyData?.lease_customer,
          customerContact: propertyData?.custom_contact_number,
          customerEmail: propertyData?.custom_email,
          customerType: propertyData?.custom_customer_type,
          startDate: propertyData?.start_date,
          endDate: propertyData?.end_date

        }));

      }
    }
    }
    data()
  }, [propertyName])

  function getNameFromCustomNumber(customNumber) {
    // Loop through each property object
    for (const item of propertyList) {
      // Check if custom_number_of_unit contains the value
      const index = item.custom_number_of_unit.indexOf(customNumber);
      if (index !== -1) {
        return item.names[index];  // Return the corresponding name
      }
    }
    return null;  // Return null if custom_number_of_unit is not found
  }
  const handleDropDown = async (name, item) => {
    if (name === "propertyName") {
      setPropertyName('')
      setAlreadyAdded(false)
      setShowError('')
      setFormValues((prevData) => ({
        ...prevData,
        propertyName: '',
        propertyType: '',
        propertyLocation: '',
        propertyCity: '',
        propertyCountry: '',
        propertyRent: '',
        propertyUnits: null,
        sqFoot: '',
        sqMeter: '',
        priceSqMeter: '',
        priceSqFt: '',
        // propertyStatus: propertyData?.status,
        propertyDoc: '',
        ownerName: '',
        ownerContact: '',
        ownerEmail: '',
        ownerType: '',

        customerName: '',
        customerContact: '',
        customerEmail: '',
        customerType: '',
      }));
      const units = getCustomNumberOfUnit(item);
      setPropertyUnits(units || []);
    }
    if (name === "propertyUnits") {
      setAlreadyAdded(false)
      setShowError('')
      const name = getNameFromCustomNumber(item);
      setPropertyName(name)
    }
    setFormValues((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imgUrls.map((imgUrl) => ({ image: imgUrl }));

    try {
      console.log("API Data => ", formValues);
      const res = await createCase({
        // ...formValues,
        custom_status: "Move In",
        custom_unit_no: formValues?.propertyUnits,
        custom_property: formValues?.property,
        custom_customer: formValues?.customerName,
        custom_start_date: formValues?.startDate,
        custom_end_date: formValues?.endDate,
        custom_statusmi: formValues?.status,
        custom_comment_box: formValues?.comment,
        custom_attachment_table: imageData,
        custom_location__area: formValues?.propertyLocation,
        custom_unit_city: formValues?.propertyCity,
        custom_unit_country: formValues?.propertyCountry,
        custom_property_rent: formValues?.propertyRent,
        custom_sqfoot: formValues?.sqFoot,
        custom_sqmeter: formValues?.sqMeter,
        custom_pricesqmeter: formValues?.priceSqMeter,
        custom_pricesqft: formValues?.priceSqFt,
        custom_supplier: formValues?.ownerName,
        custom_contact_number_of_supplier: formValues?.ownerContact,
        custom_email: formValues?.ownerEmail,
        custom_owner_type: formValues?.ownerType,
        custom_contact_number_of_customer: formValues?.customerContact,
        custom_customer_email: formValues?.customerEmail,
        custom_customer_type: formValues?.customerType,
        // custom_supplier:formValues?.

      }); //import from API
      if (res) {
        navigate("/movein");
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
            <Header name="Move IN" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Move In > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  {/* property details */}
                  <div>
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Property
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                      <MantineSelect
                        label="Property Name"
                        placeholder="Select Property"
                        data={propertyList.map((item) => ({
                          value: item?.property,
                          label: item?.property,
                        }))}
                        value={formValues.propertyName}
                        onChange={(value) => {
                          handleDropDown("propertyName", value)
                        }
                        }
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

                      />

                      {Add_TenancyContractProperty.map(
                        ({ label, name, type, values }) =>
                          type === "mantineSelect" ? (
                            <MantineSelect
                              label={label}
                              placeholder={label}
                              data={propertyUnits}
                              value={formValues.propertyUnits}
                              onChange={(value) =>
                                handleDropDown("propertyUnits", value)
                              }
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

                            />
                          ) : (
                            <></>
                          )
                      )}
                    </div>
                  </div>
<div className="flex justify-center mt-2 text-red-700">{showError}</div>
                  {formValues?.propertyName && formValues?.propertyUnits && !alreadyAdded&&(<>
                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Location : {formValues.propertyLocation}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">City : {formValues.propertyCity}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Country : {formValues.propertyCountry}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block"></label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Square ft of unit : {formValues.sqFoot}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Square m of unit : {formValues.sqMeter}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Price/ Square m : {formValues.priceSqMeter}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Price/ Square ft : {formValues.priceSqFt}</label>
                      </div>
                    </div>


                    {/* customer */}
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Customer
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4">

                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Customer Name : {formValues.customerName}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Customer Email : {formValues.customerEmail}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Customer Contact : {formValues.customerContact}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Customer Type : {formValues.customerType}</label>
                      </div>
                    </div>

                    {/* owner */}

                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Owner
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4">

                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Owner Name : {formValues.ownerName}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Owner Email : {formValues.ownerEmail}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Owner Contact : {formValues.ownerContact}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Owner Type : {formValues.ownerType}</label>
                      </div>
                    </div>



                    {/* Comment box */}
                    <div className="mt-5">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Comment
                        </span>
                      </p>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formValues.comment}
                        onChange={
                          handleChange
                        }
                        rows={8}
                        className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      ></textarea>
                    </div>
                    {/* status */}
                    <div className="mt-5 mb-5">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Status
                        </span>

                      </p>
                      {statusSelect.map(({ label, name, type, values }) => (
                        <Select
                          onValueChange={(value) =>
                            handleDropDown(name, value)
                          }
                          value={formValues[name]}
                        >
                          <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-3">
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
                      ))}</div>
                    {/* Attachment */}
                    <div className="mb-5">
                      <CustomFileUpload
                        onFilesUpload={(urls) => {
                          setImgUrls(urls);
                        }}
                        type="image/*"
                      />
                    </div>
                    <div className="max-w-[100px]">
                      <PrimaryButton title="Save" />
                    </div>
                  </>)}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddMoveIn;
