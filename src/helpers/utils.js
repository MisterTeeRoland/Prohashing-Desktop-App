export const convertHashrate = (rate) => {
    rate = parseFloat(rate);
    let unit = "H/s";
    if (rate >= 1000) {
        rate /= 1000;
        unit = "KH/s";
    }
    if (rate >= 1000) {
        rate /= 1000;
        unit = "MH/s";
    }
    if (rate >= 1000) {
        rate /= 1000;
        unit = "GH/s";
    }
    if (rate >= 1000) {
        rate /= 1000;
        unit = "TH/s";
    }
    if (rate >= 1000) {
        rate /= 1000;
        unit = "PH/s";
    }
    return {
        rate: rate.toFixed(3),
        unit,
    };
};
