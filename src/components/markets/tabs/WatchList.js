import { IconSort, IconStar, IconStarFilled, IconTooltip } from 'src/components/common/Icons';
import TableNoData from 'src/components/common/table.old/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import AssetLogo from 'src/components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Info } from 'react-feather';
import { useSelector } from 'react-redux';
import { formatAbbreviateNumber, getAssetName, getChangePercentage, getSparkLine } from 'redux/actions/utils';
import { tableStyle } from 'src/config/tables';
import { formatBalance, getExchange24hPercentageChange, getLoginUrl, render24hChange } from 'src/redux/actions/utils';

const WatchList = ({ favoriteList, symbolList, handleSetFavorite, quoteAsset, renderPriceData, renderPercentageChange, multiValue, searchString }) => {
    const user = useSelector(state => state.auth.user) || null;
    // console.log(favoriteList, symbolList);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const { t } = useTranslation(['markets', 'common']);

    useEffect(() => {
        if (user && favoriteList?.length) {
            const filter = [];
            favoriteList.forEach(item => filter.push(...symbolList.filter(symbol => symbol.b === item && (symbol.q === quoteAsset))));
            setList(filter);
            setFilteredList(filter);
        }
    }, [symbolList, favoriteList, quoteAsset, user]);

    useEffect(() => {
        if (searchString && searchString?.length > 0) {
            setFilteredList(list.filter(symbol => symbol?.b.toLowerCase().includes(searchString.toLowerCase())));
        } else {
            setFilteredList(list);
        }
    }, [searchString, list]);

    const columns = useMemo(() => [
        {
            width: '10px',
            ignoreRowClick: true,
            cell: (row) => (
                <>
                    <span className="mr-1 cursor-pointer" onClick={() => user && handleSetFavorite(row?.b)}>
                        {favoriteList && favoriteList.length && favoriteList.includes(row?.b) ? <IconStarFilled /> : <IconStar />}
                    </span>
                </>
            ),
        },
        {
            name: t('common:assets'),
            selector: 'b',
            width: '180px',
            ignoreRowClick: true,
            cell: (row) => (
                <>
                    <Link href={`/trade/${row?.b}-${row?.q}`} prefetch={false}>
                        <div className="flex items-center justify-between">
                            <AssetLogo assetCode={row?.b} size={24} />
                            <div className="ml-2">
                                <p className="text-sm font-semibold cursor-pointer">{row?.b}</p>
                                <p className="text-xs text-[#8B8C9B] font-normal">{getAssetName(row?.bi)}</p>
                            </div>
                        </div>
                    </Link>
                </>
            ),
            sortable: true,
        },
        {
            name: t('common:last_price'),
            selector: 'p',
            width: '140px',
            ignoreRowClick: true,
            right: true,
            sortFunction: (a, b) => {
                if (typeof a?.p === 'undefined') {
                    return -1;
                }
                if (typeof b?.p === 'undefined') {
                    return 1;
                }
                return a?.p - b?.p;
            },
            cell: (row) => (
                <span className={!row?.u ? 'text-red' : 'text-teal'}>
                    {renderPriceData(+row?.p)}
                </span>
            ),
            sortable: true,
        },
        {
            name: t('markets:trending'),
            width: '150px',
            ignoreRowClick: true,
            right: true,
            cell: (row) => {
                const change24h = getExchange24hPercentageChange(row);
                return (
                    <span>
                        <Image
                            src={getSparkLine(`${row?.b}${row?.q}`, change24h >= 0 ? '#00C8BC' : '#E5544B')}
                            height={30.75}
                            width={90}
                            unoptimized
                        />
                    </span>
                );
            },
            sortable: false,
        },
        {
            name: `${t('common:change')} 24h`,
            selector: 'change_24h',
            width: '135px',
            ignoreRowClick: true,
            right: true,
            sortFunction: (a, b) => {
                // if (!getExchange24hPercentageChange(a)) {
                //     return -1;
                // }
                // if (!getExchange24hPercentageChange(b)) {
                //     return 1;
                // }
                return getExchange24hPercentageChange(a) - getExchange24hPercentageChange(b);
            },
            cell: (row) => {
                return render24hChange(row);
            },
            sortable: true,
        },
        // {
        //     name: `${t('common:change')} 1h`,
        //     width: '135px',
        //     ignoreRowClick: true,
        //     right: true,
        //     selector: (row) => renderPercentageChange(row?.p, row?.ph),
        //     sortFunction: (a, b) => {
        //         const pa = ((a?.p - a?.ph) / a?.ph) * 100;
        //         const pb = ((b?.p - b?.ph) / b?.ph) * 100;
        //         return pa - pb;
        //     },
        //     cell: (row) => renderPercentageChange(row?.p, row?.ph),
        //     sortable: true,
        // },
        {
            name: `${t('common:change')} 7d`,
            width: '135px',
            ignoreRowClick: true,
            right: true,
            selector: (row) => renderPercentageChange(row?.p, row?.pw),
            sortFunction: (a, b) => {
                const pa = ((a?.p - a?.pw) / a?.pw) * 100;
                const pb = ((b?.p - b?.pw) / b?.pw) * 100;
                const first = (Number.isNaN(pa) || pa === undefined || pa === 'NaN' || pa === Infinity) ? -0.00000000000000000000001 : pa;
                const second = (Number.isNaN(pb) || pb === undefined || pb === 'NaN' || pb === Infinity) ? -0.00000000000000000000001 : pb;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => renderPercentageChange(row?.p, row?.pw),
            sortable: true,
        },
        {
            name: `${t('common:change')} 1M`,
            width: '135px',
            ignoreRowClick: true,
            right: true,
            selector: (row) => renderPercentageChange(row?.p, row?.p1m),
            sortFunction: (a, b) => {
                const pa = ((a?.p - a?.p1m) / a?.p1m) * 100;
                const pb = ((b?.p - b?.p1m) / b?.p1m) * 100;
                const first = (Number.isNaN(pa) || pa === undefined || pa === 'NaN' || pa === Infinity) ? -0.00000000000000000000001 : pa;
                const second = (Number.isNaN(pb) || pb === undefined || pb === 'NaN' || pb === Infinity) ? -0.00000000000000000000001 : pb;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => renderPercentageChange(row?.p, row?.p1m),
            sortable: true,
        },
        // {
        //     name: `${t('common:change')} 3M`,
        //     width: '150px',
        //     ignoreRowClick: true,
        //     right: true,
        //     selector: (row) => renderPercentageChange(row?.p, row?.p3m),
        //     sortFunction: (a, b) => {
        //         const pa = ((a?.p - a?.p3m) / a?.p3m) * 100;
        //         const pb = ((b?.p - b?.p3m) / b?.p3m) * 100;
        //         return pa - pb;
        //     },
        //     cell: (row) => renderPercentageChange(row?.p, row?.p3m),
        //     sortable: true,
        // },
        {
            name: `${t('common:volume')} 24h`,
            selector: 'vb',
            width: '190px',
            ignoreRowClick: true,
            right: true,
            cell: (row) => (
                <span>
                    {formatBalance(+row?.vb, 0, true)} {row?.b}
                </span>
            ),
            sortable: true,
        },
        {
            name: (
                <p className="flex items-center">
                    {t('common:change_volume')}
                    <span className="group ml-1 cursor-help">
                        <Info size={12} />
                        <div
                            className="absolute z-10 -bottom-3.5 -right-1 hidden group-hover:flex text-white px-3 py-1 rounded-md"
                        >
                            <div className="relative w-full">
                                <div className="bg-violet-100 text-white text-xs rounded py-1 px-4 right-0 bottom-full">
                                    <IconTooltip isReverse />
                                    <p className="w-max">{t('markets:change_volume_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </span>
                </p>
            ),
            selector: 'av',
            width: '165px',
            ignoreRowClick: true,
            right: true,
            sortFunction: (a, b) => {
                const pA = a?.av > 0 && a?.vb > 0 ? (a?.vb - a?.av) / a?.av : 0;
                const pB = b?.av > 0 && b?.vb > 0 ? (b?.vb - b?.av) / b?.av : 0;
                const first = (Number.isNaN(pA) || pA === undefined || pA === 'NaN' || pA === Infinity) ? -0.00000000000000000000001 : pA;
                const second = (Number.isNaN(pB) || pB === undefined || pB === 'NaN' || pB === Infinity) ? -0.00000000000000000000001 : pB;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
                // if (a?.av <= 0 || a?.vb <= 0) {
                //     return -1;
                // }
                // if (b?.av <= 0 || b?.vb <= 0) {
                //     return 1;
                // }
                // return pA - pB;
            },
            cell: (row) => (
                <span>
                    { +row?.av > 0 && +row?.vb > 0 ? getChangePercentage(+row?.av, +row?.vb) : '-'}
                </span>
            ),
            sortable: true,
        },
        // {
        //     name: `${t('common:change')} 1Y`,
        //     width: '150px',
        //     ignoreRowClick: true,
        //     right: true,
        //     selector: (row) => renderPercentageChange(row?.p, row?.py),
        //     sortFunction: (a, b) => {
        //         const pa = ((a?.p - a?.py) / a?.py) * 100;
        //         const pb = ((b?.p - b?.py) / b?.py) * 100;
        //         return pa - pb;
        //     },
        //     cell: (row) => renderPercentageChange(row?.p, row?.py),
        //     sortable: true,
        // },
        {
            name: `${t('markets:price_low')} 1Y`,
            width: '150px',
            ignoreRowClick: true,
            right: true,
            selector: 'ly',
            sortFunction: (a, b) => {
                // const first = (Number.isNaN(a?.ly) || a?.ly === undefined) ? 0 : a?.ly;
                // const second = (Number.isNaN(b?.ly) || b?.ly === undefined) ? 0 : b?.ly;
                const first = (Number.isNaN(a?.ly) || a?.ly === undefined || a?.ly === 'NaN' || a?.ly === Infinity) ? -0.00000000000000000000001 : a?.ly;
                const second = (Number.isNaN(b?.ly) || b?.ly === undefined || b?.ly === 'NaN' || b?.ly === Infinity) ? -0.00000000000000000000001 : b?.ly;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => renderPriceData(row?.ly),
            sortable: true,
        },
        {
            name: `${t('markets:price_high')} 1Y`,
            width: '150px',
            ignoreRowClick: true,
            right: true,
            selector: 'hy',
            sortFunction: (a, b) => {
                const first = (Number.isNaN(a?.hy) || a?.hy === undefined || a?.hy === 'NaN' || a?.hy === Infinity) ? -0.00000000000000000000001 : a?.hy;
                const second = (Number.isNaN(b?.hy) || b?.hy === undefined || b?.hy === 'NaN' || b?.hy === Infinity) ? -0.00000000000000000000001 : b?.hy;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => renderPriceData(row?.hy),
            sortable: true,
        },
        {
            name: 'ATH',
            width: '150px',
            ignoreRowClick: true,
            right: true,
            selector: 'ath',
            sortFunction: (a, b) => {
                const first = (Number.isNaN(a?.ath) || a?.ath === undefined || a?.ath === 'NaN' || a?.ath === Infinity) ? -0.00000000000000000000001 : a?.ath;
                const second = (Number.isNaN(b?.ath) || b?.ath === undefined || b?.ath === 'NaN' || b?.ath === Infinity) ? -0.00000000000000000000001 : b?.ath;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => renderPriceData(row?.ath),
            sortable: true,
        },
        {
            name: 'Market Cap',
            width: '150px',
            ignoreRowClick: true,
            right: true,
            selector: (row) => row?.sp * row?.p,
            sortFunction: (a, b) => {
                const pa = a?.sp * a?.p;
                const pb = b?.sp * b?.p;
                const first = (Number.isNaN(pa) || pa === undefined || pa === 'NaN' || pa === Infinity) ? -0.00000000000000000000001 : pa;
                const second = (Number.isNaN(pb) || pb === undefined || pb === 'NaN' || pb === Infinity) ? -0.00000000000000000000001 : pb;

                if (first < second) {
                    return -1;
                } if (first > second) {
                    return 1;
                }
                return 0;
            },
            cell: (row) => ((Number.isNaN(row?.sp * row?.p) || row?.sp * row?.p === 'NaN') ? '-' : '$' + formatAbbreviateNumber(row?.sp * row?.p * multiValue, 1)),
            sortable: true,
        },
        // {
        //     name: 'Supply',
        //     width: '150px',
        //     ignoreRowClick: true,
        //     right: true,
        //     selector: 'sp',
        //     cell: (row) => (formatAbbreviateNumber(row?.sp, 1) === '-' ? '-' : (formatAbbreviateNumber(row?.sp, 1) + ` ${row?.b}`)),
        //     sortable: true,
        // },
        {
            name: (
                <p className="flex items-center">
                    {t('markets:views')}
                    <span className="group ml-1 cursor-help">
                        <Info size={12} />
                        <div
                            className="absolute z-10 -bottom-3.5 -right-1 hidden group-hover:flex text-white px-3 py-1 rounded-md"
                        >
                            <div className="relative w-full">
                                <div className="bg-violet-100 text-white text-xs rounded py-1 px-4 right-0 bottom-full">
                                    <IconTooltip isReverse />
                                    <p className="w-max">{t('markets:views_hint')}</p>
                                </div>
                            </div>
                        </div>
                    </span>
                </p>
            ),
            width: '130px',
            ignoreRowClick: true,
            right: true,
            selector: 'vc',
            sortFunction: (a, b) => {
                if (typeof a?.vc === 'undefined') {
                    return -1;
                }
                if (typeof b?.vc === 'undefined') {
                    return 1;
                }
                return a?.vc - b?.vc;
            },
            cell: (row) => ((typeof row?.vc === 'undefined') ? '-' : formatAbbreviateNumber(row?.vc, 0)),
            sortable: true,
        },
        {
            name: t('common:action'),
            width: '120px',
            selector: 'id',
            ignoreRowClick: true,
            right: true,
            cell: (row) => (
                <Link href={`/trade/${row?.b}-${row?.q}`} prefetch={false}>
                    <span className="cursor-pointer text-violet font-semibold"> {t('markets:place_order')}</span>
                </Link>),
        },
    ], [filteredList, multiValue]);

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                '&:nth-child(odd)': {
                    background: '#F6F9FC',
                },
                height: '60px',
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
    };

    if (user) {
        return (
            <DataTable
                data={filteredList}
                columns={columns}
                noHeader
                customStyles={customStyles}
                overflowY // prevent clipping menu
                noDataComponent={<TableNoData />}
                sortIcon={<div className="mx-1"><IconSort /></div>}
                className="ats-table"
                style={{
                    padding: 0,
                    margin: 0,
                }}
                progressComponent={<TableLoader />}
                pagination
                paginationPerPage={30}
                paginationComponentOptions={{ noRowsPerPage: true }}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <TableNoData />
            <a href={getLoginUrl('sso')} className="btn button-common block text-center">
                {t('common:sign_in_to_continue')}
            </a>
        </div>
    );
};

export default WatchList;
