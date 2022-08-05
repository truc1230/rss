import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatTime, formatWallet, shortHashAddress, } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Check, ChevronLeft, ChevronRight, Copy, Search, Slash, X, } from 'react-feather';
import { API_GET_DEPWDL_HISTORY, API_PUSH_ORDER_BINANCE, API_REVEAL_DEPOSIT_TOKEN_ADDRESS, } from 'redux/actions/apis';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ApiStatus, DepWdlStatus } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { PATHS } from 'constants/paths';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useOutsideClick from 'hooks/useOutsideClick';
import useWindowFocus from 'hooks/useWindowFocus';
import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ChevronDown from 'components/svg/ChevronDown';
import AssetLogo from 'components/wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import QRCode from 'qrcode.react';
import MCard from 'components/common/MCard';
import Empty from 'components/common/Empty';
import Link from 'next/link';

import styled from 'styled-components';
import colors from 'styles/colors';
import Axios from 'axios';
import ReTable from 'components/common/ReTable';
import Modal from 'components/common/ReModal';
import Tooltip from 'components/common/Tooltip';
import Button from 'components/common/Button';
import AssetName from 'components/wallet/AssetName';

const INITIAL_STATE = {
    type: 1, // 0. fiat, 1. crypto
    loadingConfigs: false,
    configs: null,
    selectedAsset: null,
    selectedNetwork: null,
    networkList: null,
    openList: {},
    search: '',
    address: '',
    loadingAddress: false,
    memo: '',
    errors: {},
    isCopying: {},
    histories: null,
    loadingHistory: false,
    historyLastId: undefined,
    historyPage: 0,
    blockConfirm: {},
    openModal: {},
    pushingOrder: false,
    pushedOrder: null,

    // Add new state here
};

const TYPE = {
    fiat: 0,
    crypto: 1,
};

