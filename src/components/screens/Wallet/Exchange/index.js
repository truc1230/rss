import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
    formatNumber as formatWallet,
    getS3Url,
    getV1Url,
    setTransferModal,
    walletLinkBuilder,
} from 'redux/actions/utils';
import { Check, Eye, EyeOff, Search, X } from 'react-feather';
import { EXCHANGE_ACTION } from 'pages/wallet';
import { getMarketAvailable, initMarketWatchItem, SECRET_STRING } from 'utils';
import { WalletType } from 'redux/actions/const';
import { useDispatch } from 'react-redux';
import { PATHS } from 'constants/paths';
import { Menu, useContextMenu } from 'react-contexify';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import Empty from 'components/common/Empty';
import Skeletor from 'components/common/Skeletor';
import RePagination from 'components/common/ReTable/RePagination';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';

import 'react-contexify/dist/ReactContexify.css';

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    reInitializing: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    currentMarketList: null,
}

const MENU_CONTEXT = 'market-available'

const ExchangeWallet = ({
    allAssets,
    estBtc,
    estUsd,
    usdRate,
    marketWatch,
}) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const tableRef = useRef(null)

    // Use Hooks
    const r = useRouter()
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const [currentTheme] = useDarkMode()
    const dispatch = useDispatch()
    const { show } = useContextMenu({ id: MENU_CONTEXT })

    // Render Handler
    const renderAssetTable = useCallback(() => {
        let tableStatus

        if (!state.tableData || !state.tableData?.length) {
            tableStatus = <Empty />
        }

        const columns = [
            {
                key: 'asset',
                dataIndex: 'asset',
                title: t('common:asset'),
                align: 'left',
                width: 120,
                fixed: width >= 992 ? 'none' : 'left',
            },
            {
                key: 'total',
                dataIndex: 'total',
                title: t('common:total'),
                align: 'right',
                width: 95,
            },
            {
                key: 'available',
                dataIndex: 'available',
                title: t('common:available_balance'),
                align: 'right',
                width: 95,
            },
            {
                key: 'in_order',
                dataIndex: 'in_order',
                title: t('common:in_order'),
                align: 'right',
                width: 95,
            },
            {
                key: 'btc_value',
                dataIndex: 'btc_value',
                title: t('common:btc_value'),
                align: 'right',
                width: 80,
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '',
                align: 'left',
                width: 380,
                fixed: width >= 992 ? 'right' : 'none',
            },
        ]

        return (
            <ReTable
                sort
                defaultSort={{ key: 'btc_value', direction: 'desc' }}
                useRowHover
                data={state.tableData || []}
                columns={columns}
                rowKey={(item) => item?.key}
                loading={!state.tableData?.length}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '1300px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '480px',
                    },
                }}
                paginationProps={{
                    hide: true,
                    current: state.currentPage,
                    pageSize: ASSET_ROW_LIMIT,
                    onChange: (currentPage) => setState({ currentPage }),
                }}
            />
        )
    }, [state.tableData, state.currentPage, width])

    const renderPagination = useCallback(() => {
        return (
            <div className='mt-10 mb-20 flex items-center justify-center'>
                <RePagination
                    total={state.tableData?.length}
                    current={state.currentPage}
                    pageSize={ASSET_ROW_LIMIT}
                    onChange={(currentPage) => setState({ currentPage })}
                    name='market_table___list'
                />
            </div>
        )
    }, [state.tableData, state.currentPage])

    const renderEstWallet = useCallback(() => {
        return (
            <>
                <div className='mt-5 flex items-center'>
                    <div className='rounded-md bg-teal-lightTeal dark:bg-teal-5 min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center'>
                        <img
                            className='-ml-0.5'
                            src={getS3Url('/images/icon/ic_wallet_2.png')}
                            height={width >= 768 ? '25' : '14'}
                            width={width >= 768 ? '25' : '14'}
                            alt=''
                        />
                    </div>
                    <div className='ml-3 md:ml-6 sm:flex items-center'>
                        <div className='font-bold text-[24px] lg:text-[28px] xl:text-[36px] text-dominant flex flex-wrap'>
                            <span className='mr-1.5'>
                                {state.hideAsset
                                    ? SECRET_STRING
                                    : formatWallet(
                                          estBtc?.totalValue,
                                          estBtc?.assetDigit
                                      )}
                            </span>
                            <span>BTC</span>
                        </div>
                        <div className='font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 sm:mt-0 sm:ml-4'>
                            {state.hideAsset
                                ? `(${SECRET_STRING})`
                                : `($ ${formatWallet(
                                      estUsd?.totalValue,
                                      estUsd?.assetDigit
                                  )})`}
                        </div>
                    </div>
                </div>
                <div
                    style={
                        currentTheme === THEME_MODE.LIGHT
                            ? { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }
                            : undefined
                    }
                    className='px-3 py-2 flex items-center rounded-lg dark:bg-darkBlue-4 lg:px-5 lg:py-4 lg:rounded-xl mt-4 max-w-[368px] lg:max-w-max'
                >
                    <div className='font-medium text-xs lg:text-sm pr-3 lg:pr-5 border-r border-divider dark:border-divider-dark'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            {t('common:available_balance')}:{' '}
                        </span>{' '}
                        <span>
                            {state.hideAsset
                                ? `${SECRET_STRING}`
                                : formatWallet(
                                      estBtc?.value,
                                      estBtc?.assetDigit
                                  )}{' '}
                            BTC
                        </span>
                    </div>
                    <div className='font-medium text-xs lg:text-sm pl-3 lg:pl-5'>
                        <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                            {t('common:in_order')}:{' '}
                        </span>{' '}
                        <span>
                            {state.hideAsset
                                ? `${SECRET_STRING}`
                                : formatWallet(
                                      estBtc?.locked,
                                      estBtc?.assetDigit
                                  )}{' '}
                            BTC
                        </span>
                    </div>
                </div>
            </>
        )
    }, [estBtc, estUsd, state.hideAsset, currentTheme])

    const renderMarketListContext = useCallback(() => {
        if (!state.currentMarketList) return null

        const markets = []
        state.currentMarketList.forEach((item, index) => {
            const pair = initMarketWatchItem(item)
            markets.push(
                <div className='px-2'>
                    <Link
                        href={PATHS.EXCHANGE.TRADE.getPair(undefined, {
                            pair: `${pair?.baseAsset}-${pair?.quoteAsset}`,
                        })}
                    >
                        <a
                            className={
                                index % 2 === 0
                                    ? 'block text-center text-sm font-medium py-2.5 border-b border-divider dark:border-divider-dark cursor-pointer hover:text-dominant'
                                    : 'block text-center text-sm font-medium py-2.5 cursor-pointer hover:text-dominant'
                            }
                        >
                            {pair?.baseAsset}/{pair?.quoteAsset}
                        </a>
                    </Link>
                </div>
            )
        })

        return (
            <Menu
                id={MENU_CONTEXT}
                animation={false}
                style={{ boxShadow: 'none' }}
                className='!min-w-[100px] !w-auto !p-0 !rounded-lg !overflow-hidden
                             !drop-shadow-onlyLight dark:!drop-shadow-none !bg-bgContainer dark:!bg-darkBlue-3'
            >
                {markets}
            </Menu>
        )
    }, [state.currentMarketList])

    useEffect(() => {
        if (r?.query?.action) {
            setState({ action: r.query.action })
        } else {
            setState({ action: null })
        }
    }, [r])

    useEffect(() => {
        if (
            state.action &&
            Object.keys(EXCHANGE_ACTION).includes(state.action.toUpperCase())
        ) {
            r.replace(`?action=${state.action}`)
        }
    }, [state.action])

    useEffect(() => {
        if (allAssets && Array.isArray(allAssets) && allAssets?.length) {
            const origin = dataHandler(allAssets, {
                usdRate,
                marketWatch,
                translator: t,
                dispatch,
                setState,
                show,
            })
            let tableData = origin
            if (state.hideSmallAsset) {
                tableData = origin.filter(
                    (item) => item?.sortByValue?.total > 1
                )
            }
            if (state.search) {
                tableData = tableData.filter((item) =>
                    item?.sortByValue?.asset.includes(
                        state.search?.toUpperCase()
                    )
                )
            }
            tableData && setState({ tableData })
        }
    }, [allAssets, usdRate, marketWatch, state.hideSmallAsset, state.search])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: => ', state)
    // }, [state])

    return (
        <>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <div className='t-common whitespace-nowrap'>
                    {t('common:overview')}
                </div>
                <div className='flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto'>
                    <Link
                        href={walletLinkBuilder(
                            WalletType.SPOT,
                            EXCHANGE_ACTION.DEPOSIT
                        )}
                    >
                        <a className='py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer'>
                            {t('common:deposit')}
                        </a>
                    </Link>
                    <div className='w-full h-[8px] sm:hidden' />
                    <Link
                        href={walletLinkBuilder(
                            WalletType.SPOT,
                            EXCHANGE_ACTION.WITHDRAW
                        )}
                    >
                        <a className='py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px]  mr-3.5 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer'>
                            {t('common:withdraw')}
                        </a>
                    </Link>
                    {/*<Link href="/wallet/exchange/transfer?from=exchange" prefetch>*/}
                    <div
                        onClick={() =>
                            dispatch(
                                setTransferModal({
                                    isVisible: true,
                                    fromWallet: WalletType.SPOT,
                                    toWallet: WalletType.FUTURES,
                                })
                            )
                        }
                        className='py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer'
                    >
                        {t('common:transfer')}
                    </div>
                    {/*</Link>*/}
                </div>
            </div>
            <MCard addClass='mt-5 !p-6 xl:!p-10'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                    <div>
                        <div className='flex items-center font-medium text-sm'>
                            <div className='mr-2'>
                                {t('wallet:est_balance')}
                            </div>
                            <div
                                className='flex items-center text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:opacity-80 select-none'
                                onClick={() =>
                                    setState({ hideAsset: !state.hideAsset })
                                }
                            >
                                {state.hideAsset ? (
                                    <EyeOff size={16} className='mr-[4px]' />
                                ) : (
                                    <Eye size={16} className='mr-[4px]' />
                                )}{' '}
                                {t('wallet:hide_asset')}
                            </div>
                        </div>
                        {renderEstWallet()}
                    </div>
                    <div className='hidden md:block'>
                        <img
                            src={getS3Url(
                                '/images/screen/wallet/wallet_overview_grp.png'
                            )}
                            width='140'
                            height='140'
                            alt=''
                        />
                    </div>
                </div>
            </MCard>

            <div className='mt-16 lg:flex lg:items-center lg:justify-between'>
                <div className='t-common'>Exchange</div>
                <div className='mt-2 lg:flex'>
                    <div className='flex items-center justify-between lg:mr-5'>
                        <div
                            className='flex items-center select-none cursor-pointer lg:mr-5'
                            onClick={() =>
                                setState({
                                    hideSmallAsset: !state.hideSmallAsset,
                                })
                            }
                        >
                            <span
                                className={
                                    state.hideSmallAsset
                                        ? 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-dominant bg-dominant'
                                        : 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-gray-3 dark:border-darkBlue-4'
                                }
                            >
                                {state.hideSmallAsset ? (
                                    <Check size={10} color='#FFFFFF' />
                                ) : null}
                            </span>
                            <span className='ml-3 text-xs'>
                                {t('wallet:hide_small_balance')}
                            </span>
                        </div>
                        {/*<div className="flex items-center rounded-[4px] lg:px-4 py-3 lg:bg-teal-lightTeal lg:dark:bg-teal-opacity select-none cursor-pointer hover:opacity-80">*/}
                        {/*    <img src={getS3Url('/images/logo/nami_maldives.png')} alt="" width="16" height="16"/>*/}
                        {/*    <a href="/" className="text-xs ml-3 text-dominant cursor-pointer">*/}
                        {/*        {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                    <div className='py-2 px-3 mt-4 lg:mt-0 lg:py-3 lg:px-5 flex items-center rounded-md bg-gray-5 dark:bg-darkBlue-4'>
                        <Search
                            size={width >= 768 ? 20 : 16}
                            className='text-txtSecondary dark:text-txtSecondary-dark'
                        />
                        <input
                            className='text-sm w-full px-2.5'
                            value={state.search}
                            onChange={(e) =>
                                setState({ search: e?.target?.value })
                            }
                            onFocus={() => setState({ currentPage: 1 })}
                            placeholder={t('common:search')}
                        />
                        {state.search && (
                            <X
                                size={width >= 768 ? 20 : 16}
                                className='cursor-pointer'
                                onClick={() => setState({ search: '' })}
                            />
                        )}
                    </div>
                </div>
            </div>

            <MCard
                getRef={(ref) => (tableRef.current = ref)}
                style={
                    currentTheme === THEME_MODE.LIGHT
                        ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' }
                        : {}
                }
                addClass='relative mt-5 pt-0 pb-0 px-0 overflow-hidden'
            >
                {renderAssetTable()}
            </MCard>

            {renderPagination()}

            {renderMarketListContext()}
        </>
    )
}

const ASSET_ROW_LIMIT = 10

const dataHandler = (data, utils) => {
    if (!data || !data?.length) {
        const skeleton = []
        for (let i = 0; i < ASSET_ROW_LIMIT; ++i) {
            skeleton.push({
                ...ROW_LOADING_SKELETON,
                key: `asset_loading__skeleton_${i}`,
            })
        }
        return skeleton
    }

    const result = []

    data.forEach((item) => {
        let lockedValue = formatWallet(
            item?.wallet?.locked_value,
            item?.assetDigit
        )
        if (lockedValue === 'NaN') {
            lockedValue = '0.0000'
        }

        const marketAvailable = getMarketAvailable(
            item?.assetCode,
            utils?.marketWatch
        )

        const assetUsdRate = utils?.usdRate?.[item?.id] || 0
        const btcUsdRate = utils?.usdRate?.['9'] || 0

        const totalUsd = item?.wallet?.value * assetUsdRate
        const totalBtc = totalUsd / btcUsdRate

        result.push({
            key: `exchange_asset___${item?.assetCode}`,
            asset: (
                <div className='flex items-center'>
                    <AssetLogo assetCode={item?.assetCode} size={32} />
                    <div className='ml-2 text-sm'>
                        <div>{item?.assetCode}</div>
                        <div className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            {item?.assetFullName ||
                                item?.assetName ||
                                item?.assetCode}
                        </div>
                    </div>
                </div>
            ),
            total: (
                <span className='text-sm whitespace-nowrap'>
                    {item?.wallet?.value
                        ? formatWallet(
                              item?.wallet?.value,
                              item?.assetCode === 'USDT' ? 2 : item?.assetDigit
                          )
                        : '0.0000'}
                </span>
            ),
            available: (
                <span className='text-sm whitespace-nowrap'>
                    {item?.wallet?.value - item?.wallet?.locked_value
                        ? formatWallet(
                              item?.wallet?.value - item?.wallet?.locked_value,
                              item?.assetCode === 'USDT' ? 2 : item?.assetDigit
                          )
                        : '0.0000'}
                </span>
            ),
            in_order: (
                <span className='text-sm whitespace-nowrap'>
                    {item?.wallet?.locked_value ? (
                        <Link href={PATHS.EXCHANGE.TRADE.DEFAULT}>
                            <a className='hover:text-dominant hover:!underline'>
                                {lockedValue}
                            </a>
                        </Link>
                    ) : (
                        '0.0000'
                    )}
                </span>
            ),
            btc_value: (
                <div className='text-sm'>
                    {assetUsdRate ? (
                        <>
                            <div className='whitespace-nowrap'>
                                {totalBtc
                                    ? formatWallet(totalBtc, item?.assetDigit)
                                    : '0.0000'}
                            </div>
                            <div className='text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap'>
                                (
                                {totalUsd > 0
                                    ? ' ≈ $' + formatWallet(totalUsd, 2)
                                    : '$0.0000'}
                                )
                            </div>
                        </>
                    ) : (
                        '--'
                    )}
                </div>
            ),
            operation: renderOperationLink(item?.assetName, {
                ...utils,
                marketAvailable,
            }),
            [RETABLE_SORTBY]: {
                asset: item?.assetName,
                total: +item?.wallet?.value,
                available: +item?.wallet?.value - +item?.wallet?.locked_value,
                in_order: item?.wallet?.locked_value,
                btc_value: +totalUsd,
            },
        })
    })

    return result
}

const renderOperationLink = (assetName, utils) => {
    const markets = utils?.marketAvailable
    const noMarket = !markets?.length

    let tradeButton = null
    if (Array.isArray(markets) && markets?.length) {
        if (markets?.length === 1) {
            const pair = initMarketWatchItem(markets?.[0])
            // console.log('namidev-DEBUG: => ', pair)
            tradeButton = (
                <Link
                    href={PATHS.EXCHANGE?.TRADE?.getPair(undefined, {
                        pair: `${assetName}-${pair?.quoteAsset}`,
                    })}
                    prefetch={false}
                >
                    <a
                        className='relative select-none py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center
                                text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                    >
                        {utils?.translator('common:trade')}
                    </a>
                </Link>
            )
        } else {
            tradeButton = (
                <div
                    className='relative select-none py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center
                                text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                    onClick={(e) => {
                        utils?.setState({
                            currentMarketList: utils?.marketAvailable,
                        })
                        setTimeout(() => utils?.show(e), 200)
                    }}
                >
                    {utils?.translator('common:trade')}
                </div>
            )
        }
    }

    return (
        <div className='relative flex pl-12'>
            <a
                className='py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                href={PATHS.EXCHANGE?.SWAP?.getSwapPair({
                    fromAsset: 'USDT',
                    toAsset: assetName,
                })}
            >
                {/*`/wallet/exchange/deposit?type=crypto&asset=${assetName}`*/}
                {utils?.translator('common:buy')}
            </a>
            {!noMarket && tradeButton}
            <a
                className='py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                href={walletLinkBuilder(
                    WalletType.SPOT,
                    EXCHANGE_ACTION.DEPOSIT,
                    { type: 'crypto', asset: assetName }
                )}
            >
                {utils?.translator('common:deposit')}
            </a>
            <a
                className='py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                href={walletLinkBuilder(
                    WalletType.SPOT,
                    EXCHANGE_ACTION.WITHDRAW,
                    { type: 'crypto', asset: assetName }
                )}
            >
                {utils?.translator('common:withdraw')}
            </a>
            {ALLOWED_FUTURES_TRANSFER.includes(assetName) && (
                <div
                    className='py-1.5 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white'
                    onClick={() =>
                        utils?.dispatch(
                            setTransferModal({
                                isVisible: true,
                                fromWallet: WalletType.SPOT,
                                toWallet: WalletType.FUTURES,
                                asset: assetName,
                            })
                        )
                    }
                >
                    {utils?.translator('common:transfer')}
                </div>
            )}
        </div>
    )
}

const ALLOWED_FUTURES_TRANSFER = ['VNDC', 'USDT', 'NAMI', 'NAC']

const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65} />,
    total: <Skeletor width={65} />,
    available: <Skeletor width={65} />,
    in_order: <Skeletor width={65} />,
    operation: <Skeletor width={125} />,
}

export default ExchangeWallet
