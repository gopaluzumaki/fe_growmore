import { Label } from "@radix-ui/react-select";

export const Add_Units = [
  { label: "Location / Area", name: "location", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "State", name: "state", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Status", name: "status", type: "text" },
  { label: "Renting Price", name: "rentPrice", type: "text" },
  { label: "Selling Price", name: "rentPrice", type: "text" },
  { label: "Square ft of unit", name: "sqFoot", type: "text" },
  { label: "Square m of unit", name: "sqMeter", type: "text" },
  { label: "Price/ Square m", name: "priceSqMeter", type: "text" },
  { label: "Price/ Square ft", name: "priceSqFt", type: "text" },
  { label: "Unit Number", name: "rentPrice", type: "text" },
  { label: "No. of Rooms", name: "rooms", type: "text" },
  { label: "No. of Floors", name: "floors", type: "text" },
  { label: "No. of Bathrooms", name: "bathrooms", type: "text" },
  { label: "Balcony Available", name: "balcony", type: "text" },
  { label: "View", name: "view", type: "text" },
  { label: "Name of Owner", name: "ownerName", type: "text" },
  { label: "Name of Customer", name: "tenantName", type: "text" },
];

export const Add_Property = [
  { label: "Name Of Property", name: "propertyName", type: "text" },
  { label: "Type", name: "Type", type: "dropdown" },
  { label: "Location", name: "location", type: "text" },
  { label: "No. of Units", name: "units", type: "text" },
  { label: "Community Name", name: "Community Name", type: "text" },
  { label: "Area", name: "Area", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Status", name: "status", type: "text" },
  { label: "Amenities", name: "amenities", type: "text" },
  { label: "Price / Rent", name: "rentPrice", type: "text" },
];

export const Add_Tenant = [
  { label: "Name of Customer", name: "tenantName", type: "text" },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  {
    label: "Type",
    name: "type",
    type: "dropdown",
    values: ["Individual", "Company"],
  },
  {
    label: "Gender",
    name: "gender",
    type: "dropdown",
    values: ["Male", "Female"],
  },
  { label: "DOB", name: "dob", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "text" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID Expiry Date",
    name: "emiratesIdExpiryDate",
    type: "text",
  },
];

export const Add_Owner = [
  { label: "Name of Owner", name: "ownerName", type: "text" },
  { label: "Type of Owner", name: "ownerType", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Number Of Property", name: "propertyCount", type: "text" },
  { label: "Number of Units", name: "units", type: "text" },
  { label: "Location / Area", name: "location", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "text" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID/Trade License", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID/License Expiry Date",
    name: "emiratesIdExpiryDate",
    type: "text",
  },
];

export const Add_Lead = [
  { label: "Name of Lead", name: "leadName", type: "text" },
  { label: "Lead Type", name: "leadType", type: "text" },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Type", name: "type", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Tentative Lease In Date", name: "leaseInDate", type: "text" },
  { label: "Budget Range", name: "budgetRange", type: "text" },
  { label: "Name of Owner", name: "ownerName", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Property Preference", name: "propertyPreference", type: "text" },
  { label: "Area Preference", name: "budgetRange", type: "text" },
  { label: "Community Preference", name: "budgetRange", type: "text" },
  { label: "Bedroom Preference", name: "budgetRange", type: "text" },
  { label: "Lead Status", name: "leadStatus", type: "text" },
];

export const Add_BookReserve = [
  { label: "Select a Lead", name: "selectALead", type: "text" },
  { label: "Name Of Property", name: "propertyName", type: "text" },
  { label: "Location / Area", name: "location", type: "text" },
  { label: "Unit Number", name: "unitCount", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Status", name: "status", type: "text" },
  { label: "Date of booking", name: "bookingDate", type: "text" },
  { label: "Name of Customer", name: "tenantName", type: "text" },
  { label: "Contact Number", name: "contact", type: "text" },
  { label: "Nationality", name: "nationality", type: "text" },
  { label: "Type", name: "type", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Booking Start Date", name: "startDate", type: "text" },
  { label: "Booking End Date", name: "endDate", type: "text" },
  { label: "No. of Cheques", name: "chequesCount", type: "text" },
  { label: "Rent Amount to Pay", name: "payAmount", type: "text" },
  { label: "Booking Amount", name: "bookingAmount", type: "text" },
  { label: "Name of Owner", name: "ownerName", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
];

export const Add_Contract_Details = [
  { label: "Lease In Date", name: "leaseInDate", type: "text" },
  { label: "Lease Out Date", name: "leaseOutDate", type: "text" },
  { label: "Price / Rent Annually", name: "anualPriceRent", type: "text" },
  {
    label: "Security Deposit Amount",
    name: "securityDepositAmt",
    type: "text",
  },
  { label: "Brokerage Amount", name: "brokerageAmt", type: "text" },
];

export const Add_TenancyContractProperty = [
  { label: "Location / Area", name: "location", type: "text" },
  { label: "Rent Amount to Pay", name: "payAmount", type: "text" },
  { label: "Number of Unit", name: "unitCount", type: "text" },
  { label: "Status", name: "status", type: "text" },
  { label: "Image Attachment", name: "doc", type: "text" },
];

export const Add_TenancyContractTenant = [
  { label: "Name of Customer", name: "tenantName", type: "text" },
  { label: "Contact Number", name: "tenantContact", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "City", name: "city", type: "text" },
  { label: "Passport Number", name: "passportNum", type: "text" },
  { label: "Passport Expiry Date", name: "passportExpiryDate", type: "text" },
  { label: "Country Of Issuance", name: "countryOfIssuance", type: "text" },
  { label: "Emirates ID", name: "emiratesId", type: "text" },
  {
    label: "Emirates ID Expiry Date",
    name: "emiratesIdExpiryDate",
    type: "text",
  },
  { label: "Signature of Customer", name: "signTenant", type: "text" },
];

export const Add_TenancyContractOwner = [
  { label: "Name Of Owner", name: "ownerName", type: "text" },
  { label: "Type Of Owner", name: "ownerType", type: "text" },
  { label: "Contact Number of Owner", name: "ownerContact", type: "text" },
  { label: "Emirates ID/Trade License", name: "emiratesId", type: "text" },
  { label: "Country", name: "country", type: "text" },
  { label: "Email", name: "email", type: "text" },
  { label: "Mobile Number", name: "mobileNumber", type: "text" },
  { label: "Image Attachment", name: "doc", type: "text" },
  { label: "Signature of Owner", name: "signOwner", type: "text" },
];
