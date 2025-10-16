import { useState, useContext } from "react";
import Title from "../Components/Title";
import CartTotal from "../Components/CartTotal";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [Method, setMethod] = useState("cod");
  const navigate = useNavigate();

  const { BackendURL, cart, setCart, products, Delivery_Fee, GetCartAmount } =
    useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const OnChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const OnSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let OrderItems = [];

      for (const productId in cart) {
        for (const size in cart[productId]) {
          const quantity = cart[productId][size];
          if (quantity > 0) {
            const product = products.find((p) => p._id === productId);
            if (product) {
              OrderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: Array.isArray(product.image)
                  ? product.image
                  : [product.image],
                size,
                quantity,
              });
            }
          }
        }
      }

      if (OrderItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const OrderData = {
        address: formData,
        items: OrderItems,
        amount: GetCartAmount() + Delivery_Fee,
      };

      if (Method === "cod") {
        const { data } = await axios.post(
          `${BackendURL}/api/order/place`,
          OrderData,
          { withCredentials: true }
        );

        if (data.success) {
          setCart({});
          toast.success("Order placed successfully!");
          navigate("/order");
        } else {
          toast.error(data.message || "Failed to place order");
        }
      } else {
        toast.error("Only Cash on Delivery is supported right now.");
      }
    } catch (error) {
      console.error("Order Placement Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={OnSubmitHandler}
      className="flex flex-col sm:flex-row justify-between border-t border-gray-200 gap-6 pt-5 sm:pt-14 min-h-[80vh]"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-5">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3 mb-1">
          <input
            required
            onChange={OnChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={OnChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          required
          onChange={OnChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          onChange={OnChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="text"
          placeholder="Street"
        />

        <div className="flex gap-3">
          <input
            required
            onChange={OnChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={OnChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="State"
          />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={OnChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="number"
            placeholder="Zip Code"
          />
          <input
            required
            onChange={OnChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          onChange={OnChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="number"
          placeholder="Phone Number"
        />
      </div>

      <div className="mt-8">
        <div className="mt-8 min-w-90">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex flex-col lg:flex-row mt-3">
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 rounded-full ${
                  Method === "cod" ? "bg-green-300" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end">
            <button
              type="submit"
              className="bg-black text-white text-center text-sm my-8 px-16 py-3 cursor-pointer transform hover:scale-105 hover:shadow-md duration-300"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
