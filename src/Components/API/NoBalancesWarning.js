import React from "react";
import "../../assets/css/layout.css";
import "../../assets/css/alert.css";
import { Link } from "react-router-dom";

const NoBalancesWarning = () => {
    return (
        <div className="noApiKeyWarning warning">
            <div className="warningHeader">WARNING: No Balances to Show</div>
            <div className="warningText">
                You do not have an active API key, which you need to view your
                Prohashing.com data. You can add your API key in the{" "}
                <Link to="/settings">Settings</Link> page.
            </div>
        </div>
    );
};

export default NoBalancesWarning;
