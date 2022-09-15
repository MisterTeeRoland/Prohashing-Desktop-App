import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/workers.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoWorkersWarning from "../API/NoWorkersWarning";
import WorkerModal from "../Modal/WorkerModal";

const Workers = ({ settings, workers }) => {
    const [showWorkerModal, setShowWorkerModal] = useState(false);
    const [workerData, setWorkerData] = useState(null);

    const convertHashrate = (rate) => {
        rate = parseFloat(rate);
        let unit = "H/s";
        if (rate >= 1000) {
            rate /= 1000;
            unit = "KH/s";
        }
        if (rate >= 1000) {
            rate /= 1000;
            unit = "MH/s";
        }
        if (rate >= 1000) {
            rate /= 1000;
            unit = "GH/s";
        }
        if (rate >= 1000) {
            rate /= 1000;
            unit = "TH/s";
        }
        if (rate >= 1000) {
            rate /= 1000;
            unit = "PH/s";
        }
        return {
            rate: rate.toFixed(3),
            unit,
        };
    };

    const openWorkerModal = (worker) => {
        setWorkerData(worker);
        setShowWorkerModal(true);
    };

    const closeWorkerModal = () => {
        setShowWorkerModal(false);
        setWorkerData(null);
    };

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
                    workers.map((worker, index) => {
                        const workerHash = convertHashrate(worker.hashrate);
                        return (
                            <div
                                className="workerContainer"
                                key={index}
                                onClick={() => openWorkerModal(worker)}>
                                <div className="workerIcon">
                                    <FaTruck size={"30px"} />
                                </div>
                                <div className="workerDetails">
                                    <div className="workerInfo">
                                        <div className="workerName">
                                            {worker?.miner_name}
                                        </div>
                                        <div className="workerStatus">
                                            {worker?.algorithm_name}{" "}
                                            {worker?.coin_name
                                                ? `- ${worker.coin_name}`
                                                : ""}
                                        </div>
                                    </div>
                                    <div className="workerHashRate">
                                        <div className="hashValue">
                                            {workerHash.rate} {workerHash.unit}
                                        </div>
                                        <div className="hashRatio">
                                            {worker?.share_count ?? 0} shares
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showWorkerModal && (
                <WorkerModal data={workerData} onClose={closeWorkerModal} />
            )}
        </div>
    );
};

export default Workers;
