import React, { useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/workers.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";

const Workers = ({ settings }) => {
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        setWorkers([
            {
                name: "Worker 1",
                hashRate: 0.0,
                lastShare: 0.0,
                status: "Online",
            },
        ]);
    }, []);

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaTruck size={"28px"} />{" "}
                <div className="titleText">Workers</div>
            </div>

            <div className="workersContainer">
                {!settings?.apiKey ? (
                    <NoApiKeyWarning />
                ) : (
                    workers.map((worker, index) => (
                        <div className="workerContainer" key={index}>
                            <div className="workerIcon">
                                <FaTruck size={"30px"} />
                            </div>
                            <div className="workerDetails">
                                <div className="workerInfo">
                                    <div className="workerName">
                                        {worker.name}
                                    </div>
                                    <div className="workerStatus">
                                        {worker.status === "Online" ? (
                                            <div className="workerOnline"></div>
                                        ) : (
                                            <div className="workerOffline"></div>
                                        )}
                                        {worker.status}
                                    </div>
                                </div>
                                <div className="workerHashRate">
                                    <div className="hashValue">
                                        {worker.hashRate}
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
