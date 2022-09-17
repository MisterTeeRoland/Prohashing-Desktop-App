import React from "react";
import "../../assets/css/layout.css";
import "../../assets/css/modal.css";

const ConfirmResetSettingsModal = ({ onConfirm, onClose }) => {
    return (
        <div className="modalBackground" onClick={onClose}>
            <div className="modal">
                <div className="modalCloseBox">
                    <div className="modalCloseX">x</div>
                </div>
                <div className="modalTitle">Reset Settings</div>
                <div>Are you sure you want to reset your settings?</div>
                <br></br>
                <div>
                    This will clear your API key and you will no longer be able
                    to view your earnings and workers until you re-enter your
                    API key.
                </div>
                <br></br>
                <div className="modalButtonBox">
                    <button className="btnPrimary" onClick={onConfirm}>
                        Yes, reset settings
                    </button>

                    <button className="btnSecondary" onClick={onClose}>
                        No, keep settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmResetSettingsModal;
