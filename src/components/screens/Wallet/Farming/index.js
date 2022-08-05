import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ApiStatus, EarnOrder_Status } from 'redux/actions/const';
import { Eye, EyeOff } from 'react-feather';
import { API_FARMING_CANCEL_EARNING, API_GET_FARMING_ORDER } from 'redux/actions/apis';

import Axios from 'axios';
import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import ReTable from 'components/common/ReTable';
import Empty from 'components/common/Empty';
import AssetName from 'components/wallet/AssetName';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber as formatWallet, formatTime, getS3Url } from 'redux/actions/utils';
import AssetValue from 'components/common/AssetValue';
import Skeletor from 'components/common/Skeletor';
import { BREAK_POINTS } from 'constants/constants';
import RePagination from 'components/common/ReTable/RePagination';
import Modal from 'components/common/ReModal';
import { SECRET_STRING, wait } from 'utils';
import Button from 'components/common/Button';
import { PulseLoader } from 'react-spinners';
import colors from 'styles/colors';

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    action: null, // action = null is wallet overview
    allAssets: null,
    tableTab: 0, // 0. staking, 1. redeem history
    columns: [],
    loadingTableData: false,
    page: 1,
    apiResponse: {},
    openModal: {},
    cancelObj: {},
    onCancelling: false,
    canceledMsg: null,
    showMsg: false
    // ...
}

const PAGE_SIZE = 10

