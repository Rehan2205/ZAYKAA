import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    setShowLogin,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="login-required">
        <div className="login-required-card">
          <img
            src={assets.basket_icon}
            className="login-required-icon"
            alt="Login Required"
          />
          <h2>Login Required</h2>
          <p>Please login to view and manage your cart.</p>

          <div className="login-required-actions">
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>

            <button className="browse-btn" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCartEmpty = getTotalCartAmount() === 0;

  const handleRemoveItem = (itemId) => {
    const qty = cartItems[itemId];
    for (let i = 0; i < qty; i++) removeFromCart(itemId);
  };

  if (isCartEmpty) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <img
            src={assets.basket_icon}
            alt="Empty cart"
            className="empty-cart-icon"
          />
          <h3>Your Cart is Empty</h3>
          <p>Add delicious food from our menu.</p>
          <button className="explore-menu-btn" onClick={() => navigate("/")}>
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Name</p>
          <p>Price</p>
          <p>Qty</p>
          <p>Total</p>
          <p></p>
        </div>

        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>

                  <div className="cart-quantity-controls">
                    <button onClick={() => removeFromCart(item._id)}>-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)}>+</button>
                  </div>

                  <p>{currency}{item.price * cartItems[item._id]}</p>

                  <p
                    className="cart-items-remove-icon"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    ✕
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Summary</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{currency}{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery</p>
            <p>{currency}{deliveryCharge}</p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>{currency}{getTotalCartAmount() + deliveryCharge}</b>
          </div>

          <button onClick={() => {
              if (!token) {
                setShowLogin(true);
                return;
              }
              navigate("/order");
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
