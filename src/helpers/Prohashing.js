import axios from "axios";
import {
    findCoinGeckoId,
    findCoinGeckoName,
    getCoinGeckoPrices,
} from "./CoinGecko";
const axiosInstance = axios.create({
    validateStatus: function (status) {
        return true;
    },
});

// export const getInitialBalanceData = (wampSession, apiKey) => {
//     if (!wampSession.current) return;

//     const initialBalances = wampSession.current
//         .call("f_all_balance_updates", [apiKey])
//         .then(initialBalanceUpdatesReceived);
// };

// const initialBalanceUpdatesReceived = async (updates) => {
//     Object.entries(updates).forEach(([curr, value]) => {
//         //make a call to get the info for the currency
//         const phToken = findPHToken(curr);
//         if (phToken) {
//             balances.current[curr] = {
//                 name: phToken?.name ?? curr,
//                 symbol: phToken?.abbreviation ?? null,
//                 balance: value,
//                 enabled: phToken?.enabled ?? false,
//                 algo: phToken?.algo ?? null,
//                 port: phToken?.port ?? null,
//             };
//         }
//     });

//     sortBalances();

//     //subscribe to receive future updates.
//     wampSession.current.subscribe(`balance_updates_${apiKey}`, onBalanceUpdate);
// };

export const getProhashingTokens = async () => {
    let data = {};
    try {
        const request = await axiosInstance.get(
            "https://prohashing.com/api/v1/currencies",
        );

        if (request.status === 200) {
            data = request.data.data;
        }
    } catch (e) {
        console.error("GPT error", e);
    }

    return data;
};

//finds the token information from the token list
export const findPHToken = (token, allTokens) => {
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
        console.error("eee Error finding token", e);
        return null;
    }
};

//takes the balances object and sorts by balance descending
export const sortBalances = async (balances, currency) => {
    let sortedBalances = [];
    Object.entries(balances.current).forEach((balance) => {
        sortedBalances.push(balance);
    });

    //filter out balances less than prohashing's threshold
    sortedBalances = sortedBalances.filter((b) => b[1].balance > 0.00000001);

    //for each token, get the current conversion value
    const idList = sortedBalances
        .map((token) => {
            const id = findCoinGeckoId(token[1]);
            return id;
        })
        .filter((id) => id !== undefined);

    //update prices
    const prices = await getCoinGeckoPrices(idList, currency);

    let totalValue = 0;

    Object.entries(prices).forEach(([id, value]) => {
        const rate = value[currency.toLowerCase()];
        const name = findCoinGeckoName(id);

        //save the conversion rate && update the usd balance
        sortedBalances.forEach((token, index) => {
            if (token[1].name === name) {
                sortedBalances[index][1].rate = rate;
                sortedBalances[index][1].usdValue = token[1].balance * rate;

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

    return { sortedBalances, totalValue };
};

//takes the workers object and sorts by hashrate descending
export const sortWorkers = (workers) => {
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

    return { sortedWorkers, totalHashrate };
};
