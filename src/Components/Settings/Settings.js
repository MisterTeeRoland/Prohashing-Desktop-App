import React, { useEffect, useState } from "react";
import { FaCog, FaInfoCircle } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/settings.css";
import ProhashingApiModal from "../Modal/ProhashingApiModal";
import ConfirmResetSettingsModal from "../Modal/ConfirmResetSettingsModal";

const Settings = React.memo(
    ({ settings, allCurrencies, onSaveSettings, onSendToast }) => {
        const [apiKey, setApiKey] = useState(settings?.apiKey ?? "");
        const [currency, setCurrency] = useState(settings?.currency ?? "USD");
        const [showPHModal, setShowPHModal] = useState(false);
        const [showConfirmModal, setShowConfirmModal] = useState(false);

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

        useEffect(() => {
            const pageTitle = document.querySelector("title");
            if (pageTitle) {
                pageTitle.innerText = "Settings | Prohashing Monitor";
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
                            {allCurrencies.current.map((c) => (
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
    },
);

export default Settings;
