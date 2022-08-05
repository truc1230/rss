class FuturesMiniTicker {
    constructor(options) {
        this.eventType = options.eventType
        this.eventTime = options.eventTime
        this.symbol = options.symbol
        this.closePrice = options.closePrice
        this.openPrice = options.openPrice
        this.highPrice = options.highPrice
        this.lowPrice = options.lowPrice
        this.baseAssetVolume = options.baseAssetVolume
        this.quoteAssetVolume = options.quoteAssetVolume
    }
    //          "e": "24hrMiniTicker",  // Event type
    // "E": 123456789,         // Event time
    // "s": "BTCUSDT",         // Symbol
    // "c": "0.0025",          // Close price
    // "o": "0.0010",          // Open price
    // "h": "0.0025",          // High price
    // "l": "0.0010",          // Low price
    // "v": "10000",           // Total traded base asset volume
    // "q": "18"               // Total traded quote asset volume
    static create(source) {
        return new FuturesMiniTicker({
            symbol: source?.s,
            baseAssetVolume: +source?.v,
            quoteAssetVolume: +source?.q,
            openPrice: +source?.o,
            closePrice: +source?.c,
            highPrice: +source?.h,
            lowPrice: +source?.l,
            eventType: source?.e,
            eventTime: +source?.E,
        })
    }
}

export default FuturesMiniTicker