const FarmingWallet = memo(({ summary, loadingSummary }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx


    // Use Hooks
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()
    const { t } = useTranslation()

    // Helper
    const getOrder = async (page, tab) => {
        setState({ loadingTableData: true })

        try {
            let url
            if (tab === 0) {
                url = `${API_GET_FARMING_ORDER}&status=1&sort=create_at&page=${page}&pageSize=${PAGE_SIZE}`
            } else if (tab === 1) {
                url = `${API_GET_FARMING_ORDER}&list_status=0,2&sort=-updated_at&page=${page}&pageSize=${PAGE_SIZE}`
            }

            const { data  } = await Axios.get(url)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ tableData: data.data })
            }
        } catch (e) {

        }  finally {
            setState({ loadingTableData: false })
        }
    }

    const onCancel = async (earnOrderId) => {
        setState({ onCancelling: true })

        try {
            const { data } = await Axios.post(API_FARMING_CANCEL_EARNING, { earnOrderId })
            if (data?.status === ApiStatus.SUCCESS) {
                setState({ apiResponse: { cancel: 'OK' }, canceledMsg: t('common:success') })
            } else {
                setState({ apiResponse: { cancel: "ERROR" }, canceledMsg: t('common:failure') })
            }
        } catch (e) {
            console.log(`Can't cancel order ${earnOrderId} => `, e)
        } finally {
            await getOrder(state.page, state.tableTab)
            setState({ onCancelling: false })
            onCloseModal()
            await wait(500)
            showMsg(true)
        }
    }

    const onCloseModal = () => setState({ openModal: {}, cancelObj: {}, apiResponse: {} })

    const showMsg = (status) => setState({ openModal: { showMsg: status } })

    const onOpenModal = (earnOrderId, displayId) => {
        setState({
            openModal: { cancel: true },
            apiResponse: {},
            cancelObj: {
                earnOrderId,
                displayId
            }
        })
    }

    const getEarnStatus = (id) => {
        switch (id) {
            case EarnOrder_Status.CANCELLED:
                return {
                    className: "min-w-[90px] px-2 py-1 2xl:py-2 inline-flex items-center justify-center rounded-md text-red bg-red-lightRed",
                    text: t('common:common_status.cancelled')
                }
            case EarnOrder_Status.FINISHED:
                return {
                    className: "min-w-[90px] px-2 py-1 2xl:py-2 inline-flex items-center justify-center rounded-md text-green bg-green-opacity",
                    text: t('common:common_status.finished')
                }
            case EarnOrder_Status.SAVING:
            default:
                return { className: '', text: '' }
        }
    }

    // Render Handler
    const renderDashboard = useCallback(() => {
        const sourceSummary = summary?.[0]?.summary
        const sourceAssetId = summary?.[0]?.currency

        const baseSummary = summary?.[1]?.summary
        const baseAssetId = summary?.[1]?.currency


        return (
            <div className="relative z-20 md:max-w-[88%] flex flex-wrap">
                <div className="w-full sm:w-1/2 md:w-1/3">
                    <div
                        className="max-w-[135px] font-medium text-sm 2xl:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                        {t('wallet:earn_dashboard.total_balance', { action: 'Farming' })}
                    </div>
                    <div className="mt-2 font-bold text-[24px] 2xl:mt-4 2xl:text-[32px]">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <>
                                <AssetValue value={sourceSummary?.total_balance} assetId={sourceAssetId}/> <AssetName
                                assetId={sourceAssetId}/>
                            </>}
                    </div>
                    <div
                        className="mt-1.5 text-sm xl:mt-3 xl:text-[16px] 2xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <>
                                <AssetValue value={baseSummary?.total_balance} assetId={baseAssetId}/> <AssetName
                                assetId={baseAssetId}/>
                            </>}
                    </div>
                </div>
                <div className="mt-4 w-full sm:mt-0 sm:w-1/2 md:w-1/3">
                    <div
                        className="max-w-[135px] font-medium text-sm 2xl:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                        {t('wallet:earn_dashboard.est_value')}
                    </div>
                    <div className="mt-2 font-bold text-[24px] 2xl:mt-4 2xl:text-[32px]">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <>
                                <AssetValue value={baseSummary?.estimate_value} assetId={baseAssetId}/> <AssetName
                                assetId={baseAssetId}/>
                            </>}
                    </div>
                    <div
                        className="mt-1.5 text-sm xl:mt-3 xl:text-[16px] 2xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark invisible">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <>
                                <AssetValue value={baseSummary?.estimate_value} assetId={baseAssetId}/> <AssetName
                                assetId={baseAssetId}/>
                            </>}
                    </div>
                </div>
                <div className="mt-4 w-full sm:w-1/2 md:mt-0 md:w-1/3">
                    <div
                        className="max-w-[135px] font-medium text-sm 2xl:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                        {t('wallet:earn_dashboard.total_interest_earn')}
                    </div>
                    <div className="mt-2 font-bold text-[24px] 2xl:mt-4 2xl:text-[32px]">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <><AssetValue value={baseSummary?.total_interest_earned} assetId={baseAssetId}/> <AssetName assetId={baseAssetId}/></>}
                    </div>
                    <div
                        className="mt-1.5 text-sm xl:mt-3 xl:text-[16px] 2xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark invisible">
                        {loadingSummary ?
                            <Skeletor width={65}/> :
                            state.hideAsset ? SECRET_STRING :
                                <><AssetValue value={baseSummary?.total_interest_earned} assetId={baseAssetId}/> <AssetName assetId={baseAssetId}/></>}
                    </div>
                </div>
                <div className="mt-4 w-full sm:w-1/2 md:mt-6 md:w-1/3">
                    <div
                        className="max-w-[135px] font-medium text-sm 2xl:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                        {t('wallet:earn_dashboard.today_interest_earned')}
                    </div>
                    <div className="mt-2 font-bold text-dominant text-[24px] 2xl:mt-4 2xl:text-[32px]">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING :
                                <>
                                    <AssetValue value={baseSummary?.today_interest_earned} assetId={baseAssetId}/> <AssetName assetId={baseAssetId}/>
                                </>}
                    </div>
                    <div
                        className="mt-1.5 text-sm xl:mt-3 xl:text-[16px] 2xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark invisible">
                        {loadingSummary ?
                            <Skeletor width={65}/>
                            : state.hideAsset ? SECRET_STRING : <>
                                <AssetValue value={baseSummary?.today_interest_earned} assetId={baseAssetId}/> <AssetName assetId={baseAssetId}/>
                            </>}
                    </div>
                </div>
            </div>
        )
    }, [state.hideAsset, summary, loadingSummary])

    const renderTableTab = useCallback(() => {
        return (
            <div className="flex items-center px-4 md:px-5">
                <div className="flex flex-col items-center justify-center mr-8 lg:mr-12 cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 0, page: 1 })}>
                    <div className={state.tableTab === 0 ? 'font-bold text-sm 2xl:text-[16px] pb-2 2xl:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm 2xl:text-[16px] pb-2 2xl:pb-4'}>
                        {t('wallet:earn_table.earning', { action: 'Farming' })}
                    </div>
                    <div className={state.tableTab === 0 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
                <div className="flex flex-col items-center justify-center cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 1, page: 1 })}>
                    <div className={state.tableTab === 1 ? 'font-bold text-sm 2xl:text-[16px] pb-2 2xl:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm 2xl:text-[16px] pb-2 2xl:pb-4'}>
                        {t('wallet:earn_table.redeem_history')}
                    </div>
                    <div className={state.tableTab === 1 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
            </div>
        )
    }, [state.tableTab])

    const renderOrder = useCallback(() => {
        let tableStatus
        const dataSource = dataHandler(state.tableData?.histories, state.loadingTableData, {
            tab: state.tableTab,
            onCancel: onOpenModal,
            t
        })

        if (!dataSource?.length) {
            tableStatus = <Empty/>
        }

        const columns = [
            { key: 'id', dataIndex: 'id', title: 'ID', fixed: 'left', align: 'left', width: 100 },
            { key: 'token_stake', dataIndex: 'token_stake', title: 'Token', align: 'left', width: 128 },
            { key: 'stake_time', dataIndex: 'stake_time', title: t('common:start_at'), align: 'left', width: 128 },
            { key: 'redeem_time', dataIndex: 'redeem_time', title: t('common:redeem_at'), align: 'left', width: 128 },
            { key: 'pool', dataIndex: 'pool', title: `Pool (${t('common:unit.time.day').toLowerCase()})`, align: 'left', width: 80 },
            { key: 'amount', dataIndex: 'amount', title: t('common:amount'), align: 'right', width: 128 },
            { key: 'accruing_interest', dataIndex: 'accruing_interest', title: t('wallet:earn_table.accruing_interest', { action: 'Farm' }), align: 'right', width: 128 },
            { key: 'annual_interest_rate', dataIndex: 'annual_interest_rate', title: t('wallet:earn_table.apy'), align: 'right', width: 90 },
            { key: 'operation', dataIndex: 'operation', title: '', align: 'right', width: 100 }
        ]

        return (
            <ReTable useRowHover
                     data={dataSource}
                     columns={columns}
                     rowKey={item => `${item?.key}`}
                     loading={state.loadingTableData}
                     scroll={{ x: true }}
                     tableStatus={tableStatus}
                     tableStyle={{
                         paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                         tableStyle:  { minWidth: `${width >= BREAK_POINTS['2xl'] ? 992 : 768}px !important` },
                         headerStyle: {},
                         headerFontStyle: { 'font-size': `${ width >= BREAK_POINTS['2xl'] ? 14 : 12}px !important` },
                         rowStyle: {},
                         shadowWithFixedCol: width < 1366,
                         noDataStyle: {
                             minHeight: '480px'
                         }
                     }}
                     paginationProps={{
                         hide: true,
                     }}
            />
        )
    }, [state.tableTab, state.tableData, state.page, state.loadingTableData, width])

    const renderRedeemHistory = useCallback(() => {
        let tableStatus
        const dataSource = dataHandler(state.tableData?.histories, state.loadingTableData, {
            tab: state.tableTab,
            getStatus: getEarnStatus,
        })

        if (!dataSource?.length) {
            tableStatus = <Empty/>
        }

        const columns = [
            { key: 'id', dataIndex: 'id', title: 'ID', fixed: 'left', align: 'left', width: 100 },
            { key: 'redeem_time', dataIndex: 'redeem_time', title: t('common:redeem_at'), align: 'left', width: 128 },
            { key: 'asset', dataIndex: 'asset', title: t('common:asset'), align: 'left', width: 128 },
            { key: 'pool', dataIndex: 'pool', title: `Pool (${t('common:unit.time.day').toLowerCase()})`, align: 'left', width: 90 },
            { key: 'amount', dataIndex: 'amount', title: t('common:amount'), align: 'right', width: 128 },
            { key: 'interest', dataIndex: 'interest', title: t('common:interest'), align: 'right', width: 100 },
            { key: 'status', dataIndex: 'status', title: t('common:status'), align: 'center', width: 138 },
        ]

        return (
            <ReTable useRowHover
                     data={dataSource}
                     columns={columns}
                     rowKey={item => `${item?.key}`}
                     loading={state.loadingTableData}
                     scroll={{ x: true }}
                     tableStatus={tableStatus}
                     tableStyle={{
                         paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                         tableStyle: { minWidth: `${width >= BREAK_POINTS['2xl'] ? 992 : 768}px !important` },
                         headerStyle: {},
                         headerFontStyle: { 'font-size': `${ width >= BREAK_POINTS['2xl'] ? 14 : 12}px !important` },
                         rowStyle: {},
                         shadowWithFixedCol: width < 1366,
                         noDataStyle: {
                             minHeight: '480px'
                         }
                     }}
                     paginationProps={{
                         hide: true
                     }}
            />
        )
    }, [state.tableTab, state.tableData, state.loadingTableData, state.page, width])

    const renderPagination = useCallback(() => {
        return (
            <div className="pb-8 pt-4 lg:pt-8 lg:pb-10 2xl:pt-10 2xl:pb-16 flex items-center justify-center">
                <RePagination
                    total={state.tableData?.count}
                    current={state.page}
                    pageSize={PAGE_SIZE}
                    onChange={page => setState({ page })}
                />
            </div>
        )
    }, [state.tableData])

    const renderCancelEarnModal = useCallback(() => {
        const action = 'farm'
        const id = state.cancelObj?.displayId

        return (
            <Modal
                title={t('wallet:earn_prompt.cancel_confirmation', { action })}
                titleStyle="capitalize"
                type={state.apiResponse?.cancel ? 'alert' : 'confirmation'}
                isVisible={state.openModal?.cancel}
                onBackdropCb={onCloseModal}
                onCloseCb={onCloseModal}
                onConfirmCb={() => onCancel(state.cancelObj?.earnOrderId)}
            >
                <div className="w-full">
                    <div className="text-center text-md font-bold capitalize">{t('wallet:earn_prompt.cancel_confirmation', { action })}</div>
                    {!!!Object.keys(state.apiResponse)?.length ?
                        <div className="text-sm 2xl:text-[16px] text-center font-medium mt-2">
                            {t('wallet:earn_prompt.cancel_message', { action, id })} ?
                        </div>
                        : <div className="text-sm 2xl:text-[16px] text-center font-medium mt-2">
                            {state.apiResponse?.cancel === 'OK' ?
                                t('wallet:earn_prompt.cancelled_notice', { action, id })
                                : t('wallet:earn_prompt.cancel_failure', { action, id })}
                        </div>
                    }
                    <div className="mt-4 w-full flex flex-row items-center justify-between">
                        <Button title={t('common:close')} type="secondary"
                                componentType="button"
                                style={{ width: '48%' }}
                                onClick={onCloseModal}/>
                        <Button title={state.onCancelling ? <PulseLoader color={colors.white} size={3}/> : t('common:confirm')} type="primary"
                                componentType="button"
                                style={{ width: '48%' }}
                                onClick={() => onCancel(state.cancelObj?.earnOrderId)}/>
                    </div>
                </div>
            </Modal>
        )
    }, [state.openModal?.cancel, state.cancelObj, state.onCancelling, state.apiResponse?.cancel])

    const renderShowMsg = useCallback(() => {
        return (
            <Modal
                isVisible={state.openModal?.showMsg}
                onBackdropCb={() => showMsg(false)}
            >
                <div className="w-full">
                    <div className="text-center text-md font-bold capitalize">
                        {t('modal:notice')}
                    </div>
                    <div className="mt-3 text-center font-medium text-md">
                        {state?.canceledMsg}
                    </div>
                    <div className="mt-4 w-full flex flex-row items-center justify-center">
                        <Button title={t('common:confirm')} type="primary"
                                componentType="button"
                                style={{ width: '48%' }}
                                onClick={() => showMsg(false)}/>
                    </div>
                </div>
            </Modal>
        )
    }, [state.openModal?.showMsg, state.canceledMsg])

    useEffect(() => {
        getOrder(state.page, state.tableTab)
    }, [state.page, state.tableTab])

    return (
        <div>
            <div className="flex items-center">
                <div className="t-common">
                    Farming
                </div>
                <div className="ml-5 pt-1.5 text-xs text-sm flex items-center text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:opacity-80 select-none"
                     onClick={() => setState({ hideAsset: !state.hideAsset })}>
                    {state.hideAsset ? <EyeOff size={16} className="mr-1.5"/> : <Eye size={16} className="mr-1.5"/>}
                    <span>{t('wallet:hide_asset')}</span>
                </div>
            </div>

            <div style={currentTheme === THEME_MODE.DARK ? {backgroundColor: 'rgba(0, 200, 188, 0.2)'} : { backgroundColor: 'rgba(222, 247, 229, 0.3)' }}
                 className="relative mt-8 px-6 py-4 lg:px-8 lg:py-6 rounded-xl">
                {renderDashboard()}
                <img src={getS3Url('/images/screen/wallet/farming_graphics.png')} alt="Nami.Staking"
                     className="absolute -bottom-5 right-[25px] z-10 max-w-[50%] sm:max-w-[24%] xl:max-w-[20%] h-auto"/>
            </div>

            <MCard addClass="mt-16 pt-10 pb-0 px-0 rounded-bl-none rounded-br-none overflow-hidden">
                {renderTableTab()}
                <div className="mt-8">
                    {state.tableTab === 0 && renderOrder()}
                    {state.tableTab === 1 && renderRedeemHistory()}
                    {renderPagination()}
                </div>
            </MCard>
            {state.tableTab === 0 && renderCancelEarnModal()}
            {renderShowMsg()}
        </div>
    )
})

