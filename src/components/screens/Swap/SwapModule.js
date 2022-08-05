import showNotification from 'utils/notificationService';
import SwapReverse from 'src/components/svg/SwapReverse';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import NumberFormat from 'react-number-format';
import AssetLogo from 'src/components/wallet/AssetLogo';
import fetchAPI from 'utils/fetch-api';
import SvgIcon from 'src/components/svg';
import colors from 'styles/colors';
import Link from 'next/link';
import * as Error from '../../../redux/actions/apiError';
import Skeletor from 'src/components/common/Skeletor';
import useOutsideClick from 'hooks/useOutsideClick';
import Modal from 'src/components/common/ReModal';

import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';
import { Trans, useTranslation } from 'next-i18next';
import { find, orderBy, uniqBy } from 'lodash';
import {
    formatPrice,
    formatSwapRate,
    formatWallet,
    getDecimalScale,
    getLoginUrl,
    getV1Url,
    safeToFixed
} from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { RefreshCw, Search, X, XCircle } from 'react-feather';
import { ApiStatus } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PATHS } from 'constants/paths';
import { roundToDown } from 'round-to';
import Button from 'components/common/Button';

const FEE_RATE = 0 / 100
const DEBOUNCE_TIMEOUT = 500

const DEFAULT_PAIR = {
    fromAsset: 'USDT',
    toAsset: 'BTC'
}
const REJECT_PREORDER = [
    'BROKER_ERROR',
    'PRICE_CHANGED',
    'INVALID_SWAP_REQUEST_ID',
    'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET',
]

const fromAssetRef = createRef()
const toAssetRef = createRef()

