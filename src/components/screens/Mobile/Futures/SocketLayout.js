import React, { cloneElement, useEffect, useRef, useState } from 'react';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { useSelector } from 'react-redux';

const SocketLayout = ({ pair, children, pairConfig, pairParent, miniTicker }) => {
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const [pairPrice, setPairPrice] = useState(null);

    const subscribeFuturesSocket = (pair) => {
        publicSocket.emit('subscribe:futures:ticker', pair);
    };

    const unsubscribeFuturesSocket = (pair) => {
        publicSocket?.emit('unsubscribe:futures:ticker', 'all');
    };

    useEffect(() => {
        if (!publicSocket || !miniTicker) return;
        publicSocket.emit('subscribe:futures:mini_ticker', 'all')
        return () => {
            publicSocket.emit('unsubscribe:futures:mini_ticker', 'all')
        };
    }, [publicSocket, miniTicker]);

    useEffect(() => {
        if (!pair || !pairConfig || !publicSocket) return;
        // ? Subscribe publicSocket
        subscribeFuturesSocket(pair);

        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, async (data) => {
            const _pairPrice = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
            if (pair === _pairPrice?.symbol && _pairPrice?.lastPrice > 0) {
                setPairPrice(_pairPrice);
            }
        });

        // ? Unsubscribe publicSocket
        return () => {
            if (pairParent) return;
            publicSocket && unsubscribeFuturesSocket(pair);
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE);
        };
    }, [publicSocket, pair, pairConfig]);
    // console.log(pairPrice)
    return (
        cloneElement(children, {
            pairPrice: pairPrice,
            price: pairPrice?.lastPrice
        })
    );
};

export default SocketLayout;
