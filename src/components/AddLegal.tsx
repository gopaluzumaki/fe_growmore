// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import { toast } from 'react-toastify';
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
  fetchPropertyData,
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
  fetchDamageLocation,
  createDamageLocation,
  fetchDataFromLease,
  fetchUnitsfromPropertyNew,
  fetchLegalReason,
  createLegalReason,
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

const AddLegal = () => {
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
  const [loading, setLoading] = useState(false)

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
    currentPropertyName: "",
    propertyType: "",
    propertyLocation: "",
    propertyRent: "",
    propertyUnits: "",
    propertyStatus: "",
    propertyDoc: "",

    owner: "",
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
  const [unitDetails, setUnitDetails] = useState([])
  const [legalList, setLegalList] = useState([])
  const [showCustomerSection, setShowCustomerSection] = useState(false)
  const [imageArray, setImageArray] = useState<string[]>([]);

  useEffect(() => {
    getProperties();
    getLegalReasonList();
    setFormValues((prevData) => ({
      ...prevData,
      "status": "Active",
    }));
  }, []);


  const getLegalReasonList = async () => {
    const res = await fetchLegalReason();
    const item = res?.data?.data;
    let dropdownData = [...item.map((p) => ({ name: p.name })), { name: 'Add new +', isButton: true }];
    setLegalList(dropdownData);
  };
  const getProperties = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data;
    setPropertyList(item);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function getUnitData(customUnitNumber) {
    return unitDetails.filter(item => item.custom_unit_number === customUnitNumber);
  }

  useEffect(() => {
    setShowCustomerSection(false)
    const getData = async () => {

      setFormValues((prevData) => ({
        ...prevData,
        legalReason: '',
      }));

      const res = getUnitData(formValues?.propertyUnits)[0]
      const result = await fetchDataFromLease(formValues?.propertyName, formValues?.propertyUnits)
      const datas = result?.data?.data[0]
      let customerData = {};

      if (result?.data?.data?.length > 0) {
        setShowCustomerSection(true)
      }

      if (datas?.lease_customer) {
        const customer = await fetchTenant(datas?.lease_customer);
        customerData = customer.data.data
      }

      setFormValues((prevData) => ({
        ...prevData,
        // propertyType: res?.type,
        propertyLocation: res?.custom_location,
        propertyCity: res?.custom_city,
        propertyCountry: res?.custom_country?.country_name,
        propertyRent: res?.rent,
        currentPropertyName: res?.name,

        // propertyUnits: res?.custom_number_of_units,
        propertyStatus: res?.status,
        sqFoot: res?.custom_square_ft_of_unit,
        sqMeter: res?.custom_square_m_of_unit,
        priceSqMeter: res?.custom_price_square_m,
        priceSqFt: res?.custom_price_square_ft,

        owner: res?.unit_owner.name,
        ownerName: res?.unit_owner.supplier_name,
        ownerContact: res?.unit_owner.custom_phone_number,
        ownerEmail: res?.unit_owner.custom_email,
        ownerType: res?.unit_owner.supplier_type,

        customer: customerData?.name,
        customerName: customerData?.customer_name,
        customerContact: customerData?.custom_contact_number_of_customer,
        customerEmail: customerData?.custom_email,
        customerType: customerData?.customer_type,

        startDate: datas?.start_date,
        endDate: datas?.end_date
        // propertyDoc: propertyData?.custom_thumbnail_image,
      }));
    }
    getData()
  }, [formValues?.propertyUnits])


  const handleDropDown = async (name, item) => {
    setShowCustomerSection(false)

    if (name === "propertyName") {
      // Fetch property data based on the selected property
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
        legalReason: ''
      }));

      const res = await fetchProperty(item);
      const propertyData = res?.data?.data;
      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          property: propertyData?.name1,
          propertyName: propertyData?.name,
          propertyType: propertyData?.type,
          propertyLocation: propertyData?.custom_location,
          propertyRent: propertyData?.rent,
          // propertyUnits: propertyData?.custom_number_of_units,
          propertyStatus: propertyData?.status,
          propertyDoc: propertyData?.custom_thumbnail_image,
        }));

        const response = await fetchUnitsfromPropertyNew(propertyData?.name);
        const data = response?.data?.data;
        console.log('data...', data)
        setUnitDetails(data)
        const values = data?.map((item) => item.custom_unit_number);
        setPropertyUnits((prev) => {
          return values;
        });

      }
    }

    setFormValues((prevData) => ({
      ...prevData,
      [name]: item,
    }));

  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValues?.legalReason) {
      return toast.error("Legal Reason required!");
    }
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));

    try {
      console.log("API Data => ", formValues);
      const res = await createCase({
        // ...formValues,
        custom_status: "Legal",
        custom_current_property: formValues?.currentPropertyName,
        custom_unit_no: formValues?.propertyUnits,
        custom_property: formValues?.propertyName,
        custom_customer: formValues?.customer,
        custom_start_date: formValues?.startDate,
        custom_end_date: formValues?.endDate,
        custom_statusmi: '',
        custom_statusmo: '',
        custom_status_legal: formValues?.status,
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
        custom_supplier: formValues?.owner,
        custom_contact_number_of_supplier: formValues?.ownerContact,
        custom_email: formValues?.ownerEmail,
        custom_owner_type: formValues?.ownerType,
        custom_contact_number_of_customer: formValues?.customerContact,
        custom_customer_email: formValues?.customerEmail,
        custom_customer_type: formValues?.customerType,
        custom_legal_reason: formValues?.legalReason,
        // custom_supplier:formValues?.

      }); //import from API
      if (res) {
        navigate("/legal");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectStyle = {
    input: {
      border: "1px solid #ccdaff",
      backgroundColor: "#ffffff",
      color: "#000",
      padding: "20px 12px",
      borderRadius: "5px",
    },
    dropdown: {
      backgroundColor: "#ffffff",
      color: "#000",
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLegal, setNewLegal] = useState("");

  const handleAddNewLegal = async () => {
    if (newLegal.trim()) {
      const updatedLegalList = [...legalList]; // Create a copy of the list
      updatedLegalList.splice(legalList.length - 1, 0, { name: newLegal }); // Insert at second last index
      setLegalList(updatedLegalList); // Update the state
      const createLegalReasons = await createLegalReason({ "custom_name": newLegal });
      setFormValues((prevValues) => ({
        ...prevValues,
        legalReason: newLegal,
      }));
      setNewLegal(""); // Clear input field after adding
      setIsModalOpen(false); // Close modal
    }
  };

  const handleInputChange = (e) => {
    setNewLegal(e.target.value);
  };

  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls])

  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };

  return (
    <main>
      <div className="flex">
        {isModalOpen && (
          <>
            {/* Overlay with blur effect */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                backdropFilter: "blur(5px)", // Blur effect for the background
                zIndex: 9999, // Behind the modal
              }}
              onClick={() => setIsModalOpen(false)} // Close modal if user clicks on the overlay
            />

            {/* Modal */}
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)", // Center the modal
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10000, // Ensure modal is on top
              }}
            >
              <h3>Add New Legal Reason</h3>
              <input
                type="text"
                value={newLegal}
                onChange={handleInputChange}
                placeholder="Enter Legal Reason"
                autoFocus
                style={{
                  marginBottom: "10px",
                  padding: "5px",
                  width: "100%",
                }}
              />
              <div>
                <button
                  onClick={handleAddNewLegal}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#4CAF50", // Green color for the Add button
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336", // Red color for the Cancel button
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Legal" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Legal > Add New"}
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
                        required
                        data={propertyList.map((item) => ({
                          value: item?.name,
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
                              required
                              data={propertyUnits?.length > 0 ? propertyUnits : []}
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

                  {formValues?.propertyName && formValues?.propertyUnits && (<>
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
                  </>)}

                  {/* customer */}
                  {showCustomerSection && (<><p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
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
                    </div></>)}

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

                  {/* Legal Reason */}
                  <div className="mt-5 mb-5">
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Legal Reason <span className="text-red-500" aria-hidden="true"> *</span>
                      </span>

                    </p>
                    <MantineSelect
                      placeholder="Select Legal Reason"
                      data={legalList.map((p) => p.name)}
                      clearable
                      required
                      value={formValues?.legalReason}
                      onChange={(value) => {
                        if (value === "Add new +") {
                          // Handle button click
                          setIsModalOpen(true);
                          // Add your logic here to open a modal or add a new item
                        } else {
                          handleDropDown("legalReason", value);
                        }
                      }}
                      styles={selectStyle}
                    />
                  </div>
                  <div className="mt-5 mb-5">
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Status
                      </span>

                    </p>
                    {statusSelect.map(({ label, name, type, values }) => (
                      <Select
                        required
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
                      setLoading={setLoading}
                    />
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
                    </div>
                  </>)}
                  <div className="max-w-[100px] mt-2">
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

export default AddLegal;
