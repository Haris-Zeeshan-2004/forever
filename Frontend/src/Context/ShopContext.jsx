import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [products, setProducts] = useState([]);
  const [islogin, setIslogin] = useState(false);
  const [user, setUser] = useState(null);
  const currency = "RS";
  const Delivery_Fee = 250;

  const getCart = useCallback(async () => {
    if (!islogin) return;
    try {
      const { data } = await axios.get(`${BackendURL}/api/cart/get`, {
        withCredentials: true,
      });
      if (data.success) setCart(data.cartData || {});
    } catch (err) {
      console.error("Get cart error:", err);
    }
  }, [islogin, BackendURL]);

  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Select size");
    if (!islogin) return toast.error("Please Login");

    const product = products.find((p) => p._id === itemId);
    if (!product) return toast.error("Product not found");

    if (product.stock <= 0) {
      return toast.error("Out of Stock");
    }

    let cartdata = structuredClone(cart);

    if (cartdata[itemId]) {
      if (cartdata[itemId][size]) {
        cartdata[itemId][size] += 1;
      } else {
        cartdata[itemId][size] = 1;
      }
    } else {
      cartdata[itemId] = {};
      cartdata[itemId][size] = 1;
    }

    setCart(cartdata);

    const currentQty = cartdata[itemId]?.[size] || 0;


    if (currentQty + 1 > product.stock) {
      return toast.error(`Only ${product.stock} item(s) available in stock`);
    }

    if (islogin) {
      try {
        const { data } = await axios.post(
          `${BackendURL}/api/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );
        if (data.success) {
          toast.success("Product Added Successfully");
        }
      } catch (error) {
        console.log(error.response?.status, error.response?.data);
        toast.error("Failed to add to cart");
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const product = products.find((p) => p._id === itemId);
    if (product && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    let cartData = structuredClone(cart);
    cartData[itemId][size] = quantity;
    setCart(cartData);

    try {
      const { data } = await axios.put(
        `${BackendURL}/api/cart/update`,
        { itemId, size, quantity },
        { withCredentials: true }
      );
      if (data.success && data.cartData) setCart(data.cartData);
      toast.success("Product Updated");
    } catch (err) {
      console.error("Update cart error:", err);
      toast.error("Failed to update cart");
    }
  };

  const getProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BackendURL}/api/admin/products/all`, {
        withCredentials: true,
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        console.warn("Failed to load products:", data.message);
      }
    } catch (err) {
      console.error("Get products error:", err);
    }
  }, [BackendURL]);

  const getCartCount = () => {
    let Totalcount = 0;

    for (const items in cart) {
      for (const item in cart[items]) {
        try {
          if (cart[items][item] > 0) {
            Totalcount += cart[items][item];
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    return Totalcount;
  };

  const GetCartAmount = () => {
    let total = 0;

    for (const productId in cart) {
      for (const size in cart[productId]) {
        const quantity = cart[productId][size];
        const productInfo = products.find((p) => p._id === productId);

        if (productInfo) {
          total += productInfo.price * quantity;
        }
      }
    }

    return total;
  };

  const checkLogin = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BackendURL}/api/user/check-auth`, {
        withCredentials: true,
      });

      if (data.success) {
        setIslogin(true);
        setUser(data.user);
        // console.log(data.user);
      } else {
        setIslogin(false);
        setUser(null);
        setCart({});
      }
    } catch (err) {
      console.error("checkLogin error:", err);
      setIslogin(false);
      setUser(null);
      setCart({});
    }
  }, [BackendURL]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (islogin) {
      getCart();
    } else {
      setCart({});
    }
  }, [islogin, getCart]);

  return (
    <ShopContext.Provider
      value={{
        cart,
        setCart,
        products,
        currency,
        addToCart,
        updateQuantity,
        getCart,
        islogin,
        setIslogin,
        getCartCount,
        GetCartAmount,
        BackendURL,
        user,
        setUser,
        Delivery_Fee,
        showSearch,
        setShowSearch,
        search,
        setSearch,
        checkLogin,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
