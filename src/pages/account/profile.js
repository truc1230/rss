import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { API_GET_VIP, API_SET_ASSET_AS_FEE, USER_DEVICES, USER_REVOKE_DEVICE } from 'redux/actions/apis';
import { BREAK_POINTS, EMPTY_VALUE, FEE_TABLE, ROOT_TOKEN, USER_DEVICE_STATUS } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronRight, Edit, MoreVertical } from 'react-feather';
import { Menu, useContextMenu } from 'react-contexify';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import { ApiStatus } from 'redux/actions/const';
import { isMobile } from 'react-device-detect';
import { PATHS } from 'constants/paths';
import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import SvgCheckSuccess from 'components/svg/CheckSuccess';
import CheckSuccess from 'components/svg/CheckSuccess';
import SvgGooglePlus from 'components/svg/SvgGooglePlus';
import SvgFacebook from 'components/svg/SvgFacebook';
import SvgTwitter from 'components/svg/SvgTwitter';
import NeedLogin from 'components/common/NeedLogin';
import SvgApple from 'components/svg/SvgApple';
import Skeletor from 'components/common/Skeletor';
import ReModal from 'components/common/ReModalOld';
import MCard from 'components/common/MCard';
import Link from 'next/link';
import Axios from 'axios';
import Switcher from 'components/common/Switcher';

import 'react-contexify/dist/ReactContexify.css';
import AvatarModal from 'components/screens/Account/AvatarModal';
import { getLastedArticles } from 'utils';
import { SupportCategories } from 'constants/faqHelper';
import useApp from 'hooks/useApp';

import 'react-contexify/dist/ReactContexify.css';

const DEFAULT_USER = {
    name: '',
    username: '',
    phone: '',
};

const MENU_CONTEXT = 'revoke_devices';

const AVATAR_KEY = 'avatar_index_';
const AVATAR_SIZE_LIMIT = 20000;
const AVATAR_TYPE = {
    CUSTOM: 'custom',
    PRESET: 'preset'
};

const INITIAL_STATE = {
    useNami: false,
    level: null,
    loadingLevel: false,
    isEditable: false,
    savingInfo: false,
    user: DEFAULT_USER,
    loadingActivity: false,
    activitiesLog: null,
    loadingAnnouncements: false,
    announcements: null,
    assetFee: null,
    promoteFee: null,
    loadingAssetFee: false,
    namiBalance: null,
    openModal: {},
    revokeRef: {},
    revokingDevices: false,
    revokeObj: {},

    // ... Add new state
};

