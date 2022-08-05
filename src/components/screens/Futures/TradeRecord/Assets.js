import { useMemo } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { ChevronDown } from 'react-feather';
import { customTableStyles } from './index';

import DataTable from 'react-data-table-component';
import AssetLogo from '../../../wallet/AssetLogo';

const FuturesAssets = ({ pairConfig }) => {
    const columns = useMemo(
        () => [
            {
                name: 'Assets',
                selector: (row) => row?.symbol?.pair,
                cell: (row) => (
                    <div className='flex items-center'>
                        <AssetLogo
                            assetCode={row?.symbol?.baseAsset}
                            size={24}
                        />
                        <span className='ml-2'>{row?.symbol?.baseAsset}</span>
                    </div>
                ),
                sortable: true,
            },
            {
                name: 'Wallet Balance',
                selector: (row) => row?.balance,
                cell: (row) =>
                    formatNumber(row?.balance, pairConfig?.baseAssetPrecision),
                sortable: true,
            },
            {
                name: 'Unrealized PNL',
                selector: (row) => row?.unrealizedPnl,
                cell: (row) =>
                    formatNumber(
                        row?.unrealizedPnl,
                        pairConfig?.quoteAssetPrecision
                    ),
                sortable: true,
            },
            {
                name: 'Available for Order',
                selector: (row) => row?.availableForOrder,
                cell: (row) => formatNumber(row?.availableForOrder),
                sortable: true,
            },
            {
                name: 'Margin Balance',
                selector: (row) => row?.marginBalance,
                cell: (row) => formatNumber(row?.marginBalance),
                sortable: true,
            },
            {
                name: 'Action',
                cell: () => (
                    <span className='text-dominant cursor-pointer hover:underline'>
                        Transfer
                    </span>
                ),
                sortable: true,
            },
        ],
        []
    )

    return (
        <DataTable
            responsive
            fixedHeader
            sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
            data={data}
            columns={columns}
            customStyles={customTableStyles}
        />
    )
}

const data = [
    {
        key: 1,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        balance: 0.1032,
        unrealizedPnl: 0.01032,
        availableForOrder: 0.01032,
        marginBalance: 0.01032,
    },
    {
        key: 2,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        balance: 0.1032,
        unrealizedPnl: 0.01032,
        availableForOrder: 0.01032,
        marginBalance: 0.01032,
    },
    {
        key: 2,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        balance: 0.1032,
        unrealizedPnl: 0.01032,
        availableForOrder: 0.01032,
        marginBalance: 0.01032,
    },
]

export default FuturesAssets
