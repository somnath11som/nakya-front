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

//Milestone 3 
import ManageStaff from "./components/ManageStaff";
import CreateExp from "./pages/CreateExp";
import TrackExperiment from "./pages/TrackExperiment";
import ExperimentHistory from "./components/ExperimentHistory";
import RealTimeRawData from "./components/TrackExperimentComponents/RealTimeRawData";
import ExperimentalSummary from "./components/TrackExperimentComponents/ExperimentalSummary";
import Visualization from "./components/TrackExperimentComponents/Visualization";
import ViCell from "./components/TrackExperimentComponents/RealTimeComponent.jsx/ViCell";
import DataVisualization from "./components/DataVisualComponent/DataVisualization";
import ELNReports from "./components/ELNReportsComponents/ELNReports";
import ExperimentDetails from "./components/ELNReportsComponents/ExperimentDetails";




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



{/* Milestone 3  */}
          <Route path="/manage-staff" element={<ManageStaff />} />
          <Route path="/create-exp" element={<CreateExp />} />
          <Route path="/track-exp" element={<TrackExperiment />} />
          <Route path="/real-time-data" element={<RealTimeRawData />} />
                      <Route path="/vi-cell" element={<ViCell />} />
          <Route path="/experimental-summary" element={<ExperimentalSummary />} />
          <Route path="/visualization" element={<Visualization/>} />        
           <Route path="/exp-history" element={<ExperimentHistory />} />
          <Route path="/experiment/:experimentId" element={<ExperimentDetails />} />
          <Route path="/data-visualization" element={<DataVisualization />} />
          <Route path="/eln-reports" element={<ELNReports />} />
         



        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
