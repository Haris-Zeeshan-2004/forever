import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Home";
import Add from "./Pages/Add";
import List from "./Pages/List";
import Navbar from "./Components/Navbar";
import SideBar from "./Components/SideBar";
import Order from "./Pages/Order";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";

const App = () => {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/email-verify" ||
    location.pathname === "/reset-password";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex w-full">
        {!hideSidebar && <SideBar />}

        <div className="w-[75%] mx-auto py-8 text-gray-600 text-base">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/order" element={<Order />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="//reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;
