import { Label } from "@radix-ui/react-select";

export const Add_Units = [
  {
    label: "Type",
    name: "type",
    type: "dropdown",
    values: ["Commercial", "Residential"],
  },
  // {
  //   label: "Parent Property Name",
  //   name: "parent_property",
  //   type: "text",
  // },
  { label: "Location / Area", name: "location", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "State", name: "state", type: "text" },
  { label: "Country", name: "country", type: "text" },
  {
    label: "Status",
    name: "custom_status",
    type: "dropdown",
    values: ["Vacant", "Legal", "Occupied", "Under Maintenance"],
  },
  { label: "Renting Price", name: "rent", type: "text" },
  { label: "Selling Price", name: "sellingPrice", type: "text" },
  { label: "Square ft of unit", name: "sqFoot", type: "text" },
  { label: "Square m of unit", name: "sqMeter", type: "text" },
  { label: "Rent Price/ Square m", name: "priceSqMeter", type: "text" },
  { label: "Rent Price/ Square ft", name: "priceSqFt", type: "text" },
  { label: "Unit Number", name: "unitNumber", type: "text" },
  { label: "No. of Rooms", name: "rooms", type: "text" },
  { label: "No. of Floors", name: "floors", type: "text" },
  { label: "No. of Bathrooms", name: "bathrooms", type: "text" },
  { label: "Balcony Available", name: "balcony", type: "text" },
  { label: "View", name: "view", type: "text" },
  // { label: "Name of Owner", name: "ownerName", type: "text" },
];

export const Add_Property = [
  {
    label: "Type",
    name: "type",
    type: "dropdown",
    values: ["Commercial", "Residential"],
  },
  { label: "Name Of Property", name: "name1", type: "text" },
  { label: "Location", name: "custom_location", type: "text" },
  { label: "No. of Units", name: "custom_number_of_units", type: "text" },
  { label: "Community Name", name: "custom_community_name", type: "text" },
  { label: "Area", name: "custom_area", type: "text" },
  { label: "City", name: "custom_city", type: "text" },
  { label: "Country", name: "custom_country", type: "text" },
  {
    label: "Status",
    name: "status",
    type: "dropdown",
    values: ["Vacant", "Legal", "Occupied", "Under Maintenance"],
    // values: [
    //   "Available",
    //   "Booked",
    //   "Common Area (Not for lease)",
    //   "Managed for Customer",
    //   "Off Lease in 3 Months",
    //   "On Lease",
    //   "On Sale",
    //   "Removed",
    //   "Renewal",
    //   "Sold",
    //   "Vacating",
    // ],
  },
  { label: "Amenities", name: "custom_amenities", type: "text" },
  { label: "Price / Rent", name: "rent", type: "text" },
  { label: "Description", name: "description", type: "textArea" },
];

export const Add_Tenant = [
  {
    label: "Type of Customer",
    name: "ownerType",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  {
    label: "Contact Number of Customer",
    name: "customerContact",
    type: "text",
  },
  { label: "Email", name: "email", type: "text" },
  // { label: "Name of Customer", name: "tenantName", type: "text" },
  // { label: "Contact Number", name: "contact", type: "text" },
  // { label: "Nationality", name: "nationality", type: "text" },
  // {
  //   label: "Type",
  //   name: "type",
  //   type: "dropdown",
  //   values: ["Individual", "Company"],
  // },
  // {
  //   label: "Gender",
  //   name: "gender",
  //   type: "dropdown",
  //   values: ["Male", "Female"],
  // },
  // { label: "DOB", name: "dob", type: "date" },
  // { label: "Email", name: "email", type: "text" },
  // { label: "Passport Number", name: "passportNum", type: "text" },
  // { label: "Passport Expiry Date", name: "passportExpiryDate", type: "date" },
  // { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  // { label: "Emirates ID", name: "emiratesId", type: "text" },
  // {
  //   label: "Emirates ID Expiry Date",
  //   name: "emiratesIdExpiryDate",
  //   type: "date",
  // },
];

export const Type_Individual_Tenant = [
  { label: "Name of Customer", name: "ownerName", type: "text" },
  {
    label: "Gender",
    name: "gender",
    type: "dropdown",
    values: ["Male", "Female"],
  },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "date" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID Expiry Date",
    name: "emiratesIdExpiryDate",
    type: "date",
  },
];

export const Add_Owner = [
  {
    label: "Type of Owner",
    name: "ownerType",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Number Of Property", name: "propertyCount", type: "text" },
  { label: "Number of Units", name: "units", type: "text" },
  { label: "Location / Area", name: "location", type: "text" },
];

export const Type_Individual = [
  { label: "Name of Owner", name: "ownerName", type: "text" },
  {
    label: "Gender",
    name: "gender",
    type: "dropdown",
    values: ["Male", "Female"],
  },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "date" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID",
    name: "emiratesIdExpiryDate",
    type: "date",
  },
];

