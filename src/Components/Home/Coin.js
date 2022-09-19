import React from "react";

const Coin = React.memo(({ token, index, currency, onOpenEarningsModal }) => {
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
            onClick={() => onOpenEarningsModal(token)}>
            {token.symbol && (
                <div className="tokenIcon">
                    <img className="tokenIconImg" src={icon} alt={token.name} />
                </div>
            )}
            <div className="tokenDetails">
                <div className="tokenNameBal">
                    <div className="tokenName">{token?.name}</div>
                    <div className="tokenBalance">
                        {token?.balance.toFixed(8)} {token?.symbol}
                    </div>
                </div>
                <div className="tokenUsdValue">
                    <div className="tokenCurrencyValue">
                        $
                        {token?.usdValue?.toFixed(8) ??
                            parseFloat("0.00").toFixed(8)}
                    </div>
                    <div className="tokenCurrency">
                        {currency?.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Coin;
