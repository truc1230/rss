import { tableStyle } from 'config/tables';
import findIndex from 'lodash/findIndex';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import AuthSelector from 'redux/selectors/authSelectors';
import { API_GET_HISTORY_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { formatSpotPrice, formatTime, formatWallet } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import TableNoData from '../common/table.old/TableNoData';
import TableLoader from '../loader/TableLoader';
import Link from 'next/link';

const OrderHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const [histories, setHistories] = useState([]);
    const [filteredHistories, setFilteredHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const { currentPair, filterByCurrentPair, darkMode } = props;

    // Handle update order
    useEffect(() => {
        const event = UserSocketEvent.EXCHANGE_UPDATE_ORDER;
        Emitter.on(event, async (data) => {
            if (!data?.displayingId) return;
            if ([
                ExchangeOrderEnum.Status.CANCELED,
                ExchangeOrderEnum.Status.FILLED,
            ].includes(data?.status)) {
                const _orders = histories || [];
                const index = findIndex(_orders, { displayingId: data?.displayingId });
                if (index < 0) {
                    setHistories([data, ..._orders]);
                } else {
                    _orders[index] = data;
                    setHistories(_orders);
                }
            }
        });

        return function cleanup() {
            Emitter.off(event);
        };
    }, [isAuth, userSocket, histories]);

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = histories.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
            setFilteredHistories(filter);
        } else {
            setFilteredHistories(histories);
        }
    }, [histories, currentPair, filterByCurrentPair]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_history_order';
            userSocket.removeListener(event, setHistories);
            userSocket.on(event, setHistories);
        }

        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_history_order';
                userSocket.removeListener(event, setHistories);
            }
        };
    }, [userSocket]);
    const customStyles = {
        ...tableStyle,
        table: {
            style: {
                ...tableStyle.table?.style,
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
                minHeight: loading ? 0 : '200px',
            },
        },
        headCells: {
            style: {
                ...tableStyle.headCells?.style,
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                padding: 0,
            },
            activeSortStyle: {
                cursor: 'pointer',
                '&:focus': {
                    outline: 'none',
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:focus': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:active': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
            },
            inactiveSortStyle: {
                '&:focus': {
                    outline: 'none',
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:focus': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
                '&:hover:active': {
                    color: darkMode ? '#DBE3E6' : '#8B8C9B',
                },
            },
        },
        headRow: {
            style: {
                ...tableStyle.headRow?.style,
                borderBottom: 'none !important',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
            },
        },
        rows: {
            style: {
                ...tableStyle.rows?.style,
                borderBottom: 'none !important',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
                '&:hover': {
                    background: darkMode ? '#212537' : '#F6F9FC',
                },
            },
        },
        cells: {
            style: {
                ...tableStyle.cells?.style,
                color: darkMode ? '#DBE3E6' : '#02083D',
                padding: 0,
                '&:hover': {
                    color: darkMode ? '#DBE3E6' : '#02083D',
                },
            },
        },
        pagination: {
            style: {
                ...tableStyle.pagination?.style,
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
            },
            pageButtonsStyle: {
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                fill: darkMode ? '#DBE3E6' : '#8B8C9B',
                '&:hover:not(:disabled)': {
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:disabled': {
                    cursor: 'unset',
                    color: darkMode ? '#8B8C9B' : '#d1d1d1',
                    fill: darkMode ? '#8B8C9B' : '#d1d1d1',
                },
            },
        },
    };
    const columns = useMemo(() => [
        {
            name: t('common:order_id'),
            selector: 'displayingId',
            ignoreRowClick: true,
            omit: false,
            width: '80px',
        },
        {
            name: t('common:time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            minWidth: '140px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('common:pair'),
            selector: 'symbol',
            ignoreRowClick: true,
            minWidth: '120px',
            cell: (row) => currentPair !== `${row?.baseAsset}-${row?.quoteAsset}` ?
                <Link href={`/trade/${row?.baseAsset}-${row?.quoteAsset}`}>
                    <a className='dark:text-white text-darkBlue'>
                        {row?.symbol}
                    </a>
                </Link>
                : row?.symbol,
        },
        {
            name: t('common:order_type'),
            selector: 'type',
            ignoreRowClick: true,
            minWidth: '100px',
        },
        {
            name: `${t('common:buy')}/${t('common:sell')}`,
            selector: 'side',
            ignoreRowClick: true,
            minWidth: '80px',
            conditionalCellStyles: [
                {
                    when: row => row.side === 'SELL',
                    style: {
                        color: '#E5544B !important',
                    },
                },
                {
                    when: row => row.side === 'BUY',
                    style: {
                        color: '#00C8BC !important',
                    },
                }],
        },
        {
            name: t('common:avg_price'),
            ignoreRowClick: true,
            right: true,

            cell: (row) => {
                if (row?.executedQuoteQty && row?.executedQty) {
                    return formatSpotPrice(row?.executedQuoteQty / row?.executedQty, row?.symbol);
                }
                return 0;
            },
            minWidth: '120px',
        },
        {
            name: t('common:quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '120px',
            cell: (row) => formatWallet(row.quantity, 4),
        },
        {
            name: t('common:filled'),
            ignoreRowClick: true,
            minWidth: '100px',
            right: true,
            cell: (row) => <div>{formatWallet((row?.executedQty / row?.quantity) * 100, 0)}%</div>,
        },
        {
            name: t('common:total'),
            selector: 'total',
            minWidth: '120px',
            right: true,
            cell: (row) => formatWallet(row.executedQuoteQty, 2),
        },
        {
            name: t('common:status'),
            selector: 'status',
            minWidth: '120px',
            right: true,
            cell: (row) => {
                switch (row.status) {
                    case ExchangeOrderEnum.Status.CANCELED:
                        return (
                            <span
                                className="text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark inline-block py-1 px-2 rounded last:mr-0 mr-1"
                            >
                                {t('common:canceled')}
                            </span>
                        );
                    case ExchangeOrderEnum.Status.FILLED:
                        return (
                            <span
                                className="text-xs font-medium text-teal inline-block py-1 px-2 rounded last:mr-0 mr-1"
                            >
                                {t('common:filled')}
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },

    ], [exchangeConfig, currentPair]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_HISTORY_ORDER,
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistories(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    const renderTable = useCallback(() => {
        if (!isAuth || !histories.length) return <TableNoData />
        let data = histories
        if (filterByCurrentPair) {
            data = histories.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair)
        }

        return (
            <DataTable
                data={data}
                columns={columns}
                customStyles={customStyles}
                className="h-full"
                noHeader
                fixedHeader
                fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 100}px`}
                overflowYOffset={100}
                pagination
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                dense
                noDataComponent={<TableNoData />}
                progressPending={loading}
                progressComponent={<TableLoader height={props.height} />}
                paginationPerPage={50}
                paginationComponentOptions={{ rowsPerPageText: 'Rows:', rangeSeparatorText: '/', noRowsPerPage: false }}
                paginationIconFirstPage={null}
                paginationIconLastPage={null}
            />
        )
    }, [filteredHistories, isAuth, columns, customStyles, loading, filterByCurrentPair, currentPair, props.orderListWrapperHeight])



    // useEffect(() => {
    //     if (filterByCurrentPair) {
    //         const filter = histories.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
    //         setFilteredHistories(filter);
    //     } else {
    //         setFilteredHistories(histories);
    //     }
    // }, [histories, currentPair, filterByCurrentPair]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_history_order';
            userSocket.removeListener(event, setHistories);
            userSocket.on(event, setHistories);
        }

        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_history_order';
                userSocket.removeListener(event, setHistories);
            }
        };
    }, [userSocket]);

    // useEffect(() => {
    //     console.log('namidev-DEBUG: ____ ', filteredHistories)
    // }, [filteredHistories])


    return renderTable()
};

export default OrderHistory;
