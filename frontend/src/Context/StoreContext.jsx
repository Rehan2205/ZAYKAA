import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { menu_list as staticMenuList } from "../assets/assets";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  // const url = "http://localhost:4000";
  const url = "https://zaykaa-backend.onrender.com";

  const [food_list, setFoodList] = useState([]);
  const [menu_list] = useState(staticMenuList);
  const [showLogin, setShowLogin] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : {};
  });
  const [token, setToken] = useState("");
  const currency = "₹";
  const deliveryCharge = 50;

  const api = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token, url]);

  const persistCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => {
        const updated = {
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1,
        };
        persistCart(updated);
        return updated;
      });

      if (!token) return;

      try {
        await api.post("/api/cart/add", { itemId });
      } catch (err) {
        console.error("Add to cart failed");
      }
    },
    [api, token]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      setCartItems((prev) => {
        const updated = { ...prev };
        if (!updated[itemId]) return prev;

        updated[itemId] -= 1;
        if (updated[itemId] <= 0) delete updated[itemId];

        persistCart(updated);
        return updated;
      });

      if (!token) return;

      try {
        await api.post("/api/cart/remove", { itemId });
      } catch (err) {
        console.error("Remove from cart failed");
      }
    },
    [api, token]
  );

  const getTotalCartAmount = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = food_list.find((item) => item._id === id);
      return product ? total + product.price * qty : total;
    }, 0);
  }, [cartItems, food_list]);

  const fetchFoodList = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch food list");
    }
  }, []);

  const loadCartData = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data?.cartData || {});
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  }, [token, url]);

  const logout = useCallback(() => {
    setToken("");
    setCartItems({});
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
  }, []);

  useEffect(() => {
    fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      const decoded = JSON.parse(atob(savedToken.split(".")[1]));
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        setToken("");
      } else {
        setToken(savedToken);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken("");
    }
  }, [fetchFoodList]);

  useEffect(() => {
    if (token) {
      loadCartData();
    }
  }, [token, loadCartData]);

  const contextValue = useMemo(
    () => ({
      url,
      food_list,
      menu_list,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      token,
      setToken,
      setCartItems,
      currency,
      deliveryCharge,
      logout,
      showLogin,
      setShowLogin,
      loadCartData,
    }),
    [
      food_list,
      menu_list,
      cartItems,
      token,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      logout,
      showLogin,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
