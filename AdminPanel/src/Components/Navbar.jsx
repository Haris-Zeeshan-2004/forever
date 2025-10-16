import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { BackendUrl, isAdminLoggedIn, admin, setIsAdminLoggedIn, setAdmin } =
    useContext(AppContext);

  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/admin/logout`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Logged out successfully");
        setIsAdminLoggedIn(false);
        setAdmin(null);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex justify-between items-center px-10 border-b border-gray-300 py-2 font-medium">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="w-32 cursor-pointer"
        alt="Logo"
      />

      {isAdminLoggedIn ? (
        <div className="relative group">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer select-none"
            title={admin?.name || admin?.email}
          >
            {admin?.name
              ? admin.name[0].toUpperCase()
              : admin?.email
              ? admin.email[0].toUpperCase()
              : "A"}
          </div>

          <div
            className="absolute right-0 top-full mt-2 w-40 bg-gray-100 text-gray-800 rounded shadow-lg 
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                       translate-y-2 group-hover:translate-y-0 
                       transition-all duration-200 ease-out z-50"
          >
            <p
              onClick={Logout}
              className="py-1 px-3 hover:bg-gray-200 cursor-pointer"
            >
              Logout
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="text-md border border-gray-200 px-7 py-2 rounded-full hover:bg-black hover:text-white transition transform hover:scale-105 hover:shadow-md duration-300"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default AdminNavbar;
