import { useEffect, useMemo, useState } from 'react';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { FUTURES_RECORD_CODE } from './RecordTableTab';
import { customTableStyles } from './index';
import { ChevronDown } from 'react-feather';

import FuturesRecordSymbolItem from './SymbolItem';
import FuturesTimeFilter from './TimeFilter';
import DataTable from 'react-data-table-component';
import fetchApi from 'utils/fetch-api';
import { API_GET_TRADE_HISTORY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import Skeletor from 'src/components/common/Skeletor';

const FuturesTradeHistory = ({
    pickedTime,
    onChangeTimePicker,
    pairConfig,
    onForceUpdate,
}) => {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)

    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.time,
                cell: (row) => loading ? <Skeletor width={65} /> : formatTime(row?.time, 'dd-MM-yyyy HH:mm:ss'),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                cell: (row) => loading ? <Skeletor width={65} /> : (
                    <FuturesRecordSymbolItem symbol={row?.symbol?.pair} />
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                cell: (row) => loading ? <Skeletor width={65} /> : <span>{row?.type}</span>,
                sortable: true,
            },
            {
                name: 'Side',
                selector: (row) => row?.side,
                cell: () => loading ? <Skeletor width={65} /> : <span className='text-dominant'>BUY</span>,
                sortable: true,
            },
            {
                name: 'Price',
                selector: (row) => row?.price,
                cell: (row) => loading ? <Skeletor width={100} /> : (
                    <span>
                        {formatNumber(
                            row?.price,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Quantity',
                selector: (row) => row?.quantity,
                cell: (row) => loading ? <Skeletor width={65} /> : (
                    <span>
                        {formatNumber(
                            row?.quantity,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Fee',
                selector: (row) => row?.fee,
                cell: (row) => loading ? <Skeletor width={65} /> : (
                    <span>
                        {formatNumber(
                            row?.fee,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Realized Profit',
                selector: (row) => row?.realizedProfit,
                cell: (row) => loading ? <Skeletor width={65} /> : (
                    <span>
                        {formatNumber(
                            row?.realizedProfit,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
        ],
        [loading]
    )

    useEffect(() => {
        onFilter()
    }, [])

    const onFilter = async (filter) => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_TRADE_HISTORY,
                options: { method: 'GET' },
                params: { symbol: pairConfig?.symbol, ...filter },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data)
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(`Can't get swap history `, e)
        } finally {
            setLoading(false)
            onForceUpdate()
        }
    }

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.tradingHistory,
                        pickedTime
                    )
                }
                onFilter={onFilter}
            />
            <DataTable
                responsive
                fixedHeader
                data={loading ? data : dataSource}
                columns={columns}
                className='mt-3'
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                customStyles={customTableStyles}
            />
        </>
    )
}

const data = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
    {
        id: 5,
    },
    {
        id: 6,
    },
]

export default FuturesTradeHistory
