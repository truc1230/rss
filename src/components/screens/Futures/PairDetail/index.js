import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatNumber, getDecimalScale, secondToMinutesAndSeconds, } from 'redux/actions/utils';
import { usePrevious } from 'react-use';
import { ChevronDown } from 'react-feather';
import { roundTo } from 'round-to';

import FuturesPairDetailItem from './PairDetailItem';
import FuturesPairList from '../PairList';
import InfoSlider from 'components/markets/InfoSlider';
import classNames from 'classnames';

const FuturesPairDetail = ({
    pairPrice,
    markPrice,
    pairConfig,
    forceUpdateState,
    isVndcFutures,
    isAuth
}) => {
    // ? Xử lí minW để khi giá thay đổi, giao diện này sẽ không bị xê dịch.
    // ? Nguyên nhân: Font sida (;_;)
    const [itemsPriceMinW, setItemsPriceMinW] = useState(0)
    const [lastPriceMinW, setLastPriceMinW] = useState(0)

    const [activePairList, setActivePairList] = useState(false)
    const [pairListMode, setPairListMode] = useState('')

    const router = useRouter()
    const { t } = useTranslation()

    // ? Helper
    const itemsPriceRef = useRef()
    const lastPriceRef = useRef()
    const pairListRef = useRef()
    const prevLastPrice = usePrevious(pairPrice?.lastPrice)

    // ? Memmoized Var
    const pricePrecision = useMemo(
        () => pairConfig?.pricePrecision || 0,
        [pairConfig?.pricePrecision]
    )

    // ? Render lastPrice
    const renderLastPrice = useCallback(() => {
        return (
            <div
                ref={lastPriceRef}
                style={{ minWidth: lastPriceMinW }}
                className={classNames(
                    'ml-6 font-bold text-center text-sm text-dominant dragHandleArea tracking-wide',
                    { '!text-red': pairPrice?.lastPrice < prevLastPrice }
                )}
            >
                {formatNumber(
                    roundTo(pairPrice?.lastPrice || 0, pricePrecision),
                    pricePrecision,
                    lastPriceMinW !== undefined ? 0 : pricePrecision
                )}
            </div>
        )
    }, [pairPrice?.lastPrice, pricePrecision, lastPriceMinW, prevLastPrice])

    // ? Render markPrice
    const renderMarkPrice = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName=''
                label={t('futures:mark_price')}
                value={formatNumber(
                    roundTo(markPrice?.markPrice || 0, pricePrecision),
                    pricePrecision,
                    itemsPriceMinW !== undefined ? 0 : pricePrecision
                )}
            />
        )
    }, [markPrice?.markPrice, pricePrecision, itemsPriceMinW])

    const renderMarkPriceItems = useCallback(() => {
        return MARK_PRICE_ITEMS.map((mark) => {
            const { key, code, localized: localizedPath } = mark
            let minWidth = itemsPriceMinW || 0
            let value = null
            let localized = t(localizedPath)

            switch (code) {
                case 'indexPrice':
                    value = formatNumber(
                        roundTo(markPrice?.indexPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case 'fundingCountdown':
                    const rateWidth =
                        markPrice?.fundingRate?.toString()?.length +
                        getDecimalScale(markPrice?.fundingRate) *
                        TEXT_XS_WIDTH_PER_LETTER || 0
                    const timerWidth = TEXT_XS_WIDTH_PER_LETTER * 8

                    value = (
                        <div className='w-[90%] flex items-center justify-between'>
                            <div
                                style={{
                                    minWidth: rateWidth,
                                }}
                                className={classNames({
                                    'text-red': !!markPrice?.fundingRate,
                                })}
                            >
                                {formatNumber(
                                    markPrice?.fundingRate * 100,
                                    4,
                                    4,
                                    true
                                )}
                                %
                            </div>
                            <div className='ml-4'>
                                {markPrice?.nextFundingTime
                                    ? secondToMinutesAndSeconds(
                                        (markPrice?.nextFundingTime -
                                            Date.now()) *
                                        0.001
                                    ).toString()
                                    : '--:--'}
                            </div>
                        </div>
                    )
                    minWidth = rateWidth + timerWidth + 18
                    break
                default:
                    return null
            }

            return (
                <div key={`markPrice_items_${key}`} style={{ minWidth }}>
                    <FuturesPairDetailItem
                        containerClassName=''
                        label={localized}
                        value={value}
                    />
                </div>
            )
        })
    }, [markPrice, pricePrecision, itemsPriceMinW])

    const renderPairPriceItems = useCallback(() => {
        return PAIR_PRICE_DETAIL_ITEMS.map((detail) => {
            const { key, code, localized: localizedPath } = detail

            let minWidth = itemsPriceMinW || 0
            let value = null,
                className = ''
            let localized = t(localizedPath)

            switch (code) {
                case '24hHigh':
                    value = formatNumber(
                        roundTo(pairPrice?.highPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case '24hLow':
                    value = formatNumber(
                        roundTo(pairPrice?.lowPrice || 0, pricePrecision),
                        pricePrecision
                    )
                    break
                case '24hChange':
                    const changeWidth =
                        pairPrice?.priceChange?.toString()?.length +
                        pricePrecision * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const _priceChangeVndc = pairPrice?.lastPrice - pairPrice?.priceChange;
                    value = (
                        <div className='flex items-center'>
                            {/* <div
                                style={{
                                    minWidth: changeWidth,
                                }}
                                className={classNames(
                                    'min-w-1/2 text-dominant',
                                    {
                                        '!text-red': pairPrice?.priceChange < 0 || _priceChangeVndc < 0,
                                    }
                                )}
                            >

                                {
                                    isVndcFutures ? formatNumber(_priceChangeVndc, pricePrecision, 0, true)
                                        :
                                        formatNumber(
                                            roundTo(
                                                pairPrice?.priceChange || 0,
                                                pricePrecision
                                            ),
                                            pricePrecision,
                                            0,
                                            true
                                        )}
                            </div> */}
                            <div
                                className={classNames('pl-2 text-dominant', {
                                    '!text-red':
                                        pairPrice?.priceChangePercent < 0,
                                })}
                            >
                                {formatNumber(
                                    roundTo(
                                        pairPrice?.priceChangePercent * (isVndcFutures ? 100 : 1) || 0,
                                        2
                                    ),
                                    2,
                                    2,
                                    true
                                )}
                                %
                            </div>
                        </div>
                    )
                    minWidth = itemsPriceMinW + 36
                    break
                case 'bestBid':
                    if (!isVndcFutures) return;
                    minWidth = itemsPriceMinW + 41
                    value = <div className="text-red">{formatNumber(pairPrice?.bid, pricePrecision, 0, true)}</div>
                    break
                case 'bestAsk':
                    if (!isVndcFutures) return;
                    minWidth = itemsPriceMinW + 41
                    value = <div className="text-dominant">{formatNumber(pairPrice?.ask, pricePrecision, 0, true)}</div>
                    break
                case '24hBaseVolume':
                    if (isVndcFutures) return;
                    localized += ` (${pairPrice?.baseAsset})`
                    minWidth = itemsPriceMinW + 41
                    value = formatNumber(
                        roundTo(pairPrice?.baseAssetVolume || 0, 3),
                        3
                    )
                    break
                case '24hQuoteVolume':
                    if (isVndcFutures) return;
                    localized += ` (${pairPrice?.quoteAsset})`
                    minWidth = itemsPriceMinW + 50
                    value = formatNumber(
                        roundTo(pairPrice?.quoteAssetVolume || 0, 3),
                        3
                    )
                    break
                default:
                    return null
            }

            return (
                <div
                    key={`pairPrice_items_${key}`}
                    style={{ minWidth: minWidth || 0 }}
                >
                    <FuturesPairDetailItem
                        label={localized}
                        containerClassName={`${className} ${isVndcFutures ? 'mr-[20px]' : ''}`}
                        value={value}
                    />
                </div>
            )
        })
    }, [pairPrice, itemsPriceMinW, pricePrecision, isVndcFutures])

    useEffect(() => {
        setItemsPriceMinW(undefined)
        setLastPriceMinW(undefined)
    }, [pairPrice?.symbol])

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            lastPriceMinW === undefined &&
            lastPriceRef.current &&
            pairPrice &&
            pairPrice?.lastPrice
        ) {
            setLastPriceMinW(lastPriceRef.current?.clientWidth + 6 || 0)
        }
    }, [
        router.query,
        pairPrice?.symbol,
        pairPrice,
        lastPriceRef,
        lastPriceMinW,
    ])

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            itemsPriceMinW === undefined &&
            itemsPriceRef.current &&
            markPrice &&
            markPrice?.markPrice
        ) {
            setItemsPriceMinW((itemsPriceRef?.current?.clientWidth || 20) + 24)
        }
    }, [
        router.query,
        pairPrice?.symbol,
        markPrice,
        itemsPriceRef,
        itemsPriceMinW,
    ])

    return (
        <div className='h-full pl-5 flex items-center'>
            {/* Pair */}
            <div
                className='group relative cursor-pointer'
                onMouseOver={() => setActivePairList(true)}
                onMouseLeave={() => setActivePairList(false)}
            >
                <div className='relative z-10 flex items-center font-bold text-[18px]'>
                    {pairPrice?.baseAsset ? pairPrice?.baseAsset + '/' + pairPrice?.quoteAsset : '-/-'}
                    <ChevronDown
                        size={16}
                        className={classNames(
                            'mt-1 ml-2 transition-transform duration-75',
                            { 'rotate-180': activePairList }
                        )}
                    />
                </div>
                <div className='relative z-10 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('futures:tp_sl:perpetual')}
                </div>
                {/* { && ( */}
                <div
                    className='hidden group-hover:block absolute z-30 left-0 top-full'
                    ref={pairListRef}
                >
                    <FuturesPairList
                        mode={pairListMode}
                        setMode={setPairListMode}
                        isAuth={isAuth}
                        activePairList={activePairList}
                    />
                </div>
                {/* )} */}
            </div>

            {/* Price */}
            {renderLastPrice()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState} className='ml-2'>
                {!isVndcFutures && <>
                    <div
                        ref={itemsPriceRef}
                        style={{ minWidth: itemsPriceMinW || 0 }}
                    >
                        {renderMarkPrice()}
                    </div>

                    {renderMarkPriceItems()}
                </>}
                {renderPairPriceItems()}
            </InfoSlider>
        </div>
    )
}

const TEXT_XS_WIDTH_PER_LETTER = 6.7

const MARK_PRICE_ITEMS = [
    // { key: 0, code: 'markPrice', localized: 'futures:mark_price' },
    { key: 1, code: 'indexPrice', localized: 'futures:index_price' },
    {
        key: 2,
        code: 'fundingCountdown',
        localized: 'futures:funding_countdown',
    },
]

const PAIR_PRICE_DETAIL_ITEMS = [
    { key: 3, code: '24hChange', localized: 'futures:24h_change' },
    { key: 4, code: 'bestBid', localized: 'futures:best_bid' },
    { key: 5, code: 'bestAsk', localized: 'futures:best_ask' },
    { key: 6, code: '24hHigh', localized: 'futures:24h_high' },
    { key: 7, code: '24hLow', localized: 'futures:24h_low' },
    { key: 8, code: '24hBaseVolume', localized: 'futures:24h_volume' },
    { key: 9, code: '24hQuoteVolume', localized: 'futures:24h_volume' },
]

export default FuturesPairDetail
