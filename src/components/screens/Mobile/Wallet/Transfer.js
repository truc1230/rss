import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import NumberFormat from 'react-number-format';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { X } from 'react-feather';
import React, { useCallback, useContext, useEffect, useMemo, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { WalletType } from 'redux/actions/const';
import { isNumeric } from 'utils';
import axios from 'axios';
import { POST_WALLET_TRANSFER } from 'redux/actions/apis';
import { getUserFuturesBalance, getWallet } from 'redux/actions/user';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { WalletCurrency } from 'components/screens/OnusWithdrawGate/helper';
import { reduce } from 'lodash/collection';
import { isNil, union } from 'lodash';
import SelectWalletType from 'components/screens/Mobile/Wallet/SelectWalletType';
import SliderAmount from 'components/screens/Mobile/Wallet/SliderAmount';
import { WalletTypeV1 } from 'components/wallet/TransferModal';
import { format } from 'date-fns';
import classNames from 'classnames';
import { PulseLoader } from 'react-spinners';
import colors from 'styles/colors';

const MIN_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 300e3,
    [WalletCurrency.USDT]: 15,
    [WalletCurrency.ONUS]: 0.1,
    [WalletCurrency.KAI]: 200,
    [WalletCurrency.NAC]: 1000,
    [WalletCurrency.ATS]: 125,
    [WalletCurrency.WHC]: 0.1,
    [WalletCurrency.SFO]: 2e5,
}
const MAX_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 500e6,
    [WalletCurrency.USDT]: 20000,
    [WalletCurrency.ONUS]: 5000,
    [WalletCurrency.KAI]: 10000,
    [WalletCurrency.NAC]: 100000,
    [WalletCurrency.ATS]: 100000,
    [WalletCurrency.WHC]: 100000,
    [WalletCurrency.SFO]: 100e6,
}
const VNDC_WITHDRAWAL_FEE = {
    [WalletCurrency.VNDC]: 1e3,
    [WalletCurrency.USDT]: 0,
    [WalletCurrency.ONUS]: 0.1,
    [WalletCurrency.KAI]: 1,
    [WalletCurrency.NAC]: 1,
    [WalletCurrency.ATS]: 1,
    [WalletCurrency.WHC]: 0.1,
    [WalletCurrency.SFO]: 2e3,
}

const DECIMAL_SCALES = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.USDT]: 8,
    [WalletCurrency.ONUS]: 1,
    [WalletCurrency.KAI]: 1,
    [WalletCurrency.NAC]: 2,
    [WalletCurrency.ATS]: 2,
    [WalletCurrency.WHC]: 2,
    [WalletCurrency.SFO]: 8,
}

const walletConfigs = {
    // [`${WalletType.SPOT}_${WalletType.ONUS}`]: [
    //     'NAMI',
    //     'USDT',
    //     'VNDC',
    //     'KAI',
    //     'ONUS',
    //     'ATS',
    //     'WHC',
    // ],
    [`${WalletType.SPOT}_${WalletType.FUTURES}`]: ['NAMI', 'USDT', 'VNDC'],
    [`${WalletType.FUTURES}_${WalletType.SPOT}`]: ['NAMI', 'USDT', 'VNDC'],
    // [`${WalletType.FUTURES}_${WalletType.ONUS}`]: ['NAMI', 'USDT', 'VNDC'],
}

const allFromWallet = [WalletType.SPOT, WalletType.FUTURES]
const allToWallet = [WalletType.SPOT, WalletType.FUTURES]

