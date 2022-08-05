import { tableStyle } from 'config/tables';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import AuthSelector from 'redux/selectors/authSelectors';
import { API_GET_HISTORY_TRADE } from 'src/redux/actions/apis';
import { ApiStatus } from 'src/redux/actions/const';
import { formatTime, formatWallet } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import TableNoData from '../common/table.old/TableNoData';
import TableLoader from '../loader/TableLoader';

const TradeHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const [histories, setHistories] = useState([]);
    const [filteredHistories, setFilteredHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const { currentPair, filterByCurrentPair, darkMode } = props;

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
    // id date pair side price quantity fee total

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
            selector: 'price',

            minWidth: '100px',
        },
        {
            name: t('common:quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '100px',
            cell: (row) => formatWallet(row.baseQty, 4),
        },
        {
            name: t('common:total'),
            selector: 'quoteQty',
            minWidth: '120px',
            right: true,
            cell: (row) => <span className="px-2">{formatWallet(row.quoteQty, 2)}</span>,
        },
    ], [exchangeConfig]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_HISTORY_TRADE,
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


    return renderTable()
};

export default TradeHistory;
