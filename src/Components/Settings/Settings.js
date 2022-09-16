import React, { useState, useEffect } from "react";
import { FaCog, FaInfoCircle } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/settings.css";
import ProhashingApiModal from "../Modal/ProhashingApiModal";
import ConfirmResetSettingsModal from "../Modal/ConfirmResetSettingsModal";
import CoinGecko from "coingecko-api";

const CoinGeckoClient = new CoinGecko();

const Settings = ({ settings, onSaveSettings, onSendToast }) => {
    const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
    const [currency, setCurrency] = useState(settings?.currency ?? "USD");
    const [showPHModal, setShowPHModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [supportedCurrencies, setSupportedCurrencies] = useState([]);

    const saveSettings = () => {
        onSaveSettings({ apiKey, currency });
        onSendToast("Settings saved!", "success");
    };

    const resetSettings = () => {
        setApiKey("");
        setCurrency("USD");
        onSaveSettings({});
        onSendToast("Settings have been reset.", "info");
    };

    const openPhModal = () => {
        setShowPHModal(true);
    };

    const closePhModal = () => {
        setShowPHModal(false);
    };

    const showConfirmReset = () => {
        setShowConfirmModal(true);
    };

    const hideConfirmReset = () => {
        setShowConfirmModal(false);
    };

    const getSupportedVSCurrencies = async () => {
        const response = await CoinGeckoClient.simple.supportedVsCurrencies();
        const data = response.data;
        setSupportedCurrencies(data);
    };

    useEffect(() => {
        if (supportedCurrencies.length === 0) {
            getSupportedVSCurrencies();
        }
    }, []);

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
                        {supportedCurrencies.map((c) => (
                            <option key={c} value={c}>
                                {c.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="buttonContainer">
                <button className="btnPrimary" onClick={saveSettings}>
                    Save
                </button>
                <button className="btnSecondary" onClick={showConfirmReset}>
                    Reset
                </button>
            </div>

            {showPHModal && <ProhashingApiModal onClose={closePhModal} />}
            {showConfirmModal && (
                <ConfirmResetSettingsModal
                    onConfirm={resetSettings}
                    onClose={hideConfirmReset}
                />
            )}
        </div>
    );
};

export default Settings;
