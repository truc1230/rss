import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Emitter from "redux/actions/emitter";
import {PublicSocketEvent} from "redux/actions/const";
import {mapValues} from "lodash";
import FuturesMarketWatch from "models/FuturesMarketWatch";

const useMakePrice = (pairs = [], mode) => {
    const publicSocket = useSelector((state) => state.socket.publicSocket)

    const [markPrices, setMarkPrices] = useState({})

    const _disconect = () => {
        Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + 'markPrices', listenMarkPriceChange)
    };

    useEffect(() => {
        if (publicSocket && pairs.length > 0) {
            publicSocket.emit('subscribe:futures:ticker', pairs)
            // return () => {
            //     publicSocket.emit('unsubscribe:futures:ticker', pairs)
            // }
        }
    }, [publicSocket, pairs])

    useEffect(() => {
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + 'markPrices', listenMarkPriceChange)
        return _disconect;
    }, [])

    function listenMarkPriceChange(data) {
        setMarkPrices(mapValues(data, (e) => FuturesMarketWatch.create(e, mode).lastPrice))
    }

    return [markPrices, _disconect]
}
export default useMakePrice