const dataHandler = (data, loading, utils) => {
    if (loading) {
        const loadingSkeleton = []

        for (let i = 0; i < 20; ++i) {
            utils?.tab === 0 ?
                loadingSkeleton.push({...ROW_LOADING_SKELETON_ORDER, key: `staking_order_loading__skeleton_${i}`})
                : loadingSkeleton.push({...ROW_LOADING_SKELETON_REDEEM_HISTORY, key: `staking_order_loading__skeleton_${i}`})
        }
        return loadingSkeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    const result = []

    data.forEach(stake => {
        if (utils?.tab === 0) {
            result.push({
                key: `staking_order__${stake?.id}`,
                id: <span className="text-sm 2xl:text-[16px] uppercase">{stake?.display_id}</span>,
                token_stake: <div className="flex items-center">
                    <AssetLogo assetId={stake?.currency} size={24}/>
                    <span className="ml-1.5 text-sm 2xl:text-[16px] font-bold">
                        <AssetName assetId={stake?.currency}/>
                    </span>
                </div>,
                stake_time: <span className="text-sm 2xl:text-[16px]">{formatTime(stake?.start_at, 'HH:mm dd-MM-yyyy')}</span>,
                redeem_time: <span className="text-sm 2xl:text-[16px]">{formatTime(stake?.redeem_at, 'HH:mm dd-MM-yyyy')}</span>,
                pool: <span className="text-sm 2xl:text-[16px]">{stake?.metadata?.earn_config?.duration}</span>,
                amount: <span className="text-sm 2xl:text-[16px]"><AssetValue value={stake?.amount}/> <AssetName assetId={stake?.currency}/></span>,
                accruing_interest: <span className="text-sm 2xl:text-[16px]"><AssetValue value={stake?.estimate_interest_by_day}/> <AssetName assetId={stake?.earn_currency}/></span>,
                annual_interest_rate: <span className="text-sm 2xl:text-[16px]">{formatWallet(stake?.metadata?.earn_config?.interest_rate * 100, 2)}%</span>,
                operation: <div className="text-sm 2xl:text-[16px] text-dominant cursor-pointer hover:opacity-80"
                                onClick={() => utils?.onCancel(stake?.id, stake?.display_id)}>
                    {utils?.t('common:cancel')}
                </div>
            })
        } else if (utils?.tab === 1) {
            const status = utils?.getStatus(stake?.status?.id)
            result.push({
                key: `staking_redeem__${stake?.id}`,
                id: <span className="text-sm 2xl:text-[16px] uppercase">{stake?.display_id}</span>,
                redeem_time: <span className="text-sm 2xl:text-[16px]">{formatTime(stake?.redeem_at, 'HH:mm dd-MM-yyyy')}</span>,
                asset: <div className="flex items-center">
                    <AssetLogo assetId={stake?.currency} size={24}/>
                    <span className="ml-1.5 font-bold text-sm 2xl:text-[16px]">
                                <AssetName assetId={stake?.currency}/>
                             </span>
                </div>,
                pool: <span className="text-sm 2xl:text-[16px]">{stake?.metadata?.earn_config?.duration}</span>,
                amount: <span className="text-sm 2xl:text-[16px]"><AssetValue value={stake?.amount}/> <AssetName assetId={stake?.currency}/></span>,
                interest: <span className="text-sm 2xl:text-[16px]">{formatWallet(stake?.interest, 2)} <AssetName assetId={stake?.earn_currency}/></span>,
                status: <span className={'text-sm 2xl:text-[16px] ' + status?.className}>{status?.text}</span>
            })
        }
    })

    return result
}

const ROW_LOADING_SKELETON_ORDER = {
    id: <Skeletor width={65}/>,
    token_stake: <Skeletor width={65}/>,
    stake_time: <Skeletor width={65}/>,
    redeem_time: <Skeletor width={65}/>,
    pool: <Skeletor width={65}/>,
    amount: <Skeletor width={65}/>,
    accruing_interest: <Skeletor width={65}/>,
    annual_interest_rate: <Skeletor width={65}/>,
    operation: <Skeletor width={65}/>
}

const ROW_LOADING_SKELETON_REDEEM_HISTORY = {
    id: <Skeletor width={65}/>,
    redeem_time: <Skeletor width={65}/>,
    asset: <Skeletor width={65}/>,
    pool: <Skeletor width={65}/>,
    amount: <Skeletor width={65}/>,
    interest: <Skeletor width={65}/>,
    status: <Skeletor width={65}/>
}

export default FarmingWallet
