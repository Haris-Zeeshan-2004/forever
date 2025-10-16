import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();


const AdminContextProvider = ({ children }) => {
    const BackendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = "RS";
    const navigate=useNavigate()

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/admin/check-auth`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsAdminLoggedIn(true);
        setAdmin(res.data.admin);
      } else {
        setIsAdminLoggedIn(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAdminLoggedIn(false);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, [BackendUrl]);

  const adminLogin = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/admin/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Admin login successful!");
        await checkAdminAuth(); 
        navigate("/")
        return true;
      } else {
        toast.error(data.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  return (
    <AppContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        admin,
        setAdmin,
        adminLogin,
        currency,
        checkAdminAuth,
        BackendUrl,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AdminContextProvider;