const ExchangeDeposit = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const cryptoListRef = useRef();
    const cryptoListSearchRef = useRef();
    const networkListRef = useRef();

    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs);
    // const socket = useSelector((state) => state.socket.userSocket)

    // Use Hooks
    const router = useRouter();
    const focused = useWindowFocus();
    const [currentTheme] = useDarkMode();
    const {
        t,
        i18n: { language },
    } = useTranslation(['modal']);
    const { width } = useWindowSize();

    useOutsideClick(
        cryptoListRef,
        () => state.openList?.cryptoList && setState({ openList: {} })
    );
    useOutsideClick(
        networkListRef,
        () => state.openList?.networkList && setState({ openList: {} })
    );

    const qrSize = useMemo(() => {
        let _ = 110;

        if (state.address?.memo) {
            if (width >= 768) _ = 120;
            if (width >= 1280) _ = 140;
        } else {
            if (width >= 768) _ = 160;
        }

        return _;
    }, [state.address?.memo, width]);

    // Helper
    const getDepositTokenAddress = async (shouldCreate, assetId, network) => {
        if (!assetId || !network) {
            return;
        }

        setState({
            address: '',
            loadingAddress: true
        });
        try {
            const { data } = await Axios.get(API_REVEAL_DEPOSIT_TOKEN_ADDRESS, {
                params: {
                    assetId,
                    network,
                    shouldCreate,
                },
            });
            if (data && data?.status === 'ok') {
                // setState({ address: {...data.data, memo: 'abcxyszmemo34723'} })
                setState({ address: data.data });
            }
            if (data?.status === 'error') {
                setState({
                    errors: {
                        ...state.errors,
                        addressNotFound: true
                    }
                });
            }
        } catch (e) {
            console.log('Address not exist!');
        } finally {
            setState({ loadingAddress: false });
        }
    };

    const getDepositHistory = async (page, isReNew = false) => {
        !isReNew && setState({ loadingHistory: true });

        try {
            const { data } = await Axios.get(API_GET_DEPWDL_HISTORY, {
                params: {
                    type: 1,
                    lastId: undefined,
                    page,
                    pageSize: HISTORY_SIZE,
                },
            });

            if (data?.status === ApiStatus.SUCCESS) {
                setState({ histories: data?.data });
            }
        } catch (e) {
            console.log(`Can't get deposit history `, e);
        } finally {
            setState({ loadingHistory: false });
        }
    };

    const onChangeAsset = () => {
        setState({
            search: '',
            openList: {},
            errors: {},
            address: '',
            selectedNetwork: null,
        });
    };

    const onSearchClear = () => {
        setState({ search: '' });
        cryptoListSearchRef?.current?.focus();
    };

    const onCopy = (key) => {
        setState({ isCopying: { [key]: true } });
        try {
            setTimeout(() => setState({ isCopying: { [key]: false } }), 1000);
        } catch (err) {
        }
    };

    const onPushOrder = async (currency) => {
        if (!currency) return;
        setState({ pushingOrder: true });

        try {
            const { data } = await Axios.post(API_PUSH_ORDER_BINANCE, {
                currency,
            });
            if (data?.status === 'ok') {
                setState({
                    pushedOrder: 'ok',
                    pushingOrder: 1
                });
            } else {
                setState({
                    pushedOrder: 'failure',
                    pushingOrder: false
                });
            }
            // console.log('namidev-DEBUG: => ', data)
        } catch (e) {
            console.log(`Can't push order yet `, e);
        }
    };

    const closeModal = () => setState({ openModal: {} });

    // Render Handler
    const renderTab = useCallback(() => {
        return (
            <div className="mt-5 ml-4 flex items-end">
                {/*<Link href={{*/}
                {/*    pathname: '/wallet/exchange/deposit',*/}
                {/*    query: { type: 'fiat' }*/}
                {/*}}>*/}
                {/*<a className={state.type === TYPE.fiat ?*/}
                {/*    'mr-6 flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark cursor-not-allowed'*/}
                {/*    : 'mr-6 flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark cursor-not-allowed'}*/}
                {/*   title={'Coming soon'}*/}
                {/*>*/}
                {/*    <div className="pb-2.5 text-center min-w-[90px]">VNDC</div>*/}
                {/*    <div className={state.type === TYPE.fiat ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>*/}
                {/*</a>*/}
                {/*</Link>*/}
                <Link
                    href={{
                        pathname: PATHS.WALLET.EXCHANGE.DEPOSIT,
                        query: { type: 'crypto' },
                    }}
                    prefetch={false}
                >
                    <a
                        className={
                            state.type === TYPE.crypto
                                ? 'flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark'
                                : 'flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark'
                        }
                    >
                        <div className="pb-2.5">TOKEN</div>
                        <div
                            className={
                                state.type === TYPE.crypto
                                    ? 'w-[32px] h-[3px] md:h-[2px] bg-dominant'
                                    : 'w-[32px] h-[3px] md:h-[2px] bg-dominant invisible'
                            }
                        />
                    </a>
                </Link>
            </div>
        );
    }, [router, state.type]);

    const renderDepositFiat = useCallback(() => {
        if (state.type !== TYPE.fiat) return null;

        return <div>Fiat Section</div>;
    }, [state.type]);

    const renderDepositInput = useCallback(() => {
        return (
            <>
                <div className="flex items-center">
                    <AssetLogo assetCode={state.selectedAsset?.assetCode}/>
                    <span className="ml-2 font-bold text-sm text-txtPrimary dark:text-txtPrimary-dark">
                        {state.selectedAsset?.assetCode || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {state.selectedAsset?.assetCode ||
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
        );
    }, [state.type, state.selectedAsset, state.openList, currentTheme]);

    const renderCryptoList = useCallback(() => {
        if (!paymentConfigs) return null;
        let origin = paymentConfigs || [];
        let items = [];

        if (state.search) {
            origin =
                paymentConfigs &&
                [...paymentConfigs].filter((e) =>
                    e?.assetCode?.includes(state.search.toUpperCase())
                );
        }
        if (!origin.length) return null;
        origin.forEach((cfg) => {
            if (!IGNORE_TOKEN.includes(cfg?.assetCode)) {
                items.push(
                    <Link
                        key={`wdl_cryptoList__${cfg?.assetCode}`}
                        href={depositLinkBuilder(state.type, cfg?.assetCode)}
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
                            <div className="flex items-center w-full">
                                <AssetLogo
                                    assetCode={cfg?.assetCode}
                                    size={24}
                                />
                                <span className="font-bold text-sm ml-2">
                                    {cfg?.assetCode}
                                </span>
                                <span
                                    className="font-medium text-sm ml-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    {cfg?.fullName || cfg?.assetCode}
                                </span>
                            </div>
                            <div>
                                {state.selectedAsset?.assetCode ===
                                    cfg?.assetCode && <Check size={16}/>}
                            </div>
                        </a>
                    </Link>
                );
            }
        });

        return (
            <div
                className="pt-3.5 md:pt-4 absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                ref={cryptoListRef}
            >
                <div className="px-3.5 md:px-5">
                    <div className="flex items-center bg-gray-4 dark:bg-darkBlue-3 px-2.5 py-1.5 mb-3.5 rounded-lg">
                        <Search size={16}/>
                        <input
                            className="w-full px-2.5 text-sm font-medium"
                            value={state.search}
                            ref={cryptoListSearchRef}
                            onChange={(e) =>
                                setState({ search: e.target?.value })
                            }
                            placeholder={t('wallet:search_asset')}
                        />
                        <X
                            size={16}
                            onClick={onSearchClear}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ? (
                        <div className="py-6">
                            <Empty
                                grpSize={68}
                                message={t('common:not_found')}
                                messageStyle="text-sm"
                            />
                        </div>
                    ) : (
                        items
                    )}
                </div>
            </div>
        );
    }, [paymentConfigs, state.type, state.search, state.selectedAsset]);

    const renderNetworkInput = useCallback(() => {
        return (
            <>
                <div
                    className={
                        state.selectedNetwork?.depositEnable
                            ? 'flex items-center'
                            : 'flex items-center opacity-40'
                    }
                >
                    <span className="font-bold text-sm text-dominant">
                        {state.selectedNetwork?.network || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
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
        );
    }, [state.selectedNetwork, state.openList]);

    const renderNetworkList = useCallback(() => {
        if (!state.selectedAsset?.networkList) return null;

        const items = [];

        state.selectedAsset?.networkList.forEach((nw) => {
            items.push(
                <div
                    key={`wdl_networkList___${nw?._id}`}
                    className={
                        nw?.depositEnable
                            ? 'flex items-center justify-between px-3.5 py-3 md:px-5 hover:bg-teal-opacity cursor-pointer'
                            : 'flex items-center justify-between px-3.5 py-3 md:px-5 cursor-not-allowed opacity-40'
                    }
                    onClick={() =>
                        setState({
                            selectedNetwork: nw,
                            openList: {}
                        })
                    }
                >
                    <div>
                        <span className="text-sm font-medium">
                            {nw?.network}
                        </span>
                        <span className="ml-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                            {nw?.name}
                        </span>
                    </div>
                    {state.selectedNetwork?.network === nw?.network && (
                        <Check size={16}/>
                    )}
                </div>
            );
        });

        return (
            <div
                className="absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                ref={networkListRef}
            >
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ? (
                        <div className="py-6 h-full w-full items-center justify-center">
                            Chưa hỗ trợ rút đối với token{' '}
                            {state.selectedAsset?.assetCode}
                        </div>
                    ) : (
                        items
                    )}
                </div>
            </div>
        );
    }, [state.selectedAsset, state.selectedNetwork]);

    const renderAddressInput = useCallback(() => {
        if (!state.selectedNetwork?.depositEnable) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                        {t('wallet:errors.network_not_support_dep', {
                            asset: state.selectedNetwork?.coin,
                            chain: state.selectedNetwork?.network,
                        })}
                    </div>
                </div>
            );
        }

        if (!state.address) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                        {t('wallet:address_not_available')}
                    </div>
                    <div
                        className="bg-dominant px-3 py-1.5 rounded-lg text-sm font-medium text-white mt-3 cursor-pointer
                                     hover:opacity-80"
                        onClick={() =>
                            getDepositTokenAddress(
                                true,
                                state.selectedAsset?.assetId,
                                state.selectedNetwork?.network
                            )
                        }
                    >
                        {t('wallet:reveal_address')}
                    </div>
                </div>
            );
        }

        if (!state.address?.address && state.errors?.addressNotFound) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-red text-center">
                        {t('wallet:errors.address_not_found')}
                    </div>
                </div>
            );
        }

        return (
            <div
                className="min-h-[55px] max-h-[55px] lg:min-h-[62px] lg:max-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center
                            justify-between rounded-xl border border-divider dark:border-divider-dark
                            hover:!border-dominant"
            >
                <div className="w-full font-medium text-xs sm:text-sm pr-3 cursor-text break-all">
                    {state.address?.address}
                </div>
                {state.selectedNetwork?.shouldShowPushDeposit && (
                    <span
                        className={
                            state.address.address
                                ? state.pushingOrder || state.pushingOrder === 1
                                    ? 'mr-3 md:mr-5 font-medium text-xs md:text-sm text-gray-2 dark:text-darkBlue-4 select-none whitespace-nowrap cursor-not-allowed'
                                    : 'mr-3 md:mr-5 font-medium text-xs md:text-sm text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer'
                                : 'mr-3 md:mr-5 font-medium text-xs md:text-sm text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer invisible'
                        }
                        onClick={() =>
                            (!state.pushingOrder || state.pushingOrder !== 1) &&
                            onPushOrder(state.selectedAsset?.id)
                        }
                    >
                        {t('wallet:push_order')}
                    </span>
                )}
                <CopyToClipboard
                    text={state.address?.address}
                    onCopy={() =>
                        !state.isCopying?.address && onCopy('address')
                    }
                >
                    <span
                        className={
                            state.address.address
                                ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                                : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'
                        }
                    >
                        {state.isCopying?.address ? (
                            <Check size={16}/>
                        ) : (
                            <Copy size={16}/>
                        )}
                    </span>
                </CopyToClipboard>
            </div>
        );
    }, [
        state.address,
        state.selectedAsset,
        state.selectedNetwork,
        state.errors,
        state.isCopying?.address,
        state.pushingOrder,
    ]);

    const renderMemoInput = useCallback(() => {
        if (state.selectedNetwork?.memoRegex && state.address?.addressTag) {
            return (
                <div
                    className="min-h-[55px] max-h-[55px] lg:min-h-[62px] lg:max-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center
                            justify-between rounded-xl border border-divider dark:border-divider-dark
                            hover:!border-dominant"
                >
                    <div className="w-full font-medium text-xs sm:text-sm pr-3 cursor-text break-all">
                        {state.address.addressTag}
                    </div>
                    <CopyToClipboard
                        text={state.address.addressTag}
                        onCopy={() => !state.isCopying?.memo && onCopy('memo')}
                    >
                        <span
                            className={
                                state.address.addressTag
                                    ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                                    : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'
                            }
                        >
                            {state.isCopying?.memo ? (
                                <Check size={16}/>
                            ) : (
                                <Copy size={16}/>
                            )}
                        </span>
                    </CopyToClipboard>
                </div>
            );
        }

        return null;
    }, [state.address, state.selectedNetwork, state.isCopying?.memo]);

    const renderDepositConfirmBlocks = useCallback(() => {
        let inner;
        const block =
            state.selectedNetwork?.minConfirm >
            state.selectedNetwork?.unLockConfirm
                ? state.selectedNetwork?.minConfirm
                : state.selectedNetwork?.unLockConfirm;

        if (language === LANGUAGE_TAG.EN) {
            inner = (
                <>
                    <span className="text-dominant font-bold mr-1">
                        {block}
                    </span>
                    network confirmation
                </>
            );
        } else {
            inner = (
                <>
                    <span className="text-dominant font-bold mr-1">
                        {block}
                    </span>
                    lần xác nhận từ mạng lưới
                </>
            );
        }

        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:expected_unlock')}
                </span>
                <span className="font-medium ml-2">{inner}</span>
            </div>
        );
    }, [state.selectedNetwork, language]);

    const renderQrAddress = useCallback(() => {
        if (state.loadingAddress) {
            return <Skeletor width={qrSize} height={qrSize}/>;
        }

        if (!state.address?.address) {
            return (
                <div
                    className="ml-3.5 md:ml-6 flex items-center justify-center"
                    style={{
                        width: qrSize,
                        height: qrSize
                    }}
                >
                    <Slash size={(qrSize * 30) / 100}/>
                </div>
            );
        }

        return (
            <div className="ml-3.5 md:ml-6">
                {state.address?.memo && (
                    <div className="text-center text-sm font-bold mb-3.5">
                        {t('wallet:scan_address_qr')}
                    </div>
                )}
                <div
                    style={
                        currentTheme === THEME_MODE.LIGHT
                            ? {
                                boxShadow:
                                    '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)',
                            }
                            : undefined
                    }
                    className="p-2 bg-white rounded-lg"
                >
                    <QRCode
                        value={state.address?.address}
                        size={qrSize}
                        bgColor={colors.white}
                    />
                </div>
            </div>
        );
    }, [state.address, state.loadingAddress, currentTheme, qrSize]);

    const renderQrMemo = useCallback(() => {
        if (!state.address?.memo) return null;

        if (state.loadingAddress) {
            return <Skeletor width={qrSize} height={qrSize}/>;
        }

        return (
            <div className="ml-3.5 md:ml-6">
                <div className="text-center text-sm font-bold mb-3.5">
                    {t('common:scan')} Memo
                </div>
                <div
                    style={
                        currentTheme === THEME_MODE.LIGHT
                            ? {
                                boxShadow:
                                    '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)',
                            }
                            : undefined
                    }
                    className="p-2 bg-white rounded-lg"
                >
                    <QRCode
                        value={state.address?.memo}
                        size={qrSize}
                        bgColor={colors.white}
                    />
                </div>
            </div>
        );
    }, [state.address, state.loadingAddress, currentTheme, qrSize]);

    const renderMinDep = () => {
        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:minimum_deposit')}
                </span>
                <span className="font-bold ml-2">--</span>
            </div>
        );
    };

    const renderNotes = useCallback(() => {
        const tokenName = state.selectedAsset?.assetCode;
        const networkType = state.selectedNetwork?.tokenType;
        const isPushOrder = state.selectedNetwork?.shouldShowPushDeposit;

        const noteObj = {};

        if (language === LANGUAGE_TAG.EN) {
            noteObj.common = (
                <>
                    Please carefully check the information about the token, the
                    token network before transferring the token. Only send{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    to this address, sending any other tokens may result in the
                    loss of tokens.
                </>
            );
            noteObj.kai = (
                <>
                    For <span className="font-medium text-dominant">KAI</span>{' '}
                    tokens, NamiExchange only supports{' '}
                    <span className="font-medium text-dominant">
                        Kardiachain Mainnet
                    </span>
                    , please make sure your entered information is correct.
                </>
            );
            noteObj.pushOrder = (
                <>
                    If your Deposit Order has not been updated on Nami, use the{' '}
                    <span className="font-medium text-dominant">
                        Push Order
                    </span>{' '}
                    button to have Nami update the balance automatically.
                </>
            );
            noteObj.memoTips = (
                <>
                    Both a{' '}
                    <span className="text-dominant font-medium">MEMO</span> and
                    an{' '}
                    <span className="text-dominant font-medium">Address</span>{' '}
                    are required to successfully deposit your {tokenName}.
                    NamiExchange will not handle any deposit which lacks
                    information.
                </>
            );
            noteObj.memo_1 = (
                <>
                    Send{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    with MEMO to this address, the deposit will be completed
                    after{' '}
                    <span className="text-dominant font-medium">30 block</span>{' '}
                    confirmations.
                </>
            );
            noteObj.memo_2 = (
                <>
                    Multi-send transaction is not supported, send only{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    to this address. Send other tokens may result in loss of
                    your deposit.
                </>
            );
            noteObj.runItBackTitle = <>Having a mistake?</>;
            noteObj.runItBackNotes = (
                <>
                    Depending on the case, Nami Exchange can support to recover
                    tokens when users send wrong token, wrong wallet address or
                    wrong network, the minimum fee for recovery support is 100
                    USDT, please{' '}
                    <span
                        onClick={() => window?.fcWidget.open()}
                        className="text-dominant cursor-pointer hover:!underline"
                    >
                        contact support
                    </span>{' '}
                    for specific advice.
                </>
            );
        } else {
            noteObj.common = (
                <>
                    Người dùng vui lòng kiểm tra kỹ các thông tin về token, mạng
                    lưới token trước khi chuyển token. Chỉ gửi{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    đến địa chỉ này, gửi bất cứ token nào khác có thể dẫn đến
                    việc mất mát token.
                </>
            );
            noteObj.kai = (
                <>
                    Đối với token{' '}
                    <span className="font-medium text-dominant">KAI</span>,
                    NamiExchange chỉ hỗ trợ{' '}
                    <span className="font-medium text-dominant">
                        Kardiachain Mainnet
                    </span>
                    , hãy chắc chắn các thông tin đã nhập của bạn là chính xác.
                </>
            );
            noteObj.pushOrder = (
                <>
                    Nếu lệnh nạp của bạn chưa được cập nhật trên Nami, vui lòng
                    click vào nút{' '}
                    <span className="font-medium text-dominant">Đẩy lệnh</span>{' '}
                    để Nami cập nhật số dư tự động.
                </>
            );
            noteObj.memoTips = (
                <>
                    Cần cả 2 trường{' '}
                    <span className="text-dominant font-medium">MEMO</span> và{' '}
                    <span className="text-dominant font-medium">Địa chỉ</span>{' '}
                    để nạp thành công {tokenName}. Nami sẽ không xử lý các lệnh
                    nạp thiếu thông tin yêu cầu.
                </>
            );
            noteObj.memo_1 = (
                <>
                    Gửi{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    kèm MEMO tới địa chỉ ví này, token sẽ được cộng vào tài
                    khoản của bạn sau khi có{' '}
                    <span className="text-dominant font-medium">30 block</span>{' '}
                    xác thực.
                </>
            );
            noteObj.memo_2 = (
                <>
                    Giao dịch dạng multi-send không được hỗ trợ, chỉ gửi{' '}
                    <span className="font-medium text-dominant">
                        {tokenName}
                    </span>{' '}
                    đến địa chỉ này. Gửi các token khác có thể dẫn đến mất mát.
                </>
            );
            noteObj.runItBackTitle = <>Gặp sự cố nhầm lẫn?</>;
            noteObj.runItBackNotes = (
                <>
                    Tùy từng trường hợp, NamiExchange có thể hỗ trợ khôi phục
                    token khi người dùng gửi nhầm token, sai địa chỉ ví hoặc
                    nhầm mạng, phí hỗ trợ khôi phục tối thiểu là 100 USDT, vui
                    lòng liên hệ{' '}
                    <span
                        onClick={() => window?.fcWidget.open()}
                        className="text-dominant cursor-pointer hover:!underline"
                    >
                        {' '}
                        bộ phận hỗ trợ
                    </span>{' '}
                    để được tư vấn cụ thể.
                </>
            );
        }

        return (
            <>
                <div className="relative font-medium text-sm flex items-center justify-between">
                    <span>{t('common:important_notes')}:</span>
                    <div>
                        <Tooltip id="wrongthings" place="left" effect="solid">
                            <div className="w-[320px]">
                                {noteObj.runItBackNotes}
                            </div>
                        </Tooltip>
                        <span
                            data-tip=""
                            data-for="wrongthings"
                            className="inline-block mr-8 cursor-pointer text-dominant"
                            onClick={() => window?.fcWidget?.open()}
                        >
                            {noteObj?.runItBackTitle}
                        </span>
                    </div>
                </div>
                <div className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark mt-2.5 pr-3 xl:pr-10">
                    {!WITH_MEMO.includes(networkType) && (
                        <div className="flex">
                            <span className="mx-2 xl:mx-3.5">&bull;</span>
                            <div>{noteObj?.common}</div>
                        </div>
                    )}
                    {WITH_MEMO.includes(networkType) && (
                        <>
                            <div className="flex">
                                <span className="mx-2 xl:mx-3.5">&bull;</span>
                                <div>{noteObj?.memoTips}</div>
                            </div>
                            <div className="flex mt-1.5">
                                <span className="mx-2 xl:mx-3.5">&bull;</span>
                                <div>{noteObj?.memo_1}</div>
                            </div>
                            <div className="flex mt-1.5">
                                <span className="mx-2 xl:mx-3.5">&bull;</span>
                                <div>{noteObj?.memo_2}</div>
                            </div>
                        </>
                    )}
                    {tokenName === 'KAI' && (
                        <div className="flex mt-1.5">
                            <span className="mx-2 xl:mx-3.5">&bull;</span>
                            <div>{noteObj?.kai}</div>
                        </div>
                    )}
                    {isPushOrder && (
                        <div className="flex mt-1.5">
                            <span className="mx-2 xl:mx-3.5">&bull;</span>
                            <div>{noteObj?.pushOrder}</div>
                        </div>
                    )}
                </div>
            </>
        );
    }, [language, state.selectedAsset, state.selectedNetwork]);

    const renderMemoNotice = useCallback(() => {
        const isMemoNotice =
            WITH_MEMO.includes(state.selectedNetwork?.network) &&
            state.selectedNetwork?.depositEnable;
        if (!isMemoNotice) return null;

        let msg;
        if (language === LANGUAGE_TAG.VI) {
            msg = (
                <>
                    Cần cả 2 trường{' '}
                    <span className="text-dominant font-medium">MEMO</span> và{' '}
                    <span className="text-dominant font-medium">Địa chỉ</span>{' '}
                    để nạp thành công {state.selectedAsset?.assetCode}.<br/>{' '}
                    Nami sẽ không xử lý các lệnh nạp thiếu thông tin yêu cầu.
                </>
            );
        } else {
            msg = (
                <>
                    Both a{' '}
                    <span className="text-dominant font-medium">MEMO</span> and
                    an{' '}
                    <span className="text-dominant font-medium">Address</span>{' '}
                    are required to successfully deposit your{' '}
                    {state.selectedAsset?.assetCode}.
                    <br/>
                    NamiExchange will not handle any deposit which lacks
                    information.
                </>
            );
        }

        return (
            <Modal isVisible={state.openModal?.memoNotice}>
                <div className="text-center text-sm font-medium w-[320px]">
                    <div className="my-2 text-center font-bold text-[18px]">
                        {t('common:important_notes')}
                    </div>
                    <div>{msg}</div>
                    <div className="mt-4 w-full flex flex-row items-center justify-between">
                        <Button
                            title={t('common:confirm')}
                            type="primary"
                            componentType="button"
                            className="!py-2"
                            onClick={closeModal}
                        />
                    </div>
                </div>
            </Modal>
        );
    }, [
        state.selectedNetwork,
        state.selectedAsset?.assetCode,
        state.openModal?.memoNotice,
        language,
    ]);

    const renderDepHistory = useCallback(() => {
        const data = dataHandler(
            state.histories,
            state.loadingHistory,
            paymentConfigs,
            {
                t,
                blockConfirm: state.blockConfirm
            }
        );
        let tableStatus;

        const columns = [
            {
                key: 'id',
                dataIndex: 'id',
                title: 'ID',
                width: 200,
                fixed: 'left',
                align: 'left',
            },
            {
                key: 'asset',
                dataIndex: 'asset',
                title: t('common:asset'),
                width: 100,
                align: 'left',
            },
            {
                key: 'amount',
                dataIndex: 'amount',
                title: t('common:amount'),
                width: 100,
                align: 'right',
            },
            {
                key: 'address',
                dataIndex: 'address',
                title: t('common:address_wallet'),
                width: 100,
                align: 'right',
            },
            {
                key: 'network',
                dataIndex: 'network',
                title: t('wallet:network'),
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
                title: t('common:time'),
                width: 100,
                align: 'right',
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: t('common:status'),
                width: 100,
                align: 'right',
            },
        ];

        if (!state.histories?.length) {
            tableStatus = <Empty/>;
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
        );
    }, [state.loadingHistory, state.histories, state.blockConfirm, width]);

    const renderPagination = useCallback(() => {
        return (
            <div className="w-full mt-6 mb-10 flex items-center justify-center select-none">
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
                    <ChevronLeft size={18} className="mr-2"/>{' '}
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
                    <ChevronRight size={18} className="ml-2"/>
                </div>
            </div>
        );
    }, [state.historyPage, state.histories, language]);

    const renderPushedOrderNotice = useCallback(() => {
        if (!state.pushedOrder) return null;
        let msg;
        if (language === LANGUAGE_TAG.VI) {
            msg = (
                <>
                    Yêu cầu đẩy lệnh đã được ghi nhận, <br/> vui lòng chờ trong
                    giây lát.
                </>
            );
        } else {
            msg = (
                <>
                    Your push request has been record, <br/> please wait a
                    moment.
                </>
            );
        }

        return (
            <Modal
                isVisible={!!state.pushedOrder}
                title={t('modal:notice')}
                onBackdropCb={() => setState({ pushedOrder: null })}
            >
                <div className="text-sm text-center mt-5">{msg}</div>
                <div className="mt-4 w-full flex flex-row items-center justify-between">
                    <Button
                        title={t('common:confirm')}
                        type="primary"
                        componentType="button"
                        className="!py-2"
                        onClick={() => setState({ pushedOrder: null })}
                    />
                </div>
            </Modal>
        );
    }, [state.pushedOrder, language]);

    // useEffect(() => {
    //     if (!socket?._callbacks['$deposit::update_history_row']) {
    //         socket?.on('deposit::update_history_row', (data) =>
    //             updateBlockConfirmationEvent(data, state.blockConfirm)
    //         )
    //     }
    //     return socket?.removeListener('deposit::update_history_row', (data) =>
    //         updateBlockConfirmationEvent(data, state.blockConfirm)
    //     )
    // }, [socket, state.blockConfirm])

    useEffect(() => {
        getDepositHistory(state.historyPage);
    }, [state.historyPage]);

    useEffect(() => {
        getDepositTokenAddress(
            false,
            state.selectedAsset?.assetId,
            state.selectedNetwork?.network
        );

        if (WITH_MEMO.includes(state.selectedNetwork?.network)) {
            setState({ openModal: { memoNotice: true } });
        } else {
            setState({ openModal: { memoNotice: false } });
        }
    }, [state.selectedNetwork, state.selectedAsset]);

    useEffect(() => {
        const type = get(router?.query, 'type', 'crypto');
        const asset = get(router?.query, 'asset', 'VNDC');

        if (type && type === 'crypto') {
            setState({ type: TYPE.crypto });
        }
        // else {
        //     setState({ type: TYPE.fiat })
        // }

        if (paymentConfigs && asset) {
            const selectedAsset = find(
                paymentConfigs,
                (o) => o?.assetCode === asset
            );
            const defaultNetwork =
                selectedAsset?.networkList?.find((o) => o.isDefault) ||
                selectedAsset?.networkList?.[0];
            selectedAsset && setState({ selectedAsset });
            defaultNetwork && setState({ selectedNetwork: defaultNetwork });
        }
    }, [router, paymentConfigs]);

    useEffect(() => {
        let interval;
        if (focused) {
            interval = setInterval(
                () => getDepositHistory(state.historyPage, true),
                30000
            );
        }
        return () => interval && clearInterval(interval);
    }, [focused, state.historyPage]);

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className="mal-container px-4">
                    <div className="t-common mb-4">
                        <span
                            className="max-w-[150px] flex items-center cursor-pointer rounded-lg hover:text-dominant"
                            onClick={() =>
                                router?.push(PATHS.WALLET.EXCHANGE.DEFAULT)
                            }
                        >
                            <span className="inline-flex items-center justify-center h-full mr-3 mt-0.5">
                                <ChevronLeft size={24}/>
                            </span>
                            {t('common:deposit')}
                        </span>
                    </div>
                    {renderTab()}
                    <MCard addClass="pt-12 pb-10 px-6 lg:px-16 xl:px-8">
                        <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center">
                            <div className="w-full xl:w-1/2 max-w-[453px] xl:ml-16 xl:mr-32">
                                {renderDepositFiat()}
                                {state.type === TYPE.crypto && (
                                    <>
                                        <div className="relative">
                                            <div
                                                className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                                {t('wallet:crypto_select')}
                                            </div>
                                            <div
                                                className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
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
                                                {renderDepositInput()}
                                            </div>
                                            {state.openList?.cryptoList &&
                                                renderCryptoList()}
                                        </div>
                                        <div className="relative mt-5">
                                            <div
                                                className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                                {t('wallet:network')}
                                                {/*<span>{state.validator?.allowDeposit && <Check size={16} className="text-dominant"/>}</span>*/}
                                            </div>
                                            <div
                                                className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
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
                                            {state.openList?.networkList &&
                                                renderNetworkList()}
                                        </div>
                                        <div className="relative mt-5">
                                            <div
                                                className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                                {t('wallet:deposit_address')}
                                            </div>
                                            {renderAddressInput()}
                                        </div>
                                        {state.address?.addressTag &&
                                            state.selectedNetwork
                                                ?.memoRegex && (
                                                <div className="relative mt-5">
                                                    <div
                                                        className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                                        Memo
                                                    </div>
                                                    {renderMemoInput()}
                                                </div>
                                            )}
                                        <div className="mt-4">
                                            {renderDepositConfirmBlocks()}
                                            {/*{renderMinDep()}*/}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-8 xl:mt-0 w-full xl:w-1/2 max-w-[453px]">
                                <div className="flex justify-center">
                                    {renderQrAddress()}
                                    {renderQrMemo()}
                                </div>
                                <div className="mt-8">{renderNotes()}</div>
                            </div>
                        </div>
                    </MCard>
                    <div className="t-common mt-11">
                        {t('wallet:dep_history')}
                    </div>
                    <MCard addClass="mt-8 py-0 px-0 overflow-hidden">
                        {renderDepHistory()}
                    </MCard>
                    {renderPagination()}
                </div>
            </Background>
            {renderMemoNotice()}
            {renderPushedOrderNotice()}
        </MaldivesLayout>
    );
};

const Background = styled.div.attrs({ className: 'w-full h-full pt-10' })`
  background-color: ${({ isDark }) =>
          isDark ? colors.darkBlue1 : '#F8F9FA'};
`;

const IGNORE_TOKEN = [
    'XBT_PENDING',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_SPONSOR',
    'SPIN_BONUS',
    'SPIN_CONQUEST',
    'TURN_CHRISTMAS_2017',
    'SPIN_CLONE',
];

const HISTORY_SIZE = 6;

function dataHandler(data, loading, configList, utils) {
    if (loading) {
        const skeleton = [];
        for (let i = 0; i < HISTORY_SIZE; ++i) {
            skeleton.push({
                ...ROW_LOADING_SKELETON,
                key: `wdl__skeletor___${i}`,
            });
        }
        return skeleton;
    }

    if (!Array.isArray(data) || !data || !data.length) return [];

    const result = [];
    let networkList = [];

    if (configList && configList.length) {
        configList.forEach((e) =>
            networkList.push(...e.networkList?.map((o) => o?.network))
        );
    }

    networkList = [...new Set(networkList)];

    data.forEach((h) => {
        const {
            _id,
            amount,
            assetId,
            fee,
            executeAt,
            network,
            status,
            txId,
            txIdUrl,
        } = h;
        let statusInner;
        let address = h?.metadata?.address;
        let transactionHash = h?.metadata?.transactionHash;
        switch (status) {
            case DepWdlStatus.Success:
                statusInner = (
                    <span className="text-green">
                        {utils?.t('common:success')}
                    </span>
                );
                break;
            case DepWdlStatus.Declined: {
                statusInner = (
                    <span className="text-red">
                        {utils?.t('common:declined')}
                    </span>
                );
                break;
            }
            case DepWdlStatus.Pending:
            default:
                statusInner = (
                    <span className="text-yellow">
                        {utils?.t('common:pending')}
                    </span>
                );
                break;
        }

        result.push({
            key: `dep_${_id}_${transactionHash}`,
            id: (
                <span className="!text-sm whitespace-nowrap uppercase">
                    {_id}
                </span>
            ),
            asset: (
                <div className="flex items-center">
                    <AssetLogo assetId={assetId} size={24}/>
                    <span className="!text-sm whitespace-nowrap ml-2.5">
                        <AssetName assetId={assetId}/>
                    </span>
                </div>
            ),
            amount: (
                <span className="!text-sm whitespace-nowrap">
                    {formatWallet(amount)}
                </span>
            ),
            address: (
                <span className="!text-sm whitespace-nowrap">
                    {shortHashAddress(address, 5, 5)}
                </span>
            ),
            network: (
                <span className="!text-sm whitespace-nowrap">
                    {network === '0' ? 'Internal' : network}
                </span>
            ),
            txId: <span className="!text-sm whitespace-nowrap ml-2.5">
                 {txId ? shortHashAddress(txId, 6, 6) : '--'}
            </span>,
            time: (
                <span className="!text-sm whitespace-nowrap">
                    {formatTime(executeAt, 'HH:mm dd-MM-yyyy')}
                </span>
            ),
            status: (
                <span className="!text-sm whitespace-nowrap">
                    {statusInner}
                </span>
            ),
        });
    });

    return result;
}

const WITH_MEMO = ['BNB', 'VITE'];

// const getAssetName = (assetList, assetId) => {
//     if (!Array.isArray(assetList) || !assetId) return
//     const _ = assetList.filter((e) => e.assetId === assetId)?.[0]
//     return _?.assetCode
// }

const ROW_LOADING_SKELETON = {
    id: <Skeletor width={65}/>,
    asset: <Skeletor width={65}/>,
    amount: <Skeletor width={65}/>,
    network: <Skeletor width={65}/>,
    withdraw_to: <Skeletor width={65}/>,
    txhash: <Skeletor width={65}/>,
    time: <Skeletor width={65}/>,
    status: <Skeletor width={65}/>,
};

const depositLinkBuilder = (type, asset) => {
    switch (type) {
        case TYPE.crypto:
            return `${PATHS.WALLET.EXCHANGE.DEPOSIT}?type=crypto&asset=${asset}`;
        case TYPE.fiat:
            return `${PATHS.WALLET.EXCHANGE.DEPOSIT}?type=fiat&asset=${asset}`;
        default:
            return `${PATHS.WALLET.EXCHANGE.DEPOSIT}?type=crypto`;
    }
};

const getTokenType = (tokenType) => {
    switch (tokenType) {
        case 'KARDIA_CHAIN_NATIVE':
            return 'KRC20';
        default:
            return tokenType;
    }
};

export default ExchangeDeposit;
