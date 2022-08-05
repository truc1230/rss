import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatWallet, setTransferModal, getLoginUrl, formatNumber } from 'redux/actions/utils';
import { WalletType } from 'redux/actions/const';
import { Trans, useTranslation } from 'next-i18next';
import { Check, ChevronDown, X } from 'react-feather';
import { POST_WALLET_TRANSFER } from 'redux/actions/apis';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PulseLoader } from 'react-spinners';
import { getUserFuturesBalance, getWallet } from 'redux/actions/user';
import { orderBy } from 'lodash';

import Axios from 'axios';
import Modal from 'components/common/ReModal';
import useOutsideClick from 'hooks/useOutsideClick';
import NumberFormat from 'react-number-format';
import AssetLogo from 'components/wallet/AssetLogo';
import AssetName from 'components/wallet/AssetName';
import showNotification from 'utils/notificationService';
import colors from '../../styles/colors';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import isNil from 'lodash/isNil';

const DEFAULT_STATE = {
    fromWallet: WalletType.SPOT,
    toWallet: WalletType.FUTURES,
    asset: 'VNDC'
}

const ALLOWED_WALLET = {
    SPOT: WalletType.SPOT,
    FUTURES: WalletType.FUTURES,
}

const TransferWalletResult = {
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_WALLET_TYPE: 'INVALID_WALLET_TYPE',
    INVALID_CURRENCY: 'INVALID_CURRENCY',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

export const WalletTypeV1 = {
    SPOT: 0,
    MARGIN: 1,
    FUTURES: 2,
    P2P: 3,
    POOL: 4
}

const ALLOWED_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT']

const INITIAL_STATE = {
    fromWallet: null,
    toWallet: null,
    asset: null,
    openList: {},
    amount: '',
    allWallets: null,
    focus: {},
    errors: {},
    isPlacingOrder: false,

    // ...
}

const TransferModal = ({ isMobile, alert }) => {
    // Init State
    const router = useRouter();
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    const fromWalletRef = useRef()
    const toWalletRef = useRef()
    const assetListRef = useRef()

    // Use Hooks
    const dispatch = useDispatch()
    const { t, i18n: { language } } = useTranslation(['common', 'wallet', 'error'])

    useOutsideClick(fromWalletRef, () => state.openList?.fromWalletList && setState({}))
    useOutsideClick(toWalletRef, () => state.openList?.toWalletList && setState({}))
    useOutsideClick(assetListRef, () => state.openList?.assetList && setState({}))
    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;
    // Rdx
    const {
        isVisible,
        fromWallet,
        toWallet,
        asset
    } = useSelector(state => state.utils.transferModal) || {}
    const auth = useSelector((state) => state.auth?.user);
    const allExchangeWallet = useSelector(state => state.wallet?.SPOT) || null
    const allFuturesWallet = useSelector(state => state.wallet?.FUTURES) || null
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null

    const currentWallet = useMemo(() => {
        let _ = state.allWallets?.find(o => o?.assetCode === state.asset)
        const available = _?.wallet?.value - _?.wallet?.locked_value

        return { ..._, available }
    }, [state.asset, state.allWallets, isVisible])

    const [isError, setIsError] = useState(false);

    const assetDigit = useMemo(() => {
        return assetConfig.find(i => i.assetCode === state.asset)?.assetDigit ?? 0;
    }, [state.asset, assetConfig])

    // Helper
    const onTransfer = async (currency, from_wallet, to_wallet, amount, utils) => {
        setState({ isPlacingOrder: true })
        try {
            const { data } = await Axios.post(POST_WALLET_TRANSFER, {
                from_wallet,
                to_wallet,
                currency,
                amount
            })

            if (data.status === 'ok') {
                const { amount } = data.data
                const fromWallet = utils?.fromWallet
                const toWallet = utils?.toWallet
                const message = t('wallet:transfer_success', {
                    amount: formatWallet(+amount, currentWallet?.assetDigit),
                    assetCode: utils?.assetName,
                    selectedSource: fromWallet,
                    selectedDestination: toWallet
                })

                setState({ message })
                dispatch(getWallet())
                dispatch(getUserFuturesBalance())

                setTimeout(() => {
                    onClose()
                    if (isMobile && alert) {
                        alert.show('success', t('common:success'), message)
                    } else {
                        showNotification({
                            message,
                            title: t('common:success'),
                            type: 'success'
                        })
                    }
                   
                }, 300)
            } else {
                // Process error
                let message = 'Error occur, please try again';
                switch (data.status) {
                    case TransferWalletResult.INVALID_WALLET_TYPE: {
                        message = t('error:INVALID_USER')
                        break
                    }
                    case TransferWalletResult.INVALID_AMOUNT: {
                        message = t('wallet:errors.invalid_amount')
                        break
                    }
                    case TransferWalletResult.INVALID_CURRENCY: {
                        message = t('error:ASSET_NOT_SUPPORT', { ['function']: language === LANGUAGE_TAG.VI ? `để Chuyển Ví` : `for Transfer`  });
                        break
                    }
                }
                if (isMobile && alert) {
                    alert.show('error', t('common:failure'), message)
                } else {
                    showNotification({
                        message,
                        title: t('common:failure'),
                        type: 'failure'
                    })
                }
            }
        } catch (e) {
            console.error('Swap error: ', e)
        } finally {
            setState({ isPlacingOrder: false })
        }
    }

    const onClose = () => {
        dispatch(setTransferModal({
            isVisible: false,
            fromWallet: null,
            toWallet: null,
            asset: null
        }))
        setState({ openList: {}, amount: '' })
    }

    const onFocus = () => setState({ focus: { amount: true }, openList: {}})

    const onBlur = () => setState({ focus: {}})

    const onSetWallet = (target, walletType) => {
        setState({ [target]: walletType, openList: {} })
    }

    const onSetMax = useMemo(() => () => {
        const format = formatNumber(currentWallet?.available, assetDigit, 0, true).replace(/,/g, '')
        setState({ amount: format });
        return null
    }, [currentWallet, assetDigit])

    const getWalletType = (walletType) => {
        switch (walletType) {
            case WalletType.SPOT:
                return t('wallet:spot')
            case WalletType.FUTURES:
                return t('wallet:futures')
            case WalletType.EARN:
            default:
                return '--'
        }
    }

    // Render Handler
    const renderWalletSelect = useCallback(() => {
        return (
            <div className="mt-6 flex flex-col sm:mt-8 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-1/2 sm:pr-3.5 cursor-pointer select-none"
                     ref={fromWalletRef}
                     onClick={() => setState({ openList: { fromWalletList: !state.openList?.fromWalletList } })}>
                    <div className="font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">{t('common:from')}</div>
                    <div className={state.openList?.fromWalletList ?
                        'mt-2 sm:mt-3.5 text-sm font-bold flex items-center justify-between pb-2.5 border-b-2 border-dominant'
                    :'mt-2 sm:mt-3.5 text-sm font-bold flex items-center justify-between pb-2.5 border-b-2 border-divider dark:border-divider-dark'}>
                        {getWalletType(state.fromWallet)}
                        <ChevronDown size={16}
                                     className={state.openList?.fromWalletList ?
                                         'text-txtSecondary text-txtSecondary-dark rotate-180'
                                         : 'text-txtSecondary text-txtSecondary-dark'}/>
                    </div>
                    {state.openList?.fromWalletList &&
                    <div className="absolute z-20 mt-2 rounded-lg border border-divider dark:border-divider-dark left-0 top-full w-full bg-gray-4 dark:bg-darkBlue-3 overflow-hidden">
                        {Object.keys(ALLOWED_WALLET).map(walletType => (
                            <div key={`wallet_type_from__${walletType}`}
                                 className="flex items-center justify-between font-medium text-sm hover:bg-teal-opacity dark:hover:bg-darkBlue-4 px-4 py-2 sm:px-5 sm:py-2.5 cursor-pointer"
                                 onClick={() => onSetWallet('fromWallet', walletType)}>
                                {getWalletType(ALLOWED_WALLET[walletType])}
                                {ALLOWED_WALLET[walletType] === state.fromWallet && <Check size={14} className="dark:text-dominant"/>}
                            </div>
                        ))}
                    </div>}
                </div>
                <div className="mt-4 relative  w-full sm:mt-0 sm:w-1/2 sm:pl-3.5 cursor-pointer select-none"
                     ref={toWalletRef}
                     onClick={() => setState({ openList: { toWalletList: !state.openList?.toWalletList } })}>
                    <div className="font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">{t('common:to')}</div>
                    <div className={state.openList?.toWalletList ?
                        'mt-2 sm:mt-3.5 text-sm font-bold flex items-center justify-between pb-2.5 border-b-2 border-dominant'
                        :'mt-2 sm:mt-3.5 text-sm font-bold flex items-center justify-between pb-2.5 border-b-2 border-divider dark:border-divider-dark'}>
                        {getWalletType(state.toWallet)}
                        <ChevronDown size={16}
                                     className={state.openList?.toWalletList ?
                                         'text-txtSecondary text-txtSecondary-dark rotate-180'
                                         : 'text-txtSecondary text-txtSecondary-dark'}/>
                    </div>
                    {state.openList?.toWalletList &&
                    <div className="absolute z-20 mt-2 rounded-lg border border-divider dark:border-divider-dark left-0 top-full w-full bg-gray-4 dark:bg-darkBlue-3 sm:left-3.5 overflow-hidden">
                        {Object.keys(ALLOWED_WALLET).map(walletType => (
                            <div key={`wallet_type_to__${walletType}`}
                                 className={state.fromWallet === ALLOWED_WALLET[walletType] ?
                                     'flex items-center justify-between font-medium text-sm hover:bg-teal-opacity dark:hover:bg-darkBlue-4 px-4 py-2 sm:px-5 sm:py-2.5 cursor-not-allowed opacity-50'
                                    : 'flex items-center justify-between font-medium text-sm hover:bg-teal-opacity dark:hover:bg-darkBlue-4 px-4 py-2 sm:px-5 sm:py-2.5 cursor-pointer'}
                                 onClick={() => onSetWallet('toWallet', walletType)}>
                                {getWalletType(ALLOWED_WALLET[walletType])}
                                {ALLOWED_WALLET[walletType] === state.toWallet && <Check size={14} className="dark:text-dominant"/>}
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        )
    }, [state?.fromWallet, state?.toWallet, state.openList])

    const renderAssetSelect = useCallback(() => {
        return (
            <div className="flex items-center cursor-pointer select-none"
                 onClick={() => setState({ openList: { assetList: !state.openList?.assetList }})}>
                <AssetLogo assetCode={state.asset} size={20}/>
                <div className="mx-2 font-bold">
                    <AssetName assetCode={state.asset}/>
                </div>
                <ChevronDown size={16} className={state.openList?.assetList ?
                    'text-txtSecondary text-txtSecondary-dark rotate-180'
                    : 'text-txtSecondary text-txtSecondary-dark'}/>
            </div>
        )
    }, [state.asset, state.openList])

    const formatAvl = (value, decimal) => {
        if (+value < 0 || Math.abs(+value) < 1e-8 || isNil(value) || !value) return '0'
        return formatNumber(value, decimal, 0, true)
    }

    const renderAssetList = useCallback(() => {
        if (!state.openList?.assetList) return null

        return (
            <div ref={assetListRef}
                 className="absolute z-20 mt-2 rounded-lg border border-divider dark:border-divider-dark left-0 top-full w-full bg-gray-4 dark:bg-darkBlue-3 overflow-hidden">
                {state.allWallets?.map((wallet, index) => {
                    const available = wallet?.wallet?.value - wallet?.wallet?.locked_value
                    const _assetDigit = assetConfig.find(i => i.assetCode === wallet?.assetCode)?.assetDigit ?? 0;

                    return (
                        <div key={`transfer_asset__list_${wallet?.assetCode}`}
                             className={index === 0 ?
                            'font-medium text-sm flex items-center justify-between pt-3 pb-2 px-4 sm:px-5 cursor-pointer hover:bg-teal-opacity dark:hover:bg-darkBlue-4'
                            : 'font-medium text-sm flex items-center justify-between py-2 px-4 sm:px-5 cursor-pointer hover:bg-teal-opacity dark:hover:bg-darkBlue-4'}
                            onClick={() => state.asset !== wallet?.assetCode && setState({ asset: wallet?.assetCode, openList: {} })}>
                            <span className="font-bold">{wallet?.assetCode}</span>
                            <div className="flex items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {formatAvl(available, _assetDigit)}
                                    {/* {available && available > 0 ? formatWallet(available, wallet?.assetDigit) : '0.0000'} */}
                                </span>
                                <Check size={16} className={state.asset === wallet?.assetCode ? 'ml-2 dark:text-dominant' : 'ml-2 dark:text-dominant invisible'}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }, [state.allWallets, state.openList, state.asset, assetConfig])

    useEffect(() =>{
        const _isError = state.asset === 'VNDC' ? state.amount < 500000 : state.asset === 'USDT' ? state.amount < 25 : false
        setIsError(_isError)
    }, [state.amount, state.asset])

    const renderAmountInput = useCallback(() => {
        return (
            <NumberFormat
                thousandSeparator
                allowNegative={false}
                placeholder={Number(0).toPrecision(assetDigit + 1)}
                className="w-full text-right sm:text-[20px] font-medium"
                value={state.amount}
                onValueChange={({ value }) => setState({ amount: value })}
                onFocus={onFocus}
                onBlur={onBlur}
                decimalScale={assetDigit}
            />
        )
    }, [state.amount, state.focus, state.asset, assetDigit])

    const renderAvailableWallet = useCallback(() => {
        const available = currentWallet?.available

        return (
            <span className="ml-2 font-bold">
                {formatAvl(available, assetDigit)}
                {/* {available && available > 0 ? formatWallet(available, currentWallet?.assetDigit) : '0.0000'} */}
                <span className="ml-2">{currentWallet?.assetCode}</span>
            </span>
        )
    }, [state.asset, currentWallet, assetDigit])

    const renderTransferButton = useCallback(() => {
        const isErrors = !Object.values(state.errors)?.findIndex(item => item?.length) || isError
        const isAmountEmpty = !(state.amount?.length && typeof +state.amount === 'number')
        const isInsufficient = currentWallet?.available < +state.amount
        if (!auth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <div
            className='w-full bg-dominant text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() => window.open(
                    getLoginUrl('sso', 'login'),
                    '_self'
                )}
        >
            {t('futures:order_table:login_to_continue')}
        </div>
    </div>
        return (
            <div className={isErrors || isAmountEmpty || isInsufficient ?
                'mt-6 py-3.5 font-bold text-center text-sm bg-gray-3 text-gray-1 dark:bg-darkBlue-3 dark:text-darkBlue-4 cursor-not-allowed rounded-xl'
                : 'mt-6 py-3.5 font-bold text-center text-sm bg-dominant text-white cursor-pointer rounded-xl hover:opacity-80'}
                onClick={() => !isErrors && !isAmountEmpty && !isInsufficient
                    && !state.isPlacingOrder && onTransfer(
                        currentWallet?.id,
                        convertToWalletV1Type(state.fromWallet),
                        convertToWalletV1Type(state.toWallet),
                        +state.amount,
                        {
                            fromWallet: getWalletType(state.fromWallet),
                            toWallet: getWalletType(state.toWallet),
                            assetName: state.asset
                        })}
            >
                {state.isPlacingOrder ? <PulseLoader color={colors.white} size={3}/> : t('common:transfer')}
            </div>
        )
    }, [state.errors, state.amount, state.fromWallet, state.toWallet, state.isPlacingOrder, state.asset, currentWallet, auth, isError])

    const renderIssues = useCallback(() => {
        const errorItems = []
        Object.values(state.errors)?.forEach(err => {
            err && errorItems.push(
                <div className="text-red text-sm">
                    {err}
                </div>)
        })

        let className = 'mt-3 max-h-0 transition-all ease-in duration-200 '
        if (errorItems.length) {
            className += 'max-h-[34px] '
        }

        if (errorItems.length === 1) {
            className += 'text-center'
        }

        return (
            <div className={className}>
                {errorItems}
            </div>
        )
    }, [state.errors])

    useEffect(() => {
        if (!!!isVisible) {
            dispatch(setTransferModal({
                isVisible: false,
                fromWallet: null,
                toWallet: null,
                asset: null
            }))
        }
    }, [isVisible])

    useEffect(() => {
        fromWallet ? setState({ fromWallet }) : setState({ fromWallet: DEFAULT_STATE.fromWallet })
        toWallet ? setState({ toWallet }) : setState({ toWallet: DEFAULT_STATE.toWallet })
    }, [fromWallet, toWallet])

    useEffect(() => {
        asset ? setState({ asset }) : setState({ asset: DEFAULT_STATE.asset })
    }, [asset])

    useEffect(() => {
        if (state.fromWallet === state.toWallet) {
            setState({ toWallet: null })
        }
    }, [state.fromWallet, state.toWallet])

    useEffect(() => {
        if (allExchangeWallet && allExchangeWallet && assetConfig) {
            let allWallets
            let currentWallets

            if (state.fromWallet === ALLOWED_WALLET.SPOT) {
                currentWallets = allExchangeWallet
            } else if (state.fromWallet === ALLOWED_WALLET.FUTURES) {
                currentWallets = allFuturesWallet
            }

            allWallets = assetConfig.filter(asset => ALLOWED_ASSET.includes(asset?.assetCode))
                ?.map(item => ({...item, wallet: currentWallets?.[item?.id] }))
            allWallets = orderBy(allWallets, o => o?.wallet?.value - o?.wallet?.locked_value, 'desc')
            setState({ allWallets })
        }
    }, [state.fromWallet, allFuturesWallet, allExchangeWallet, assetConfig])

    useEffect(() => {
        !state.fromWallet ?
            setState({ errors: {...state.errors, fromWallet: t('wallet:errors.transfer_source_wallet_issues') } })
            : setState({ errors: {...state.errors, fromWallet: null } })
    }, [state.fromWallet])

    useEffect(() => {
        !state.toWallet ?
            setState({ errors: {...state.errors, toWallet: t('wallet:errors.transfer_destination_wallet_issues') } })
            : setState({ errors: {...state.errors, toWallet: null } })
    }, [state.toWallet])

    useEffect(() => {
        if (currentWallet?.available && state.amount) {
            if (currentWallet?.available < +state.amount) {
                setState({ errors: {...state.errors, insufficient: t('wallet:errors.invalid_insufficient_balance') } })
            } else {
                setState({ errors: {...state.errors, insufficient: null } })
            }
        } else {
            setState({ errors: {...state.errors, insufficient: null } })
        }
    }, [state.amount, currentWallet])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: Transfer Modal => ', state)
    // }, [state])


    const classMobile = useMemo(() => {
        return typeof window !== 'undefined' ? window.innerWidth < 330 ? 'w-[300px]' : 'w-[340px]' : 'w-[340px]';
    }, [isMobile])

    return (
        <Modal isVisible={!!isVisible}
               onBackdropCb={onClose}
               className="w-[300px] px-4 py-5 sm:w-[453px] sm:px-8 sm:py-9"
               noButton
               containerClassName={`!top-[50%] ${isMobile?classMobile:''}`} 
        >
            <div className="flex items-center justify-between">
                <span className="capitalize font-bold">{t('common:transfer')}</span>
                <X size={16} className="cursor-pointer hover:text-dominant" onClick={onClose}/>
            </div>
            {renderWalletSelect()}
            <div className={`${state.focus?.amount ?
                'relative mt-4 py-2.5 px-4 sm:py-3.5 sm:px-5 rounded-xl border border-dominant'
                : 'relative mt-4 py-2.5 px-4 sm:py-3.5 sm:px-5 rounded-xl border border-divider dark:border-divider-dark hover:!border-dominant'}
                ${isError && state.amount ? '!border-red ' : ''}
                `}>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:amount')}</div>
                    <div className="font-bold text-dominant text-sm cursor-pointer"
                         onClick={onSetMax}>
                        {t('common:max')}
                    </div>
                </div>
                {isError && state.amount &&
                    <div className='absolute right-0 top-0 -translate-y-full z-50 flex flex-col items-center'>
                        <div className='px-3 py-1.5 rounded-md bg-gray-3 dark:bg-darkBlue-4'>
                            {t('futures:minimum_price') + ' ' + (state.asset === 'VNDC' ? formatNumber(500000, 0, 0, true) : 25)}
                        </div>
                        <div
                            className='w-[8px] h-[6px] bg-gray-3 dark:bg-darkBlue-4'
                            style={{
                                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                            }}
                        />
                    </div>
                }
                <div className="mt-2 flex items-center">
                    {renderAssetSelect()}
                    {renderAmountInput()}
                </div>
                {renderAssetList()}
            </div>
            <div className="mt-5 text-sm">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}:</span>
                {renderAvailableWallet()}
            </div>
            {renderIssues()}
            {renderTransferButton()}
            <div className="mt-5 text-center text-sm text-txtSecondary dark:text-txtSecondary-dark font-bold">
                <Trans i18nKey="common:term_transfer">
                    <a href={PATHS.TERM_OF_SERVICES.TRANSFER} className="block cursor-pointer text-dominant hover:!underline"/>
                </Trans>
            </div>
        </Modal>
    )
}

const convertToWalletV1Type = (walletType) => {
    switch (walletType) {
        case WalletType.SPOT:
            return WalletTypeV1.SPOT
        case WalletType.FUTURES:
            return WalletTypeV1.FUTURES
        default:
            return null
    }
}

export default TransferModal
