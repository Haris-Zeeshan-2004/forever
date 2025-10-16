import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { AppContext } from "../Context/AppContext";

const List = () => {
  const [list, setList] = useState([]);
  const { BackendUrl, currency } = useContext(AppContext);

  const fetchList = async () => {
    try {
      const res = await axios.get(
        `${BackendUrl}/api/admin/products/my-products`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setList(res.data.products || []);
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${BackendUrl}/api/admin/products/remove/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const res = await axios.put(
        `${BackendUrl}/api/admin/products/update/${id}`,
        { stock: newStock },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Stock updated successfully!");
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, stock: newStock } : item
          )
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateprice = async (id, newPrice) => {
    try {
      const res = await axios.put(
        `${BackendUrl}/api/admin/products/update/${id}`,
        { price: newPrice },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Price updated successfully!");
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, price: newPrice } : item
          )
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">My Products</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className="text-center">Action</b>
        </div>

        {list.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No products yet</p>
        ) : (
          list.map((item) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm"
              key={item._id}
            >
              <img className="w-12" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                <input
                  type="number"
                  className="border px-2 py-1 w-16 text-center"
                  value={item.price}
                  min={100}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      setList((prev) =>
                        prev.map((p) =>
                          p._id === item._id ? { ...p, price: value } : p
                        )
                      );
                    }
                  }}
                  onBlur={(e) => updateprice(item._id, Number(e.target.value))}
                />
              </p>

              <input
                type="number"
                min="0"
                className="border px-2 py-1 w-16 text-center"
                value={item.stock}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0) {
                    setList((prev) =>
                      prev.map((p) =>
                        p._id === item._id ? { ...p, stock: value } : p
                      )
                    );
                  }
                }}
                onBlur={(e) => updateStock(item._id, Number(e.target.value))}
              />

              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center ms-12 cursor-pointer text-lg hover:text-red-400"
              >
                <MdDelete />
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default List;
