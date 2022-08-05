import React, { useEffect, useMemo, useState } from 'react';
import SpeedMeter from 'components/svg/SpeedMeter';
import { ChevronDown } from 'react-feather';
import fetchAPI from 'utils/fetch-api';
import { API_GET_FUTURES_POSITION_ORDERS } from 'redux/actions/apis';
import { FuturesMarginMode as MarginModes } from 'redux/reducers/futures';
import { map, toLower } from 'lodash';
import { formatNumber, getSymbolObject } from 'redux/actions/utils';
import classNames from 'classnames';
import useMakePrice from 'hooks/useMakePrice';
import { BINANCE_LEVERAGE_MARGIN } from 'constants/constants';
import { useTranslation } from 'next-i18next';

const FuturesMarginRatio = ({ pairConfig }) => {
    const { t } = useTranslation()
    const [positionOrder, setPositionOrder] = useState([]);
    const [currentPositionOrder, setCurrentPositionOrder] = useState({});

    async function getPositionOrder() {
        const {
            data: rawData = [],
            success
        } = await fetchAPI({
            url: API_GET_FUTURES_POSITION_ORDERS,
            options: {
                method: 'GET',
            },
        });
        if (success !== 'ok') {
            console.log(`Can't get position orders: `);
        }
        const data = [];
        rawData?.forEach((item) => {
            if (item.marginType !== toLower(MarginModes.Isolated) || +item.positionAmt <= 0) {
                return;
            }
            const symbol = getSymbolObject(item?.symbol);
            data.push({
                ...item,
                symbol
            });
        });
        setPositionOrder(data);
        setCurrentPositionOrder(data[0] || {});
    }

    useEffect(() => {
        getPositionOrder();
    }, []);

    const pairs = useMemo(() => map(positionOrder, 'symbol.symbol'), [positionOrder]);

    const [markPrices] = useMakePrice(pairs, pairConfig?.quoteAsset);

    const calculateMarginRatio = (size, margin, markPrice, pnlValue) => {
        const notional = size * markPrice;
        const marginBalance = +margin + pnlValue;
        const {
            rate,
            amount
        } = BINANCE_LEVERAGE_MARGIN.find(config => {
            const [min, max] = config.positionBracket;
            return notional > min && notional <= max;
        }) || {};
        const maintenanceMargin = (notional * (rate / 100)) - amount;
        const marginRatio = maintenanceMargin / marginBalance;
        return {
            maintenanceMargin,
            marginRatio,
            marginBalance
        };
    };

    const {
        maintenanceMargin,
        marginRatio,
        marginBalance
    } = useMemo(() => {
        const size = +currentPositionOrder?.positionAmt;
        const margin = +currentPositionOrder?.isolatedMargin;
        const entryPrice = +currentPositionOrder?.entryPrice;
        const markPrice = markPrices[currentPositionOrder?.symbol?.symbol];
        const pnlValue = size * (markPrice - entryPrice);

        return calculateMarginRatio(size, margin, markPrice, pnlValue);
    }, [markPrices, currentPositionOrder]);

    const dropdown = (
        <div className="absolute z-30 bottom-0 right-0 translate-y-full hidden group-hover:block">
            <div
                className="py-1 rounded-md min-w-[81px] bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4 text-xs font-medium whitespace-nowrap">
                {positionOrder.map(o => {
                    return (<div
                        key={`futures_margin_${o.symbol.symbol}`}
                        className={classNames(
                            'px-3 py-2 mb-2 last:mb-0 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer',
                            {
                                'text-dominant': currentPositionOrder?.symbol?.baseAsset === o,
                            }
                        )}
                        onClick={() => setCurrentPositionOrder(o)}
                    >
                        {o.symbol.baseAsset}
                    </div>);
                })}
            </div>
        </div>
    );

    return (
        <div className="pt-5 h-full !overflow-x-hidden overflow-y-auto">
            <div className="px-[10px] pb-5 border-b border-divider dark:border-divider-dark">
                <div className="flex items-center justify-between">
                    <div className="futures-component-title flex-grow dragHandleArea">
                        Margin Ratio
                    </div>
                    <div
                        className="relative group">
                        {/* <X size={16} strokeWidth={1} /> */}
                        <div className="flex items-center justify-center cursor-pointer">
                            {currentPositionOrder?.symbol?.baseAsset}
                            <ChevronDown
                                size={16}
                                strokeWidth={1}
                                className="ml-1"
                            />
                        </div>
                        {dropdown}
                    </div>
                </div>
                <div className="mt-3.5 flex items-center justify-between">
                    <span className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        Margin Ratio
                    </span>
                    <span className="flex items-center">
                        <SpeedMeter className="mr-2"/>{' '}
                        <span className="font-bold text-[18px] text-dominant">
                            {formatNumber(Math.abs(marginRatio), 2)}%
                        </span>
                    </span>
                </div>
                <div className="mt-3.5 flex items-center justify-between">
                    <span className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        Maintenance Margin
                    </span>
                    <span className="flex items-center">
                         {formatNumber(Math.abs(maintenanceMargin), pairConfig?.pricePrecision, 2)}
                        <span className="ml-1 text-txtSecondary dark:text-txtSecondary-dark">
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className="mt-3.5 flex items-center justify-between">
                    <span className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        Margin Balance
                    </span>
                    <span className="flex items-center">
                        {formatNumber(Math.abs(marginBalance), pairConfig?.pricePrecision, 2)}
                        <span className="ml-1 text-txtSecondary dark:text-txtSecondary-dark">
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
            </div>
            <div className="pt-4 pb-5 px-[10px]">
                <div className="flex items-center justify-between">
                    <span className="futures-component-title">Assets</span>
                    <span className="flex items-center">
                        {pairConfig?.quoteAsset}
                        <ChevronDown
                            size={16}
                            strokeWidth={1}
                            className="ml-1"
                        />
                    </span>
                </div>
                <div className='mt-4 flex items-center'>
                    <div className='px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        {t('futures:buy_crypto')}
                    </div>
                    <div className='px-[14px] py-1 mr-2.5 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        {t('futures:convert')}
                    </div>
                    <div className='px-[14px] py-1 font-medium text-xs bg-gray-5 dark:bg-darkBlue-4 rounded-[4px]'>
                        {t('common:transfer')}
                    </div>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:balance')}
                    </span>
                    <span className="flex items-center">
                        106.301{' '}
                        <span className="ml-1 text-txtSecondary dark:text-txtSecondary-dark">
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
                <div className='mt-3.5 flex items-center justify-between'>
                    <span className='font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {t('futures:unrealized_pnl')}
                    </span>
                    <span className="flex items-center">
                        106.301{' '}
                        <span className="ml-1 text-txtSecondary dark:text-txtSecondary-dark">
                            {pairConfig?.quoteAsset}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FuturesMarginRatio, (preProps, nextProps) => {
    return preProps.pairConfig?.symbol === preProps.pairConfig?.symbol;
});
