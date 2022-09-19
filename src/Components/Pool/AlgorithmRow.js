import React from "react";
import { convertHashrate } from "../../helpers/utils";

const AlgorithmRow = ({ algo }) => {
    const convertedHashrate = convertHashrate(algo?.hashrate ?? 0);

    return (
        <div className="poolAlgorithm" key={algo.name}>
            <div className="poolAlgorithmName poolCol">{algo.name}</div>
            <div className="poolCol">
                {convertedHashrate.rate} {convertedHashrate.unit}
            </div>
            <div className="poolCol">
                <div>{algo?.usd?.toFixed(8) ?? (0).toFixed(8)} USD</div>
                <div>{algo?.btc?.toFixed(8) ?? (0).toFixed(8)} BTC</div>
            </div>
        </div>
    );
};

export default AlgorithmRow;