const SwapModule = ({ width, pair }) => {
    // Init State
    const [state, set] = useState({
        init: false,
        loading: false,
        swapConfigs: null,
        estRate: null,
        loadingEstRate: false,
        shouldRefreshRate: false,
        preOrder: null,
        loadingPreOrder: false,
        processingOrder: false,
        invoiceId: null,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        fromAssetList: null,
        toAsset: DEFAULT_PAIR.toAsset,
        toAmount: null,
        toAssetList: null,
        fromErrors: {},
        focus: 'from',
        search: '',
        inputHighlighted: null,
        changeEstRatePosition: false,
        openAssetList: {},
        openModal: false,
        //... Add new state here
    })
    const [swapTimer, setSwapTimer] = useState(null)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Get state from Rdx
    const wallets = useSelector(state => state.wallet.SPOT)
    const auth = useSelector(state => state.auth?.user)

    const [loginUrl, setLoginUrl] = useState('')
    // Refs
    const fromAssetListRef = useRef()
    const toAssetListRef = useRef()
    const fromAssetBtnRef = useRef()
    const toAssetBtnRef = useRef()
    // const cancelBtnRef = useRef()

    // Memmoized Variable
    // CURRENT SWAP PAIRS CONFIG
    const config = useMemo(() => {
        return find(state.swapConfigs, sw => sw?.fromAsset === state.fromAsset && sw?.toAsset === state.toAsset) || {}
    }, [state.swapConfigs, state.fromAsset, state.toAsset])

    // AVAILABEL ASSET
    const availabelAsset = useMemo(() => {
        if (!config || !wallets) return { fromAsset: 0, toAsset: 0 }
        return {
            fromAsset: wallets?.[config?.fromAssetId]?.value - wallets?.[config?.fromAssetId]?.locked_value,
            toAsset: wallets?.[config?.toAssetId]?.value - wallets?.[config?.toAssetId]?.locked_value
        }
    }, [config, wallets])

    // Use Hooks
    const { t, i18n: { language } } = useTranslation(['navbar', 'common', 'error', 'convert'])
    const [currentTheme, ] = useDarkMode()

    useOutsideClick(fromAssetListRef, () => state.openAssetList?.from && setState({ openAssetList: { from: false } }))
    useOutsideClick(toAssetListRef, () => state.openAssetList?.to && setState({ openAssetList: { to: false } }))

    // Helper
    const fetchEstimateRate = async (requestQty, requestAsset, updateQty = true) => {
        if (!(requestQty && requestAsset)) return
        setState({ loadingEstRate: true, estRate: null })

        const result = await fetchAPI({
            url: '/api/v3/swap/estimate_price',
            options: {
                method: 'GET',
            },
            params: {
                fromAsset: state.fromAsset,
                toAsset: state.toAsset,
                requestQty: +requestQty,
                requestAsset,
            },
        })

        const { status, data } = result
        data && setState({ estRate: data })
        if (status === ApiStatus.SUCCESS && updateQty) {
            if (requestAsset === state.fromAsset) {
                setState({ toAmount: +roundToDown(requestQty * data?.price, 10) })
            }
            if (requestAsset === state.toAsset) {
                setState({ fromAmount: requestQty / data?.price })
            }
        } else {
            switch (status) {
                case 'SWAP_CANNOT_ESTIMATE_PRICE':
                    setState({ fromErrors: { not_found: t('convert:est_rate_not_found') } })
                    break
                default:
            }
        }

        setState({ loadingEstRate: false, shouldRefreshRate: false })
    }

    const fetchPreSwapOrder = async (fromAsset, toAsset, fromQty) => {
        setState({ loadingEstRate: true, loadingPreOrder: true, preOrder: null })

            const { status, data, code } = await fetchAPI({
                url: '/api/v3/swap/pre_order',
                options: {
                    method: 'POST',
                },
                params: {
                    fromAsset,
                    toAsset,
                    fromQty,
                },
            })

            if (status === ApiStatus.SUCCESS && data) {
                setState({ preOrder: data, shouldRefreshRate: false })
                setSwapTimer(data?.swapTimeout)
                setTimeout(() => setState({ openModal: true }), 200)
            } else {
                const e = find(Error, { code })
                const msg = e ? t(`error:${e?.message}`) : t('error:COMMON_ERROR')
                showNotification({
                    message: `(${code}) ${msg}`,
                    title: t('common:failure'),
                    type: 'failure'
                })
            }

            setState({ loadingEstRate: false, loadingPreOrder: false })
    }

    const onConfirmOrder = async (preOrderId) => {
        setState({ processingOrder: true })
        const result = await fetchAPI({
            url: '/api/v3/swap/confirm_order',
            options: {
                method: 'POST',
            },
            params: { preOrderId },
        })
        setState({ processingOrder: false })

        if (result?.status === ApiStatus.SUCCESS && result?.data) {
            const { displayingId, fromAsset, toAsset, fromQty, toQty, displayingPrice } = result?.data
            let msg = t('convert:swap_success', { fromQty, fromAsset, toQty, toAsset, displayingPrice })

            setState({ openModal: false, preOrder: null, invoiceId: displayingId })
            showNotification({ message: msg, title: t('common:success'), type: 'success' }, 3200)
        } else {
            const error = find(Error, { code: result?.code })
            if (REJECT_PREORDER.includes(error.message)) {
                setTimeout(() => setState({ openModal: false }), 200)
            }

            const description = error ? t(`error:${error.message}`) : t('error:COMMON_ERROR')
            showNotification({
                message: `(${result?.code}) ${description}`,
                title: 'Failure', type: 'failure'
            }, 5000)
            setSwapTimer(null)
        }

    }

    const onClickFromAsset = (fromAsset) => {
        if (!state.swapConfigs?.length || fromAsset === state.fromAsset) {
            setState({ openAssetList: {} })
            return
        }

        setState({ fromAsset, search: '', fromErrors: {}, openAssetList: {} })
        fromAssetBtnRef?.current?.click()

        let result = state.swapConfigs.filter(sw => sw?.fromAsset === fromAsset)
        if (result) {
            result = result.map(r => ({
                ...r,
                available: wallets?.[r.toAssetId]?.value - wallets?.[r?.toAssetId]?.locked_value
            }))

            result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc'])
            if (result?.length) {
                setState({ toAsset: result[0]?.toAsset })
            }
        }
    }

    const onClickToAsset = (toAsset) => {
        setState({ toAsset, search: '', openAssetList: {} })
        toAssetBtnRef?.current?.click()
    }

    const onReverse = () => {
        if (state.focus === 'from') {
            fromAssetRef?.current?.focus()
        } else {
            toAssetRef?.current?.focus()
        }

        const bridge = state.fromAmount
        setState({
            fromAmount: state.toAmount,
            toAmount: bridge,
            fromAsset: state.toAsset,
            toAsset: state.fromAsset
        })
    }

    const onMaximumQty = (mode = 'from', availableAsset) => {
        if (!availableAsset) return
        const _qty = availableAsset
        // const limitMaxQty = config.filters?.[0].maxQty

        if (mode === 'from') {
            if ((!_qty > 0)) return
            let max = +_qty
            if (state.fromAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE)
            }
            setState({ fromAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) })
        }

        if (mode === 'to') {
            if ((!_qty > 0)) return
            let max = +_qty
            if (state.toAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE)
            }
            setState({ toAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) })
        }
    }

    const onCloseSwapModal = () => {
        setState({ openModal: false, preOrder: null, invoiceId: null })
        setSwapTimer(null)
    }

    // Render Handler
    const renderDepositLink = useCallback(() => {
        if (!state.fromAsset) return null

        return (
            <Link href={getV1Url(`/wallet?action=deposit&symbol=${state.fromAsset}`)}>
                <a className="font-medium text-dominant text-[14px] hover:!underline">
                    {t('common:deposit')} <span className="uppercase">{state.fromAsset}</span>
                </a>
            </Link>
        )
    }, [state.fromAsset])

    const renderFromInput = useCallback(() => {
        return (
            <div className="flex items-center justify-between">
                <div className="mt-1 flex items-center cursor-pointer select-none"
                     onClick={() => setState({ openAssetList: { from: !state.openAssetList?.from } })}>
                    <AssetLogo assetCode={state.fromAsset} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.fromAsset}</span>
                    <span className={state.openAssetList?.from ? 'rotate-180' : ''}>
                        <SvgIcon name="chevron_down" size={15}/>
                    </span>
                </div>
                <div className="flex items-center">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={fromAssetRef}
                        className="w-full px-[6px] text-[18px] md:text-[20px] text-right font-medium"
                        value={state.fromAmount}
                        onFocus={() => setState({ focus: 'from', inputHighlighted: 'from' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ fromAmount: value }) }
                        placeholder="0.0000"
                        decimalScale={getDecimalScale(+config.filters?.[0].stepSize)}
                    />
                    <div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50"
                         onClick={() => onMaximumQty('from', availabelAsset?.fromAsset)}>
                        max
                    </div>
                </div>
            </div>
        )
    }, [state.fromAsset, state.fromAmount, state.openAssetList, availabelAsset, config])

    const renderFromAssetList = useCallback(() => {
        if (!state.openAssetList?.from || !state.fromAssetList) return null

        const assetItems = []
        const data = state.fromAssetList

        for (let i = 0; i < data?.length; ++i) {
            const { fromAsset, available } = data?.[i]

            assetItems.push(
                <div key={`asset_item___${i}`} className={state.fromAsset === fromAsset ?
                    'px-2.5 py-2 mt-1.5 flex items-center justify-between cursor-pointer text-sm font-medium rounded-lg text-dominant bg-teal-lightTeal dark:bg-darkBlue-5'
                : 'px-2.5 py-2 mt-1.5 flex items-center justify-between cursor-pointer text-sm font-medium rounded-lg hover:bg-teal-lightTeal dark:hover:bg-darkBlue-5'}
                     // onClick={() => setState({ fromAsset, search: '', openAssetList: {} })}
                     onClick={() => onClickFromAsset(fromAsset)}
                >
                   <div className="flex items-center">
                       <AssetLogo assetCode={fromAsset} size={20}/>
                       <span className="ml-2">{fromAsset}</span>
                   </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">
                        {available ? formatWallet(available) : '0.0000'}
                    </div>
                </div>
            )
        }

        return (
            <div className="from_asset__list absolute left-4 top-full py-4 mt-2 w-full z-20 rounded-xl border
                            border-divider dark:border-divider-dark bg-bgContainer dark:bg-darkBlue-3 drop-shadow-onlyLight
                            dark:drop-shadow-none"
                 ref={fromAssetListRef}>
                <div className="px-2.5">
                    <div className="flex items-center bg-gray-4 dark:bg-bgContainer-dark w-full py-2 px-3 rounded-xl text-sm">
                        <Search size={16} className="text-txtSecondary dark:text-txtSecondary-dark"/>
                        <input className="px-2 w-full" value={state.search}
                               placeholder={language === LANGUAGE_TAG.EN ? 'Search Assets...' : 'Tìm tài sản...'}
                               onChange={(e) => setState({ search: e.target?.value })}/>
                        <XCircle size={16}
                                 onClick={() => setState({ search: '' })}
                                 className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark hover:!text-dominant"/>
                    </div>
                </div>
                <div className="mt-2 px-2.5 max-h-[200px] overflow-y-auto">
                    {assetItems?.length ? assetItems
                        : <div className="h-[50px] flex items-center justify-center text-center text-sm italic text-txtSecondary dark:text-txtSecondary-dark">
                             {language === LANGUAGE_TAG.EN ? 'Not found asset' : 'Không tìm thấy tài sản'}
                          </div>}
                </div>
            </div>
        )
    }, [state.fromAsset, state.fromAssetList, state.openAssetList, state.search, language])

    const renderToInput = useCallback(() => {
        return (
            <div className="flex items-center justify-between">
                <div className="mt-1 flex items-center cursor-pointer select-none"
                     onClick={() => setState({ openAssetList: { to: !state.openAssetList?.to } })}>
                    <AssetLogo assetCode={state.toAsset} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.toAsset}</span>
                    <span className={state.openAssetList?.to ? 'rotate-180' : ''}>
                        <SvgIcon name="chevron_down" size={15}/>
                    </span>
                </div>
                <div className="flex items-center">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={toAssetRef}
                        className="w-full pl-[6px] text-[18px] md:text-[20px] text-right font-medium"
                        value={state.toAmount}
                        onFocus={() => setState({ focus: 'to', inputHighlighted: 'to' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ toAmount: value })}
                        placeholder="0.0000"
                    />
                    {/*<div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50"*/}
                    {/*     onClick={() => onMaximumQty('to', availabelAsset?.toAsset)}>*/}
                    {/*    max*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    }, [state.toAsset, state.toAmount, state.openAssetList, availabelAsset])

    const renderToAssetList = useCallback(() => {
        if (!state.openAssetList?.to || !state.toAssetList) return null

        const assetItems = []
        const data = state.toAssetList

        for (let i = 0; i < data?.length; ++i) {
            const { toAsset, available } = data?.[i]

            assetItems.push(
                <div key={`asset_item___${i}`} className={state.toAsset === toAsset ?
                    'px-2.5 py-2 mt-1.5 flex items-center justify-between cursor-pointer text-sm font-medium rounded-lg text-dominant bg-teal-lightTeal dark:bg-darkBlue-5'
                    : 'px-2.5 py-2 mt-1.5 flex items-center justify-between cursor-pointer text-sm font-medium rounded-lg hover:bg-teal-lightTeal dark:hover:bg-darkBlue-5'}
                     // onClick={() => setState({ toAsset, search: '', openAssetList: {} })}
                     onClick={() => onClickToAsset(toAsset)}
                >
                    <div className="flex items-center">
                        <AssetLogo assetCode={toAsset} size={20}/>
                        <span className="ml-2">{toAsset}</span>
                    </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">
                        {available ? formatWallet(available) : '0.0000'}
                    </div>
                </div>
            )
        }

        return (
            <div className="from_asset__list absolute left-4 top-full py-4 mt-2 w-full z-20 rounded-xl border
                            border-divider dark:border-divider-dark bg-bgContainer dark:bg-darkBlue-3 drop-shadow-onlyLight
                            dark:drop-shadow-none"
                 ref={toAssetListRef}>
                <div className="px-2.5">
                    <div className="flex items-center bg-gray-4 dark:bg-bgContainer-dark w-full py-2 px-3 rounded-xl text-sm">
                        <Search size={16} className="text-txtSecondary dark:text-txtSecondary-dark"/>
                        <input className="px-2 w-full" value={state.search}
                               placeholder={language === LANGUAGE_TAG.EN ? 'Search Assets...' : 'Tìm tài sản...'}
                               onChange={e => setState({ search: e.target?.value })}/>
                        <XCircle size={16}
                                 onClick={() => setState({ search: '' })}
                                 className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark hover:!text-dominant"/>
                    </div>
                </div>
                <div className="mt-2 px-2.5 max-h-[200px] overflow-y-auto">
                    {assetItems?.length ? assetItems
                        : <div className="h-[50px] flex items-center justify-center text-center text-sm italic text-txtSecondary dark:text-txtSecondary-dark">
                            {language === LANGUAGE_TAG.EN ? 'Not found asset' : 'Không tìm thấy tài sản'}
                          </div>}
                </div>
            </div>
        )
    }, [state.toAsset, state.toAssetList, state.openAssetList, state.search, language])

    const renderRate = useCallback(() => {
        let price = 0

        const leftUnit = state.changeEstRatePosition ? state.toAsset : state.fromAsset
        const rightUnit = state.changeEstRatePosition ? state.fromAsset : state.toAsset

        if (state.loadingEstRate) {
            return <Skeletor width={100}/>
        }

        if (
            state.estRate?.price &&
            state.estRate?.fromAsset === state.fromAsset &&
            state.estRate?.toAsset === state.toAsset
        ) {
            price = state.changeEstRatePosition ? formatSwapRate(1 / +state.estRate?.price) : formatSwapRate(+state.estRate?.price)
        }

        if ((!state.fromAmount > 0)) {
            return <span className="font-bold">---</span>
        }

        if (!state.estRate || price === 0) {
            return <span className="font-bold">---</span>
        }

        return (
            <span className="font-bold">
                1<span className="ml-2">{leftUnit}</span>
                <span className="mx-2">=</span>
                <span className="mr-2">{price}</span>
                <span>{rightUnit}</span>
            </span>
        )
    }, [config, state.fromAsset, state.fromAmount, state.toAsset, state.estRate, state.changeEstRatePosition, state.loadingEstRate], state.fromErrors)

    useEffect(() => {
        setLoginUrl(getLoginUrl('sso', 'login'))
    },[])

    const renderSwapBtn = useCallback(() => {
        if (!auth) {
            return (
                <a href={loginUrl}
                   className="block mt-6 py-3 w-full rounded-xl text-center text-white text-sm font-bold bg-dominant
                                select-none cursor-pointer hover:opacity-80">
                    {t('common:sign_in')}
                </a>
            )
        }

        let error
        if (!Object.keys(state.fromErrors).length) error = null

        if (state.fromErrors.hasOwnProperty('min')) {
            error = t('convert:errors.min', { amount: formatPrice(state.fromErrors.min) }).toUpperCase() + ` ${state.fromAsset}`
        }
        if (state.fromErrors.hasOwnProperty('max')) {
            error = t('convert:errors.max', { amount: formatPrice(state.fromErrors.max) }).toUpperCase() + ` ${state.fromAsset}`
        }
        if (state.fromErrors.hasOwnProperty('insufficient')) {
            error = t('convert:errors.insufficient').toUpperCase()
        }
        if (state.fromErrors.hasOwnProperty('not_found')) {
            error = t('convert:errors.est_rate_not_found').toUpperCase()
        }

        const shouldDisable = error || !state.fromAmount || !state.estRate

        return (
            <div className={shouldDisable ?
                'mt-6 py-3 w-full rounded-xl text-center text-gray-1 dark:text-darkBlue-5 text-sm font-bold bg-gray-3 dark:bg-darkBlue-4 select-none cursor-not-allowed'
                : 'mt-6 py-3 w-full rounded-xl text-center text-white text-sm font-bold select-none bg-dominant cursor-pointer hover:opacity-80'}
                 onClick={() => !shouldDisable && !state.loadingPreOrder && fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount)}>
                {error ? error : t('navbar:submenu.swap')}
            </div>
        )
    }, [auth, state.fromAsset, state.toAsset, state.fromAmount, state.loadingPreOrder, state.estRate, state.fromErrors])

    const renderPreOrderModal = useCallback(() => {
        const positiveLabel = swapTimer <= 1 ? t('common:refresh') : `${t('common:confirm')} (${swapTimer})`

        return (
            <Modal isVisible={state.openModal}
                   title={t('convert:confirm')}
                   containerClassName="px-6 py-5 md:min-w-[400px]">
                <div className="absolute top-5 right-6 cursor-pointer" onClick={onCloseSwapModal}>
                    <X size={18} className="text-txtSecondary dark:text-txtSecondary-dark hover:!text-dominant"/>
                </div>
                <div className="flex items-end justify-between mt-4 text-sm">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('convert:from_amount')}:</span>
                    <span className="font-medium">{formatPrice(state.preOrder?.fromQty)} {state.preOrder?.fromAsset}</span>
                </div>
                <div className="flex items-end justify-between mt-4 text-sm">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('convert:to_amount')}:</span>
                    <span className="font-medium">{formatPrice(state.preOrder?.toQty)} {state.preOrder?.toAsset}</span>
                </div>
                <div className="flex items-end justify-between mt-4 text-sm">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('convert:rate')}:</span>
                    <span className="font-medium">
                        1 {state.preOrder?.fromAsset === config?.displayPriceAsset ? state.preOrder?.toAsset : state.preOrder?.fromAsset} = {formatPrice(state.preOrder?.displayingPrice)} {config?.displayPriceAsset}
                    </span>
                </div>
                <div className="mt-6 w-full flex flex-row items-center justify-between">
                    <Button title={positiveLabel} type="primary"
                            componentType="button"
                            className="!py-2"
                            onClick={() => swapTimer ? onConfirmOrder(state.preOrder?.preOrderId)
                                : !state.loadingPreOrder &&
                                fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount)}/>
                </div>
            </Modal>
        )
    }, [state.openModal, state.preOrder, state.fromAmount, state.toAsset, state.fromAmount, swapTimer, config])

    // Side Effect
    useAsync(async () => {
        !state.swapConfigs && setState({ loading: true })
        try {
            const options = {
                url: '/api/v3/swap/config',
                options: {
                    method: 'GET',
                },
            }
            const { status, data } = await fetchAPI(options)

            if (status === ApiStatus.SUCCESS && data) {
                setState({ swapConfigs: data })
            }
        } catch (e) {
            console.log(`Can't get swap config `, e)
        } finally {
            setState({ loading: false })
        }
    }, [])

    // useEffect(() => {
    //     console.log('namidev-DEBUG => ', state)
    // }, [state])

    useEffect(() => {
        if (config?.filters) {
            const fromAmount = +config.filters?.[0]?.minQty
            fromAmount && setState({ fromAmount })
        }
    }, [config])


    useEffect(() => {
        fromAssetRef?.current?.focus()
    }, [])

    useEffect(() => {
        if (pair && pair?.fromAsset && pair?.fromAsset !== 'undefined') {
            setState({ fromAsset: pair?.fromAsset })
        }
        if (pair && pair?.toAsset && pair?.toAsset !== 'undefined') {
            setState({ toAsset: pair?.toAsset })
        }
    }, [pair])

    useEffect(() => {
        let interval
        if (swapTimer) {
            interval = setInterval(() => {
                setSwapTimer(lastTimerCount => {
                    if (lastTimerCount <= 1) {
                        clearInterval(interval)
                        setState({ shouldRefreshRate: true })
                    }
                    return lastTimerCount - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [swapTimer])

    useEffect(() => {
        if (!state.swapConfigs || state.init) return
        const sizeFilter = find(config?.filters, { filterType: 'LOT_SIZE' })
        if (sizeFilter?.minQty > 0) {
            fetchEstimateRate(sizeFilter?.minQty, state.fromAsset, false)
            setState({ init: true })
        }
    }, [config, state.swapConfigs, state.fromAsset])

    useEffect(() => {
        let result = uniqBy(state.swapConfigs, 'fromAsset').filter(e => (e?.fromAsset?.toLowerCase()?.includes(state.search?.toLowerCase()))) || []
        result = result.map(r => ({
            ...r,
            available: wallets?.[r.fromAssetId]?.value - wallets?.[r?.fromAssetId]?.locked_value
        }))
        result = orderBy(result, ['available', 'fromAsset'], ['desc', 'asc'])
        setState({ fromAssetList: result })
    }, [state.swapConfigs, state.search, wallets])

    useEffect(() => {
        if (!state.swapConfigs?.length) return
        let result = state.swapConfigs.filter(e => e?.toAsset?.toLowerCase()
            ?.includes(state.search?.toLowerCase()) && e.fromAsset === state.fromAsset)
        result = result.map(e => ({
            ...e,
            available: wallets?.[e.toAssetId]?.value - wallets?.[e?.toAssetId]?.locked_value
        }))
        result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc'])
        setState({ toAssetList: result })
    }, [state.swapConfigs, state.search, state.fromAsset, wallets])

    useDebounce(() => {
        setState({ fromErrors: {} })
        const value = +state.fromAmount

        if (config?.filters && config.filters.length && value) {
            const min = +config?.filters[0].minQty
            const max = +config?.filters[0].maxQty
            const available = availabelAsset?.fromAsset

            if (value < min) {
                setState({ fromErrors: { min } })
            } else if (value > available) {
                setState({ fromErrors: { insufficient: available } })
            } else if (value > max) {
                setState({ fromErrors: { max } })
            }
        }

        if (state.focus === 'from') {
            if (!(+state.fromAmount > 0)) setState({ toAmount: '' })
            fetchEstimateRate(state.fromAmount, state.fromAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.fromAmount, state.fromAmount, state.focus, config, availabelAsset])

    useDebounce(() => {
        if (['from', 'to'].includes(state.focus)) {
            fetchEstimateRate(state.fromAmount, state.fromAsset)
        }
    }, DEBOUNCE_TIMEOUT, [`${state.fromAsset}_${state.toAsset}`])

    useDebounce(() => {
        if (state.focus === 'to') {
            if (!(+state.toAmount > 0)) setState({ fromAmount: '' })
            fetchEstimateRate(state.toAmount, state.toAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.toAmount, state.toAsset])

    return (
        <>
            <div className="flex items-center justify-center w-full h-full lg:block lg:w-auto lg:h-auto">
                <div className="relative p-4 pb-10 md:p-6 lg:p-8 min-w-[280px] w-[320px] md:w-[380px] xl:w-[454px] bg-bgContainer dark:bg-bgContainer-dark rounded-xl">
                    <div className="flex mb-3 items-center justify-between font-bold">
                        {t('navbar:submenu.swap')}
                        {renderDepositLink()}
                    </div>

                    {/*INPUT WRAPPER*/}
                    <div className="relative">
                        <div className={state.inputHighlighted === 'from' ?
                            'pt-[14px] pb-[18px] px-[20px] rounded-xl relative border border-dominant'
                            : 'pt-[14px] pb-[18px] px-[20px] rounded-xl relative border border-divider dark:border-divider-dark'}>
                            <div className="flex items-center justify-between text-[14px]">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {t('common:available_balance')}: {formatWallet(availabelAsset?.fromAsset)}
                                </span>
                                <span className="font-bold">
                                {t('common:from')}
                        </span>
                            </div>
                            {renderFromInput()}
                            {renderFromAssetList()}
                        </div>
                        <div className={state.inputHighlighted === 'to' ?
                            'pt-[14px] pb-[18px] px-[20px] rounded-xl border relative mt-2 border-dominant'
                            : 'pt-[14px] pb-[18px] px-[20px] rounded-xl border relative mt-2 border-divider dark:border-divider-dark'}>
                            <div className="flex items-center justify-between text-[14px]">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {t('common:available_balance')}: {formatWallet(availabelAsset?.toAsset)}
                        </span>
                                <span className="font-bold">
                               {t('common:to')}
                        </span>
                            </div>
                            {renderToInput()}
                            {renderToAssetList()}
                        </div>
                        <div className={state.openAssetList?.from ?
                            'absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer invisible'
                            : 'absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer'}
                             onClick={onReverse}>
                            <SwapReverse color={currentTheme === THEME_MODE.DARK ? colors.darkBlue3 : undefined}
                                         size={width < 1280 && 26}
                            />
                        </div>
                    </div>
                    {/*END:INPUT WRAPPER*/}

                    {/*SWAP RATE*/}
                    <div className="flex items-center justify-center mt-5">
                        <div className="text-sm flex items-center">
                            <span className="mr-1 text-txtSecondary dark:text-txtSecondary-dark">{t('common:rate')}:</span> {renderRate()}
                        </div>
                        <div className={(state.estRate && state.fromAmount) ?
                            'ml-2 p-1 rounded-md cursor-pointer ease-in duration-100 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark'
                            : 'ml-2 p-1 rounded-md cursor-not-allowed ease-in duration-100 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark'}
                             onClick={() => setState({ changeEstRatePosition: !state.changeEstRatePosition })}
                             onMouseOver={() => setState({ onHoverEstRateBtn: true })}
                             onMouseOut={() => setState({ onHoverEstRateBtn: false })}>
                            <RefreshCw
                                className={state?.onHoverEstRateBtn ? 'text-dominant' : 'text-txtSecondary dark:text-txtSecondary-dark'}
                                size={16}/>
                        </div>
                    </div>
                    {/*END:SWAP RATE*/}

                    {/*{renderErrors()}*/}

                    {/*SWAP BUTTON*/}
                    {renderSwapBtn()}
                    {/*END:SWAP BUTTON*/}

                    <div className="mt-5 text-center text-sm text-txtSecondary dark:text-txtSecondary-dark font-bold">
                        <Trans i18nKey="common:term_swap">
                            <a href={PATHS.TERM_OF_SERVICES.SWAP} className="block cursor-pointer text-dominant hover:!underline"/>
                        </Trans>
                    </div>
                </div>
            </div>
            {renderPreOrderModal()}
        </>
    )
}

export default SwapModule