export const Type_Company = [
  { label: "Name of the company", name: "companyName", type: "text" },
  { label: "Trade license number", name: "tradeLicenseNumner", type: "text" },
  { label: "Emirate", name: "emirate", type: "text" },
  { label: "Trade license expiry date", name: "tradeLicense", type: "date" },
  { label: "Power Of Attorney Holder Name", name: "poaHolder", type: "text" },
];

export const Add_Lead = [
  { label: "Name of Lead", name: "leadName", type: "text" },
  {
    label: "Lead Type",
    name: "leadType",
    type: "dropdown",
    values: ["Commercial", "Residential"],
  },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Tentative Lease In Date", name: "leaseInDate", type: "date" },
  { label: "Budget Range", name: "budgetRange", type: "text" },
  { label: "Property Preference", name: "propertyPreference", type: "text" },
  { label: "Area Preference", name: "areaPreference", type: "text" },
  { label: "Community Preference", name: "communityPreference", type: "text" },
  { label: "Bedroom Preference", name: "bedroomPreference", type: "text" },
  {
    label: "Lead Status",
    name: "leadStatus",
    type: "dropdown",
    values: ["Open", "Converted To Booking", "Dropped", "Junk Lead"],
  },
];

export const Add_BookReserve = [
  { label: "Select a Lead", name: "selectALead", type: "text" },
  { label: "Name Of Property", name: "name1", type: "text" },
  { label: "Location / Area", name: "location", type: "text" },
  { label: "Unit Number", name: "unitCount", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  {
    label: "Status",
    name: "status",
    type: "dropdown",
    values: ["Open", "Converted To Contract", "Cancelled"],
  },
  { label: "Date of booking", name: "bookingDate", type: "date" },
  { label: "Name of Customer", name: "tenantName", type: "text" },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Type", name: "type", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Booking Start Date", name: "startDate", type: "date" },
  { label: "Booking End Date", name: "endDate", type: "date" },
  { label: "Rent Amount to Pay", name: "payAmount", type: "text" },
  { label: "Booking Amount", name: "bookingAmount", type: "text" },
  // { label: "Name of Owner", name: "ownerName", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
];

export const Add_Contract_Details = [
  {
    label: "No Of Cheques",
    name: "numberOfChecks",
    type: "dropdown",
    values: ["1", "2", "3", "6"],
  },
  {
    label: "Bank Name",
    name: "bankName",
    type: "text",
  },
  {
    label: "Cheque No",
    name: "chequeNo",
    type: "text",
  },
  {
    label: "Cheque Date",
    name: "chequeDate",
    type: "date",
  },
  { label: "Start Date", name: "startDate", type: "date" },
  { label: "End Date", name: "endDate", type: "date" },
  { label: "Price / Rent Annually", name: "anualPriceRent", type: "text" },
  { label: "Square ft of unit", name: "sqFoot", type: "text" },
  { label: "Square m of unit", name: "sqMeter", type: "text" },
  { label: "Price/ Square m", name: "priceSqMeter", type: "text" },
  { label: "Price/ Square ft", name: "priceSqFt", type: "text" },
  {
    label: "Security Deposit Amount",
    name: "securityDepositeAmt",
    type: "text",
  },
  { label: "Brokerage Amount", name: "brokerageAmt", type: "text" },
  { label: "Notice Period", name: "notice_period", type: "text" },
];

export const Add_TenancyContractProperty = [
  {
    label: "Type",
    name: "propertyType",
    type: "dropdown",
    values: ["Commercial", "Residential"],
  },
  { label: "Location / Area", name: "propertyLocation", type: "text" },
  { label: "Rent Amount to Pay", name: "propertyRent", type: "text" },
  { label: "Unit Number", name: "propertyUnits", type: "text" },
];

export const Add_TenancyContractTenant = [
  { label: "Contact Number", name: "tenantContact", type: "text" },
  { label: "Email", name: "tenantEmail", type: "text" },
  { label: "City", name: "tenantCity", type: "text" },
  { label: "Passport Number", name: "tenantPassport", type: "text" },
  { label: "Passport Expiry Date", name: "tenantPassportExpiry", type: "date" },
  {
    label: "Country Of Issuance",
    name: "tenantCountryOfIssuence",
    type: "text",
  },
  { label: "Emirates ID", name: "tenantEmiratesId", type: "text" },
  {
    label: "Emirates ID Expiry Date",
    name: "tenantEmiratesIdExpiry",
    type: "date",
  },
  // { label: "Signature of Customer", name: "tenantSignature", type: "text" },
];

export const Add_TenancyContractOwner = [
  { label: "Type Of Owner", name: "ownerType", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Emirates ID/Trade License", name: "ownerEmiratesId", type: "text" },
  { label: "Country", name: "ownerCountry", type: "text" },
  { label: "Email", name: "ownerEmail", type: "text" },
  { label: "Mobile Number", name: "ownerMobile", type: "text" },
  { label: "Emirates ID/License Expiry Date", name: "ownerEmiratesIdExpiry", type: "text" },
  // { label: "Signature of Owner", name: "ownerSign", type: "text" },
];
