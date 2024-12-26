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
  fetchMaintenance,
  updateCase,
  fetchDamageLocation,
  createDamageLocation,
} from "../api";
import {
  // Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Checkbox from "./CheckBox";
import CustomDatePicker from "./CustomDatePicker";
import { em, Select as MantineSelect, Table } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_AUTH } from "../constants/config";
import { formatDateToYYMMDD } from "../lib/utils";
import CustomFileUpload from "./ui/CustomFileUpload";
import { Select } from "@mantine/core";

const EditMaintenance = () => {
  const statusSelect = [
    {
      label: "Status",
      name: "status",
      type: "dropdown",
      values: ["Active", "Resolve"],
    },
  ]
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const location = useLocation();
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
  const [imageArray, setImageArray] = useState([])
  const [damageLocationList, setDamageLocationList] = useState([])

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

  useEffect(() => {
    const data = async () => {
      const res = await fetchMaintenance(location.state)
      const propertyData = res?.data?.data;
      console.log(propertyData,"jyu")
      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          property: propertyData?.name,
          propertyName: propertyData?.custom_property,
          // propertyType: propertyData?.custom_type,
          propertyLocation: propertyData?.custom_location__area,
          propertyCity: propertyData?.custom_unit_city,
          propertyCountry: propertyData?.custom_unit_country,
          propertyRent: propertyData?.custom_property_rent,
          propertyUnits: propertyData?.custom_unit_no,
          sqFoot: propertyData?.custom_sqfoot,
          sqMeter: propertyData?.custom_sqmeter,
          priceSqMeter: propertyData.custom_pricesqmeter,
          priceSqFt: propertyData.custom_pricesqft,
          // propertyStatus: propertyData?.status,
          // propertyDoc: propertyData?.custom_image,
          ownerName: propertyData?.custom_supplier,
          ownerContact: propertyData?.custom_contact_number_of_supplier,
          ownerEmail: propertyData?.custom_email,
          ownerType: propertyData?.custom_owner_type,
          comment: propertyData?.custom_comment_box,
          customerName: propertyData?.custom_customer,
          status: propertyData?.custom_statusmi,
          customerContact: propertyData?.custom_contact_number_of_customer,
          customerEmail: propertyData?.custom_customer_email,
          customerType: propertyData?.custom_customer_type,
          startDate: propertyData?.custom_start_date,
          endDate: propertyData?.custom_end_date,
          damageLocation: propertyData?.custom_damage_location,
          description: propertyData?.custom_description,
          originalissue: propertyData?.custom_original_issue,
        }));

      }
      if (propertyData?.custom_attachment_table?.length > 0) {
        const imageArray = propertyData?.custom_attachment_table?.map((item) => item.image);
        setImageArray(imageArray)
      }
    }
    data()

  }, [location.state])
  useEffect(() => {
    getDamageLocationList();

  }, [])
  const getDamageLocationList = async () => {
    const res = await fetchDamageLocation();
    const item = res?.data?.data;
    let dropdownData = [...item.map((p) => ({ name: p.name })), { name: 'Add new +', isButton: true }];
    setDamageLocationList(dropdownData);
  };
  console.log(damageLocationList, "njk")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleDropDown = async (name, item) => {

    setFormValues((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imgUrls?.length > 0 ? imgUrls.map((imgUrl) => ({ image: imgUrl })) : imageArray.map((imgUrl) => ({ image: imgUrl }));
    try {
      console.log("API Data => ", formValues);
      const res = await updateCase({
        // ...formValues,
        custom_status: "Maintenance",
        custom_unit_no: formValues?.propertyUnits,
        custom_property: formValues?.propertyName,
        custom_customer: formValues?.customerName,
        custom_start_date: formValues?.startDate,
        custom_end_date: formValues?.endDate,
        custom_statusmi: '',
        custom_statusmo: '',
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
        custom_damage_location: formValues?.damageLocation,
        custom_description: formValues?.description,
        custom_original_issue: formValues?.originalissue

      }, formValues?.property); //import from API
      if (res) {
        navigate("/maintenance");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const handleAddNewLocation = async () => {
    if (newLocation.trim()) {
      const updatedDamageLocationList = [...damageLocationList]; // Create a copy of the list
updatedDamageLocationList.splice(damageLocationList.length - 1, 0, { name: newLocation }); // Insert at second last index
setDamageLocationList(updatedDamageLocationList); // Update the state

      const createDamageLocations = await createDamageLocation({ "custom_location": newLocation });
      setFormValues((prevValues) => ({
        ...prevValues,
        damageLocation: newLocation,
      }));
      setNewLocation(""); // Clear input field after adding
      setIsModalOpen(false); // Close modal
    }
  };

  const handleInputChange = (e) => {
    setNewLocation(e.target.value);
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
              <h3>Add New Damage Location</h3>
              <input
                type="text"
                value={newLocation}
                onChange={handleInputChange}
                placeholder="Enter location"
                autoFocus
                style={{
                  marginBottom: "10px",
                  padding: "5px",
                  width: "100%",
                }}
              />
              <div>
                <button
                  onClick={handleAddNewLocation}
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
            <Header name="Maintenance" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Maintenance > Add New"}
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

                  </div>

                  {formValues?.propertyName && formValues?.propertyUnits && (<>
                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Property Name : {formValues.propertyName}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">Unit Number : {formValues.propertyUnits}</label>
                      </div>
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
                        <label className="block">customer Name : {formValues.customerName}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">customer Email : {formValues.customerEmail}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">customer Contact : {formValues.customerContact}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">customer Type : {formValues.customerType}</label>
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
                        <label className="block">owner Name : {formValues.ownerName}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">owner Email : {formValues.ownerEmail}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">owner Contact : {formValues.ownerContact}</label>
                      </div>
                      <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                        <label className="block">owner Type : {formValues.ownerType}</label>
                      </div>
                    </div>
                    {/* Description box */}
                    <div className="mt-5">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Description
                        </span>
                      </p>
                      <textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={
                          handleChange
                        }
                        rows={8}
                        className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      ></textarea>
                    </div>
                    {/* Damage Location */}
                    <div className="mt-5 mb-5">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Damage Location
                        </span>

                      </p>
                      <Select
                        placeholder="Select Damage Location"
                        data={damageLocationList.map((p) => p.name)}
                        clearable
                        value={formValues?.damageLocation}
                        onChange={(value) => {
                          if (value === "Add new +") {
                            // Handle button click
                            setIsModalOpen(true);
                            console.log("Add New clicked");
                            // Add your logic here to open a modal or add a new item
                          } else {
                            handleDropDown("damageLocation", value);
                          }
                        }}
                        styles={selectStyle}
                      />
                    </div>
                    {/* Description box */}
                    <div className="mt-5">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Original Issue
                        </span>
                      </p>
                      <textarea
                        id="originalissue"
                        name="originalissue"
                        value={formValues.originalissue}
                        onChange={
                          handleChange
                        }
                        rows={8}
                        className="w-full p-3 border border-[#CCDAFF] rounded-md outline-none"
                      ></textarea>
                    </div>




                    {imageArray?.length > 0 && (<>
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4 mt-3">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Attachments
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-4 w-25% h-25%">

                        {imageArray.map((value) =>
                          <img
                            className="w-50px h-50px rounded-md"
                            src={value
                              ? `https://propms.erpnext.syscort.com/${value}`
                              : "/defaultProperty.jpeg"}
                            alt="propertyImg"
                          />
                        )}

                      </div></>)}
                    {/* Attachment */}
                    <div className="mt-5 mb-5">
                      <CustomFileUpload
                        onFilesUpload={(urls) => {
                          setImgUrls(urls);
                        }}
                        type="*"
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

export default EditMaintenance;