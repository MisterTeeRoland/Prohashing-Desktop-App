import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import "../../assets/css/layout.css";
import "../../assets/css/home.css";
import { Icon } from "coinmarketcap-cryptocurrency-icons";

const Home = ({ settings }) => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        setTokens([
            {
                name: "Bitcoin",
                symbol: "BTC",
                balance: 0.0,
                usdValue: 0.0,
            },
            {
                name: "Ethereum",
                symbol: "ETH",
                balance: 0.0,
                usdValue: 0.0,
            },
            {
                name: "Litecoin",
                symbol: "LTC",
                balance: 0.0,
                usdValue: 0.0,
            },
            {
                name: "Dogecoin",
                symbol: "DOGE",
                balance: 0.0,
                usdValue: 0.0,
            },
            {
                name: "Bitcoin SV",
                symbol: "BSV",
                balance: 0.0,
                usdValue: 0.0,
            },
            {
                name: "Maker",
                symbol: "MKR",
                balance: 0.0,
                usdValue: 0.0,
            },
        ]);
    }, []);

    return (
        <div className="phContainer">
            <div className="pageTitle">
                <FaHome size={"30px"} /> <div className="titleText">Home</div>
            </div>

            <div className="homeContainer">
                {tokens.map((token) => (
                    <div className="tokenContainer">
                        <div className="tokenIcon">
                            <Icon i={token.symbol.toLowerCase()} size={40} />
                        </div>
                        <div className="tokenDetails">
                            <div className="tokenNameBal">
                                <div className="tokenName">{token.name}</div>
                                <div className="tokenBalance">
                                    {token.balance} {token.symbol}
                                </div>
                            </div>
                            <div className="tokenUsdValue">
                                <div className="tokenCurrencyValue">
                                    ${token.usdValue.toFixed(2)}
                                </div>
                                <div className="tokenCurrency">USD</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
