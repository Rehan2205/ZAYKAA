import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.LogoZAYKAA} alt="" style={{ marginLeft: "-14px" }} />
          <p>
            Zaykaa is an ultimate destination for fast, fresh, and delicious
            food delivery right at your doorstep.
          </p>

          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-11111 22222</li>
            <li>contact@zaykaa.com</li>
          </ul>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Footer;
