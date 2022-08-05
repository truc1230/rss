import {endOfDay, format, startOfDay} from "date-fns";
import {Check, ChevronDown, ChevronUp, Copy} from "react-feather";
import colors from "styles/colors";
import DateRangePicker from "components/screens/Mobile/Futures/DateRangePicker";
import React, {useEffect, useMemo, useState} from "react";
import Modal from "components/common/ReModal";
import fetchApi from 'utils/fetch-api';
import {API_GET_VNDC_FUTURES_TRANSACTION_HISTORIES} from "redux/actions/apis";
import classNames from "classnames";
import {concat, filter, find, first, keyBy, last, range} from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import {IconLoading} from "components/common/Icons";
import AssetLogo from "components/wallet/AssetLogo";
import {useSelector} from "react-redux";
import {formatNumber} from "redux/actions/utils";
import {useTranslation} from "next-i18next";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import TableNoData from "components/common/table.old/TableNoData";
import {TransactionCategory} from "../../../../../redux/actions/const";

const categories = [
    'all',// "All",
    TransactionCategory.FUTURE_PLACE_ORDER_FEE, // 600
    TransactionCategory.FUTURE_CLOSE_ORDER_PROFIT, // 602
    TransactionCategory.FUTURE_SWAP, // 603
    TransactionCategory.FUTURE_VNDC_LIQUIDATE_FEE, // 606
    TransactionCategory.FUTURE_INSURANCE_FUND, // 608
    TransactionCategory.FUTURE_PROMOTION, // 609
    TransactionCategory.DEPOSIT, //T: 4
    TransactionCategory.VNDC_DIRECT_WITHDRAW, // 723
    TransactionCategory.PAY_INTEREST_STAKE_TRANSACTION, // 1019

]

const ASSETS = [72, 447, 1, 86, 22]

const noteCases = [
    '^BALANCE: Swap future order (\\d+)$',
    '^BALANCE: Place future order (\\d+) fee$',
    '^BALANCE: Close future order (\\d+) fee$',
    '^BALANCE: Close future order (\\d+) raw profit$',
    '^BALANCE: Close pending future order (\\d+) return fee$',
    '^BALANCE: Liquidate active position (\\d+) liquidate fee$',
    '^BALANCE: Liquidate active position (\\d+) close fee$',
    '^BALANCE: Liquidate active position (\\d+) raw profit$',
]

const getOrderIdFromNote = (note) => {
    const regex = noteCases.map(e => new RegExp(e)).find(r => r.test(note))
    if (!regex) return
    return note.replace(regex, '$1')
}

