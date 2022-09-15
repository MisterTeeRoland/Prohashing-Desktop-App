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
                ) : workers.length === 0 ? (
                    <NoWorkersWarning />
                ) : (
                    workers.map((worker, index) => (
                        <div className="workerContainer" key={index}>
                            <div className="workerIcon">
                                <FaTruck size={"30px"} />
                            </div>
                            <div className="workerDetails">
                                <div className="workerInfo">
                                    <div className="workerName">
                                        {worker?.miner_name}
                                    </div>
                                    <div className="workerStatus">
                                        {worker?.algorithm_name}
                                    </div>
                                </div>
                                <div className="workerHashRate">
                                    <div className="hashValue">
                                        {worker?.hashrate}
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
