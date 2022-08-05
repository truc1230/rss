class FuturesMarkPrice {
    constructor(options) {
        this.eventType = options.eventType
        this.eventTime = options.eventTime
        this.symbol = options.symbol
        this.markPrice = options.markPrice
        this.indexPrice = options.indexPrice
        this.estSettlePrice = options.estSettlePrice
        this.fundingRate = options.fundingRate
        this.nextFundingTime = options.nextFundingTime
    }

    static create(source) {
        return new FuturesMarkPrice({
            symbol: source?.s,
            markPrice: +source?.p,
            indexPrice: +source?.i,
            estSettlePrice: +source?.P,
            fundingRate: +source?.r,
            nextFundingTime: +source?.T,
            eventType: source?.e,
            eventTime: +source?.E,
        })
    }
}

export default FuturesMarkPrice
