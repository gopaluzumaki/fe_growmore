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
    "https://propms.erpnext.syscort.com/api/resource/Property?filters=[[%22is_group%22,%22=%22,0]]&order_by=modified desc&fields=[%22name%20as%20name%22,%22custom_unit_number%20as%20unit_number%22,%22custom_location%20as%20location%22,%22custom_parent_property_name%20as%20property%22,%22unit_owner%22,%22custom_status%22,%22custom_thumbnail_image%20as%20image%22,%22custom_supplier_name%22]",
  Tenant_List: "https://propms.erpnext.syscort.com/api/method/tenant_list",
  Owner_List: "https://propms.erpnext.syscort.com/api/method/owner_list",
  Lead_List:
    "https://propms.erpnext.syscort.com/api/resource/Lead?fields=[%22*%22]&order_by=modified desc",
  Booking_List:
    "https://propms.erpnext.syscort.com/api/resource/Property%20Booking?fields=[%22*%22]&order_by=modified desc",
  Tenancy_Contract:
    "https://propms.erpnext.syscort.com/api/method/tenancy_contract",
  Create_Property: "https://propms.erpnext.syscort.com/api/resource/Property",
  Create_Tenant: "https://propms.erpnext.syscort.com/api/resource/Customer",
  Create_Owner: "https://propms.erpnext.syscort.com/api/resource/Supplier",
  Create_Lead: "https://propms.erpnext.syscort.com/api/resource/Lead",
  Create_Booking:
    "https://propms.erpnext.syscort.com/api/resource/Property%20Booking",
  Create_Lease: "https://propms.erpnext.syscort.com/api/resource/Lease",
  Single_Lease:
    'https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.single_contract',
  Lease_list:
    "https://propms.erpnext.syscort.com/api/resource/Lease?fields=[%22name%22,%22lease_status%22,%22custom_number_of_unit%22,%22property%22,%22custom_name_of_owner%22,%22lease_customer%22,%22custom_location__area%22,%22start_date%22,%22end_date%22,%22custom_rent_amount_to_pay%22,%22custom_price__rent_annually%22,%22custom_unit_name%22,%22custom_property_name%22]&order_by=modified desc",
  Lease_lists:
    "https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.contracts_list",
  Tenancy_contract_pdf:
    "http://propms.erpnext.syscort.com/api/method/frappe.utils.print_format.download_pdf?doctype=Lease&format=Tenancy+Contract&name=",
  MoveIn_List:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Move In"]]',
  MoveOut_List:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Move Out"]]',
  Maintenance_list:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Maintenance"]]',
  Maintenance_lists:
    'https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.maintenances_list',
  Single_Maintenance:
    'https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.single_maintenance',
  Legal_list:
    'https://propms.erpnext.syscort.com/api/resource/Maintenance?fields=["*"]&filters=[["custom_status","=","Legal"]]',
  Tenant_Lease_List:
    'https://propms.erpnext.syscort.com/api/resource/Lease?filters=[["lease_status","=","Active"]]&fields=[%22property%22,%22name%22,%22custom_number_of_unit%22,%22custom_unit_name%22,%22custom_property_name%22,%22custom_current_property%22]',
  Create_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Delete_Maintenance:
    "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Update_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Damage_Location:
    "https://propms.erpnext.syscort.com/api/resource/Damage Location",
  Legal_Data: "https://propms.erpnext.syscort.com/api/resource/Legal Reason",
  Lease_Data: "https://propms.erpnext.syscort.com/api/resource/Lease",
  Lead_Data:
    'https://propms.erpnext.syscort.com/api/resource/Lead?fields=["modified"]',
  Fetch_Case: "https://propms.erpnext.syscort.com/api/resource/Maintenance",
  Profile_Data: "https://propms.erpnext.syscort.com/api/resource/User",
  Country_List: "https://propms.erpnext.syscort.com/api/resource/Country",
  Fetched_Data: "https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.fetched_data",
  Fetched_Single_Data: "https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.single_data",
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

