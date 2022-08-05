import { useCallback, useState } from 'react';
import { useAsync } from 'react-use';
import { API_GET_SWAP_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { ApiStatus } from 'redux/actions/const';
import { formatPrice, formatTime } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { ChevronLeft, ChevronRight } from 'react-feather';

import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import fetchApi from '../../../utils/fetch-api';
import MCard from 'src/components/common/MCard';
import Skeletor from 'src/components/common/Skeletor';
import Empty from 'src/components/common/Empty';

const SwapHistory = ({ width }) => {
    const [state, set] = useState({
        page: 0,
        pageSize: 5,
        loading: false,
        histories: null,
    })
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    const { t, i18n: { language } } = useTranslation(['convert'])

    useAsync(async () => {
        setState({ loading: true, histories: null })
        try {
            const { status, data: { orders: histories } } = await fetchApi({
                url: API_GET_SWAP_HISTORY,
                options: { method: 'GET' },
                params: { page: state.page, pageSize: state.pageSize }
            })

            if (status === ApiStatus.SUCCESS && histories) {
                setState({ histories })
            }
        } catch (e) {
            console.log(`Can't get swap history `, e)
        } finally {
            setState({ loading: false })
        }
    }, [state.page, state.pageSize])

    const renderTable = useCallback(() => {
        const data = dataHandler(state.histories, state.loading)
        const modifyColumns = []
        let tableStatus

        const translater = (key) => {
            switch (key) {
                case 'id':
                    return language === LANGUAGE_TAG.VI ? 'ID' : 'ID'
                case 'swap_pair':
                    return language === LANGUAGE_TAG.VI ? 'Cặp quy đổi' : 'Swap Pair'
                case 'from_qty':
                    return language === LANGUAGE_TAG.VI ? 'Từ' : 'From'
                case 'to_qty':
                    return language === LANGUAGE_TAG.VI ? 'Đến' : 'To'
                case 'rate':
                    return language === LANGUAGE_TAG.VI ? 'Tỉ giá' : 'Rate'
                case 'time':
                    return language === LANGUAGE_TAG.VI ? 'Thời gian' : 'Time'
                default:
                    return ''
            }
        }
        columns.forEach(c => modifyColumns.push({...c, title: translater(c.key)}))

        if (!state.histories?.length) {
            tableStatus = <Empty/>
        }

        return (
            <ReTable
                // sort
                // defaultSort={{ key: 'time', direction: 'desc' }}
                // useRowHover
                data={data}
                columns={modifyColumns}
                rowKey={item => `${KEY}___${item?.key}`}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '888px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
            />
        )
    }, [state.histories, state.loading, state.page, language, width])

    const renderPagination = useCallback(() => {
        return (
            <div className="w-full mt-6 flex items-center justify-center select-none">
                <div className={state.page !== 0 ? 'flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                                                 : 'flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'}
                     onClick={() => state.page !== 0 && setState({ page: state.page - 1 })}>
                    <ChevronLeft size={18} className="mr-2"/> {language === LANGUAGE_TAG.VI ? 'Trước' : 'Previous'}
                </div>
                <div className={state.histories?.length ? 'ml-10 flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                                : 'ml-10 flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'}
                     onClick={() => state.histories?.length && setState({ page: state.page + 1 })}>
                    {language === LANGUAGE_TAG.VI ? 'Kế tiếp' : 'Next'} <ChevronRight size={18} className="ml-2"/>
                </div>
            </div>
        )
    }, [state.page, state.histories])

    return (
        <div className="mal-container mt-20">
            <div className="px-4 lg:px-0 text-[18px] md:text-[20px] lg:text-[26px] font-bold">
                {t('convert:history')}
            </div>
            <MCard addClass="mt-8 py-0 px-0 overflow-hidden">
                {renderTable()}
            </MCard>
            {renderPagination()}
        </div>
    )
}

const LIMIT_ROW = 5
const KEY = 'swap_history__item_'

const columns = [
    { key: 'id', dataIndex: 'id', title: 'Order#ID', width: 100, fixed: 'left', align: 'left' },
    { key: 'swap_pair', dataIndex: 'swap_pair', title: 'Swap Pair', width: 100, align: 'left' },
    { key: 'from_qty', dataIndex: 'from_qty', title: 'From Quantity', width: 100, align: 'right' },
    { key: 'to_qty', dataIndex: 'to_qty', title: 'To Quantity', width: 100, align: 'right' },
    { key: 'rate', dataIndex: 'rate', title: 'Rate', width: 100, align: 'right' },
    { key: 'time', dataIndex: 'time', title: 'Time', width: 100, align: 'right' },
]

const dataHandler = (data, loading) => {
    if (loading) {
        const skeleton = []
        for (let i = 0; i < LIMIT_ROW; ++i) {
            skeleton.push({...ROW_LOADING_SKELETON, key: `${KEY}${i}`})
        }
        return skeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    const result = []
    data.forEach(item => {
        const { displayingId, displayingPrice, displayingPriceAsset, feeMetadata: fee, fromAsset, toAsset, fromQty,
                toQty, createdAt  } = item
        // createdAt: "2021-11-15T08:18:23.162Z"
        // displayingId: "259"
        // displayingPrice: 644
        // displayingPriceAsset: "USDT"
        // feeMetadata: {value: 9.27, asset: 'USDT', assetId: 22}
        // fromAsset: "BNB"
        // fromAssetId: 40
        // fromQty: 12
        // price: 643.98
        // toAsset: "USDT"
        // toAssetId: 22
        // toQty: 7727.76
        // updatedAt: "2021-11-15T08:18:23.162Z"
        // userId: 888
        // _id: "619217cfd3297c78ea07fcba"

        result.push({
            key: `${KEY}${displayingId}`,
            id: <div className="text-left">{displayingId}</div>,
            swap_pair: <div className="text-left">{fromAsset} <span className="inline-block mx-1">&#8652;</span> {toAsset}</div>,
            from_qty: <div className="text-right">{formatPrice(+fromQty)} {fromAsset}</div>,
            to_qty: <div className="text-right">{formatPrice(+toQty)} {toAsset}</div>,
            rate: <div className="text-right">1 {displayingPriceAsset === fromAsset ? toAsset : fromAsset} = {formatPrice(+displayingPrice)} {displayingPriceAsset}</div>,
            time: <div className="text-right">{formatTime(createdAt, 'HH:mm dd-MM-yyyy')}</div>,
            [RETABLE_SORTBY]: {
                id: +displayingId,
                swap_pair: `${fromAsset}${toAsset}`,
                from_qty: +fromQty,
                to_qty: +toQty,
                rate: +displayingPrice,
                time: createdAt
            }
        })
    })

    return result
}

const ROW_LOADING_SKELETON = {
    id: <Skeletor width={65} />,
    swap_pair: <Skeletor width={65} />,
    from_qty: <Skeletor width={65} />,
    to_qty: <Skeletor width={65} />,
    rate: <Skeletor width={65} />,
    time: <Skeletor width={65} />,
}

export default SwapHistory
