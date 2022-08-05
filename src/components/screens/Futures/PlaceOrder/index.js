import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { FuturesOrderTypes as OrderTypes, FuturesStopOrderMode, } from 'redux/reducers/futures';
import { roundToDown } from 'round-to';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';

import FuturesOrderCostAndMax from './OrderCostAndMax';
import FuturesOrderModule from './OrderModule';
import FuturesOrderTypes from './OrderTypes';
import PlaceConfigs from './PlaceConfigs';
import axios from 'axios';
import { log } from 'utils';

const FuturesPlaceOrder = ({
    pairConfig,
    userSettings,
    markPrice,
    lastPrice,
    assumingPrice,
    isAuth,
}) => {
    const [leverage, setLeverage] = useState(1)
    const [percentage, setPercentage] = useState(null)
    const [price, setPrice] = useState('')
    const [stopPrice, setStopPrice] = useState('')
    const [size, setSize] = useState('')
    const [quantity, setQuantity] = useState({ buy: '', sell: '' })
    const [selectedAsset, setSelectedAsset] = useState(null)
    const [stopOrderMode, setStopOrderMode] = useState(
        FuturesStopOrderMode.markPrice
    )
    const [assetReversed, setAssetReversed] = useState(false)
    const [availableAsset, setAvailableAsset] = useState(null)
    const [maxBuy, setMaxBuy] = useState(0)
    const [maxSell, setMaxSell] = useState(0)

    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedState)
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES)
    const currentType = useMemo(
        () => preloadedForm?.orderType || OrderTypes.Limit,
        [preloadedForm]
    )

    const getLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    const handleQuantity = useCallback(
        (size, isPercent = false) => {
            setSize(size)

            if (isPercent || size?.includes('%')) {
                log.d('Percent Size: ', size)
                const buy = assetReversed
                    ? ((parseFloat(size) / 100) * maxBuy) / lastPrice
                    : (parseFloat(size) / 100) * maxBuy
                const sell = assetReversed
                    ? ((parseFloat(size) / 100) * maxSell) / lastPrice
                    : (parseFloat(size) / 100) * maxSell

                setQuantity({
                    buy: roundToDown(buy, pairConfig?.quantityPrecision || 2),
                    sell: roundToDown(sell, pairConfig?.quantityPrecision || 2),
                })
            } else {
                const _size = size
                    ? assetReversed
                        ? +size * lastPrice
                        : +size
                    : 0
                setQuantity({ sell: _size, buy: _size, both: _size })
            }
        },
        [maxBuy, maxSell, assetReversed, lastPrice]
    )

    const handlePrice = (price) => {
        setPrice(price)
    }

    useEffect(() => {
        handleQuantity('')
        setStopOrderMode(FuturesStopOrderMode.markPrice)
    }, [currentType])

    useEffect(() => {
        isAuth && getLeverage(pairConfig?.pair)
        if (pairConfig?.baseAsset) {
            setSelectedAsset(pairConfig.baseAsset)
        }
    }, [pairConfig, isAuth])

    useEffect(() => {
        if (selectedAsset === pairConfig?.quoteAsset) {
            setAssetReversed(true)
        } else {
            setAssetReversed(false)
        }
    }, [pairConfig, selectedAsset])

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId]
            setAvailableAsset(_avlb?.value - _avlb?.locked_value)
        }
    }, [avlbAsset, pairConfig])

    useEffect(() => {
        if ([OrderTypes.Limit, OrderTypes.StopLimit].includes(currentType)) {
            if (availableAsset && markPrice && +price > 0 && leverage) {
                if (assetReversed) {
                    setMaxBuy(((availableAsset * leverage) / price) * lastPrice)
                    setMaxSell(
                        (availableAsset /
                            (price / leverage + (markPrice - price))) *
                            lastPrice
                    )
                } else {
                    setMaxBuy((availableAsset * leverage) / price)
                    setMaxSell(
                        availableAsset /
                            (price / leverage + (markPrice - price))
                    )
                }
            } else {
                setMaxBuy(0)
                setMaxSell(0)
            }
        }
    }, [
        availableAsset,
        markPrice,
        price,
        leverage,
        currentType,
        assetReversed,
        lastPrice,
    ])

    useEffect(() => {
        if ([OrderTypes.Market, OrderTypes.StopMarket].includes(currentType)) {
            if (availableAsset && markPrice && lastPrice && leverage) {
                setMaxBuy((availableAsset * leverage) / lastPrice)
                setMaxSell(
                    availableAsset /
                        (lastPrice / leverage + (markPrice - lastPrice))
                )
            } else {
                setMaxBuy(0)
                setMaxSell(0)
            }
        }
    }, [
        availableAsset,
        markPrice,
        lastPrice,
        leverage,
        currentType,
        assetReversed,
    ])

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative'>
                <PlaceConfigs
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    userSettings={userSettings}
                    isAuth={isAuth}
                />
                <div className='absolute left-0 -bottom-5 w-full h-5 dragHandleArea' />
            </div>

            <div className='mt-5'>
                <FuturesOrderTypes
                    currentType={currentType}
                    orderTypes={pairConfig?.orderTypes}
                />
            </div>

            <FuturesOrderModule
                markPrice={markPrice}
                lastPrice={lastPrice}
                selectedAsset={selectedAsset}
                currentLeverage={leverage}
                currentType={currentType}
                pairConfig={pairConfig}
                positionMode={userSettings?.dualSidePosition || false}
                price={price}
                stopPrice={stopPrice}
                size={size}
                quantity={quantity}
                handleQuantity={handleQuantity}
                handlePrice={handlePrice}
                setStopPrice={setStopPrice}
                stopOrderMode={stopOrderMode}
                setStopOrderMode={setStopOrderMode}
                setAsset={setSelectedAsset}
                availableAsset={availableAsset}
                isReversedAsset={assetReversed}
                isAuth={isAuth}
            />

            <FuturesOrderCostAndMax
                price={price}
                size={size}
                quantity={quantity}
                leverage={leverage}
                currentType={currentType}
                selectedAsset={selectedAsset}
                assumingPrice={assumingPrice}
                pairConfig={pairConfig}
                markPrice={markPrice}
                isAssetReversed={assetReversed}
                availableAsset={availableAsset}
                lastPrice={lastPrice}
                maxBuy={maxBuy}
                maxSell={maxSell}
            />
        </div>
    )
}

export default FuturesPlaceOrder
