import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_GET_FUTURE_FEE_CONFIGS, API_GET_VIP, API_SET_ASSET_AS_FEE } from 'redux/actions/apis';
import { BREAK_POINTS, FEE_STRUCTURES, FEE_TABLE, ROOT_TOKEN } from 'constants/constants';
import { ApiStatus, TRADING_MODE } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { TrendingUp } from 'react-feather';
import { orderBy } from 'lodash';
import { PATHS } from 'constants/paths';

import Axios from 'axios';
import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import useWindowSize from 'hooks/useWindowSize';
import MCard from 'components/common/MCard';
import Link from 'next/link';
import Switcher from 'components/common/Switcher';
import TabItem, { TabItemComponent } from 'components/common/TabItem';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import Skeletor from 'components/common/Skeletor';
import SvgCrown from 'components/svg/SvgCrown';
import Empty from 'components/common/Empty';
import useHideScrollbar from 'hooks/useHideScrollbar';

const INITIAL_STATE = {
    tabIndex: 0,
    loading: false,
    vipLevel: null,
    futuresFeeConfig: null,
    loadingFuturesFeeConfigs: false,
    currentFuturesFeePage: 1,
    loadingVipLevel: false,
    assetFee: null,
    promoteFee: null,
    loadingAssetFee: false,

    // ...
}

