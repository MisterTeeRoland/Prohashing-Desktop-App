import React, { useEffect, useRef } from "react";
import { FaCloud } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/pool.css";
import PoolOverview from "./PoolOverview";
import AlgorithmTable from "./AlgorithmTable";

const Pool = ({ poolStats, profitability }) => {
    const stats = useRef({});

    const updatePoolStats = () => {
        if (!poolStats || Object.entries(poolStats).length === 0) return;

        stats.current.total_workers = poolStats.subscriptions_count ?? 0;

        //set all algos
        stats.current.algos = {};
        Object.entries(poolStats.total_hashrate_computed_onlys).forEach(
            ([algo, value]) => {
                stats.current.algos[algo] = {
                    ...stats.current.algos[algo],
                    hashrate: value,
                };
            },
        );
    };

    const updatePoolProfitability = () => {
        if (!profitability || Object.entries(profitability).length === 0)
            return;

        //set all algos
        Object.entries(profitability).forEach(([int, algo]) => {
            stats.current.algos[algo.algorithm_name] = {
                ...stats.current.algos[algo.algorithm_name],
                usd: algo.usd,
                btc: algo.btc,
            };
        });
    };

    useEffect(() => {
        updatePoolStats();
        updatePoolProfitability();
    }, [poolStats, profitability]);

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaCloud size={"28px"} />{" "}
                <div className="titleText">Pool Stats</div>
            </div>

            <div className="poolContainer">
                <PoolOverview poolStats={stats.current} />

                <div className="algoContainer">
                    <div className="tableTitle">Algorithms</div>

                    <div className="tableHead">
                        <div className="tableHeader">Name</div>
                        <div className="tableHeader">Hashrate</div>
                        <div className="tableHeader">Profitability / 24hr</div>
                    </div>
                    {stats.current?.algos ? (
                        <AlgorithmTable algos={stats.current?.algos} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Pool;
