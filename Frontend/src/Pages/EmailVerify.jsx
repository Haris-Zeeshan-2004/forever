import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { BackendURL, checkLogin } = useContext(ShopContext);

  const navigate = useNavigate();
  const inputref = React.useRef([]);

  const HandleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputref.current.length - 1) {
      inputref.current[index + 1].focus();
    }
  };
  const keyspace = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputref.current[index - 1].focus();
    }
  };

  const handlepaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputref.current[index]) {
        inputref.current[index].value = char;
      }
    });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const otpArray = inputref.current.map((e) => e.value);
    if (otpArray.some((val) => val === "")) {
      toast.error("Please fill all OTP fields");
      return;
    }

    const otp = otpArray.join("");
    try {
      const { data } = await axios.post(
        `${BackendURL}/api/user/verify-email`,
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex items-center justify-center min-h-screen border-t border-gray-200 "
    >
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px] text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Verify Your Email
        </h1>
        <p className="text-gray-500 mb-8">
          Enter the 6-digit code we sent to your email address.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlepaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(e) => (inputref.current[index] = e)}
                onInput={(e) => HandleInput(e, index)}
                onKeyDown={(e) => keyspace(e, index)}
                className="w-12 h-12 border-2 rounded-lg text-center text-lg font-semibold 
                       focus:outline-none focus:border-pink-500 transition shadow-sm"
              />
            ))}
        </div>

        <button
          className="w-full py-3 rounded-full bg-black
                 text-white font-medium tracking-wide shadow-md hover:scale-105 
                 hover:shadow-lg transition transform"
        >
          Verify Email
        </button>
      </div>
    </form>
  );
};

export default EmailVerify;
