import { useEffect, useState } from 'react';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';

import TradingLabel from 'components/trade/TradingLabel';
import min from 'lodash/min';
import max from 'lodash/max';

const FuturesOrderCostAndMax = ({
    selectedAsset,
    pairConfig,
    price,
    markPrice,
    lastPrice,
    assumingPrice,
    currentType,
    quantity,
    size,
    leverage,
    isAssetReversed,
    availableAsset,
    maxBuy,
    maxSell,
}) => {
    const [shortOrderOpenLoss, setShortOrderOpenLoss] = useState(0)
    const [longOrderOpenLoss, setLongOrderOpenLoss] = useState(0)
    const [marketInitialMargin, setMarketInitialMargin] = useState(0)
    const [shortInitialMargin, setShortInitialMargin] = useState(0)
    const [longInitialMargin, setLongInitialMargin] = useState(0)

    const { t } = useTranslation()

    const isMarket =
        currentType === FuturesOrderTypes.Market ||
        currentType === FuturesOrderTypes.StopMarket

    const renderCost = () => {
        return (
            <>
                <TradingLabel
                    label={t('common:cost')}
                    value={`${formatNumber(
                        longOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md'
                />
                <TradingLabel
                    label={t('common:cost')}
                    value={`${formatNumber(
                        shortOrderOpenLoss,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md'
                />
            </>
        )
    }

    const renderMax = () => {
        return (
            <>
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        maxBuy,
                        pairConfig?.quantityPrecision
                    )} ${selectedAsset}`}
                    containerClassName='text-md'
                />
                <TradingLabel
                    label={t('common:max')}
                    value={`${formatNumber(
                        maxSell,
                        pairConfig?.quantityPrecision
                    )} ${selectedAsset}`}
                    containerClassName='text-md'
                />
            </>
        )
    }

    useEffect(() => {
        // Limit initial margin
        if ([OrderTypes.Limit, OrderTypes.StopLimit].includes(currentType)) {
            if (
                price &&
                leverage &&
                size &&
                (quantity?.buy || quantity?.sell)
            ) {
                setShortInitialMargin((+price * quantity?.sell) / leverage)
                setLongInitialMargin((+price * +quantity?.buy) / leverage)
            } else {
                setShortInitialMargin(0)
                setLongInitialMargin(0)
            }
        }

        // ? Market initial margin
        if ([OrderTypes.Market, OrderTypes.StopMarket].includes(currentType)) {
            if (
                assumingPrice &&
                lastPrice &&
                leverage &&
                size &&
                (quantity?.buy || quantity?.sell)
            ) {
                setMarketInitialMargin([
                    (assumingPrice?.ask * (1 + 0.0005) * +quantity?.buy) /
                        leverage,
                    (max([assumingPrice?.bid, markPrice]) * +quantity?.sell) /
                        leverage,
                ])
            } else {
                setMarketInitialMargin([0, 0])
            }
        }
    }, [
        currentType,
        markPrice,
        assumingPrice,
        leverage,
        quantity,
        size,
        price,
        isAssetReversed,
        lastPrice,
    ])

    useEffect(() => {
        if (isMarket) {
            if (lastPrice && marketInitialMargin && markPrice) {
                const priceDifference = markPrice - lastPrice
                setLongOrderOpenLoss(
                    0.2 * Math.abs(min([0, 1 * priceDifference])) +
                        marketInitialMargin?.[0]
                )

                setShortOrderOpenLoss(
                    0.2 * Math.abs(min([0, -1 * priceDifference])) +
                        marketInitialMargin?.[1]
                )
            } else {
                setLongOrderOpenLoss(0)
                setShortOrderOpenLoss(0)
            }
        } else {
            if (price && marketInitialMargin && markPrice) {
                const priceDifference = markPrice - +price
                setLongOrderOpenLoss(
                    1 * Math.abs(min([0, 1 * priceDifference])) +
                        longInitialMargin
                )

                setShortOrderOpenLoss(
                    1 * Math.abs(min([0, -1 * priceDifference])) +
                        shortInitialMargin
                )
            } else {
                setLongOrderOpenLoss(0)
                setShortOrderOpenLoss(0)
            }
        }
    }, [
        price,
        marketInitialMargin,
        longInitialMargin,
        shortInitialMargin,
        markPrice,
        isMarket,
    ])

    return (
        <div className='mt-4 select-none'>
            <div className='flex items-center justify-between'>
                {renderCost()}
            </div>
            <div className='mt-2 flex items-center justify-between'>
                {renderMax()}
            </div>
        </div>
    )
}

export default FuturesOrderCostAndMax