export const getListData = async (doctype: any) => {
  // let params = { doctype, fields: null, filters: JSON.stringify([["Property", "name", "=", "PRO-00002"]]) }
  let params = { doctype, fields: null, filters: null }
  const response = await axios.get(`https://propms.erpnext.syscort.com/api/method/propms_app.api.custom.fetched_data`, { params });
  return response.data;
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
  let params = { doctype: "Property", fields: JSON.stringify(["name", "name1", "custom_location", "custom_country", "custom_status", "type"]), filters: JSON.stringify([["Property", "is_group", "=", "1"]]) }
  const response = await axios.get(`${API_URL.Fetched_Data}`, {
    params,
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response.data;
};

export const getUnitList = async () => {
  let params = { doctype: "Property", fields: JSON.stringify(["name", "parent_property", "unit_owner", "custom_unit_number", "custom_location", "custom_supplier_name", "custom_status"]), filters: JSON.stringify([["Property", "is_group", "=", "0"]]) }
  const response = await axios.get(`${API_URL.Fetched_Data}`, {
    params,
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response.data;
};

export const getTenantList = async () => {
  const response = await axios.get(`${API_URL.Create_Tenant}?fields=[%22name%22,%22customer_name%22]`, {
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
  let params = { doctype: "Lease", fields: JSON.stringify(["name", "start_date", "end_date", "custom_current_property", "custom_name_of_owner", "lease_customer", "custom_rent_amount_to_pay", "lease_status"]), filters: null }
  const response = await axios.get(`${API_URL.Fetched_Data}`, {
    params,
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response.data;
};

export const createProperty = async (propertyData: any) => {
  console.log(propertyData, "vgh");
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

export const fetchUnitDatas = async (params: any) => {
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

export const fetchUnitsfromPropertyNew = async (pName: any) => {
  let params = { doctype: "Property", fields: JSON.stringify(["*"]), filters: JSON.stringify([["Property", "parent_property", "=", pName]]) }
  const response = await axios.get(`${API_URL.Fetched_Data}`, {
    params,
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response.data;
};


export const fetchPropertyData = async (pName: any) => {
  let params = { doctype: "Property", fields: JSON.stringify(["*"]), filters: JSON.stringify([["Property", "name", "=", pName]]) }
  const response = await axios.get(`${API_URL.Fetched_Data}`, {
    params,
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response.data.data.data[0];
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
  const response = await axios.get(
    `${API_URL.Create_Lease}/${params}`,
    {
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
  let params = { doctype: "Maintenance", fields: JSON.stringify(["name", "creation", "custom_property", "custom_current_property", "custom_supplier", "custom_customer", "custom_status_maint", "custom_start_date", "custom_end_date", "custom_statusmi"]), filters: JSON.stringify([["Maintenance", "custom_status", "=", "Move In"]]) }
  const response = await axios.get(
    `${API_URL.Fetched_Data}`,
    {
      params,
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response.data;
};

export const getMoveInListData = async (propertyName: any, unitName: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/api/resource/Maintenance?filters=[["custom_status","=","Move In"],["custom_property","=","${propertyName}"],["custom_current_property","=","${unitName}"]]&fields=["*"]&order_by=modified desc`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};

export const getContractsListData = async (unitName: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/api/resource/Lease?filters=[["lease_status","=","Active"],["custom_current_property","=","${unitName}"]]&fields=["*"]&order_by=modified desc`,
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
  let params = { doctype: "Maintenance", fields: JSON.stringify(["name", "creation", "custom_property", "custom_current_property", "custom_supplier", "custom_customer", "custom_status_maint", "custom_start_date", "custom_end_date", "custom_statusmo"]), filters: JSON.stringify([["Maintenance", "custom_status", "=", "Move Out"]]) }
  const response = await axios.get(
    `${API_URL.Fetched_Data}`,
    {
      params,
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response.data;
};

export const getMoveOutListData = async (propertyName: any, unitName: any) => {
  const response = await axios.get(
    `https://propms.erpnext.syscort.com/api/resource/Maintenance?filters=[["custom_status","=","Move Out"],["custom_property","=","${propertyName}"],["custom_current_property","=","${unitName}"]]&fields=["*"]&order_by=modified desc`,
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
  let params = { doctype: "Maintenance", fields: JSON.stringify(["name", "creation", "custom_property", "custom_current_property", "custom_supplier", "custom_damage_location", "custom_status_maint"]), filters: JSON.stringify([["Maintenance", "custom_status", "=", "Maintenance"]]) }
  const response = await axios.get(
    `${API_URL.Fetched_Data}`,
    {
      params,
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response.data;
};

export const getLegalList = async () => {
  let params = { doctype: "Maintenance", fields: JSON.stringify(["name", "creation", "custom_property", "custom_current_property", "custom_supplier", "custom_damage_location", "custom_legal_reason", "custom_status_legal"]), filters: JSON.stringify([["Maintenance", "custom_status", "=", "Legal"]]) }
  const response = await axios.get(
    `${API_URL.Fetched_Data}`,
    {
      params,
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response.data;
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

export const fetchMaintenance = async (id: any) => {
  let params = { doctype: "Maintenance", id }
  const response = await axios.get(
    `${API_URL.Fetched_Single_Data}`,
    {
      params,
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    });
  return response?.data?.data?.data ?? null;
};

export const fetchDamageLocation = async () => {
  const response = await axios.get(`${API_URL.Damage_Location}?limit_page_length=[100]`, {
    auth: {
      username: APP_AUTH.USERNAME,
      password: APP_AUTH.PASSWORD,
    },
  });
  return response;
};

export const fetchLegalReason = async () => {
  const response = await axios.get(`${API_URL.Legal_Data}?limit_page_length=[100]`, {
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
  const response = await axios.get(`${API_URL.Create_Lease}?fields=["*"]&order_by=modified desc`, {
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
) => {
  const response = await axios.get(
    `${API_URL.Fetch_Case}?filters=[["custom_property","=","${propertyName}"],["custom_current_property","=","${unitName}"]]&fields=[%22custom_status%22,%22custom_property%22,%22custom_unit_no%22,%22custom_customer%22]&order_by=modified desc`,
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
  const response = await axios.get(
    `${API_URL.Country_List}?fields=["name"]&limit_page_length=[100]`,
    {
      auth: {
        username: APP_AUTH.USERNAME,
        password: APP_AUTH.PASSWORD,
      },
    }
  );
  return response;
};
