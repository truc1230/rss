function getPairKey(symbol) {
    if (symbol) {
        let baseAsset, quoteAsset

        if (symbol?.includes('VNDC')) quoteAsset = 'VNDC'
        if (symbol?.includes('USDT')) quoteAsset = 'USDT'

        baseAsset = symbol?.replace(quoteAsset, '')

        return {
            baseAsset,
            quoteAsset,
        }
    }
}

class FuturesMarketWatch {
    constructor(options) {
        this.symbol = options.symbol
        this.baseAsset = options.baseAsset
        this.quoteAsset = options.quoteAsset
        this.baseAssetVolume = options.baseAssetVolume
        this.quoteAssetVolume = options.quoteAssetVolume
        this.openPrice = options.openPrice
        this.highPrice = options.highPrice
        this.lowPrice = options.lowPrice
        this.lastPrice = options.lastPrice
        this.priceChange = options.priceChange
        this.priceChangePercent = options.priceChangePercent
        this.lastQuantity = options.lastQuantity
        this.firstTradeId = options.firstTradeId
        this.lastTradeId = options.lastTradeId
        this.eventType = options.eventType
        this.eventTime = options.eventTime
        this.totalNumberOfTrades = options.totalNumberOfTrades
        this.statisticsOpenTime = options.statisticsOpenTime
        this.statisticsCloseTime = options.statisticsCloseTime
        this.weightedAveragePrice = options.weightedAveragePrice
        this.ask = options.ask
        this.bid = options.bid
    }

    static create(source, mode = 'VNDC') {
        const pairKey = getPairKey(source?.s)
        return new FuturesMarketWatch({
            symbol: source?.s,
            baseAsset: pairKey?.baseAsset,
            quoteAsset: pairKey?.quoteAsset,
            baseAssetVolume: +source?.v || 0,
            quoteAssetVolume: +source?.q || 0,
            openPrice: +source?.o || 0,
            highPrice: +source?.h || 0,
            lowPrice: +source?.l || 0,
            lastPrice: +source?.p || 0,
            priceChange: +source?.ld || 0,
            priceChangePercent: +source?.lcp || 0,
            lastQuantity: +source?.Q || 0,
            firstTradeId: source?.F,
            lastTradeId: source?.L,
            eventType: source?.e,
            eventTime: source?.E,
            totalNumberOfTrades: source?.n,
            statisticsOpenTime: source?.O,
            statisticsCloseTime: source?.C,
            weightedAveragePrice: +source?.w,
            ask: source?.ap,
            bid: source?.bp,
        })
    }
}

export default FuturesMarketWatch
