import React, { useEffect, useMemo, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { formatCurrency, formatWallet, getS3Url } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import { keyBy, map } from 'lodash';
import { getUsdRate } from 'redux/actions/market';
import { sumBy } from 'lodash/math';
import SortIcon from 'components/screens/Mobile/SortIcon';
import SvgLock from 'components/svg/SvgLock';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import { MIN_WALLET } from 'constants/constants';
import { getDownloadAppLinkForWebView } from 'utils/helpers';
import { useRouter } from 'next/router';

const TABS = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}

const btcRateId = 9

const SPOT_WALLET_TOKENS = ['NAMI', 'USDT', 'VNDC', 'KAI', 'ONUS', 'ATS', 'WHC']
const FUTURES_WALLET_TOKENS = ['NAMI', 'USDT', 'VNDC']

const MarketScreen = () => {
    // * Initial State
    const [tabActive, setTabActive] = useState(TABS.SPOT)

    const [usdRates, setUsdRates] = useState([])
    const [sort, setSort] = useState({
        field: 'usdValue',
        direction: 'desc',
    })

    const user = useSelector((state) => state.auth.user) || {}
    const walletSpots = useSelector((state) => state.wallet?.SPOT) || {}
    const walletFutures = useSelector((state) => state.wallet?.FUTURES) || {}
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || []

    const router = useRouter()
    const { t } = useTranslation(['common'])
    const [themeMode] = useDarkMode()

    const getUserUrlAvatar = () => {
        if (user?.avatar) {
            if (
                user?.avatar?.includes?.('https://') ||
                user?.avatar?.includes?.('http://')
            )
                return user?.avatar
            return getS3Url(user?.avatar)
        }
        return '/images/default_avatar.png'
    }

    const tabTitles = {
        [TABS.SPOT]: t('wallet:spot'),
        [TABS.FUTURES]: t('wallet:futures'),
    }

    const changeSort = (field) => () => {
        if (field !== sort.field) {
            setSort({ field, direction: 'asc' })
        } else {
            switch (sort.direction) {
                case 'asc':
                    setSort({ field, direction: 'desc' })
                    break
                case 'desc':
                    setSort({ field: '', direction: '' })
                    break
                default:
                    setSort({ field, direction: 'asc' })
                    break
            }
        }
    }

    useEffect(() => {
        getUsdRate().then((usdRates) => {
            setUsdRates(usdRates)
        })
    }, [])

    const assetConfigMap = useMemo(() => {
        return keyBy(assetConfigs, 'id')
    }, [assetConfigs])

    const { listWallet, totalUsdValue, totalBtcValue } = useMemo(() => {
        const allWallets = tabActive === TABS.SPOT ? walletSpots : walletFutures

        const toUsdValue = (assetId, value) => (usdRates[assetId] || 0) * value

        const listAllWallet = map(allWallets, (v, k) => {
            const assetConfig = assetConfigMap[k]
            if (!assetConfig) return

            const value = v?.value < MIN_WALLET ? 0 : v?.value
            const lockedValue = v?.value < MIN_WALLET ? 0 : v?.locked_value
            const available = value - lockedValue

            return {
                value,
                lockedValue,
                available,
                usdAvailableValue: toUsdValue(assetConfig.id, available),
                usdValue: toUsdValue(assetConfig.id, value),
                ...assetConfig,
            }
        }).filter((e) => !!e)

        const totalUsdValue = sumBy(listAllWallet, 'usdValue')
        const totalBtcValue = totalUsdValue / usdRates[btcRateId]

        return {
            listWallet: listAllWallet
                .filter((w) => {
                    return (
                        tabActive === TABS.SPOT
                            ? SPOT_WALLET_TOKENS
                            : FUTURES_WALLET_TOKENS
                    ).includes(w.assetCode)
                })
                .sort((a, b) => {
                    if (!sort.field || !sort.direction) return 0
                    if (a[sort.field] > b[sort.field]) {
                        return sort.direction === 'asc' ? 1 : -1
                    } else {
                        return sort.direction === 'asc' ? -1 : 1
                    }
                }),
            totalUsdValue,
            totalBtcValue,
        }
    }, [walletSpots, walletFutures, assetConfigs, tabActive, sort, usdRates])

    return (
        <LayoutMobile>
            <div className='h-[calc(100vh-70px)]'>
                <div className='market-mobile'>
                    <div className='flex p-4'>
                        <div className='flex-none w-[3.75rem] h-[3.75rem] rounded-full'>
                            <img
                                className='w-full h-full'
                                src={getUserUrlAvatar()}
                                alt={user.name}
                            />
                        </div>
                        <div className='flex flex-wrap flex-1 items-center justify-between space-y-1 ml-3'>
                            <div>
                                <p className='text-txtPrimary dark:text-txtPrimary-dark font-semibold whitespace-nowrap min-w-0 truncate'>
                                    {t('common:ext_gate:hi_user', {
                                        who: user.name,
                                    })}
                                </p>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark font-medium text-sm'>
                                    {user.code}
                                </span>
                            </div>
                            <div
                                className='flex rounded p-2 border border-teal cursor-pointer'
                                onClick={() => {
                                    window.open(getDownloadAppLinkForWebView())
                                }}
                            >
                                <img
                                    src={getS3Url(
                                        '/images/logo/nami_maldives.png'
                                    )}
                                    className='w-4 h-4'
                                    alt=''
                                />
                                <span className='text-xs font-medium text-teal ml-2'>
                                    {t('common:global_btn:download_app')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex space-x-8 px-4 mt-6'>
                            {Object.values(TABS).map((t) => {
                                return (
                                    <div
                                        key={t}
                                        className='flex cursor-pointer text-txtSecondary dark:text-txtSecondary-dark'
                                        onClick={() => setTabActive(t)}
                                    >
                                        <span
                                            className={cn(
                                                'font-medium text-sm ml-2 pb-3 relative',
                                                {
                                                    'tab-active text-txtPrimary dark:text-txtPrimary-dark':
                                                        t === tabActive,
                                                }
                                            )}
                                        >
                                            {tabTitles[t]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='market-list flex flex-col flex-1 min-h-0 px-1 pt-6 pb-3 bg-white dark:bg-darkBlue-2'>
                        <div className='pb-4 px-3'>
                            <p className='text-txtSecondary dark:text-txtSecondary-dark'>
                                {t('wallet:total_balance')}
                            </p>
                            <div className='flex flex-wrap items-end'>
                                <span className='text-teal font-medium leading-7 mr-1'>
                                    {formatWallet(totalBtcValue, 6)} BTC
                                </span>
                                <span className='font-medium text-sm leading-7'>
                                    ($ {formatWallet(totalUsdValue, 0)})
                                </span>
                            </div>
                        </div>
                        <div className='flex justify-between border-t border-gray-4 px-3 pt-5 pb-2 dark:border-darkBlue-3'>
                            <TitleHeadList
                                onClick={changeSort('assetCode')}
                                sortDirection={
                                    sort.field === 'assetCode'
                                        ? sort.direction
                                        : ''
                                }
                                title={t('wallet:asset')}
                            />
                            <TitleHeadList
                                onClick={changeSort('usdValue')}
                                sortDirection={
                                    sort.field === 'usdValue'
                                        ? sort.direction
                                        : ''
                                }
                                title={t('wallet:value')}
                            />
                        </div>
                        <div className='flex flex-col flex-1 min-h-0 overflow-y-auto px-3'>
                            {listWallet.map((asset = {}) => {
                                return (
                                    <div
                                        className='flex justify-between items-center py-2 border-b border-gray-4 dark:border-darkBlue-3'
                                        onClick={() => {
                                            router.push(
                                                '/mobile/wallet/' +
                                                    asset.assetCode
                                            )
                                        }}
                                    >
                                        <div className='flex items-center'>
                                            <AssetLogo
                                                assetCode={asset.assetCode}
                                                size={30}
                                            />
                                            <div className='flex flex-col ml-3'>
                                                <span className='font-bold text-sm leading-5'>
                                                    {asset.assetCode}
                                                </span>
                                                <span className='text-xs leading-4'>
                                                    {asset.assetName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <div className='flex items-center space-x-1'>
                                                {asset.lockedValue > 0 && (
                                                    <>
                                                        <span className='text-txtSecondary dark:text-txtSecondary-dark text-xs'>
                                                            {formatCurrency(
                                                                +asset.lockedValue,
                                                                1
                                                            )}
                                                        </span>
                                                        <SvgLock
                                                            size={14}
                                                            color={
                                                                themeMode ===
                                                                THEME_MODE.DARK
                                                                    ? colors.darkBlue5
                                                                    : colors.grey1
                                                            }
                                                        />
                                                    </>
                                                )}
                                                <span className='font-medium text-sm'>
                                                    {formatWallet(
                                                        asset.value,
                                                        asset.assetDigit
                                                    )}
                                                </span>
                                            </div>
                                            <span className='text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                                                $ {formatWallet(asset.usdValue)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutMobile>
    )
}

const TitleHeadList = ({ title, className = '', onClick, sortDirection }) => {
    return (
        <div
            className={
                'flex items-center justify-end cursor-pointer ' + className
            }
            onClick={onClick}
        >
            <span className='text-txtSecondary dark:text-txtSecondary-dark text-xs leading-4'>
                {title}
            </span>
            <SortIcon direction={sortDirection} />
        </div>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'wallet',
            ])),
        },
    }
}

export default MarketScreen
