import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";

const Order = ({ isAdmin = true }) => {
  const [orders, setOrders] = useState([]);
  const { BackendUrl, currency } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const url = isAdmin
        ? `${BackendUrl}/api/order/list`
        : `${BackendUrl}/api/order/userorders`;

      const { data } = await axios.get(url, { withCredentials: true });
      if (data.success) setOrders(data.orders);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    if (!isAdmin) return;
    try {
      const { data } = await axios.put(
        `${BackendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { withCredentials: true }
      );
      if (data.success) fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAdmin]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isAdmin ? "Assigned Orders" : "My Orders"}
      </h2>
      {orders.length === 0 ? (
        <p className="text-center py-4 text-gray-500">
          {isAdmin
            ? "No orders assigned to you yet."
            : "You have not placed any orders yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 border-2 border-gray-300 items-start p-5 md:p-8 text-xs sm:text-sm text-gray-800 bg-gray-100"
            >
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {i !== order.items.length - 1 && ","}
                  </p>
                ))}
                <p className="mt-2 font-semibold">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}, {order.address.country},{" "}
                  {order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="mb-2 font-semibold">
                  Items: {order.items.length}
                </p>
                <p>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px] font-semibold">
                {currency}
                {order.amount}
              </p>
              {isAdmin && (
                <select
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                  className="p-2 font-semibold cursor-pointer"
                >
                  <option value="OrderPlaced">OrderPlaced</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out Of Delivery">Out Of Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
