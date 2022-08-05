import { useMemo, useState } from 'react';
import TableNoData from 'src/components/common/table.old/TableNoData';
import DataTable from 'react-data-table-component';
import AssetLogo from 'src/components/wallet/AssetLogo';
import { isMobile } from 'react-device-detect';
import AssetName from 'src/components/wallet/AssetName';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getExchange24hPercentageChange, getSparkLine, render24hChange } from 'src/redux/actions/utils';
import { tableStyle } from 'src/config/tables';
import { useTranslation } from 'next-i18next';
import { useAsync, useInterval } from 'react-use';
import { getMarketWatch } from 'src/redux/actions/market';

const InitSymbol = [{
    'b': 'BTC',
}, {
    'b': 'LTC',
}, {
    'b': 'ETH',
}, {
    'b': 'NEO',
}, {
    'b': 'BNB',
}];
const HomeSymbolList = (props) => {
    const [symbolList, setSymbolList] = useState(InitSymbol);
    useAsync(async () => {
        setSymbolList(await getMarketWatch());
    }, []);

    useInterval(async () => {
        await setSymbolList(await getMarketWatch());
    }, 10000);
    const { t } = useTranslation(['common']);
    const columns = useMemo(() => [
        {
            name: t('common:asset'),
            selector: 'asset',
            ignoreRowClick: true,
            cell: (row) => (
                <div className="flex items-center my-4">
                    <div className="lg:mr-4 mr-2 lg:w-12 lg:h-12 w-8 h-8">
                        <AssetLogo assetCode={row?.b} size={isMobile ? 32 : 48} />
                    </div>
                    <div className="font-semibold lg:text-lg text-base lg:mr-4 mr-0 leading-none truncate">
                        <AssetName assetCode={row?.b} />
                    </div>
                    <div
                        className="text-black-500 text-lg leading-none lg:block lg:visible hidden invisible"
                    >{row?.b}
                    </div>
                </div>
            ),
            width: isMobile ? '150px' : '500px',
        },
        {
            name: t('common:last_price'),
            selector: 'p',
            ignoreRowClick: true,
            right: true,
            cell: (row) => (
                <span className={!row?.u ? 'text-red' : 'text-teal'}>
                    {row?.p > 0 ? formatPrice(row?.p) : '-'}
                </span>
            ),
        },
        {
            name: t('common:change_24h'),
            selector: 'change_24h',
            ignoreRowClick: true,
            right: true,
            omit: isMobile,
            cell: (row) => {
                return render24hChange(row);
            },
        },
        {
            name: t('common:market'),
            ignoreRowClick: true,
            right: true,
            omit: isMobile,
            cell: (row) => {
                const change24h = getExchange24hPercentageChange(row);
                return <Image
                    src={getSparkLine(row?.s, change24h >= 0 ? '#00C8BC' : '#E5544B')}
                    height={30.75}
                    width={90}
                    className="h-18"
                    unoptimized
                />;
            },
        },
        {
            name: '',
            selector: 'id',
            ignoreRowClick: true,
            right: true,
            omit: isMobile,
            cell: (row) => (
                <Link href={`/trade/${row?.b}-${row?.q}`} prefetch={false}>
                    <button className="btn btn-green" type="button">{t('common:buy')}</button>
                </Link>),
        },
    ], [isMobile]);
    const customStyles = {
        ...tableStyle,
        headRow: {
            style: {
                borderBottom: '1px solid #EEF2FA!important',
                paddingLeft: isMobile ? '20px' : '48px',
                paddingRight: isMobile ? '20px' : '48px',
                minHeight: '64px',
            },
        },
        rows: {
            style: {
                borderBottom: '1px solid #EEF2FA!important',
                paddingLeft: isMobile ? '20px' : '48px',
                paddingRight: isMobile ? '20px' : '48px',
            },
        },
        cells: {
            style: {
                fontSize: '1.125rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
        headCells: {
            style: {
                color: '#8B8C9B',
                fontSize: '0.875rem',
                fontWeight: '400 !important',
            },
        },
    };
    let symbols = InitSymbol;
    if (symbolList && symbolList.length) {
        symbols = symbolList.slice(0, 5);
    }

    return (
        <DataTable
            data={symbols}
            columns={columns}
            noHeader
            customStyles={customStyles}
            noDataComponent={<TableNoData />}
        />
    );
};

export default HomeSymbolList;
