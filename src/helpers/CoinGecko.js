import CoinGecko from "coingecko-api";
import { coinList } from "../assets/coinList";

const CoinGeckoClient = new CoinGecko();

export const findCoinGeckoId = (token) => {
    const obj = Object.values(coinList).find((t) => t.name === token.name);
    return obj?.id;
};

export const findCoinGeckoName = (id) => {
    const obj = Object.values(coinList).find((t) => t.id === id);
    return obj?.name;
};

export const getCoinGeckoPrices = async (idList, currencies) => {
    let data = {};
    try {
        const response = await CoinGeckoClient.simple.price({
            ids: idList,
            vs_currencies: currencies,
        });
        data = response?.data ?? {};
    } catch (error) {
        console.error("GCGP error", error);
    }
    return data;
};

export const getSupportedVSCurrencies = async () => {
    const response = await CoinGeckoClient.simple.supportedVsCurrencies();
    const data = response.data;
    return data;
};
