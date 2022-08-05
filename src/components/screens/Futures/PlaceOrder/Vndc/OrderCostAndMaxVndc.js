import { useEffect, useState } from 'react';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';

import TradingLabel from 'components/trade/TradingLabel';
import Link from 'next/link';
import ChevronDown from 'src/components/svg/ChevronDown';
import { useSelector } from 'react-redux';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const FuturesOrderCostAndMaxVndc = ({
    selectedAsset,
    pairConfig,
    price,
    assumingPrice,
    currentType,
    quantity,
    size,
    leverage,
    isAssetReversed,
    availableAsset,
    maxBuy,
    maxSell,
    ask,
    bid,
    stopPrice,
    side,
    countDecimals
}) => {
    const vip = useSelector((state => state?.user?.vip))
    const { t } = useTranslation()
    const [cost, setCost] = useState(0);

    const isMarket =
        currentType === FuturesOrderTypes.Market ||
        currentType === FuturesOrderTypes.StopMarket

    const formatCash = n => {
        if (n < 1e3) return formatNumber(n, 0, 0, true);
        if (n >= 1e6 && n < 1e9) return formatNumber(+(n / 1e6).toFixed(4), 4, 0, true) + "M";
        if (n >= 1e9 && n < 1e12) return formatNumber(+(n / 1e9).toFixed(4), 4, 0, true) + "B";
        if (n >= 1e12) return formatNumber(+(n / 1e12).toFixed(4), 4, 0, true) + "T";
    };

    const renderCost = () => {
        const _price = currentType === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? ask : bid) :
            price;
        const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
        const decimalScaleQtyMarket = pairConfig?.filters.find(rs => rs.filterType === 'MARKET_LOT_SIZE');
        const stepSize = currentType === FuturesOrderTypes.Market ? decimalScaleQtyLimit?.stepSize : decimalScaleQtyMarket?.stepSize;
        const _size = +Number(String(size).replace(/,/g, '')).toFixed(countDecimals(stepSize));
        // console.log(_size, size)
        const volume = _size * _price;
        const volumeLength = volume.toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return (
            <>
                <TradingLabel
                    label={t('futures:margin')}
                    value={`${marginLength > 7 ? formatCash(margin) : formatNumber(
                        margin,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md flex flex-wrap mr-[10px]'
                />
                <TradingLabel
                    label={t('futures:value')}
                    value={`${volumeLength > 7 ? formatCash(volume) : formatNumber(
                        volume,
                        pairConfig?.pricePrecision || 2
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-md flex flex-wrap justify-end'
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
        const _size = +String(size).replace(/,/g, '')
        if (leverage) {
            let cost = 0;
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(currentType)) {
                const _price = currentType === OrderTypes.Limit ? price : stopPrice;
                const notional = +_price * _size;
                const fee = notional * (0.1 / 100);
                cost = (notional / leverage) + fee;
            } else if ([OrderTypes.Market].includes(currentType)) {
                cost = VndcFutureOrderType.Side.BUY === side ? ((ask * _size) / leverage) + (_size * ask * (0.1 / 100)) :
                    ((bid * _size) / leverage) + (_size * bid * (0.1 / 100));
            }
            setCost(cost)
        } else {
            setCost(0)
        }
    }, [
        currentType,
        assumingPrice,
        leverage,
        quantity,
        size,
        price,
        isAssetReversed,
        ask,
        bid,
        stopPrice
    ])

    return (
        <div className='mt-4 select-none'>
            <div className='flex items-center justify-between'>
                {renderCost()}
            </div>
            {/* <div className='mt-2 flex items-center justify-between'>
                {renderMax()}
            </div> */}

            <div className="float-right mt-[8px] group relative">
                <div className="text-teal underline cursor-pointer font-medium ">{t('futures:fee_tier')}</div>
                <div className="hidden group-hover:block absolute right-0 min-w-[200px] dark:bg-darkBlue-3 shadow-onlyLight rounded-[8px]">
                    <Link href={'/fee-schedule/trading'}>
                        <a target='_blank'>
                            <div className="flex items-center justify-between h-[44px] bg-gray-5 p-[10px] dark:bg-darkBlue-4 rounded-t-[8px]">
                                <div>
                                    <span className="text-darkBlue font-medium pr-[10px] dark:text-white">{t('futures:fee_tier')}</span>
                                    <label className="text-teal font-semibold ">VIP {vip?.level ?? 0}</label>
                                </div>
                                <div className="rotate-[270deg]"><ChevronDown /></div>
                            </div>
                        </a>
                    </Link>
                    <div className="p-[10px]">
                        <div className="flex items-center justify-between">
                            <label className="text-gray-1 dark:text-txtSecondary-dark font-medium">{t('futures:taker')}:</label>
                            <span className="font-medium">0.1%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-gray-1 dark:text-txtSecondary-dark font-medium">{t('futures:maker')}:</label>
                            <span className="font-medium">0.1%</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FuturesOrderCostAndMaxVndc
