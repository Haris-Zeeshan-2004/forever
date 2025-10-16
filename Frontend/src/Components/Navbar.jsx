import { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const [Visible, setVisible] = useState(false);

  const { setShowSearch, getCartCount, setIslogin, BackendURL, islogin, user } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const { data } = await axios.post(
        `${BackendURL}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        navigate("/login");
        setIslogin(false);
        toast.success("Logout Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between items-center py-5 font-medium ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="w-36 cursor-pointer"
        alt=""
      />

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col gap-1 items-center group">
          <p>HOME</p>
          <span className="block w-0 group-hover:w-full h-[1.5px] bg-gray-700 transition-all duration-300"></span>
        </NavLink>

        <NavLink
          to="collection"
          className="flex flex-col gap-1 items-center group"
        >
          <p>COLLECTION</p>
          <span className="block w-0 group-hover:w-full h-[1.5px] bg-gray-700 transition-all duration-300"></span>
        </NavLink>

        <NavLink to="about" className="flex flex-col gap-1 items-center group">
          <p>ABOUT</p>
          <span className="block w-0 group-hover:w-full h-[1.5px] bg-gray-700 transition-all duration-300"></span>
        </NavLink>

        <NavLink
          to="contact"
          className="flex flex-col gap-1 items-center group"
        >
          <p>CONTACT</p>
          <span className="block w-0 group-hover:w-full h-[1.5px] bg-gray-700 transition-all duration-300"></span>
        </NavLink>
        <a
          href="http://localhost:5174/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-1 items-center justify-center"
        >
          <p className="text-xs border border-gray-200 px-2.5  sm:px-5 py-1 sm:py-2 rounded-full hover:bg-gray-200 transition transform hover:scale-105 hover:shadow-md duration-300">
            Admin Panel
          </p>
        </a>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true), navigate("/collection");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />

        <div className="group relative">
          <img
            onClick={() => (islogin ? "null" : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
          {islogin && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => navigate("/order")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>

                <p onClick={Logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/card" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] bg-black text-white rounded-full w-4 text-center aspect-square leading-4 text-[8px] ">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 overflow-hidden bg-white transition-all ${
          Visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p className="cursor-pointer">Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/"}
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/collection"}
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/about"}
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to={"/contact"}
          >
            CONTACT
          </NavLink>
          <a
            href="http://localhost:5174/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 mt-1 items-center justify-center"
          >
            <p className="text-xs border border-gray-200 px-5 py-2 rounded-full hover:bg-gray-200 transition transform hover:scale-105 hover:shadow-md duration-300">
              Admin Panel
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
