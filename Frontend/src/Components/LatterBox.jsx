import { useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const LatterBox = () => {
  const [email, setEmail] = useState("");
  const { BackendURL } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }

      const { data } = await axios.post(
        `${BackendURL}/api/sub/subscribe`,
        { email },
        { withCredentials: true } 
      );

      if (data.success) {
        toast.success("Subscription successful! Admin has been notified.");
        setEmail(""); 
      } else {
        toast.error(data.message || "Subscription failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-900">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-400 mt-1 text-center">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 my-6 flex items-center gap-4 pl-3 mx-auto border"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:flex-1 outline-none px-3 py-2"
        />

        <button
          type="submit"
          className="bg-black text-white text-xs cursor-pointer px-10 py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default LatterBox;
