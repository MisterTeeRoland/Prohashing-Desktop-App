import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/settings.css";

const Settings = ({ settings, onSaveSettings }) => {
    const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
    const [currency, setCurrency] = useState(settings?.currency ?? "USD");
    const [smallBalance, setSmallBalance] = useState(
        settings?.smallBalance ?? 0.01
    );

    console.log("Settings", settings);

    const saveSettings = () => {
        onSaveSettings({ apiKey, currency, smallBalance });
    };

    const resetSettings = () => {
        setApiKey("");
        setCurrency("USD");
        setSmallBalance(0.01);
        onSaveSettings({});
    };

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaCog size={"28px"} />{" "}
                <div className="titleText">Settings</div>
            </div>

            <div className="settingsContainer">
                <div className="formControl">
                    <label>Prohashing API Key</label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>

                <div className="formControl">
                    <label>Default Display Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="usd">USD</option>
                    </select>
                </div>

                <div className="formControl">
                    <label>Hide Balances Under</label>
                    <input
                        type="number"
                        value={smallBalance}
                        onChange={(e) => setSmallBalance(e.target.value)}
                        min="0"
                    />
                </div>
            </div>

            <div className="buttonContainer">
                <button className="btnPrimary" onClick={saveSettings}>
                    Save
                </button>
                <button className="btnSecondary" onClick={resetSettings}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Settings;
