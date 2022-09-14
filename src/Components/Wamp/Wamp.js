import React, { useEffect, useRef } from "react";
import autobahn from "autobahn";

const Wamp = React.memo(({ apiKey, onUpdateBalances, onUpdateWorkers }) => {
    const wampUser = "web";
    const wampPassword = "web";
    const wampConnection = useRef(null);
    const wampSession = useRef(null);

    const balances = {};
    const workers = {};

    //If using node.js, the following code resolves an issue where the Electronic Frontier Foundation's free certificates are not trusted.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const onChallenge = (wampSession, method, extra) => {
        if (method === "wampcra") {
            return autobahn.auth_cra.sign(wampPassword, extra.challenge);
        }
    };

    const connectionOpen = (session, details) => {
        //get initial miner data
        wampSession.current = session;
        wampSession.current
            .call("f_all_miner_updates", [apiKey])
            .then(initialSessionUpdatesReceived);

        //get initial balance data
        wampSession.current
            .call("f_all_balance_updates", [apiKey])
            .then(initialBalanceUpdatesReceived);

        //subscribe to block updates
        wampSession.current.subscribe("found_block_updates", onBlockUpdate);
    };

    //handles found block data
    const onBlockUpdate = (block) => {
        // console.log("BLOCK", block);
        //TODO: if block is found by a miner in the workers array, send notification
    };

    //handles the initial miner information
    const initialSessionUpdatesReceived = (updates) => {
        //Handle the initial miner information here.

        console.log("initial miner values -", updates);
        updates.forEach((worker, index) => {
            workers[worker.miner_name] = worker;
        });

        onUpdateWorkers(workers);

        //After handling the initial information, now subscribe to receive future updates.
        wampSession.current.subscribe(
            `miner_update_diffs_${apiKey}`,
            onMinerUpdate,
        );
    };

    //handles live miner updates
    const onMinerUpdate = (update) => {
        console.log("MINER UPDATE", update);
        // restoreDict(workers, update);
    };

    //handles the initial balance information
    const initialBalanceUpdatesReceived = (updates) => {
        console.log("initial balance values -", updates);
        Object.entries(updates).forEach(([curr, value]) => {
            balances[curr] = {
                name: curr,
                balance: value,
            };
        });

        onUpdateBalances(balances);

        //subscribe to receive future updates.
        wampSession.current.subscribe(
            `balance_updates_${apiKey}`,
            onBalanceUpdate,
        );
    };

    //handles live balance updates
    const onBalanceUpdate = (update) => {
        console.log("BALANCE UPDATE", update);
    };

    useEffect(() => {
        if (!apiKey) {
            wampConnection.current = null;
            wampSession.current = null;
            return;
        }
        try {
            if (!wampConnection.current) {
                wampConnection.current = new autobahn.Connection({
                    url: "wss://live.prohashing.com:443/ws",
                    realm: "mining",
                    authmethods: ["wampcra"],
                    authid: wampUser,
                    onchallenge: onChallenge,
                });
                wampConnection.current.onopen = connectionOpen;
                wampConnection.current.open();
            }
        } catch (e) {
            console.error(e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey]);

    return <></>;
});

export default Wamp;
