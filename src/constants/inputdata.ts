import { Label } from "@radix-ui/react-select";

export const Add_Units = [
  {
    label: "Type",
    name: "type",
    type: "dropdown",
    values: ["Commercial", "Residential"],
    readonly: true,
  },
  // {
  //   label: "Parent Property Name",
  //   name: "parent_property",
  //   type: "text",
  // },
  { label: "Location / Area", name: "location", type: "text", readonly: true },
  { label: "City", name: "city", type: "text", readonly: true },
  { label: "Country", name: "country", type: "dropdown", readonly: true },
  {
    label: "Status",
    name: "custom_status",
    type: "dropdown",
    values: ["Vacant", "Legal", "Occupied", "Under Maintenance"],
    readonly: true,
  },
  { label: "Renting Price", name: "rent", type: "text" },
  { label: "Selling Price", name: "sellingPrice", type: "text" },
  { label: "Square ft of unit", name: "sqFoot", type: "text" },
  { label: "Square m of unit", name: "sqMeter", type: "text" },
  {
    label: "Rent Price/ Square m",
    name: "priceSqMeter",
    type: "text",
    readonly: true,
  },
  {
    label: "Rent Price/ Square ft",
    name: "priceSqFt",
    type: "text",
    readonly: true,
  },
  { label: "Unit Number", name: "custom_unit_number", type: "text" },
  { label: "No. of Rooms", name: "rooms", type: "text" },
  { label: "No. of Floors", name: "floors", type: "text" },
  { label: "No. of Bathrooms", name: "bathrooms", type: "text" },
  { label: "Balcony Available", name: "balcony", type: "text" },
  { label: "View", name: "view", type: "text" },
  { label: "Premises Number", name: "premises", type: "text" },
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
  { label: "Country", name: "custom_country", type: "dropdown" },
  {
    label: "Status",
    name: "custom_status",
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
  // { label: "Price / Rent", name: "rent", type: "text" },
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
  { label: "Country", name: "country", type: "dropdown" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "date" },
  { label: "Birth Date", name: "custom_date_of_birth", type: "date" },
  { label: "Visa Start Date", name: "custom_visa_start_date", type: "date" },
  { label: "Visa End Date", name: "custom_visa_end_date", type: "date" },
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
  { label: "Country", name: "country", type: "dropdown" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "date" },
  { label: "Birth Date", name: "custom_date_of_birth", type: "date" },
  { label: "Visa Start Date", name: "custom_visa_start_date", type: "date" },
  { label: "Visa End Date", name: "custom_visa_end_date", type: "date" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID Exipry Date",
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
    values: ["Client", "Channel Partner", "Consultant"],
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
    values: ["Open", "Converted To Booking", "Junk", "Closed"],
  },
];

export const Add_BookReserve = [
  { label: "Select a Lead", name: "selectALead", type: "matineSelect" },
  { label: "Name Of Property", name: "name1", type: "matineSelect" },
  { label: "Location / Area", name: "location", type: "text" },
  { label: "Unit Number", name: "unitCount", type: "matineSelect" },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "dropdown" },
  {
    label: "Status",
    name: "status",
    type: "dropdown",
    values: ["Open", "Converted To Contract", "Cancelled"],
  },
  { label: "Date of booking", name: "bookingDate", type: "date" },
  { label: "Name of Customer", name: "tenantName", type: "matineSelect" },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  {
    label: "Type Of Customer",
    name: "type",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  { label: "Email", name: "email", type: "text" },
  { label: "Booking Start Date", name: "startDate", type: "date" },
  { label: "Booking End Date", name: "endDate", type: "date" },
  { label: "Rent Amount to Pay", name: "payAmount", type: "text" },
  { label: "Booking Amount", name: "bookingAmount", type: "text" },
  { label: "Name of Owner", name: "ownerName", type: "matineSelect" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
];

export const payment_details = [
  {
    label: "No Of Cheques",
    name: "numberOfChecks",
    type: "mantineSelect",
    values: ["1", "2", "3", "6"],
  },
  {
    label: "Bank Name",
    name: "bankName",
    type: "text",
  },

  {
    label: "Cheque Date",
    name: "chequeDate",
    type: "date",
  },
  { label: "Price / Rent Annually", name: "anualPriceRent", type: "text" },
];

export const cheque_number_form_details = [
  {
    label: "Beneficiary Name",
    name: "cheque",
    type: "text",
    required: true,
  },
  {
    label: "Cheque Number",
    name: "chequeNumber",
    type: "number",
    required: true,
  },
  {
    label: "Cheque Date",
    name: "dateOfCheque",
    type: "date",
    required: true,
  },
  {
    label: "Status",
    name: "status",
    type: "mantineSelect",
    values: ["Clear", "Hold"],
    required: true,
  },
  {
    label: "Duration",
    name: "duration",
    type: "number",
    required: true,
  },
  {
    label: "Comments",
    name: "comments",
    type: "text-area",
  },
  {
    label: "Approval Status",
    name: "approvalStatus",
    type: "mantineSelect",
    values: ["Approved", "Not Approved"],
  },
];

export const Add_Contract_Details = [
  { label: "Start Date", name: "startDate", type: "date", required: true },
  { label: "End Date", name: "endDate", type: "date", required: true },
  {
    label: "Security Deposit Amount",
    name: "securityDepositeAmt",
    type: "text",
    required: true,
  },
  {
    label: "Brokerage Amount",
    name: "brokerageAmt",
    type: "text",
    required: true,
  },
  {
    label: "Notice Period",
    name: "notice_period",
    type: "text",
    required: true,
  },
  // { label: "Property no", name: "custom_property_no", type: "text" },
  // {
  //   label: "Mode of Payment",
  //   name: "custom_mode_of_payment",
  //   type: "text",
  //   values: ["Cash", "Cheque"],
  // },
];

export const Add_TenancyContractProperty = [
  // {
  //   label: "Type",
  //   name: "propertyType",
  //   type: "dropdown",
  //   values: ["Commercial", "Residential"],
  // },
  {
    label: "Unit Number",
    name: "propertyUnits",
    type: "mantineSelect",
    required: true,
  },
  // { label: "Location / Area", name: "propertyLocation", type: "text" },
  {
    label: "Rent Amount to Pay",
    name: "propertyRent",
    type: "text",
    required: true,
  },
  // { label: "Square ft of unit", name: "sqFoot", type: "text" },
  // { label: "Square m of unit", name: "sqMeter", type: "text" },
  // { label: "Price/ Square m", name: "priceSqMeter", type: "text" },
  // { label: "Price/ Square ft", name: "priceSqFt", type: "text" },
  // { label: "Premises no", name: "custom_premises_no", type: "text" },
];

export const Add_TenancyContractTenant = [
  {
    label: "Customer Type",
    name: "tenantType",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  { label: "Contact Number", name: "tenantContact", type: "text" },
  { label: "Email", name: "tenantEmail", type: "text" },

  // { label: "Signature of Customer", name: "tenantSignature", type: "text" },
];

export const Add_TenancyContractOwner = [
  {
    label: "Owner Type",
    name: "ownerType",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Email", name: "ownerEmail", type: "text" },
  // { label: "Signature of Owner", name: "ownerSign", type: "text" },
];

export const Tenant_Type_Individual = [
  { label: "Name of Owner", name: "tenantOwnerName", type: "text" },
  { label: "Passport Number", name: "tenantPassportNum", type: "text" },
  {
    label: "Passport Expiry Date",
    name: "tenantPassportExpiryDate",
    type: "date",
  },
  {
    label: "Country Of Issuance",
    name: "tenantCountryOfIssuance",
    type: "text",
  },
  { label: "Emirates ID", name: "tenantEmiratesId", type: "text" },
  {
    label: "Emirates ID Expiry Date",
    name: "tenantEmiratesIdExpiryDate",
    type: "date",
  },
];

export const Tenant_Type_Company = [
  { label: "Name of the company", name: "tenantCompanyName", type: "text" },
  {
    label: "Trade license number",
    name: "tenantTradeLicenseNumner",
    type: "text",
  },
  { label: "Emirate", name: "tenantEmirate", type: "text" },
  {
    label: "Trade license expiry date",
    name: "tenantTradeLicenseExpiryDate",
    type: "date",
  },
  {
    label: "Power Of Attorney Holder Name",
    name: "tenantPoaHolder",
    type: "text",
  },
];

export const Owner_Type_Individual = [
  { label: "Name of Owner", name: "ownerName", type: "text" },

  // { label: "Passport Number", name: "ownerPassportNum", type: "text" },
  // {
  //   label: "Passport Expiry Date",
  //   name: "ownerPassportExpiryDate",
  //   type: "date",
  // },
  // {
  //   label: "Country Of Issuance",
  //   name: "ownerCountryOfIssuance",
  //   type: "text",
  // },
  // { label: "Emirates ID", name: "ownerEmiratesId", type: "text" },
  // {
  //   label: "Emirates ID Expiry Date",
  //   name: "ownerEmiratesIdExpiryDate",
  //   type: "date",
  // },
];

export const Owner_Type_Company = [
  { label: "Name of the company", name: "ownerCompanyName", type: "text" },
  {
    label: "Trade license number",
    name: "ownerTradeLicenseNumner",
    type: "text",
  },
  { label: "Emirate", name: "ownerEmirate", type: "text" },
  {
    label: "Trade license expiry date",
    name: "ownerTradeLicenseExpiryDate",
    type: "date",
  },
  {
    label: "Power Of Attorney Holder Name",
    name: "ownerPoaHolder",
    type: "text",
  },
];

export const Extend_TenancyContractProperty = [
  { label: "Duration", name: "custom_duration", type: "number" },
  { label: "Day Rate", name: "custom_day_rate", type: "number" },
];

export const Termination_TenancyContractProperty = [
  { label: "Termination Date", name: "custom_termination_date", type: "date" },
  {
    label: "Serve the notice period",
    name: "custom_serve_the_notice_period",
    type: "mantineSelect",
  },

  { label: "Overstay Check", name: "custom_overstay_check", type: "number" },
  { label: "Penalty Amount", name: "custom_penalty_amount", type: "number" },
];

export const Renewal_TenancyContractProperty = [
  // { label: "Number of days", name: "number_of_days", type: "number" },
  {
    label: "Renewal Duration",
    name: "renewal_duration",
    type: "mantineSelect",
  },
  {
    label: "Rental Increase",
    name: "rental_increase",
    type: "mantineSelect",
  },
];
