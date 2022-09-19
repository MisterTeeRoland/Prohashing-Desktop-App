import React from "react";
import AlgorithmRow from "./AlgorithmRow";

const AlgorithmTable = ({ algos }) => {
    //convert obj to array
    const algoArray = Object.entries(algos)
        .map(([algorithm, algoStats]) => {
            return {
                ...algoStats,
                name: algorithm,
            };
        })
        .sort((a, b) => {
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="poolAlgorithms">
            {algoArray.map((algo, index) => (
                <AlgorithmRow algo={algo} key={index} />
            ))}
        </div>
    );
};

export default AlgorithmTable;
