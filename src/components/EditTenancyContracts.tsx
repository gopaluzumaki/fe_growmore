// @ts-nocheck
import Header from "./Header";
import PrimaryButton from "./PrimaryButton";
import Sidebar from "./Sidebar";
import {
  Add_TenancyContractOwner,
  Add_TenancyContractTenant,
  Add_TenancyContractProperty,
  Add_Contract_Details,
  payment_details,
  Owner_Type_Individual,
  Owner_Type_Company,
  Tenant_Type_Company,
  Tenant_Type_Individual,
  cheque_number_form_details,
  Extend_TenancyContractProperty,
  Termination_TenancyContractProperty,
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
  fetchBooking,
  fetchTenancyContract,
  updateTanencyContract,
  fetchUnitsfromProperty,
  updateProperty,
  fetchUnit,
  API_URL,
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
  Select as MantineSelect,
  Modal,
  ScrollArea,
  Table,
  Textarea,
  Checkbox as MantineCkeckbox,
  Button,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_AUTH } from "../constants/config";
import { formatDateToYYMMDD } from "../lib/utils";
import { useListState, randomId } from "@mantine/hooks";

const initialValues = [
  { label: "Move In", checked: true, key: randomId() },
  { label: "Move Out", checked: true, key: randomId() },
  { label: "Payment Remainder", checked: true, key: randomId() },
  { label: "Birthday Message", checked: true, key: randomId() },
  { label: "60 Days Renewal Notice", checked: true, key: randomId() },
  { label: "90 Days Renewal Notice", checked: true, key: randomId() },
];

