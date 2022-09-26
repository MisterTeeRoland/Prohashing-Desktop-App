import React, { useState } from "react";
import "../../assets/css/layout.css";
import "../../assets/css/alert.css";
import { Link } from "react-router-dom";
import ProhashingApiModal from "../Modal/ProhashingApiModal";

const NoWorkersWarning = () => {
    const [showPHModal, setShowPHModal] = useState(false);

    const openPhModal = () => {
        setShowPHModal(true);
    };

    const closePhModal = () => {
        setShowPHModal(false);
    };

    return (
        <div className="noApiKeyWarning warning">
            <div className="warningHeader">WARNING: No Workers Connected</div>
            <div className="warningText">
                <div className="warningBold">Troubleshooting tips:</div>
                <div className="warningItem">
                    1. Make sure you have entered a valid{" "}
                    <span className="warningPopup" onClick={openPhModal}>
                        Prohashing API key
                    </span>{" "}
                    in the <Link to="/settings">Settings</Link> page.
                </div>
                <div className="warningItem">
                    2. Make sure that your worker(s) are running and{" "}
                    <a
                        href="https://prohashing.com/tools/miner-configurator/Scrypt"
                        target={"_blank"}
                        rel="noreferrer">
                        connected to a valid Prohashing mining pool.
                    </a>
                </div>
            </div>
            {showPHModal && <ProhashingApiModal onClose={closePhModal} />}
        </div>
    );
};

export default NoWorkersWarning;
