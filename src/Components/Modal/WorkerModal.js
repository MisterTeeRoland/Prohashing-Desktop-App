import React from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/modal.css";

const WorkerModal = ({ data, onClose }) => {
    return (
        <div className="modalBackground" onClick={onClose}>
            <div className="modal">
                <div className="modalCloseBox">
                    <div className="modalCloseX">x</div>
                </div>
                <div className="modalTitle">
                    <FaTruck size={"28px"} style={{ marginRight: "10px" }} />
                    <div>{data?.miner_name}</div>
                </div>

                <div>Coin name: {data?.coin_name ?? "null"}</div>
                <div>Algorithm: {data?.algorithm_name ?? "null"}</div>
                <div>Difficulty: {data?.difficulty ?? "null"}</div>
                <div>Hashrate: {data?.hashrate}</div>
                <div>Hardware: {data?.miner_hardware ?? "null"}</div>
                <div>
                    Shares / All Time: {data?.share_count ?? 0} /{" "}
                    {data?.all_time_share_count ?? 0}
                </div>
            </div>
        </div>
    );
};

export default WorkerModal;
