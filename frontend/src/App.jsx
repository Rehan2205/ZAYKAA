import React, { useState } from "react";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import MyOrders from "./pages/MyOrders/MyOrders";
import SearchResults from "./pages/SearchResults/SearchResults";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import { StoreContext } from "./Context/StoreContext";
import { useContext } from "react";

const App = () => {
  const { showLogin, setShowLogin } = useContext(StoreContext);

  return (
    <>
      <ToastContainer position="top-right" />

      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className="app">
        <div className="navbar-container">
          <Navbar setShowLogin={setShowLogin} />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
