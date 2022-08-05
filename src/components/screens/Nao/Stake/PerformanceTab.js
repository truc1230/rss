import React, { useState, useMemo, useEffect, Fragment } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider, Progressbar, Tooltip } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TableNoData from 'components/common/table.old/TableNoData';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_SHARE_HISTORIES, API_POOL_STAKE_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components'
import classnames from 'classnames';
import colors from 'styles/colors';
import StakeOrders from 'components/screens/Nao/Stake/StakeOrders';

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        const arr = [1, 72, 86, 447];
        arr.map(id => {
            const asset = utils.assetConfig.find(rs => rs.id === id);
            if (asset) {
                assets[id] = {
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit
                };
            }
        })
        return assets;
    }
);

const PerformanceTab = ({ isSmall, dataSource, assetNao, onShowLock }) => {
    const { t } = useTranslation();
    const [listHitory, setListHitory] = useState([]);
    const assetConfig = useSelector(state => getAssets(state));
    const [tab, setTab] = useState(0);


    useEffect(() => {
        getListHistory();
    }, [])

    const getListHistory = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_USER_SHARE_HISTORIES,
            });
            if (status === ApiStatus.SUCCESS && Array.isArray(data) && data) {
                setListHitory(data);
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    const onSetTab = (key) => {
        setTab(key)
    }

    const data = useMemo(() => {
        const availableStaked = dataSource?.availableStaked ?? 0;
        const totalStaked = dataSource?.totalStaked ?? 0;
        const pool = availableStaked / totalStaked;
        const percent = (availableStaked / totalStaked) * 100;
        return {
            percent: percent || 0,
            estimate: dataSource?.poolRevenueThisWeek,
            totalStaked,
            availableStaked,
            totalProfit: dataSource?.totalProfit
        }
    }, [dataSource])

    return (
        !dataSource?.isNewUser ?
            <>
                <div>
                    <TextLiner className="pb-1">{t('nao:pool:per_overview')}</TextLiner>
                    <div className="text-nao-grey text-sm">{t('nao:pool:per_description')}</div>
                    <CardNao className="divide-nao-line divide-y mt-6">
                        <div className='pb-4'>
                            <label className="text-nao-text font-medium leading-6 ">{t('nao:pool:total_staked')}</label>
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center mr-8">
                                        <span className="font-semibold mr-1 leading-7">{formatNumber(data.availableStaked, assetNao?.assetDigit ?? 8)}</span>
                                        <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                                    </div>
                                    <div className="text-nao-grey text-sm">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</div>
                                </div>
                                <div className="my-2">
                                    <div className="w-full bg-[#000000] rounded-lg">
                                        <Progressbar percent={Math.ceil(data.percent)} />
                                    </div>
                                </div>
                                <div className="text-xs font-medium leading-6">{formatNumber(data.percent, assetNao?.assetDigit ?? 8)}%</div>
                            </div>
                        </div>
                        <div className="py-4">
                            <label className="text-nao-text font-medium leading-6 ">{t('nao:pool:total_revenue')}</label>
                            <div className="flex items-center mt-4">
                                <div className="text-[22px font-semibold leading-8 mr-2">≈ {formatNumber(data.totalProfit, 0)} VNDC</div>

                            </div>
                        </div>
                        <div className="pt-4">
                            <Tooltip id="tooltip-est-this-week" />
                            <div className="space-x-2 flex items-center">
                                <label className="text-nao-text font-medium leading-6 ">{t('nao:pool:per_est_revenue')}</label>
                                <div data-tip={t('nao:pool:tooltip_est_this_week')} data-for="tooltip-est-this-week" >
                                    <img className="min-w-[20px]" src={getS3Url('/images/nao/ic_help.png')} height={20} width={20} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 flex-wrap">
                                <div className="flex items-center justify-between w-full flex-wrap">
                                    <div className="flex items-center ">
                                        <div className="text-lg font-semibold leading-7 mr-2">
                                            {formatNumber((data.estimate?.[447] || 0) * (data.percent / 100 || 0), assetConfig[447]?.assetDigit ?? 8)}
                                        </div>
                                        <img src={getS3Url("/images/nao/ic_nao.png")} width={20} height={20} alt="" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold leading-7 mr-2">
                                            {formatNumber((data.estimate?.[72] || 0) * (data.percent / 100 || 0), assetConfig[72]?.assetDigit ?? 0)}
                                        </div>
                                        <img src={getS3Url("/images/nao/ic_vndc.png")} width={20} height={20} alt="" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full flex-wrap">
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold leading-7 mr-2">
                                            {formatNumber((data.estimate?.[1] || 0) * (data.percent / 100 || 0), assetConfig[1]?.assetDigit ?? 4)}
                                        </div>
                                        <img src={getS3Url(`/images/coins/64/${1}.png`)} width={20} height={20} alt="" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="text-lg font-semibold leading-7 mr-2">
                                            {formatNumber((data.estimate?.[86] || 0) * (data.percent / 100 || 0), assetConfig[86]?.assetDigit ?? 4)}
                                        </div>
                                        <img src={getS3Url("/images/nao/ic_onus.png")} width={20} height={20} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardNao>
                </div>
                <div className="mt-10">
                    <TextLiner className="pb-1">{t('common:transaction_history')}</TextLiner>
                    <div className="text-nao-grey text-sm">{t('nao:pool:history_description')}</div>
                    <Tabs tab={tab}>
                        <TabItem active={tab === 0} onClick={() => onSetTab(0)}>{t('nao:pool:profit')}</TabItem>
                        <TabItem active={tab === 1} onClick={() => onSetTab(1)} >Stake</TabItem>
                    </Tabs>
                    <TabContent active={tab === 0}>
                        {listHitory.length > 0 ?
                            <CardNao className="mt-6">
                                {listHitory.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {index !== 0 && <Divider className="w-full !my-4" />}
                                            <div>
                                                <div className="text-nao-grey text-sm">
                                                    {t('nao:pool:week', { value: listHitory.length - index })} {formatTime(item.fromTime, 'dd/MM/yyyy')} - {formatTime(item.toTime, 'dd/MM/yyyy')}
                                                </div>
                                                <div className="mt-1">
                                                    <div className="flex items-center justify-between flex-wrap">
                                                        <div className="flex items-center">
                                                            <div className="text-lg font-semibold leading-7 mr-2">
                                                                {formatNumber(item?.interest?.[447], assetConfig[447]?.assetDigit ?? 8)}
                                                            </div>
                                                            <img src={getS3Url("/images/nao/ic_nao.png")} width={20} height={20} alt="" />
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="text-lg font-semibold leading-7 mr-2">
                                                                {formatNumber(item?.interest?.[72], assetConfig[72]?.assetDigit ?? 0)}
                                                            </div>
                                                            <img src={getS3Url("/images/nao/ic_vndc.png")} width={20} height={20} alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between flex-wrap">
                                                        <div className="flex items-center">
                                                            <div className="text-lg font-semibold leading-7 mr-2">
                                                                {formatNumber(item?.interest?.[1], assetConfig[1]?.assetDigit ?? 0)}
                                                            </div>
                                                            <img src={getS3Url(`/images/coins/64/${1}.png`)} width={20} height={20} alt="" />
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className="text-lg font-semibold leading-7 mr-2">
                                                                {formatNumber(item?.interest?.[86], assetConfig[86]?.assetDigit ?? 0)}
                                                            </div>
                                                            <img src={getS3Url("/images/nao/ic_onus.png")} width={20} height={20} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                })}
                            </CardNao>
                            :
                            <div className="mt-6 flex flex-col justify-center items-center">
                                <div className={`flex items-center justify-center flex-col m-auto h-full min-h-[300px]`}>
                                    <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={130} height={130} />
                                    <div className="text-xs text-nao-grey mt-1">{t('nao:pool:history_nodata')}</div>
                                </div>
                            </div>
                        }
                    </TabContent>
                    <TabContent active={tab === 1}>
                        {tab === 1 && <StakeOrders assetConfig={assetConfig} />}
                    </TabContent>
                </div>
            </>
            : <>
                <div className="relative flex flex-col justify-center items-center translate-y-1/2 mt-[-60px]">
                    <img src={getS3Url("/images/nao/ic_nao_coming.png")} className='opacity-[0.4]' alt="" width="100" height="193" width="283" />
                    <div className='text-center mt-6'>
                        <TextLiner className="!text-lg !w-full !pb-0 !normal-case">{t('nao:pool:you_not_staked')}</TextLiner>
                        <div className="text-sm text-nao-grey mt-4">{t('nao:pool:share_revenue_nodata')}</div>
                    </div>
                </div>
                <div className={`absolute w-full ${isSmall ? 'bottom-[30px] ' : '-ml-4 bottom-[60px] '}`}>
                    <div className='px-4'>
                        <ButtonNao onClick={onShowLock} className="font-semibold py-3 w-full">{t('nao:pool:stake_now')}</ButtonNao>
                    </div>
                </div>
            </>
    );
};

const Tabs = styled.div.attrs({
    className: 'bg-nao-tooltip rounded-xl mt-5 mb-7 flex items-center justify-between text-sm h-[42px] relative'
})`
    &:after{
        content: "";
        position:absolute;
        height:100%;
        background-color:${() => colors.nao.blue2};
        transform:${({ tab }) => `translate(${tab * 100}%,0)`};
        width:calc(100% / 2);
        transition: all 0.2s;
        border-radius:12px;
    }
 
`

const TabItem = styled.div.attrs(({ active }) => ({
    className: classnames(
        'py-2 leading-6 w-1/2 h-full flex items-center justify-center z-[2] capitalize ',
        { 'font-semibold': active },
        { 'text-nao-text font-medium': !active }
    )
}))`

`

const TabContent = styled.div.attrs(({ active }) => ({
    className: classnames(
        'min-h-[calc(100vh-234px)]',
        { 'hidden': !active }
    )
}))`
`

export default PerformanceTab;
