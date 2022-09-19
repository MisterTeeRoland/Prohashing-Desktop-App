import React, { useState, useEffect, useRef } from "react";
import { FaTruck } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/workers.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoWorkersWarning from "../API/NoWorkersWarning";
import WorkerModal from "../Modal/WorkerModal";
import { convertHashrate } from "../../helpers/utils";
import { sortWorkers } from "../../helpers/Prohashing";
import Worker from "./Worker";

const Workers = React.memo(({ settings, workers, wampSession }) => {
    const [showWorkerModal, setShowWorkerModal] = useState(false);
    const [workerData, setWorkerData] = useState(null);

    const [sortedWorkers, setSortedWorkers] = useState([]);
    const [totalHashrate, setTotalHashrate] = useState({});

    const sub1 = useRef(null);

    const openWorkerModal = (worker) => {
        setWorkerData(worker);
        setShowWorkerModal(true);
    };

    const closeWorkerModal = () => {
        setShowWorkerModal(false);
        setWorkerData(null);
    };

    //handles the initial miner information
    const initialSessionUpdatesReceived = async (updates) => {
        //Handle the initial miner information here.
        updates.forEach((worker, index) => {
            workers.current[worker.uuid] = worker;
        });

        const { sortedWorkers, totalHashrate } = sortWorkers(workers);
        const totalHashrateConverted = convertHashrate(totalHashrate ?? 0);

        setSortedWorkers(sortedWorkers);
        setTotalHashrate(totalHashrateConverted);

        //After handling the initial information, now subscribe to receive future updates.
        sub1.current = await wampSession.current.subscribe(
            `miner_update_diffs_${settings?.apiKey}`,
            onMinerUpdate,
        );
    };

    //handles live miner updates
    const onMinerUpdate = (update) => {
        const worker = update[0];
        //update worker here...
        workers.current[worker.uuid] = {
            ...workers?.current?.[worker.uuid],
            ...worker,
        };

        const { sortedWorkers, totalHashrate } = sortWorkers(workers);
        const totalHashrateConverted = convertHashrate(totalHashrate ?? 0);

        setSortedWorkers(sortedWorkers);
        setTotalHashrate(totalHashrateConverted);
    };

    useEffect(() => {
        if (
            !wampSession.current ||
            !settings?.apiKey ||
            settings?.apiKey?.trim() === ""
        )
            return;

        wampSession.current
            .call("f_all_miner_updates", [settings?.apiKey])
            .then(initialSessionUpdatesReceived);

        const wamp = wampSession.current;

        return () => {
            if (wamp) {
                if (sub1.current) {
                    wamp.unsubscribe(sub1.current);
                    sub1.current = null;
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wampSession, settings]);

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaTruck size={"28px"} />{" "}
                <div className="titleText">Workers</div>
            </div>

            {settings?.apiKey && (
                <div>
                    Total hashrate: {totalHashrate.rate} {totalHashrate.unit}
                </div>
            )}

            <div className="workersContainer">
                {!settings?.apiKey ? (
                    <NoApiKeyWarning />
                ) : !sortedWorkers || sortedWorkers.length === 0 ? (
                    <NoWorkersWarning />
                ) : (
                    sortedWorkers.map((worker, index) => (
                        <Worker
                            worker={worker}
                            index={index}
                            onOpenWorkerModal={openWorkerModal}
                        />
                    ))
                )}
            </div>

            {showWorkerModal && (
                <WorkerModal data={workerData} onClose={closeWorkerModal} />
            )}
        </div>
    );
});

export default Workers;