const TransferWalletResult = {
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_WALLET_TYPE: 'INVALID_WALLET_TYPE',
    INVALID_CURRENCY: 'INVALID_CURRENCY',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

function getWalletsAllowedAsset(asset) {
    return reduce(
        walletConfigs,
        (acm, assets, key) => {
            if (assets.includes(asset)) {
                const [from, to] = key.split('_')
                acm.fromWallets = union(acm.fromWallets, [from])
                acm.toWallets = union(acm.toWallets, [to])
            }
            return acm
        },
        {fromWallets: [], toWallets: []}
    )
}

const formatAvl = (value, decimal) => {
    if (+value < 0 || Math.abs(+value) < 1e-8 || isNil(value) || !value)
        return '0'
    return formatNumber(value, decimal, 0, true)
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

export default function Transfer() {
    const allExchangeWallet = useSelector((state) => state.wallet?.SPOT) || []
    const allFuturesWallet = useSelector((state) => state.wallet?.FUTURES) || []
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || []

    const router = useRouter()
    const {asset} = router.query
    const {
        t,
        i18n: {language},
    } = useTranslation(['common', 'wallet', 'error'])
    const dispatch = useDispatch()
    const alertContext = useContext(AlertContext)

    const [fromWallet, setFromWallet] = useState(WalletType.SPOT)
    const [toWallet, setToWallet] = useState(WalletType.FUTURES)
    const [amount, setAmount] = useState()
    const [visibleSuccessModel, setVisibleSuccessModel] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const {
        currentWallet = {},
        assetConfig = {},
        fee = 0,
        min = 0,
        max = 0,
    } = useMemo(() => {
        const assetConfig = assetConfigs.find((a) => a.assetCode === asset)
        if (!assetConfig) return {}
        const allWallets =
            fromWallet === WalletType.FUTURES
                ? allFuturesWallet
                : allExchangeWallet
        const currentWallet = allWallets[assetConfig?.id] || {}
        Object.assign(currentWallet, {
            available: currentWallet.value - currentWallet.locked_value,
        })

        const fee = VNDC_WITHDRAWAL_FEE[assetConfig.id]
        const min = MIN_WITHDRAWAL[assetConfig.id] + fee
        const max = MAX_WITHDRAWAL[assetConfig.id]

        return {currentWallet, assetConfig, fee, min, max}
    }, [assetConfigs, allExchangeWallet, allFuturesWallet, fromWallet, asset])

    const walletTypeOptionLabels = {
        [WalletType.SPOT]: t('wallet:mobile:spot'),
        [WalletType.FUTURES]: t('wallet:mobile:futures'),
        [WalletType.ONUS]: t('wallet:mobile:onus'),
    }

    const {walletFromOptions, walletToOptions} = useMemo(() => {
        const {fromWallets = [], toWallets = []} =
            getWalletsAllowedAsset(asset)
        return {
            walletFromOptions: allFromWallet.map((o) => ({
                value: o,
                label: walletTypeOptionLabels[o],
                disabled: !fromWallets.includes(o),
            })),
            walletToOptions: allToWallet.map((o) => ({
                value: o,
                label: walletTypeOptionLabels[o],
                disabled: !toWallets.includes(o),
            })),
        }
    }, [asset])

    const error = useMemo(() => {
        if (walletToOptions.every((w) => w.disabled)) {
            return t('wallet:mobile:unsupported_asset')
        }

        if (!isNumeric(+amount) || !amount) return
        if (+amount < min) {
            return t('wallet:errors:minimum_amount', {
                min: formatNumber(min, DECIMAL_SCALES[assetConfig.id]),
            })
        }
        if (+amount > currentWallet.available) {
            return t('wallet:errors:invalid_insufficient_balance')
        }
        if (+amount > max) {
            return t('wallet:errors:maximum_amount', {
                max: formatNumber(max, DECIMAL_SCALES[assetConfig.id]),
            })
        }
    }, [amount, min, max, currentWallet.available, walletToOptions])

    const handleTransfer = useCallback(async () => {
        setIsPlacingOrder(true)
        const {data} = await axios.post(POST_WALLET_TRANSFER, {
            from_wallet: convertToWalletV1Type(fromWallet),
            to_wallet: convertToWalletV1Type(toWallet),
            currency: assetConfig.id,
            amount,
        })
        setIsPlacingOrder(false)

        if (data.status === 'ok') {
            setVisibleSuccessModel(true)
            dispatch(getWallet())
            dispatch(getUserFuturesBalance())
            return
        }
        // Process error
        let message = 'Error occur, please try again'
        switch (data.status) {
            case TransferWalletResult.INVALID_WALLET_TYPE: {
                message = t('error:INVALID_WALLET_TYPE')
                break
            }
            case TransferWalletResult.INVALID_AMOUNT: {
                message = t('error:INVALID_AMOUNT')
                break
            }
            case TransferWalletResult.INVALID_CURRENCY: {
                message = t('error:ASSET_NOT_SUPPORT', {
                    ['function']:
                        language === LANGUAGE_TAG.VI
                            ? `để Chuyển Ví`
                            : `for Transfer`,
                })
                break
            }
        }

        alertContext.alert.show('error', message)
    }, [fromWallet, toWallet, amount, asset, alertContext])

    const handleFillMaxAmount = useCallback(() => {
        setAmount(Math.min(currentWallet.available, max))
    }, [currentWallet.available, max])

    useEffect(() => {
        if (fromWallet === toWallet) {
        }
    }, [fromWallet, walletToOptions, walletFromOptions])

    useEffect(() => {
        if (toWallet === fromWallet) {
        }
    }, [fromWallet, walletToOptions, walletFromOptions])

    return (
        <>
            <div className='h-[calc(100vh-70px)]'>
                <div className='market-mobile px-4 py-6'>
                    <div className='flex items-center'>
                        <span className='mr-2 text-xl font-semibold'>
                            {t('wallet:transfer_asset', {asset})}
                        </span>
                        <AssetLogo size={30} assetCode={asset}/>
                    </div>
                    <div className='grid grid-cols-2 gap-4 my-4'>
                        <div>
                            <div className='mb-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('common:from')}
                            </div>
                            <SelectWalletType
                                options={walletFromOptions}
                                value={fromWallet}
                                onChange={(wallet) => {
                                    setFromWallet(wallet)
                                    setToWallet(walletToOptions.find(w => !w.disabled && w.value !== wallet)?.value)
                                }}
                            />
                        </div>
                        <div className=''>
                            <div className='mb-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('common:to')}
                            </div>
                            <SelectWalletType
                                options={walletToOptions}
                                value={toWallet}
                                onChange={(wallet) => {
                                    setToWallet(wallet)
                                    setFromWallet(walletFromOptions.find(w => !w.disabled && w.value !== wallet)?.value)
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-between items-start mb-2'>
                            <span className='text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium'>
                                {t('common:ext_gate:amount')}
                            </span>
                            {error && (
                                <span className='text-yellow text-xs font-medium italic text-right'>
                                    {error}
                                </span>
                            )}
                        </div>
                        <div className='flex bg-gray-5 dark:bg-darkBlue-3 rounded py-2 px-3'>
                            <NumberFormat
                                thousandSeparator
                                allowNegative={false}
                                className='outline-none text-xs font-medium flex-1'
                                placeholder={t(
                                    'wallet:mobile:input_amount_placeholder'
                                )}
                                value={amount}
                                onValueChange={({value}) => setAmount(value)}
                                decimalScale={DECIMAL_SCALES[assetConfig.id]}
                                min={min}
                                max={max}
                            />
                            <div className='flex items-center text-xs font-medium'>
                                <span
                                    className='text-teal'
                                    onClick={handleFillMaxAmount}
                                >
                                    {t('common:max')}
                                </span>
                                <div className='h-7 w-[1px] bg-gray-5 dark:bg-darkBlue-5 mx-2'/>
                                <span>{asset}</span>
                            </div>
                        </div>
                    </div>
                    <div className='my-5'>
                        <SliderAmount
                            value={(amount / currentWallet.available) * 100}
                            onChange={(v) => {
                                setAmount(formatNumber((v / 100) * currentWallet.available, DECIMAL_SCALES[assetConfig.id]))
                            }}
                        />
                    </div>
                    <div className='text-sm space-y-1'>
                        <div className='flex justify-between'>
                            <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('common:ext_gate:available')}
                            </span>
                            <span className='font-semibold'>
                                {formatAvl(
                                    currentWallet.available,
                                    DECIMAL_SCALES[assetConfig.id]
                                )}
                                &nbsp;{asset}
                            </span>
                        </div>
                        <div className='flex justify-between whitespace-nowrap'>
                            <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('wallet:mobile:fee')}
                            </span>
                            <span className='font-semibold whitespace-nowrap'>
                                {formatNumber(
                                    fee,
                                    DECIMAL_SCALES[assetConfig.id]
                                )}
                                &nbsp;{asset}
                            </span>
                        </div>
                    </div>
                    <div className='mt-auto grid grid-cols-2 gap-2'>
                        <Button
                            componentType='button'
                            className='!text-sm !font-semibold'
                            title={t('common:back')}
                            onClick={() => router.push('/mobile/wallet')}
                        />
                        <div
                            className={classNames(
                                'h-11 bg-teal rounded-md flex items-center justify-center font-semibold text-sm text-white',
                                {
                                    '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3':
                                        !fromWallet ||
                                        !toWallet ||
                                        !amount ||
                                        error,
                                }
                            )}
                            onClick={handleTransfer}
                        >
                            {isPlacingOrder ? (
                                <PulseLoader color={colors.white} size={3}/>
                            ) : (
                                t('wallet:mobile:btn_confirm_transfer')
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isVisible={visibleSuccessModel}
                containerClassName='px-6 py-8 !min-w-[18rem] !top-[50%]'
                noButton
            >
                <div className='absolute right-0 top-0 p-3'>
                    <X
                        size={16}
                        className='cursor-pointer hover:text-dominant'
                        onClick={() => setVisibleSuccessModel(false)}
                    />
                </div>
                <img
                    className='mx-auto'
                    src={getS3Url('/images/screen/wallet/coins_pana.png')}
                    width={150}
                    height={150}
                />
                <p className='text-center font-semibold text-lg mt-5'>
                    {t('wallet:mobile:transfer_asset_success', {asset})}
                </p>
                <div className='mt-7 mb-8 space-y-4'>
                    <div className='flex justify-between text-xs'>
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            {t('wallet:mobile:time')}
                        </span>
                        <span className='font-semibold'>
                            {format(Date.now(), 'yyyy-M-d hh:mm:ss')}
                        </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                        <span className='font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                            {t('wallet:mobile:amount')}
                        </span>
                        <span className='font-semibold'>
                            {formatNumber(
                                amount,
                                DECIMAL_SCALES[assetConfig.id]
                            )}
                            &nbsp;{asset}
                        </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                        <span
                            className='font-medium text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap mr-3'>
                            {t('wallet:mobile:transfer_from_to')}
                        </span>
                        <span className='font-semibold whitespace-nowrap'>
                            {walletTypeOptionLabels[fromWallet]}&nbsp;-&nbsp;
                            {walletTypeOptionLabels[toWallet]}
                        </span>
                    </div>
                </div>
                <Button
                    componentType='button'
                    title={t('common:cancel')}
                    onClick={() => setVisibleSuccessModel(false)}
                />
            </Modal>
        </>
    )
}
