import axios from "axios";
import { APP_AUTH } from "./constants/config";

export const API_URL = {
  Property_Count:
    "https://propms.erpnext.syscort.com/api/method/frappe.desk.reportview.get_count?doctype=Property&filters=[[%22is_group%22,%22=%22,1]]",
  Unit_Count:
    "https://propms.erpnext.syscort.com/api/method/frappe.desk.reportview.get_count?doctype=Property&filters=[[%22is_group%22,%22=%22,0]]",
  Tenant_Count:
    "https://propms.erpnext.syscort.com/api/method/frappe.desk.reportview.get_count?doctype=Lease&filters=[[%22Lease%22,%22lease_status%22,%22!=%22,%22Closed%22]]",
  Property_List: "https://propms.erpnext.syscort.com/api/method/property_grid",
  Unit_List:
    "https://propms.erpnext.syscort.com/api/resource/Property?filters=[[%22is_group%22,%22=%22,0]]&order_by=creation desc&fields=[%22name%20as%20name%22,%22custom_unit_number%20as%20unit_number%22,%22custom_location%20as%20location%22,%22custom_parent_property_name%20as%20property%22,%22unit_owner%22,%22custom_status%22,%22custom_thumbnail_image%20as%20image%22]",
  Tenant_List: "https://propms.erpnext.syscort.com/api/method/tenant_list",
  Owner_List: "https://propms.erpnext.syscort.com/api/method/owner_list",
  Lead_List:
    "https://propms.erpnext.syscort.com/api/resource/Lead?fields=[%22*%22]&order_by=creation desc",
  Booking_List:
    "https://propms.erpnext.syscort.com/api/resource/Property%20Booking?fields=[%22*%22]&order_by=creation desc",
  Tenancy_Contract:
    "https://propms.erpnext.syscort.com/api/method/tenancy_contract",
  Create_Property: "https://propms.erpnext.syscort.com/api/resource/Property",
  Create_Tenant: "https://propms.erpnext.syscort.com/api/resource/Customer",
  Create_Owner: "https://propms.erpnext.syscort.com/api/resource/Supplier",
  Create_Lead: "https://propms.erpnext.syscort.com/api/resource/Lead",
  Create_Booking:
    "https://propms.erpnext.syscort.com/api/resource/Property%20Booking",
  Create_Lease: "https://propms.erpnext.syscort.com/api/resource/Lease",
  Lease_list:
    "https://propms.erpnext.syscort.com/api/resource/Lease?fields=[%22name%22,%22lease_status%22,%22custom_number_of_unit%22,%22property%22,%22custom_name_of_owner%22,%22lease_customer%22,%22custom_location__area%22,%22start_date%22,%22end_date%22,%22custom_rent_amount_to_pay%22]&order_by=creation desc",
  Tenancy_contract_pdf:
    "http://propms.erpnext.syscort.com/api/method/frappe.utils.print_format.download_pdf?doctype=Lease&format=Tenancy+Contract&name=",
  MoveIn_List:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Move In"]]',
  MoveOut_List:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Move Out"]]',
  Maintenance_list:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Maintenance"]]',
  Legal_list:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Legal"]]',
  Tenant_Lease_List:
    'https://propms.erpnext.syscort.com/api/resource/Lease?filters=[["lease_status","=","Active"]]&fields=[%22property%22,%22name%22,%22custom_number_of_unit%22]',
  Create_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Delete_Maintenance:
    "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Update_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Damage_Location:
    "https://propms.erpnext.syscort.com/api/resource/Damage Location",
  Legal_Data: "https://propms.erpnext.syscort.com/api/resource/Legal Reason",
  Lease_Data: "https://propms.erpnext.syscort.com/api/resource/Lease",
  Lead_Data:
    'https://propms.erpnext.syscort.com/api/resource/Lead?fields=["creation"]',
  Fetch_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Profile_Data: "https://propms.erpnext.syscort.com/api/resource/User",
  Country_List: "https://propms.erpnext.syscort.com/api/resource/Country"
};

