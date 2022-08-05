import { useEffect, useMemo, useState } from 'react';
import { customTableStyles } from './index';
import { ChevronDown, X } from 'react-feather';
import { formatNumber, formatTime } from 'redux/actions/utils';

import FuturesRecordSymbolItem from './SymbolItem';
import DataTable from 'react-data-table-component';
import fetchAPI from 'utils/fetch-api';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import showNotification from 'utils/notificationService';
import { useTranslation } from 'next-i18next';
import { API_FUTURES_CANCEL_OPEN_ORDERS, API_GET_FUTURES_OPEN_ORDERS, } from 'redux/actions/apis';
import TableNoData from 'components/common/table.old/TableNoData';
import TableLoader from 'components/loader/TableLoader';

const FuturesOpenOrders = ({ pairConfig }) => {
    const { t } = useTranslation(['common', 'futures']);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const cancelOrder = ({
        orderId,
        symbol
    }) => async () => {
        setLoading(true);
        const { status } = await fetchAPI({
            url: API_FUTURES_CANCEL_OPEN_ORDERS,
            options: {
                method: 'DELETE',
            },
            params: {
                orderId,
                symbol,
            },
        });
        setLoading(false);
        let message = '';
        if (status === ApiStatus.SUCCESS) {
            message = t('futures:close_order_success', { orderId });
            showNotification({
                message,
                title: 'Success',
                type: 'success'
            }, null, 'bottom', 'bottom-right');
        } else {
            showNotification({
                message: t('futures:close_order_failed', { orderId }),
                title: 'Failure',
                type: 'failure'
            }, null, 'bottom', 'bottom-right');
        }
        getOrderList();
    };

    const getOrderList = async () => {
        setLoading(true);
        const {
            status,
            data
        } = await fetchApi({
            url: API_GET_FUTURES_OPEN_ORDERS,
            options: { method: 'GET' },
            params: { symbol: 'BTCUSDT' },
        });
        setLoading(false);

        if (status === ApiStatus.SUCCESS) {
            setOrders(data || []);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.time,
                cell: (row) =>
                    formatTime(row?.time, 'dd-MM-yyyy HH:mm:ss'),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol,
                cell: (row) => (
                    <FuturesRecordSymbolItem symbol={row?.symbol}/>
                ),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                cell: (row) => <span>{row.type}</span>,
                sortable: true,
            },
            {
                name: 'Side',
                selector: (row) => row?.side,
                cell: (row) => <span className="text-dominant">{row.side}</span>,
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
                        )}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.origQty,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.origQty,
                            pairConfig?.quotePrecision || 2
                        )}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Filled',
                selector: (row) => row?.executedQty,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.executedQty,
                            pairConfig?.quotePrecision || 2
                        )}
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
                cell: (row) => <span>{row?.postOnly}</span>,
                sortable: true,
            },
            {
                name: 'Cancel All',
                cell: (row) => (
                    <span className="cursor-pointer" onClick={cancelOrder(row)}>
                        <X
                            strokeWidth={1}
                            size={16}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                        />
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <DataTable
            responsive
            fixedHeader
            sortIcon={<ChevronDown size={8} strokeWidth={1.5}/>}
            data={orders}
            columns={columns}
            customStyles={customTableStyles}
            noDataComponent={<TableNoData/>}
            progressPending={loading}
            progressComponent={<TableLoader/>}
        />
    );
};
//
export default FuturesOpenOrders;
