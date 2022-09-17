import React, { useEffect, useRef } from "react";
import autobahn from "autobahn";
import axios from "axios";
import CoinGecko from "coingecko-api";
import { coinList } from "../../assets/coinList";

const CoinGeckoClient = new CoinGecko();

const axiosInstance = axios.create({
    validateStatus: function (status) {
        return true;
    },
});

const Wamp = React.memo(
    ({ apiKey, currency, onUpdateBalances, onUpdateWorkers }) => {
        const wampUser = "web";
        const wampPassword = "web";
        const wampConnection = useRef(null);
        const wampSession = useRef(null);
        const allTokens = useRef(null);
        const currentCurrency = useRef(null);

        const balances = useRef({});
        const workers = useRef({});

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
        const onBlockUpdate = (foundBlock) => {
            const block = foundBlock[0];
            console.log("BLOCK", block);
            //if block is found by a miner in the workers array, send notification
            if (workers.hasOwnProperty(block.worker_name)) {
                // const notificationTitle = "Block Found!";
                const notificationBody = `You found ${block.coin_name} block ${block.block_height}!`;
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
            Object.values(workers?.current).forEach((worker) => {
                sortedWorkers.push(worker);
            });

            if (sortedWorkers.length > 1) {
                sortedWorkers.sort((a, b) => {
                    return b.hashrate - a.hashrate;
                });
            }

            onUpdateWorkers(sortedWorkers);
        };

        //finds the token information from the token list
        const findPHToken = (token) => {
            try {
                const obj = Object.values(allTokens.current).find(
                    (t) => t.name === token,
                );
                return obj;
            } catch (e) {
                console.error("Error finding token", e);
                return null;
            }
        };

        const findCoinGeckoId = (token) => {
            const obj = Object.values(coinList).find(
                (t) => t.name === token.name,
            );
            return obj?.id;
        };

        const findCoinGeckoName = (id) => {
            const obj = Object.values(coinList).find((t) => t.id === id);
            return obj?.name;
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

        const getCoinGeckoPrices = async (idList) => {
            let data = {};
            try {
                const response = await CoinGeckoClient.simple.price({
                    ids: idList,
                    vs_currencies: currentCurrency.current,
                });
                data = response?.data ?? {};
            } catch (error) {
                console.error("GCGP error", error);
            }
            return data;
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
            const prices = await getCoinGeckoPrices(idList);

            Object.entries(prices).forEach(([id, value]) => {
                const rate = value[currentCurrency.current];
                const name = findCoinGeckoName(id);

                //save the conversion rate && update the usd balance
                sortedBalances.forEach((token, index) => {
                    if (token[1].name === name) {
                        sortedBalances[index][1].rate = rate;
                        sortedBalances[index][1].usdValue =
                            token[1].balance * rate;
                    }
                });
            });

            //sort by conversion value descending
            if (sortedBalances.length > 1) {
                sortedBalances.sort((a, b) => {
                    return b[1].usdValue - a[1].usdValue;
                });
            }

            onUpdateBalances(sortedBalances);
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
                sortBalances();
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
