import React from "react";
import "../../assets/css/layout.css";
import "../../assets/css/modal.css";

const EarningsModal = ({ data, onClose }) => {
    return (
        <div className="modalBackground" onClick={onClose}>
            <div className="modal">
                <div className="modalCloseBox">
                    <div className="modalCloseX">x</div>
                </div>
                <div className="modalTitle">Earnings Data</div>

                <div>{JSON.stringify(data)}</div>
            </div>
        </div>
    );
};

export default EarningsModal;
