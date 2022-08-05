import React, { useState, useMemo, useEffect } from 'react';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl, Tooltip } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_RANK_GROUP_PNL, API_CONTEST_GET_RANK_GROUP_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';

const ContestTeamRanks = ({ onShowDetail, previous, contest_id, minVolumeTeam }) => {
    const [tab, setTab] = useState('volume');
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRanks();
    }, [])

    const rank = tab === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';
    const getRanks = async (tab) => {
        const _rank = tab === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';
        try {
            const { data, status } = await fetchApi({
                url: tab === 'pnl' ? API_CONTEST_GET_RANK_GROUP_PNL : API_CONTEST_GET_RANK_GROUP_VOLUME,
                params: { contest_id: contest_id },
            });
            if (data && status === ApiStatus.SUCCESS) {
                const sliceIndex = data[0]?.[_rank] > 0 ? 3 : 0
                const _top3 = data.slice(0, sliceIndex);
                const _dataSource = data.slice(sliceIndex)
                setTop3(_top3);
                setDataSource(_dataSource);
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const onFilter = (key) => {
        if (tab === key) return;
        setLoading(true)
        getRanks(key)
        setTab(key)
    }

    const renderTeam = (data, item) => {
        return (
            <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-[50%] bg-[#273446] flex items-center justify-center'>
                    <img className='object-cover rounded-[50%] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]' src={item?.avatar ?? getS3Url('/images/nao/ic_nao.png')} width="32" height="32" alt="" />
                </div>
                <div>{data}</div>
            </div>
        )
    }

    const renderActions = (e) => {
        return (
            <div className="text-nao-grey underline text-xs cursor-pointer">{t('nao:contest:details')}</div>
        )
    }

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="min-w-[24px] text-center">
                {data && data <= 10 ?
                    <img src={getS3Url(`/images/nao/contest/ic_top_${item?.rowIndex + 4}.png`)} className="min-w-[24px] min-h-[24px]" width="24" height="24" alt="" />
                    : <span >{_rank}</span>}
            </div>
        )
    }

    return (
        <section className="contest_individual_ranks pt-[4.125rem]">
            <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]"
                backgroundColor={colors.nao.tooltip} arrowColor="transparent" id="tooltip-team-rank" >
                <div className="font-medium text-sm text-nao-grey2 " dangerouslySetInnerHTML={{ __html: t('nao:contest:tooltip_team', { value: minVolumeTeam }) }}>
                </div>
            </Tooltip>
            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <TextLiner>{t('nao:contest:team_ranking')}</TextLiner>
                    <img data-tip={''} data-for="tooltip-team-rank" className="cursor-pointer" src={getS3Url('/images/nao/ic_info.png')} width="20" height="20" alt="" />
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => onFilter('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:volume')}</ButtonNao>
                    <ButtonNao
                        onClick={() => onFilter('pnl')}
                        className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:per_pnl')}</ButtonNao>
                </div>
            </div>
            {top3.length > 0 &&
                <div className="flex flex-wrap gap-5 sm:gap-[1.375rem] mt-[2.75rem]">
                    {top3.map((item, index) => (
                        <CardNao onClick={() => onShowDetail(item, tab)} key={index} className="!p-5 !bg-transparent border border-nao-border2">
                            <div className="flex justify-between flex-1 mb-4 gap-5">
                                <div className="flex flex-col">
                                    <TextLiner className="!text-[3rem] !leading-[50px] !pb-0" liner>#{index + 1}</TextLiner>
                                    <div className="sm:gap-1 flex flex-col">
                                        <div className="text-lg font-semibold leading-8 capitalize flex items-center gap-2">
                                            <div>{item?.name}</div>
                                            <img src={getS3Url(`/images/nao/contest/ic_top_${index + 1}.png`)} width="24" height="24" alt="" />
                                        </div>
                                        <span className="text-nao-grey text-sm font-medium cursor-pointer capitalize">{item?.leader_name}</span>
                                    </div>
                                </div>
                                <div className="w-[6.375rem] h-[6.375rem] rounded-[50%]">
                                    <img src={item?.avatar ?? getS3Url('/images/nao/ic_nao_large.png')}
                                        className="min-w-[6.375rem] min-h-[6.375rem] max-w-[6.375rem max-h-[6.375rem] rounded-[50%] object-cover" alt="" />
                                </div>
                            </div>
                            <div className="rounded-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm text-nao-text">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold leading-8">{formatNumber(item?.total_volume, 0)} VNDC</span>
                                </div>
                                <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2"></div>
                                {
                                    tab === 'pnl'
                                        ? <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm text-nao-text">{t('nao:contest:per_pnl')}</div>
                                            <span className={`font-semibold leading-8 ${getColor(item.pnl)}`}>
                                                {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}{formatNumber(item?.pnl, 2, 0, true)}%
                                            </span>
                                        </div>
                                        : <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm text-nao-text">{t('nao:contest:total_trades')}</div>
                                            <span className={`font-semibold leading-8`}>
                                                {formatNumber(item?.total_order)}
                                            </span>
                                        </div>
                                }
                            </div>
                        </CardNao>
                    ))}
                </div>
            }
            {width <= 640 ?
                <CardNao noBg className="mt-5 !py-[1.125rem] !px-3">
                    <div className="flex mx-3 gap-4 sm:gap-6 text-nao-grey text-sm font-medium pb-2 border-b border-nao-grey/[0.2]">
                        <div className="min-w-[31px]">{t('nao:contest:rank')}</div>
                        <div>{t('nao:contest:information')}</div>
                    </div>
                    <div className="mt-3">
                        {Array.isArray(dataSource) && dataSource?.length > 0 ?
                            dataSource.map((item, index) => {
                                return (
                                    <div onClick={() => onShowDetail(item, tab)} key={index} className={`flex gap-4 sm:gap-6 p-3 cursor-pointer ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}>
                                        <div className="min-w-[31px] text-nao-grey text-sm font-medium ">
                                            {loading ? <Skeletor width={24} height={24} circle /> :
                                                item?.[rank] && item?.[rank] <= 10 ?
                                                    <img src={getS3Url(`/images/nao/contest/ic_top_${item?.[rank]}.png`)} className="min-w-[24px] min-h-[24px]" width="24" height="24" alt="" />
                                                    : item?.[rank] || '-'
                                            }
                                        </div>
                                        <div className="text-sm flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold leading-6 capitalize">{item?.name} </div>
                                                    <div className="text-nao-grey font-medium leading-6 cursor-pointer capitalize">{item?.leader_name}</div>
                                                </div>
                                                <div className=''>
                                                    <img className="rounded-[50%] object-cover min-w-[2.275rem] min-h-[2.275rem] max-w-[2.275rem] max-h-[2.275rem]" src={item?.avatar ?? getS3Url('/images/nao/ic_nao.png')} width="24" height="24" alt="" />
                                                </div>
                                            </div>

                                            <div className="flex items-center font-medium justify-between pt-2">
                                                <label className="leading-6 text-nao-grey">{t('nao:contest:volume')}</label>
                                                <span className="text-right">{formatNumber(item?.total_volume, 0)} VNDC</span>
                                            </div>
                                            <div className="flex items-center font-medium justify-between pt-1">
                                                <label className="leading-6 text-nao-grey">{t(`nao:contest:${tab === 'pnl' ? 'per_pnl' : 'total_trades'}`)}</label>
                                                {tab === 'pnl' ?
                                                    <span className={`text-right ${getColor(item?.pnl)}`}>
                                                        {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                    </span>
                                                    :
                                                    <span className={`text-right`}>
                                                        {formatNumber(item?.total_order)}
                                                    </span>
                                                }
                                            </div>
                                            <div
                                                onClick={() => onShowDetail(item, tab)}
                                                className="underline text-sm font-medium text-nao-grey pt-1 cursor-pointer select-none">
                                                {t('nao:contest:details')}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                                <div className="text-xs text-nao-grey mt-1">{t('nao:contest:no_rank')}</div>
                            </div>
                        }
                    </div>
                </CardNao>
                :
                <Table loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={dataSource} onRowClick={(e) => onShowDetail(e, tab)} >
                    <Column minWidth={50} className="text-nao-grey font-medium" title={t('nao:contest:rank')} fieldName={rank} cellRender={renderRank} />
                    <Column minWidth={200} className="font-semibold capitalize" title={t('nao:contest:team')} fieldName="name" cellRender={renderTeam} />
                    <Column minWidth={150} className="text-nao-text capitalize" title={t('nao:contest:captain')} fieldName="leader_name" />
                    <Column minWidth={150} align="right" className="font-medium" title={`${t('nao:contest:volume')} (VNDC)`} decimal={0} fieldName="total_volume" />

                    {
                        tab === 'pnl'
                            ? <Column maxWidth={120} minWidth={100} align="right" className="font-medium" title={t('nao:contest:per_pnl')} fieldName="pnl" cellRender={renderPnl} />
                            : <Column maxWidth={120} minWidth={100} align="right" className="font-medium" title={t('nao:contest:total_trades')} fieldName="total_order" decimal={0} />
                    }
                    <Column maxWidth={100} minWidth={100} align="right" className="font-medium" title={''} cellRender={renderActions} />
                </Table>
            }
        </section>
    );
};

export default ContestTeamRanks;
