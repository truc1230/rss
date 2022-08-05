import { Popover, Transition } from '@headlessui/react';
import SvgMoon from 'src/components/svg/Moon';
import Setting from 'src/components/svg/Setting';
import SvgSun from 'src/components/svg/Sun';
import useDarkMode from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import colors from 'styles/colors';
import useLanguage from 'hooks/useLanguage';
import Toggle from 'src/components/common/input/Toggle';
import { getS3Url } from 'redux/actions/utils';
import RadioBox from '../../common/RadioBox';

const FuturesSetting = (props) => {
    const {
        spotState,
        onChangeSpotState,
        resetDefault,
        className
    } = props;

    const [currentTheme, onThemeSwitch] = useDarkMode();
    const [currentLocale, onChangeLang] = useLanguage();
    const router = useRouter();
    const { t } = useTranslation();
    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;

    const FuturesComponents = [
        {
            value: t('futures:setting:favorites'), key: 'isShowFavorites', visible: true
        },
        {
            value: t('futures:setting:pair_detail'), key: 'isShowPairDetail', visible: true
        },
        {
            value: t('futures:setting:chart'), key: 'isShowChart', visible: true
        },
        {
            value: t('common:orderbook'), key: 'isShowOrderBook', visible: !isVndcFutures
        },
        {
            value: t('common:trades'), key: 'isShowTrades', visible: !isVndcFutures
        },
        {
            value: t('futures:setting:orders_history'), key: 'isShowOpenOrders', visible: true
        },
        {
            value: t('futures:setting:place_order'), key: 'isShowPlaceOrder', visible: true
        },
        {
            value: t('common:assets'), key: 'isShowAssets', visible: true
        },
    ];
    const {
        route,
        query,
    } = router;
    const {
        layout,
        id,
    } = query;
    const [layoutMode, setLayoutMode] = useState(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);

    const onChangeLayout = (_layout) => {
        const nextUrl = `/${currentLocale}${route.replace('[id]', id)}`;
        window.location = `${nextUrl}?layout=${_layout}`;
    };
    const inActiveLabel =
        currentTheme === 'dark' ? colors.gray4 : colors.darkBlue;

    const onChangeFuturesComponent = (key, value) => {
        const _newSpotState = spotState;
        spotState[key] = value;
        localStorage.setItem('settingLayoutFutures', JSON.stringify(spotState));
        onChangeSpotState({
            ...spotState,
            ..._newSpotState,
        });
    };

    const settingLayout = useMemo(() => {
        const settings = localStorage.getItem('settingLayoutFutures');
        return settings ? JSON.parse(settings) : {}
    }, [spotState])

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`h-full flex items-center ml-2 ${open ? '' : 'text-opacity-90'
                            } text-white group px-2 ${className}`}
                    >
                        <Setting
                            size={20}
                            color={
                                currentTheme === 'dark'
                                    ? colors.white
                                    : colors.darkBlue
                            }
                        />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-10">
                            <div
                                className="w-80  rounded-lg shadow-md bg-bgPrimary dark:bg-darkBlue-2 divide-solid divide-divider dark:divide-divider-dark divide-y"
                            >
                                <div className="px-5 py-3 flex justify-between">
                                    <span className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                        {t('spot:setting.theme')}
                                    </span>
                                    <span className="flex">
                                        <SvgMoon
                                            className="mr-2 cursor-pointer"
                                            size={20}
                                            color={
                                                currentTheme === 'dark'
                                                    ? colors.teal
                                                    : inActiveLabel
                                            }
                                            onClick={
                                                currentTheme === 'light'
                                                    ? onThemeSwitch
                                                    : undefined
                                            }
                                        />
                                        <SvgSun
                                            className="cursor-pointer"
                                            size={20}
                                            onClick={
                                                currentTheme === 'dark'
                                                    ? onThemeSwitch
                                                    : undefined
                                            }
                                            color={
                                                currentTheme === 'light'
                                                    ? colors.teal
                                                    : inActiveLabel
                                            }
                                        />
                                    </span>
                                </div>

                                <div className="px-5 py-3">
                                    <div
                                        className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold mb-4"
                                    >
                                        {t('spot:setting.layout')}
                                    </div>

                                    <div className="flex justify-around">

                                        <div className="flex flex-col justify-center items-center">
                                            <div className="mb-[10px]">
                                                <RadioBox
                                                    id='pro'
                                                    label={t('futures:order_mode')}
                                                    checked={true}
                                                />
                                            </div>
                                            <img
                                                className={'cursor-pointer' + (layoutMode === SPOT_LAYOUT_MODE.PRO ? 'border-2 border-teal' : '')}
                                                src={getS3Url(`/images/icon/mode-advance${currentTheme === 'dark'
                                                    ? '-dark'
                                                    : ''
                                                    }.jpg`)}
                                                alt="Spot Advance"
                                                width={82}
                                                height={55}
                                            />
                                            <span
                                                className="text-xs text-txtPrimary dark:text-txtPrimary-dark font-medium text-center"
                                            >
                                                {t('spot:setting.pro')}
                                            </span>
                                        </div>
                                        <div className="text-center justify-center items-center">
                                            <div className="mb-[10px]">
                                                <RadioBox
                                                    id='full-screen'
                                                    label={t('futures:comming_soon')}
                                                    checked={false}
                                                />
                                            </div>
                                            <img
                                                src={getS3Url(`/images/icon/mode-fullscreen${currentTheme === "dark"
                                                    ? "-dark"
                                                    : ""
                                                    }.jpg`)}
                                                alt="Spot Full Screen"
                                                width={82}
                                                height={55}
                                            />
                                            <span className="text-xs text-txtPrimary dark:text-txtPrimary-dark font-medium">
                                                {t('futures:fullscreen')}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="px-5 py-3 text-center">
                                    {FuturesComponents.map((item, index) => {
                                        const {
                                            value,
                                            key,
                                            visible
                                        } = item;

                                        if (!visible) return null;
                                        return (
                                            <div className="h-6 my-1 flex justify-between" key={key + index}>
                                                <span
                                                    className="font-medium text-sm text-txtPrimary dark:text-txtPrimary-dark"
                                                >{value}
                                                </span>
                                                <Toggle
                                                    checked={settingLayout?.[key]}
                                                    onChange={(value) => onChangeFuturesComponent(key, value)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="px-5 py-3 text-center">
                                    <span className="text-sm text-teal font-medium cursor-pointer" onClick={() => resetDefault()}>
                                        {t('spot:setting.reset_default_layout')}
                                    </span>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default FuturesSetting;