const TradingFee = () => {
    // Init state
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Rdx
    const namiWallets = useSelector(state => state.wallet?.SPOT)?.['1']
    const allAssetConfigs = useSelector(state => state.utils?.assetConfig) || null

    const assetConfig = useMemo(() => {
        return allAssetConfigs?.find(item => item?.id === 1)
    }, [allAssetConfigs])

    // Use hooks
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()
    const handleHideScrollBar = () => {
        const malLayout = document.querySelector('.mal-layouts');
        if (window.innerWidth < 650) {
            document.body.classList.add('overflow-hidden');
            malLayout.classList.add('!h-screen');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
            malLayout.classList.remove('!h-screen');
        };
    };
    useEffect(handleHideScrollBar, []);
    // Helper
    const getFuturesFeeConfigs = async () => {
        !state.futuresFeeConfig && setState({ loadingFuturesFeeConfigs: true })
        try {
            const { data } = await Axios.get(API_GET_FUTURE_FEE_CONFIGS)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ futuresFeeConfig: data.data })
            }
        } catch (e) {
            console.log(`Can't get futures fee config `, e)
        } finally {
            setState({ loadingFuturesFeeConfigs: false })
        }
    }

    const getVip = async () => {
        setState({ loadingVipLevel: true })
        try {
            const { data } = await Axios.get(API_GET_VIP)
            if (data?.status === 'ok' && data?.data) {
                setState({ vipLevel: data?.data?.level })
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`)
        } finally {
            setState({ loadingVipLevel: false })
        }
    }

    const onUseAssetAsFee = async (action = 'get', currency = undefined, assetCode = 'NAMI') => {
        const throttle = 800
        setState({ loadingAssetFee: true })

        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_SET_ASSET_AS_FEE)
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => {
                        setState({ assetFee: data.data, promoteFee: { exchange: data?.data?.promoteSpot, futures: data?.data?.promoteFutures } })
                    }, throttle)
                }
            }
            if (action === 'set' && currency !== undefined) {
                const { data } = await Axios.post(API_SET_ASSET_AS_FEE, { currency })
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => setState({ assetFee: data.data }), throttle)
                }
            }
        } catch (e) {
            console.log(`Can't ${action} ${assetCode} as asset fee `, e)
        } finally {
            setTimeout(() => setState({ loadingAssetFee: false }), throttle)
        }
    }

    // Render Handler
    const renderNamiAvailable = useCallback(() => {
        if (!namiWallets) return <span className="ml-1.5"><Skeletor width={105} /></span>

        const available = namiWallets?.value - namiWallets?.locked_value
        return (
            <span className="font-medium whitespace-nowrap ml-1.5">
                {available ? formatNumber(available, assetConfig?.assetDigit) : '0.0000'} NAMI
            </span>
        )
    }, [namiWallets, assetConfig])

    const renderUseAssetAsFeeBtn = useCallback(() => {
        const nextAssetFee = state.assetFee?.feeCurrency === 1 ? 0 : 1

        return <Switcher active={!!state.assetFee?.feeCurrency}
            loading={state.loadingAssetFee}
            wrapperClass="mt-1"
            onChange={() => !state.loadingAssetFee && onUseAssetAsFee('set', nextAssetFee)}

        />
    }, [state.assetFee, state.loadingAssetFee])

    const renderFeeTab = useCallback(() => {
        return TRADING_FEE_TAB.map(tab => <TabItem key={`trading_fee_Tab__${tab.dataIndex}`}
            title={tab.localized ? t(tab.localized, { action: 'Exchange' }) : tab.title}
            active={tab.index === state.tabIndex}
            onClick={() => setState({ tabIndex: tab.index })}
            component={TabItemComponent.Div} />)
    }, [state.tabIndex, TRADING_FEE_TAB])

    const renderFuturesTableFee = useCallback(() => {
        let tableStatus

        const columns = [
            { key: 'symbol', dataIndex: 'symbol', title: t('common:pair'), width: 80, fixed: 'left', align: 'left' },
            { key: 'max_leverage', dataIndex: 'max_leverage', title: t('common:max_leverage'), width: 100, align: 'left' },
            {
                key: 'fee', dataIndex: 'fee',
                title: <span> {t('common:fee')}
                    <span className='ml-1'>
                        ({t('common:open')}/{t('common:close')})
                    </span>
                </span>,
                width: 100, align: 'left'
            },
            {
                key: 'fee_promote', dataIndex: 'fee_promote',
                title: <span> {t('common:fee')} NAMI
                    <span className='ml-1'>
                        ({t('common:open')}/{t('common:close')})
                    </span>
                </span>,
                width: 100, align: 'left'
            },
        ]

        const dataFilter = state.futuresFeeConfig?.filter(e => {
            const quote = e?.name.substring(e?.name?.length - 4, e?.name.length)
            if (state.tabIndex === 1) {
                return quote === 'USDT'
            } else {
                return quote === 'VNDC'
            }
        })

        // console.log('namidev-DEBUG: FILTERED => ', dataFilter)

        const data = dataHandler({
            tabIndex: state.tabIndex,
            data: orderBy(dataFilter || state.futuresFeeConfig, ['name'], ['asc']),
            loading: state.loadingFuturesFeeConfigs
        })

        if (!data?.length) {
            tableStatus = <Empty />
        }

        return (
            <ReTable
                // sort
                // defaultSort={{ key: 'symbol', direction: 'asc' }}
                useRowHover
                data={data}
                columns={columns}
                rowKey={item => item?.key}
                tableStatus={tableStatus}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '992px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= 992,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
                paginationProps={{
                    current: state.currentFuturesFeePage,
                    pageSize: 10,
                    onChange: (currentFuturesFeePage) => setState({ currentFuturesFeePage })
                }}
            />
        )

    }, [
        state.tabIndex,
        state.loadingFuturesFeeConfigs,
        state.currentFuturesFeePage,
        width
    ])

    const renderExchangeTableFee = useCallback(() => {
        const columns = [
            { key: 'level', dataIndex: 'level', title: t('common:fee_level'), width: 60, fixed: 'left', align: 'left' },
            // { key: 'vol_30d', dataIndex: 'vol_30d', title: t('common:vol_trade_in', { duration: '30d' }), width: 100, align: 'left' },
            // { key: 'andor', dataIndex: 'andor', title: t('fee-structure:andor'), width: 100, align: 'left' },
            { key: 'nami_holding', dataIndex: 'nami_holding', title: 'NAMI', width: 100, align: 'left' },
            { key: 'maker_taker', dataIndex: 'maker_taker', title: 'Maker / Taker', width: 100, align: 'left' },
            {
                key: 'maker_taker_deducted', dataIndex: 'maker_taker_deducted',
                title: <span>
                    Maker / Taker
                    <span className="text-dominant ml-3">{t('fee-structure:use_asset_deduction', { value: '25%', asset: 'NAMI' })}</span>
                </span>,
                width: 100, align: 'left'
            },
        ]
        const data = dataHandler({ tabIndex: state.tabIndex, data: FEE_TABLE, loading: false, utils: { currentLevel: state.vipLevel || 0 } })

        return (
            <ReTable
                // useRowHover
                data={data}
                columns={columns}
                rowKey={item => item?.key}
                scroll={{ x: true }}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '768px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < BREAK_POINTS.lg,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
            />
        )
    }, [state.tabIndex, state.vipLevel, width])

    const renderExchangeDeduction = useCallback(() => {
        if (!state.assetFee && state.loadingAssetFee) {
            return <><Skeletor width={150} height={16} /></>
        }

        const promote = state.promoteFee?.exchange

        if (typeof promote !== 'number') {
            return null
        }

        return (
            <div className="flex flex-wrap items-center">
                {language === LANGUAGE_TAG.VI ?
                    <>
                        Dùng <span className="text-dominant mx-1">NAMI</span> để được giảm phí <span className="whitespace-nowrap ml-1">(chiết khấu {promote * 100}%)</span>
                    </>
                    : <>
                        Using <span className="text-dominant mx-1">NAMI</span> deduction <span className="whitespace-nowrap ml-1">({promote * 100}% discount)</span>
                    </>}
            </div>
        )
    }, [state.promoteFee?.exchange, state.loadingAssetFee, state.assetFee, language])

    const renderFuturesDeduction = useCallback(() => {
        if (!state.assetFee && state.loadingAssetFee) {
            return <><Skeletor width={150} height={16} /></>
        }

        const promote = state.promoteFee?.futures

        if (typeof promote !== 'number') {
            return null
        }

        return (
            <div className="flex flex-wrap items-center">
                {language === LANGUAGE_TAG.VI ?
                    <>
                        Dùng <span className="text-dominant mx-1">NAMI</span> để được giảm phí <span className="whitespace-nowrap ml-1">(chiết khấu {promote * 100}%)</span>
                    </>
                    : <>
                        Using <span className="text-dominant mx-1">NAMI</span> deduction <span className="whitespace-nowrap ml-1">({promote * 100}% discount)</span>
                    </>}
            </div>
        )
    }, [state.promoteFee?.futures, state.loadingAssetFee, state.assetFee, language])

    const renderUsedNamiMsg = useCallback(() => {
        if (state.assetFee?.feeCurrency !== 1) return null
        return <div className="mt-3 text-dominant text-sm text-xs md:text-sm">* {t('fee-structure:used_fee_deduction', { token: `${ROOT_TOKEN} tokens` })}</div>
    }, [state.assetFee?.feeCurrency])

    const renderUserFeeConfig = useCallback((maker, taker) => {
        return state.assetFee?.feeCurrency === 1 ?
            (<>
                <span className="text-txtPrimary dark:text-txtPrimary-dark">{maker}%</span>
                <span className="ml-1">{taker}%</span>
            </>)
            :
            (<>
                <span>{maker}%</span>
                <span className="ml-1 text-txtPrimary dark:text-txtPrimary-dark">{taker}%</span>
            </>)
    },[state.assetFee?.feeCurrency])

    useEffect(() => {
        getVip()
        onUseAssetAsFee('get')
    }, [])

    useEffect(() => {
        state.tabIndex !== 0 && getFuturesFeeConfigs()
    }, [state.tabIndex])

    // useEffect(() => console.log('namidev-DEBUG: FEE STATE ', state), [state])

    return (
        <>
            <div className="flex flex-wrap items-center justify-between">
                <div className="t-common">
                    {t('fee-structure:your_fee_level')} <span className="text-dominant">VIP {state.vipLevel || 0}</span>
                </div>
                {width <= 475 && <div className="w-full" />}
                <Link href={language === LANGUAGE_TAG.VI ? PATHS.REFERENCE.HOW_TO_UPGRADE_VIP : PATHS.REFERENCE.HOW_TO_UPGRADE_VIP_EN}>
                    <a className="mt-3 flex items-center text-dominant text-sm hover:!underline" target="_blank"
                        style={width > 475 ? { marginTop: '0' } : undefined}>
                        <TrendingUp size={16} className="mr-2.5" /> {t('fee-structure:upgrade_level_suggest')}
                    </a>
                </Link>
            </div>

            <MCard addClass="relative mt-5 px-4 py-6 lg:px-7 px-4 py-6 lg:py-8 text-sm">
                <div className="relative z-10 w-full flex flex-wrap">
                    <div className="w-full sm:w-1/2"
                        style={width >= BREAK_POINTS.xl ? {
                            width: `calc((100% - ${GRAPHICS_WIDTH}) / 3)`
                        } : undefined}
                    >
                        <div className="font-medium mb-5">
                            <div>{t('fee-structure:exchange_trading_fee')}</div>
                        </div>

                        <div className="flex mb-4">
                            {renderUseAssetAsFeeBtn()}
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                {renderExchangeDeduction()}
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    {state.vipLevel ? 
                                    renderUserFeeConfig(FEE_TABLE[state.vipLevel].maker_taker_deducted.split(" ")[0].replace("%", ""), FEE_TABLE[state.vipLevel].maker_taker.split(" ")[0].replace("%", "")) : 
                                    renderUserFeeConfig(FEE_TABLE[0].maker_taker_deducted.split(" ")[0].replace("%", ""), FEE_TABLE[0].maker_taker.split(" ")[0].replace("%", ""))}
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    {state.vipLevel ? 
                                    renderUserFeeConfig(FEE_TABLE[state.vipLevel].maker_taker_deducted.split(" ")[2].replace("%", ""), FEE_TABLE[state.vipLevel].maker_taker.split(" ")[2].replace("%", "")) :
                                    renderUserFeeConfig(FEE_TABLE[0].maker_taker_deducted.split(" ")[2].replace("%", ""), FEE_TABLE[0].maker_taker.split(" ")[2].replace("%", ""))}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 font-medium flex flex-wrap items-center">
                            <span className="flex items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap">{t('common:available_balance')}: </span>
                                {renderNamiAvailable()}
                            </span>
                            {width < BREAK_POINTS.md && <div className="w-full" />}
                            {namiWallets && <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({ fromAsset: 'VNDC', toAsset: 'NAMI' })}>
                                <a className={'mt-3 text-dominant whitespace-nowrap hover:!underline ' + (width >= BREAK_POINTS.md ? 'ml-5 mt-0' : '')}>{t('common:buy')} NAMI</a>
                            </Link>}
                        </div>
                    </div>

                    <div className="w-full mt-8 sm:mt-0 sm:w-1/2 xl:pl-6"
                        style={width >= BREAK_POINTS.xl ? {
                            width: `calc((100% - ${GRAPHICS_WIDTH}) / 3)`
                        } : undefined}
                    >
                        <div className="font-medium mb-5">
                            <div>{language === LANGUAGE_TAG.VI && 'Phí '}USDT Futures</div>
                        </div>

                        <div className="flex mb-4">
                            {renderUseAssetAsFeeBtn()}
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                {renderFuturesDeduction()}
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    {renderUserFeeConfig(FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[0], FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.MAKER[1])}
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    {renderUserFeeConfig(FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[0], FEE_STRUCTURES.FUTURES.USDT.MAKER_TAKER.TAKER[1])}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8 sm:w-1/2 xl:mt-0 xl:pl-6"
                        style={width >= BREAK_POINTS.xl ? {
                            width: `calc((100% - ${GRAPHICS_WIDTH}) / 3)`
                        } : undefined}
                    >
                        <div className="font-medium mb-5">
                            <div>{language === LANGUAGE_TAG.VI && 'Phí '}VNDC Futures</div>
                        </div>

                        <div className="flex mb-4">
                            {renderUseAssetAsFeeBtn()}
                            <span className="ml-3 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                                {renderFuturesDeduction()}
                            </span>
                        </div>

                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Maker</span>
                                <span>
                                    {renderUserFeeConfig(FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[0], FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.MAKER[1])}
                                </span>
                            </div>
                        </div>
                        <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark mb-2">
                            <div className="flex justify-between sm:block">
                                <span className="inline-block min-w-[35px] mr-9">Taker</span>
                                <span>
                                    {renderUserFeeConfig(FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[0], FEE_STRUCTURES.FUTURES.VNDC.MAKER_TAKER.TAKER[1])}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center justify-center w-full mt-8 sm:mt-0 sm:w-1/2"
                        style={width >= BREAK_POINTS.xl ? {
                            width: '200px'
                        } : undefined}
                    >
                        <img className="-mt-4 max-w-[200px] h-auto"
                            src={getS3Url('/images/screen/fee-structure/pyramid.png')}
                            alt="FEE STRUCTURE" />
                    </div>
                </div>
                {renderUsedNamiMsg()}
            </MCard>

            <div className="t-common mt-10 mb-5">
                {t('fee-structure:fee_rate')}
            </div>

            <div className="flex items-center">
                {renderFeeTab()}
            </div>
            <MCard addClass="!py-0 px-0 overflow-hidden">
                {state.tabIndex === 0 && renderExchangeTableFee()}
                {state.tabIndex !== 0 && renderFuturesTableFee()}
            </MCard>

            <div className="mt-6 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                {t('fee-structure:maker_taker_description')}<span className="ml-2">{t('fee-structure:maker_taker_description_2')}</span>
                <Link href={PATHS.REFERENCE.MAKER_TAKER}>
                    <a className="ml-3 text-dominant hover:!underline" target="_blank">{t('common:read_more')}</a>
                </Link>
            </div>

            <div className="mt-3 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                {t('fee-structure:referral_description_value', { value: '20%' })}
                <Link href={PATHS.ACCOUNT.REFERRAL}>
                    <a className="ml-3 text-dominant hover:!underline">{t('common:read_more')}</a>
                </Link>
            </div>
            <div className="mt-3 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                {t('fee-structure:swap_fee_description')}
            </div>
        </>
    )
}


