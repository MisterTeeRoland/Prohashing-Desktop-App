import React, { useEffect, useState, useRef } from "react";
import { FaHome } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/home.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoBalancesWarning from "../API/NoBalancesWarning";
import EarningsModal from "../Modal/EarningsModal";
import { findPHToken } from "../../helpers/Prohashing";
import { sortBalances } from "../../helpers/Prohashing";
import Coin from "./Coin";

const Home = React.memo(({ settings, wampSession, allTokens }) => {
    const [showEarningsModal, setShowEarningsModal] = useState(false);
    const [earningsData, setEarningsData] = useState(null);

    const [sortedBalances, setSortedBalances] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    const balances = useRef({});
    const sub1 = useRef(null);

    const openEarningsModal = (balance) => {
        setEarningsData(balance);
        setShowEarningsModal(true);
    };

    const closeEarningsModal = () => {
        setShowEarningsModal(false);
        setEarningsData(null);
    };

    const initialBalanceUpdatesReceived = async (updates) => {
        Object.entries(updates).forEach(([curr, value]) => {
            //make a call to get the info for the currency
            const phToken = findPHToken(curr, allTokens);
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

        const { sortedBalances: abc, totalValue: def } = await sortBalances(
            balances,
            settings?.currency ?? "usd",
        );

        setSortedBalances(abc);
        setTotalValue(def);

        //subscribe to receive future updates.
        sub1.current = await wampSession.current.subscribe(
            `balance_updates_${settings?.apiKey}`,
            onBalanceUpdate,
        );
    };

    //handles live balance updates
    const onBalanceUpdate = async (update) => {
        const updatedCoin = update[0];

        //update balance here...
        if (balances.current.hasOwnProperty(updatedCoin.coin)) {
            balances.current[updatedCoin.coin].balance += updatedCoin.balance;
        } else {
            balances.current[updatedCoin.coin] = {
                name: updatedCoin.coin,
                balance: updatedCoin.balance,
            };
        }

        const { sortedBalances: abc, totalValue: def } = await sortBalances(
            balances,
            settings?.currency ?? "usd",
        );

        setSortedBalances(abc);
        setTotalValue(def);
    };

    useEffect(() => {
        if (
            !wampSession.current ||
            !settings?.apiKey ||
            settings?.apiKey?.trim() === ""
        )
            return;

        wampSession.current
            .call("f_all_balance_updates", [settings?.apiKey])
            .then(initialBalanceUpdatesReceived);

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
                <FaHome size={"30px"} /> <div className="titleText">Home</div>
            </div>

            {settings?.currency && (
                <div>
                    Current earnings: ${(totalValue || 0).toFixed(3)}{" "}
                    {settings?.currency.toUpperCase()}
                </div>
            )}

            <div className="homeContainer">
                {!settings?.apiKey ? (
                    <NoApiKeyWarning />
                ) : !sortedBalances || sortedBalances.length === 0 ? (
                    <NoBalancesWarning />
                ) : (
                    sortedBalances.map(([name, token], index) => (
                        <Coin
                            key={index}
                            token={token}
                            currency={settings?.currency ?? "usd"}
                            onOpenEarningsModal={openEarningsModal}
                        />
                    ))
                )}
            </div>

            {showEarningsModal && (
                <EarningsModal
                    data={earningsData}
                    onClose={closeEarningsModal}
                />
            )}
        </div>
    );
});

export default Home;
