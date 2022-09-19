import React from "react";
import { Link, useLocation } from "react-router-dom";
import icon from "../../assets/icon.png";
import { FaHome, FaCog, FaTruck, FaCloud } from "react-icons/fa";
import "../../assets/css/nav.css";

const Nav = () => {
    const location = useLocation();
    let page = location.pathname.replace("/", "");
    if (page === "") {
        page = "home";
    }

    return (
        <nav>
            <ul className="navStyle">
                <li>
                    <Link to="/">
                        <img src={icon} alt="logo" className="iconStyle" />
                    </Link>
                </li>
                <li className="listItemStyle">
                    <Link
                        to="/"
                        className={`linkStyle ${page === "home" && "active"}`}>
                        <FaHome size={"40px"} title={"Home"} />
                        <div className="linkText">Home</div>
                    </Link>
                </li>
                <li className="listItemStyle">
                    <Link
                        to="/workers"
                        className={`linkStyle ${
                            page === "workers" && "active"
                        }`}>
                        <FaTruck size={"40px"} title={"Workers"} />
                        <div className="linkText">Workers</div>
                    </Link>
                </li>
                <li className="listItemStyle">
                    <Link
                        to="/pool"
                        className={`linkStyle ${page === "pool" && "active"}`}>
                        <FaCloud size={"40px"} title={"Pool"} />
                        <div className="linkText">Pool</div>
                    </Link>
                </li>
                <li className="listItemStyle">
                    <Link
                        to="/settings"
                        className={`linkStyle ${
                            page === "settings" && "active"
                        }`}>
                        <FaCog size={"40px"} title={"Settings"} />
                        <div className="linkText">Settings</div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
