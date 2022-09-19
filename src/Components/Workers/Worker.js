import React from "react";
import { convertHashrate } from "../../helpers/utils";
import { FaTruck } from "react-icons/fa";

const Worker = React.memo((worker, index, onOpenWorkerModal) => {
    const workerHash = convertHashrate(worker.hashrate);
    return (
        <div
            className="workerContainer"
            key={index}
            onClick={() => onOpenWorkerModal(worker)}>
            <div className="workerIcon">
                <FaTruck size={"30px"} />
            </div>
            <div className="workerDetails">
                <div className="workerInfo">
                    <div className="workerName">{worker?.miner_name}</div>
                    <div className="workerStatus">
                        {worker?.algorithm_name}{" "}
                        {worker?.coin_name ? `- ${worker.coin_name}` : ""}
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
});

export default Worker;
