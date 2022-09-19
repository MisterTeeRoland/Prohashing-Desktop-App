import React from "react";
import { calculateTotalHashrate } from "../../helpers/utils";
import OverviewItem from "./OverviewItem";

const PoolOverview = ({ poolStats }) => {
    return (
        <div className="overview">
            <OverviewItem
                value={poolStats?.total_workers ?? "..."}
                label={"Connected Workers"}
            />
            <OverviewItem
                value={
                    poolStats?.algos
                        ? Object.entries(poolStats?.algos).length
                        : "..."
                }
                label={"Supported Algorithms"}
            />
            <OverviewItem
                value={
                    poolStats?.algos
                        ? calculateTotalHashrate(poolStats?.algos)
                        : "..."
                }
                label={"Total Hashrate"}
            />
        </div>
    );
};

export default PoolOverview;
