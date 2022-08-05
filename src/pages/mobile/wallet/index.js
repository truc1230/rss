import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NoticePopup } from 'components/screens/OnusWithdrawGate/styledExternalWdl';
import { useSelector } from 'react-redux';
import { Key, X } from 'react-feather';

import { PulseLoader } from 'react-spinners';
import Axios from 'axios';
import axios from 'axios';
import { WalletCurrency, } from 'components/screens/OnusWithdrawGate/helper';
import { emitWebViewEvent, formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AssetLogo from 'components/wallet/AssetLogo';
import NumberFormat from 'react-number-format';

import 'react-input-range/lib/css/index.css';
import classNames from 'classnames';
import Div100vh from 'react-div-100vh';
import CheckSuccess from 'components/svg/CheckSuccess';
import { isNumeric } from 'utils';
import colors from 'styles/colors';
import Head from 'next/head';
import { API_FUTURES_CAMPAIGN_WITHDRAW_STATUS, DIRECT_WITHDRAW_ONUS } from 'redux/actions/apis';
import find from 'lodash/find';
import floor from 'lodash/floor';
import LayoutMobile, { AlertContext } from 'components/common/layouts/LayoutMobile';
import Divider from 'components/common/Divider';
import { ApiStatus } from 'redux/actions/const';
import SortIcon from 'components/screens/Mobile/SortIcon';

const ASSET_LIST = [WalletCurrency.VNDC, WalletCurrency.NAO, WalletCurrency.NAMI, WalletCurrency.ONUS, WalletCurrency.USDT];

const MIN_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 0,
    [WalletCurrency.NAO]: 0,
    [WalletCurrency.ONUS]: 0,
    [WalletCurrency.USDT]: 0,
};

const MAX_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 500e6,
    [WalletCurrency.NAMI]: 100000,
    [WalletCurrency.NAO]: 50000,
    [WalletCurrency.ONUS]: 50000,
    [WalletCurrency.USDT]: 5000,
};

const VNDC_WITHDRAWAL_FEE = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 0,
    [WalletCurrency.NAO]: 0,
    [WalletCurrency.ONUS]: 0,
    [WalletCurrency.USDT]: 0,
};

const DECIMAL_SCALES = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 1,
    [WalletCurrency.NAO]: 1,
    [WalletCurrency.ONUS]: 1,
    [WalletCurrency.USDT]: 2,
};

const WDL_STATUS = {
    UNKNOWN: 'UNKNOWN',
    MINIMUM_WITHDRAW_NOT_MET: 'MINIMUM_WITHDRAW_NOT_MET',
    LOGGED_OUT: 'LOGGED_OUT',
    INVALID_INPUT: 'INVALID_INPUT',
    NOT_ENOUGH_BASE_CURRENCY: 'NOT_ENOUGH_BASE_CURRENCY',
    NOT_ENOUGH_EXCHANGE_CURRENCY: 'NOT_ENOUGH_EXCHANGE_CURRENCY',
    not_in_range: 'not_in_range',
};

const MAINTAIN = true;

const WithdrawWrapper = () => {
    return <LayoutMobile>
        <ExternalWithdrawal/>
    </LayoutMobile>;
};

