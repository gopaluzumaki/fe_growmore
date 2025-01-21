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
  payment_details,
  Owner_Type_Individual,
  Owner_Type_Company,
  Tenant_Type_Company,
  Tenant_Type_Individual,
  cheque_number_form_details,
  Extend_TenancyContractProperty,
  Termination_TenancyContractProperty,
  Renewal_TenancyContractProperty,
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
  fetchUnitForTenancyContract,
  getTenancyContractList,
  fetchCaseFromMaintenance,
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
import { formatDateToYYMMDD, formatDateToYYYYMMDD } from "../lib/utils";
import { useListState, randomId } from "@mantine/hooks";
import CustomFileUpload from "./ui/CustomFileUpload";
import RichTextEditorUI from "./ui/RichTextEditorUI";
import RichTextEditorUIArabic from "./ui/RichTextEditorUIArabic";

const initialValues = [
  { label: "Move In", checked: true, key: randomId() },
  { label: "Move Out", checked: true, key: randomId() },
  { label: "Payment Remainder", checked: true, key: randomId() },
  { label: "Birthday Message", checked: true, key: randomId() },
  { label: "90 Days Renewal Notice", checked: true, key: randomId() },
];

const EditTenancyContracts = () => {
  const navigate = useNavigate();
  const [leaseStatus, setLeaseStatus] = useState('');
  const [isReload, setIsReload] = useState(true);
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
  const [imgUrls, setImgUrls] = useState([]);
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [caseList, setCaseList] = useState([])
  const [additionalTerms, setAdditionalTerms] = useState()
  const [additionalTermsArabic, setAdditionalTermsArabic] = useState()


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

    number_of_days: "",

    custom_mode_of_payment: "Cheque",
  });
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);
  const [showSecurityDepositeAmt, setShowSecurityDepositeAmt] = useState(false);
  const [showBrokarageAmt, setShowBrokarageAmt] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [values, handlers] = useListState(initialValues);
  const [ownerDetails, setOwnerDetails] = useState();
  const [tenantDetails, setTenantDetails] = useState();
  const [isContractExtended, setIsContractExtended] = useState(0);
  const [richTextOpen, setRichTextOpen] = useState(true)
  // set start and end date in renewal details

  useEffect(() => {
    const fetchingBookedData = async () => {
      if (location.state) {
        try {
          const res = await fetchTenancyContract(location.state);
          const item = res?.data?.data;

          console.log("property items data: ", item);

          if (item) {
            setLeaseStatus(item.lease_status)
            setFormValues((prevData) => ({
              ...prevData,
              startDate: formValues.renewal_duration
                ? item?.end_date
                : item?.start_date,
              endDate: formValues.renewal_duration
                ? handleStartEndDate_AccToRenewal(item.end_date)
                : item?.end_date,
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
      setIsReload(false)
    };

    if (isReload) fetchingBookedData();

  }, [location.state, formValues.renewal_duration, formValues.number_of_days, isReload]);

  // calculation termination things.

  useEffect(() => {
    if (
      formValues.custom_overstay_check &&
      formValues.custom_serve_the_notice_period &&
      formValues.custom_termination_date
    ) {
      let extraPenalty = 0;
      const monthRate = formValues?.anualPriceRent / 12;
      const dayRate = formValues?.anualPriceRent / 365;
      const overStayCheckAmount = +formValues.custom_overstay_check * dayRate;
      if (formValues.custom_serve_the_notice_period === "No") {
        extraPenalty = 60 * dayRate;
      }
      let dayDifference = 0;
      tableData.forEach((item) => {
        if (
          new Date(item.chequeDate) <
          new Date(formValues.custom_termination_date)
        ) {
          const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
          // Calculate the difference in milliseconds
          const diffMs =
            new Date(formValues.custom_termination_date).getTime() -
            new Date(item.chequeDate).getTime();
          dayDifference = Math.round(diffMs / oneDay);
        }
      });

      console.log("dayDifference", dayDifference);
      console.log("dayRate", dayRate);
      console.log("overStayCheckAmount", overStayCheckAmount);
      console.log("formValues?.anualPriceRent", formValues?.anualPriceRent);

      const dayDifferenceAmount = dayDifference * dayRate;

      const penaltyAmount = parseFloat(
        overStayCheckAmount + dayDifferenceAmount + extraPenalty
      ).toFixed(2);
      setFormValues((prevData) => ({
        ...prevData,
        custom_penalty_amount: penaltyAmount,
      }));
    }
  }, [
    location.state,
    formValues.custom_overstay_check,
    formValues.custom_serve_the_notice_period,
    formValues.custom_termination_date,
  ]);

  // increase rent based on the percentage or fixed amount

  useEffect(() => {
    const fetchingBookedData = async () => {
      if (location.state) {
        try {
          const res = await fetchTenancyContract(location.state);
          const item = res?.data?.data;

          console.log("property items data: ", item);

          if (item) {
            if (formValues.tenancyStatus === "Renewal") {
              if (formValues.rental_increase === "Percentage") {
                setFormValues((prevData) => ({
                  ...prevData,
                  anualPriceRent:
                    Number(item?.custom_price__rent_annually) +
                    (Number(formValues.percentage) *
                      Number(item?.custom_price__rent_annually)) /
                    100,
                }));
              } else if (formValues.rental_increase === "Fixed Amount") {
                setFormValues((prevData) => ({
                  ...prevData,
                  anualPriceRent:
                    Number(item?.custom_price__rent_annually) +
                    Number(formValues.fixed_amount),
                }));
              }
            }
            setFormValues((prevData) => ({
              ...prevData,

              startDate: formValues.renewal_duration
                ? item?.end_date
                : item?.start_date,
              endDate: formValues.renewal_duration
                ? handleStartEndDate_AccToRenewal(item.end_date)
                : item?.end_date,
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchingBookedData();
  }, [formValues.percentage, formValues.fixed_amount]);

  // to prefilled formdata values.
  function getFileName(filePath) {
    // Use the split method to isolate the file name from the path
    const parts = filePath.split("/");
    return parts[parts.length - 1]; // Return the last part
  }

  useEffect(() => {
    console.log("location.state", location.state);
    const fetchingBookedData = async () => {
      if (location.state) {
        try {
          const res = await fetchTenancyContract(location.state);

          const item = res?.data?.data;
          const caseData = await fetchCaseFromMaintenance(
            item.property,
            item.custom_unit_name
          );
          const caseDataList = caseData?.data?.data?.map(
            (item) => item.custom_status
          );
          setCaseList(caseDataList);
          console.log("property items data: ", item);

          if (item) {
            // Map lease items for nested fields
            const mappedLeaseItems = item.lease_item.map((lease) => ({
              chequeNumber: lease.custom_cheque_no,
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
              // {
              //   label: "60 Days Renewal Notice",
              //   checked: item.custom_60_days_renewal_notice === 1,
              //   key: randomId(),
              // },
              {
                label: "90 Days Renewal Notice",
                checked: item.custom_90_days_renewal_notice === 1,
                key: randomId(),
              },
            ];

            handlers.setState(updatedValues);

            if (item.custom_is_extended === 1) {
              setIsContractExtended(1);
            }
            // Handle dropdowns
            if (item?.lease_customer)
              await handleDropDown("tenantName", item.lease_customer);
            if (item?.custom_name_of_owner)
              await handleDropDown("ownerName", item.custom_name_of_owner);
            if (item?.property) {
              await handleDropDown("propertyName1", item.property);
            }
            if (item?.custom_unit_name) {
              await handleDropDown("propertyUnits", item.custom_unit_name);
            }

            setFormValues((prevData) => ({
              ...prevData,
              chequeDate:
                mappedLeaseItems && mappedLeaseItems?.length > 0
                  ? mappedLeaseItems[0]?.chequeDate
                  : "",
              tenancyStatus: item?.lease_status,
              bankName: item.custom_bank_name,
              numberOfChecks: item?.custom_no_of__cheques,
              startDate: item?.start_date,
              endDate: item?.end_date,
              anualPriceRent: item.custom_price__rent_annually + "",

              securityDepositeAmt: item.security_deposit,
              brokerageAmt: item.custom_brokerage_amount,
              notice_period: item.notice_period,
              custom_property_no: item.custom_property_no,
              custom_premises_no: item.custom_premises_no,
              custom_mode_of_payment: item.custom_mode_of_payment,
              propertyName1: item.property,
              propertyName: item.custom_property_name,
              propertyType: item.custom_type,
              propertyLocation: item.custom_location__area,
              propertyRent: item.custom_rent_amount_to_pay,
              propertyUnits: item.custom_unit_name,
              custom_number_of_unit: item.custom_number_of_unit,
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
              custom_name_of_owner: item.custom_name_of_owner,
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
              custom_penalty_amount: item.custom_penalty_amount,
              custom_html: item.custom_html,
              custom_html_2: item.custom_html_2,
              //renewal details

              renewal_duration: item.custom_renewal_duration,

              number_of_days: item.custom_number_of_days,

              rental_increase: item?.custom_rental_increase,

              fixed_amount: item?.custom_fixed_amount,

              percentage: item?.custom_percentage,
            }));

            setOwnerImgUrl(item.custom_image || "");
            setPropertyImgUrl(item?.propertyDoc || "");
            setRichTextOpen(false)
          }
          if (item?.custom_attachment_table?.length > 0) {
            const imageArray = item?.custom_attachment_table?.map((item) => ({
              url: item.image,
              name: getFileName(item.image),
            }));

            setImageArray(imageArray);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchingBookedData();
  }, [location.state]);

  useEffect(() => {
    setImageArray((prevArray) => [...prevArray, ...imgUrls]);
  }, [imgUrls]);

  const handleRemoveImage = (index) => {
    const updatedImages = imageArray.filter((_, i) => i !== index);
    setImageArray(updatedImages); // Update state with the remaining images
  };

  function handleStartEndDate_AccToRenewal(date) {
    let new_date = new Date(date); // Convert to Date object

    if (formValues.renewal_duration === "1 week") {
      new_date.setDate(new_date.getDate() + 7);
    } else if (formValues.renewal_duration === "1 month") {
      new_date.setMonth(new_date.getMonth() + 1);
    } else if (formValues.renewal_duration === "2 months") {
      new_date.setMonth(new_date.getMonth() + 2);
    } else if (formValues.renewal_duration === "3 months") {
      new_date.setMonth(new_date.getMonth() + 3);
    } else if (formValues.renewal_duration === "6 months") {
      new_date.setMonth(new_date.getMonth() + 6);
    } else if (formValues.renewal_duration === "1 year") {
      new_date.setFullYear(new_date.getFullYear() + 1);
    } else if (formValues.renewal_duration === "2 years") {
      new_date.setFullYear(new_date.getFullYear() + 2);
    } else if (formValues.renewal_duration === "other") {
      if (formValues.number_of_days) {
        new_date.setDate(
          new_date.getDate() + parseInt(formValues.number_of_days)
        );
      }
    }

    const formattedDate = new_date.toISOString().split("T")[0];
    console.log("formatted date value : ", formattedDate);
    return formattedDate;
  }

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

      let dateMDY = `${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1
        }-${new Date(date).getDate()}`;

      chequeDate.push(formatDateToYYYYMMDD(dateMDY));
    } else if (formValues.numberOfChecks === "3") {
      let currentDate = new Date(formValues.chequeDate);

      let date = currentDate.setMonth(currentDate.getMonth() + 4);
      let date1 = currentDate.setMonth(currentDate.getMonth() + 4);

      let dateMDY = `${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1
        }-${new Date(date).getDate()}`;

      let dateMDY1 = `${new Date(date1).getFullYear()}-${new Date(date1).getMonth() + 1
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

      let dateMDY = `${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1
        }-${new Date(date).getDate()}`;

      let dateMDY1 = `${new Date(date1).getFullYear()}-${new Date(date1).getMonth() + 1
        }-${new Date(date1).getDate()}`;

      let dateMDY2 = `${new Date(date2).getFullYear()}-${new Date(date2).getMonth() + 1
        }-${new Date(date2).getDate()}`;

      let dateMDY3 = `${new Date(date3).getFullYear()}-${new Date(date3).getMonth() + 1
        }-${new Date(date3).getDate()}`;

      let dateMDY4 = `${new Date(date4).getFullYear()}-${new Date(date4).getMonth() + 1
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
          // formValues?.tenancyStatus !== "Renewal" &&
          formValues?.leaseItems?.length == formValues.numberOfChecks
        ) {
          formValues.leaseItems.forEach((lease, index) => {
            newData.push({
              rent: +formValues.anualPriceRent / +formValues.numberOfChecks,
              chequeNumber: lease.chequeNumber,
              chequeDate: formatDateToYYYYMMDD(
                chequeDate[index] ?? lease.chequeDate
              ),
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
              Sno: i + 1,
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
      setFormValues((prevData) => ({
        ...prevData,
        sqMeter: Number(formValues.sqFoot * 0.092903).toFixed(2),
        priceSqFt: Number(formValues.propertyRent / formValues.sqFoot).toFixed(
          2
        ),
        priceSqMeter: Number(formValues.propertyRent / sqMeter).toFixed(2),
      }));

      console.log("sqMeter", sqMeter);
      console.log("priceSqFt", formValues.priceSqFt);
      console.log("priceSqMeter", formValues.priceSqMeter);
    }
  }, [formValues.sqFoot, formValues.propertyRent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "percentage") {
      const numericValue = Math.max(0, Math.min(100, Number(value))); // Clamp value between 0 and 100
      setFormValues({ ...formValues, [name]: numericValue });
    } else if (name === "number_of_days") {
      const numericValue = Math.max(0, Number(value)); // Only enforce min value of 0
      setFormValues({ ...formValues, [name]: numericValue });
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
    console.log("tenancy status: ", tenancyStatus);
    return initialValues.map((item) => ({
      ...item,
      checked: tenancyStatus !== "Renewal",
    }));
  };

  const handleDropDown = async (name, item) => {

    if (name === 'rental_increase') {
      setFormValues((prevData) => ({
        ...prevData,
        percentage: 0,
        fixed_amount: 0,
        anualPriceRent: 0,
        [name]: item,
      }));
      return
    }

    console.log('aaaaa')

    if (name === "propertyName1") {
      // Fetch property data based on the selected property

      const res = await fetchProperty(item);
      const propertyData = res?.data?.data;

      if (propertyData) {
        // Fill all the fields with the fetched data
        setFormValues((prevData) => ({
          ...prevData,
          // id
          propertyName1: propertyData?.name,
          //name
          propertyName: propertyData?.name1,
          propertyUnits: null,
          propertyRent: "",
          propertyType: propertyData?.type,
          propertyLocation: propertyData?.custom_location,
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

    if (name === "propertyUnits" && item != undefined) {
      const unit_List = await fetchUnitForTenancyContract(item);
      const unit_List_Data = unit_List?.data?.data;
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

    if (name === "tenancyStatus") {
      if (item === "Renewal") {
        setFormValues((prevData) => {
          return {
            ...prevData,
            numberOfChecks: null,
            bankName: "",
            chequeDate: "",
            leaseItems: [],
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

    if (name === "endDate") {
      if (!formValues.startDate) {
        return toast.error("The start date cannot be in the empty.");
      }
      const start = new Date(formValues.startDate);
      const end = new Date(date);
      if (end <= start) {
        return toast.error("End date should be greater than the start date.");
      }
    }

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

  useEffect(() => {
    setFormValues((prevData) => ({
      ...prevData,
      "custom_html": additionalTerms,
    }));
  }, [additionalTerms])

  useEffect(() => {
    setFormValues((prevData) => ({
      ...prevData,
      "custom_html_2": additionalTermsArabic,
    }));
  }, [additionalTermsArabic])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageData = imageArray.map((imgUrl) => ({ image: imgUrl.url }));

    // const tenancyContractList = await getTenancyContractList();
    // const findOne = tenancyContractList?.data?.data.find(
    //   (item) => item.name === location.state && item.lease_status === "Active"
    // );
    // if (findOne && formValues.tenancyStatus === "Active") {
    //   alert("This tenancy contract is already active");
    //   return;
    // }
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

      const invalidPayments = tableData.filter((entry) => !entry.chequeNumber);
      if (!tableData.length || invalidPayments.length) {
        return toast.error("Add Payment Details")
      }

      const payload = {
        ...formValues,
        ...reminderValues,
        lease_status:
          formValues.tenancyStatus === "Extend"
            ? "Draft"
            : formValues.tenancyStatus,
        custom_attachment_table: imageData,
        custom_html: formValues?.custom_html,
        custom_html_2: formValues?.custom_html_2,
        //termination details
        custom_duration: formValues.custom_duration,
        custom_day_rate: formValues.custom_day_rate,
        custom_termination_date: formatDateToYYMMDD(
          formValues.custom_termination_date
        ),
        custom_serve_the_notice_period:
          formValues.custom_serve_the_notice_period,
        custom_overstay_check: formValues.custom_overstay_check,
        custom_penalty_amount: formValues.custom_penalty_amount,

        //contract details
        bank_name: formValues.bankName,
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
        // save unit id
        custom_unit_name: formValues.propertyUnits,
        custom_current_property: formValues.propertyUnits,
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
        custom_name_of_owner: ownerDetails.name,
        custom_type_of_owner: ownerDetails.supplier_type,
        custom_contact_number_of_owner: ownerDetails.custom_phone_number,
        custom_emirates_idtrade_license: formValues.ownerEmiratesId,
        custom_owner_country: formValues.ownerCountry,
        custom_owner_email: ownerDetails.custom_email,
        custom_mobile_number: formValues.ownerMobile,
        custom_image: ownerImgUrl,
        custom_signature_of_owner: formValues.ownerSign,

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
                custom_status: item.status ? item.status : "",
                custom_name_on_the_cheque: item.cheque,

                // set details for notification purpose
                custom_send_email: tenantDetails.custom_email,
                custom_lease_status:
                  formValues.tenancyStatus === "Extend"
                    ? "Draft"
                    : formValues.tenancyStatus,
                custom_customer_name: tenantDetails.name,
                custom__payment_remainder: values.find(
                  (item) => item.label === "Payment Remainder"
                ).checked
                  ? 1
                  : 0,
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
          // custom_attachment_table: imageData,
          // custom_html: formValues?.custom_html,
          // custom_html_2: formValues?.custom_html_2,
          //renewal details
          custom_renewal_duration: formValues.renewal_duration,
          custom_number_of_days: formValues.number_of_days,
          custom_rental_increase: formValues?.rental_increase,
          custom_fixed_amount: formValues?.fixed_amount,
          custom_percentage: formValues?.percentage,
        }); //import from API
        const createRes = await createTanencyContract({
          ...payload,
          lease_status: "Draft",
        }); //import from API
        if (updateRes && createRes) {
          navigate("/contracts");
        }
      } else if (formValues.tenancyStatus === "Extend") {
        const res = await updateTanencyContract(location.state, {
          ...payload,
          custom_is_extended: 1,
        }); //import from API

        if (res) {
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
  };

  const inputStyles = {
    inputs: {
      border: "1px solid gray",
    },
  };

  const username = APP_AUTH.USERNAME;
  const password = APP_AUTH.PASSWORD;
  const credentials = btoa(`${username}:${password}`);

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
                {caseList?.length > 0 && (
                  <div className="flex justify-center">
                    <span
                      className="bg-[red] p-2 rounded-xl"
                      style={{ color: "white" }}
                    >
                      This tenancy contract is under{" "}
                      {[...new Set(caseList)].join(", ")}
                    </span>
                  </div>
                )}

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
                  <div
                    className="absolute top-4 right-4 px-4 py-2 bg-blue-400 rounded-md text-white cursor-pointer"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `https://propms.erpnext.syscort.com/api/method/frappe.utils.print_format.download_pdf?doctype=Lease&format=Tenancy+Contract&name=` +
                          location.state,
                          {
                            method: "GET",
                            credentials: "include", // Ensures cookies for authenticated sessions are included
                            headers: {
                              Authorization: `Basic ${credentials}`, // Attach Basic Auth header
                            },
                          }
                        );

                        if (!response.ok) {
                          throw new Error("Failed to fetch PDF");
                        }

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${location.state}.pdf`; // Set the desired filename
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Error downloading PDF:", error);
                        alert("Failed to download PDF.");
                      }
                    }}
                  >
                    Export to PDF
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                    <div class="tooltip-container">
                      <MantineSelect
                        label="Status"
                        placeholder="Status"
                        data={leaseStatus === "Draft" ? [
                          "Active",
                          "Draft"
                        ] : [
                          "Active",
                          "Draft",
                          "Extend",
                          "Renewal",
                          "Termination",
                        ]}
                        disabled={leaseStatus === "Renewal" || leaseStatus === "Finished"}
                        value={formValues.tenancyStatus}
                        onChange={(value) => {
                          if (formValues.tenancyStatus === "Renewal") {
                            const confirmed = window.confirm(
                              `Are you sure to revert it?`
                            );
                            if (confirmed) {
                              setIsReload(true)
                              window.location.reload();
                              return
                            } else {
                              return handleDropDown("tenancyStatus", "Renewal")
                            }
                          }
                          handleDropDown("tenancyStatus", value)
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
                      />
                      {(leaseStatus === "Renewal" || leaseStatus === "Finished") && (
                        <div class="tooltip">Status updates are restricted as this tenancy contract has already been renewed.</div>
                      )}
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>

                  {(isContractExtended === 1 || formValues.tenancyStatus === "Extend") && (
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
                            ) >= 0
                              ? parseFloat(
                                formValues.custom_duration *
                                formValues.custom_day_rate
                              ).toFixed(2)
                              : 0
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

                        {/* {formValues.custom_serve_the_notice_period === "No" && (
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
                        )} */}
                      </div>
                    </div>
                  )}

                  {formValues.tenancyStatus === "Renewal" && (
                    <div>
                      <p className="flex gap-2 mt-8 mb-4 text-[18px] text-[#7C8DB5]">
                        <span className="pb-1 border-b border-[#7C8DB5]">
                          Renewal
                        </span>
                        <span className="pb-1">Details</span>
                      </p>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                        {Renewal_TenancyContractProperty.map(
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
                              name === "renewal_duration" ? (
                                <MantineSelect
                                  label={label}
                                  placeholder={label}
                                  data={[
                                    "1 week",
                                    "1 month",
                                    "2 months",
                                    "3 months",
                                    "6 months",
                                    "1 year",
                                    "2 years",
                                    "other",
                                  ]}
                                  value={formValues.renewal_duration ?? ""}
                                  onChange={(value) => {
                                    handleDropDown("renewal_duration", value);
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
                                <MantineSelect
                                  label={label}
                                  placeholder={label}
                                  data={["Percentage", "Fixed Amount"]}
                                  value={formValues.rental_increase ?? ""}
                                  onChange={(value) => {
                                    handleDropDown("rental_increase", value);
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
                              )
                            ) : (
                              <></>
                            )
                        )}
                      </div>
                      {formValues.renewal_duration === "other" ? (
                        <div>
                          <Input
                            label="Number of days"
                            name="number_of_days"
                            min={0}
                            type="number"
                            value={formValues.number_of_days}
                            onChange={handleChange}
                            borderd
                            bgLight
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {formValues.rental_increase ? (
                        formValues.rental_increase === "Percentage" ? (
                          <div>
                            <Input
                              label="Percentage"
                              name="percentage"
                              min={0}
                              max={100}
                              type="number"
                              value={formValues?.percentage}
                              onChange={handleChange}
                              borderd
                              bgLight
                            />
                            <Input
                              label="Price / Rent Annually"
                              name="anualPriceRent"
                              type="number"
                              value={formValues?.anualPriceRent}
                              onChange={handleChange}
                              borderd
                              bgLight
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div>
                            <Input
                              label="Fixed Amount"
                              name="fixed_amount"
                              type="number"
                              value={formValues?.fixed_amount}
                              onChange={handleChange}
                              borderd
                              bgLight
                            />
                            <Input
                              label="Price / Rent Annually"
                              name="anualPriceRent"
                              type="number"
                              value={formValues?.anualPriceRent}
                              onChange={handleChange}
                              borderd
                              bgLight
                              disabled={true}
                            />
                          </div>
                        )
                      ) : (
                        ""
                      )}
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
                        type="*"
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 gap-4">
                        {imageArray.map((value, index) => (
                          <div
                            key={index}
                            className="flex justify-space-between"
                          >
                            <a
                              href={`https://propms.erpnext.syscort.com/${value.url}`}
                              target="value"
                            >
                              {value.name}
                            </a>

                            <button
                              type="button" // Prevent form submission
                              className="top-0 right-0 bg-red-500 text-white w-9 h-4 p-2 ml-2 rounded-full flex items-center justify-center text-xs"
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
                  <div className="mt-5">
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
                        value={formValues.propertyName1}
                        onChange={(value) =>
                          handleDropDown("propertyName1", value)
                        }
                        disabled={!(formValues.tenancyStatus === "Draft" || formValues.tenancyStatus === "Active")}
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
                              disabled={!(formValues.tenancyStatus === "Draft" || formValues.tenancyStatus === "Active")}
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
                              value={formValues.propertyUnits || null}
                              onChange={(value) => {
                                handleDropDown("propertyUnits", value);
                              }}
                              disabled={!(formValues.tenancyStatus === "Draft" || formValues.tenancyStatus === "Active")}
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
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-6">
                      {/* <MantineSelect
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
                      /> */}
                      {/* {Add_TenancyContractOwner.map(
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
                      </div> */}
                    </div>
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
                        required
                        label="Customer Name"
                        placeholder="Select Property"
                        data={tenantList.map((value) => {
                          return value?.name;
                        })}
                        value={formValues.tenantName}
                        onChange={(value) =>
                          handleDropDown("tenantName", value)
                        }
                        disabled={!(formValues.tenancyStatus === "Draft" || formValues.tenancyStatus === "Active")}
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
                      {/* {Add_TenancyContractTenant.map(
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
                        )} */}
                    </div>
                    {tenantDetails ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mt-3 mb-1.5 ml-1 font-medium text-gray-700">
                          <label className="block">
                            Customer Name :{" "}
                            {tenantDetails && tenantDetails.customer_name}
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
                      <></>
                    )}
                  </div>

                  {/* payment details */}
                  {formValues.custom_mode_of_payment === "Cheque" && (
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
                                    disabled={(formValues.tenancyStatus === "Extend" || formValues.tenancyStatus === "Termination")}
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
                                  <Table.Td>{item.Sno}</Table.Td>
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
                                  <Table.Td>{item.status ? item.status : "-"}</Table.Td>
                                  <Table.Td>
                                    {item?.status ? (item?.approvalStatus ? item?.approvalStatus : "N/A") : "-"}
                                  </Table.Td>{" "}
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        )}
                      </form>
                    </section>
                  )}


                  {formValues.tenancyStatus !== "Extend" &&
                    formValues.tenancyStatus !== "Termination" &&
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



                  <div>
                    {richTextOpen ? <></> : <p className="mb-1.5 ml-1 font-medium text-gray-700">
                      Additional Terms (English)
                    </p>}
                    {richTextOpen ? <></> : <RichTextEditorUI content={formValues?.custom_html} setAdditionalTerms={setAdditionalTerms} />
                    }
                  </div>
                  <div>
                    {richTextOpen ? <></> : <p className="mb-1.5 ml-1 font-medium text-gray-700">
                      Additional Terms (Arabic)
                    </p>}
                    {richTextOpen ? <></> : <RichTextEditorUIArabic content={formValues?.custom_html_2} setAdditionalTermsArabic={setAdditionalTermsArabic} />
                    }
                  </div>


                  <div className="max-w-[100px] mt-10">
                    <PrimaryButton title="Save" disabled={leaseStatus === "Renewal" || leaseStatus === "Finished"} />
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
                        } else setFormValues({ ...formValues, [name]: value, duration: null });
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

            <PrimaryButton title="Edit" />
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
