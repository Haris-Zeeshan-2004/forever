import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";

import { AppContext } from "../Context/AppContext";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const { BackendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailsend, setisEmailsend] = useState("");
  const [otp, setotp] = useState(0);
  const [otpsubmitted, setotpsubmitted] = useState(false);
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

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/admin/send-reset-otp`,
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setisEmailsend(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitotp = async (e) => {
    e.preventDefault();

    const otpArray = inputref.current.map((e) => e.value);
    setotp(otpArray.join(""));
    setotpsubmitted(true);
  };

  const onSubmitNewpassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/admin/reset-password`,
        { email, otp, newPassword: password },
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
    <div className="flex items-center justify-center min-h-screen  ">
      {!isEmailsend && (
        <form
          onSubmit={onSubmitEmail}
          className="shadow-xl rounded-2xl p-10 w-[420px] text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Reset Password
          </h1>
          <p className="text-gray-500 mb-8">
            Enter your registered email address.
          </p>
          <div className="w-full px-3 py-2 rounded-full  mb-8 ">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="border border-gray-400 px-5 py-2 rounded-4xl focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <button
            className="w-full py-3 rounded-full bg-black
                 text-white font-medium tracking-wide shadow-md hover:scale-105 
                 hover:shadow-lg transition transform"
          >
            Submit
          </button>
        </form>
      )}

      {isEmailsend && !otpsubmitted && (
        <form
          onSubmit={onSubmitotp}
          className="bg-white shadow-xl rounded-2xl p-10 w-[420px] text-center "
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Reset Password OTP
          </h1>
          <p className="text-gray-500 mb-8">
            Enter the 6-digit code sent your E-mail id.
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
            Submit
          </button>
        </form>
      )}

      {isEmailsend && otpsubmitted && (
        <form
          onSubmit={onSubmitNewpassword}
          className="bg-white shadow-xl rounded-2xl p-10 w-[420px] text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            New Password
          </h1>
          <p className="text-gray-500 mb-8">Enter your new password below.</p>
          <div className="w-full px-3 py-2 rounded-full  border mb-8 border-gray-800">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="text-gray-800 bg-transparent w-full outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            className="w-full py-3 rounded-full bg-black
                 text-white font-medium tracking-wide shadow-md hover:scale-105 
                 hover:shadow-lg transition transform"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
