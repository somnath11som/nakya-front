import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashbord from "./pages/Dashbord";

const ManageDepartment = lazy(() => import("./components/ManageDepartment"));
const ManageInstru = lazy(() => import("./components/ManageInstru"));
const ManageParameters = lazy(() => import("./components/ManageParameters"));
const ManageParams = lazy(() => import("./pages/ManageParametersModule"));
const AdmineDashbord = lazy(() => import("./pages/AdmineDashbord"));
const SuperAdminLogin = lazy(() => import("./pages/SuperAdminLogin"));
const ViewInstrument = lazy(() => import("./components/ViewInstrument"));
const ManageProfile = lazy(() => import("./components/ManageProfile"));
const EditProfile = lazy(() => import("./components/EditProfile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Support = lazy(() => import("./components/Support"));
const ChangePassword = lazy(() => import("./components/ChangePassword"));
const ProfileDetails = lazy(() => import("./components/ProfileDetails"));
const ParametersListLevelTwo = lazy(() => import("./components/ParametersListLevelTwo"));
const ApprovedOrganizations = lazy(() => import("./pages/ApprovedOrganizations"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ManageStaff = lazy(() => import("./components/ManageStaff"));
const CreateExp = lazy(() => import("./pages/CreateExp"));
const TrackExperiment = lazy(() => import("./pages/TrackExperiment"));
const ExperimentHistory = lazy(() => import("./components/ExperimentHistory"));
const RealTimeRawData = lazy(() => import("./components/TrackExperimentComponents/RealTimeRawData"));
const ExperimentalSummary = lazy(() => import("./components/TrackExperimentComponents/ExperimentalSummary"));
const Visualization = lazy(() => import("./components/TrackExperimentComponents/Visualization"));
const ViCell = lazy(() => import("./components/TrackExperimentComponents/RealTimeComponent.jsx/ViCell"));
const DataVisualization = lazy(() => import("./components/DataVisualComponent/DataVisualization"));
const ELNReports = lazy(() => import("./components/ELNReportsComponents/ELNReports"));
const ExperimentDetails = lazy(() => import("./components/ELNReportsComponents/ExperimentDetails"));

const Loader = () => <div>Loading...</div>;
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashbord" element={<AdmineDashbord />} />
            <Route path="/admin/login" element={<SuperAdminLogin />} />
            <Route path="/approved-organizations" element={<ApprovedOrganizations />} />

            <Route path="/sign-up" element={<Signup />} />
            <Route path="/dashboard" element={<Dashbord />} />
            <Route path="/view-instrument/:id" element={<ViewInstrument />} />
            <Route path="/manage-instru" element={<ManageInstru />} />
            <Route path="/manage-par" element={<ManageParameters />} />
            <Route path="/manage-parameters" element={<ManageParams />} />
            <Route path="/manage-dept" element={<ManageDepartment />} />

            <Route path="/profile-details/:id" element={<ProfileDetails />} />

            <Route path="/manage-profile" element={<ManageProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/support" element={<Support />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/parameters-level-two/:id" element={<ParametersListLevelTwo />} />

            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/manage-staff" element={<ManageStaff />} />
            <Route path="/create-exp" element={<CreateExp />} />
            <Route path="/track-exp" element={<TrackExperiment />} />
            <Route path="/real-time-data" element={<RealTimeRawData />} />
            <Route path="/vi-cell" element={<ViCell />} />
            <Route path="/experimental-summary" element={<ExperimentalSummary />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/exp-history" element={<ExperimentHistory />} />
            <Route path="/experiment/:experimentId" element={<ExperimentDetails />} />
            <Route path="/data-visualization" element={<DataVisualization />} />
            <Route path="/eln-reports" element={<ELNReports />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
