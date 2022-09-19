import React, { useEffect, useRef } from "react";
import autobahn from "autobahn";
import axios from "axios";
import {
    findCoinGeckoId,
    findCoinGeckoName,
    getCoinGeckoPrices,
} from "../../helpers/CoinGecko";

const axiosInstance = axios.create({
    validateStatus: function (status) {
        return true;
    },
});

const Wamp = React.memo(
    ({
        apiKey,
        currency,
        onUpdateBalances,
        onUpdateWorkers,
        onUpdatePoolStats,
        onUpdateProfitability,
    }) => {
        const wampUser = "web";
        const wampPassword = "web";
        const wampConnection = useRef(null);
        const wampSession = useRef(null);
        const allTokens = useRef(null);
        const currentCurrency = useRef(null);

        const balances = useRef({});
        const workers = useRef({});
        const poolStats = useRef({});

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

            //subscribe to pool statistics
            wampSession.current
                .call("f_all_general_updates")
                .then(initialGeneralUpdatesReceived);

            //subscribe to profitability updates
            wampSession.current
                .call("f_all_profitability_updates")
                .then(initialProfitabilityUpdatesReceived);
        };

        const initialProfitabilityUpdatesReceived = (profitabilityUpdates) => {
            onUpdateProfitability(profitabilityUpdates);
            wampSession.current.subscribe(
                "profitability_updates",
                onProfitabilityUpdate,
            );
        };

        const onProfitabilityUpdate = (profitabilityUpdate) => {
            onUpdateProfitability(profitabilityUpdate[0]);
        };

        const initialGeneralUpdatesReceived = (generalUpdates) => {
            poolStats.current = generalUpdates;
            onUpdatePoolStats(generalUpdates);

            wampSession.current.subscribe(`general_updates`, onGeneralUpdates);
        };

        const onGeneralUpdates = (generalUpdates) => {
            poolStats.current = generalUpdates[0];
            onUpdatePoolStats(generalUpdates[0]);
        };

        //handles found block data
        const onBlockUpdate = (foundBlock) => {
            const block = foundBlock[0];
            console.log("BLOCK", block);
            //if block is found by a miner in the workers array, send notification
            if (workers.hasOwnProperty(block.worker_name)) {
                // const notificationTitle = "Block Found!";
                const notificationBody = `You found ${block.coin_name} block ${block.block_height} (${block.algorithm})!`;
                new Notification(notificationBody);
            }
        };

        //handles the initial miner information
        const initialSessionUpdatesReceived = (updates) => {
            //Handle the initial miner information here.
            updates.forEach((worker, index) => {
                workers.current[worker.uuid] = worker;
            });

            sortWorkers();

            //After handling the initial information, now subscribe to receive future updates.
            wampSession.current.subscribe(
                `miner_update_diffs_${apiKey}`,
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

            sortWorkers();
        };

        //takes the workers object and sorts by hashrate descending
        const sortWorkers = () => {
            const sortedWorkers = [];
            let totalHashrate = 0;
            Object.values(workers?.current).forEach((worker) => {
                sortedWorkers.push(worker);
                totalHashrate += worker.hashrate;
            });

            if (sortedWorkers.length > 1) {
                sortedWorkers.sort((a, b) => {
                    return b.hashrate - a.hashrate;
                });
            }

            onUpdateWorkers({
                sortedWorkers,
                totalHashrate,
            });
        };

        //finds the token information from the token list
        const findPHToken = (token) => {
            try {
                if (
                    !allTokens.current ||
                    Object.values(allTokens.current).length === 0
                ) {
                    throw new Error("No tokens found");
                }
                const obj = Object.values(allTokens.current).find(
                    (t) => t.name === token,
                );
                return obj;
            } catch (e) {
                console.error("Error finding token", e);
                return null;
            }
        };

        //handles the initial balance information
        const initialBalanceUpdatesReceived = async (updates) => {
            Object.entries(updates).forEach(([curr, value]) => {
                //make a call to get the info for the currency
                const phToken = findPHToken(curr);
                if (phToken) {
                    balances.current[curr] = {
                        name: phToken?.name ?? curr,
                        symbol: phToken?.abbreviation ?? null,
                        balance: value,
                        enabled: phToken?.enabled ?? false,
                        algo: phToken?.algo ?? null,
                        port: phToken?.port ?? null,
                    };
                }
            });

            sortBalances();

            //subscribe to receive future updates.
            wampSession.current.subscribe(
                `balance_updates_${apiKey}`,
                onBalanceUpdate,
            );
        };

        //handles live balance updates
        const onBalanceUpdate = (update) => {
            const updatedCoin = update[0];

            //update balance here...
            if (balances.current.hasOwnProperty(updatedCoin.coin)) {
                balances.current[updatedCoin.coin].balance +=
                    updatedCoin.balance;
            } else {
                balances.current[updatedCoin.coin] = {
                    name: updatedCoin.coin,
                    balance: updatedCoin.balance,
                };
            }

            sortBalances();
        };

        //takes the balances object and sorts by balance descending
        const sortBalances = async () => {
            let sortedBalances = [];
            Object.entries(balances.current).forEach((balance) => {
                sortedBalances.push(balance);
            });

            //filter out balances less than prohashing's threshold
            sortedBalances = sortedBalances.filter(
                (b) => b[1].balance > 0.00000001,
            );

            //for each token, get the current conversion value
            const idList = sortedBalances
                .map((token) => {
                    const id = findCoinGeckoId(token[1]);
                    return id;
                })
                .filter((id) => id !== undefined);

            //update prices
            const prices = await getCoinGeckoPrices(
                idList,
                currentCurrency.current,
            );

            let totalValue = 0;

            Object.entries(prices).forEach(([id, value]) => {
                const rate = value[currentCurrency.current];
                const name = findCoinGeckoName(id);

                //save the conversion rate && update the usd balance
                sortedBalances.forEach((token, index) => {
                    if (token[1].name === name) {
                        sortedBalances[index][1].rate = rate;
                        sortedBalances[index][1].usdValue =
                            token[1].balance * rate;

                        totalValue += sortedBalances[index][1].usdValue;
                    }
                });
            });

            //sort by conversion value descending
            if (sortedBalances.length > 1) {
                sortedBalances.sort((a, b) => {
                    return b[1].usdValue - a[1].usdValue;
                });
            }

            onUpdateBalances({
                sortedBalances,
                totalValue,
            });
        };

        const getProhashingTokens = async () => {
            const request = await axiosInstance.get(
                "https://prohashing.com/api/v1/currencies",
            );

            if (request.status === 200) {
                const data = request.data.data;
                allTokens.current = data;
            }
        };

        useEffect(() => {
            if (!apiKey) {
                wampConnection.current = null;
                wampSession.current = null;
                return;
            }
            if (
                !currentCurrency.current ||
                currentCurrency.current !== currency
            ) {
                currentCurrency.current = currency;
                if (wampConnection.current) sortBalances();
            }

            try {
                if (!wampConnection.current) {
                    if (!allTokens.current) {
                        getProhashingTokens();
                    }
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
        }, [apiKey, currency]);

        return <></>;
    },
);

export default Wamp;
