import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";

import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Add = ({ token }) => {
  const { BackendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [image1, setimage1] = useState(false);
  const [image2, setimage2] = useState(false);
  const [image3, setimage3] = useState(false);
  const [image4, setimage4] = useState(false);

  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [stock, setstock] = useState("");
  const [category, setcategory] = useState("Men");
  const [subcategory, setsubcategory] = useState("Topwear");
  const [sizes, setsizes] = useState([]);
  const [bestseller, setbestseller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter product name");
    if (!description.trim()) return toast.error("Please enter description");
    if (!price || price <= 0) return toast.error("Please enter valid price");
    if (!stock || stock <= 0)
      return toast.error("Please enter valid stock quantity");
    if (sizes.length === 0)
      return toast.error("Please select at least one size");
    if (!image1 && !image2 && !image3 && !image4)
      return toast.error("Please upload at least one product image");

    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("price", price);
      formdata.append("category", category);
      formdata.append("subcategory", subcategory);
      formdata.append("sizes", JSON.stringify(sizes));
      formdata.append("bestseller", bestseller);
      formdata.append("stock", stock);

      image1 && formdata.append("image1", image1);
      image2 && formdata.append("image2", image2);
      image3 && formdata.append("image3", image3);
      image4 && formdata.append("image4", image4);

      const res = await axios.post(
        BackendUrl + "/api/admin/products/add",
        formdata,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setname("");
        setdescription("");
        setprice("");
        setstock("");
        setcategory("Men");
        setsubcategory("Topwear");
        setsizes([]);
        setbestseller(false);
        setimage1(false);
        setimage2(false);
        setimage3(false);
        setimage4(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start w-full"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setimage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setimage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setimage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setimage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2 mt-4">Product Name</p>
        <input
          onChange={(e) => setname(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-4 py-2 bg-white"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2 mt-4">Product Disceiption</p>
        <textarea
          onChange={(e) => setdescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-4 py-2 bg-white"
          type="text"
          placeholder="Write content here..."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 ">
        <div>
          <p className="mb-2 mt-4">Product Category</p>
          <select
            onChange={(e) => setcategory(e.target.value)}
            className="w-full px-4 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2 mt-4">Sub Category</p>
          <select
            onChange={(e) => setsubcategory(e.target.value)}
            className="w-full px-4 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 mt-4">Product Price</p>
          <input
            onChange={(e) => setprice(e.target.value)}
            value={price}
            className="w-full px-4 py-2 sm:w-[120px]"
            type="Number"
            placeholder="250"
          />
        </div>
        <div>
          <p className="mb-2 mt-4">Stock Quantity</p>
          <input
            onChange={(e) => setstock(e.target.value)}
            value={stock}
            className="w-full px-4 py-2 sm:w-[120px]"
            type="number"
            min="0"
            placeholder="Enter stock (e.g. 50)"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2 mt-4">Product Sizes</p>
        <div className="flex gap-2">
          <div
            onClick={() =>
              setsizes((prev) =>
                prev.includes("S")
                  ? prev.filter((item) => item !== "S")
                  : [...prev, "S"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("S") ? "bg-pink-200" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              S
            </p>
          </div>
          <div
            onClick={() =>
              setsizes((prev) =>
                prev.includes("M")
                  ? prev.filter((item) => item !== "M")
                  : [...prev, "M"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("M") ? "bg-pink-200" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              M
            </p>
          </div>
          <div
            onClick={() =>
              setsizes((prev) =>
                prev.includes("L")
                  ? prev.filter((item) => item !== "L")
                  : [...prev, "L"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("L") ? "bg-pink-200" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              L
            </p>
          </div>
          <div
            onClick={() =>
              setsizes((prev) =>
                prev.includes("XL")
                  ? prev.filter((item) => item !== "XL")
                  : [...prev, "XL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XL") ? "bg-pink-200" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              XL
            </p>
          </div>
          <div
            onClick={() =>
              setsizes((prev) =>
                prev.includes("XXL")
                  ? prev.filter((item) => item !== "XXL")
                  : [...prev, "XXL"]
              )
            }
          >
            <p
              className={`${
                sizes.includes("XXL") ? "bg-pink-200" : "bg-slate-200"
              } px-3 py-1 cursor-pointer`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <input
          onChange={() => setbestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>
      <button
        type="submit"
        className="bg-black text-white cursor-pointer rounded-sm w-28 py-3 mt-6 "
      >
        ADD
      </button>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-5 backdrop-blur-[2px] z-50">
          <p className="text-blue-900 font-semibold text-lg animate-pulse">
            Adding Product.......
          </p>
        </div>
      )}
    </form>
  );
};

export default Add;
