import { Dialog, Popover, Transition } from '@headlessui/react';
import { getLoginUrl, getS3Url } from 'src/redux/actions/utils';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useRef, useState } from 'react';
import { ChevronRight, XCircle } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { iconColor } from 'src/config/colors';
import { DOWNLOAD_APP_LINK, LS_KEYS } from 'src/redux/actions/const';
import { actionLogout } from 'src/redux/actions/user';
import NotificationList from '../notification/NotificationList';
import { IconLogout, IconProfile, } from './Icons';
import { PATHS } from 'constants/paths';

const { NEXT_PUBLIC_API_URL } = process.env;

const NavBar = () => {
    const { t } = useTranslation(['navbar', 'common']);
    const router = useRouter();
    const { route, locale, query } = router;
    const user = useSelector(state => state.auth.user) || null;
    const loadingUser = useSelector(state => state.auth.loadingUser);
    const dispatch = useDispatch();
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const cancelButtonRef = useRef();
    const cancelButtonRegisterRef = useRef();

    const [open, setOpen] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };
    const closeModalRegister = () => {
        setOpenRegister(false);
    };
    const openModalRegister = () => {
        setOpen(false);
        setOpenRegister(true);
    };

    const urlAvatar = () => {
        if (user?.avatar) {
            if (user?.avatar?.includes?.('https://') || user?.avatar?.includes?.('http://')) return user?.avatar;
            return getS3Url(user?.avatar);
        }
        return '/images/avatar.png';
    };

    const menu = [
        {
            name: 'trade',
            route: '/trade',
            icon: '',
        },
        {
            name: 'swap',
            route: '/swap',
            icon: '',
        },
        {
            name: 'wallet',
            submenu: [
                {
                    name: 'spot',
                    route: PATHS.WALLET.EXCHANGE.DEFAULT
                },
                {
                    name: 'futures',
                    route: PATHS.WALLET.FUTURES
                },
                {
                    name: 'farming',
                    route: PATHS.WALLET.FARMING
                },
                {
                    name: 'stake',
                    route: PATHS.WALLET.STAKING
                },
            ],
        },
        {
            name: 'futures',
            route: PATHS.WALLET.FUTURES,
            icon: '',
        },
    ];
    const menuMobile = [
        {
            name: 'home',
            route: `${NEXT_PUBLIC_API_URL}`,
            disabled: false,
        },
    ];
    const clearLS = () => {
        localStorage.removeItem(LS_KEYS.SPOT_LAYOUT);
        localStorage.removeItem(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR);
        localStorage.removeItem(LS_KEYS.SPOT_ON_SIDEBAR);
        localStorage.removeItem(LS_KEYS.SPOT_MAX_CHART);
        window.location.reload();
    };

    const changeLanguage = () => {
        if (locale === 'vi') return router.push(route, query, { locale: 'en' });
        return router.push(route, query, { locale: 'vi' });
    };

    const _renderMenuHaveSubMenu = (item, key) => (
        <Popover className="relative" key={key}>
            {({ open }) => (
                <>
                    <Popover.Button
                        key={`Popover:${item.name}`}
                        type="button"
                        className="inline-flex items-center focus:outline-none"
                        aria-expanded="false"
                    >
                        <span className={`navbar-item ${open ? 'active' : ''}`}>{t(`menu.${item.name}`)}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L8 10L12 6" stroke="#223050" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                    </Popover.Button>
                    <Transition
                        key={`Transition${key}`}
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-10 mt-3 transform w-screen max-w-[18rem] rounded-md bg-white shadow-xl"
                        >
                            <div
                                className="overflow-hidden"
                            >
                                {item.submenu.map((sub, iSub) => (
                                    sub.disabled
                                        ? (
                                            <div key={iSub + sub?.name} className="relative grid gap-6 bg-white sm:gap-8">
                                                <a className="navbar-item-link group disabled">
                                                    <span className="text-black-500">
                                                        {sub.icon}
                                                    </span>
                                                    <div className="ml-3">
                                                        <div className="flex items-center">
                                                            <span className="text-sm font-medium text-black-400">
                                                                {t(`submenu.${sub.name}`)}
                                                            </span>
                                                            <span className="label label-red ml-3">{t('coming_soon')}</span>
                                                        </div>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {t(`submenu.${sub.name}_description`)}
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                        : (
                                            <div key={iSub + sub?.name} className="relative grid gap-6 sm:gap-8">
                                                <Link href={sub.route} locale={locale} prefetch={false}>
                                                    <a
                                                        className="navbar-item-link group "
                                                    >
                                                        <span className="text-black-500 group-hover:text-violet-700">
                                                            {sub.icon}
                                                        </span>
                                                        <div className="ml-3">
                                                            <div className="flex items-center">
                                                                <span
                                                                    className="text-sm font-medium group-hover:text-violet-700"
                                                                >
                                                                    {t(`submenu.${sub.name}`)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {t(`submenu.${sub.name}_description`)}
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        )
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );

    const _renderMenu = (item, key) => {
        if (item.disabled) {
            return (
                <div
                    className="flex items-center cursor-not-allowed"
                    key={key}
                >
                    <p
                        className="navbar-item text-black-400"
                    >
                        {t(`menu.${item.name}`)}
                    </p>
                    <span className="label label-red ml-3">{t('coming_soon')}</span>
                </div>
            );
        }
        return (
            <Link href={item.route} locale={locale} key={key} prefetch={false}>
                <a className="navbar-item">
                    {t(`menu.${item.name}`)}
                </a>
            </Link>
        );
    };

    return (
        <>
            <header className="relative bg-white">
                <div className="mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between py-2.5 md:space-x-10">
                        <div className="flex justify-start">
                            <Link href={NEXT_PUBLIC_API_URL} locale={locale} prefetch={false}>
                                <div className="flex-shrink-0 flex items-center">
                                    <Image
                                        className="hidden lg:block h-10 w-auto clickable"
                                        src="/images/logo/logo.svg"
                                        alt="Nami Exchange"
                                        height={28}
                                        width={32}
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="-mr-2 -my-2 md:hidden">
                            <button
                                type="button"
                                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-inset"
                                aria-expanded="false"
                                onClick={openModal}
                            >
                                <span className="sr-only">Open menu</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                        <nav className="navbar hidden md:flex items-center">
                            {menu.map((m, iM) => (m.submenu ? _renderMenuHaveSubMenu(m, iM) : _renderMenu(m, iM)),
                            )}
                        </nav>

                        {
                            (!user && !loadingUser)
                            &&
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <a href={getLoginUrl('sso', 'login')} className="hidden md:block btn">
                                    {t('common:sign_in')}
                                </a>
                                <a href={getLoginUrl('sso', 'register')} className="hidden md:block btn btn-primary">
                                    {t('common:sign_up')}
                                </a>
                            </div>
                        }
                        {
                            (user && !loadingUser)
                            &&
                            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                                <NotificationList/>
                                <Popover className="relative">
                                    <Popover.Button
                                        type="button"
                                        className="inline-flex items-center focus:outline-none h-11"
                                        aria-expanded="false"
                                    >
                                        <span className="mr-3">
                                            <img src={urlAvatar()} width={28} height={28}
                                                 className="rounded-full w-7 h-7 min-w-[28px]"/>
                                        </span>
                                        <span
                                            className="text-sm font-semibold"
                                        >{user?.username || (user?.email || 'Nami User').substring(0, 30)}
                                        </span>

                                    </Popover.Button>
                                    <Popover.Panel
                                        // static
                                        className="absolute z-10 transform w-48 rounded right-0 bg-white shadow-xl text-sm"
                                    >
                                        <div className="overflow-hidden">
                                            <div>
                                                <Link href="/my/account/profile" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-2 py-2 flex items-center hover:bg-teal-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black group-hover:text-teal">
                                                            <IconProfile size={16}/>
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-teal"
                                                        >{t('account')}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/my/account/profile" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-2 py-2 flex items-center hover:bg-teal-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black group-hover:text-teal">
                                                            <IconProfile size={16}/>
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-teal"
                                                        >{t('account')}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/my/account/profile" locale={locale} prefetch={false}>
                                                    <div
                                                        className="px-2 py-2 flex items-center hover:bg-teal-5 font-medium cursor-pointer group"
                                                    >
                                                        <span className="text-black group-hover:text-teal">
                                                            <IconProfile size={16}/>
                                                        </span>
                                                        <span
                                                            className="ml-3 flex-grow text-black-700 group-hover:text-teal"
                                                        >{t('account')}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="border-0 border-t border-black-200 font-medium">
                                                <div
                                                    className="px-2 py-2 flex items-center hover:bg-teal-5 font-medium cursor-pointer group"
                                                    onClick={async () => {
                                                        await dispatch(await actionLogout());
                                                        clearLS();
                                                    }}
                                                >
                                                    <span className="text-black-500 group-hover:text-teal">
                                                        <IconLogout size={16}/>
                                                    </span>
                                                    <span
                                                        className="ml-3 text-black-700 group-hover:text-teal"
                                                    >{t('logout')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </div>
                        }
                    </div>
                </div>
                <Transition show={open} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRef}
                        static
                        open={open}
                        onClose={closeModal}
                    >
                        <div className="min-h-screen text-right">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70"/>
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300 transform transition-all"
                                enterFrom="w-0"
                                enterTo="w-5/6"
                                leave="ease-in duration-300 transform"
                                leaveFrom=" -translate-x-3/4"
                                leaveTo="translate-x-full"
                            >
                                <div
                                    className=" w-3/4 inline-block overflow-hidden text-left align-middle bg-white shadow-xl h-screen relative"
                                >
                                    <Dialog.Title className="px-5 mt-4">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                            <button className="btn btn-icon" type="button" onClick={closeModal}>
                                                <ChevronRight color={iconColor} size={24}/>
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="px-5">

                                        {menuMobile.map((m, index) => (m.disabled ? (
                                                <div className="border-0 border-b border-black-200 py-4 font-bold"
                                                     key={index}>
                                                    <div className="flex items-center">
                                                        <span>{t(`menu.${m.name}`)}</span>
                                                        <span className="label label-red ml-3">
                                                        {t('coming_soon')}
                                                    </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Link href={m.route} locale={locale} key={index} prefetch={false}>
                                                    <div className="border-0 border-b border-black-200 py-4 font-bold">
                                                        <div className="flex items-center">
                                                            <span>{t(`menu.${m.name}`)}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )),
                                        )}
                                        {
                                            (!user && !loadingUser) && (
                                                <div className="mt-[100px]">
                                                    <div>
                                                        <button
                                                            className="btn btn-primary w-full"
                                                            type="button"
                                                            onClick={openModalRegister}
                                                        >
                                                            {t('common:sign_up')}
                                                        </button>
                                                    </div>
                                                    <div className="text-xs text-center mt-3">
                                                        <span className="text-black-500 ">
                                                            Bạn đã có tài khoản?&nbsp;
                                                        </span>
                                                        <span
                                                            className="text-teal font-bold"
                                                            onClick={openModalRegister}
                                                        >
                                                            Đăng nhập
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
                <Transition show={openRegister} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRegisterRef}
                        static
                        open={openRegister}
                        onClose={closeModalRegister}
                    >
                        <div className="md:min-h-screen min-h-[calc(100%-10rem)] px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70"/>
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div
                                    className="inline-block w-full mb-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                                >
                                    <Dialog.Title className="">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                            <button
                                                className="btn btn-icon"
                                                type="button"
                                                onClick={closeModalRegister}
                                            >
                                                <XCircle color={iconColor} size={24}/>
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="text-sm rounded-2xl bg-white">
                                        <div className="bg-black-5 rounded-t-2xl py-4">
                                            <img src={getS3Url('/images/bg/dialog-register-header.svg')} alt=""
                                                 className="mx-auto"/>
                                        </div>
                                        <div className="px-6 py-8 text-center !font-bold">
                                            <div className="text-xl">{t('landing:download_app_hint')}</div>
                                            <div className="text-xl text-teal mb-[30px]">Nami Exchange</div>
                                            <div className="">
                                                <a
                                                    href={DOWNLOAD_APP_LINK.IOS}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-black w-full mb-2"
                                                        type="button"
                                                        rel="noreferrer"
                                                    >
                                                        {t('landing:download_app_hint_appstore')}
                                                    </button>
                                                </a>
                                                <a
                                                    href={DOWNLOAD_APP_LINK.ANDROID}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-primary w-full"
                                                        type="button"
                                                    >
                                                        {t('landing:download_app_hint_googleplay')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </header>
        </>
    );
};

export default NavBar;
