import AssetLogo from 'src/components/wallet/AssetLogo';
import { tableStyle } from 'config/tables';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import AuthSelector from 'redux/selectors/authSelectors';
import { formatWallet } from 'src/redux/actions/utils';
import TableNoData from '../common/table.old/TableNoData';
import TableLoader from '../loader/TableLoader';

const TradeHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);

    const assetConfig = useSelector(state => state.utils.assetConfig);
    const spotWallet = useSelector(state => state?.wallet?.SPOT) || null;
    const [wallet, setWallet] = useState([]);
    const [loading, setLoading] = useState(false);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const { currentPair, filterByCurrentPair, darkMode } = props;

    useEffect(() => {
        if (assetConfig && assetConfig.length && Object.keys(spotWallet).length) {
            let _newWallet = []

            assetConfig.map(config => {
                if(config?.id && spotWallet && spotWallet?.[config?.id]?.value > 0.000001){
                    _newWallet.push({
                        ...config,
                        ...spotWallet?.[config?.id]
                    })
                }
            });

            setWallet(_newWallet)
        }

    }, [spotWallet, assetConfig])

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
            name: t('common:asset'),
            selector: 'assetCode',
            sortable: true,
            ignoreRowClick: true,
            cell: (row) => (
                <div className="flex items-center">
                    <div className="mr-4">
                        <AssetLogo assetCode={row?.assetCode} size={16} />
                    </div>
                    <span className="font-semibold">{row?.assetCode}</span>
                </div>
            ),
            width: '190px',
        },
        {
            name: t('common:total_balance'),
            selector: 'value',
            sortable: true,
            ignoreRowClick: true,
            right: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(row.value)),
        },
        {
            name: t('common:available_balance'),
            ignoreRowClick: true,
            right: true,
            sortable: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(row.value - Math.max(row.locked_value, 0))),
        },
        {
            name: t('common:in_order'),
            selector: 'lockedValue',
            ignoreRowClick: true,
            right: true,
            sortable: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(Math.max(row.locked_value, 0))),
        },
    ], [exchangeConfig]);


    const renderTable = useCallback(() => {
        if (!isAuth || !wallet.length) return <TableNoData />
        let data = wallet

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
    }, [ isAuth, columns, customStyles, loading, filterByCurrentPair, currentPair, props.orderListWrapperHeight])


    return renderTable()
};

export default TradeHistory;
