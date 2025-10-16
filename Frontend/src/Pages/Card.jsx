import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import CartTotal from "../Components/CartTotal";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, products, currency, updateQuantity, getCart, islogin } =
    useContext(ShopContext);

  const [CartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (products && products.length > 0) {
      const tempdata = [];
      for (const items in cart) {
        for (const item in cart[items]) {
          if (cart[items][item] > 0) {
            tempdata.push({
              _id: items,
              size: item,
              quantity: cart[items][item],
            });
          }
        }
      }
      setCartData(tempdata);
      setLoading(false);
    }
  }, [cart, products]);

  useEffect(() => {
    if (islogin) getCart();
  }, [islogin, getCart]);

  if (loading) return <p className="text-center mt-10">Loading your cart...</p>;

  if (!islogin)
    return <p className="text-center mt-10">Please login to view your cart.</p>;

  if (!CartData || CartData.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="border-t border-gray-200 pt-14">
      <div className="text-2xl mb-3 text-start">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="flex flex-col gap-4">
        {CartData.map((item) => {
          const productData = products.find((p) => p._id === item._id);

          if (!productData) return null;

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-3">
                <img
                  className="w-16 sm:w-20"
                  src={productData?.image?.[0] || ""}
                  alt={productData?.name || "Product"}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData?.name || "Unknown"}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency} {productData?.price || 0}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 bg-slate-50 border">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              <input
                className="border max-w-12 px-1 sm:px-2 py-1 text-center rounded"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);

                  
                  if (isNaN(newValue) || newValue < 1) {
                    toast.warning("Quantity must be at least 1");
                    return;
                  }

                  updateQuantity(productData._id, item.size, newValue);
                }}
              />

              <img
                onClick={() => updateQuantity(productData._id, item.size, 0)}
                className="w-4 sm:w-5 mr-4 cursor-pointer hover:shadow-red-500"
                src={assets.bin_icon}
                alt="delete"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/PlaceOrder")}
              className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer rounded transform hover:scale-105 hover:shadow-md   duration-30"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