function TabTransactionsHistory({scrollSnap, active}) {
    const [data, setData] = useState({
        result: [],
        hasNext: false
    })
    const [visibleDateRangePicker, setVisibleDateRangePicker] = useState(false)
    const [visibleCategoryPicker, setVisibleCategoryPicker] = useState(false)
    const [range, setRange] = useState({
        start: null,
        end: null
    })
    const [loading, setLoading] = useState(false)
    const [loadMore, setLoadMore] = useState(false)
    const [transactionDetail, setTransactionDetail] = useState()
    const assetConfigs = useSelector(state => state.utils.assetConfig)
    const timestamp = useSelector((state) => state.heath.timestamp);

    const {t} = useTranslation()

    const assetConfigMap = useMemo(() => {
        return keyBy(filter(assetConfigs, (a) => ASSETS.includes(a.id)), 'id')
    }, [assetConfigs])

    const [category, setCategory] = useState(categories[0])

    const _setRange = (range) => {
        if (range.start && !range.end) {
            range.end = range.start
        }
        setRange(range)
    }

    const fetchData = async (isLoadMore) => {
        if (isLoadMore) {
            setLoadMore(true)
        } else {
            setLoading(true)
        }
        try {
            const res = await fetchApi({
                url: API_GET_VNDC_FUTURES_TRANSACTION_HISTORIES,
                params: {
                    timeFrom: range.start ? startOfDay(range.start).valueOf() : '',
                    timeTo: range.end ? endOfDay(range.end).valueOf() : '',
                    category: category !== 'all' ? category : '',
                    lastId: isLoadMore ? last(data.result)?._id : ''
                }
            })
            if (res.status === 'ok' && res.data) {
                setData({
                    hasNext: res.data.hasNext,
                    result: isLoadMore ? concat(data.result, res.data.result) : res.data.result
                })
                // setTransactionDetail(res.data.result[0])
            }
        } catch (e) {
            console.error('Load transasction error', e?.response?.status)
        } finally {
            console.error('Load transasction load more',)
            if (isLoadMore) {
                setLoadMore(false)
            } else {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (active) {
            fetchData(false)
        }
    }, [range, category, active, timestamp])

    const _renderCategory = (item) => {
        if (!item) return '-'
        const note = (item.note).toLowerCase()
        if (item.category === TransactionCategory.FUTURE_PLACE_ORDER_FEE) {
            if (note.includes('close')) {
                return item.money_use > 0 ?
                    t(`futures:mobile:transaction_histories:categories:refund_of_open_fee`) :
                    t(`futures:mobile:transaction_histories:categories:close_fee`)
            } else {
                return t(`futures:mobile:transaction_histories:categories:open_fee`)
            }
        }
        return categories.includes(item.category) ? t(`futures:mobile:transaction_histories:categories:${item.category}`) : '--'
    }

    const _renderListItem = () => {
        return data.result.map(item => {
            const assetConfig = assetConfigMap[item.currency]
            const orderId = getOrderIdFromNote(item?.note)
            const isUSDT = assetConfig.assetCode === 'USDT';
            const assetDigit = assetConfig?.assetDigit ?? 0;
            return <div
                key={item._id}
                className='flex justify-between p-4 border-b border-onus-line'
                onClick={() => setTransactionDetail(item)}
            >
                <div className='flex items-center'>
                    <AssetLogo size={36} assetId={item.currency}/>
                    <div className='ml-2'>
                        <div
                            className='font-medium text-onus-white text-sm'>{_renderCategory(item)}</div>
                        <div
                            className='font-medium text-onus-grey text-xs mr-2'
                        >
                            {format(new Date(item.created_at), 'yyyy-MM-dd H:mm:ss')}
                        </div>
                    </div>
                </div>
                <div className='text-right'>
                    <div
                        className='font-medium text-onus-white text-sm'
                    >
                        <span>{item.money_use > 0 ? '+' : '-'}{formatNumber(Math.abs(item.money_use), isUSDT ? assetDigit + 2 : assetDigit, null)}</span>
                        <span className="ml-1">{assetConfig?.assetCode}</span>
                    </div>
                    <div
                        className='font-medium text-onus-grey text-xs'
                    >

                        {
                            orderId ?
                                <>
                                    <span>ID:</span>
                                    <span className='ml-1'>{orderId}</span>
                                </> :
                                <span>--</span>
                        }
                    </div>
                </div>
            </div>
        })
    }

    return <div>
        <DateRangePicker
            visible={visibleDateRangePicker}
            onClose={() => setVisibleDateRangePicker(false)}
            value={range}
            onChange={_setRange}
        />
        <CategoryPicker
            t={t}
            visible={visibleCategoryPicker}
            onClose={() => setVisibleCategoryPicker(false)}
            value={category}
            onChange={setCategory}
        />
        <TransactionDetail
            t={t}
            visible={!!transactionDetail}
            onClose={() => setTransactionDetail()}
            transaction={transactionDetail}
            assetConfig={assetConfigMap[transactionDetail?.currency]}
        />
        <div className='sticky top-[2.625rem] bg-onus z-10 flex justify-between text-xs text-onus-grey px-4 pt-2'>
            <div className='flex items-center p-2 -ml-2' onClick={() => setVisibleDateRangePicker(true)}>
                <span className='mr-1'>
                    {range.start && range.end ?
                        <>
                            <span>{format(range.start, 'dd/M/yyyy')}</span>
                            <span className='px-1'>-></span>
                            <span>{format(range.end, 'dd/M/yyyy')}</span>
                        </> :
                        t('futures:mobile:transaction_histories:time')}
                </span>
                <ChevronDown size={12} color={colors.onus.grey}/>
            </div>
            <div
                className={classNames('flex items-center p-2 -mr-2', {
                    'text-onus-base': visibleCategoryPicker
                })}
                onClick={() => setVisibleCategoryPicker(true)}>
                <span className='mr-1'>{t(`futures:mobile:transaction_histories:categories:${category}`)}</span>
                {visibleCategoryPicker ?
                    <ChevronUp size={12} color={colors.onus.base}/> :
                    <ChevronDown size={12} color={colors.onus.grey}/>}
            </div>
        </div>
        <div
            className='h-[calc(100vh-5.25rem)] overflow-y-auto'
        >
            {
                loading ?
                    <Loading/> :
                    !data.result.length ?
                        <TableNoData
                            isMobile
                            title={t('futures:order_table:no_transaction_history')}
                            className="h-[calc(100vh-5.25rem)]"
                        /> :
                        <>
                            {_renderListItem()}
                            {data.hasNext && <div
                                className='flex items-center justify-center text-center h-12 text-sm font-semibold mb-4'
                                onClick={() => fetchData(true)}
                            >{loadMore ? <IconLoading color={colors.onus.white}/> :
                                <span>{t('futures:load_more')}</span>}
                            </div>}
                        </>
            }
        </div>

    </div>
}

const CategoryPicker = ({t, visible, onClose, value, onChange}) => {
    const _onChange = (v) => {
        onChange(v)
        onClose()
    }
    return <Modal
        isVisible={visible}
        onusMode
        onBackdropCb={onClose}
        // onusClassName='pb-8 pt-8'
    >
        <div className="flex flex-col gap-5">
            {categories.map(c => {
                return <div
                    key={c}
                    className='flex justify-between items-center'
                    onClick={() => _onChange(c)}
                >
                    <span className='text-onus-white leading-6 font-medium'>
                        {t(`futures:mobile:transaction_histories:categories:${c}`)}
                    </span>
                    {value === c && <Check size={16} color={colors.onus.base} />}
                </div>
            })}
        </div>
    </Modal>
}

const TransactionDetail = ({t, visible, onClose, transaction, assetConfig = {}}) => {
    const orderId = getOrderIdFromNote(transaction?.note) || '--'
    const assetDigit = assetConfig?.assetDigit ?? 0;
    const isUSDT = assetConfig.assetCode === 'USDT';
    const _renderCategory = (item) => {
        if (!item) return '-'
        const note = (item.note).toLowerCase()
        if (item.category === TransactionCategory.FUTURE_PLACE_ORDER_FEE) {
            if (note.includes('close')) {
                return item.money_use > 0 ?
                    t(`futures:mobile:transaction_histories:categories:refund_of_open_fee`) :
                    t(`futures:mobile:transaction_histories:categories:close_fee`)
            } else {
                return t(`futures:mobile:transaction_histories:categories:open_fee`)
            }
        }
        return categories.includes(item.category) ? t(`futures:mobile:transaction_histories:categories:${item.category}`) : '--'
    }
    
    return <Modal
        isVisible={visible}
        onusMode
        onBackdropCb={onClose}
    >
        <div className='text-onus-white text-center border-b border-onus-bg2 pb-6'>
            <div className='text-sm text-onus-grey leading-[1.375rem] pb-2'>
                {_renderCategory(transaction)}
                {/* {transaction?.category ? t(`futures:mobile:transaction_histories:categories:${transaction?.category}`) : '--'} */}
            </div>
            <div className="text-2xl font-bold">
                <span>{transaction?.money_use > 0 ? '+' : '-'}{formatNumber(Math.abs(transaction?.money_use), isUSDT ? assetDigit + 2 : assetDigit, null)}</span>
                <span className="ml-1">{assetConfig.assetCode}</span>
            </div>
        </div>
        <div className='pt-6 space-y-4'>
            <div className='flex justify-between text-sm leading-[1.375rem]'>
                <span className='text-onus-grey mr-2 whitespace-nowrap'>
                    {t('futures:mobile:transaction_histories:id')}
                </span>
                <div className='flex flex-1 min-w-0 items-center'>
                    <div className='flex-1 min-w-0 overflow-hidden text-right'
                         style={{textOverflow: 'ellipsis'}}>{transaction?._id}</div>
                    <CopyToClipboard text={transaction?._id}>
                        <Copy className='ml-2' size={14} color={colors.onus.grey}/>
                    </CopyToClipboard>
                </div>
            </div>
            <div className='flex justify-between text-sm leading-[1.375rem]'>
                <span className='text-onus-grey'>{t('futures:mobile:transaction_histories:order_id')}</span>
                <div className='flex flex-1 min-w-0 items-center'>
                    <div className='flex-1 min-w-0 overflow-hidden text-right'>{orderId}</div>
                    <CopyToClipboard text={orderId}>
                        <Copy className='ml-2' size={14} color={colors.onus.grey}/>
                    </CopyToClipboard>
                </div>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-onus-grey'>{t('futures:mobile:transaction_histories:time')}</span>
                <span>{transaction?.created_at ? format(new Date(transaction?.created_at), 'yyyy-MM-dd H:mm:ss') : '--'}</span>
            </div>
        </div>
        <div
            className='flex items-center justify-center mt-8 font-bold text-onus-white h-12 rounded bg-onus-base'
            onClick={onClose}
        >{t('futures:mobile:transaction_histories:close')}</div>
    </Modal>
}

const Loading = () => {
    return range(0, 10).map(i => {
        return <div key={i} className='flex justify-between animate-pulse p-4 border-b border-onus-line'>
            <div className='flex items-center'>
                <div className='!rounded-full bg-darkBlue-3 h-9 !w-9'/>
                <div className='flex flex-col justify-between h-full ml-2'>
                    <div className='rounded bg-darkBlue-3 h-3 w-12'/>
                    <div className='rounded bg-darkBlue-3 h-2 w-28'/>
                </div>
            </div>
            <div className='flex flex-col justify-between items-end'>
                <div className='rounded bg-darkBlue-3 w-9 h-3'/>
                <div className='rounded bg-darkBlue-3 w-14 h-2'/>
            </div>
        </div>
    })
}

export default TabTransactionsHistory;
