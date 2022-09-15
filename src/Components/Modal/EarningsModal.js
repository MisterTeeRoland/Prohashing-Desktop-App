import React from "react";
import "../../assets/css/layout.css";
import "../../assets/css/modal.css";

const EarningsModal = ({ data, onClose }) => {
    let icon = null;
    try {
        icon = require(`../../../node_modules/cryptocurrency-icons/svg/color/${data?.symbol?.toLowerCase()}.svg`);
        if (icon === undefined) throw new Error();
    } catch (e) {
        const genericIcon = require("../../../node_modules/cryptocurrency-icons/svg/color/generic.svg");
        icon = genericIcon.default;
    }

    return (
        <div className="modalBackground" onClick={onClose}>
            <div className="modal">
                <div className="modalCloseBox">
                    <div className="modalCloseX">x</div>
                </div>
                <div className="modalTitle">
                    <img src={icon} alt={data.name} className={"modalIcon"} />
                    <div>
                        {data.name}{" "}
                        <div className="modalSymbol">({data.symbol})</div>
                    </div>
                </div>

                <div>Balance: {data.balance}</div>
                <div>Enabled: {data?.enabled?.toString() ?? false}</div>
                <div>Algorithm: {data?.algo}</div>
                <div>Port: {data?.port ?? "null"}</div>
            </div>
        </div>
    );
};

export default EarningsModal;
