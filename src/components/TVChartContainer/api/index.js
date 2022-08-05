/* eslint-disable no-console */
import historyProvider from './historyProvider';
import Stream from './stream';
import { ChartMode } from 'redux/actions/const';

const supportedResolutions = [
    '1',
    '5',
    '15',
    '60',
    '240',
    '1D',
    '1W',
    '1M',
];

const config = {
    supported_resolutions: supportedResolutions,
};

export default class {
    stream = null;
    mode = null;

    constructor(mode = ChartMode.SPOT) {
        this.mode = mode;
        this.stream = new Stream(mode);
    }

    onReady = cb => {
        setTimeout(() => cb(config), 0);
    };
    searchSymbols = (userInput, exchange, symbolType, onResultReadyCallback) => {
        // console.log('====Search Symbols running');
    };
    resolveSymbol = async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        // expects a symbolInfo object in response
        try {
            const symbol_stub = await historyProvider.getSymbolInfo(symbolName, this.mode);
            setTimeout(() => {
                onSymbolResolvedCallback(symbol_stub);
                console.log('Resolving that symbol....', symbol_stub);
            }, 0);
        } catch (e) {
            onResolveErrorCallback('Not feeling it today');
        }
    };
    getBars = (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
            .then(bars => {
                if (bars.length) {
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback(bars, { noData: true });
                }
            })
            .catch(err => {
                console.log({ err });
                onErrorCallback(err);
            });
    };
    subscribeBars = (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        this.stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
    };
    unsubscribeBars = subscriberUID => {
        this.stream.unsubscribeBars(subscriberUID);
    };
    calculateHistoryDepth = (resolution, resolutionBack, intervalBack) => {
        return resolution < 60 ? {
            resolutionBack: 'D',
            intervalBack: '1'
        } : undefined;
    };
    getMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    };
    getTimeScaleMarks = (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        // optional
        // console.log('=====getTimeScaleMarks running');
    };
    getServerTime = cb => {
        // console.log('=====getServerTime running');
    };
};
