import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { ApiStatus, DepWdlStatus, TokenConfigV1 as TokenConfig, } from 'redux/actions/const';
import { API_GET_ASSET_CONFIG, API_GET_DEPWDL_HISTORY, } from 'redux/actions/apis';
import { Check, ChevronLeft, ChevronRight, Search, X } from 'react-feather';
import { find, get, isNumber } from 'lodash';
import {
    countDecimals,
    eToNumber,
    formatNumber,
    formatTime,
    formatWallet,
    getS3Url,
    shortHashAddress,
} from 'redux/actions/utils';
import { WITHDRAW_RESULT, withdrawHelper } from 'redux/actions/helper';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PATHS } from 'constants/paths';
import { log } from 'utils';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useOutsideClick from 'hooks/useOutsideClick';
import ScaleThinLoader from 'components/loader/ScaleThinLoader';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import NumberFormat from 'react-number-format';
import ChevronDown from 'components/svg/ChevronDown';
import AssetLogo from 'components/wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import OtpInput from 'react-otp-input';
import MCard from 'components/common/MCard';
import Empty from 'components/common/Empty';
import Modal from 'components/common/Modal';
import ReModal from 'components/common/ReModal';
import Link from 'next/link';

import styled from 'styled-components';
import colors from 'styles/colors';
import Axios from 'axios';
import ReTable from 'components/common/ReTable';
import useWindowSize from 'hooks/useWindowSize';
import AssetName from 'components/wallet/AssetName';
import useWindowFocus from 'hooks/useWindowFocus';
import Button from 'components/common/Button';
import classNames from 'classnames';
// import clevertap from 'clevertap-web-sdk'

const INITIAL_STATE = {
    type: 1, // 0. fiat, 1. crypto
    asset: null, // init asset from query
    selectedAsset: null,
    networkList: null,
    selectedNetwork: null,
    loadingConfigs: false,
    configs: null,
    estimatingFee: false,
    withdrawFee: null,
    feeCurrency: null,
    openList: {},
    focus: '',
    search: '',
    // address: '0xeE96703614Ea707b0b99ecb55dA74c04Ff70f2Ed',
    address: '',
    amount: '',
    memo: '',
    validator: null,
    openWithdrawConfirm: false,
    otpModes: [],
    processingWithdraw: false,
    withdrawResult: null,
    emailOtp: null,
    googleOtp: null,
    otp: {},
    errors: null,
    histories: null,
    loadingHistories: false,
    historyPage: 0,
    assetConfigs: null,
    // ... Add new state
}

const TYPE = {
    fiat: 0,
    crypto: 1,
}

const DEFAULT_ASSET = 'VNDC'

const HISTORY_SIZE = 6

