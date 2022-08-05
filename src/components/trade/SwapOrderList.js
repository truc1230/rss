import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { tableStyle } from 'config/tables';
import { formatSwapValue, formatTime } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import { API_GET_SWAP_HISTORY } from 'src/redux/actions/apis';
import { ApiStatus } from 'src/redux/actions/const';
import Link from 'next/link';
import { IconSort } from '../common/Icons';
import TableLoader from '../loader/TableLoader';
import TableNoData from '../common/table.old/TableNoData';

const Rate = (props) => {
    const { displayingPriceAsset, displayingPrice, fromAsset, toAsset } = props;
    const displayCoinFrom = displayingPriceAsset === toAsset ? fromAsset : toAsset;
    const displayCoinTo = displayingPriceAsset === toAsset ? toAsset : fromAsset;

    return (
        <>
            <div className="mr-3 flex-grow">
                <span className="font-semibold">1 {displayCoinFrom} = {displayingPrice} {displayCoinTo}</span>
            </div>
        </>
    );
};
const SpotOrderList = (props) => {
    const { successOrder } = props;
    const { t } = useTranslation(['common', 'spot']);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userSocket = useSelector(state => state.socket.userSocket);
    useEffect(() => {
        if (userSocket) {
            const event = 'swap:update_swap_order';
            userSocket.removeListener(event, setOrders);
            userSocket.on(event, setOrders);
        }
        return function cleanup() {
            if (userSocket) {
                const event = 'swap:update_swap_order';
                userSocket.removeListener(event, setOrders);
            }
        };
    }, [userSocket]);

    const customStyles = {
        ...tableStyle,
    };

    const columns = useMemo(() => [
        {
            name: t('common:time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            width: '150px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('common:transaction_id'),
            selector: 'displayingId',
            ignoreRowClick: true,
            right: true,
            omit: false,
            width: '120px',
        },
        {
            name: t('common:pair'),
            selector: 'symbol',
            ignoreRowClick: true,
            omit: false,
            center: true,
            width: '180px',
            cell: (row) => (
                <div className="flex items-center">
                    <div className="w-[45px] text-right">{row?.fromAsset}</div>
                    <div className="mx-2">&gt;</div>
                    <div className="w-[45px] text-left">{row?.toAsset}</div>
                </div>
            ),
        },
        {
            name: t('common:from'),
            selector: 'fromQty',
            ignoreRowClick: true,
            omit: false,
            right: true,
            width: '140px',
            cell: (row) => formatSwapValue(row?.fromQty),
        },
        {
            name: t('common:to'),
            selector: 'toQty',
            ignoreRowClick: true,
            omit: false,
            right: true,
            width: '140px',
            cell: (row) => formatSwapValue(row?.toQty),
        },
        {
            name: t('common:rate'),
            selector: 'displayingPrice',
            ignoreRowClick: true,
            omit: false,
            cell: (row) => <Rate {...row} />,
        },
    ], []);
    const getOrderList = async () => {
        const { status, data } = await fetchAPI({
            url: API_GET_SWAP_HISTORY,
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setOrders(data.orders);
        }
        setLoading(false);
    };
    useEffect(() => {
        getOrderList();
    }, [successOrder]);

    return (
        <>
            <div className="card-header">
                <div className="card-header-text">{t('convert:history')}</div>
                <div className="card-header-actions">
                    <Link href="/wallet/history">
                        <span className="text-sm text-teal-700 font-bold cursor-pointer">{t('convert:view_all')}</span>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                {
                    <DataTable
                        data={orders}
                        columns={columns}
                        sortIcon={<div className="mx-1"><IconSort /></div>}
                        defaultSortField="value"
                        defaultSortAsc={false}
                        noHeader
                        customStyles={customStyles}
                        overflowY // prevent clipping menu
                        overflowYOffset="150px"
                        pagination
                        noDataComponent={<TableNoData />}
                        progressPending={loading}
                        progressComponent={<TableLoader />}
                        dense
                        paginationComponentOptions={{
                            rowsPerPageText: t('common:rows_per_page'),
                            rangeSeparatorText: t('common:of'),
                            noRowsPerPage: false,
                            selectAllRowsItem: false,
                            selectAllRowsItemText: t('common:all'),
                        }}
                    />
                }

            </div>

        </>
    );
};
export default SpotOrderList;
