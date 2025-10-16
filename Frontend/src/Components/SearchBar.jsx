import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { showSearch, setShowSearch, search, setSearch } =
    useContext(ShopContext);

  const [visible, setvisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setvisible(true);
    } else {
      setvisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center px-5 py-2 my-5 mx-2 border border-gray-400 rounded-full w-2/3 sm:w1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-inherit text-sm outline-none"
          type="text"
          placeholder="Search"
        />
        <img
          onClick={() => setShowSearch(ture)}
          className="w-4"
          src={assets.search_icon}
          alt=""
        />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt=""
      />
    </div>
  ) : (
    ""
  );
};

export default SearchBar;
