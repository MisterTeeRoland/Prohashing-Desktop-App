import React, { useState } from "react";
import { FaCog, FaInfoCircle } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/settings.css";
import ProhashingApiModal from "../Modal/ProhashingApiModal";

const Settings = ({ settings, onSaveSettings }) => {
    const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
    const [currency, setCurrency] = useState(settings?.currency ?? "USD");
    const [showPHModal, setShowPHModal] = useState(false);

    const saveSettings = () => {
        onSaveSettings({ apiKey, currency });
    };

    const resetSettings = () => {
        setApiKey("");
        setCurrency("USD");
        onSaveSettings({});
    };

    const openPhModal = () => {
        setShowPHModal(true);
    };

    const closePhModal = () => {
        setShowPHModal(false);
    };

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaCog size={"28px"} />{" "}
                <div className="titleText">Settings</div>
            </div>

            <div className="settingsContainer">
                <div className="formControl">
                    <label>
                        Prohashing API Key{" "}
                        <FaInfoCircle
                            onClick={openPhModal}
                            cursor={"pointer"}
                            style={{ marginLeft: "5px" }}
                        />
                    </label>
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
                        onChange={(e) => setCurrency(e.target.value)}>
                        <option value="usd">USD</option>
                    </select>
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

            {showPHModal && <ProhashingApiModal onClose={closePhModal} />}
        </div>
    );
};

export default Settings;
