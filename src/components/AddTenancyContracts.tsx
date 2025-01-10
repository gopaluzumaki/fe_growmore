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
  // getUnitList,
  fetchUnit,
  fetchUnitForTenancyContract,
  getTenancyContractList,
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
import {
  em,
  Select as MantineSelect,
  Table,
  Modal,
  Textarea,
  Checkbox as MantineCkeckbox,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { APP_AUTH } from "../constants/config";
import { formatDateToYYMMDD, formatDateToYYYYMMDD } from "../lib/utils";
import { useListState, randomId } from "@mantine/hooks";
import CustomFileUpload from "./ui/CustomFileUpload";

const initialValues = [
  { label: "Move In", checked: true, key: randomId() },
  { label: "Move Out", checked: true, key: randomId() },
  { label: "Payment Remainder", checked: true, key: randomId() },
  { label: "Birthday Message", checked: true, key: randomId() },
  { label: "90 Days Renewal Notice", checked: true, key: randomId() },
];

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
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState(null);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [imageArray, setImageArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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
    leaseStatus: "",
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

    sqFoot: "",
    sqMeter: "",
    priceSqMeter: "",
    priceSqFt: "",
    custom_premises_no: "",

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

    custom_mode_of_payment: "Cheque",
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [showSecurityDepositeAmt, setShowSecurityDepositeAmt] = useState(false);
  const [showBrokarageAmt, setShowBrokarageAmt] = useState(false);
  const [values, handlers] = useListState(initialValues);
  const [ownerDetails, setOwnerDetails] = useState();
  const [tenantDetails, setTenantDetails] = useState();

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
    setPropertyList(item);
  };

  const getTenants = async () => {
    const res = await getTenantList();
    const item = res?.data?.data;
    setTenantList(item);
  };

  const getOwnerData = async () => {
    const res = await getOwnerList();
    const item = res?.data?.data;
    setOwnerList(item);
  };

  // to manage payment details table
  useEffect(() => {
    let chequeDate: any = [];
    // console.log("formValues.chequeDate", formValues.chequeDate);
    chequeDate.push(formatDateToYYYYMMDD(formValues.chequeDate));
    if (formValues.numberOfChecks === "2") {
      let currentDate = new Date(formValues.chequeDate);

      let date = currentDate.setMonth(currentDate.getMonth() + 6);

      let dateMDY = `${new Date(date).getFullYear()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getDate()}`;

      chequeDate.push(formatDateToYYYYMMDD(dateMDY));
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

      chequeDate.push(formatDateToYYYYMMDD(dateMDY));
      chequeDate.push(formatDateToYYYYMMDD(dateMDY1));
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

      chequeDate.push(formatDateToYYYYMMDD(dateMDY));
      chequeDate.push(formatDateToYYYYMMDD(dateMDY1));
      chequeDate.push(formatDateToYYYYMMDD(dateMDY2));
      chequeDate.push(formatDateToYYYYMMDD(dateMDY3));
      chequeDate.push(formatDateToYYYYMMDD(dateMDY4));
    }
    if (
      formValues?.numberOfChecks &&
      formValues?.anualPriceRent &&
      formValues?.bankName &&
      formValues?.chequeDate
    ) {
      setTableData(() => {
        const newData = [];

        // Populate table data from leaseItems
        if (
          formValues?.leaseItems &&
          formValues?.numberOfChecks &&
          formValues?.leaseItems?.length == formValues.numberOfChecks
        ) {
          formValues.leaseItems.forEach((lease, index) => {
            newData.push({
              rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
              chequeNumber: lease.chequeNumber,
              chequeDate: chequeDate[index] ?? lease.chequeDate,
              bankName: formValues.bankName,
              Sno: index + 1,
              cheque: lease.cheque,
              status: lease.status,
              duration: lease.duration,
              comments: lease.comments,
              approvalStatus: lease.approvalStatus,
            });
          });
        } else {
          for (let i = 0; i < +formValues.numberOfChecks; i++) {
            newData.push({
              rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
              chequeNumber: "",
              chequeDate: chequeDate[i],
              bankName: formValues.bankName,
              Sno: i,
              cheque: formValues.cheque,
              status: formValues.status,
              duration: formValues.duration,
              comments: formValues.comments,
              approvalStatus: formValues.approvalStatus,
            });
          }
        }

        return newData;
      });
    }
  }, [
    formValues?.numberOfChecks,
    formValues?.anualPriceRent,
    formValues?.bankName,
    formValues?.chequeDate,
    formValues?.leaseItems,
  ]);

  useEffect(() => {
    if (formValues.sqFoot && formValues.propertyRent) {
      const sqMeter = formValues.sqFoot * 0.092903;
      handleDropDown(
        "sqMeter",
        Number(formValues.sqFoot * 0.092903).toFixed(2)
      );
      handleDropDown(
        "priceSqFt",
        Number(formValues.propertyRent / formValues.sqFoot).toFixed(2)
      );
      handleDropDown(
        "priceSqMeter",
        Number(formValues.propertyRent / sqMeter).toFixed(2)
      );
    }
  }, [formValues.sqFoot, formValues.propertyRent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // if (name === "sqFoot" && value) {
    //   let sqMeter = value * 0.092903;
    //   handleDropDown("sqMeter", Number(value * 0.092903).toFixed(2));
    //   handleDropDown(
    //     "priceSqFt",
    //     Number(formValues["anualPriceRent"] / value).toFixed(2)
    //   );
    //   handleDropDown(
    //     "priceSqMeter",
    //     Number(formValues["anualPriceRent"] / sqMeter).toFixed(2)
    //   );
    // } else if (!value) {
    //   handleDropDown("sqMeter", 0);
    //   handleDropDown("priceSqFt", 0);
    //   handleDropDown("priceSqMeter", 0);
    // }
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
    if (name === "propertyName1") {
      // Fetch property data based on the selected property
      const res = await fetchProperty(item);
      const propertyData = res?.data?.data;

      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          //id
          propertyName1: propertyData?.name,
          //name
          propertyName: propertyData?.name1,
          propertyType: propertyData?.type,
          propertyLocation: propertyData?.custom_location,

          propertyUnits: null,
          propertyRent: "",
          propertyStatus: propertyData?.status,
          propertyDoc: propertyData?.custom_thumbnail_image,
        }));
        const response = await fetchUnitsfromProperty(propertyData?.name);
        const data = response?.data?.data;
        const val = data?.map((item) => ({
          custom_unit_number: item.custom_unit_number,
          name: item.name,
        }));

        setPropertyUnits(val);
      }
    }

    if (name === "tenantName") {
      // Fetch tenant data based on the selected tenant
      const res = await fetchTenant(item);
      const tenantData = res?.data?.data;
      setTenantDetails(tenantData);
      if (tenantData) {
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

    // if (name === "ownerName") {
    //   // Fetch tenant data based on the selected tenant

    //   // if (ownerData) {
    //   //   // Fill all the tenant-related fields with the fetched tenant data
    //   //   setFormValues((prevData) => ({
    //   //     ...prevData,
    //   //     ownerName: ownerData?.name,
    //   //     ownerType: ownerData?.supplier_type,
    //   //     ownerContact: ownerData?.custom_phone_number,
    //   //     ownerEmail: ownerData?.custom_email,
    //   //     ownerCountry: ownerData?.country,
    //   //     ownerMobile: ownerData?.custom_phone_number,
    //   //     ownerDoc: ownerData?.doc,
    //   //     ownerSign: ownerData?.custom_signature_of_owner,
    //   //     //individual
    //   //     ownerPassportNum: ownerData?.custom_passport_number,
    //   //     ownerPassportExpiryDate: ownerData?.custom_passport_expiry_date,
    //   //     ownerCountryOfIssuance: ownerData?.custom_country_of_issuance,
    //   //     ownerEmiratesId: ownerData?.custom_emirates_id,
    //   //     ownerEmiratesIdExpiryDate: ownerData?.custom_emirates_id_expiry_date,
    //   //     // company
    //   //     ownerCompanyName: ownerData?.name,
    //   //     ownerTradeLicenseNumner: ownerData?.custom_trade_license_number,
    //   //     ownerEmirate: ownerData?.custom_emirate,
    //   //     ownerTradeLicenseExpiryDate:
    //   //       ownerData?.custom_trade_license_expiry_date,
    //   //     ownerPoaHolder: ownerData?.custom_power_of_attorney_holder_name,
    //   //   }));
    //   // }
    // }

    if (name === "propertyUnits" && item != undefined) {
      console.log("property unit item :", item);
      const unit_List = await fetchUnitForTenancyContract(item);
      const unit_List_Data = unit_List?.data?.data;
      console.log("property unit data :", unit_List_Data);
      if (unit_List_Data) {
        const res = await fetchOwner(unit_List_Data?.unit_owner);
        const ownerData = res?.data?.data;
        setOwnerDetails(ownerData);

        setFormValues((prevData) => ({
          ...prevData,
          sqFoot: unit_List_Data?.custom_square_ft_of_unit,
          sqMeter: unit_List_Data?.custom_square_m_of_unit,
          priceSqMeter: unit_List_Data?.custom_price_square_m,
          priceSqFt: unit_List_Data?.custom_price_square_ft,
          custom_premises_no: unit_List_Data?.custom_premise_no,
          custom_city: unit_List_Data?.custom_city,
          custom_country: unit_List_Data?.custom_country,
          propertyRent: unit_List_Data?.rent,
          custom_number_of_unit: unit_List_Data?.custom_unit_number,
        }));
      }
    }

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

    setFormValues((prevData) => ({
      ...prevData,
      propertyType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl }));

    // const tenancyContractList = await getTenancyContractList();
    // const findOne = tenancyContractList?.data?.data.find(
    //   (item) => item.name === location.state && item.lease_status === "Active"
    // );
    // if (findOne) {
    //   alert("This tenancy contract is already active");
    //   return;
    // }
    try {
      const remindersMapping = {
        "Move In": "custom_move_in",
        "Move Out": "custom_move_out",
        "Payment Remainder": "custom_payment_remainder",
        "Birthday Message": "custom_birthday_message",
        // "60 Days Renewal Notice": "custom_60_days_renewal_notice",
        "90 Days Renewal Notice": "custom_90_days_renewal_notice",
      };

      const reminderValues = values.reduce((acc, value) => {
        const fieldName = remindersMapping[value.label];
        if (fieldName) {
          acc[fieldName] = value.checked ? 1 : 0;
        }
        return acc;
      }, {});

      const res = await createTanencyContract({
        ...formValues,
        ...reminderValues,
        lease_status: formValues?.tenancyStatus,
        //contract details
        // lease_status:"Draft",
        custom_attachment_table: imageData,
        bank_name: formValues.bankName,
        cheque_no: formValues.chequeNo,
        cheque_date: formatDateToYYMMDD(formValues.chequeDate),
        start_date: formatDateToYYMMDD(formValues.startDate),
        end_date: formatDateToYYMMDD(formValues.endDate),
        sq_foot: formValues.sqFoot,
        sq_meter: formValues.sqMeter,
        custom_price_sq_m: formValues.priceSqMeter,
        custom_price_sq_ft: formValues.priceSqFt,
        security_deposit: formValues.securityDepositeAmt,
        custom_brokerage_amount: formValues.brokerageAmt,

        notice_period: formValues.notice_period,
        custom_property_no: formValues.custom_property_no,
        custom_premises_no: formValues.custom_premises_no,
        custom_mode_of_payment: "Cheque",

        // property details
        property: formValues.propertyName1,
        custom_property_name: formValues.propertyName,
        custom_type: formValues.propertyType,
        custom_location__area: formValues.propertyLocation,
        custom_rent_amount_to_pay: formValues.propertyRent,
        //save unit number
        custom_unit_name: formValues.propertyUnits,
        // save unit name
        custom_number_of_unit: formValues.custom_number_of_unit,
        propertyDoc: propertyImgUrl,
        // customer details
        lease_customer: tenantDetails.name,
        customer: tenantDetails.name,
        custom_contact_number: tenantDetails.custom_contact_number_of_customer,
        custom_email: tenantDetails.custom_email,
        custom_customer_type: tenantDetails.customer_type,

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
        custom_name_of_owner: ownerDetails.supplier_name,
        custom_type_of_owner: ownerDetails.supplier_type,
        custom_contact_number_of_owner: ownerDetails.custom_phone_number,
        custom_emirates_idtrade_license: formValues.ownerEmiratesId,
        custom_owner_country: formValues.ownerCountry,
        custom_owner_email: ownerDetails.custom_email,
        custom_mobile_number: formValues.ownerMobile,
        custom_image: ownerImgUrl,
        custom_signature_of_owner: formValues.ownerSign,

        custom_no_of__cheques: formValues.numberOfChecks,

        custom_bank_name: formValues.bankName,
        custom_price__rent_annually: formValues.anualPriceRent,

        lease_item:
          tableData && tableData.length > 0
            ? tableData.map((item) => {
                return {
                  lease_item: "Rent",
                  frequency: "Monthly",
                  currency_code: "AED",
                  document_type: "Sales Invoice",
                  parentfield: "lease_item",
                  parenttype: "Lease",
                  doctype: "Lease Item",
                  custom_cheque_no: item.chequeNumber,
                  custom_cheque_date: formatDateToYYMMDD(item.chequeDate),
                  amount: item.rent,
                  custom_annual_amount: formValues.anualPriceRent,
                  custom_cheque_status: "active status",
                  custom_duration: item.duration,
                  custom_comments: item.comments,
                  custom_approval_status: item.approvalStatus,
                  custom_rent_amount: item.rent,
                  custom_status: item.status,
                  custom_name_on_the_cheque: item.cheque,

                  // set customer email for notification purpose
                  custom_send_email: tenantDetails.custom_email,
                  custom_lease_status: formValues.tenancyStatus,
                  custom_customer_name: tenantDetails.name,
                  custom__payment_remainder: values.find(
                    (item) => item.label === "Payment Remainder"
                  ).checked
                    ? 1
                    : 0,
                };
              })
            : [],
      });
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
  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls]);
  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };
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
                      required
                      name="tenancyStatus"
                      data={["Active", "Draft"]}
                      onChange={(value) =>
                        handleDropDown("tenancyStatus", value)
                      }
                      value={formValues.tenancyStatus}
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
                        ({ label, name, type, values, required }) => {
                          if (
                            type === "text" &&
                            name !== "chequeNo" &&
                            name !== "chequeDate" &&
                            name !== "custom_mode_of_payment"
                          ) {
                            return (
                              <Input
                                required={required ?? false}
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
                                required={required ?? false}
                                key={name}
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
                            );
                          } else if (type === "date") {
                            return (
                              <CustomDatePicker
                                required={required ?? false}
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
                    <div className="mb-5">
                      <CustomFileUpload
                        onFilesUpload={(urls) => {
                          setImgUrls(urls);
                        }}
                        type="image/*"
                        setLoading={setLoading}
                      />
                    </div>
                    {/* <div className="pt-6 pb-20">
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
                    </div> */}
                  </div>
                  {imageArray?.length > 0 && (
                    <>
                      <p className="mb-1.5 ml-1 font-medium text-gray-700">
                        Attachments
                      </p>
                      <div className="grid grid-cols-5 gap-4 w-25% h-25%">
                        {imageArray.map((value, index) => (
                          <div
                            key={index}
                            className="relative w-[100px] h-[100px]"
                          >
                            <img
                              className="w-full h-full rounded-md"
                              src={
                                value
                                  ? `https://propms.erpnext.syscort.com/${value}`
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
                    </>
                  )}
                  {/* property details */}
                  <div>
                    <p className="flex gap-2 text-[18px] text-[#7C8DB5] mb-4">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Property
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="flex flex-col gap-4">
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

                      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                        <MantineSelect
                          label="Property Name"
                          placeholder="Select Property"
                          required
                          data={propertyList.map((item) => ({
                            value: item?.name,
                            label: item?.property,
                          }))}
                          value={formValues.propertyName1}
                          onChange={(value) =>
                            handleDropDown("propertyName1", value)
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
                          ({ label, name, type, values, required }) =>
                            type === "text" ? (
                              <Input
                                required={required ?? false}
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
                                required={required ?? false}
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
                                required={required ?? false}
                                selectedDate={formValues[name] as Date}
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : type === "mantineSelect" ? (
                              <MantineSelect
                                required={required ?? false}
                                label={label}
                                placeholder={label}
                                data={propertyUnits.map((unit) => ({
                                  value: unit.name,
                                  label: unit.custom_unit_number,
                                  unit,
                                }))}
                                value={formValues.propertyUnits || null}
                                onChange={(value) => {
                                  handleDropDown("propertyUnits", value);
                                }}
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
                    {formValues.propertyUnits ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Location : {formValues.propertyLocation}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            City : {formValues.custom_city}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Country : {formValues.custom_country}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block"></label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Square ft of unit : {formValues.sqFoot}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Square m of unit : {formValues.sqMeter}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Price/ Square m : {formValues.priceSqMeter}
                          </label>
                        </div>
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Price/ Square ft : {formValues.priceSqFt}
                          </label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* owner details */}
                  <div>
                    <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                      <span className="pb-1 border-b border-[#7C8DB5]">
                        Owner
                      </span>
                      <span className="pb-1">Details</span>
                    </p>
                    <div className="flex flex-col gap-4 mb-6">
                      {/* <MantineSelect
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
                      /> */}
                      {ownerDetails ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Owner Name : {ownerDetails.supplier_name}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Owner Email : {ownerDetails.custom_email}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Owner Contact : {ownerDetails.custom_phone_number}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Owner Type :{ownerDetails.supplier_type}
                            </label>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
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
                    <div className="flex flex-col gap-4">
                      <MantineSelect
                        required
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
                      {tenantDetails ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Customer Name :{" "}
                              {tenantDetails && tenantDetails.name}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Customer Email :{" "}
                              {tenantDetails && tenantDetails.custom_email}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Customer Contact :{" "}
                              {tenantDetails &&
                                tenantDetails.custom_contact_number_of_customer}
                            </label>
                          </div>
                          <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                            <label className="block">
                              Customer Type :{" "}
                              {tenantDetails && tenantDetails.customer_type}
                            </label>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {/* payment details */}
                  {formValues.custom_mode_of_payment === "Cheque" ? (
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
                                      handleDateChange(
                                        name,
                                        date.toDateString()
                                      )
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
                                <Table.Th>Cheque Status</Table.Th>
                                <Table.Th>Approval Status</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tableData?.map((item, i) => (
                                <Table.Tr key={i}>
                                  <Table.Td>{item.Sno + 1}</Table.Td>
                                  <Table.Td
                                    onClick={() => {
                                      setFormValues({
                                        ...formValues,
                                        chequeNumber: item.chequeNumber,
                                        bankName: item.bankName,
                                        rent: item.rent.toString(),
                                        dateOfCheque: item.chequeDate,
                                        status: item.status,
                                        duration: item.duration,
                                        comments: item.comments,
                                        approvalStatus: item.approvalStatus,
                                        cheque: item.cheque,
                                      });
                                      setPaymentDetailsModalOpen(i);
                                    }}
                                    className="text-blue-600 cursor-pointer "
                                  >
                                    {item.chequeNumber || "Add Cheque "}
                                  </Table.Td>
                                  <Table.Td>
                                    {parseFloat(item.rent).toFixed(2)}
                                  </Table.Td>
                                  <Table.Td>{item.chequeDate}</Table.Td>
                                  <Table.Td>{item.bankName}</Table.Td>
                                  <Table.Td>{item?.status || "-"}</Table.Td>
                                  <Table.Td>
                                    {item?.approvalStatus || "N/A"}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        )}
                      </form>
                    </section>
                  ) : (
                    <></>
                  )}

                  {formValues.tenancyStatus !== "Draft" &&
                  formValues.tenancyStatus !== "" &&
                  formValues.tenancyStatus !== null ? (
                    <section className="my-20">
                      <p className="flex gap-2 text-[18px] text-[#7C8DB5] mt-8 mb-4">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Manage
                        </span>
                        <span className="pb-1">Notification</span>
                      </p>
                      <div>
                        {values.map((value, index) => (
                          <MantineCkeckbox
                            mt="xs"
                            ml={33}
                            label={value.label}
                            key={value.key}
                            checked={value.checked}
                            onChange={(event) => {
                              handlers.setItemProp(
                                index,
                                "checked",
                                event.currentTarget.checked
                              );
                            }}
                          />
                        ))}
                      </div>
                    </section>
                  ) : (
                    ""
                  )}
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
        opened={paymentDetailsModalOpen !== null}
        onClose={() => setPaymentDetailsModalOpen(null)}
        title=""
        // scrollAreaComponent={ScrollArea.Autosize}
        fullscreen={false}
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
        size="60%"
      >
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Original Table Data", tableData);
            const updatedTableData = tableData.map((item, index) =>
              index === paymentDetailsModalOpen
                ? {
                    ...item,
                    chequeDate: formatDateToYYYYMMDD(
                      formValues.dateOfCheque || item.chequeDate
                    ),
                    cheque: formValues.cheque,
                    chequeNumber: formValues.chequeNumber,
                    status: formValues.status,
                    duration: formValues.duration,
                    comments: formValues.comments,
                    approvalStatus: formValues.approvalStatus,
                  }
                : item
            );

            setTableData(updatedTableData);
            setPaymentDetailsModalOpen(null);

            console.log("Updated Table Data", updatedTableData);
          }}
        >
          <div className="">
            <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
              <span className="pb-1 border-b border-[#7C8DB5]">Cheque</span>
              <span className="pb-1">Details</span>
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(420px,1fr))] gap-4 mb-6">
              {cheque_number_form_details.map(
                ({ label, name, type, values, required }) =>
                  (type === "text") | (type === "number") ? (
                    <Input
                      disabled={
                        name === "duration" && formValues.status !== "Hold"
                      }
                      required={required ?? false}
                      key={name}
                      label={label}
                      name={name}
                      type={type}
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
                      required={required ?? false}
                      variant="filled"
                      key={name}
                      label={label}
                      placeholder={label}
                      data={values}
                      value={formValues[name]}
                      onChange={(value) => {
                        if (name === "status" && value === "Clear") {
                          setFormValues({
                            ...formValues,
                            [name]: value,
                            approvalStatus: null,
                            duration: null,
                          });
                        } else setFormValues({ ...formValues, [name]: value });
                      }}
                      disabled={
                        name === "approvalStatus" &&
                        formValues.status !== "Hold"
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
                      clearable
                    />
                  ) : type === "text-area" ? (
                    <Textarea
                      required={required ?? false}
                      value={formValues[name] || ""}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [name]: e.target.value })
                      }
                      variant="filled"
                      radius="xs"
                      label={label}
                      placeholder="Input placeholder"
                    />
                  ) : type === "date" ? (
                    <CustomDatePicker
                      required={required ?? false}
                      selectedDate={formValues[name] as Date}
                      onChange={(date) =>
                        handleDateChange(name, date.toDateString())
                      }
                      label={label}
                      placeholder="Select Date"
                      value={formValues[name]}
                    />
                  ) : null
              )}
            </div>

            <PrimaryButton type="submit" title="Edit" />
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
