import React from "react";

const OverviewItem = ({ value, label }) => {
    return (
        <div className="overviewItem">
            <div className="overviewValue">{value}</div>
            <div className="overviewLabel">{label}</div>
        </div>
    );
};

export default OverviewItem;
