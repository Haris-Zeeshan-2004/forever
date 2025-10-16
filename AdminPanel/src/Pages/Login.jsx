import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { adminLogin, BackendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data } = await axios.post(
          `${BackendUrl}/api/admin/register`,
          { name, email, password },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success("Signup successful! Please login.");
          await UserVerify();
          navigate("/email-verify");
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(data.message || "Signup failed");
        }
      } else {
        const success = await adminLogin(email, password);
        if (success) {
          setEmail("");
          setPassword("");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Error in login/signup:", err);
      toast.error(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const UserVerify = async () => {
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/admin/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Admin Login" : "Admin Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-gray-900 text-white px-4 py-2 rounded-md mt-2 hover:bg-gray-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>

          <div className="flex justify-between text-sm mt-3 text-gray-600">
            <p
              onClick={() => navigate("/reset-password")}
              className="cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>
            {mode === "login" ? (
              <p
                className="cursor-pointer hover:underline"
                onClick={() => setMode("signup")}
              >
                Create Account
              </p>
            ) : (
              <p
                className="cursor-pointer hover:underline"
                onClick={() => setMode("login")}
              >
                Already have an account? Login
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