const ExternalWithdrawal = (props) => {
    // initial state
    const [currentCurr, setCurrentCurr] = useState(null);
    const [amount, setAmount] = useState('init');
    const [modal, setModal] = useState({
        isListAssetModal: false,
        isSuccessModal: false,
        isNotice: false,
    });
    const user = useSelector((state) => state.auth.user) || null;
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wdlResult, setWdlResult] = useState(null);
    const [error, setError] = useState(null);
    const [maxValue, setMaxValue] = useState(500e6);

    // map state from redux
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const futuresBalances = useSelector((state) => state.wallet.FUTURES) || {};

    const alertContext = useContext(AlertContext);

    // use hooks
    const { t } = useTranslation();
    const isDark = true;

    const assets = useMemo(() => {
        const _assets = [];

        ASSET_LIST.forEach(item => {
            const _config = find(assetConfigs, { id: item });
            if (_config) {
                const balance = futuresBalances[_config.id] || {
                    value: 0,
                    value_locked: 0,
                };
                _assets.push({
                    ..._config,
                    ...balance,
                    available: Math.max(balance?.value, 0) - Math.max(balance?.locked_value, 0),
                });
            }
        });

        return _assets;
    }, [assetConfigs, futuresBalances]);

    const getWithdrawstatusInfo = async (currency) => {
        const { data } = await axios.get(API_FUTURES_CAMPAIGN_WITHDRAW_STATUS, { params: { currency } });
        if (data?.status === ApiStatus.SUCCESS) {
            const {
                status,
                value
            } = data.data;
            if (status === 'limited') {
                setMaxValue(value);
            } else {
                setMaxValue(MAX_WITHDRAWAL[currency]);
            }
        }
    };
    useEffect(() => {
        setCurrentCurr(assets[0]);
    }, [assets]);

    useEffect(() => {
        if (currentCurr?.id && user) {
            // call get withdraw status
            getWithdrawstatusInfo(currentCurr.id);
        }
    }, [currentCurr]);

    useEffect(() => {
        setAmount('');
    }, [currentCurr]);

    const {
        min = 0,
        max = 0,
        fee = 0,
        decimalScale = 0,
    } = useMemo(() => {
        return {
            min: MIN_WITHDRAWAL[currentCurr?.id],
            max: (currentCurr?.id === WalletCurrency.VNDC || currentCurr?.id === WalletCurrency.USDT) ? Math.min(MAX_WITHDRAWAL[currentCurr?.id], maxValue) : MAX_WITHDRAWAL[currentCurr?.id],
            fee: VNDC_WITHDRAWAL_FEE[currentCurr?.id],
            decimalScale: DECIMAL_SCALES[currentCurr?.id],
        };
    }, [currentCurr, maxValue]);

    // helper
    const handleModal = (key, value = null) =>
        setModal({
            ...modal,
            [key]: value
        });

    const onAllDone = () => {
        setModal({ isSuccessModal: false });
        setAmount('');
        // setWdlResult(null);
        setError(null);
    };

    const onWdl = async (amount, currency, balance) => {
        // console.log('namidev-DEBUG: RE-CHECK__ ', amount, currency)

        try {
            setIsSubmitting(true);
            setError(null);
            const { data } = await Axios.post(DIRECT_WITHDRAW_ONUS, {
                amount,
                currency,
            });
            // let data = {status: 'ok', message: 'PHA_KE_DATA', data: {currency: 72, amount: 40000, amountLeft: 32000}}
            if (data && data.status === 'ok') {
                const res = (data.hasOwnProperty('data') && data.data) || {};
                alertContext.alert.show('success',
                    t('common:success'),
                    t('ext_gate:wdl_success', {
                        amount: res?.amount || '--',
                        assetCode: find(assetConfigs, { id: res?.currency })?.assetCode || '--',
                    }));
            } else {
                const status = data ? data.status : WDL_STATUS.UNKNOWN;
                switch (status) {
                    case WDL_STATUS.MINIMUM_WITHDRAW_NOT_MET:
                        setError(t('ext_gate:err.min_wdl_not_met'));
                        break;
                    case WDL_STATUS.INVALID_INPUT:
                        setError(t('ext_gate:err.invalid_input'));
                        break;
                    case WDL_STATUS.LOGGED_OUT:
                        setError(t('ext_gate:err.logged_out'));
                        break;
                    case WDL_STATUS.NOT_ENOUGH_BASE_CURRENCY:
                    case WDL_STATUS.NOT_ENOUGH_EXCHANGE_CURRENCY:
                        setError(t('ext_gate:err.insufficient'));
                        break;
                    case WDL_STATUS.not_in_range:
                        setError(t('ext_gate:err.not_in_range'));
                        break;
                    default:
                        setError(t('ext_gate:err.unknown'));
                        break;
                }
            }
        } catch (e) {
            console.log('Notice: ', e);
        } finally {
            setIsSubmitting(false);
            setAmount('');
        }
    };

    const errorMessage = useMemo(() => {
        if (!isNumeric(+amount) || !amount) return;
        if (+amount < min) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:min_notice')}:
                    </span>
                    <span>
                        {formatNumber(min, decimalScale)}{' '}
                        {currentCurr?.assetCode}
                    </span>
                </div>
            );
        }
        if (+amount > currentCurr?.available) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:insufficient')}
                    </span>
                </div>
            );
        }
        if (+amount > max) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:max_notice')}
                    </span>
                    <span>
                        {formatNumber(max, decimalScale)}{' '}
                        {currentCurr?.assetCode}
                    </span>
                </div>
            );
        }
    }, [min, max, decimalScale, amount, currentCurr]);

    const isDisableBtn = !+amount || !!errorMessage;

    const amountLeft = wdlResult?.amountLeft || 0;
    const wdlAmount = wdlResult?.amount || 0;
    const wdlCurrency = wdlResult?.currency || 0;
    return (
        <>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <Div100vh className="px-4 py-6 flex flex-col bg-[#1B222D]">
                <div className="flex-1 text-onus font-medium text-sm">
                    <div className="flex items-center px-4 bg-onus-2 rounded-md h-11 mb-6">
                        <AssetLogo assetCode="ONUS" size={28}/>
                        <span className="ml-1">
                            {t('ext_gate:onus_wallet')}
                        </span>
                    </div>

                    <span className="text-onus-secondary text-xs uppercase">
                        {t('ext_gate:asset')}
                    </span>
                    <div
                        className="flex justify-between items-center px-4 bg-onus-2 rounded-md h-11 mb-6 mt-2"
                        onClick={() => handleModal('isListAssetModal', true)}
                    >
                        <div className="flex items-center font-medium">
                            <AssetLogo
                                size={28}
                                assetCode={currentCurr?.assetCode}
                            />
                            <span className="ml-1">
                                {currentCurr?.assetName}
                            </span>
                        </div>
                        <SortIcon size={14}/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-onus-secondary text-xs uppercase">
                            {t('ext_gate:amount')}
                        </span>
                        {errorMessage}
                    </div>
                    <div className="flex justify-between items-center pl-4 bg-onus-2 rounded-md h-11 mb-2 mt-2">
                        <NumberFormat
                            thousandSeparator
                            allowNegative={false}
                            className="outline-none text-sm font-medium flex-1 py-2"
                            value={amount}
                            onValueChange={({ value }) => setAmount(value)}
                            decimalScale={decimalScale}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                        <div
                            className="flex items-center"
                            onClick={() => {
                                setAmount(floor(Math.min(currentCurr?.available || 0, max), decimalScale));
                            }}
                        >
                            <span className="px-4 py-2 text-onus-base font-semibold">
                                {t('ext_gate:max_opt')}
                            </span>
                            <div
                                className="h-full leading-[2.75rem] bg-onus-1 w-16 text-onus-grey rounded-r-md text-center">
                                {currentCurr?.assetCode}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs mb-6">
                        <span className="text-onus-grey mr-1">
                            {t('ext_gate:available')}:
                        </span>
                        <span>
                            {formatNumber(currentCurr?.available, decimalScale)}{' '}
                            {currentCurr?.assetCode}
                        </span>
                    </div>

                    <span className="text-onus-secondary text-xs uppercase">
                        {t('ext_gate:trans_fee')}
                    </span>
                    <div className="flex justify-between items-center pl-4 bg-onus-2 rounded-md h-11 mb-6 mt-2">
                        <span>{fee > 0 ? formatNumber(fee, decimalScale) : t('common:free')}</span>
                        <div
                            className="h-full leading-[2.75rem] bg-onus-1 w-16 text-onus-grey rounded-r-md text-center">
                            {currentCurr?.assetCode}
                        </div>
                    </div>
                </div>
                <div className="text-center mb-2">
                    {error && <span className="text-sm text-onus-red">{error}</span>}
                </div>
                <div
                    className={classNames(
                        'bg-[#0068FF] h-12 w-full rounded-md text-center leading-[3rem] text-onus font-semibold',
                        {
                            '!bg-darkBlue-4 text-onus-grey': isDisableBtn
                        }
                    )}
                    onClick={() => !isDisableBtn && onWdl(+amount, currentCurr?.id)}
                >
                    {isSubmitting ? (
                        <PulseLoader color={colors.white} size={3}/>
                    ) : (
                        t('ext_gate:wdl_btn')
                    )}
                </div>
            </Div100vh>

            <Div100vh
                className={classNames(
                    'fixed top-0 left-0 right-0 z-30 p-6 bg-onus text-onus',
                    'translate-y-full transition-transform duration-500',
                    {
                        'translate-y-0': modal.isListAssetModal,
                    }
                )}
            >
                <div className="relative w-full flex justify-center items-center mb-12">
                    <span className="font-semibold">{t('ext_gate:choose_asset')}</span>
                    <div
                        className="absolute top-0 right-0 p-1 cursor-pointer"
                        onClick={() => handleModal('isListAssetModal', false)}
                    >
                        <X size={16}/>
                    </div>
                </div>
                {assets.map((a, i) => {
                    return (
                        <div key={a.id} className="">
                            {i !== 0 && <Divider/>}
                            <div
                                className="flex justify-between items-center my-4"
                                onClick={() => {
                                    handleModal('isListAssetModal', false);
                                    setCurrentCurr(a);
                                }}
                            >
                                <div className="flex items-center">
                                    <AssetLogo size={40} assetCode={a.assetCode}/>
                                    <div className="ml-3">
                                        <div className="font-bold">
                                            {a.assetCode}
                                        </div>
                                        <div className="text-onus-grey text-sm">
                                            {a.assetName}
                                        </div>
                                    </div>
                                </div>
                                {a.id === currentCurr?.id && (
                                    <CheckSuccess size={24}/>
                                )}
                            </div>
                        </div>
                    );
                })}
            </Div100vh>

            {/*<Modal*/}
            {/*    isVisible={modal.isSuccessModal}*/}
            {/*    containerClassName="px-6 py-8 !min-w-[18rem] !top-[50%]"*/}
            {/*>*/}
            {/*    <div className="absolute right-0 top-0 p-3">*/}
            {/*        <X*/}
            {/*            size={16}*/}
            {/*            className="cursor-pointer hover:text-dominant"*/}
            {/*            onClick={onAllDone}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <img*/}
            {/*        className="mx-auto"*/}
            {/*        src={getS3Url(isDark*/}
            {/*            ? '/images/screen/wallet/coins_pana_dark.png'*/}
            {/*            : '/images/screen/wallet/coins_pana.png'*/}
            {/*        )}*/}
            {/*        width={150}*/}
            {/*        height={150}*/}
            {/*    />*/}
            {/*    <p className="text-center font-semibold text-lg mt-5">*/}
            {/*        {t('wallet:mobile:transfer_asset_success', {})}*/}
            {/*    </p>*/}
            {/*    <p className="text-center text-sm text-onus-grey">*/}
            {/*        {t('wallet:mobile:tips')}*/}
            {/*    </p>*/}
            {/*    <div className="mt-7 mb-8 space-y-4">*/}
            {/*        <div className="flex justify-between text-xs">*/}
            {/*            <span className="font-medium text-onus-grey">*/}
            {/*                {t('wallet:mobile:time')}*/}
            {/*            </span>*/}
            {/*            <span className="font-semibold">*/}
            {/*                {format(Date.now(), 'yyyy-MM-dd hh:mm:ss')}*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*        <div className="flex justify-between text-xs">*/}
            {/*            <span className="font-medium text-onus-grey">*/}
            {/*                {t('wallet:mobile:amount')}*/}
            {/*            </span>*/}
            {/*            <span className="font-semibold">*/}
            {/*                {formatNumber(+wdlAmount, decimalScale)}&nbsp;*/}
            {/*                <AssetName assetId={wdlCurrency}/>*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*        <div className="flex justify-between text-xs">*/}
            {/*            <span*/}
            {/*                className="font-medium text-onus-grey whitespace-nowrap mr-3">*/}
            {/*                {t('wallet:mobile:transfer_from_to')}*/}
            {/*            </span>*/}
            {/*            <span className="font-semibold whitespace-nowrap">*/}
            {/*                {t('ext_gate:nami_futures_wallet')}*/}
            {/*                &nbsp;-&nbsp;*/}
            {/*                {t('ext_gate:onus_wallet')}*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <Button*/}
            {/*        componentType="button"*/}
            {/*        title={t('common:cancel')}*/}
            {/*        onClick={() => handleModal('isSuccessModal', false)}*/}
            {/*    />*/}
            {/*</Modal>*/}

            <NoticePopup active={modal.isNotice} isDark={isDark}>
                <div className="NoticePopup__Header">{t('modal:notice')}</div>
                <div className="NoticePopup__Content">
                    <Key size={24} color="#03BBCC"/>
                    {t('common:sign_in_to_continue')}
                    <a href="#" onClick={() => emitWebViewEvent('login')}>
                        {t('common:sign_in')}
                    </a>
                </div>
            </NoticePopup>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'modal',
            'ext_gate',
            'wallet',
        ])),
    },
});

export default WithdrawWrapper;
