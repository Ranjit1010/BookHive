import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import logo from '../Images/brand-logo-2.png'

const Header = (props) => {
  const [loc, setLoc] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  let locations = [
    {
      latitude: 23.369900,
      longitude: 85.325280,
      placeName: "Ranchi, Jharkhand"
    },
    {
      latitude: 20.272610,
      longitude: 85.833122,
      placeName: "Bhubaneswar, Odisha"
    }
  ];

  return (
    <div className="header">
      <div className="nav-item">
      <img src={logo} alt="Brand Logo" className="brand-logo" />
        <Link to="/">HOME</Link>
        <select className="custom-select" value={loc} onChange={(e) => {
            localStorage.setItem('userLoc', e.target.value);
            setLoc(e.target.value);
          }}>
          {
            locations.map((item, index) => {
            return(
            <option key={index} value={`${item.latitude},${item.longitude}`}>
              {item.placeName}
            </option>
            )
          })
          }
        </select>
        <input
          className="search"
          type="text"
          value={props && props.search}
          onChange={(e) => props.handleSearch && props.handleSearch(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={() => props.handleClick && props.handleClick()}
        >
          <FaSearch />
        </button>
      </div>

      <div className="nav-cart-login">
      {!!localStorage.getItem("token") && (
          <Link to="/my-products">
            <button className="nav-cart-login-btn">MY ADS</button>
          </Link>
        )}
        {!!localStorage.getItem("token") && (
          <Link to="/liked-products">
            <button className="nav-cart-login-btn">FAVOURITES</button>
          </Link>
        )}
        {!!localStorage.getItem("token") && (
          <Link to="/addproduct">
            <button className="nav-cart-login-btn">ADD PRODUCT</button>
          </Link>
        )}
        {!localStorage.getItem("token") ? (
          <Link to="/login">
            <button className="nav-cart-login-btn">LOGIN</button>
          </Link>
        ) : (
          <button onClick={handleLogout}>LOGOUT</button>
        )}
      </div>
    </div>
  );
};

export default Header;
