/* eslint-disable no-console */
import { ChartMode } from 'redux/actions/const';
import historyProvider from './historyProvider';

const io = require('socket.io-client');

const socket_url = process.env.NEXT_PUBLIC_STREAM_SOCKET;
const socket = io(socket_url, {
    // transports: ['websocket'],
    transports: ['websocket'],
    upgrade: false,
    path: '/ws',
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 500,
    reconnectionAttempts: Infinity,
});
const _subs = [];
let isDisconnected = false;
let lastSymbol = null;

// Take a single trade, and subscription record, return updated bar
function updateBar(data, sub) {
    const lastBar = sub?.lastBar;
    if (!lastBar) return;
    let { resolution } = sub;
    if (resolution.includes('D')) {
        // 1 day in minutes === 1440
        resolution = 1440;
    } else if (resolution.includes('W')) {
        // 1 week in minutes === 10080
        resolution = 10080;
    }
    const coeff = resolution * 60;
    const rounded = Math.floor(data.ts / coeff) * coeff;
    const lastBarSec = lastBar.time / 1000;
    let _lastBar;
    // // console.log('__ rounded', rounded, data.ts, lastBarSec);
    if (rounded > lastBarSec) {
        // create a new candle, use last close as open **PERSONAL CHOICE**
        _lastBar = {
            time: rounded * 1000,
            open: lastBar.close,
            high: lastBar.close,
            low: lastBar.close,
            close: data.price,
            volume: data.volume,
        };
    } else {
        // update lastBar candle!
        if (data.price < lastBar.low) {
            lastBar.low = data.price;
        } else if (data.price > lastBar.high) {
            lastBar.high = data.price;
        }
        lastBar.volume += data.volume;
        lastBar.close = data.price;
        _lastBar = lastBar;
    }
    return _lastBar;
}

export default class {
    mode = null;

    constructor(mode) {
        this.mode = mode;
    }

    subscribeBars(symbolInfo, resolution, updateCb, uid, resetCache) {
        socket.emit(
            symbolInfo.exchange === 'NAMI_SPOT'
                ? 'subscribe:recent_trade'
                : 'subscribe:futures:ticker',
            symbolInfo.symbol);
        try {
            lastSymbol = symbolInfo.symbol;
            const newSub = {
                exchange: symbolInfo.exchange,
                symbol: symbolInfo.symbol,
                uid,
                resolution,
                symbolInfo,
                lastBar: historyProvider?.history?.[symbolInfo.symbol]?.lastBar,
                listener: updateCb,
            };
            _subs.unshift(newSub);
        } catch (e) {
            console.error('__ subscribeBars e', e);
        }
        console.log(_subs, 'SUBLIST');
    }

    unsubscribeBars(uid) {
        const subIndex = _subs.findIndex(e => e.uid === uid);
        if (subIndex === -1) {
            // console.log("No subscription found for ",uid)
            return;
        }
        // socket.emit('unsubscribe:recent_trade', lastSymbol);
        _subs.splice(subIndex, 1);
        console.log(_subs, 'SUBLIST');
    }
}
socket.on('connect', () => {
    if (isDisconnected) {
        if (_subs.length) {
            _subs.map(sub => {
                const emitAction = sub.exchange === 'NAMI_SPOT'
                    ? 'subscribe:recent_trade'
                    : 'subscribe:futures:ticker';
                return socket.emit(emitAction, lastSymbol);
            });
        }
        isDisconnected = false;
    }
});
socket.on('disconnect', (e) => {
    // console.log('===Socket disconnected:', e);
    isDisconnected = true;
});
socket.on('error', err => {
    // console.log('====socket error', err);
});

socket.on('futures:ticker:update', (update) => {
    const {
        s: symbol,
        t: time,
        p: price,
        c: closePrice,
    } = update;
    const sub = _subs.find(e => e.symbol === symbol && e.exchange === 'NAMI_FUTURES');
    const data = {
        ts: Math.floor(time / 1000),
        price: price,
    };
    if (sub) {
        if (!sub?.lastBar?.time) return;
        if (data.ts < sub?.lastBar?.time / 1000) {
            return;
        }
        const _lastBar = updateBar(data, sub);
        sub.listener(_lastBar);
        // update our own record of lastBar
        sub.lastBar = _lastBar;
    }
});

socket.on('spot:recent_trade:add', (update) => {
    const {
        s: symbol,
        t: time,
        p: price,
        q: volume,
    } = update;
    const sub = _subs.find(e => e.symbol === symbol && e.exchange === 'NAMI_SPOT');
    const data = {
        ts: Math.floor(time / 1000),
        volume: +volume,
        price: +price,
    };

    if (sub) {
        if (!sub?.lastBar?.time) return;
        if (data.ts < sub?.lastBar?.time / 1000) {
            return;
        }
        const _lastBar = updateBar(data, sub);
        sub.listener(_lastBar);
        // update our own record of lastBar
        sub.lastBar = _lastBar;
    }
});
