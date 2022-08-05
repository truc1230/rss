import { useEffect, useMemo, useState } from 'react';
import { API_GET_FUTURES_POSITION_ORDERS } from 'redux/actions/apis';
import { formatNumber, getPriceColor, getSymbolObject, } from 'redux/actions/utils';
import { customTableStyles } from './index';
import { ChevronDown, Edit } from 'react-feather';
import { useAsync } from 'react-use';
import { capitalize, clone, map, range } from 'lodash';

import FuturesRecordSymbolItem from './SymbolItem';
import FuturesEditSLTP from './EditSLTP';
import classNames from 'classnames';
import DataTable from 'react-data-table-component';
import Skeletor from 'components/common/Skeletor';
import { BINANCE_LEVERAGE_MARGIN } from 'constants/constants';
import fetchAPI from 'utils/fetch-api';
import useMakePrice from 'hooks/useMakePrice';

const FuturesPosition = ({
    pairConfig,
    isHideOthers,
    onForceUpdate
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [positionOrder, setPositionOrder] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const onEditSltp = (order) => {
        setIsEdit(true);
        setCurrentOrder(order);
    };

    const onCloseEditSltp = () => {
        setIsEdit(false);
        setCurrentOrder(null);
    };

    const columns = useMemo(
        () => [
            {
                name: 'Symbol',
                selector: (row) => row?.symbol.symbol,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={100}/>
                    ) : (
                        <div className="flex items-center">
                            <div
                                className={classNames('mr-2 h-[40px] w-[2px]', {
                                    'bg-red': row?.positionSide === 'SHORT',
                                    'bg-dominant': row?.positionSide === 'LONG',
                                })}
                            />
                            <FuturesRecordSymbolItem
                                symbol={row?.symbol?.symbol}
                                leverage={`${row?.leverage}x`}
                            />
                        </div>
                    ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Size',
                selector: (row) => row?.positionAmt,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={100}/>
                    ) : (
                        <span
                            className={classNames({
                                'text-dominant': row?.positionAmt > 0,
                                'text-red': row?.positionAmt < 0,
                            })}
                        >
                            {formatNumber(
                                row?.positionAmt,
                                pairConfig?.quantityPrecision || 2,
                                0,
                                true
                            )}{' '}
                            {row?.symbol?.baseAsset}
                        </span>
                    ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Entry Price',
                selector: (row) =>
                    loading ? <Skeletor width={65}/> : formatNumber(
                        +row?.entryPrice,
                        pairConfig?.pricePrecision,
                        2
                    ),
                sortable: true,
            },
            {
                name: 'Mark Price',
                selector: (row) =>
                    loading ? <Skeletor width={65}/> : formatNumber(
                        +row?.markPrice,
                        pairConfig?.pricePrecision,
                        2
                    ),
                sortable: true,
            },
            {
                name: 'Liq Price',
                selector: (row) =>
                    loading ? <Skeletor width={65}/> : formatNumber(
                        +row?.liquidationPrice,
                        pairConfig?.pricePrecision,
                        2
                    ),
                sortable: true,
            },
            {
                name: 'Margin Ratio',
                selector: (row) => row?.marginRatio,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65}/>
                    ) : (
                        <span>{formatNumber(row?.marginRatio, pairConfig?.pricePrecision, 2)}%</span>
                    ),
                sortable: true,
            },
            {
                name: 'Margin',
                selector: (row) => row?.year,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65}/>
                    ) : (
                        <div>
                            <div>
                                {formatNumber(row?.isolatedMargin, pairConfig?.pricePrecision, 2)} {row?.symbol?.quoteAsset}
                            </div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                ({capitalize(row?.marginType)})
                            </div>
                        </div>
                    ),
                sortable: true,
            },
            {
                name: 'PNL (ROE%)',
                selector: (row) => row?.pnl?.value,
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65}/>
                    ) : (
                        <div className="flex items-center">
                            <div className={getPriceColor(row?.pnl?.value)}>
                                <div>
                                    {row?.pnl?.value > 0 ? '+' : '-'}
                                    {formatNumber(Math.abs(row?.pnl?.value), pairConfig?.pricePrecision, 2)} {row?.symbol?.quoteAsset}
                                </div>
                                <div>
                                    ({row?.pnl?.roe > 0 ? '+' : '-'}
                                    {formatNumber(Math.abs(row?.pnl?.roe), 2)}%)
                                </div>
                            </div>
                        </div>
                    ),
                sortable: true,
            },
            {
                name: 'Close All Position',
                cell: (row) =>
                    loading ? (
                        <Skeletor width={200}/>
                    ) : (
                        <div className="flex items-center whitespace-nowrap">
                            <div className="mr-3">Market</div>
                            <div className="mr-3">Limit</div>
                            <input
                                defaultValue={row?.closeAllPosition?.[0]}
                                className="mr-2 w-[60px] h-[24px] px-1 rounded-md bg-gray-5 dark:bg-darkBlue-4 font-medium"
                            />
                            <input
                                defaultValue={row?.closeAllPosition?.[1]}
                                className="w-[60px] h-[24px] px-1 rounded-md bg-gray-5 dark:bg-darkBlue-4 font-medium"
                            />
                        </div>
                    ),
                minWidth: '250px',
            },
            {
                name: 'TP/SL for Position',
                cell: (row) =>
                    loading ? (
                        <Skeletor width={65}/>
                    ) : (
                        <div className="flex items-center">
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <div>{row?.tpslForPosition?.[0]}/</div>
                                <div>{row?.tpslForPosition?.[1]}</div>
                            </div>
                            <Edit
                                className="ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60"
                                onClick={() => onEditSltp(row)}
                            />
                        </div>
                    ),
                sortable: true,
            },
        ],
        [loading]
    );

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
        });
        const maintenanceMargin = (notional * (rate / 100)) - amount;
        const marginRatio = maintenanceMargin / marginBalance;
        return {
            maintenanceMargin,
            marginRatio,
            marginBalance
        };
    };

    useEffect(() => {
        const tempMarkPrices = clone(markPrices);
        setPositionOrder(positionOrder.map(o => {
            const size = +o.positionAmt;
            const markPrice = tempMarkPrices[o.symbol?.symbol] || +o.markPrice;
            const pnlValue = size * (markPrice - +o.entryPrice);
            const {
                maintenanceMargin,
                marginRatio,
                marginBalance
            } = calculateMarginRatio(size, +o?.isolatedMargin, markPrice, pnlValue);

            const pnlRoe = (pnlValue / marginBalance) * 100;

            return {
                ...o,
                markPrice,
                marginRatio,
                pnl: {
                    value: pnlValue,
                    roe: pnlRoe
                }
            };
        }));
    }, [markPrices]);

    useAsync(async () => {
        setLoading(true);
        try {
            const data = await fetchAPI({
                url: API_GET_FUTURES_POSITION_ORDERS,
                options: {
                    method: 'GET',
                },
                params: {
                    symbol: isHideOthers ? pairConfig?.symbol : undefined,
                },
            });

            if (data?.status === 'ok') {
                const filtered = [];

                data?.data &&
                data.data.forEach((o) => {
                    if (+o?.positionAmt > 0) {
                        const symbol = getSymbolObject(o?.symbol);

                        filtered.push({
                            ...o,
                            symbol,
                            closeAllPosition: [3066.47, 0.019],
                            tpslForPosition: [44000.0, 41900.0],
                        });
                    }
                });

                setPositionOrder(filtered);
            } else {
                setPositionOrder([]);
            }
        } catch (e) {
            console.log(`Can't get position orders: `, e);
        } finally {
            setLoading(false);
            onForceUpdate();
        }
    }, [isHideOthers, pairConfig?.symbol]);

    return (
        <>
            <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5}/>}
                data={loading ? data : positionOrder}
                columns={columns}
                customStyles={customTableStyles}
                noDataComponent={
                    <div className="min-h-[200px] flex items-center justify-center">
                        {/* Place graphics here if needed */}
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                            No data
                        </div>
                    </div>
                }
            />
            <FuturesEditSLTP
                isVisible={isEdit}
                order={currentOrder}
                onClose={onCloseEditSltp}
            />
        </>
    );
};

const data = range(7)
    .map(i => ({
        id: i,
        symbol: {
            symbol: '---',
            baseAsset: '---',
            quoteAsset: '---'
        },
        side: 'SELL',
        size: 0,
        entryPrice: 0,
        markPrice: 0,
        liqPrice: 0,
        marginRatio: 0,
        margin: {
            value: 0,
            mode: '---'
        },
        pnl: {
            value: 0,
            roe: 0
        },
        closeAllPosition: [0, 0],
        tpslForPosition: [0, 0],
    }));

export default FuturesPosition;
