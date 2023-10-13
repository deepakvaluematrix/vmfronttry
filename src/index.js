import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import "tw-elements";
// Assets
import "../src/assets/stylesheet/output.css";
import "../src/assets/stylesheet/style.css";

// Pages
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Layout/Dashboard.jsx";
import AdminLogin from "./Pages/AdminLogin.jsx";
import AdminDashboard from "./Pages/Layout/AdminLayout.jsx";
import CompanyDashboard from "./Pages/Layout/CompanyLayout.jsx";
import XIDashboard from "./Pages/Layout/XILayout.jsx";
import SuperXIDashboard from "./Pages/Layout/SuperXILayout.jsx";
import Dialer from './dialer.jsx';
import ResetPassword from "./Components/Login/ForgotPassword.jsx";
import SetProfile from "./Pages/UserDashboard/SetProfile.jsx";
import InterviewPanel from "./Pages/InterviewPanel.jsx";
import InterviewerPanel from "./Pages/InterviewerPanel.jsx";
import Initial from "./Pages/Initial.jsx";
import Register from "./Pages/Register.jsx";
import ls from 'localstorage-slim';
import swal from "sweetalert";
import { isMobile } from "react-device-detect";
import logo from "../src/assets/images/logo.png";
import RegisterFirst from "./Components/Login/RegisterFirst";

const root = ReactDOM.createRoot(document.getElementById("root"));
ls.config.encrypt = true;
ReactSession.setStoreType("sessionStorage");


  const MobileNotAllowedPage = () => (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor:"#f1f1f1" }}>
      <div>
        <div className="flex justify-center items-center mt-4 mb-2">
          <img src={logo} alt="Value Matrix" width="200px"/>
        </div>
        <div className="flex justify-center items-center mt-4 mb-2">
          <h3 className="text-center">The valuematrix platform only works on <b style={{ color: "green" }}>desktop</b> for now </h3>
        </div>
      </div>
    </div>
  );


  if(isMobile){
    console.log("isMobile: ",isMobile);
    // route it to mobile not allowed component
    root.render(<MobileNotAllowedPage />);
  }else{
    root.render(
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registerFirst" element={<RegisterFirst/>} />
          <Route path="/dialer" element={<Dialer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword/" element={<ResetPassword />} />
          <Route path="/resetPassword/:id" element={<ResetPassword />} />
          <Route path="/setProfile/:id" element={<SetProfile />} />
          <Route path="/user" element={<Dashboard />} />
          <Route path="/user/:component" element={<Dashboard />} />
          <Route path="/user/:component/:id" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:component" element={<AdminDashboard />} />
          <Route path="/admin/:component/:id" element={<AdminDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/:component" element={<CompanyDashboard />} />
          <Route path="/company/:component/:id" element={<CompanyDashboard />} />
          <Route path="/XI" element={<XIDashboard />} />
          <Route path="/XI/:component" element={<XIDashboard />} />
          <Route path="/XI/:component/:id" element={<XIDashboard />} />
          <Route path="/superXI" element={<SuperXIDashboard />} />
          <Route path="/superXI/:component" element={<SuperXIDashboard />} />
          <Route path="/interview/:id" element={<InterviewPanel />} />
          <Route path="/interviewer/:id" element={<InterviewerPanel />} />
        </Routes>
      </Router>
    );
  }

