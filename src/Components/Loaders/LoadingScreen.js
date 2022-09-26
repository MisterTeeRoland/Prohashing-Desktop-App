import React from "react";
import Icon from "../../assets/icon.png";
import "../../assets/css/loaders.css";

const LoadingScreen = () => {
    return (
        <div className="loadingScreen">
            <div className="loadingContainer">
                <img className="loadingImg" src={Icon} alt="icon" />
                <div className="loadingText">LOADING...</div>
            </div>
        </div>
    );
};

export default LoadingScreen;
