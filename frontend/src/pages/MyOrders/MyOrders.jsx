import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="loading-message">Loading your orders...</div>
      </div>
    );
  }
  
  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <div className="no-orders-message">
            <p>You haven't placed any orders yet</p>
            <button onClick={() => window.location.href = '/'}>
              Start Shopping
            </button>
          </div>
        ) : (
          data
            .slice()
            .reverse()
            .map((order, index) => {
              return (
                <div key={index} className="my-orders-order">
                  <img src={assets.parcel_icon} alt="" />
                  <p>
                    {order.items.map((item, itemIndex) => {
                      if (itemIndex === order.items.length - 1) {
                        return item.name + " x " + item.quantity;
                      } else {
                        return item.name + " x " + item.quantity + ", ";
                      }
                    })}
                  </p>
                  <p>
                    {currency}
                    {order.amount}.00
                  </p>
                  <p>Items: {order.items.length}</p>
                  <p>
                    <span>&#x25cf;</span> <b>{order.status}</b>
                  </p>
                  <button onClick={fetchOrders}>Track Order</button>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default MyOrders;