const ExchangeWithdraw = () => {
    // Init State
    const [resendTimeOut, setResendTimeOut] = useState(null)
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const cryptoListRef = useRef()
    const networkListRef = useRef()
    const cryptoListSearchRef = useRef()
    const amountInputRef = useRef()
    const addressInputRef = useRef()

    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs)
    const userSocket = useSelector((state) => state.socket.userSocket) || null
    const allAssets = useSelector((state) => state.wallet.SPOT) || null
    const auth = useSelector((state) => state.auth.user) || null

    // Use Hooks
    const [currentTheme] = useDarkMode()
    const { width } = useWindowSize()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const router = useRouter()
    const focused = useWindowFocus()

    useOutsideClick(
        cryptoListRef,
        () => state.openList?.cryptoList && setState({ openList: {} })
    )
    useOutsideClick(
        networkListRef,
        () => state.openList?.networkList && setState({ openList: {} })
    )

    // Memmoized
    const assetBalance = useMemo(() => {
        return allAssets && allAssets[state.selectedAsset?.assetId]
    }, [allAssets, state.selectedAsset])

    const assetConfig = useMemo(
        () =>
            state.assetConfigs?.find(
                (o) => o.assetCode === state.selectedNetwork?.coin
            ),
        [state.assetConfigs, state.selectedNetwork]
    )

    // Helper
    // const getWithdrawFee = async (assetId, amount, network) => {
    //     if (!assetId || !amount || !network) return

    //     setState({ estimatingFee: true })
    //     try {
    //         log.i('fetching withdraw fee...')
    //         userSocket &&
    //             (await userSocket.emit(
    //                 'calculate_withdrawal_fee',
    //                 assetId,
    //                 amount,
    //                 network,
    //                 (withdrawFee) => setState({ withdrawFee: withdrawFee?.[0] })
    //             ))
    //     } catch (e) {
    //         console.log(`Can't estimate withdraw fee `, e)
    //     } finally {
    //         setState({ estimatingFee: false })
    //     }
    // }

    const getWithdrawHistory = async (page) => {
        setState({ loadingHistories: true })
        try {
            const {
                data: { status, data: histories },
            } = await Axios.get(API_GET_DEPWDL_HISTORY, {
                params: {
                    type: 2,
                    page,
                    pageSize: HISTORY_SIZE,
                },
            })

            if (status === ApiStatus.SUCCESS && histories) {
                setState({ histories })
            }
        } catch (e) {
            console.log(`Can't get withdraw history `, e)
        } finally {
            setState({ loadingHistories: false })
        }
    }

    const withdraw = async (params = {}, cleverProps = {}, isFromOtpModal) => {
        if (!Object.keys(params).length) return

        setState({
            processingWithdraw: true,
            errors: {},
        })

        try {
            const { assetId, amount, network, withdrawTo, tag, otp } = params
            const result = await withdrawHelper(
                assetId,
                amount,
                network,
                withdrawTo,
                tag,
                otp
            )
            setState({ withdrawResult: result?.data })

            if (result.status === 'ok') {
                log.i('Withdraw Result => ', result?.data)

                if (isFromOtpModal) {
                    // Phake data
                    // const phakePhake = { status: 'ok', data: 'eKgJxs0necloShq7IAPGen0iALhQdS' }
                    // result.data = phakePhake

                    if (result?.data?.status === ApiStatus.SUCCESS) {
                        setState({ withdrawResult: result?.data })
                    } else {
                        switch (result?.data?.data) {
                            case WITHDRAW_RESULT.MissingOtp:
                                setState({
                                    errors: {
                                        message: t(
                                            'wallet:withdraw_prompt.input_otp_suggest'
                                        ),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.InvalidOtp:
                                setState({
                                    errors: {
                                        message: (
                                            <Trans>
                                                {t('wallet:errors.wrong_otp')}
                                            </Trans>
                                        ),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.NotEnoughBalance:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.NotEnoughBalance,
                                        message: t('error:BALANCE_NOT_ENOUGH'),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.UnsupportedAddress:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.UnsupportedAddress,
                                        message: t('error:INVALID_ADDRESS'),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.AmountExceeded:
                            case WITHDRAW_RESULT.AmountTooSmall:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.INVALID_AMOUNT,
                                        message: t('error:INVALID_AMOUNT'),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.InvalidAsset:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.InvalidAsset,
                                        message: t('error:INVALID_CURRENCY'),
                                    },
                                })
                                break

                            case WITHDRAW_RESULT.INVALID_KYC_STATUS:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.INVALID_KYC_STATUS,
                                        message: t('error:INVALID_KYC_STATUS'),
                                    },
                                })
                                break
                            case WITHDRAW_RESULT.WithdrawDisabled:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.WithdrawDisabled,
                                        message: t(
                                            'wallet:errors.withdraw_disabled'
                                        ),
                                    },
                                })
                            case WITHDRAW_RESULT.Unknown:
                            default:
                                setState({
                                    errors: {
                                        status: WITHDRAW_RESULT.UNKNOWN_ERROR,
                                        message: t('error:UNKNOWN_ERROR'),
                                    },
                                })
                                break
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setState({ processingWithdraw: false })
            await getWithdrawHistory()
        }
    }

    const onChangeAsset = () => {
        setState({
            address: '',
            memo: '',
            search: '',
            openList: {},
            selectedNetwork: null,
            withdrawFee: null,
            feeCurrency: null,
            validator: {},
        })
    }

    const onClearInput = (type) => {
        switch (type) {
            case 'crypto_search':
                setState({ search: '' })
                cryptoListSearchRef?.current?.focus()
                break
            case 'amount_input':
                setState({ amount: '' })
                amountInputRef?.current?.focus()
                break
            case 'address_input':
                setState({ address: '' })
                addressInputRef?.current?.focus()
                break
            default:
                return
        }
    }

    const onCancelWdlOrder = () => {
        setState({
            openWithdrawConfirm: false,
            withdrawResult: null,
            errors: null,
            otp: {},
        })
    }

    const handleOtp = (origin, mode, code) =>
        setState({
            otp: {
                ...origin,
                [mode]: code,
            },
        })

    // Render hander
    const renderTab = useCallback(() => {
        return (
            <div className='mt-5 ml-4 flex items-end'>
                {/*<Link href={{*/}
                {/*    pathname: '/wallet/exchange/withdraw',*/}
                {/*    query: { type: 'fiat' }*/}
                {/*}}>*/}
                {/*    <a className={state.type === TYPE.fiat ?*/}
                {/*        'mr-6 flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark cursor-not-allowed'*/}
                {/*        : 'mr-6 flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark cursor-not-allowed'}*/}
                {/*       title={'Coming soon'}*/}
                {/*    >*/}
                {/*        <div className="pb-2.5">VNDC</div>*/}
                {/*        <div className={state.type === TYPE.fiat ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>*/}
                {/*    </a>*/}
                {/*</Link>*/}
                <Link
                    href={{
                        pathname: PATHS.WALLET.EXCHANGE.WITHDRAW,
                        query: { type: 'crypto' },
                    }}
                    prefetch={false}
                >
                    <a
                        className={classNames(
                            'flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark',
                            {
                                '!font-bold !tex-txtPrimary dark:!text-txtPrimary-dark':
                                    state.type === TYPE.crypto,
                            }
                        )}
                    >
                        <div className='pb-2.5'>TOKEN</div>
                        <div
                            className={classNames(
                                'w-[32px] h-[3px] md:h-[2px] bg-dominant invisible',
                                { '!visible': state.type === TYPE.crypto }
                            )}
                        />
                    </a>
                </Link>
            </div>
        )
    }, [router, state.type])

    const renderWithdrawInput = useCallback(() => {
        return (
            <>
                <div className='flex items-center'>
                    <AssetLogo assetCode={state.selectedAsset?.assetCode} />
                    <span className='ml-2 font-bold text-sm text-txtPrimary dark:text-txtPrimary-dark'>
                        {state.selectedAsset?.assetCode || '--'}
                    </span>
                    <span className='ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {state.selectedAsset?.fullName ||
                            state.selectedAsset?.assetCode}
                    </span>
                </div>
                <div className={state.openList?.cryptoList ? 'rotate-180' : ''}>
                    <ChevronDown
                        size={16}
                        color={
                            currentTheme === THEME_MODE.DARK
                                ? colors.grey4
                                : colors.darkBlue
                        }
                    />
                </div>
            </>
        )
    }, [state.type, state.selectedAsset, state.openList, currentTheme])

    const renderCryptoList = useCallback(() => {
        if (!paymentConfigs) return null
        let origin = paymentConfigs || []
        let items = []

        if (state.search) {
            origin =
                paymentConfigs &&
                [...paymentConfigs].filter((e) =>
                    e?.assetCode?.includes(state.search.toUpperCase())
                )
        }

        origin.forEach((cfg) => {
            if (!IGNORE_TOKEN.includes(cfg?.assetCode)) {
                items.push(
                    <Link
                        key={`wdl_cryptoList__${cfg?.assetCode}`}
                        href={withdrawLinkBuilder(state.type, cfg?.assetCode)}
                        prefetch={false}
                    >
                        <a
                            className={
                                state.selectedAsset?.assetCode ===
                                cfg?.assetCode
                                    ? 'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 bg-teal-opacity cursor-pointer'
                                    : 'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 hover:bg-teal-opacity cursor-pointer'
                            }
                            onClick={onChangeAsset}
                        >
                            <div className='flex items-center w-full'>
                                <AssetLogo
                                    assetCode={cfg?.assetCode}
                                    size={24}
                                />
                                <span className='font-bold text-sm ml-2'>
                                    {cfg?.assetCode}
                                </span>
                                <span className='font-medium text-sm ml-2 text-txtSecondary dark:text-txtSecondary-dark'>
                                    {cfg?.fullName || cfg?.assetCode}
                                </span>
                            </div>
                            <div>
                                {state.selectedAsset?.assetCode ===
                                    cfg?.assetCode && <Check size={16} />}
                            </div>
                        </a>
                    </Link>
                )
            }
        })

        return (
            <div
                className='pt-3.5 md:pt-4 absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden'
                ref={cryptoListRef}
            >
                <div className='px-3.5 md:px-5'>
                    <div className='flex items-center bg-gray-4 dark:bg-darkBlue-3 px-2.5 py-1.5 mb-3.5 rounded-lg'>
                        <Search size={16} />
                        <input
                            className='w-full px-2.5 text-sm font-medium'
                            value={state.search}
                            ref={cryptoListSearchRef}
                            onChange={(e) =>
                                setState({ search: e.target?.value })
                            }
                            placeholder={t('wallet:search_asset')}
                        />
                        <X
                            size={16}
                            onClick={() => onClearInput('crypto_search')}
                            className='cursor-pointer'
                        />
                    </div>
                </div>
                <div className='max-h-[200px] overflow-y-auto'>
                    {!items.length ? (
                        <div className='py-6'>
                            <Empty
                                grpSize={68}
                                message={t('common:not_found')}
                                messageStyle='text-sm'
                            />
                        </div>
                    ) : (
                        items
                    )}
                </div>
            </div>
        )
    }, [paymentConfigs, state.type, state.search, state.selectedAsset])

    const renderNetworkInput = useCallback(() => {
        return (
            <>
                <div
                    className={
                        state.selectedNetwork?.withdrawEnable
                            ? 'flex items-center'
                            : 'flex items-center opacity-40'
                    }
                >
                    <span className='font-bold text-sm text-dominant'>
                        {getTokenType(state.selectedNetwork?.network) || '--'}
                    </span>
                    <span className='ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                        {state.selectedNetwork?.name || '--'}
                    </span>
                </div>
                <div
                    className={state.openList?.networkList ? 'rotate-180' : ''}
                >
                    <ChevronDown
                        size={16}
                        color={
                            currentTheme === THEME_MODE.DARK
                                ? colors.grey4
                                : colors.darkBlue
                        }
                    />
                </div>
            </>
        )
    }, [state.selectedNetwork, state.openList])

    const renderAddressInput = useCallback(() => {
        return (
            <div
                className={
                    state.focus === 'address'
                        ? 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                        : 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'
                }
                onClick={() => addressInputRef?.current?.focus()}
            >
                <input
                    className='w-full font-medium text-sm pr-3'
                    placeholder={t('wallet:receive_address_placeholder')}
                    value={state.address}
                    ref={addressInputRef}
                    onChange={(e) => setState({ address: e?.target.value })}
                    onFocus={() => setState({ focus: 'address' })}
                    onBlur={() => setState({ focus: null })}
                />
                <span
                    className={
                        state.address
                            ? 'font-bold text-sm text-dominant hover:opacity-80'
                            : 'font-bold text-sm text-dominant hover:opacity-80 invisible'
                    }
                    onClick={() => onClearInput('address_input')}
                >
                    {t('common:clear')}
                </span>
            </div>
        )
    }, [state.address, state.focus])

    const renderAmountInput = useCallback(() => {
        return (
            <div
                className={
                    state.focus === 'amount'
                        ? 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                        : 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'
                }
                onClick={() => amountInputRef?.current?.focus()}
            >
                <NumberFormat
                    thousandSeparator
                    allowNegative={false}
                    getInputRef={(ref) => (amountInputRef.current = ref)}
                    className='w-full text-sm pr-3 font-medium'
                    placeholder={t('wallet:input_amount')}
                    value={state.amount}
                    onValueChange={({ value: amount }) => setState({ amount })}
                    onFocus={() => setState({ focus: 'amount' })}
                    onBlur={() => setState({ focus: null })}
                />
                <span
                    className={
                        state.amount
                            ? 'font-bold text-sm text-dominant hover:opacity-80'
                            : 'font-bold text-sm text-dominant hover:opacity-80 invisible'
                    }
                    onClick={() => onClearInput('amount_input')}
                >
                    {t('common:clear')}
                </span>
            </div>
        )
    }, [state.amount, state.focus])

    const renderNetworkList = useCallback(() => {
        if (!state?.selectedAsset?.networkList) return null

        const items = []

        state.selectedAsset.networkList.forEach((nw) => {
            items.push(
                <div
                    key={`wdl_networkList___${nw?.network}`}
                    className={
                        nw?.withdrawEnable
                            ? 'flex items-center justify-between px-3.5 py-3 md:px-5 hover:bg-teal-opacity cursor-pointer'
                            : 'flex items-center justify-between px-3.5 py-3 md:px-5 cursor-not-allowed opacity-40'
                    }
                    onClick={() =>
                        setState({
                            selectedNetwork: nw,
                            openList: {},
                        })
                    }
                >
                    <div>
                        <span className='text-sm font-medium'>
                            {getTokenType(nw?.network)}
                        </span>
                        <span className='ml-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            {nw?.name}
                        </span>
                    </div>
                    {state.selectedNetwork?.network === nw?.network && (
                        <Check size={16} />
                    )}
                </div>
            )
        })

        return (
            <div
                className='absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden'
                ref={networkListRef}
            >
                <div className='max-h-[200px] overflow-y-auto'>
                    {!items.length ? (
                        <div className='py-6 h-full w-full items-center justify-center'>
                            Chưa hỗ trợ rút đối với token{' '}
                            {state.selectedAsset?.assetCode}
                        </div>
                    ) : (
                        items
                    )}
                </div>
            </div>
        )
    }, [state.selectedAsset, state.selectedNetwork])

    const renderWithdrawFiat = useCallback(() => {
        return <div>Fiat Section</div>
    }, [state.type])

    const renderAssetAvailable = useCallback(() => {
        const avbl =
            assetBalance === undefined ? (
                <div className=''>
                    0.0000
                    {/*<Skeletor width={65}/>*/}
                </div>
            ) : (
                formatWallet(
                    assetBalance?.value - assetBalance?.locked_value,
                    state.selectedAsset?.assetDigit
                )
            )

        return (
            <div className='flex items-center text-sm'>
                <span className='text-txtSecondary dark:text-txtSecondary-dark mr-2'>
                    {t('common:available_balance')}
                </span>
                <span className='font-bold flex items-center'>
                    {avbl === '0' ? '0.0000' : avbl}{' '}
                    <span className='ml-1'>
                        {state.selectedAsset?.assetCode}
                    </span>
                </span>
            </div>
        )
    }, [assetBalance, state.selectedAsset])

    const renderWdlFee = useCallback(() => {
        return (
            <div className='flex items-center text-sm mt-2.5'>
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('wallet:withdraw_fee')}
                </span>
                <span className='font-bold ml-2'>
                    {state.withdrawFee?.amount
                        ? formatWallet(
                              state.withdrawFee?.amount,
                              state.feeCurrency?.assetDigit
                          )
                        : state.selectedNetwork?.withdrawFee}{' '}
                    {state.withdrawFee && state.feeCurrency
                        ? state.feeCurrency?.assetCode
                        : state.selectedNetwork?.coin}
                </span>
            </div>
        )
    }, [state.withdrawFee, state.feeCurrency, state.selectedNetwork])

    const renderMinWdl = useCallback(() => {
        let min
        if (
            state.withdrawFee?.amount >= state.selectedNetwork?.withdrawMin &&
            state.selectedAsset?.assetCode === state.feeCurrency?.assetCode
        ) {
            min = `${formatWallet(
                state.withdrawFee?.amount,
                assetConfig?.assetDigit
            )} ${state.selectedAsset?.assetCode}`
        } else {
            min = `${formatWallet(
                +state.selectedNetwork?.withdrawMin,
                assetConfig?.assetDigit
            )} ${state.selectedAsset?.assetCode} `
        }

        return (
            <div className='flex items-center text-sm mt-2.5'>
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('wallet:min_withdraw')}
                </span>
                <span className='font-bold ml-2'>{min || '--'}</span>
            </div>
        )
    }, [
        state.selectedNetwork,
        state.selectedAsset,
        state.withdrawFee,
        state.feeCurrency,
        assetConfig,
    ])

    const renderMaxWdl = useCallback(() => {
        if (!state.selectedNetwork?.maxWithdraw) return null

        return (
            <div className='flex items-center text-sm mt-2.5'>
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('wallet:max_withdraw')}
                </span>
                <span className='font-bold ml-2'>
                    {state.selectedNetwork?.maxWithdraw
                        ? formatWallet(
                              state.selectedNetwork.maxWithdraw?.value,
                              state.selectedNetwork?.assetDigit
                          )
                        : '--'}{' '}
                    <AssetName
                        assetId={
                            state.selectedNetwork?.maxWithdraw
                                ?.equivalentCurrency
                        }
                    />
                </span>
            </div>
        )
    }, [state.selectedNetwork])

    const renderActualReceive = useCallback(() => {
        const actualRcv = +state.amount - state.withdrawFee?.amount
        let inner = '--'

        if (state.amount && state.withdrawFee) {
            if (!actualRcv) {
                inner = '0.0000'
            } else {
                inner = formatWallet(actualRcv, state.selectedAsset?.assetDigit)
            }
        }

        return (
            <div className='flex items-center text-sm mt-2.5'>
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {t('wallet:will_receive')}
                </span>
                <span className='font-bold ml-2'>
                    {inner} {state.selectedAsset?.assetCode}
                </span>
            </div>
        )
    }, [state.withdrawFee, state.amount, state.selectedAsset])

    const renderWdlButton = useCallback(() => {
        const passedStl =
            'mt-8 w-full bg-dominant rounded-xl py-3 text-sm text-center text-white font-bold hover:opacity-80 cursor-pointer'
        const preventStl =
            'mt-8 w-full bg-gray-4 dark:bg-darkBlue-4 rounded-xl py-3 text-sm text-center text-gray-1 dark:text-darkBlue-2 font-bold cursor-not-allowed'

        return (
            <div
                className={state.validator?.allPass ? passedStl : preventStl}
                onClick={() =>
                    state.validator?.allPass &&
                    setState({ openWithdrawConfirm: true })
                }
            >
                {t('common:withdraw')}
            </div>
        )
    }, [state.validator?.allPass])

    const renderInputIssues = useCallback(
        (type) => {
            let inner

            if (type === 'allowWithdraw') {
                if (state?.validator?.hasOwnProperty('allowWithdraw')) {
                    if (state?.validator.allowWithdraw) {
                        // inner = <Check className="text-dominant" size={16}/>
                    } else {
                        inner = (
                            <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                {t('wallet:errors.network_not_support', {
                                    asset: state.selectedAsset?.assetCode,
                                    chain: state.selectedNetwork?.network,
                                })}
                            </span>
                        )
                    }
                } else {
                    inner = null
                }
            }

            if (type === 'address') {
                if (
                    state?.validator?.hasOwnProperty('address') &&
                    state.address
                ) {
                    if (state?.validator?.address) {
                        // inner = <Check className='text-dominant' size={16} />
                    } else {
                        inner = (
                            <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                {t('wallet:errors.invalid_withdraw_address')}
                            </span>
                        )
                    }
                } else {
                    inner = null
                }
            }

            if (type === 'amount') {
                if (state?.validator?.hasOwnProperty('amount')) {
                    switch (state.validator.amount) {
                        case AMOUNT.LESS_THAN_MIN:
                            inner = (
                                <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                    {t('wallet:errors.invalid_min_amount', {
                                        value:
                                            state.withdrawFee?.amount >=
                                            state.selectedNetwork?.withdrawMin
                                                ? formatWallet(
                                                      state.withdrawFee?.amount,
                                                      assetConfig?.assetDigit
                                                  )
                                                : formatWallet(
                                                      state.selectedNetwork
                                                          ?.withdrawMin,
                                                      assetConfig?.assetDigit
                                                  ),
                                    })}{' '}
                                    {state.selectedNetwork?.coin}
                                </span>
                            )
                            break
                        case AMOUNT.OVER_THAN_MAX:
                            inner = (
                                <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                    {t('wallet:errors.invalid_max_amount', {
                                        value: formatWallet(
                                            state.selectedNetwork?.withdrawMax
                                                ?.value,
                                            assetConfig?.assetDigit
                                        ),
                                    })}{' '}
                                    {state.selectedNetwork?.coin}
                                </span>
                            )
                            break
                        case AMOUNT.OVER_BALANCE:
                            inner = (
                                <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                    {t(
                                        'wallet:errors.invalid_insufficient_balance'
                                    )}
                                </span>
                            )
                            break
                        case AMOUNT.OVER_DECIMAL_SCALE:
                            inner = (
                                <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                    {t('wallet:errors.decimal_scale_limit', {
                                        value: countDecimals(
                                            eToNumber(
                                                state.selectedNetwork
                                                    ?.withdrawIntegerMultiple
                                            )
                                        ),
                                    })}
                                </span>
                            )
                            break
                        default:
                            inner = null
                    }
                } else {
                    inner = null
                }
            }

            if (type === 'memo') {
                if (state.memo && state?.validator?.hasOwnProperty('memo')) {
                    if (state?.validator.memo) {
                        // inner = <Check className="text-dominant" size={16}/>
                    } else {
                        inner = (
                            <span className='block w-full font-medium text-red text-xs lg:text-sm text-right mt-2'>
                                {t('wallet:errors.invalid_memo')}
                            </span>
                        )
                    }
                } else {
                    inner = null
                }
            }

            return <>{inner}</>
        },
        [
            state.validator,
            state.address,
            state.selectedNetwork,
            state.selectedAsset,
            state.withdrawFee,
            assetConfig,
        ]
    )

    const renderMemoInput = useCallback(() => {
        if (!state?.selectedNetwork?.memoRegex) {
            return null
        }

        return (
            <div className='relative mt-5'>
                <div className='mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark'>
                    <span className='mr-1.5'>
                        Memo ({t('common:optional')})
                    </span>
                    <span>
                        {state.validator?.memo === true && (
                            <Check size={16} className='text-dominant' />
                        )}
                    </span>
                </div>
                <div
                    className={
                        state.focus === 'memo'
                            ? 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                            : 'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'
                    }
                >
                    <input
                        className='w-full font-medium text-sm pr-3'
                        placeholder={t('wallet:receiver_memo')}
                        value={state.memo}
                        onChange={(e) => setState({ memo: e?.target.value })}
                        onFocus={() => setState({ focus: 'memo' })}
                        onBlur={() => setState({ focus: null })}
                    />
                    <span
                        className={
                            state.memo
                                ? 'font-bold text-sm text-dominant hover:opacity-80'
                                : 'font-bold text-sm text-dominant hover:opacity-80 invisible'
                        }
                        onClick={() => setState({ memo: '' })}
                    >
                        {t('common:clear')}
                    </span>
                </div>
                {renderInputIssues('memo')}
            </div>
        )
    }, [
        state.selectedNetwork,
        state.memo,
        state.focus,
        state.validator?.memo,
        renderInputIssues,
    ])

    const renderWithdrawHistory = useCallback(() => {
        const data = dataHandler(
            state.histories,
            state.loadingHistories,
            paymentConfigs,
            {
                getAssetName,
                t,
            }
        )
        let tableStatus

        const columns = [
            {
                key: 'id',
                dataIndex: 'id',
                title: 'Order#ID',
                width: 200,
                fixed: 'left',
                align: 'left',
            },
            {
                key: 'asset',
                dataIndex: 'asset',
                title: 'Asset',
                width: 100,
                align: 'left',
            },
            {
                key: 'amount',
                dataIndex: 'amount',
                title: 'Amount',
                width: 100,
                align: 'right',
            },
            {
                key: 'network',
                dataIndex: 'network',
                title: 'Network',
                width: 100,
                align: 'right',
            },
            {
                key: 'withdraw_to',
                dataIndex: 'withdraw_to',
                title: 'Withdraw To',
                width: 100,
                align: 'right',
            },
            {
                key: 'txId',
                dataIndex: 'txId',
                title: 'TxHash',
                width: 100,
                align: 'right',
            },
            {
                key: 'time',
                dataIndex: 'time',
                title: 'Time',
                width: 100,
                align: 'right',
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: 'Status',
                width: 100,
                align: 'right',
            },
        ]

        if (!state.histories?.length) {
            tableStatus = <Empty />
        }

        return (
            <ReTable
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '888px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '280px',
                    },
                }}
            />
        )
    }, [state.histories, state.loadingHistories, paymentConfigs, width])

    const renderPagination = useCallback(() => {
        return (
            <div className='w-full mt-6 mb-10 flex items-center justify-center select-none'>
                <div
                    className={
                        state.historyPage !== 0
                            ? 'flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                            : 'flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'
                    }
                    onClick={() =>
                        state.historyPage !== 0 &&
                        setState({ historyPage: state.historyPage - 1 })
                    }
                >
                    <ChevronLeft size={18} className='mr-2' />{' '}
                    {language === LANGUAGE_TAG.VI ? 'Trước' : 'Previous'}
                </div>
                <div
                    className={
                        state.histories?.length
                            ? 'ml-10 flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                            : 'ml-10 flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'
                    }
                    onClick={() =>
                        state.histories?.length &&
                        setState({ historyPage: state.historyPage + 1 })
                    }
                >
                    {language === LANGUAGE_TAG.VI ? 'Kế tiếp' : 'Next'}{' '}
                    <ChevronRight size={18} className='ml-2' />
                </div>
            </div>
        )
    }, [state.historyPage, state.histories, language])

    const renderWdlConfirm = useCallback(() => {
        if (state.type !== TYPE.crypto) return null

        const params = {
            // address: state.address.trim(),
            // amount: +state.amount,
            // currency: state.selectedAsset?.id,
            // otp: otpHandler(state.otpModes, state.otp),
            // memo: state.memo,
            // tokenTypeIndex: state.selectedNetwork?.tokenTypeIndex,
            // networkType: state.selectedNetwork?.network,
            assetId: state.selectedAsset?.assetId,
            amount: +state.amount,
            network: state.selectedNetwork?.network,
            withdrawTo: state?.address.trim(),
            tag: state?.memo?.trim(),
            otp: otpHandler(state.otpModes, state.otp),
        }

        const cleverProps = {
            cryptoName: `${state.selectedAsset?.assetCode} ${
                state.selectedAsset?.fullName
                    ? `(${state.selectedAsset?.fullName})`
                    : ''
            }`,
            network: `${state.selectedNetwork?.tokenType} (${state.selectedNetwork?.displayNetwork})`,
            amount: +state.amount,
        }

        let title = t('wallet:withdraw_confirmation')

        const isSuccess =
            state.withdrawResult?.status === ApiStatus.SUCCESS &&
            !!Object.keys(state.withdrawResult?.data)?.length
        const isErrors = !!state.errors?.status

        if (isSuccess && !isErrors) {
            title = t('wallet:withdraw_success_title')
        }

        if (isErrors && !isSuccess) {
            title = t('common:failure')
        }

        return (
            <Modal
                type='confirmation'
                isVisible={state.openWithdrawConfirm}
                title={title}
                titleStyle='uppercase'
                className='md:px-6 md:pb-6 relative'
                noButton
            >
                <div className='mt-6 w-[280px] md:min-w-[410px]'>
                    {/*Pre-withdraw*/}
                    {!state.withdrawResult && (
                        <>
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('common:withdraw')}
                                </span>
                                <span className='font-medium'>
                                    {state.selectedAsset?.assetCode}{' '}
                                    {state.selectedAsset?.fullName && (
                                        <span className='ml-1'>
                                            ({state.selectedAsset?.fullName})
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('wallet:receive_address')}
                                </span>
                                <span
                                    className='font-medium cursor-pointer'
                                    title={`${t('wallet:receive_address')}: ${
                                        state.address
                                    }`}
                                >
                                    {shortHashAddress(state.address, 8, 8)}
                                </span>
                            </div>
                            {state.memo && (
                                <div className='text-sm mb-2 flex items-center justify-between'>
                                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                        MEMO
                                    </span>
                                    <span className='font-medium'>
                                        {state.memo}
                                    </span>
                                </div>
                            )}
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('common:amount')}
                                </span>
                                <span className='font-medium'>
                                    {formatWallet(
                                        state.amount,
                                        assetConfig?.assetDigit
                                    )}{' '}
                                    {state.selectedAsset?.assetCode}
                                </span>
                            </div>
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('common:fee')}
                                </span>
                                <span className='font-medium'>
                                    {formatWallet(
                                        state.withdrawFee?.amount,
                                        assetConfig?.assetDigit
                                    )}{' '}
                                    {state.feeCurrency?.assetCode}
                                </span>
                            </div>
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('wallet:will_receive')}
                                </span>
                                <span className='font-medium'>
                                    {formatWallet(
                                        +state.amount -
                                            state.withdrawFee?.amount,
                                        assetConfig?.assetDigit
                                    )}{' '}
                                    {state.selectedAsset?.assetCode}
                                </span>
                            </div>
                            <div className='text-sm mb-2 flex items-center justify-between'>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    {t('wallet:network')}
                                </span>
                                <span className='font-medium'>
                                    {state.selectedNetwork?.name}
                                    {/* <span className='ml-1.5'>
                                        ({state.selectedNetwork?.name})
                                    </span> */}
                                </span>
                            </div>
                            {!state.memo && (
                                <div className='mt-2 text-xs text-red'>
                                    * {t('wallet:notes.memo_wdl_tips')}
                                </div>
                            )}
                        </>
                    )}

                    {/*OTP Phase*/}
                    {state.withdrawResult && !isErrors && !isSuccess && (
                        <div className=''>
                            {state.otpModes.includes('email') && (
                                <div>
                                    <div className='font-medium text-sm '>
                                        {t('common:email_authentication')}
                                    </div>
                                    <div className='mt-0.5 flex items-center justify-between text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary'>
                                        {t(
                                            'wallet:withdraw_prompt.email_description'
                                        )}
                                        {/* <span
                                            className={
                                                resendTimeOut
                                                    ? 'font-medium text-txt-gray-1 dark:text-txt-darkBlue5 cursor-not-allowed'
                                                    : 'font-medium text-dominant cursor-pointer hover:opacity-80'
                                            }
                                            onClick={() => {
                                                if (!resendTimeOut) {
                                                    withdraw({
                                                        ...params,
                                                        otp: undefined,
                                                    })
                                                    setResendTimeOut(60)
                                                }
                                            }}
                                        >
                                            {t('common:resend')}
                                            <span className='ml-1'>
                                                {!!resendTimeOut &&
                                                    `(${resendTimeOut})`}
                                            </span>
                                        </span> */}
                                    </div>
                                    <OtpWrapper
                                        isDark={
                                            currentTheme === THEME_MODE.DARK
                                        }
                                    >
                                        <OtpInput
                                            value={state.otp?.email}
                                            onChange={(otp) =>
                                                handleOtp(
                                                    state.otp,
                                                    'email',
                                                    otp
                                                )
                                            }
                                            numInputs={6}
                                            placeholder='------'
                                            isInputNum
                                        />
                                    </OtpWrapper>
                                </div>
                            )}
                            {state.otpModes.includes('tfa') && (
                                <div className='mt-6'>
                                    <div className='font-medium text-sm '>
                                        {t('common:tfa_authentication')}
                                    </div>
                                    <div className='mt-0.5 text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary'>
                                        {t(
                                            'wallet:withdraw_prompt.google_description'
                                        )}
                                    </div>
                                    <OtpWrapper
                                        isDark={
                                            currentTheme === THEME_MODE.DARK
                                        }
                                    >
                                        <OtpInput
                                            value={state.otp?.tfa}
                                            onChange={(otp) =>
                                                handleOtp(state.otp, 'tfa', otp)
                                            }
                                            numInputs={6}
                                            placeholder='------'
                                            isInputNum
                                        />
                                    </OtpWrapper>
                                </div>
                            )}
                            {state.errors && (
                                <div className='mt-4 text-red text-xs lg:text-sm font-medium text-center'>
                                    {state.errors?.message}
                                </div>
                            )}
                        </div>
                    )}

                    {/*Catch Err*/}
                    {!isSuccess && state.errors?.status && (
                        <div className='w-full flex flex-col items-center justify-center'>
                            <img
                                src={getS3Url('/images/icon/errors.png')}
                                className='w-[65px] h-[65px]'
                                alt={`ERROR: ${state.errors?.status}`}
                            />
                            <div className='mt-5'>
                                <div className='text-center uppercase font-medium'>
                                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                        {t('common:error_code')}:
                                    </span>
                                    <span className='uppercase'>
                                        {state.errors?.status}
                                    </span>
                                </div>
                                <div className='mt-1'>
                                    {state.errors?.message}
                                </div>
                            </div>
                        </div>
                    )}

                    {/*Withdraw Success*/}
                    {isSuccess && !isErrors && (
                        <div className='w-full flex flex-col items-center justify-center'>
                            <img
                                src={getS3Url('/images/icon/success.png')}
                                className='w-[65px] h-[65px]'
                                alt='SUCCESS'
                            />
                            <div className='mt-5 text-sm text-center'>
                                <Trans>
                                    {t('wallet:withdraw_success_msg')}
                                </Trans>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className={
                        !isErrors && !isSuccess
                            ? 'mt-8 w-[300px] md:min-w-[410px] flex items-center justify-between'
                            : 'mt-8 w-[300px] md:min-w-[410px] flex items-center justify-center'
                    }
                >
                    <div
                        className='w-[48%] py-2 bg-gray-1 text-center rounded-lg text-sm text-dominant font-medium cursor-pointer hover:opacity-80'
                        onClick={onCancelWdlOrder}
                    >
                        {!isErrors && !isSuccess
                            ? t('common:cancel')
                            : t('common:close')}
                    </div>
                    {!isErrors && !isSuccess && (
                        <div
                            className='w-[48%] py-2 bg-dominant text-center rounded-lg text-sm text-white font-medium cursor-pointer hover:opacity-80'
                            onClick={() =>
                                withdraw(
                                    params,
                                    cleverProps,
                                    !!state.withdrawResult
                                )
                            }
                        >
                            {state.withdrawResult
                                ? t('common:confirm')
                                : t('common:continue')}
                        </div>
                    )}
                </div>
                {state.processingWithdraw && (
                    <div
                        style={{ backgroundColor: colors.overlayLight }}
                        className='absolute z-10 w-full h-full left-0 top-0 rounded-xl flex items-center justify-center select-none pointer-event-none'
                    >
                        <ScaleThinLoader thin={2} height={20} />
                    </div>
                )}
            </Modal>
        )
    }, [
        currentTheme,
        state.openWithdrawConfirm,
        state.type,
        state.amount,
        state.address,
        state.memo,
        state.selectedAsset,
        state.selectedNetwork,
        state.withdrawFee,
        state.feeCurrency,
        state.processingWithdraw,
        state.withdrawResult,
        state.otpModes,
        state.otp,
        state.errors,
        resendTimeOut,
        assetConfig,
    ])

    const renderKycRequiredModal = useCallback(() => {
        const isVisible = auth?.vndc_user_id > 0 && auth.kyc_status !== 2

        return (
            <ReModal
                isVisible={isVisible}
                containerClassName='p-6 max-w-[400px]'
            >
                <div className='mb-4 font-bold text-lg text-center capitalize'>
                    {t('modal:notice')}
                </div>
                <div className='text-center px-4'>
                    {t('wallet:errors.invalid_kyc_status')}
                </div>
                <div className='mt-6 flex items-center justify-between'>
                    <div className='w-[47%]'>
                        <Button
                            componentType='button'
                            onClick={() => router?.back && router.back()}
                            title={t('common:back_to_home')}
                            className='!py-[8px]'
                        />
                    </div>
                    <div className='w-[47%]'>
                        <Button
                            title={t('common:view_manual')}
                            type='primary'
                            href='https://nami.io/tutorial-vi/huong-dan-xac-minh-tai-khoan-kyc-tren-nami-exchange/'
                            target='_blank'
                            className='!py-[8px]'
                        />
                    </div>
                </div>
            </ReModal>
        )
    }, [auth])

    // useDebounce(
    //     () => {
    //         if (
    //             userSocket &&
    //             state.selectedAsset?.assetId &&
    //             state.amount &&
    //             state.selectedNetwork?.network
    //         ) {
    //             getWithdrawFee(
    //                 state.selectedAsset.assetId,
    //                 +state.amount,
    //                 state.selectedNetwork.network
    //             )
    //         }
    //     },
    //     500,
    //     [userSocket, state.selectedAsset, state.amount, state.selectedNetwork]
    // )

    useAsync(async () => {
        const { data } = await Axios.get(API_GET_ASSET_CONFIG)
        if (data?.status === ApiStatus.SUCCESS) {
            setState({ assetConfigs: data?.data })
        }
    }, [])

    useEffect(() => {
        getWithdrawHistory(state.historyPage)
    }, [state.historyPage])

    useEffect(() => {
        let interval
        if (focused) {
            interval = setInterval(
                () => getWithdrawHistory(state.historyPage, true),
                30000
            )
        }
        return () => interval && clearInterval(interval)
    }, [focused, state.historyPage])

    useEffect(() => {
        if (auth) {
            const otpModes = []
            auth?.email && otpModes.push('email')
            auth?.isTfaEnabled && otpModes.push('tfa')
            otpModes.length && setState({ otpModes })
        }
    }, [auth])

    useEffect(() => {
        const asset = get(router?.query, 'asset', null)
        const type = get(router?.query, 'type', 'crypto')

        if (asset && typeof asset === 'string' && asset.length) {
            setState({ asset })
        } else {
            setState({ asset: DEFAULT_ASSET })
        }

        if (type && type === 'crypto') {
            setState({ type: TYPE.crypto })
        } else {
            setState({ type: TYPE.fiat })
        }
    }, [router])

    useEffect(() => {
        if (paymentConfigs && state.asset) {
            const selectedAsset = find(
                paymentConfigs,
                (o) => o?.assetCode === state.asset
            )
            const defaultNetwork =
                selectedAsset?.networkList?.find((o) => o.isDefault) ||
                selectedAsset?.networkList?.[0]
            selectedAsset && setState({ selectedAsset })
            defaultNetwork && setState({ selectedNetwork: defaultNetwork })
        }
    }, [state.asset, paymentConfigs])

    useEffect(() => {
        if (state.selectedAsset) {
            const networkList = []
            const {
                tokenType,
                allowWithdraw,
                network,
                displayNetwork,
                minWithdraw,
                maxWithdraw,
                assetDigit,
            } = state.selectedAsset
            if (allowWithdraw && allowWithdraw.length) {
                allowWithdraw.forEach((isAllow, index) =>
                    // isAllow
                    // &&
                    networkList.push({
                        allowWithdraw: isAllow,
                        assetDigit,
                        minWithdraw: minWithdraw[index],
                        maxWithdraw: maxWithdraw[index],
                        tokenType: tokenType[index],
                        tokenTypeIndex: index,
                        network: network[index],
                        displayNetwork: displayNetwork[index],
                    })
                )
            }
            setState({ networkList })
            if (networkList.length) {
                const index = networkList.findIndex(
                    (item) => item?.allowWithdraw
                )
                // console.log('namidev-DEBUG: Index ', index)
                index !== -1 &&
                    index !== undefined &&
                    setState({ selectedNetwork: networkList?.[index] })
            }
        }
    }, [state.selectedAsset])

    useEffect(() => {
        if (state.openList?.cryptoList) {
            cryptoListSearchRef?.current?.focus()
        }
    }, [state.openList])

    useEffect(() => {
        if (state.withdrawFee && paymentConfigs) {
            const cfg = paymentConfigs?.filter(
                (e) => e.assetId === state.withdrawFee?.currency
            )?.[0]
            cfg &&
                setState({
                    feeCurrency: {
                        assetCode: cfg?.assetCode,
                        assetDigit: assetConfig?.assetDigit,
                    },
                })
        }
    }, [state.withdrawFee, paymentConfigs, assetConfig])

    useEffect(() => {
        setState({
            validator: withdrawValidator(
                state.selectedAsset?.assetCode,
                +state.amount,
                countDecimals(+state.selectedNetwork?.withdrawIntegerMultiple),
                state.address,
                state.selectedNetwork?.addressRegex,
                state.memo,
                state.selectedNetwork?.memoRegex,
                state.selectedNetwork?.network,
                state.selectedNetwork?.tokenType,
                state.withdrawFee?.amount >= state.selectedNetwork?.withdrawMin
                    ? state.withdrawFee?.amount
                    : state.selectedNetwork?.withdrawMin,
                state.selectedNetwork?.withdrawMax?.value,
                assetBalance?.value - assetBalance?.locked_value,
                state.selectedNetwork?.withdrawEnable
            ),
        })
    }, [
        state.selectedAsset,
        state.amount,
        state.address,
        state.memo,
        state.selectedNetwork,
        state.withdrawFee,
        assetBalance,
    ])

    useEffect(() => {
        let interval
        if (resendTimeOut) {
            interval = setInterval(() => {
                setResendTimeOut((lastTimerCount) => {
                    if (lastTimerCount <= 1) {
                        clearInterval(interval)
                    }
                    return lastTimerCount - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [resendTimeOut])

    useEffect(() => {
        if (state.selectedNetwork) {
            setState({
                withdrawFee: {
                    amount: +state.selectedNetwork?.withdrawFee,
                    currency: assetConfig?.id,
                },
            })
        }
    }, [state.selectedNetwork])

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className='mal-container px-4'>
                    <div className='t-common mb-4'>
                        <span
                            className='max-w-[150px] flex items-center cursor-pointer rounded-lg hover:text-dominant'
                            onClick={() =>
                                router?.push(PATHS.WALLET.EXCHANGE.DEFAULT)
                            }
                        >
                            <span className='inline-flex items-center justify-center h-full mr-3 mt-0.5'>
                                <ChevronLeft size={24} />
                            </span>
                            {t('common:withdraw')}
                        </span>
                    </div>
                    {renderTab()}
                    <MCard addClass='pt-8 pb-10'>
                        <div className='flex justify-center'>
                            <div className='w-full sm:w-[400px] lg:w-[453px]'>
                                {state.type === TYPE.fiat &&
                                    renderWithdrawFiat()}
                                {state.type === TYPE.crypto && (
                                    <>
                                        <div className='relative'>
                                            <div className='mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark'>
                                                {t('wallet:crypto_select')}
                                            </div>
                                            <div
                                                className='min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'
                                                onClick={() =>
                                                    setState({
                                                        openList: {
                                                            cryptoList:
                                                                !state.openList
                                                                    ?.cryptoList,
                                                        },
                                                    })
                                                }
                                            >
                                                {renderWithdrawInput()}
                                            </div>
                                            {state.openList?.cryptoList &&
                                                renderCryptoList()}
                                        </div>
                                        <div className='relative mt-5'>
                                            <div className='mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark'>
                                                {t('wallet:network')}
                                                <span>
                                                    {state.validator
                                                        ?.allowWithdraw && (
                                                        <Check
                                                            size={16}
                                                            className='text-dominant'
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            <div
                                                className='min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'
                                                onClick={() =>
                                                    setState({
                                                        openList: {
                                                            networkList:
                                                                !state.openList
                                                                    ?.networkList,
                                                        },
                                                    })
                                                }
                                            >
                                                {renderNetworkInput()}
                                            </div>
                                            {renderInputIssues('allowWithdraw')}
                                            {state.openList?.networkList &&
                                                renderNetworkList()}
                                        </div>
                                        <div className='relative mt-5'>
                                            <div className='mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark'>
                                                {t('wallet:receive_address')}
                                                <span>
                                                    {state.validator
                                                        ?.address === true && (
                                                        <Check
                                                            size={16}
                                                            className='text-dominant'
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            {renderAddressInput()}
                                            {renderInputIssues('address')}
                                        </div>
                                        {renderMemoInput()}
                                        <div className='relative mt-5'>
                                            <div className='mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark'>
                                                {t('common:amount')}
                                                <span>
                                                    {state.validator?.amount ===
                                                        AMOUNT.OK && (
                                                        <Check
                                                            size={16}
                                                            className='text-dominant'
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                            {renderAmountInput()}
                                            {renderInputIssues('amount')}
                                        </div>
                                        <div className='mt-4'>
                                            {renderAssetAvailable()}
                                            {renderWdlFee()}
                                            {renderMinWdl()}
                                            {renderMaxWdl()}
                                            {renderActualReceive()}
                                        </div>
                                        {renderWdlButton()}
                                    </>
                                )}
                            </div>
                        </div>
                    </MCard>
                    <div className='t-common mt-11'>
                        {t('wallet:withdraw_history')}
                    </div>
                    <MCard addClass='mt-8 py-0 px-0 overflow-hidden'>
                        {renderWithdrawHistory()}
                    </MCard>
                    {renderPagination()}
                </div>
                {renderWdlConfirm()}
                {renderKycRequiredModal()}
            </Background>
        </MaldivesLayout>
    )
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-10' })`
    background-color: ${({ isDark }) =>
        isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const OtpWrapper = styled.div.attrs({ className: 'mt-4' })`
    > div {
        width: 100%;
        justify-content: space-between;

        div {
            width: 33px;
            height: 30px;
            background-color: ${({ isDark }) =>
                isDark ? colors.darkBlue4 : colors.lightTeal};
            justify-content: center;
            border-radius: 6px;

            input {
                font-weight: 500;
                font-size: 14px;
            }

            @media (min-width: 768px) {
                width: 53px;
                height: 50px;
                input {
                    font-size: 24px;
                }
            }
        }
    }
`

const IGNORE_TOKEN = [
    'XBT_PENDING',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_SPONSOR',
    'SPIN_BONUS',
    'SPIN_CONQUEST',
    'TURN_CHRISTMAS_2017',
    'SPIN_CLONE',
]

const MEMO_INPUT = ['BinanceChain', 'VITE_CHAIN']

const AMOUNT = {
    LESS_THAN_MIN: 0,
    OVER_THAN_MAX: 1,
    OVER_BALANCE: 2,
    OVER_DECIMAL_SCALE: 3,
    OK: 'ok',
}

function dataHandler(data, loading, configList, utils) {
    if (loading) {
        const skeleton = []
        for (let i = 0; i < HISTORY_SIZE; ++i) {
            skeleton.push({
                ...ROW_LOADING_SKELETON,
                key: `wdl__skeletor___${i}`,
            })
        }
        return skeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    const result = []

    data.forEach((h) => {
        const {
            _id,
            executeAt,
            assetId,
            amount,
            status,
            network,
            to: { address },
            txId,
            txIdUrl,
        } = h
        const txhash = txId

        let txhashInner = (
            <span className='!text-sm whitespace-nowrap'>
                {txhash ? shortHashAddress(txhash, 6, 6) : '--'}
            </span>
        )
        const value = txhash || address
        const url = txIdUrl

        if (url) {
            txhashInner = (
                <a
                    href={url}
                    target='_blank'
                    className='!text-sm whitespace-nowrap cursor-pointer hover:text-dominant hover:!underline'
                >
                    {txhash ? shortHashAddress(txhash, 6, 6) : '--'}
                </a>
            )
        }

        let statusInner
        switch (status) {
            case DepWdlStatus.Success:
                statusInner = (
                    <span className='text-green'>
                        {utils?.t('common:success')}
                    </span>
                )
                break
            // case WithdrawalStatus.WAITING_FOR_CONFIRMATIONS:
            // case WithdrawalStatus.WAITING_FOR_BALANCE:
            case DepWdlStatus.Pending:
                statusInner = (
                    <span className='text-yellow'>
                        {utils?.t('common:pending')}
                    </span>
                )
                break
            case DepWdlStatus.Declined:
                statusInner = (
                    <span className='text-red'>
                        {utils?.t('common:declined')}
                    </span>
                )
                break
            default:
                statusInner = '--'
                break
        }

        result.push({
            key: `wdl_${_id}_${txhash}`,
            id: <span className='!text-sm whitespace-nowrap'>{_id}</span>,
            asset: (
                <div className='flex items-center'>
                    <AssetLogo assetId={assetId} size={24} />
                    <span className='!text-sm whitespace-nowrap ml-2.5'>
                        <AssetName assetId={assetId} />
                    </span>
                </div>
            ),
            amount: (
                <span className='!text-sm whitespace-nowrap'>
                    {formatNumber(amount, 4, 2)}
                </span>
            ),
            network: (
                <span className='!text-sm whitespace-nowrap'>{network}</span>
            ),
            withdraw_to: (
                <span className='!text-sm whitespace-nowrap'>
                    {shortHashAddress(address, 5, 5)}
                </span>
            ),
            txhash: txhashInner,
            time: (
                <span className='!text-sm whitespace-nowrap'>
                    {formatTime(executeAt, 'HH:mm dd-MM-yyyy')}
                </span>
            ),
            status: (
                <span className='!text-sm whitespace-nowrap'>
                    {statusInner}
                </span>
            ),
        })
    })

    return result
}

const getAssetName = (assetList, assetId) => {
    if (!Array.isArray(assetList) || !assetId) return
    const _ = assetList.filter((e) => e.assetId === assetId)?.[0]
    return _?.assetCode
}

const ROW_LOADING_SKELETON = {
    id: <Skeletor width={65} />,
    asset: <Skeletor width={65} />,
    amount: <Skeletor width={65} />,
    network: <Skeletor width={65} />,
    withdraw_to: <Skeletor width={65} />,
    txId: <Skeletor width={65} />,
    time: <Skeletor width={65} />,
    status: <Skeletor width={65} />,
}

function withdrawValidator(
    asset,
    amount,
    decimalLimit,
    address,
    addressRegex,
    memo = undefined,
    memoRegex,
    network,
    networkType,
    min,
    max,
    available,
    isAllow
) {
    const result = {}
    const _addressRegex = new RegExp(addressRegex)
    const _memoRegex = new RegExp(memoRegex)
    const useMemo = memo && !!memoRegex

    let memoType

    if (network === TokenConfig.Network.BINANCE_CHAIN) memoType = 'BEP2MEMO'
    if (network === TokenConfig.Network.VITE_CHAIN) memoType = 'VITEMEMO'

    if (asset) {
        result.asset = !!(typeof asset === 'string' && asset.length)
    }

    if (_addressRegex.test(address)) {
        result.address = true
    } else {
        result.address = false
    }

    if (memo !== undefined) {
        if (memo && _memoRegex.test(memo)) {
            result.memo = true
        } else {
            result.memo = false
        }
    }

    if (isAllow !== undefined) {
        result.allowWithdraw = isAllow
    }

    if (amount && typeof +amount === 'number') {
        if (isNumber(+min) && (amount < min || +amount === 0 || !+amount)) {
            result.amount = AMOUNT.LESS_THAN_MIN
        } else if (typeof max === 'number' && amount > max) {
            result.amount = AMOUNT.OVER_THAN_MAX
        } else if (isNumber(+available) && amount > available) {
            result.amount = AMOUNT.OVER_BALANCE
        } else if (decimalLimit && countDecimals(+amount) > +decimalLimit) {
            result.amount = AMOUNT.OVER_DECIMAL_SCALE
        } else {
            result.amount = AMOUNT.OK
        }
    }

    let isValid

    if (useMemo) {
        isValid =
            result.address &&
            result.asset &&
            result?.amount === AMOUNT.OK &&
            result.allowWithdraw &&
            result.memo
    } else {
        isValid =
            result.address &&
            result.asset &&
            result?.amount === AMOUNT.OK &&
            result.allowWithdraw
    }

    if (isValid) {
        result.allPass = true
    }

    // console.log('Validated...', result)
    return result
}

function otpHandler(otpArr, otp) {
    if (!otpArr?.length || (otp && !Object.keys(otp)?.length)) return undefined

    if (otpArr.length === Object.keys(otp)?.length) {
        return otp
    } else {
        return undefined
    }
}

const withdrawLinkBuilder = (type, asset) => {
    switch (type) {
        case TYPE.crypto:
            return `${PATHS.WALLET.EXCHANGE.WITHDRAW}?type=crypto&asset=${asset}`
        case TYPE.fiat:
            return `${PATHS.WALLET.EXCHANGE.WITHDRAW}?type=fiat&asset=${asset}`
        default:
            return `${PATHS.WALLET.EXCHANGE.WITHDRAW}?type=crypto`
    }
}

const getTokenType = (tokenType) => {
    switch (tokenType) {
        case 'KARDIA_CHAIN_NATIVE':
            return 'KRC20'
        default:
            return tokenType
    }
}

export default ExchangeWithdraw
