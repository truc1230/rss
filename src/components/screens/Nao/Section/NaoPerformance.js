import React, { Fragment, useEffect, useState, memo } from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import fetchApi from 'utils/fetch-api';
import { API_NAO_DASHBOARD_STATISTIC, API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatPrice, getS3Url } from 'redux/actions/utils';
import { DefaultFuturesFee } from 'redux/actions/const';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';

const days = [
    { en: 'Today', vi: 'Hôm nay', value: 'd' },
    { en: 'Yesterday', vi: 'Hôm qua', value: '-d' },
    { en: '7 days', vi: '7 ngày', value: 'w' },
    { en: '30 days', vi: '30 ngày', value: 'm' },
    { en: '60 days', vi: '60 ngày', value: '2m' }
]


const NaoPerformance = memo(() => {
    const { t, i18n: { language } } = useTranslation()
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const filter = useRef(null);
    const [fee, setFee] = useState('VNDC');
    const [referencePrice, setReferencePrice] = useState({})
    const assetConfig = useSelector(state => state.utils.assetConfig);

    useEffect(() => {
        getData('d');
        getRef();
    }, [])

    const getData = async (day) => {
        if (filter.current === day) return;
        filter.current = day;
        setLoading(true)
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC,
                options: { method: 'GET' },
                params: { range: filter.current },
            })
            setDataSource(!(data?.error || data?.status) ? data : null)
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' },
            });
            if (data) {
                setReferencePrice(data.reduce((acm, current) => {
                    return {
                        ...acm,
                        [`${current.base}/${current.quote}`]: current.price,
                    }
                }, {}))
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const assets = useMemo(() => {
        if (!dataSource?.feeRevenue) return [];
        const assets = [];
        let first = true
        return Object.keys(dataSource?.feeRevenue).reduce((newItem, item) => {
            const asset = assetConfig.find(rs => rs.id === Number(item));
            if (asset) {
                // if (first && !fee) {
                //     setFee(asset?.assetCode)
                //     first = false;
                // }
                assets.push({
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit,
                    value: dataSource.feeRevenue[item]
                })
            }
            return assets;
        }, []);
    }, [dataSource, assetConfig])

    const feeFilter = useMemo(() => {
        const _fee = assets.find(rs => rs.assetCode === fee);
        const filter = [
            { label: 'NAO', ratio: '0.036' },
            { label: 'NAMI', ratio: '0.045' },
            { label: 'ONUS', ratio: '0.045' },
            { label: 'VNDC', ratio: '0.06' },
        ];
        return {
            total: _fee ? formatNumber(_fee?.value, _fee?.assetDigit) + ' ' + _fee?.assetCode : '-',
            ratio: filter.find(rs => rs.label === fee)?.ratio ?? '0.06'
        }
    }, [fee, assets])

    return (
        <section id="nao_performance" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div>
                    <TextLiner>{t('nao:onus_performance:title')}</TextLiner>
                    <span className="text-sm sm:text-[1rem] text-nao-grey">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {days.map((day, i) => {
                        return <Days key={i} active={day.value === filter.current}
                            onClick={() => getData(day.value)}>{day[language]}</Days>
                    })}
                </div>
            </div>
            <div className="pt-5 sm:pt-6 flex items-center flex-wrap gap-5">
                <CardNao>
                    <label className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_volume')}</label>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{dataSource ? formatNumber(dataSource?.notionalValue, 0) + ' VNDC' : '-'}</div>
                        <span className="text-sm text-nao-grey">{dataSource ? '$' + formatPrice(referencePrice[`VNDC/USD`] * dataSource?.notionalValue, 3) : '-'} </span>
                    </div>
                </CardNao>
                <CardNao>
                    <label className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_orders')}</label>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{dataSource ? formatNumber(dataSource?.count * 2, 0) : '-'}</div>
                        <span className="text-sm text-nao-grey">{dataSource ? formatNumber(dataSource?.userCount, 0) + ' ' + t('nao:onus_performance:users') : '-'}</span>
                    </div>
                </CardNao>
                <CardNao noBg>
                    <div className="flex items-center justify-between">
                        <label className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_fee')}</label>
                        <Popover className="relative flex">
                            {({ open, close }) => (
                                <>
                                    <Popover.Button >
                                        <div className="text-sm px-2 py-1 bg-nao-bg3 rounded-md flex items-center justify-between text-nao-white min-w-[72px]">
                                            {fee}
                                            <img alt="" src={getS3Url('/images/nao/ic_arrow_bottom.png')} height="16" width="16" />
                                        </div>
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
                                        <Popover.Panel className="absolute top-8 left-0 z-50 bg-nao-bg3 rounded-md mt-1">
                                            <div className="px-2 py-[2] min-w-[72px] shadow-onlyLight font-medium text-xs flex flex-col">
                                                {assets.map((item, index) => (
                                                    <span onClick={() => { setFee(item?.assetCode); close() }} key={index}
                                                        className={`py-[1px] my-[2px] cursor-pointer ${item?.assetCode === fee ? 'text-nao-white' : 'text-nao-text'}`}>{item?.assetCode}</span>
                                                ))}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{feeFilter.total}</div>
                        <span className="text-sm text-nao-grey">{feeFilter.ratio}%</span>
                    </div>
                </CardNao>
            </div>
        </section>
    );
});

const Days = styled.div.attrs({
    className: 'px-4 py-2 rounded-[6px] cursor-pointer text-nao-white text-sm bg-nao-bg3 select-none text-center'
})`
    background:${({ active }) => active ? colors.nao.blue2 : ''};
    font-weight:${({ active }) => active ? '600' : '400'}
`

export default NaoPerformance;
