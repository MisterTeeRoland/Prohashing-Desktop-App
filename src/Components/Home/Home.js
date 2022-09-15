import React from "react";
import { FaHome } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/home.css";
import { Icon } from "coinmarketcap-cryptocurrency-icons";
import NoApiKeyWarning from "../API/NoApiKeyWarning";
import NoBalancesWarning from "../API/NoBalancesWarning";

const Home = ({ settings, balances }) => {
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
                    balances.map(([name, token], index) => (
                        <div className="tokenContainer" key={index}>
                            {token.symbol && (
                                <div className="tokenIcon">
                                    <Icon
                                        i={token.symbol.toLowerCase()}
                                        size={40}
                                    />
                                </div>
                            )}
                            <div className="tokenDetails">
                                <div className="tokenNameBal">
                                    <div className="tokenName">
                                        {token?.name}
                                    </div>
                                    <div className="tokenBalance">
                                        {token?.balance} {token?.symbol}
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
