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
  payment_details,
  cheque_number_form_details,
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
} from "../api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Checkbox from "./CheckBox";
import CustomDatePicker from "./CustomDatePicker";
import { em, Select as MantineSelect, Table, Modal , Textarea} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { APP_AUTH } from "../constants/config";
import { formatDateToYYMMDD } from "../lib/utils";

const AddTenancyContracts = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState();
  const [checked, setChecked] = useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<any[]>([]);
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [singlePropertyData, setSinglePropertyData] = useState<any[]>([]);
  const [ownerList, setOwnerList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [numberOfChecks, setNumberOfChecks] = useState();
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState(null);

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
    tenancyStatus: "",

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

    tenantName: "",
    tenantContact: "",
    tenantEmail: "",
    tenantCity: "",
    tenantPassport: "",
    tenantPassportExpiry: null,
    tenantCountryOfIssuence: "",
    tenantEmiratesId: "",
    tenantEmiratesIdExpiry: null,
    tenantSignature: "",

    ownerName: "",
    ownerType: "",
    ownerContact: "",
    ownerEmail: "",
    ownerCountry: "",
    ownerEmiratesId: "",
    ownerMobile: "",
    ownerDoc: "",
    ownerSign: "",

    cheque: "",
    status: "",
    duration: "",
    comments: "",
    approvalStatus: "",
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [showSecurityDepositeAmt, setShowSecurityDepositeAmt] = useState(false);
  const [showBrokarageAmt, setShowBrokarageAmt] = useState(false);

  const handleOwnerFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];

      if (file) {
        const res = await uploadFile(file);
        setOwnerImgUrl(res?.data?.message?.file_url);
      }
    }
  };

  const handlePropertyFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];

      if (file) {
        const res = await uploadFile(file);
        setPropertyImgUrl(res?.data?.message?.file_url);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const newValues = { ...prevValues, [name]: value };

      // Trigger calculation after updating state
      if (
        name === "anualPriceRent" ||
        (name === "securityDeposite" &&
          selectedCheckbox === "securityDeposite") ||
        (name === "brokarage" && selectedCheckbox === "brokarage")
      ) {
        calculateAmounts(newValues);
      }

      return newValues;
    });
  };

  const calculateAmounts = (currentValues: { [key: string]: string }) => {
    const anualPriceRent = parseFloat(currentValues.anualPriceRent);
    const securityDepositePercentage = parseFloat(
      currentValues.securityDeposite
    );
    const brokaragePercentage = parseFloat(currentValues.brokarage);

    let calculatedSecurityDepositeAmt = "";
    let calculatedBrokarageAmt = "";

    // Calculate Security Deposite Amount if checkbox is selected
    if (
      selectedCheckbox === "securityDeposite" &&
      !isNaN(anualPriceRent) &&
      !isNaN(securityDepositePercentage)
    ) {
      calculatedSecurityDepositeAmt = (
        (anualPriceRent * securityDepositePercentage) /
        100
      ).toFixed(2);
      setShowSecurityDepositeAmt(true);
    }

    // Calculate Brokarage Amount if checkbox is selected
    if (
      selectedCheckbox === "brokarage" &&
      !isNaN(anualPriceRent) &&
      !isNaN(brokaragePercentage)
    ) {
      calculatedBrokarageAmt = (
        (anualPriceRent * brokaragePercentage) /
        100
      ).toFixed(2);
      setShowBrokarageAmt(true);
    }

    // Update form values with calculated amounts
    setFormValues((prevValues) => ({
      ...prevValues,
      securityDepositeAmt: calculatedSecurityDepositeAmt,
      brokarageAmt: calculatedBrokarageAmt,
    }));
  };

  const handleCheckboxChange = (name: string) => {
    const newSelectedCheckbox = selectedCheckbox === name ? null : name;
    setSelectedCheckbox(newSelectedCheckbox);

    // Reset visibility for amount fields based on checkbox selection
    setShowSecurityDepositeAmt(newSelectedCheckbox === "securityDeposite");
    setShowBrokarageAmt(newSelectedCheckbox === "brokarage");

    // Recalculate amounts based on the selected checkbox
    if (newSelectedCheckbox) {
      calculateAmounts({ ...formValues });
    } else {
      // Clear the calculated values and hide amount fields if no checkbox is selected
      setFormValues((prevValues) => ({
        ...prevValues,
        securityDepositeAmt: "",
        brokarageAmt: "",
      }));
      setShowSecurityDepositeAmt(false);
      setShowBrokarageAmt(false);
    }
  };

  useEffect(() => {
    getProperties();
    getTenants();
    getOwnerData();
  }, []);

  const getProperties = async () => {
    const res = await getPropertyList();
    const item = res?.data?.data;
    console.log(item);
    setPropertyList(item);
  };

  const getTenants = async () => {
    const res = await getTenantList();
    const item = res?.data?.data;
    console.log(item);
    setTenantList(item);
  };

  const getOwnerData = async () => {
    const res = await getOwnerList();
    const item = res?.data?.data;
    console.log(item);
    setOwnerList(item);
  };

  useEffect(() => {
    let chequeDate: any = [];
    // console.log("formValues.chequeDate", formValues.chequeDate);
    chequeDate.push(formValues.chequeDate);
    if (formValues.numberOfChecks === "2") {
      let currentDate = new Date(formValues.chequeDate);

      let date = currentDate.setMonth(currentDate.getMonth() + 6);

      let dateMDY = `${new Date(date).getFullYear()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getDate()}`;

      chequeDate.push(dateMDY);
    } else if (formValues.numberOfChecks === "3") {
      let currentDate = new Date(formValues.chequeDate);

      let date = currentDate.setMonth(currentDate.getMonth() + 4);
      let date1 = currentDate.setMonth(currentDate.getMonth() + 4);

      let dateMDY = `${new Date(date).getFullYear()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getDate()}`;

      let dateMDY1 = `${new Date(date1).getFullYear()}-${
        new Date(date1).getMonth() + 1
      }-${new Date(date1).getDate()}`;

      chequeDate.push(dateMDY);
      chequeDate.push(dateMDY1);
    } else if (formValues.numberOfChecks === "6") {
      let currentDate = new Date(formValues.chequeDate);

      let date = currentDate.setMonth(currentDate.getMonth() + 2);
      let date1 = currentDate.setMonth(currentDate.getMonth() + 2);
      let date2 = currentDate.setMonth(currentDate.getMonth() + 2);
      let date3 = currentDate.setMonth(currentDate.getMonth() + 2);
      let date4 = currentDate.setMonth(currentDate.getMonth() + 2);

      let dateMDY = `${new Date(date).getFullYear()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getDate()}`;

      let dateMDY1 = `${new Date(date1).getFullYear()}-${
        new Date(date1).getMonth() + 1
      }-${new Date(date1).getDate()}`;

      let dateMDY2 = `${new Date(date2).getFullYear()}-${
        new Date(date2).getMonth() + 1
      }-${new Date(date2).getDate()}`;

      let dateMDY3 = `${new Date(date3).getFullYear()}-${
        new Date(date3).getMonth() + 1
      }-${new Date(date3).getDate()}`;

      let dateMDY4 = `${new Date(date4).getFullYear()}-${
        new Date(date4).getMonth() + 1
      }-${new Date(date4).getDate()}`;

      chequeDate.push(dateMDY);
      chequeDate.push(dateMDY1);
      chequeDate.push(dateMDY2);
      chequeDate.push(dateMDY3);
      chequeDate.push(dateMDY4);
    }
    if (
      formValues?.numberOfChecks &&
      formValues?.anualPriceRent &&
      formValues?.bankName &&
      formValues?.chequeNo &&
      formValues?.chequeDate
    ) {
      setTableData((prevData) => {
        console.log("chequeDate", chequeDate);
        const newData = [];

        for (let i = 0; i < +formValues.numberOfChecks; i++) {
          newData.push({
            rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
            chequeNumber: formValues.chequeNo.split(",")[i] ?? "",
            chequeDate: chequeDate[i],
            bankName: formValues.bankName,
          });
        }
        return newData;
      });
    }
  }, [
    formValues?.numberOfChecks,
    formValues?.anualPriceRent,
    formValues?.bankName,
    formValues?.chequeNo,
    formValues?.chequeDate,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "sqFoot" && value) {
      let sqMeter = value * 0.092903;
      handleDropDown("sqMeter", Number(value * 0.092903).toFixed(2));
      handleDropDown(
        "priceSqFt",
        Number(formValues["anualPriceRent"] / value).toFixed(2)
      );
      handleDropDown(
        "priceSqMeter",
        Number(formValues["anualPriceRent"] / sqMeter).toFixed(2)
      );
    } else if (!value) {
      handleDropDown("sqMeter", 0);
      handleDropDown("priceSqFt", 0);
      handleDropDown("priceSqMeter", 0);
    }
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormValues((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   };

  const handleDropDown = async (name, item) => {
    if (name === "propertyName") {
      // Fetch property data based on the selected property

      const res = await fetchProperty(item);
      const propertyData = res?.data?.data;

      console.log("property data", propertyData);
      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          propertyName: propertyData?.name,
          propertyType: propertyData?.type,
          propertyLocation: propertyData?.custom_location,
          propertyRent: propertyData?.rent,
          propertyUnits: propertyData?.custom_number_of_units,
          propertyStatus: propertyData?.status,
          propertyDoc: propertyData?.custom_thumbnail_image,
        }));
        const response = await fetchUnitsfromProperty(propertyData?.name);
        const data = response?.data?.data;
        const values = data?.map((item) => item.custom_unit_number);
        setPropertyUnits((prev) => {
          return values;
        });
      }
    }

    if (name === "tenantName") {
      // Fetch tenant data based on the selected tenant
      const res = await fetchTenant(item);
      const tenantData = res?.data?.data;
      if (tenantData) {
        console.log("tenantData", tenantData);
        // Fill all the tenant-related fields with the fetched tenant data
        setFormValues((prevData) => ({
          ...prevData,
          tenantType: tenantData?.customer_type,
          tenantName: tenantData?.customer_name,
          tenantContact: tenantData?.custom_contact_number_of_customer,
          tenantEmail: tenantData?.custom_email,
          tenantCity: tenantData?.custom_city,
          tenantPassport: tenantData?.custom_passport_number,
          tenantPassportExpiry: tenantData?.passportExpiry,
          tenantCountryOfIssuence: tenantData?.custom_country_of_issuance,
          tenantEmiratesId: tenantData?.custom_emirates_id,
          tenantEmiratesIdExpiry: tenantData?.emiratesIdExpiry,
          tenantSignature: tenantData?.signature,
          // individual
          tenantOwnerName: tenantData?.name,
          tenantPassportNum: tenantData?.custom_passport_number,
          tenantPassportExpiryDate: tenantData?.custom_passport_expiry_date,
          tenantCountryOfIssuance: tenantData?.custom_country_of_issuance,
          tenantEmiratesIdExpiryDate:
            tenantData?.custom_emirates_id_expiry_date,
          // company
          tenantCompanyName: tenantData?.name,
          tenantTradeLicenseNumner: tenantData?.custom_trade_license_number,
          tenantEmirate: tenantData?.custom_emirate,
          tenantTradeLicenseExpiryDate:
            tenantData?.custom_trade_license_expiry_date,
          tenantPoaHolder: tenantData?.custom_power_of_attorney_holder_name,
        }));
      }
    }

    if (name === "ownerName") {
      // Fetch tenant data based on the selected tenant
      const res = await fetchOwner(item);
      const ownerData = res?.data?.data;
      if (ownerData) {
        // Fill all the tenant-related fields with the fetched tenant data
        setFormValues((prevData) => ({
          ...prevData,
          ownerName: ownerData?.name,
          ownerType: ownerData?.supplier_type,
          ownerContact: ownerData?.custom_phone_number,
          ownerEmail: ownerData?.custom_email,
          ownerCountry: ownerData?.country,
          ownerMobile: ownerData?.custom_phone_number,
          ownerDoc: ownerData?.doc,
          ownerSign: ownerData?.custom_signature_of_owner,
          //individual
          ownerPassportNum: ownerData?.custom_passport_number,
          ownerPassportExpiryDate: ownerData?.custom_passport_expiry_date,
          ownerCountryOfIssuance: ownerData?.custom_country_of_issuance,
          ownerEmiratesId: ownerData?.custom_emirates_id,
          ownerEmiratesIdExpiryDate: ownerData?.custom_emirates_id_expiry_date,
          // company
          ownerCompanyName: ownerData?.name,
          ownerTradeLicenseNumner: ownerData?.custom_trade_license_number,
          ownerEmirate: ownerData?.custom_emirate,
          ownerTradeLicenseExpiryDate:
            ownerData?.custom_trade_license_expiry_date,
          ownerPoaHolder: ownerData?.custom_power_of_attorney_holder_name,
        }));
      }
    }

    console.log("name", name, item);
    if (name === "numberOfChecks") {
      setNumberOfChecks(item);
    }
    setFormValues((prevData) => ({
      ...prevData,
      [name]: item,
    }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormValues((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleSelectChange = (value: string) => {
    if (value === "Select Property") {
      return;
    }
    if (value === "Select Tenant") {
      return;
    }
    if (value === "Select Owner") {
      return;
    }
    console.log(value);

    setFormValues((prevData) => ({
      ...prevData,
      propertyType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("API Data => ", formValues);
      const res = await createTanencyContract({
        ...formValues,
        lease_status: "Draft",
        //contract details
        custom_no_of__cheques: formValues.numberOfChecks,
        bank_name: formValues.bankName,
        cheque_no: formValues.chequeNo,
        cheque_date: formatDateToYYMMDD(formValues.chequeDate),
        start_date: formatDateToYYMMDD(formValues.startDate),
        end_date: formatDateToYYMMDD(formValues.endDate),
        custom_price__rent_annually: formValues.anualPriceRent,
        sq_foot: formValues.sqFoot,
        sq_meter: formValues.sqMeter,
        custom_price_sq_m: formValues.priceSqMeter,
        custom_price_sq_ft: formValues.priceSqFt,
        security_deposit: formValues.securityDepositeAmt,
        custom_brokerage_amount: formValues.brokerageAmt,

        notice_period: formValues.notice_period,
        custom_property_no: formValues.custom_property_no,
        custom_premises_no: formValues.custom_premises_no,
        custom_mode_of_payment: formValues.custom_mode_of_payment,
        lease_item: [
          {
            lease_item: "Rent",
            frequency: "Monthly",
            currency_code: "AED",
            document_type: "Sales Invoice",
            parentfield: "lease_item",
            parenttype: "Lease",
            doctype: "Lease Item",
            custom_cheque_no: "",
            custom_cheque_date:"",
            amount: "",
            custom_annual_amount: formValues.anualPriceRent,
            custom_cheque_status: "active status",
            custom_duration: formValues.duration,
            custom_comments: formValues.comments,
            custom_approval_status: formValues?.approvalStatus,
            custom_rent_amount: "rent",
            custom_status: formValues?.status,
            custom_name_on_the_cheque: formValues?.cheque,
          },
        ],

        // property details
        property: formValues.propertyName,
        custom_type: formValues.propertyType,
        custom_location__area: formValues.propertyLocation,
        custom_rent_amount_to_pay: formValues.propertyRent,
        custom_number_of_unit: formValues.propertyUnits,
        propertyDoc: propertyImgUrl,
        // customer details
        lease_customer: formValues.tenantName,
        customer: formValues.tenantName,
        custom_contact_number: formValues.tenantContact,
        custom_email: formValues.tenantEmail,
        custom_city: formValues.tenantCity,
        custom_passport_number: formValues.tenantPassport,
        custom_passport_expiry_date: formatDateToYYMMDD(
          formValues.tenantPassportExpiry
        ),
        custom_country_of_issuance: formValues.tenantCountryOfIssuence,
        custom_emirates_id: formValues.tenantEmiratesId,
        custom_emirates_id_expiry_date: formatDateToYYMMDD(
          formValues.tenantEmiratesIdExpiry
        ),
        custom_signature_of_customer: formValues.tenantSignature,
        // owner details
        custom_name_of_owner: formValues.ownerName,
        custom_type_of_owner: formValues.ownerType,
        custom_contact_number_of_owner: formValues.ownerContact,
        custom_emirates_idtrade_license: formValues.ownerEmiratesId,
        custom_owner_country: formValues.ownerCountry,
        custom_owner_email: formValues.ownerEmail,
        custom_mobile_number: formValues.ownerMobile,
        custom_image: ownerImgUrl,
        custom_signature_of_owner: formValues.ownerSign,
      }); //import from API
      if (res) {
        navigate("/contracts");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getChequeData = (name, label, type) => {
    // console.log('nuda',numberOfChecks)

    // {Array(numberOfChecks).map((index)=>(
    return (
      <Input
        key={name}
        label={label}
        name={name}
        type={type}
        value={formValues[name]}
        onChange={handleChange}
        borderd
        bgLight
      />
    );
    // ))}
  };

  console.log("add - formValues :", formValues)

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Tenancy Contracts" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Tenancy Cotract > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                    <MantineSelect
                      label="Status"
                      placeholder="Status"
                      name="tenancyStatus"
                      data={[
                        "Active",
                        "Draft",                        
                      ]}
                      value={formValues[name]}
                      onChange={(value) =>
                        setFormValues({ ...formValues, [name]: value })
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
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>

                   {/* Contract Details */}
                   <div>
                    <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Contract
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                      {Add_Contract_Details.map(
                        ({ label, name, type, values }) => {
                          if (
                            type === "text" &&
                            name !== "chequeNo" &&
                            name !== "chequeDate" &&
                            name !== "custom_mode_of_payment"
                          ) {
                            return (
                              <Input
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formValues[name]}
                                onChange={handleChange}
                                borderd
                                bgLight
                              />
                            );
                          } else if (
                            name === "chequeNo" ||
                            name === "chequeDate"
                          ) {
                            return getChequeData(name, label, type);
                          } else if (
                            type === "dropdown" ||
                            name === "custom_mode_of_payment"
                          ) {
                            return (
                              <Select
                                key={name}
                                onValueChange={(item) =>
                                  handleDropDown(name, item)
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
                            );
                          } else if (type === "date") {
                            return (
                              <CustomDatePicker
                                key={name}
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            );
                          } else {
                            return <></>;
                          }
                        }
                      )}
                    </div>
                    <div className="pt-6 pb-20">
                      {tableData?.length > 0 && (
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Rent</Table.Th>
                              <Table.Th>Cheque Number</Table.Th>
                              <Table.Th>Cheque Date</Table.Th>
                              <Table.Th>Bank Name</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {tableData?.map((item, i) => (
                              <Table.Tr key={i}>
                                <Table.Td>{item.rent}</Table.Td>
                                <Table.Td>{item.chequeNumber}</Table.Td>
                                <Table.Td>{item.chequeDate}</Table.Td>
                                <Table.Td>{item.bankName}</Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      )}
                    </div>
                  </div>
                 
                  {/* property details */}
                  <div>
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Property
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                      {/* <Select
                        name="propertyName"
                        onValueChange={(item) =>
                          handleDropDown("propertyName", item)
                        }
                      >
                        <SelectTrigger className="w-[220px] p-3 py-6 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] outline-none mt-7">
                          <div className="flex items-center">
                            <SelectValue placeholder={"Name of Property"} />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {propertyList?.map((item, i) => (
                            <SelectItem key={i} value={item?.property}>
                              {item?.property}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}

                      <MantineSelect
                        label="Property Name"
                        placeholder="Select Property"
                        data={propertyList.map((item) => ({
                          value: item?.name,
                          label: item?.property,
                        }))}
                        value={formValues.propertyName}
                        onChange={(value) =>
                          handleDropDown("propertyName", value)
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
                        searchable
                      />

                      {Add_TenancyContractProperty.map(
                        ({ label, name, type, values }) =>
                          type === "text" ? (
                            <Input
                              key={name}
                              label={label}
                              name={name}
                              type={type}
                              value={formValues[name]}
                              onChange={handleChange}
                              borderd
                              bgLight
                            />
                          ) : type === "dropdown" ? (
                            <Select
                              onValueChange={(item) =>
                                handleDropDown(name, item)
                              }
                              value={formValues[name]}
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
                              selectedDate={formValues[name] as Date}
                              onChange={(date) => handleDateChange(name, date)}
                              label={label}
                              placeholder="Select Date"
                              value={formValues[name]}
                            />
                          ) : type === "mantineSelect" ? (
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
                              searchable
                            />
                          ) : (
                            <></>
                          )
                      )}
                      {/* <div>
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
                            onChange={handlePropertyFileChange}
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>

                   {/* owner details */}
                   <div>
                    <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Owner
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                      <MantineSelect
                        label="Owner Name"
                        placeholder="Select Owner"
                        data={ownerList.map((item) => ({
                          value: item?.supplier_name,
                          label: item?.supplier_name,
                        }))}
                        value={formValues.ownerName}
                        onChange={(value) => handleDropDown("ownerName", value)}
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
                      />
                      {Add_TenancyContractOwner.map(
                        ({ label, name, type, values }) =>
                          type === "text" ? (
                            <Input
                              key={name}
                              label={label}
                              name={name}
                              type={type}
                              value={formValues[name as keyof FormData]}
                              onChange={handleChange}
                              borderd
                              bgLight
                            />
                          ) : type === "dropdown" ? (
                            <Select
                              onValueChange={(item) =>
                                handleDropDown(name, item)
                              }
                              value={formValues[name]}
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
                              selectedDate={formValues[name] as Date}
                              onChange={(date) => handleDateChange(name, date)}
                              label={label}
                              placeholder="Select Date"
                              value={formValues[name]}
                            />
                          ) : (
                            <></>
                          )
                      )}
                      {formValues?.ownerType === "Individual" &&
                        Owner_Type_Individual.map(
                          ({ label, name, type, values }) =>
                            type === "text" ? (
                              <Input
                                disabled
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formValues[name as keyof FormData]}
                                onChange={handleChange}
                                borderd
                                bgLight
                              />
                            ) : type === "dropdown" ? (
                              <Select
                                disabled
                                onValueChange={(item) =>
                                  handleDropDown(name, item)
                                }
                                value={formValues[name]}
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
                                disabled
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : (
                              <></>
                            )
                        )}
                      {formValues?.ownerType === "Company" &&
                        Owner_Type_Company.map(
                          ({ label, name, type, values }) =>
                            type === "text" ? (
                              <Input
                                disabled
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formValues[name as keyof FormData]}
                                onChange={handleChange}
                                borderd
                                bgLight
                              />
                            ) : type === "dropdown" ? (
                              <Select
                                disabled
                                onValueChange={(item) =>
                                  handleDropDown(name, item)
                                }
                                value={formValues[name]}
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
                                disabled
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : (
                              <></>
                            )
                        )}
                      <div>
                        <p className="mb-1.5 ml-1 font-medium text-gray-700">
                          <label>Attach Owner Signature</label>
                        </p>
                        <div
                          className={`flex items-center gap-3 p-2.5 bg-white border border-[#CCDAFF] rounded-md overflow-hidden`}
                        >
                          <input
                            className={`w-full bg-white outline-none`}
                            type="file"
                            accept="image/*"
                            onChange={handleOwnerFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mt-8 mb-4">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Customer
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                      <MantineSelect
                        label="Customer Name"
                        placeholder="Select Customer"
                        data={tenantList.map((value) => {
                          return value?.name;
                        })}
                        value={formValues.tenantName}
                        onChange={(value) =>
                          handleDropDown("tenantName", value)
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
                        searchable
                      />
                      {Add_TenancyContractTenant.map(
                        ({ label, name, type, values }) =>
                          type === "text" ? (
                            <Input
                              key={name}
                              label={label}
                              name={name}
                              type={type}
                              value={formValues[name as keyof FormData]}
                              onChange={handleChange}
                              borderd
                              bgLight
                            />
                          ) : type === "dropdown" ? (
                            <Select
                              onValueChange={(item) =>
                                handleDropDown(name, item)
                              }
                              value={formValues[name]}
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
                              selectedDate={formValues[name] as Date}
                              onChange={(date) => handleDateChange(name, date)}
                              label={label}
                              placeholder="Select Date"
                              value={formValues[name]}
                            />
                          ) : (
                            <></>
                          )
                      )}
                      {formValues?.tenantType === "Individual" &&
                        Tenant_Type_Individual.map(
                          ({ label, name, type, values }) =>
                            type === "text" ? (
                              <Input
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formValues[name as keyof FormData]}
                                onChange={handleChange}
                                borderd
                                bgLight
                                disabled
                              />
                            ) : type === "dropdown" ? (
                              <Select
                                onValueChange={(item) =>
                                  handleDropDown(name, item)
                                }
                                value={formValues[name]}
                                disabled
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
                                disabled
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : (
                              <></>
                            )
                        )}
                      {formValues?.tenantType === "Company" &&
                        Tenant_Type_Company.map(
                          ({ label, name, type, values }) =>
                            type === "text" ? (
                              <Input
                                disabled
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={formValues[name as keyof FormData]}
                                onChange={handleChange}
                                borderd
                                bgLight
                              />
                            ) : type === "dropdown" ? (
                              <Select
                                disabled
                                onValueChange={(item) =>
                                  handleDropDown(name, item)
                                }
                                value={formValues[name]}
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
                                disabled
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : (
                              <></>
                            )
                        )}
                      <div>
                        <p className="mb-1.5 ml-1 font-medium text-gray-700">
                          <label>Attach Customer Signature</label>
                        </p>
                        <div
                          className={`flex items-center gap-3 p-2.5 bg-white border border-[#CCDAFF] rounded-md overflow-hidden`}
                        >
                          <input
                            className={`w-full bg-white outline-none`}
                            type="file"
                            accept="image/*"
                            onChange={handleOwnerFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                {
                  formValues.custom_mode_of_payment === "Cheque" ?
                  <section className="border-t-[1px] border-gray-500 mt-16">
                    <form className="flex flex-col ">
                      <div>
                        <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                          <span className="pb-1 border-b border-[#7C8DB5]">
                            Payment
                          </span>
                          <span className="pb-1">Details</span>
                        </p>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                          {payment_details.map(
                            ({ label, name, type, values }) =>
                              type === "text" ? (
                                <Input
                                  key={name}
                                  label={label}
                                  name={name}
                                  type={type}
                                  value={formValues[name]}
                                  onChange={handleChange}
                                  borderd
                                  bgLight
                                />
                              ) : type === "dropdown" ? (
                                <Select
                                  onValueChange={(item) =>
                                    handleDropDown(name, item)
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
                                  selectedDate={formValues[name] as Date}
                                  onChange={(date) =>
                                    handleDateChange(name, date.toDateString())
                                  }
                                  label={label}
                                  placeholder="Select Date"
                                  value={formValues[name]}
                                />
                              ) : type === "mantineSelect" ? (
                                <MantineSelect
                                  label={label}
                                  placeholder={label}
                                  data={values}
                                  value={formValues[name]}
                                  onChange={(value) =>
                                    handleDropDown(name, value)
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
                                  searchable
                                />
                              ) : (
                                <></>
                              )
                          )}
                        </div>
                      </div>
                      {tableData?.length > 0 && (
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>S.no.</Table.Th>
                              <Table.Th>Cheque Number</Table.Th>
                              <Table.Th>Rent</Table.Th>
                              <Table.Th>Cheque Date</Table.Th>
                              <Table.Th>Bank Name</Table.Th>
                              <Table.Th>Status</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {tableData?.map((item, i) => (
                              <Table.Tr key={i}>
                                <Table.Td>{item.Sno}</Table.Td>
                                <Table.Td
                                  onClick={() => {
                                    setSelectedCheque(item);
                                    setPaymentDetailsModalOpen(true);
                                  }}
                                  className="text-blue-600 cursor-pointer "
                                >
                                  {item.chequeNumber}
                                </Table.Td>
                                <Table.Td>{item.rent}</Table.Td>
                                <Table.Td>{item.chequeDate}</Table.Td>
                                <Table.Td>{item.bankName}</Table.Td>
                                <Table.Td>Active</Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      )}
                    </form>
                  </section>
                  :
                  ""
                }
                  <div className="max-w-[100px] mt-16">
                    <PrimaryButton title="Save" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        opened={paymentDetailsModalOpen}
        onClose={() => setPaymentDetailsModalOpen(false)}
        title=""
        // scrollAreaComponent={ScrollArea.Autosize}
        fullscreen={false}
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
        size="60%"
      >
        <form className="flex flex-col">
          <div className="">
            <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
              <span className="pb-1 border-b border-[#7C8DB5]">
                Cheque Number
              </span>
              <span className="pb-1">Details</span>
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))] gap-4 mb-6">
              {cheque_number_form_details.map(({ label, name, type, values }) =>
                type === "text" ? (
                  <Input
                    key={name}
                    label={label}
                    name={name}
                    type="text"
                    // value={
                    //   name === "bankName"
                    //     ? selectedCheque?.bankName || ""
                    //     : name === "anualPriceRent"
                    //     ? selectedCheque?.rent || ""
                    //     : selectedCheque?.bankName || ""
                    // }
                    value={formValues[name] || ""}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [name]: e.target.value })
                    }
                    className="w-full p-4 text-[16px] text-sonicsilver bg-white border border-[#CCDAFF] rounded-lg outline-none"
                  />
                ) : type === "mantineSelect" ? (
                  <MantineSelect
                    variant="filled"
                    key={name}
                    label={label}
                    placeholder={label}
                    data={values}
                    value={formValues[name] || ""}
                    onChange={(value) =>
                      setFormValues({ ...formValues, [name]: value })
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
                    searchable
                  />
                ) : type === "text-area" ? (
                  <Textarea
                    onChange={(e) =>
                      setFormValues({ ...formValues, [name]: e.target.value })
                    }
                    variant="filled"
                    radius="xs"
                    label={label}
                    placeholder="Input placeholder"
                  />
                ) : null
              )}
            </div>
          </div>
          {/* <div className="pt-4">
            <PrimaryButton type="submit" title="Save Details" />
          </div> */}
        </form>
      </Modal>
    </main>
  );
};

export default AddTenancyContracts;
