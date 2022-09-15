import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/home.css";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoBalancesWarning from "../API/NoBalancesWarning";
import EarningsModal from "../Modal/EarningsModal";

const Home = ({ settings, balances }) => {
    const [showEarningsModal, setShowEarningsModal] = useState(false);
    const [earningsData, setEarningsData] = useState(null);

    const openEarningsModal = (balance) => {
        setEarningsData(balance);
        setShowEarningsModal(true);
    };

    const closeEarningsModal = () => {
        setShowEarningsModal(false);
        setEarningsData(null);
    };

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaHome size={"30px"} /> <div className="titleText">Home</div>
            </div>

            <div className="homeContainer">
                {!settings?.apiKey ? (
                    <NoApiKeyWarning />
                ) : balances.length === 0 ? (
                    <NoBalancesWarning />
                ) : (
                    balances.map(([name, token], index) => {
                        //filter out balances below threshold
                        if (token.balance < 0.00000001) {
                            return null;
                        }

                        let icon = null;
                        try {
                            icon = require(`../../../node_modules/cryptocurrency-icons/svg/color/${token?.symbol?.toLowerCase()}.svg`);
                            if (icon === undefined) throw new Error();
                        } catch (e) {
                            const genericIcon = require("../../../node_modules/cryptocurrency-icons/svg/color/generic.svg");
                            icon = genericIcon.default;
                        }

                        return (
                            <div
                                className="tokenContainer"
                                key={index}
                                onClick={() => openEarningsModal(token)}>
                                {token.symbol && (
                                    <div className="tokenIcon">
                                        <img
                                            className="tokenIconImg"
                                            src={icon}
                                            alt={token.name}
                                        />
                                    </div>
                                )}
                                <div className="tokenDetails">
                                    <div className="tokenNameBal">
                                        <div className="tokenName">
                                            {token?.name}
                                        </div>
                                        <div className="tokenBalance">
                                            {token?.balance.toFixed(8)}{" "}
                                            {token?.symbol}
                                        </div>
                                    </div>
                                    <div className="tokenUsdValue">
                                        <div className="tokenCurrencyValue">
                                            ${token?.usdValue?.toFixed(2)}
                                        </div>
                                        <div className="tokenCurrency">USD</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
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
};

export default Home;