export const loginUser = async (credentials: { usr: string; pwd: string }) => {
  const response = await axios.post(
    "https://propms.erpnext.syscort.com/api/method/login",
    credentials,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  console.log("response => ", response);
  return response;
};

export const getPropertyCount = async () => {
  const response = await axios.get(API_URL.Property_Count, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getUnitCount = async () => {
  const response = await axios.get(API_URL.Unit_Count, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getTenantsFromAPI = async (params) => {
  const response = await axios.get(`${API_URL.Create_Tenant}${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getTenantCount = async () => {
  const response = await axios.get(API_URL.Tenant_Count, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getPropertyList = async () => {
  const response = await axios.get(API_URL.Property_List, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getPropertyListData = async () => {
  const response = await axios.get(`${API_URL.Create_Property}?fields=["*"]&order_by=creation desc`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getUnitList = async () => {
  const response = await axios.get(API_URL.Unit_List, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getTenantList = async () => {
  const response = await axios.get(`${API_URL.Create_Tenant}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getOwnerList = async () => {
  const response = await axios.get(`${API_URL.Owner_List}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getOwnerListData = async () => {
  const response = await axios.get(`${API_URL.Create_Owner}?fields=["*"]`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getLeadList = async () => {
  const response = await axios.get(API_URL.Lead_List, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getBookingList = async () => {
  const response = await axios.get(API_URL.Booking_List, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getTenancyContractList = async () => {
  const response = await axios.get(API_URL.Lease_list, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createProperty = async (propertyData: any) => {
  const response = await axios.post(API_URL.Create_Property, propertyData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchUnit = async (params: any) => {
  const response = await axios.get(
    `${API_URL.Create_Property}/${params.name}`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchUnitForTenancyContract = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Property}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchProperyForEdit = async (params: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/app/property/view/List?name1=${params}`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchProperty = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Property}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchUnitsfromProperty = async (params: any) => {
  const response = await axios.get(
    `${API_URL.Create_Property}?filters=[["parent_property","=","${params}"]]&fields=["*"]`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const updateProperty = async (propertyData: any, param: string) => {
  const response = await axios.put(
    `${API_URL.Create_Property}/${param}`,
    propertyData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const createTenant = async (tenantData: any) => {
  const response = await axios.post(API_URL.Create_Tenant, tenantData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createTanencyContract = async (tenancyContractData: any) => {
  const response = await axios.post(API_URL.Create_Lease, tenancyContractData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const updateTanencyContract = async (
  name: string,
  tenancyContractData: any
) => {
  const response = await axios.put(
    API_URL.Create_Lease + `/${name}`,
    tenancyContractData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const deleteTanencyContract = async (name: string) => {
  const response = await axios.delete(
    API_URL.Create_Lease + `/${name}`,

    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchTenant = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Tenant}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchTenancyContract = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Lease}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createOwner = async (ownerData: any) => {
  const response = await axios.post(API_URL.Create_Owner, ownerData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchOwner = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Owner}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createLead = async (leadData: any) => {
  const response = await axios.post(API_URL.Create_Lead, leadData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createBooking = async (bookingData: any) => {
  const response = await axios.post(API_URL.Create_Booking, bookingData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const updateBooking = async (name: string, bookingData: any) => {
  const response = await axios.put(
    API_URL.Create_Booking + `/${name}`,
    bookingData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "https://propms.erpnext.syscort.com/api/method/upload_file",
      formData,
      {
        auth: {
          username: APP_AUTH.USERNAME,
          password: APP_AUTH.PASSWORD,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const fetchBooking = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Booking}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const updateLead = async (name: string, LeadData: any) => {
  const response = await axios.put(API_URL.Create_Lead + `/${name}`, LeadData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};
export const updateTenant = async (name: string, TenantData: any) => {
  const response = await axios.put(
    API_URL.Create_Tenant + `/${name}`,
    TenantData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};
export const updateOwner = async (name: string, OwnerData: any) => {
  const response = await axios.put(
    API_URL.Create_Owner + `/${name}`,
    OwnerData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchLeads = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Lead}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getMoveInList = async () => {
  const response = await axios.get(
    `${API_URL.MoveIn_List}&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getMoveInListData = async (propertyName: any, unitName: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/api/resource/Maintenance?filters=[["custom_status","=","Move In"],["custom_property","=","${propertyName}"],["custom_unit_no","=","${unitName}"]]&fields=["*"]&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getMoveOutList = async () => {
  const response = await axios.get(
    `${API_URL.MoveOut_List}&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getMoveOutListData = async (propertyName: any, unitName: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/api/resource/Maintenance?filters=[["custom_status","=","Move Out"],["custom_property","=","${propertyName}"],["custom_unit_no","=","${unitName}"]]&fields=["*"]&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getMaintenanceList = async () => {
  const response = await axios.get(
    `${API_URL.Maintenance_list}&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getLegalList = async () => {
  const response = await axios.get(
    `${API_URL.Legal_list}&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getTenantLeaseList = async () => {
  const response = await axios.get(`${API_URL.Tenant_Lease_List}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createCase = async (caseData: any) => {
  const response = await axios.post(API_URL.Create_Case, caseData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteCase = async (params) => {
  const response = await axios.delete(
    `${API_URL.Delete_Maintenance}/${params}`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchMaintenance = async (params: any) => {
  const response = await axios.get(`${API_URL.Create_Case}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchDamageLocation = async () => {
  const response = await axios.get(`${API_URL.Damage_Location}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchLegalReason = async () => {
  const response = await axios.get(`${API_URL.Legal_Data}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const updateCase = async (caseData: any, param: string) => {
  const response = await axios.put(
    `${API_URL.Update_Case}/${param}`,
    caseData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const createDamageLocation = async (caseData: any) => {
  // {"custom_location":"hwii"}
  const response = await axios.post(API_URL.Damage_Location, caseData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const createLegalReason = async (caseData: any) => {
  const response = await axios.post(API_URL.Legal_Data, caseData, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchDataFromLease = async (propertyName: any, unitName: any) => {
  const response = await axios.get(
    `${API_URL.Lease_Data}?filters=[["lease_status","=","Active"],["property","=","${propertyName}"],["custom_number_of_unit","=","${unitName}"]]&fields=["*"]`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchLeadData = async () => {
  const response = await axios.get(`${API_URL.Lead_Data}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchTenancyData = async () => {
  const response = await axios.get(`${API_URL.Create_Lease}?fields=["*"]`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchCaseFromMaintenance = async (
  propertyName: any,
  unitName: any,
  customer: any
) => {
  const response = await axios.get(
    `${API_URL.Fetch_Case}?filters=[["custom_property","=","${propertyName}"],["custom_unit_no","=","${unitName}"],["custom_customer","=","${customer}"]]&fields=[%22custom_status%22,%22custom_property%22,%22custom_unit_no%22,%22custom_customer%22]&order_by=creation desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const fetchProfileData = async () => {
  const response = await axios.get(`${API_URL.Profile_Data}?fields=["*"]`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const updateProfile = async (profileData: any, param: string) => {
  const response = await axios.put(
    `${API_URL.Profile_Data}/${param}`,
    profileData,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const deletePropertyUnit = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Property}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteCustomer = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Tenant}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteLead = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Lead}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteProperty = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Property}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteOwner = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Owner}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const deleteBooking = async (params) => {
  const response = await axios.delete(`${API_URL.Create_Booking}/${params}`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const getCountryList = async () => {
  const response = await axios.get(`${API_URL.Country_List}?fields=["name"]&limit_page_length=[100]`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};