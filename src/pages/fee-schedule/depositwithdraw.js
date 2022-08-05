import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { API_GET_WALLET_CONFIG } from 'redux/actions/apis';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { formatNumber, walletLinkBuilder } from 'redux/actions/utils';
import { BREAK_POINTS } from 'constants/constants';
import { ApiStatus, WalletType } from 'redux/actions/const';
import { useRouter } from 'next/router';
import { EXCHANGE_ACTION } from 'pages/wallet';

import withTabLayout, { TAB_ROUTES, } from 'components/common/layouts/withTabLayout';
import useWindowSize from 'hooks/useWindowSize';
import SearchBox from 'components/common/SearchBox';
import Skeletor from 'components/common/Skeletor';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import MCard from 'components/common/MCard';
import Empty from 'components/common/Empty';
import Axios from 'axios';
import AssetLogo from 'components/wallet/AssetLogo';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useSelector } from 'react-redux';

const INITIAL_STATE = {
    search: '',
    currentPage: 1,
    configs: null,
    loadingConfigs: false,
}

const DepositWithdrawFee = () => {
    // Init state
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs)

    // Use hooks
    const router = useRouter()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { width } = useWindowSize()

    // Helper
    const getConfig = async () => {
        setState({ loadingConfigs: true })

        try {
            const { data } = await Axios.get(API_GET_WALLET_CONFIG)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                const configs = Object.values(data.data)
                // .filter(e => e.allowWithdraw.includes(true))
                setState({ configs })
            }
        } catch (e) {
            console.log(`Can't get withdraw config `, e)
        } finally {
            setState({ loadingConfigs: false })
        }
    }

    // Render Handler
    const renderTable = useCallback(() => {
        let data
        let tableStatus

        const rawData = paymentConfigs?.filter((e) =>
            e.assetCode?.toLowerCase().includes(state.search?.toLowerCase())
        )

        const columns = [
            {
                key: 'asset',
                dataIndex: 'asset',
                title: 'Coin / Token',
                width: 80,
                fixed: 'left',
                align: 'left',
            },
            {
                key: 'fullName',
                dataIndex: 'fullName',
                title: t('common:full_name'),
                width: 80,
                align: 'left',
            },
            {
                key: 'network',
                dataIndex: 'network',
                title: t('wallet:network'),
                width: 80,
                align: 'left',
                preventSort: true,
            },
            {
                key: 'min_withdraw',
                dataIndex: 'min_withdraw',
                title: t('wallet:min_withdraw'),
                width: 80,
                align: 'left',
                preventSort: true,
            },
            {
                key: 'deposit_fee',
                dataIndex: 'deposit_fee',
                title: t('wallet:deposit_fee'),
                width: 80,
                align: 'left',
                preventSort: true,
            },
            {
                key: 'withdraw_fee',
                dataIndex: 'withdraw_fee',
                title: t('wallet:withdraw_fee'),
                width: 80,
                align: 'left',
                preventSort: true,
            },
        ]

        if (state.loadingConfigs) {
            const skeleton = []
            for (let i = 0; i < ROW_LIMIT; ++i) {
                skeleton.push({ ...ROW_SKELETON, key: `asset__skeleton__${i}` })
            }
            data = skeleton
        } else {
            const _data = []
            rawData?.forEach((raw) => {
                const assetDigit = state.configs?.find(
                    (o) => o.assetCode === raw?.assetCode
                )?.assetDigit
                _data.push({
                    raw,
                    key: `asset_depwdl__item__${raw?.assetCode}`,
                    asset: (
                        <div className='flex items-center'>
                            <AssetLogo
                                assetCode={raw?.assetCode}
                                size={width >= BREAK_POINTS['2xl'] ? 32 : 24}
                            />
                            <span className='ml-2.5 text-sm'>
                                {raw?.assetCode}
                            </span>
                        </div>
                    ),
                    fullName: (
                        <span className='text-sm'>
                            {raw?.assetFullName || raw?.assetCode}
                        </span>
                    ),
                    network: (
                        <div>
                            {raw?.networkList?.map((network, index) => (
                                <div
                                    key={`network__${index}`}
                                    className='mb-1 text-sm last:mb-0'
                                >
                                    {network?.name}
                                </div>
                            ))}
                        </div>
                    ),
                    min_withdraw: (
                        <div>
                            {raw?.networkList?.map((network, index) => (
                                <div
                                    key={`minWithdraw__${index}`}
                                    className='mb-1 text-sm last:mb-0'
                                >
                                    {formatNumber(
                                        network?.withdrawMin,
                                        assetDigit,
                                        network?.withdrawMin === 0 ? 6 : 0
                                    )}
                                </div>
                            ))}
                        </div>
                    ),
                    deposit_fee: (
                        <span className='text-sm text-dominant'>
                            {t('common:free')}
                        </span>
                    ),
                    withdraw_fee: (
                        <div>
                            {raw?.networkList?.map((network, index) => (
                                <div
                                    key={`withdrawFee__${index}`}
                                    className={
                                        index === raw?.withdrawFee?.length - 1
                                            ? 'text-sm'
                                            : 'mb-1 text-sm'
                                    }
                                >
                                    {formatNumber(
                                        network?.withdrawFee,
                                        assetDigit,
                                        network?.withdrawFee === 0 ? 6 : 0
                                    )}
                                </div>
                            ))}
                        </div>
                    ),
                    [RETABLE_SORTBY]: {
                        asset: raw?.assetCode,
                        fullName: raw?.assetFullName || raw?.assetCode,
                    },
                })
            })

            data = _data
        }

        if (!data?.length) {
            tableStatus = <Empty />
        }

        return (
            <ReTable
                sort
                defaultSort={{ key: 'asset', direction: 'asc' }}
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => item?.key}
                tableStatus={tableStatus}
                scroll={{ x: true }}
                onRow={(record, index) => ({
                    onClick: () =>
                        router.push(
                            walletLinkBuilder(
                                WalletType.SPOT,
                                EXCHANGE_ACTION.DEPOSIT,
                                {
                                    type: 'crypto',
                                    asset: record?.raw?.assetCode,
                                }
                            )
                        ),
                })}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '992px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width <= BREAK_POINTS.lg,
                    noDataStyle: {
                        minHeight: '280px',
                    },
                }}
                paginationProps={{
                    current: state.currentPage,
                    pageSize: ROW_LIMIT,
                    onChange: (currentPage) => setState({ currentPage }),
                }}
            />
        )
    }, [
        paymentConfigs,
        state.search,
        state.configs,
        state.currentPage,
        state.loadingConfigs,
        width,
        router,
    ])

    const renderSearchBox = useCallback(() => {
        return (
            <SearchBox
                useClearBtn={!!state.search}
                onClear={() => setState({ search: '' })}
                inputProps={{
                    value: state.search,
                    onChange: (e) => setState({ search: e.target?.value }),
                    placeholder: `${t('common:search_coin')}...`,
                }}
            />
        )
    }, [state.search])

    const renderNotes = useCallback(() => {
        if (language === LANGUAGE_TAG.VI) {
            return (
                <>
                    Với mỗi lần rút token, người dùng sẽ trả một khoản phí cố
                    định để trang trải chi phí giao dịch khi chuyển token ra
                    khỏi tài khoản Nami.{width >= BREAK_POINTS.sm && <br />}
                    Tỷ lệ phí rút được xác định bởi blockchain và có thể dao
                    động mà không cần báo trước do các yếu tố như sự tắc nghẽn
                    mạng.{width >= BREAK_POINTS.sm && <br />}
                    Vui lòng kiểm tra thông tin phí cập nhật gần nhất được liệt
                    kê cho mỗi token dưới đây.
                </>
            )
        } else {
            return (
                <>
                    For each withdrawal, a flat fee is paid by users to cover
                    the transaction costs of moving the cryptocurrency out of
                    their Nami account.{width >= BREAK_POINTS.sm && <br />}
                    Withdrawals rates are determined by the blockchain network
                    and can fluctuate without notice due to factors such as
                    network congestion.{width >= BREAK_POINTS.sm && <br />}
                    Please check the most recent data listed on each withdrawal
                    page.
                </>
            )
        }
    }, [width, language])

    useEffect(() => {
        getConfig()
    }, [])

    return (
        <>
            <div className='flex items-center justify-between'>
                <div className='t-common'>{t('fee-structure:depwdl_fee')}</div>
                {width >= BREAK_POINTS.sm && renderSearchBox()}
            </div>
            <div className='mt-4 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                {renderNotes()}
            </div>
            {width < BREAK_POINTS.sm && (
                <div className='mt-8'>{renderSearchBox()}</div>
            )}
            <MCard addClass='mt-6 !py-0 !px-0 overflow-hidden'>
                {renderTable()}
            </MCard>
        </>
    )
}

const ROW_LIMIT = 10

const ROW_SKELETON = {
    asset: <Skeletor width={65} />,
    fullName: <Skeletor width={65} />,
    network: <Skeletor width={65} />,
    min_withdraw: <Skeletor width={65} />,
    deposit_fee: <Skeletor width={65} />,
    withdraw_fee: <Skeletor width={65} />,
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'fee-structure',
            'wallet',
        ])),
    },
})

export default withTabLayout({ routes: TAB_ROUTES.FEE_STRUCTURE })(
    DepositWithdrawFee
)
