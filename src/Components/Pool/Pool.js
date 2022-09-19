import React, { useEffect, useRef, useState } from "react";
import { FaCloud } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/pool.css";
import PoolOverview from "./PoolOverview";
import AlgorithmTable from "./AlgorithmTable";

const Pool = React.memo(({ wampSession }) => {
    const stats = useRef({});

    const sub1 = useRef(null);
    const sub1Loading = useRef(false);
    const sub2 = useRef(null);
    const sub2Loading = useRef(false);

    const poolStats = useRef({});
    const profitability = useRef({});

    const [, setRerender] = useState(Date.now());

    const updatePoolStats = () => {
        if (
            !poolStats.current ||
            Object.entries(poolStats.current).length === 0
        )
            return;

        stats.current.total_workers =
            poolStats.current.subscriptions_count ?? 0;

        //set all algos
        if (!stats.current.algos) {
            stats.current.algos = {};
        }
        Object.entries(poolStats.current.total_hashrate_computed_onlys).forEach(
            ([algo, value]) => {
                stats.current.algos[algo] = {
                    ...stats.current.algos[algo],
                    hashrate: value,
                };
            },
        );
        setRerender(Date.now());
    };

    const updatePoolProfitability = () => {
        if (
            !profitability.current ||
            Object.entries(profitability.current).length === 0
        )
            return;

        //set all algos
        if (!stats.current.algos) {
            stats.current.algos = {};
        }
        Object.entries(profitability.current).forEach(([int, algo]) => {
            stats.current.algos[algo.algorithm_name] = {
                ...stats.current.algos[algo.algorithm_name],
                usd: algo.usd,
                btc: algo.btc,
            };
        });
        setRerender(Date.now());
    };

    const initialProfitabilityUpdatesReceived = async (
        profitabilityUpdates,
    ) => {
        profitability.current = profitabilityUpdates;
        sub2.current = await wampSession.current.subscribe(
            "profitability_updates",
            onProfitabilityUpdate,
        );
        updatePoolProfitability();
    };

    const onProfitabilityUpdate = (profitabilityUpdate) => {
        profitability.current = profitabilityUpdate[0];
        updatePoolProfitability();
    };

    const initialGeneralUpdatesReceived = async (generalUpdates) => {
        poolStats.current = generalUpdates;

        sub1.current = await wampSession.current.subscribe(
            `general_updates`,
            onGeneralUpdates,
        );
        updatePoolStats();
    };

    const onGeneralUpdates = (generalUpdates) => {
        poolStats.current = generalUpdates[0];
        updatePoolStats();
    };

    const unsub = async (wamp, sub) => {
        if (sub.current && wamp) {
            await sub.current.unsubscribe();
            sub.current = null;
        }
    };

    useEffect(() => {
        if (!wampSession.current) return;

        if (!sub1.current && !sub1Loading.current) {
            sub1Loading.current = true;
            //subscribe to pool statistics
            wampSession.current
                .call("f_all_general_updates")
                .then(initialGeneralUpdatesReceived);
        }

        if (!sub2.current && !sub2Loading.current) {
            sub2Loading.current = true;
            //subscribe to profitability updates
            wampSession.current
                .call("f_all_profitability_updates")
                .then(initialProfitabilityUpdatesReceived);
        }

        const wamp = wampSession.current;

        return () => {
            if (wamp) {
                if (sub1.current) {
                    unsub(wamp, sub1);
                }
                if (sub2.current) {
                    unsub(wamp, sub2);
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    {stats.current?.algos && (
                        <AlgorithmTable algos={stats.current?.algos} />
                    )}
                </div>
            </div>
        </div>
    );
});

export default Pool;
