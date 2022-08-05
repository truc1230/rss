import SvgCross from 'src/components/svg/Cross';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import { tableStyle } from 'src/config/tables';
import { API_GET_OPEN_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { formatBalance, formatTime } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import TableNoData from '../common/table.old/TableNoData';
import TableLoader from '../loader/TableLoader';
import Link from 'next/link';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const { toggle } = props;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const user = useSelector(state => state.auth.user);

    const { currentPair, filterByCurrentPair, darkMode } = props;

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = orders.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
            setFilteredOrders(filter);
        } else {
            setFilteredOrders(orders);
        }
    }, [orders, currentPair, filterByCurrentPair]);

    const closeOrder = async (order) => {
        const {displayingId, symbol} = order
        const res = await fetchAPI({
            url: '/api/v3/spot/order',
            options: {
                method: 'DELETE',
            },
            params: {
                displayingId,
                symbol,
            },
        });
        const { status, data } = res;
        let message = '';
        if (status === ApiStatus.SUCCESS) {
            message = t('spot:close_order_success', {
                displayingId, side: data?.side, type: data?.type, token: `${data?.baseAsset}/${data?.quoteAsset}`,
            });
            showNotification({ message, title: 'Success', type: 'success' }, null, 'bottom', 'bottom-right');
        } else {
            showNotification({ message: t('spot:close_order_failed', {
                    displayingId, side: order?.side, type: order?.type, token: `${order?.baseAsset}/${order?.quoteAsset}`,

                }), title: 'Failure', type: 'failure' }, null, 'bottom', 'bottom-right');
        }
    };

    const updateOrder = (data) => {
        if (data?.displayingId) {
            if ([
                ExchangeOrderEnum.Status.NEW,
                ExchangeOrderEnum.Status.PARTIALLY_FILLED,
            ].includes(data?.status)) {
                let _orders = orders || [];
                const index = findIndex(_orders, { displayingId: data?.displayingId });
                if (index < 0) {
                    _orders = [data, ..._orders];
                    setOrders(_orders);
                } else {
                    _orders[index] = data;
                    setOrders(_orders);
                }
            } else {
                let _orders = orders || [];
                if (_orders.length) {
                    _orders = filter(_orders, (o) => { return +o.displayingId !== +data?.displayingId; });
                    setOrders(_orders);
                }
            }
        }
    };
    // Handle update order
    useEffect(() => {
        const event = UserSocketEvent.EXCHANGE_UPDATE_ORDER;
        Emitter.on(event, async (data) => {
            updateOrder(data);
        });

        return function cleanup() {
            Emitter.off(event);
        };
    }, [user, userSocket, orders]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_opening_order';
            userSocket.removeListener(event, setOrders);
            userSocket.on(event, setOrders);
        }
        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_opening_order';
                userSocket.removeListener(event, setOrders);
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
            minWidth: '50px',
        },
        {
            name: t('common:time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            minWidth: '100px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('common:pair'),
            selector: 'symbol',
            ignoreRowClick: true,
            minWidth: '100px',
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
            minWidth: '50px',
        },
        {
            name: `${t('common:buy')}/${t('common:sell')}`,
            selector: 'side',
            ignoreRowClick: true,
            minWidth: '50px',
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
            name: t('common:order_price'),
            ignoreRowClick: true,
            right: true,
            cell: (row) => formatBalance(row.price, 6),
            minWidth: '80px',
        },
        {
            name: t('common:open_quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '80px',
            cell: (row) => row.quantity,
        },
        {
            name: t('common:filled'),
            minWidth: '80px',
            right: true,
            cell: (row) => {
                return (
                    <span>
                        {formatBalance((row?.executedQty / row?.quantity) * 100, 2)}%
                    </span>
                );
            },
        },
        {
            name: '',
            ignoreRowClick: true,
            right: true,
            minWidth: '40px',
            // omit: !toggle,
            cell: (row) => (
                <span className="p-2 cursor-pointer" onClick={() => {
                    closeOrder(row)
                }}>
                    <SvgCross  />
                </span>
            ),
        },

    ], [toggle, currentPair]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_OPEN_ORDER,
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setOrders(data.orders);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) getOrderList();
    }, [user]);

    return (
        <DataTable
            data={filteredOrders}
            columns={columns}
            className="h-full"
            customStyles={customStyles}
            noHeader
            fixedHeader
            fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 100}px`}
            dense
            pagination
            paginationPerPage={30}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
            noDataComponent={<TableNoData bgColor={darkMode ? 'bg-dark-1' : '#FFFFFF'} />}
            progressPending={loading}
            progressComponent={<TableLoader height={props.height} />}
        />
    );
};

export default SpotOrderList;
