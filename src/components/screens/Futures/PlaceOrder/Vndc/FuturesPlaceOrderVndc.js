import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { FuturesOrderTypes as OrderTypes, FuturesStopOrderMode, } from 'redux/reducers/futures';
import { roundToDown } from 'round-to';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import FuturesOrderModule from 'components/screens/Futures/PlaceOrder/OrderModule';
import FuturesOrderTypes from 'components/screens/Futures/PlaceOrder/OrderTypes';
import PlaceConfigs from 'components/screens/Futures/PlaceOrder/PlaceConfigs';
import axios from 'axios';
import FuturesOrderCostAndMaxVndc from './OrderCostAndMaxVndc';
import TabOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/TabOrderVndc';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const FuturesPlaceOrderVndc = ({
    pairConfig,
    userSettings,
    markPrice,
    lastPrice,
    assumingPrice,
    isAuth,
    isVndcFutures,
    ask,
    bid,
    pair
}) => {

    const [leverage, setLeverage] = useState(1)
    const [percentage, setPercentage] = useState(null)
    const [price, setPrice] = useState(lastPrice)
    const [stopPrice, setStopPrice] = useState(lastPrice)
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
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY);


    // ? get rdx state
    const preloadedForm = useSelector((state) => state.futures.preloadedState)
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES)
    const currentType = useMemo(
        () => preloadedForm?.orderType || OrderTypes.Limit,
        [preloadedForm]
    )
    const firstTime = useRef(true);

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
            const sizeFormat = String(size).replace(/,/g, '')
            setSize(sizeFormat)
            const _size = sizeFormat
                ? assetReversed
                    ? +sizeFormat * lastPrice
                    : +sizeFormat
                : 0
            setQuantity({ ...quantity, both: _size })
        },
        [maxBuy, maxSell, assetReversed, lastPrice]
    )

    useEffect(() => {
        const buy = size * maxBuy;
        const sell = size * maxSell;
        setQuantity({
            ...quantity,
            buy: roundToDown(buy, pairConfig?.quantityPrecision || 2),
            sell: roundToDown(sell, pairConfig?.quantityPrecision || 2),
        })
    }, [maxBuy, maxSell, size])

    const handlePrice = (price) => {
        setPrice(price)
    }

    useEffect(() => {
        setStopOrderMode(FuturesStopOrderMode.markPrice)
        if (currentType === OrderTypes.Limit || currentType === OrderTypes.StopMarket) {
            setPrice(lastPrice)
            setStopPrice(lastPrice)
        }

    }, [currentType])

    useEffect(() => {
        firstTime.current = true;
    }, [pair])

    useEffect(() => {
        if (firstTime.current && lastPrice) {
            firstTime.current = false;
            setPrice(lastPrice);
            setStopPrice(lastPrice)
        }
    }, [firstTime.current, lastPrice])

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

    const countDecimals = (value) => {
        if (Math.floor(value) === value || !value) return 0;
        return value.toString().split(".")[1]?.length || 0;
    }

    useEffect(() => {
        const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
        const _size = isNaN(size) ? Number(String(size).substring(0, String(size).indexOf('%'))) / 100 : size;
        const _price = currentType === OrderTypes.Limit ? price : stopPrice;
        if ((availableAsset)) {
            let maxBuy = 0;
            let maxSell = 0;
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(currentType) && _price) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / _price;
                maxSell = maxBuy;
            } else if ([OrderTypes.Market].includes(currentType)) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / ask;
                maxSell = availableAsset / ((1 / leverage) + (0.1 / 100)) / bid;
            }
            setMaxBuy(maxBuy.toFixed(countDecimals(decimalScaleQtyLimit?.stepSize)))
            setMaxSell(maxSell.toFixed(countDecimals(decimalScaleQtyLimit?.stepSize)))
        } else {
            setMaxBuy(0)
            setMaxSell(0)
        }
    }, [
        availableAsset,
        price,
        size,
        leverage,
        currentType,
        assetReversed,
        ask,
        bid,
        stopPrice
    ])

    return (
        <div className='pr-5 pb-5 pl-[11px] h-full bg-bgPrimary dark:bg-darkBlue-2 !overflow-x-hidden overflow-y-auto'>
            <div className='relative dragHandleArea'>
                <PlaceConfigs
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    userSettings={userSettings}
                    isVndcFutures={isVndcFutures}
                    isAuth={isAuth}
                />
                <div className='absolute left-0 -bottom-5 w-full h-5 ' />
            </div>

            <TabOrderVndc side={side} setSide={setSide} />

            <div className='mt-5'>
                <FuturesOrderTypes
                    currentType={currentType}
                    orderTypes={pairConfig?.orderTypes}
                    isVndcFutures={isVndcFutures}
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
                isVndcFutures={isVndcFutures}
                ask={ask}
                bid={bid}
                isAuth={isAuth}
                side={side}
                maxBuy={maxBuy}
                maxSell={maxSell}
                pair={pair}
            />

            <FuturesOrderCostAndMaxVndc
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
                ask={ask}
                bid={bid}
                stopPrice={stopPrice}
                side={side}
                countDecimals={countDecimals}
            />
        </div>
    )
}

export default FuturesPlaceOrderVndc
