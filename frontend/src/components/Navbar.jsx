import React from "react";
import "../componentStyles/Navbar.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">ShopEasy</Link>
        </div>

        {/* Links */}
        <div className="navbar-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Icons */}
        <div className="navbar-icons">
          {/* Search Box */}
          <div className="search-container">
            <form className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
              />
              <button className="search-icon">
                <SearchIcon focusable='false' />
              </button>
            </form>
          </div>

          {/* Cart */}
          <div className="cart-container">
            <Link to="/cart">
              <ShoppingCartIcon className="icon" />
              <span className="cart-badge">6</span>
            </Link>
          </div>

          {/* Register */}
          <Link to="/register" className="register-link">
            <button className="register-btn">
              <PersonAddIcon className="icon" />
            </button>
          </Link>
          <div className="navbar-hamburger">
            <CloseIcon className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
