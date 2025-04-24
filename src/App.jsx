import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashbord from "./pages/Dashbord";
// import ManageInstrument from "./pages/ManageInstrument";
import ManageDepartment from "./components/ManageDepartment";
import ManageInstru from "./components/ManageInstru";
import ManageParameters from "./components/ManageParameters";
// import AdmineLogin from "./pages/AdmineLogin";
import AdmineDashbord from "./pages/AdmineDashbord";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import ViewInstrument from "./components/ViewInstrument";
import ManageProfile from "./components/ManageProfile";
import EditProfile from "./components/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Support from "./components/Support";
import ChangePassword from "./components/ChangePassword";
import ProfileDetails from "./components/ProfileDetails";
import ParametersListLevelTwo from "./components/ParametersListLevelTwo";
import ApprovedOrganizations from "./pages/ApprovedOrganizations";
import VerifyEmail from "./pages/VerifyEmail";





const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/admine-Login" element={<AdmineLogin/>} /> */}
          <Route path="/admin-dashbord" element={<AdmineDashbord />} />
          <Route path="/admin/login" element={<SuperAdminLogin />} />
          <Route path="/approved-organizations" element={<ApprovedOrganizations />} />

          <Route path="/sign-up" element={<Signup />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path="/view-instrument/:id" element={<ViewInstrument />} />
          <Route path="/manage-instru" element={<ManageInstru />} />
          <Route path="/manage-parameters" element={<ManageParameters />} />
          <Route path="/manage-dept" element={<ManageDepartment />} />

          <Route path="/profile-details/:id" element={<ProfileDetails />} />

          <Route path="/manage-profile" element={<ManageProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         
          <Route path="/support" element={<Support />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/parameters-level-two/:id" element={<ParametersListLevelTwo />} />

          

          <Route path="/verify-email/:token" element={<VerifyEmail/>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />






        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;