const AccountProfile = () => {
    const [state, set] = useState(INITIAL_STATE);
    const setState = state => set(prevState => ({ ...prevState, ...state }));
    const isApp = useApp();

    const firstInputRef = useRef();

    // Rdx
    const user = useSelector(state => state.auth?.user);

    // Use Hooks
    const router = useRouter();
    const { show } = useContextMenu({ id: MENU_CONTEXT });
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme,] = useDarkMode();
    const { width } = useWindowSize();

    const customAvatarTips = useMemo(() => {
        let text;
        if (language === LANGUAGE_TAG.VI) {
            text = <>
                Kéo thả hình ảnh vào đây hoặc <span
                className="text-dominant">{isMobile ? 'chạm' : 'click'} để duyệt</span>
            </>;
        } else {
            text = <>
                Drag your image here, or <span className="text-dominant">{isMobile ? 'touch' : 'click'} to browse</span>
            </>;
        }

        return text;
    }, [language]);

    // Api helper
    const assetFeeHandler = async (action = 'get', currency = undefined, assetCode = 'NAMI') => {
        const throttle = 800;
        setState({ loadingAssetFee: true });

        try {
            if (action === 'get') {
                const { data } = await Axios.get(API_SET_ASSET_AS_FEE);
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => {
                        setState({
                            assetFee: data.data,
                            promoteFee: {
                                exchange: data?.data?.promoteSpot,
                                futures: data?.data?.promoteFutures
                            }
                        });
                    }, throttle);
                }
            }
            if (action === 'set' && currency !== undefined) {
                const { data } = await Axios.post(API_SET_ASSET_AS_FEE, { currency });
                if (data?.status === ApiStatus.SUCCESS && data?.data) {
                    setTimeout(() => setState({ assetFee: data.data }), throttle);
                }
            }
        } catch (e) {
            console.log(`Can't ${action} ${assetCode} as asset fee `, e);
        } finally {
            setTimeout(() => setState({ loadingAssetFee: false }), throttle);
        }
    };

    const getAnnouncements = async (lang = 'vi') => {
        setState({ loadingAnnouncements: true });
        try {
            const lastedArticles = await getLastedArticles(undefined, 10, language);
            // const { status, data: announcements } = await Axios.get(`https://nami.io/api/v1/top_posts?language=${lang}`)
            setState({ announcements: lastedArticles });
        } catch (e) {
            console.log(`Can't get announcements `, e);
        } finally {
            setState({ loadingAnnouncements: false });
        }
    };

    const getLevel = async () => {
        setState({ loadingLevel: true });
        try {
            const { data } = await Axios.get(API_GET_VIP);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({
                    level: data?.data?.level,
                    namiBalance: data?.data?.metadata?.namiBalance
                });
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`);
        } finally {
            setState({ loadingLevel: false });
        }
    };

    const getLoginLogs = async () => {
        !state.activitiesLog &&
        setState({ loadingActivity: true });
        try {
            const { data } = await Axios.get(USER_DEVICES);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ activitiesLog: data.data });
            }
        } catch (e) {
            console.log(`Can't get activities log `, e);
        } finally {
            setState({ loadingActivity: false });
        }
    };

    const onRevoke = async (revokeId, isThisDevice = false) => {
        if (!revokeId) return;
        setState({ revokingDevices: true });

        try {
            const id = revokeId === 'all' ? 'all' : revokeId;
            const { data } = await Axios.post(USER_REVOKE_DEVICE, { id });
            if (data?.status === ApiStatus.SUCCESS && (id === 'all' || isThisDevice)) {
                router.reload();
            }
        } catch (e) {
            console.log(`Can't revoke device ${revokeId} `, e);
        } finally {
            await getLoginLogs();
            setState({
                revokingDevices: false,
                openModal: {}
            });
        }
    };

    // Utilities

    const openAvatarModal = () => {
        setState({ openModal: { avatar: true } });
    };

    const openRevokeModal = () => setState({ openModal: { revokeAll: !state.openModal?.revokeAll } });

    const onCloseModal = () => setState({
        openModal: {},
        revokeObj: {}
    });

    const onOpenRevokeContext = (event, revokeId, device, isThisDevice) => {
        setState({
            revokeObj: {
                revokeId,
                device,
                isThisDevice
            }
        });
        show(event);
    };

    // const onEdit = () => {
    //     setState({ isEditable: true })
    //     firstInputRef.current?.focus()
    // }
    //
    // const onSave = (payload) => {
    //     setState({ savingInfo: true })
    //     setState({ user: { ...state.user, ...payload } })
    //     setTimeout(() => {
    //         setState({ savingInfo: false, isEditable: false })
    //     }, 1500)
    // }

    // Render Handler
    const renderUserPersona = useCallback(() => {
        if (!user) return null;

        return (
            <div className="flex flex-col items-center w-full lg:w-2/5 xl:w-[15%]">
                <div className="relative w-[132px] h-[132px] rounded-full bg-gray-4 dark:bg-darkBlue-5 cursor-pointer"
                     onClick={openAvatarModal}>
                    <img src={user?.avatar} alt="Nami.Exchange"
                         className="relative z-10 w-full h-full rounded-full"/>
                    <div className="absolute w-auto h-auto z-20 right-2 bottom-2 p-1.5 rounded-full bg-dominant">
                        <Edit className="text-white" size={12} strokeWidth={1.75}/>
                    </div>
                </div>
                <div className="mt-5 mb-2.5 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    Social Binding
                </div>
                <div className="flex items-center">
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgApple/>
                    </div>
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgGooglePlus/>
                    </div>
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgFacebook/>
                    </div>
                    <div className="cursor-pointer hover:opacity-90">
                        <SvgTwitter/>
                    </div>
                </div>
            </div>
        );
    }, [user]);

    const renderUserInfo = useCallback(() => {
        const inputClass = `font-medium text-txtPrimary dark:text-txtPrimary-dark 
                             text-right pr-3 rounded-md xl:ml-8
                             ${state.isEditable ? 'py-1 bg-gray-4 dark:bg-darkBlue-4' : ''} 
                             ${state.savingInfo ? 'opacity-30 pointer-event-none' : ''}`;

        const {
            name,
            username,
            phone
        } = state.user;

        return (
            <div style={width >= BREAK_POINTS.xl ?
                { width: `calc(80% / 3)` } : undefined}
                 className="w-full lg:w-3/5 mt-6 lg:mt-0">
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:username')}
                    </span>
                    <input className={inputClass}
                           value={username}
                           ref={firstInputRef}
                           onChange={e => setState({
                               user: {
                                   ...state.user,
                                   username: e?.target?.value
                               }
                           })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:name')}
                    </span>
                    <input className={inputClass}
                           value={name}
                           onChange={e => setState({
                               user: {
                                   ...state.user,
                                   name: e?.target?.value
                               }
                           })}
                           readOnly={!state.isEditable}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Nami ID</span>
                    <input className={inputClass + (state.isEditable ? 'opacity-80 cursor-not-allowed' : '')}
                           value={state.user?.namiId}
                           readOnly={true}/>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm mb-2">
                    <span
                        className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Email</span>
                    <div className="flex items-center pr-3 xl:pr-0">
                        <input
                            className={state.isEditable ? 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right py-1 pr-2 xl:text-right xl:ml-4'
                                : 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right pr-2 xl:text-right xl:ml-4'}
                            value={state.user?.email}
                            readOnly={true}/>
                        <SvgCheckSuccess/>
                    </div>
                </div>
                <div className="flex items-center justify-between xl:justify-start text-sm">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                        {t('profile:phone_number')}
                    </span>
                    <input className={inputClass}
                           value={phone}
                           onChange={e => setState({
                               user: {
                                   ...state.user,
                                   phone: e?.target?.value
                               }
                           })}
                           readOnly={!state.isEditable}/>
                </div>
                {/*<div className="w-full lg:flex lg:justify-end lg:pr-3 xl:justify-start">*/}
                {/*    <div className="mt-11 bg-dominant rounded-md py-2.5 cursor-pointer font-medium text-sm text-center text-white hover:opacity-80*/}
                {/*                    lg:min-w-[130px] lg:w-[130px]"*/}
                {/*         onClick={() => state.isEditable ? !state.savingInfo && onSave({ name, username, phone }) : onEdit()}>*/}
                {/*        {state.savingInfo ? <PulseLoader size={3} color="#FFFF"/>*/}
                {/*            : state.isEditable ? t('common:save') : t('common:edit')}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        );
    }, [state.isEditable, state.savingInfo, state.user, width]);

    const renderFee = useCallback(() => {
        let seeFeeStructure,
            useNamiForBonus;
        const nextAssetFee = state.assetFee?.feeCurrency === 1 ? 0 : 1;

        if (language === LANGUAGE_TAG.VI) {
            seeFeeStructure = 'Xem biểu phí';
            useNamiForBonus = <>
                Dùng NAMI để được giảm phí <span className="ml-1 text-dominant font-medium whitespace-nowrap">(chiết khấu 25%)</span>
            </>;
        } else {
            seeFeeStructure = 'See fee structures';
            useNamiForBonus = <>
                Using NAMI to pay for fees <span className="ml-1 text-dominant font-medium whitespace-nowrap">(25% discount)</span>
            </>;
        }

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                    { width: `calc(80% / 3)` } : undefined}
                className="mt-12 xl:max-w-[300px] text-sm w-full mt-10 lg:w-1/2 lg:pr-5 xl:mt-0 xl:p-0">
                <div>
                    <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                        {t('fee-structure:your_fee_level')} <span className="ml-1 text-dominant">{state.loadingLevel ?
                        <Skeletor width={45}/> : <>VIP {state.level || '0'}</>}</span>
                    </div>
                    <div className="">
                        <div className="flex items-center justify-between xl:justify-start mt-4">
                            <span
                                className="font-medium text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[40px]">
                                Maker
                            </span>
                            <span
                                className="font-bold text-txtPrimary dark:text-txtPrimary-dark text-[18px] lg:text-[20px] 2xl:text-[26px] xl:ml-8">
                                0.075%
                            </span>
                        </div>
                        <div className="flex items-center justify-between xl:justify-start mt-4">
                            <span
                                className="font-medium text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[40px]">
                                Trader
                            </span>
                            <span
                                className="font-bold text-txtPrimary dark:text-txtPrimary-dark text-[18px] lg:text-[20px] 2xl:text-[26px] xl:ml-8">
                                0.075%
                            </span>
                        </div>
                        <div className="flex items-center mt-4">
                            <Switcher active={!!state.assetFee?.feeCurrency}
                                      loading={state.loadingAssetFee}
                                      onChange={() => !state.loadingAssetFee && assetFeeHandler('set', nextAssetFee)}/>
                            <span className="text-sm ml-3 sm:flex sm:whitespace-nowrap">
                                {useNamiForBonus}
                            </span>
                        </div>
                    </div>
                </div>
                <Link href={PATHS.FEE_STRUCTURES.DEFAULT} prefetch={false}>
                    <a className="inline-block w-auto mt-4 lg:mt-10 2xl:mt-12 font-medium text-sm text-dominant cursor-pointer hover:!underline">
                        {seeFeeStructure}
                    </a>
                </Link>
            </div>
        );
    }, [state.useNami, state.level, state.loadingLevel, state.assetFee, state.loadingAssetFee, width]);

    const renderJourney = useCallback(() => {
        const _level = state.level || 0;
        let toUpgrade,
            namiBalanceLabel;
        if (language === LANGUAGE_TAG.VI) {
            toUpgrade = 'Để trở thành';
            namiBalanceLabel = 'Số dư NAMI';
        } else {
            toUpgrade = 'To upgrade to';
            namiBalanceLabel = 'Your NAMI balance';
        }

        const nextLevel = FEE_TABLE.find(e => e?.level === _level + 1);
        const currentPercent = state.namiBalance ? state.namiBalance * 100 / nextLevel?.nami_holding : '--';

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                    { width: `calc(80% / 3)` } : undefined}
                className="mt-12 xl:max-w-[306px] text-sm w-full mt-10 lg:w-1/2 lg:pl-5 xl:mt-0 xl:pl-5">
                <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    {toUpgrade} <span className="ml-1 text-dominant">{state.loadingLevel ?
                    <Skeletor width={45}/> : <>VIP {_level + 1}</>}</span>
                </div>
                {/*<div className="mt-4">*/}
                {/*    <div className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">1. 30d trade volume (BTC)</div>*/}
                {/*    <div className="my-2.5 relative w-full h-[10px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">*/}
                {/*        <div style={{ width: '20%' }}*/}
                {/*             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-between">*/}
                {/*        <span className="text-xs font-medium">*/}
                {/*            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>*/}
                {/*            <span>0.0215245781 BTC / 0.04%</span>*/}
                {/*        </span>*/}
                {/*        <span className="text-xs font-medium">*/}
                {/*            <span className="">*/}
                {/*                50.00 BTC*/}
                {/*            </span>*/}
                {/*            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>*/}
                {/*        </span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="mt-4">
                    <div
                        className="flex items-center justify-between font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {namiBalanceLabel}
                        <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({
                            fromAsset: 'VNDC',
                            toAsset: ROOT_TOKEN
                        })}>
                            <a className="text-dominant hover:!underline">{t('common:buy')} NAMI</a>
                        </Link>
                    </div>
                    <div
                        className="my-2.5 relative w-full h-[6px] xl:h-[6px] rounded-xl bg-teal-lightTeal dark:bg-teal-opacity overflow-hidden">
                        <div style={{ width: `${currentPercent}%` }}
                             className="absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in"/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-medium">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">VIP {_level}</span>
                            <span className="inline-flex items-center">
                                {(state.loadingLevel && !state.namiBalance) ? <Skeletor width={45}
                                                                                        height={16}/> : formatNumber(state.namiBalance) + ` ${ROOT_TOKEN}`}
                                {' '}/ {(state.loadingLevel && !state.namiBalance) ?
                                <Skeletor width={45} height={16}/> : formatNumber(currentPercent) + '%'}
                            </span>
                        </span>
                        <span className="text-xs font-medium">
                            <span className="">
                                {formatNumber(nextLevel?.nami_holding, 0)} {ROOT_TOKEN}
                            </span>
                            <span className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">VIP {_level + 1}</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }, [state.level, state.loadingLevel, state.namiBalance, width, language]);

    const renderActivities = useCallback(() => {
        if (state.loadingActivity) {
            const skeleton = [];
            for (let i = 0; i < 5; ++i) {
                skeleton.push(
                    <div key={`act_skeleton__${i}`} className="flex justify-between text-sm font-medium mb-5">
                        <div>
                            <div className="device font-bold"><Skeletor width={100}/></div>
                            <div className="location mt-2"><Skeletor width={65}/></div>
                        </div>
                        <div className="">
                            <div className="ip-address text-right"><Skeletor width={75}/></div>
                            <div className="date-time mt-2 flex justify-end">
                                <Skeletor width={65}/>
                            </div>
                        </div>
                    </div>
                );
            }
            return skeleton;
        }

        if (!state.activitiesLog) return null;

        const thisDevice = state.activitiesLog?.[state.activitiesLog?.findIndex(e => e?.this_device)]?.id;

        return state.activitiesLog?.map(log => {
            let statusInner;
            const isThisDevice = thisDevice === log?.id;

            if (log?.status === USER_DEVICE_STATUS.LOGGED_OUT) {
                statusInner = <><span className="text-red">{t('profile:account_status.logged_out')}</span></>;
            } else if (log?.status === USER_DEVICE_STATUS.REVOKED) {
                statusInner = <><span className="text-yellow">{t('profile:account_status.revoked')}</span></>;
            } else if (log?.status === USER_DEVICE_STATUS.BANNED) {
                statusInner = <><span className="text-red">{t('profile:account_status.banned')}</span></>;
            } else if (isThisDevice) {
                statusInner = <><span className="text-dominant">{t('profile:this_device')}</span> <CheckSuccess
                    size={14} className="ml-1"/></>;
            }

            return (
                <div key={log?.id} className="flex justify-between text-sm font-medium mb-5">
                    <div>
                        <div className="device font-bold flex items-center">
                            <span
                                className="inline-block sm:max-w-[110px] sm:max-w-none truncate">{log?.device_title}</span>
                            <span className="ml-4 text-xs xl:text-sm font-normal inline-flex items-center">
                               {statusInner}
                            </span>
                        </div>
                        <div className="location mt-2 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                            {log?.last_location}
                        </div>
                    </div>
                    <div className="hidden sm:flex">
                        <div className="pr-2">
                            <div data-tip="" data-for={`ip_address_${log?.last_ip_address}`}
                                 className="ip-address text-right">
                                {log?.last_ip_address || EMPTY_VALUE}
                            </div>
                            <div
                                className="date-time mt-2 text-xs sm:text-sm text-right text-txtSecondary dark:text-txtSecondary-dark">
                                {formatTime(log?.last_logged_in, 'dd-MM-yyyy')}
                                <span className="ml-3">{formatTime(log?.last_logged_in, 'HH:mm')}</span>
                            </div>
                        </div>
                        <div
                            onClick={(e) => log?.status === 0 && onOpenRevokeContext(e, log?.id, log?.device_title, isThisDevice)}
                            className={log?.status === 0 ? '' : ' invisible pointer-event-none'}>
                            <MoreVertical size={16} strokeWidth={1}
                                          className="mt-1 text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:!text-dominant"
                            />
                        </div>
                    </div>
                </div>
            );
        });

    }, [state.loadingActivity, state.activitiesLog]);

    const renderRevokeContext = useCallback(() => {
        return (
            <Menu id={MENU_CONTEXT}
                  animation={false}
                  style={{ boxShadow: 'none' }}
                  className="!min-w-[100px] !w-auto !p-0 !rounded-lg !overflow-hidden
                             !drop-shadow-onlyLight dark:!drop-shadow-none !bg-gray-3 dark:!bg-darkBlue-3"
            >
                <div
                    className="block text-center text-sm font-medium px-2 py-2.5 border-b border-divider dark:border-divider-dark cursor-pointer hover:text-dominant"
                    onClick={openRevokeModal}>
                    {t('profile:revoke_this_device')}
                </div>
            </Menu>
        );
    }, [state.revokeObj?.revokeId, state.revokeObj?.isThisDevice]);

    const renderRevokeAll = useCallback(() => {
        const id = state.revokeObj?.revokeId;
        const device = state.revokeObj?.device;
        const isThisDevice = state.revokeObj?.isThisDevice;

        return (
            <ReModal useOverlay
                     position="center"
                     isVisible={!!state.openModal?.revokeAll}
                     onBackdropCb={onCloseModal}
                     onNegativeCb={onCloseModal}
                     onPositiveCb={() => onRevoke(id || 'all', isThisDevice)}
                     onPositiveLoading={state.revokingDevices}
                     className="px-6"
            >
                <div className="mb-4 text-center font-medium">
                    <div className="font-bold text-center uppercase">{t('profile:revoke_title')}</div>
                    <div className="mt-4 font-normal">
                        {id ? t('profile:revoke_question', { device }) : t('profile:revoke_question_all')}
                    </div>
                </div>
            </ReModal>
        );
    }, [state.openModal?.revokeAll, state.revokingDevices, state.revokeObj]);

    const renderAnnoucements = useCallback(() => {
        if (state.loadingAnnouncements) {
            const skeleton = [];
            for (let i = 0; i < 5; ++i) {
                skeleton.push(
                    <div key={`announcement_skeleton__${i}`} className="text-sm font-medium mb-5">
                        <div className="device font-bold">
                            <Skeletor width={150}/>
                        </div>
                        <div className="location mt-2">
                            <Skeletor width={100}/>
                        </div>
                    </div>
                );
            }
            return skeleton;
        }

        if (!state.announcements) return null;

        return state.announcements.map((article) => {
            let mode,
                topic,
                ownedTags,
                _tagsLib,
                categories;
            const isNoti = !!article?.tags?.find((o) =>
                o.slug?.includes('noti-')
            );

            if (isNoti) {
                mode = 'announcement';
                categories = SupportCategories.announcements[language];
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'noti')
                    ?.map((o) =>
                        o?.slug
                            ?.replace('noti-vi-', '')
                            ?.replace('noti-en-', '')
                    );
            } else {
                mode = 'faq';
                categories = SupportCategories.faq[language];
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'faq')
                    ?.map((o) =>
                        o?.slug?.replace('faq-vi-', '')
                            ?.replace('faq-en-', '')
                    );
            }

            _tagsLib = categories.map((o) => o.displaySlug);

            ownedTags.forEach((e) => {
                if (_tagsLib.includes(e)) topic = e;
            });

            return <div key={article.id} className="block text-sm font-medium mb-5">
                <a className="device font-bold hover:text-dominant hover:!underline"
                   href={
                       PATHS.SUPPORT.DEFAULT +
                       `/${mode}/${topic}/${article.slug.toString()}${isApp ? '?source=app' : ''
                       }`
                   }
                   target="_blank">
                    {article.title}
                </a>

                <div className="location mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                    {formatTime(article.created_at, 'dd-MM-yyyy HH:mm')}
                </div>
            </div>;
        });
    }, [state.announcements, state.loadingAnnouncements]);

    useEffect(() => {
        assetFeeHandler('get');
        getLoginLogs();
        getLevel();
    }, []);

    useEffect(() => {
        getAnnouncements(language);
    }, [language]);

    useEffect(() => {
        user && setState({
            user: {
                name: user?.name || '--',
                username: user?.username || '--',
                phone: user?.phone || '--',
                email: user?.email || '--',
                namiId: user?.code || '--'
            }
        });
    }, [user]);

    // useEffect(() => {
    //     console.log('namidev-DEBUG: State => ', state)
    // }, [state])

    return (
        <>
            {!user ? <NeedLogin addClass="h-[380px] flex justify-center items-center"/>
                : <>
                    <div className="pb-20 lg:pb-24 2xl:pb-32">
                        <div className="font-bold leading-[40px] text-[26px] mb-6">
                            {t('navbar:menu.user.profile')}
                        </div>
                        <MCard
                            addClass="lg:flex lg:flex-wrap lg:justify-between px-7 py-8 lg:p-10 xl:px-7 xl:py-8 w-full drop-shadow-onlyLight border border-transparent dark:drop-shadow-none dark:border-divider-dark">
                            {renderUserPersona()}
                            {renderUserInfo()}
                            {renderFee()}
                            {renderJourney()}
                        </MCard>

                        <div className="mt-10 flex flex-col lg:flex-row">
                            <div className="w-full lg:w-1/2 lg:pr-2.5">
                                <div className="flex justify-between items-center">
                                    <div className="t-common">{t('profile:activity')}</div>
                                    <span
                                        className="flex items-center font-medium text-red hover:!underline cursor-pointer"
                                        onClick={openRevokeModal}>
                                        {t('profile:revoke_all_devices')} <ChevronRight className="ml-2" size={20}/>
                                    </span>
                                </div>
                                <MCard
                                    style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                                    addClass="mt-5 p-4 sm:p-6 lg:p-7 min-h-[356px] dark:border dark:border-divider-dark !overflow-hidden">
                                    <div className="max-h-[300px] pr-4 overflow-y-auto">
                                        {renderActivities()}
                                    </div>
                                </MCard>
                            </div>
                            <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:pl-2.5">
                                <div className="t-common">
                                    {t('profile:announcements')}
                                </div>
                                <MCard
                                    style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                                    addClass="max-h-[400px] min-h-[356px] overflow-y-auto mt-5 p-4 sm:p-6 lg:p-7 dark:border dark:border-divider-dark !overflow-hidden">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {renderAnnoucements()}
                                        {renderRevokeContext()}
                                    </div>
                                </MCard>
                            </div>
                        </div>
                    </div>
                    <AvatarModal isVisible={!!state.openModal?.avatar} onCloseModal={onCloseModal}/>
                    {renderRevokeAll()}
                </>
            }
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification'])
    }
});

export default withTabLayout(
    {
        routes: TAB_ROUTES.ACCOUNT
    }
)(AccountProfile);