const TRADING_FEE_TAB = [
    { index: 0, dataIndex: 'exchange', title: 'Exchange', localized: 'navbar:submenu.spot' },
    { index: 1, dataIndex: 'usdt_futures', title: 'USDT Futures' },
    { index: 2, dataIndex: 'vndc_futures', title: 'VNDC Futures' },
]

const dataHandler = (props) => {
    const { tabIndex, data, loading, utils } = props

    const result = []
    const skeleton = []
    let rowLoading

    if (tabIndex === 0) {
        rowLoading = TRADING_FEE_ROW_LOADING
    } else {
        rowLoading = FUTURES_FEE_ROW_LOADING
    }

    if (loading) {
        for (let i = 0; i < 10; ++i) {
            skeleton.push({ ...rowLoading, key: `row_skeleton_${i}` })
        }
        return skeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    switch (tabIndex) {
        case 0:
            data.forEach(d => {
                result.push({
                    key: `trading_fee__item__${d.level}`,
                    level: <span className="text-sm inline-flex items-center">
                        VIP {d.level} {utils?.currentLevel === d.level && <SvgCrown className="ml-2" size={16} />}
                    </span>,
                    // vol_30d: <span className="text-sm">{d.vol_30d}</span>,
                    // andor: <span className="text-sm">{d.andor}</span>,
                    nami_holding: <span className="text-sm">≥ {formatNumber(d.nami_holding, 0)}</span>,
                    maker_taker: <span className="text-sm">{d.maker_taker}</span>,
                    maker_taker_deducted: <span className="text-sm">{d.maker_taker_deducted}</span>,
                })
            })
            break
        case 1:
        case 2:
            data.forEach(d => {
                result.push({
                    key: `futures_fee__item__${d?.name}`,
                    symbol: <span className="text-sm">
                        <Link href={PATHS.FUTURES.TRADE.getPair(TRADING_MODE.FUTURES, { pair: d?.name })}>
                            <a className="text-dominant hover:!underline">{d?.name}</a>
                        </Link>
                    </span>,
                    max_leverage: <span className="text-sm">x{d?.max_leverage}</span>,
                    fee: <span className="text-sm">{d?.place_order_fee * 100}% / {d?.close_order_fee * 100}%</span>,
                    fee_promote: <span className="text-sm">{d?.place_order_fee_promote * 100}% / {d?.close_order_fee_promote * 100}%</span>,
                    [RETABLE_SORTBY]: {
                        symbol: d?.name,
                        max_leverage: d?.max_leverage,
                        fee: d?.place_order_fee,
                        fee_promote: d?.place_order_fee_promote
                    }
                })
            })
            break
        default:
    }

    return result
}

const FUTURES_FEE_ROW_LOADING = {
    symbol: <Skeletor width={65} />,
    max_leverage: <Skeletor width={65} />,
    fee: <Skeletor width={65} />,
    fee_promote: <Skeletor width={65} />
}

const TRADING_FEE_ROW_LOADING = {
    level: <Skeletor width={65} />,
    vol_30d: <Skeletor width={65} />,
    andor: <Skeletor width={65} />,
    nami_holding: <Skeletor width={65} />,
    maker_taker: <Skeletor width={65} />,
    maker_taker_deducted: <Skeletor width={65} />,
}

const GRAPHICS_WIDTH = '200px'

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure'])
    }
})

export default withTabLayout({ routes: TAB_ROUTES.FEE_STRUCTURE })(TradingFee)
