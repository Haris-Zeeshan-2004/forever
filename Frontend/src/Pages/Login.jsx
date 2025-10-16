import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [State, setState] = useState("Login");
  const { islogin, setIslogin, BackendURL } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (islogin) navigate("/");
  }, [islogin, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (State === "Sign Up") {
        const { data } = await axios.post(
          `${BackendURL}/api/user/register`,
          { name, email, password },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success("Signup Successful! otp send on email");
          await UserVerify(data.userId);
          navigate("/email-verify");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${BackendURL}/api/user/login`,
          { email, password },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success("Login Successful!");
          setIslogin(true);

          const authRes = await axios.get(`${BackendURL}/api/user/check-auth`, {
            withCredentials: true,
          });

          if (authRes.data.success) {
            setIslogin(true);
            navigate("/");
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  const UserVerify = async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${BackendURL}/api/user/send-verify-otp`,
        { userId }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="border-t border-gray-400">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 mt-14 m-auto gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mt-10 mb-2">
          <p className="text-3xl prata-regular">{State}</p>
          <p className="w-8 sm:h-[1.5px] bg-gray-800"></p>
        </div>

        {State === "Sign Up" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
            required
            className="w-full px-3 py-2 border border-gray-800"
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-gray-800"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
          className="w-full px-3 py-2 border border-gray-800"
        />

        <div className="flex justify-between text-sm w-full mt-[-8px]">
          <p
            onClick={() => navigate("/reset-password")}
            className="cursor-pointer"
          >
            Forget Password?
          </p>
          {State === "Login" ? (
            <p className="cursor-pointer" onClick={() => setState("Sign Up")}>
              Create Account
            </p>
          ) : (
            <p className="cursor-pointer" onClick={() => setState("Login")}>
              Login Here
            </p>
          )}
        </div>

        <div>
          <button className="bg-black text-white px-8 cursor-pointer active:bg-gray-600 py-2 rounded-full font-light mt-5">
            {State === "Login" ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
