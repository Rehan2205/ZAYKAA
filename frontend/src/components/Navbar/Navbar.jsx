import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { getTotalCartAmount, token, logout } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleProfileDropdown = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setShowProfileDropdown((prev) => !prev);
    }
  };

  // Scroll-based active menu (home page only)
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        const scrollPosition = window.scrollY + 200;
        const exploreMenuSection = document.getElementById("explore-menu");
        const footerSection = document.getElementById("footer");

        if (footerSection && scrollPosition >= footerSection.offsetTop - 100) {
          setMenu("contact");
        } else if (
          exploreMenuSection &&
          scrollPosition >= exploreMenuSection.offsetTop
        ) {
          setMenu("menu");
        } else {
          setMenu("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Route-based active state
  useEffect(() => {
    if (location.pathname === "/cart") setMenu("cart");
    else if (location.pathname === "/myorders") setMenu("orders");
    else if (location.pathname === "/order") setMenu("checkout");
    else if (location.pathname.startsWith("/search")) setMenu("search");
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <div className="navbar">
      <Link to="/">
        <img className="LogoZAYKAA" src={assets.LogoZAYKAA} alt="Zaykaa" />
      </Link>

      {isHomePage && (
        <ul className="navbar-menu">
          <Link
            to="/"
            className={menu === "home" ? "active" : ""}
            onClick={() => setMenu("home")}
          >
            Home
          </Link>

          <a
            href="#explore-menu"
            className={menu === "menu" ? "active" : ""}
            onClick={() => setMenu("menu")}
          >
            Menu
          </a>

          <a
            href="#footer"
            className={menu === "contact" ? "active" : ""}
            onClick={() => setMenu("contact")}
          >
            Contact Us
          </a>
        </ul>
      )}

      <div className="navbar-right">
        <div className="navbar-search">
          <input
            className="search-input"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <img src={assets.search_icon} alt="Search" />
          </button>
        </div>

        <Link
          to="/cart"
          className={`navbar-search-icon ${
            menu === "cart" ? "active-icon" : ""
          }`}
        >
          <img src={assets.basket_icon} alt="Cart" />
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </Link>

        <div className="navbar-profile" ref={profileRef}>
          <img
            src={assets.profile_icon}
            alt="Profile"
            onClick={toggleProfileDropdown}
          />

          {token && (
            <ul
              className="navbar-profile-dropdown"
              style={{ display: showProfileDropdown ? "flex" : "none" }}
            >
              <li
                onClick={() => {
                  navigate("/myorders");
                  setShowProfileDropdown(false);
                }}
              >
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
