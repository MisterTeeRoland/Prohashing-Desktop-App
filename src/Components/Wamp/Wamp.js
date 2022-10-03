import React, { useEffect, useRef } from "react";
import autobahn from "autobahn";

const Wamp = React.memo(({ apiKey, wampSession, workers }) => {
    const wampUser = "web";
    const wampPassword = "web";
    const wampConnection = useRef(null);

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

        //subscribe to block updates
        wampSession.current.subscribe("found_block_updates", onBlockUpdate);
    };

    //handles found block data
    const onBlockUpdate = (foundBlock) => {
        const block = foundBlock[0];
        console.log("BLOCK", block, workers.current);
        //if block is found by a miner in the workers array, send notification
        if (workers.current.hasOwnProperty(block.worker_name)) {
            // const notificationTitle = "Block Found!";
            const notificationBody = `You found ${block.coin_name} block ${block.block_height} (${block.algorithm})!`;
            new Notification(notificationBody);
        }
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
