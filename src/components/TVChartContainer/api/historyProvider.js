/* eslint-disable no-console */
import { ChartMode } from 'redux/actions/const';

const axios = require('axios');

const PRICE_URL = process.env.NEXT_PUBLIC_PRICE_API_URL;
const history = {};

function getInterval(resolution) {
    if (resolution.includes('D') || resolution.includes('W') || resolution.includes('M')) {
        return '1d';
    }
    if (resolution.includes('S')) {
        return '1m';
    }
    // minutes and hour
    if (+resolution < 60) {
        return '1m';
    }
    return '1h';
}

export default {
    history,
    async getBars(symbolInfo, resolution, from, to, first, limit) {
        const url = `${PRICE_URL}/api/v1/chart/history`;
        const { data } = await axios.get(url, {
            params: {
                broker: symbolInfo.exchange,
                symbol: symbolInfo.symbol,
                from,
                to,
                resolution: getInterval(resolution),
                limit,
            },
        });
        if (data && data.length) {
            const bars = [];
            for (let i = 0; i < data.length; i++) {
                const [
                    time, open, high, low, close, volume,
                ] = data[i];
                bars.push({
                    time: time * 1000,
                    timeSecond: time,
                    low,
                    high,
                    open,
                    close,
                    volume,
                });
            }
            if (first) {
                const lastBar = bars[bars.length - 1];
                history[symbolInfo.symbol] = { lastBar };
            }
            return bars;
        }
        return [];
    },
    async getSymbolInfo(symbol, mode = ChartMode.SPOT) {
        const url = `${PRICE_URL}/api/v1/chart/symbol_info`;
        const { data } = await axios.get(url, {
            params: {
                broker: mode === ChartMode.SPOT ? 'NAMI_SPOT' : 'NAMI_FUTURES',
                symbol,
            },
        },
        );
        return data;
    },

};
