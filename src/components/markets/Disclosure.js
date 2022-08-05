/* eslint-disable react/button-has-type */
import { useTranslation } from 'next-i18next';
import { formatPercentage, getExchange24hPercentageChange, getS3Url, render24hChange, } from 'src/redux/actions/utils';
import {
    IconAddAction,
    IconArrowDownSlim,
    IconDeleteAction,
    IconDisclosureAction,
    IconEditAction,
    IconPinAction,
    IconSort,
    IconTooltip,
    IconValueDecrease,
    IconValueIncrease,
} from 'src/components/common/Icons';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useMemo, useState } from 'react';
import { useComponentVisible, useWindowSize } from 'src/utils/customHooks';
import DataTable from 'react-data-table-component';
import { deleteCategory, updateCategory } from 'src/redux/actions/market';
import { tableStyle } from 'config/tables';
import Link from 'next/link';
import {
    formatAbbreviateNumber,
    formatBalance,
    getAssetName,
    getChangePercentage,
    getSparkLine
} from 'redux/actions/utils';
import { Info } from 'react-feather';
import Image from 'next/image';
import AssetLogo from 'src/components/wallet/AssetLogo';
import TableLoader from '../loader/TableLoader';
import TableNoData from '../common/table.old/TableNoData';

const Disclosure = ({ id, itemName, itemAvatar, badge, data, isDefault, actions, handleReloadCategoryList, handleToggleModal, renderPriceData, renderPercentageChange, multiValue }) => {
    const { t } = useTranslation(['markets', 'common']);

    const [dropDownActive, setDropDownActive] = useState(false);

    const { width } = useWindowSize();
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

    const validateItemName = (name) => {
        if (name && typeof name === 'string') {
            return name;
        }
        return '-';
    };

    const validateItemAvatar = (avatar) => {
        if (avatar && typeof avatar === 'string') {
            return <img src={getS3Url(avatar)} alt="avatar" width={36} height={36} className="mr-3 rounded-md" />;
        }
        return null;
    };

    const validateBadge = (hasBadge) => {
        if (hasBadge) {
            return (
                <div className="text-xxs text-white bg-black px-2 py-1 rounded">
                    {t('category_label_is_default')}
                </div>
            );
        }
        return null;
    };

    const handleToggleAction = () => {
        setIsComponentVisible(!isComponentVisible);
    };

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                height: '40px',
                background: '#F6F9FC',
                '&:not(:last-of-type)': {
                    borderBottom: '1px solid #E1E2ED !important',
                },
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
        headRow: {
            style: {
                background: '#F6F9FC',
                border: 'none',
            },
        },
    };

    const columns = useMemo(() => [
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
    ], [data, multiValue]);

    const handleToggleDropdown = () => {
        setDropDownActive(!dropDownActive);
    };

    const calculateVolume = () => {
        if (data.length > 1) {
            return `$${formatAbbreviateNumber(data.reduce((a, b) => {
                return ({ vq: a?.vq + b?.vq });
            }).vq * multiValue, 1)}`;
        }

        if (data.length > 0) return `$${formatAbbreviateNumber(data[0]?.vq * multiValue, 1)}`;
        return '$0';
    };

    const calculateChange = () => {
        let change = 0;
        if (data.length > 1) {
            data.forEach(item => {
                change += getExchange24hPercentageChange(item);
            });
            change /= data.length;
        } else {
            change = getExchange24hPercentageChange(data[0]);
        }
        change = formatPercentage(change, 2, true);
        if (change > 0) {
            return <p className="text-teal flex flex-row items-center w-max"><span className="mr-1"><IconValueIncrease /></span> +{change}%</p>;
        }
        return <p className="text-red flex flex-row items-center w-max"><span className="mr-1"><IconValueDecrease /></span> {change}%</p>;
    };

    const handleSetDefault = (action) => async () => {
        const assetsList = data.map(item => item.b);
        let finalData;
        if (action === 'pin') {
            finalData = {
                id,
                assets: assetsList,
                avatar: itemAvatar,
                isDefault: true,
            };
            await updateCategory(finalData);
        }
        if (action === 'delete') {
            await deleteCategory({ id });
        }
        handleReloadCategoryList();
    };

    const renderMenuAction = () => (
        <Menu
            as="div"
            className="w-8 h-8 relative flex justify-center text-left ml-6 cursor-pointer"
            onClick={handleToggleAction}
        >
            <div className="flex items-center justify-center cursor-pointer">
                <IconDisclosureAction isActive={isComponentVisible} />
            </div>
            <Transition
                show={isComponentVisible}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    static
                    style={{
                        boxShadow: '0px 12px 24px rgba(7, 12, 61, 0.06)',
                    }}
                    className="absolute right-0 w-56 mt-10 origin-top-right bg-white divide-y divide-gray-100 rounded-xl focus:outline-none z-10"
                >
                    <div>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleToggleModal({ type: 'add_assets', itemName, id })}
                                    className={`${active ? 'bg-violet-500 text-white' : 'text-txtPrimary'} group flex rounded-md items-center w-full px-4 py-3 text-sm font-semibold`}
                                >
                                    <i className="mr-2"><IconAddAction /></i> {t('category_disc_table_action_manage_assets')}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                    <div>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleToggleModal({ type: 'edit_category', itemName, itemAvatar, id, assets: data.map(item => item?.b), isDefault })}
                                    className={`${active ? 'bg-violet-500 text-white' : 'text-txtPrimary'} group flex rounded-md items-center w-full px-4 py-3 text-sm font-semibold`}
                                >
                                    <i className="mr-2"><IconEditAction /></i> {t('category_disc_table_action_edit_category')}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                    <div>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSetDefault('pin')}
                                    className={`${active ? 'bg-violet-500 text-white' : 'text-txtPrimary'} group flex rounded-md items-center w-full px-4 py-3 text-sm font-semibold`}
                                >
                                    <i className="mr-2"><IconPinAction /></i> {t('category_disc_table_action_pin_assets')}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                    <div>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSetDefault('delete')}
                                    className={`${active ? 'bg-violet-500 text-white' : 'text-red'} group flex rounded-md items-center w-full px-4 py-3 text-sm font-semibold`}
                                >
                                    <i className="mr-2"><IconDeleteAction /></i> {t('category_disc_table_action_delete_assets')}
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );

    const renderDropdown = () => (
        <div className="mt-4 px-7 pb-2 -mb-5 bg-bgPrimary rounded-xl -mx-10">
            <Transition
                show={dropDownActive}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div static="true">
                    <DataTable
                        data={data}
                        columns={columns}
                        noHeader
                        customStyles={customStyles}
                        overflowY // prevent clipping menu
                        noDataComponent={<TableNoData bgColor="bg-bgPrimary" width="w-full" />}
                        sortIcon={<div className="mx-1"><IconSort /></div>}
                        className="ats-table"
                        style={{
                            padding: 0,
                            margin: 0,
                        }}
                        progressComponent={<TableLoader />}
                    />
                </div>
            </Transition>
        </div>
    );

    return (
        <div
            style={{ boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' }}
            className="px-10 py-5 mt-3 rounded-lg"
        >
            <div className="flex flex-row items-center">
                <div className="flex flex-row items-center flex-1 max-w-xs">
                    {validateItemAvatar(itemAvatar)}
                    <p className="text-black-700 font-semibold mr-2">{validateItemName(itemName)}</p>
                    {validateBadge(badge)}
                </div>
                <div className="flex flex-row items-center flex-1 justify-end xl:mr-40 2xl:mr-80">
                    {
                        data && data.length > 0 ? (
                            <>
                                <div className="flex flex-col items-end text-right">
                                    <p className="text-xs text-txtSecondary">{t('category_disc_volume')}</p>
                                    <p className="text-txtPrimary text-sm font-semibold">{calculateVolume()}</p>
                                </div>
                                <div className="flex flex-col items-end text-right ml-10 lg:ml-32">
                                    <p className="text-xs text-txtSecondary">{t('category_disc_change')}</p>
                                    <p className="text-txtPrimary text-sm font-semibold">{calculateChange()}</p>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleToggleModal({ type: 'add_assets', itemName, id })}
                                className="text-sm text-[#00C8BC] font-bold inline-flex items-center"
                            ><i className="mr-2"><IconAddAction isActive /></i> {t('category_disc_table_action_add_assets')}
                            </button>
                        )
                    }
                </div>
                <div ref={ref} className="flex flex-row items-center ml-10 max-w-xs">
                    {
                        data && data.length > 0 && (
                            <div
                                className="w-8 h-8 flex items-center justify-center ml-6 cursor-pointer"
                                onClick={handleToggleDropdown}
                            >
                                <IconArrowDownSlim isActive={dropDownActive} />
                            </div>
                        )
                    }
                    {actions && renderMenuAction()}
                </div>
            </div>
            {dropDownActive && renderDropdown()}
        </div>
    );
};

export default React.memo(Disclosure);
