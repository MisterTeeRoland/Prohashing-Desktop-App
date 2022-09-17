import React, { useState } from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/workers.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoWorkersWarning from "../API/NoWorkersWarning";
import WorkerModal from "../Modal/WorkerModal";
import { convertHashrate } from "../../helpers/utils";

const Workers = ({ settings, workers, totalHashrate }) => {
    const [showWorkerModal, setShowWorkerModal] = useState(false);
    const [workerData, setWorkerData] = useState(null);

    const totalHashrateConverted = convertHashrate(totalHashrate);

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

            {settings?.apiKey && (
                <div>
                    Total hashrate: {totalHashrateConverted.rate}{" "}
                    {totalHashrateConverted.unit}
                </div>
            )}

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