const EditTenancyContracts = () => {
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
      cheque: string;
      status: string;
      duration: string;
      comments: string;
      approvalStatus: string;
    }[]
  >([]);
  const [paymentDetailsModalOpen, setPaymentDetailsModalOpen] = useState<
    number | null
  >(null);
  const [ownerImgUrl, setOwnerImgUrl] = useState("");
  const [propertyImgUrl, setPropertyImgUrl] = useState("");
  const location = useLocation();
  const [propertyUnits, setPropertyUnits] = useState([]);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({
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
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [showSecurityDepositeAmt, setShowSecurityDepositeAmt] = useState(false);
  const [showBrokarageAmt, setShowBrokarageAmt] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [values, handlers] = useListState(initialValues);

  // to prefilled formdata values.
  useEffect(() => {
    const fetchingBookedData = async () => {
      if (location.state) {
        try {
          const res = await fetchTenancyContract(location.state);
          const item = res?.data?.data;

          console.log("property items data: ", item);

          if (item) {
            // Map lease items for nested fields
            const mappedLeaseItems = item.lease_item.map((lease) => ({
              chequeNo: lease.custom_cheque_no,
              chequeDate: lease.custom_cheque_date,
              cheque: lease.custom_name_on_the_cheque,
              status: lease.custom_status,
              duration: lease.custom_duration,
              comments: lease.custom_comments,
              approvalStatus: lease.custom_approval_status,
            }));

            const updatedValues = [
              {
                label: "Move In",
                checked: item.custom_move_in === 1,
                key: randomId(),
              },
              {
                label: "Move Out",
                checked: item.custom_move_out === 1,
                key: randomId(),
              },
              {
                label: "Payment Remainder",
                checked: item.custom_payment_remainder === 1,
                key: randomId(),
              },
              {
                label: "Birthday Message",
                checked: item.custom_birthday_message === 1,
                key: randomId(),
              },
              {
                label: "60 Days Renewal Notice",
                checked: item.custom_60_days_renewal_notice === 1,
                key: randomId(),
              },
              {
                label: "90 Days Renewal Notice",
                checked: item.custom_90_days_renewal_notice === 1,
                key: randomId(),
              },
            ];

            handlers.setState(updatedValues);

            setFormValues((prevData) => ({
              ...prevData,
              chequeNo: mappedLeaseItems.map((item) => item.chequeNo).join(","),
              chequeDate: mappedLeaseItems[0].chequeDate,
              tenancyStatus: item?.lease_status,
              bankName: item.custom_bank_name,
              numberOfChecks: item?.custom_no_of__cheques,
              startDate: item.start_date,
              endDate: item.end_date,
              anualPriceRent: item.custom_price__rent_annually + "",
              sqFoot:
                item.custom_price__rent_annually / item.custom_price_sq_ft || 0,
              sqMeter:
                item.custom_price__rent_annually / item.custom_price_sq_m || 0,
              priceSqMeter: item.custom_price_sq_m,
              priceSqFt: item.custom_price_sq_ft,
              securityDepositeAmt: item.security_deposit,
              brokerageAmt: item.custom_brokerage_amount,
              notice_period: item.notice_period,
              custom_property_no: item.custom_property_no,
              custom_premises_no: item.custom_premises_no,
              custom_mode_of_payment: item.custom_mode_of_payment,
              propertyName: item.property,
              propertyType: item.custom_type,
              propertyLocation: item.custom_location__area,
              propertyRent: item.custom_rent_amount_to_pay,
              propertyUnits: item.custom_number_of_unit,
              propertyDoc: item.propertyDoc,
              tenantName: item.lease_customer,
              tenantContact: item.custom_contact_number,
              tenantEmail: item.custom_email,
              tenantCity: item.custom_city,
              tenantPassport: item.custom_passport_number,
              tenantPassportExpiry: item.custom_passport_expiry_date,
              tenantCountryOfIssuance: item.custom_country_of_issuance,
              tenantEmiratesId: item.custom_emirates_id,
              tenantEmiratesIdExpiry: item.custom_emirates_id_expiry_date,
              tenantSignature: item.custom_signature_of_customer,
              ownerName: item.custom_name_of_owner,
              ownerType: item.custom_type_of_owner,
              ownerContact: item.custom_contact_number_of_owner,
              ownerEmiratesId: item.custom_emirates_idtrade_license,
              ownerCountry: item.custom_owner_country,
              ownerEmail: item.custom_owner_email,
              ownerMobile: item.custom_mobile_number,
              ownerImage: item.custom_image,
              ownerSignature: item.custom_signature_of_owner,

              leaseItems: mappedLeaseItems, // Store mapped lease items

              custom_duration: item.custom_duration,
              custom_day_rate:
                item.custom_day_rate ??
                parseFloat(item.custom_price__rent_annually / 365).toFixed(2),
              custom_termination_date: item.custom_termination_date,
              custom_serve_the_notice_period:
                item.custom_serve_the_notice_period,
              custom_overstay_check: item.custom_overstay_check,
            }));

            // Handle dropdowns
            if (item?.lease_customer)
              await handleDropDown("tenantName", item.lease_customer);
            if (item?.custom_name_of_owner)
              await handleDropDown("ownerName", item.custom_name_of_owner);
            if (item?.property) {
              await handleDropDown("propertyName", item.property);
            }

            setOwnerImgUrl(item.custom_image || "");
            setPropertyImgUrl(item?.propertyDoc || "");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchingBookedData();
  }, [location.state]);

  // just comment out to take reference for future.
  // useEffect(() => {
  //   const fetchingBookedData = async () => {
  //     if (location.state) {
  //       try {
  //         const res = await fetchTenancyContract(location.state);
  //         const item = res?.data?.data;
  //         console.log("tenancy contract item", item);

  //         if (item) {
  //           // Map lease items for nested fields
  //           const mappedLeaseItems = item.lease_item.map((lease) => ({
  //             chequeNo: lease.custom_cheque_no,
  //             chequeDate: lease.custom_cheque_date,
  //             cheque: lease.custom_name_on_the_cheque,
  //             status: lease.custom_status,
  //             duration: lease.custom_duration,
  //             comments: lease.custom_comments,
  //             approvalStatus: lease.custom_approval_status,
  //           }));

  //           const updatedValues = [
  //             {
  //               label: "Move In",
  //               checked: item.custom_move_in === 1,
  //               key: randomId(),
  //             },
  //             {
  //               label: "Move Out",
  //               checked: item.custom_move_out === 1,
  //               key: randomId(),
  //             },
  //             {
  //               label: "Payment Remainder",
  //               checked: item.custom_payment_remainder === 1,
  //               key: randomId(),
  //             },
  //             {
  //               label: "Birthday Message",
  //               checked: item.custom_birthday_message === 1,
  //               key: randomId(),
  //             },
  //             {
  //               label: "60 Days Renewal Notice",
  //               checked: item.custom_60_days_renewal_notice === 1,
  //               key: randomId(),
  //             },
  //             {
  //               label: "90 Days Renewal Notice",
  //               checked: item.custom_90_days_renewal_notice === 1,
  //               key: randomId(),
  //             },
  //           ];

  //           handlers.setState(updatedValues);

  //           setFormValues((prevData) => ({
  //             ...prevData,

  //             tenancyStatus: item?.lease_status,
  //             bankName: item.custom_bank_name,
  //             numberOfChecks: item?.custom_no_of__cheques,
  //             startDate: item.start_date,
  //             endDate: item.end_date,
  //             anualPriceRent: item.custom_price__rent_annually + "",
  //             sqFoot:
  //               item.custom_price__rent_annually / item.custom_price_sq_ft || 0,
  //             sqMeter:
  //               item.custom_price__rent_annually / item.custom_price_sq_m || 0,
  //             priceSqMeter: item.custom_price_sq_m,
  //             priceSqFt: item.custom_price_sq_ft,
  //             securityDepositeAmt: item.security_deposit,
  //             brokerageAmt: item.custom_brokerage_amount,
  //             notice_period: item.notice_period,
  //             custom_property_no: item.custom_property_no,
  //             custom_premises_no: item.custom_premises_no,
  //             custom_mode_of_payment: item.custom_mode_of_payment,
  //             propertyName: item.property,
  //             propertyType: item.custom_type,
  //             propertyLocation: item.custom_location__area,
  //             propertyRent: item.custom_rent_amount_to_pay,
  //             propertyUnits: item.custom_number_of_unit,
  //             propertyDoc: item.propertyDoc,
  //             tenantName: item.lease_customer,
  //             tenantContact: item.custom_contact_number,
  //             tenantEmail: item.custom_email,
  //             tenantCity: item.custom_city,
  //             tenantPassport: item.custom_passport_number,
  //             tenantPassportExpiry: item.custom_passport_expiry_date,
  //             tenantCountryOfIssuance: item.custom_country_of_issuance,
  //             tenantEmiratesId: item.custom_emirates_id,
  //             tenantEmiratesIdExpiry: item.custom_emirates_id_expiry_date,
  //             tenantSignature: item.custom_signature_of_customer,
  //             ownerName: item.custom_name_of_owner,
  //             ownerType: item.custom_type_of_owner,
  //             ownerContact: item.custom_contact_number_of_owner,
  //             ownerEmiratesId: item.custom_emirates_idtrade_license,
  //             ownerCountry: item.custom_owner_country,
  //             ownerEmail: item.custom_owner_email,
  //             ownerMobile: item.custom_mobile_number,
  //             ownerImage: item.custom_image,
  //             ownerSignature: item.custom_signature_of_owner,

  //             leaseItems: mappedLeaseItems, // Store mapped lease items
  //           }));

  //           // Handle dropdowns
  //           if (item?.lease_customer)
  //             await handleDropDown("tenantName", item.lease_customer);
  //           if (item?.custom_name_of_owner)
  //             await handleDropDown("ownerName", item.custom_name_of_owner);
  //           if (item?.property) {
  //             await handleDropDown("propertyName", item.property);
  //           }

  //           setOwnerImgUrl(item.custom_image || "");
  //           setPropertyImgUrl(item?.propertyDoc || "");
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };

  //   fetchingBookedData();
  // }, [location.state]);

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

  // comment out for reference
  // useEffect(() => {
  //   let chequeDate: any = [];
  //   chequeDate.push(formValues.chequeDate);
  //   if (formValues.numberOfChecks === "2") {
  //     let currentDate = new Date(formValues.chequeDate);

  //     let date = currentDate.setMonth(currentDate.getMonth() + 6);

  //     let dateMDY = `${new Date(date).getFullYear()}-${
  //       new Date(date).getMonth() + 1
  //     }-${new Date(date).getDate()}`;

  //     chequeDate.push(dateMDY);
  //   } else if (formValues.numberOfChecks === "3") {
  //     let currentDate = new Date(formValues.chequeDate);

  //     let date = currentDate.setMonth(currentDate.getMonth() + 4);
  //     let date1 = currentDate.setMonth(currentDate.getMonth() + 4);

  //     let dateMDY = `${new Date(date).getFullYear()}-${
  //       new Date(date).getMonth() + 1
  //     }-${new Date(date).getDate()}`;

  //     let dateMDY1 = `${new Date(date1).getFullYear()}-${
  //       new Date(date1).getMonth() + 1
  //     }-${new Date(date1).getDate()}`;

  //     chequeDate.push(dateMDY);
  //     chequeDate.push(dateMDY1);
  //   } else if (formValues.numberOfChecks === "6") {
  //     let currentDate = new Date(formValues.chequeDate);

  //     let date = currentDate.setMonth(currentDate.getMonth() + 2);
  //     let date1 = currentDate.setMonth(currentDate.getMonth() + 2);
  //     let date2 = currentDate.setMonth(currentDate.getMonth() + 2);
  //     let date3 = currentDate.setMonth(currentDate.getMonth() + 2);
  //     let date4 = currentDate.setMonth(currentDate.getMonth() + 2);

  //     let dateMDY = `${new Date(date).getFullYear()}-${
  //       new Date(date).getMonth() + 1
  //     }-${new Date(date).getDate()}`;

  //     let dateMDY1 = `${new Date(date1).getFullYear()}-${
  //       new Date(date1).getMonth() + 1
  //     }-${new Date(date1).getDate()}`;

  //     let dateMDY2 = `${new Date(date2).getFullYear()}-${
  //       new Date(date2).getMonth() + 1
  //     }-${new Date(date2).getDate()}`;

  //     let dateMDY3 = `${new Date(date3).getFullYear()}-${
  //       new Date(date3).getMonth() + 1
  //     }-${new Date(date3).getDate()}`;

  //     let dateMDY4 = `${new Date(date4).getFullYear()}-${
  //       new Date(date4).getMonth() + 1
  //     }-${new Date(date4).getDate()}`;

  //     chequeDate.push(dateMDY);
  //     chequeDate.push(dateMDY1);
  //     chequeDate.push(dateMDY2);
  //     chequeDate.push(dateMDY3);
  //     chequeDate.push(dateMDY4);
  //   }
  //   if (
  //     formValues?.numberOfChecks &&
  //     formValues?.anualPriceRent &&
  //     formValues?.bankName &&
  //     formValues?.chequeNo &&
  //     formValues?.chequeDate &&
  //     formValues?.leaseItems?.length > 0
  //   ) {

  //     setTableData(() => {
  //       const newData = [];

  //       // Populate table data from leaseItems

  // // if number of checks there then will set table data
  // if(formValues.numberOfChecks){
  //          for (let i = 0; i < +formValues.numberOfChecks; i++) {
  //         newData.push({
  //           rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
  //           chequeNumber: formValues.chequeNo.split(",")[i] ?? "",
  //           chequeDate: chequeDate[i],
  //           bankName: formValues.bankName,
  //           Sno: i+1,
  //           cheque: formValues.cheque,
  //           status: formValues.status,
  //           duration: formValues.duration,
  //           comments: formValues.comments,
  //           approvalStatus: formValues.approvalStatus,
  //         });
  //       }
  //      }
  //      else{
  //       formValues.leaseItems.forEach((lease, index) => {
  //         newData.push({
  //           rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
  //           chequeNumber: formValues.chequeNo.split(",")[index] ?? "",
  //           chequeDate: chequeDate[index] ?? lease.chequeDate,
  //           bankName: formValues.bankName,
  //           Sno: index + 1,
  //           cheque: lease.cheque,
  //           status: lease.status,
  //           duration: lease.duration,
  //           comments: lease.comments,
  //           approvalStatus: lease.approvalStatus,
  //         });
  //       });
  //      }

  //       return newData;
  //     });
  //   }
  // }, [
  //   formValues?.numberOfChecks,
  //   formValues?.anualPriceRent,
  //   formValues?.bankName,
  //   formValues?.chequeNo,
  //   formValues?.chequeDate,
  //   formValues?.leaseItems,
  // ]);

  // to manage payment details table
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
      formValues?.chequeDate &&
      formValues?.leaseItems?.length > 0
    ) {
      // setTableData((prevData) => {
      //   const newData = [];

      //   for (let i = 0; i < +formValues.numberOfChecks; i++) {
      //     newData.push({
      //       rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
      //       chequeNumber: formValues.chequeNo.split(",")[i] ?? "",
      //       chequeDate: chequeDate[i],
      //       bankName: formValues.bankName,
      //       Sno: i,
      //       cheque: formValues.cheque,
      //       status: formValues.status,
      //       duration: formValues.duration,
      //       comments: formValues.comments,
      //       approvalStatus: formValues.approvalStatus,
      //     });
      //   }
      //   return newData;
      // });

      setTableData(() => {
        const newData = [];

        // Populate table data from leaseItems
        formValues.leaseItems.forEach((lease, index) => {
          newData.push({
            rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
            chequeNumber: formValues.chequeNo.split(",")[index] ?? "",
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

        return newData;
      });
    }
  }, [
    formValues?.numberOfChecks,
    formValues?.anualPriceRent,
    formValues?.bankName,
    formValues?.chequeNo,
    formValues?.chequeDate,
    formValues?.leaseItems,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "sqFoot" && value) {
      let sqMeter = value * 0.092903;
      handleDropDown("sqMeter", value * 0.092903);
      handleDropDown("priceSqFt", formValues["anualPriceRent"] / value);
      handleDropDown("priceSqMeter", formValues["anualPriceRent"] / sqMeter);
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

  const updateInitialValues = (tenancyStatus) => {
    return initialValues.map((item) => ({
      ...item,
      checked: tenancyStatus !== "Draft",
    }));
  };

  const handleDropDown = async (name, item) => {
    if (name === "propertyName") {
      // Fetch property data based on the selected property

      const res = await fetchProperty(item);
      const propertyData = res?.data?.data;

      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          propertyName: propertyData?.name,
          propertyType: propertyData?.type,
          propertyLocation: propertyData?.custom_location,
          propertyRent: propertyData?.rent,
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

    if (name === "propertyUnits" && item != undefined) {
      const unit_List = await fetchUnit(item);
      const unit_List_Data = unit_List?.data?.data;
      if (unit_List_Data) {
        setFormValues((prevData) => ({
          ...prevData,
          sqFoot: unit_List_Data?.custom_square_ft_of_unit,
          sqMeter: unit_List_Data?.custom_square_m_of_unit,
          priceSqMeter: unit_List_Data?.custom_price_square_m,
          priceSqFt: unit_List_Data?.custom_price_square_ft,
          custom_premises_no: unit_List_Data?.custom_premise_no,
        }));
      }
    }

    if (name === "numberOfChecks") {
      setNumberOfChecks(item);
    }
    if (name === "tenancyStatus") {
      if (item === "Renewal") {
        setFormValues((prevData) => {
          console.log("startDate", prevData.startDate);
          console.log("endDate", prevData.endDate);
          const startDate = new Date(prevData.startDate);
          startDate.setFullYear(startDate.getFullYear() + 1);
          const endDate = new Date(prevData.endDate);
          endDate.setFullYear(endDate.getFullYear() + 1);

          return {
            ...prevData,
            startDate: startDate,
            endDate: endDate,
            numberOfChecks: "",
            bankName: "",
            chequeNo: "",
            chequeDate: "",
            anualPriceRent: 0,
          };
        });

        setTableData([]);
      }

      handlers.setState(updateInitialValues(item));
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
    try {
      if (formValues.tenancyStatus === "Move In") {
        const response = await updateProperty(
          { custom_status: "Occupied" },
          formValues.propertyUnits
        );
      } else if (formValues.tenancyStatus === "Move Out") {
        const response = await updateProperty(
          { custom_status: "Vacant" },
          formValues.propertyUnits
        );
      }

      const remindersMapping = {
        "Move In": "custom_move_in",
        "Move Out": "custom_move_out",
        "Payment Remainder": "custom_payment_remainder",
        "Birthday Message": "custom_birthday_message",
        "60 Days Renewal Notice": "custom_60_days_renewal_notice",
        "90 Days Renewal Notice": "custom_90_days_renewal_notice",
      };

      const reminderValues = values.reduce((acc, value) => {
        const fieldName = remindersMapping[value.label];
        if (fieldName) {
          acc[fieldName] = value.checked ? 1 : 0;
        }
        return acc;
      }, {});

      const payload = {
        ...formValues,
        ...reminderValues,
        lease_status: formValues.tenancyStatus,

        custom_duration: formValues.custom_duration,
        custom_day_rate: formValues.custom_day_rate,
        custom_termination_date: formatDateToYYMMDD(
          formValues.custom_termination_date
        ),
        custom_serve_the_notice_period:
          formValues.custom_serve_the_notice_period,
        custom_overstay_check: formValues.custom_overstay_check,

        //contract details
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
        custom_mode_of_payment: formValues.custom_mode_of_payment,

        // property details
        property: formValues.propertyName,
        custom_type: formValues.propertyType,
        custom_location__area: formValues.propertyLocation,
        custom_rent_amount_to_pay: formValues.propertyRent,
        custom_number_of_unit: formValues.propertyUnits?.name,
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

        // payment-details

        //payment details
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
                };
              })
            : [
                {
                  custom_comments: "",
                },
              ],
      };
      if (formValues.tenancyStatus === "Renewal") {
        const updateRes = await updateTanencyContract(location.state, {
          lease_status: "Renewal",
        }); //import from API
        const createRes = await createTanencyContract({
          ...payload,
          lease_status: "Active",
        }); //import from API
        if (updateRes && createRes) {
          navigate("/contracts");
        }
      } else {
        const res = await updateTanencyContract(location.state, {
          ...payload,
        }); //import from API

        if (res) {
          navigate("/contracts");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handlePaymentDetailsSubmit = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   try {
  //     console.log("API Data => ", formValues);
  //     const res = await updateTanencyContract(location.state, {
  //       ...formValues,
  //       lease_status: "Active",
  //       //payment details
  //       custom_no_of__cheques: formValues.numberOfChecks,
  //       custom_bank_name: formValues.bankName,
  //       custom_price__rent_annually: formValues.anualPriceRent,

  //       lease_item: tableData.map((item) => {
  //         return {
  //           lease_item: "Rent",
  //           frequency: "Monthly",
  //           currency_code: "AED",
  //           document_type: "Sales Invoice",
  //           parentfield: "lease_item",
  //           parenttype: "Lease",
  //           doctype: "Lease Item",
  //           custom_cheque_no: item.chequeNumber,
  //           custom_cheque_date: formatDateToYYMMDD(item.chequeDate),
  //           amount: item.rent,
  //           custom_annual_amount: formValues.anualPriceRent,
  //           custom_cheque_status:"active status",
  //           custom_duration:"duration",
  //           custom_comments:"comments",
  //           custom_approval_status:"approved",
  //           custom_rent_amount:"rent",
  //           custom_status:"active",
  //           custom_name_on_the_cheque:"name",
  //         };
  //       }),
  //     }); //import from API
  //     if (res) {
  //       navigate("/contracts");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  const inputStyles = {
    inputs: {
      border: "1px solid gray",
    },
  };

  console.log("table data == >", tableData);
  console.log("form values == >", formValues);

  return (
    <main>
      <div className="flex">
        <Sidebar />
        <div className={`flex-grow ml-80 my-5 px-2`}>
          <div className="my-5 px-2 ">
            <Header name="Tenancy Contracts" />
            <div className="flex">
              <p className="text-[#7C8DB5] mt-1.5 ml-1">
                {"Tenancy Contract > Add New"}
              </p>
            </div>
            <div>
              <div className="my-4 p-6 border border-[#E6EDFF] rounded-xl">
                {/* <div>
                  <PrimaryButton
                    title={
                      formValues?.tenancyStatus !== "Active"
                        ? "Add Payment Details"
                        : "Show Payment Details"
                    }
                    onClick={() => setPaymentDetailsModalOpen(true)}
                  />
                </div> */}
                <form className="relative" onSubmit={handleSubmit}>
                  <a
                    href={API_URL.Tenancy_contract_pdf + location.state}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-4 right-4 px-4 py-2 bg-blue-400 rounded-md text-white"
                  >
                    Export to PDF
                  </a>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                    <MantineSelect
                      label="Status"
                      placeholder="Status"
                      data={[
                        "Active",

                        "Draft",
                        "Extend",
                        "Renewal",
                        "Termination",
                      ]}
                      onChange={(value) =>
                        handleDropDown("tenancyStatus", value)
                      }
                      value={formValues.tenancyStatus}
                      // disabled={formValues.tenancyStatus === "Draft"}
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

                  {formValues.tenancyStatus === "Extend" && (
                    <div>
                      <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Extend
                        </span>
                        <span className="pb-1">Details</span>
                      </p>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                        {Extend_TenancyContractProperty.map(
                          ({ label, name, type, values }) =>
                            type === "text" || type === "number" ? (
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

                        <Input
                          disabled
                          label={"Prorata Rate"}
                          type={"text"}
                          value={
                            parseFloat(
                              formValues.custom_duration *
                                formValues.custom_day_rate
                            ).toFixed(2) || 0
                          }
                          borderd
                          bgLight
                        />
                      </div>
                    </div>
                  )}

                  {formValues.tenancyStatus === "Termination" && (
                    <div>
                      <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Termination
                        </span>
                        <span className="pb-1">Details</span>
                      </p>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                        {Termination_TenancyContractProperty.map(
                          ({ label, name, type, values }) =>
                            type === "text" || type === "number" ? (
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
                                onChange={(date) =>
                                  handleDateChange(name, date)
                                }
                                label={label}
                                placeholder="Select Date"
                                value={formValues[name]}
                              />
                            ) : type === "mantineSelect" ? (
                              <MantineSelect
                                label={label}
                                placeholder={label}
                                data={["Yes", "No"]}
                                value={
                                  formValues.custom_serve_the_notice_period ??
                                  ""
                                }
                                onChange={(value) => {
                                  handleDropDown(
                                    "custom_serve_the_notice_period",
                                    value
                                  );
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

                        {formValues.custom_serve_the_notice_period === "No" && (
                          <Input
                            disabled
                            label={"Penalty Amount"}
                            type={"text"}
                            value={parseFloat(
                              2 * (formValues?.anualPriceRent / 12)
                            ).toFixed(2)}
                            borderd
                            bgLight
                          />
                        )}
                      </div>
                    </div>
                  )}
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
                              data={propertyUnits.map((unit) => ({
                                value: unit.name,
                                label: unit.custom_unit_number,
                                unit,
                              }))}
                              value={formValues.propertyUnits?.name || ""}
                              onChange={(value) => {
                                const selectedUnit = propertyUnits.find(
                                  (unit) => unit.name === value
                                );
                                handleDropDown("propertyUnits", selectedUnit);
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
                            onChange={handlePropertyFileChange}
                          />
                        </div>
                      </div>
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
                        placeholder="Select Property"
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
                          <label>Image Attachment</label>
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
                        placeholder="Select Property"
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
                    </div>
                  </div>

                  {formValues.custom_mode_of_payment === "Cheque" &&
                    formValues.tenancyStatus === "Active" && (
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
                                  <Table.Th>Status</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {tableData?.map((item, i) => (
                                  <Table.Tr key={i}>
                                    <Table.Td>{item.Sno}</Table.Td>
                                    <Table.Td
                                      onClick={() => {
                                        setFormValues({
                                          ...formValues,
                                          chequeNumber: item.chequeNumber,
                                          bankName: item.bankName,
                                          rent: item.rent.toString(),
                                          chequeDate: item.chequeDate,
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
                                      {item.chequeNumber}
                                    </Table.Td>
                                    <Table.Td>
                                      {parseFloat(item.rent).toFixed(2)}
                                    </Table.Td>
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

                  <div className="max-w-[100px] mt-10">
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
                (type === "text") | (type === "number") ? (
                  <Input
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
                    value={formValues[name] || ""}
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

            <PrimaryButton
              onClick={() => {
                console.log("Original Table Data", tableData);
                const updatedTableData = tableData.map((item, index) =>
                  index === paymentDetailsModalOpen
                    ? {
                        ...item,
                        cheque: formValues.cheque || item.cheque,
                        status: formValues.status || item.status,
                        duration: formValues.duration || item.duration,
                        comments: formValues.comments || item.comments,
                        approvalStatus:
                          formValues.approvalStatus || item.approvalStatus,
                      }
                    : item
                );

                setTableData(updatedTableData);
                setPaymentDetailsModalOpen(null);

                console.log("Updated Table Data", updatedTableData);
              }}
              type="button"
              title="Edit"
            />
          </div>
          {/* <div className="pt-4">
            <PrimaryButton type="submit" title="Save Details" />
          </div> */}
        </form>
      </Modal>
    </main>
  );
};

export default EditTenancyContracts;
