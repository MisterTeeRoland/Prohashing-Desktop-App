import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Nav = () => {
  const navStyle = {
    display: "flex",
    // justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    listStyle: "none",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#fff",
    marginRight: "10px",
  };

  return (
    <nav>
      <img src={logo} alt="logo" />
      <ul style={navStyle}>
        <li>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/workers" style={linkStyle}>
            Workers
          </Link>
        </li>
        <li>
          <Link to="/settings" style={linkStyle}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
