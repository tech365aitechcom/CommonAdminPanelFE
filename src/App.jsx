import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import { Provider } from "react-redux";
import store from "./store/store";
import { AnswerProvider } from "./components/AnswerContext";
import { QuestionProvider } from "./components/QuestionContext";
import Category from "./components/Category/Category";
import Questions from "./components/Questions/Questions";
import Conditions from "./components/Conditions/Conditions";
import Brand from "./components/Brand/Brand";
import GradePricingSheet from "./pages/GradePricingSheet";
import CompanyListing from "./pages/CompanyListing/CompanyListing";
import CompanyListingDetails from "./pages/CompanyListingDetails/CompanyListingDetails";
import RegisterUser from "./pages/RegisterUser/RegisterUser";
import RegisterUserDetails from "./pages/RegisterUserDetails/RegisterUserDetails";
import StoreListing from "./pages/StoreListing/StoreListing";
import StoreListingTable from "./pages/StoreListingTable/StoreListingTable";
import StoredImagesPage from "./components/StoredImages/StoredImages";
import CompaniesPage from "./components/Companies/Companies";
import SelectDevice from "./pages/SelectDevice/SelectDevice";
import SelectModel from "./pages/SelectModel/SelectModel";
import CompanyDetails from "./pages/CompanyDetails/CompanyDetails";
import Footer from "./components/Footer";
import ModuleSetting from "./components/ModuleSetting/ModuleSetting";
import CodeMgmt from "./components/CodeMgmt/CodeMgmt";
import GroupMgmt from "./components/GroupMgmt/GroupMgmt";

// Higher-Order Component for Protected Routes
const ProtectedRoute = ({ children }) => {
  const userToken = sessionStorage.getItem("authToken"); // Replace with your auth method
  return userToken ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <AnswerProvider>
        <QuestionProvider>
          <Provider store={store}>
            <Router>
              <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />
                <Route path="/PasswordRecovery" element={<ForgetPassword />} />
                {/* Protected Routes */}
                <Route
                  path="/category"
                  element={
                    <ProtectedRoute>
                      <Category />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions/:category"
                  element={
                    <ProtectedRoute>
                      <Questions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/storedImages"
                  element={
                    <ProtectedRoute>
                      <StoredImagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:brandId"
                  element={
                    <ProtectedRoute>
                      <SelectDevice />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companies"
                  element={
                    <ProtectedRoute>
                      <CompaniesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules"
                  element={
                    <ProtectedRoute>
                      <ModuleSetting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/codes"
                  element={
                    <ProtectedRoute>
                      <CodeMgmt />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups"
                  element={
                    <ProtectedRoute>
                      <GroupMgmt />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/brands/:category"
                  element={
                    <ProtectedRoute>
                      <Brand />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/conditions/:category"
                  element={
                    <ProtectedRoute>
                      <Conditions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gradepricingsheet"
                  element={
                    <ProtectedRoute>
                      <GradePricingSheet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companydetails"
                  element={
                    <ProtectedRoute>
                      <CompanyDetails />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/companylistingdetails"
                  element={
                    <ProtectedRoute>
                      <CompanyListingDetails />
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/registeruser"
                  element={
                    <ProtectedRoute>
                      <RegisterUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registeruserdetails"
                  element={
                    <ProtectedRoute>
                      <RegisterUserDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/storelisting"
                  element={
                    <ProtectedRoute>
                      <StoreListing />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/storelistingtable"
                  element={
                    <ProtectedRoute>
                      <StoreListingTable />
                    </ProtectedRoute>
                  }
                ></Route>
              </Routes>
            </Router>
            <Footer />
            <Toaster />
          </Provider>
        </QuestionProvider>
      </AnswerProvider>
    </>
  );
}

export default App;
