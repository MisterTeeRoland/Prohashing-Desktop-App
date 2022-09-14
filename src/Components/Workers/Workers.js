import React from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/workers.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoWorkersWarning from "../API/NoWorkersWarning";

const Workers = ({ settings, workers }) => {
    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaTruck size={"28px"} />{" "}
                <div className="titleText">Workers</div>
            </div>

            <div className="workersContainer">
                {!settings?.apiKey ? (
                    <NoApiKeyWarning />
                ) : Object.entries(workers).length === 0 ? (
                    <NoWorkersWarning />
                ) : (
                    Object.entries(workers).map((worker, index) => (
                        <div className="workerContainer" key={index}>
                            <div className="workerIcon">
                                <FaTruck size={"30px"} />
                            </div>
                            <div className="workerDetails">
                                <div className="workerInfo">
                                    <div className="workerName">
                                        {worker?.name}
                                    </div>
                                    <div className="workerStatus">
                                        {worker?.status === "Online" ? (
                                            <div className="workerOnline"></div>
                                        ) : (
                                            <div className="workerOffline"></div>
                                        )}
                                        {worker?.status}
                                    </div>
                                </div>
                                <div className="workerHashRate">
                                    <div className="hashValue">
                                        {worker?.hashRate}
                                    </div>
                                    <div className="hashRatio">H/s</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Workers;
