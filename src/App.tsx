import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPasswd from "./pages/ForgetPasswd";
import Overview from "./pages/dashboard/Overview";
import Property from "./pages/dashboard/Property";
import AddProperty from "./components/AddProperty";
import Units from "./pages/dashboard/Units";
import Tenants from "./pages/dashboard/Tenants";
import Owners from "./pages/dashboard/Owners";
import Leads from "./pages/dashboard/Leads";
import BookReserve from "./pages/dashboard/BookReserve";
import TenancyContracts from "./pages/dashboard/TenancyContracts";
import AddTenancyContracts from "./components/AddTenancyContracts";
import AddTenants from "./components/AddTenants";
import AddOwners from "./components/AddOwners";
import AddLeads from "./components/AddLeads";
import AddUnits from "./components/AddUnits";
import AddBookReserve from "./components/AddBookReserve";
import EditProperty from "./components/EditProperty";
import EditUnits from "./components/EditUnits";
import EditTenants from "./components/EditTenants";
import EditBooking from "./components/EditBooking";
import EditTenancyContracts from "./components/EditTenancyContracts";
import EditLead from "./components/EditLead";
import EditOwner from "./components/EditOwner";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Login />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/property" element={<Property />} />
        <Route path="/units" element={<Units />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/owners" element={<Owners />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/booking" element={<BookReserve />} />
        <Route path="/contracts" element={<TenancyContracts />} />
        <Route path="/property/add" element={<AddProperty />} />
        <Route path="/property/:id" element={<EditProperty />} />
        <Route path="/units/add" element={<AddUnits />} />
        <Route path="/units/edit" element={<EditUnits />} />
        <Route path="/leads/add" element={<AddLeads />} />
        <Route path="/leads/edit" element={<EditLead />} />
        <Route path="/owners/add" element={<AddOwners />} />
        <Route path="/owners/edit" element={<EditOwner />} />
        <Route path="/tenants/add" element={<AddTenants />} />
        <Route path="/tenants/edit" element={<EditTenants />} />
        <Route path="/booking/add" element={<AddBookReserve />} />
        <Route path="/booking/edit" element={<EditBooking />} />
        <Route path="/contracts/add" element={<AddTenancyContracts />} />
        <Route path="/contracts/edit" element={<EditTenancyContracts />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPasswd />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
