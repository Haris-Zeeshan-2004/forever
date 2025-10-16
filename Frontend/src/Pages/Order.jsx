import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import axios from "axios";

const Order = ({ isAdmin = false }) => {
  const { BackendURL, islogin, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!islogin) return;

      const url = isAdmin
        ? `${BackendURL}/api/order/list` 
        : `${BackendURL}/api/order/userorders`; 

      const { data } = await axios.get(url, { withCredentials: true });

      if (data.success) {
        let allOrderData = [];

        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrderData.push({
              ...item,
              status: order.status || "Unknown",
              payment: order.payment || false,
              paymentMethod: order.paymentMethod || "Unknown",
              date: order.date || Date.now(),
              image:
                Array.isArray(item.image) && item.image.length > 0
                  ? item.image
                  : ["/placeholder.png"],
            });
          });
        });

        setOrderData(allOrderData.reverse());
      }
    } catch (error) {
      console.error("LoadOrderData Error:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [islogin]);

  return (
    <div className="border-t border-gray-300 pt-16">
      <div className="text-2xl mb-2">
        <Title text1={isAdmin ? "ADMIN" : "MY"} text2={"ORDERS"} />
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          {isAdmin
            ? "No orders assigned to you yet."
            : "You have no orders yet."}
        </p>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-4 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p>{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer hover:bg-black hover:text-white transform hover:scale-110 hover:shadow-md duration-300"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
