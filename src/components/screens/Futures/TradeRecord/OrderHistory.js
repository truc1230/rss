import { useMemo } from 'react';
import { FUTURES_RECORD_CODE } from './RecordTableTab';
import { customTableStyles } from './index';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { ChevronDown, Copy, Minus, Plus } from 'react-feather';

import FuturesRecordSymbolItem from './SymbolItem';
import FuturesTimeFilter from './TimeFilter';
import DataTable from 'react-data-table-component';

const FuturesOrderHistory = ({
    pickedTime,
    onChangeTimePicker,
    pairConfig,
}) => {
    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.created_at,
                cell: (row) =>
                    formatTime(row?.created_at, 'dd-MM-yyyy HH:mm:ss'),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                cell: (row) => (
                    <FuturesRecordSymbolItem symbol={row?.symbol?.pair} />
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                cell: () => <span>Limit</span>,
                sortable: true,
            },
            {
                name: 'Side',
                selector: (row) => row?.side,
                cell: () => <span className='text-dominant'>BUY</span>,
                sortable: true,
            },
            {
                name: 'Average',
                selector: (row) => row?.side,
                cell: () => <span className='text-dominant'>BUY</span>,
                sortable: true,
            },
            {
                name: 'Price',
                selector: (row) => row?.price,
                cell: (row) => (
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
                name: 'Executed',
                selector: (row) => row?.executed,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.executed,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.amount,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.amount,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Reduce Only',
                selector: (row) => row?.reduceOnly,
                cell: () => <span>Yes</span>,
                sortable: true,
            },
            {
                name: 'Post Only',
                selector: (row) => row?.postOnly,
                cell: () => <span>No</span>,
                sortable: true,
            },
            {
                name: 'Trigger Conditions',
                selector: (row) => row?.triggerConditions,
                cell: (row) => <div>--</div>,
                minWidth: '180px',
                sortable: true,
            },
            {
                name: 'Status',
                selector: (row) => row?.status,
                cell: () => <span>Filled</span>,
                sortable: true,
            },
        ],
        []
    )

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.orderHistory,
                        pickedTime
                    )
                }
            />
            <DataTable
                fixedHeader
                responsive
                expandableRows
                expandableIcon={{
                    collapsed: (
                        <Plus
                            strokeWidth={1}
                            size={20}
                            className='text-txtSecondary dark:text-txtSecondary-dark'
                        />
                    ),
                    expanded: (
                        <Minus
                            strokeWidth={1}
                            size={20}
                            className='text-txtSecondary dark:text-txtSecondary-dark'
                        />
                    ),
                }}
                expandableRowsComponent={<ExpandedComponent />}
                data={data}
                columns={columns}
                className='mt-2.5'
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                customStyles={customTableStyles}
            />
        </>
    )
}

const ExpandedComponent = ({ data }) => {
    return (
        <div className='pl-[64px] pb-4 bg-[#fafafa] dark:bg-darkBlue-2 text-txtPrimary dark:text-txtPrimary-dark'>
            <div className='w-full flex flex-col border-t border-divider dark:border-divider-dark text-xs font-medium'>
                <div className='mb-2 pt-2.5 flex items-center flex-wrap'>
                    <div className='mr-10'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            Time Updated:
                        </span>{' '}
                        2022-07-15 13:05:20
                    </div>
                    <div className='mr-10'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            Trading Total:
                        </span>{' '}
                        516.00000000 USDT
                    </div>
                    <div className='mr-10 flex items-center'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            Order:
                        </span>{' '}
                        <div className='ml-1 flex items-center cursor-pointer'>
                            No. 4296754578212{' '}
                            <Copy
                                size={14}
                                className='ml-1 text-txtSecondary dark:text-txtSecondary-dark'
                            />
                        </div>
                    </div>
                    <div className='mr-10'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            Total PNL:
                        </span>{' '}
                        2.93928000 USDT
                    </div>
                    <div>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            Total Fee:
                        </span>{' '}
                        0.13928000 USDT
                    </div>
                </div>
                <div className='flex-grow w-full flex flex-nowrap'>
                    <div>
                        <div className='pb-1 border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark'>
                            Time
                        </div>
                        <div className='pr-[80px] mt-2'>
                            2022-07-15 13:05:20
                        </div>
                    </div>
                    <div>
                        <div className='pb-1 border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark'>
                            Trading Price
                        </div>
                        <div className='pr-[80px] mt-2'>
                            2022-07-15 13:05:20
                        </div>
                    </div>
                    <div>
                        <div className='pb-1 border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark'>
                            Executed
                        </div>
                        <div className='pr-[80px] mt-2'>
                            2022-07-15 13:05:20
                        </div>
                    </div>
                    <div>
                        <div className='pb-1 border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark'>
                            PNL
                        </div>
                        <div className='pr-[80px] mt-2'>
                            2022-07-15 13:05:20
                        </div>
                    </div>
                    <div>
                        <div className='pb-1 border-b border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark'>
                            Total
                        </div>
                        <div className='pr-[80px] mt-2'>
                            2022-07-15 13:05:20
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const data = [
    {
        id: 1,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        executed: 272.8,
        amount: 272.8,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        status: 'Filled',
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        executed: 272.8,
        amount: 272.8,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        status: 'Filled',
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        executed: 272.8,
        amount: 272.8,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        status: 'Filled',
    },
    {
        id: 4,
        created_at: 1646607132000,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        executed: 272.8,
        amount: 272.8,
        reduceOnly: true,
        postOnly: false,
        triggerConditions: {},
        status: 'Filled',
    },
]

export default FuturesOrderHistory
