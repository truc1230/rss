import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { Progressbar } from 'components/screens/Nao/NaoStyle';
import { useSelector } from 'react-redux';

const NaoInfo = ({ dataSource, assetNao, ammData }) => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user) || null;

    const holders_wallet = useMemo(() => {
        return 22250000 - ammData - dataSource?.totalStaked
    }, [dataSource, ammData])

    return (
        <section id="nao_info" className="flex items-center justify-between pt-10 sm:pt-20 flex-wrap gap-8">
            <div className="flex items-center">
                <BackgroundImage>
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} className='w-[62px] h-[62px] sm:w-[80px] sm:h-[80px]' alt="" />
                </BackgroundImage>
                <div className="flex flex-col justify-between leading-10">
                    <div>
                        <div className="text-2xl sm:text-[2.25rem] font-semibold text-nao-white">{t('nao:project_info')}</div>
                        <div className="text-lg sm:text-[1.25rem] flex items-center pt-1 flex-wrap">
                            <label className="text-nao-blue uppercase text-[1.25re] font-semibold">NAO</label>
                            <span className="mx-2">•</span>
                            <div className="font-light text-nao-white capitalize">Nami frame futures</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex bg-nao-bg2 rounded-xl p-6 sm:px-8 sm:py-[26px] flex-1 sm:flex-none flex-col sm:flex-row">
                <div className="flex flex-col">
                    <label className="text-nao-text font-medium sm:text-lg pb-2 leading-7">{t('nao:circulating_supply')}</label>
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center mr-8">
                                <span className="font-semibold mr-1 leading-7">22,250,000</span>
                                <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                            </div>
                            <div className="text-nao-grey text-sm">100,000,000</div>
                        </div>
                        <div className="my-2">
                            <div className="w-full bg-[#000000] rounded-lg">
                                <Progressbar percent={(22250000 / 100000000) * 100} />
                            </div>
                        </div>
                        <div className="text-xs font-medium leading-6">{(22250000 / 100000000) * 100}%</div>
                    </div>
                </div>
                <div className="h-[1px] mx-0 sm:h-auto sm:w-[1px] bg-nao-line sm:mx-6 my-6 sm:my-0"></div>
                <div className='flex flex-col justify-between gap-3'>
                    <div className="flex items-center justify-between text-sm space-x-10">
                        <label className="text-nao-text font-medium">{t('nao:holders_wallet')}</label>
                        <div className="flex items-center space-x-2">
                            {
                                ammData
                                    ?<div className='font-semibold'>{formatNumber(holders_wallet, assetNao?.assetDigit ?? 8)}</div>
                                    :<div className='font-semibold'>-</div>
                            }
                            <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm space-x-10">
                        <label className="text-nao-text font-medium">{t('nao:liq_pools')}</label>
                        <div className="flex items-center space-x-2">
                            {
                                ammData
                                    ?<div className='font-semibold'>{formatNumber(ammData, assetNao?.assetDigit ?? 8)}</div>
                                    :<div className='font-semibold'>-</div>
                            }
                            <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm space-x-10">
                        <label className="text-nao-text font-medium">{t('nao:governance_pool')}</label>
                        <div className="flex items-center space-x-2">
                            <div className='font-semibold'>{formatNumber(dataSource?.totalStaked, assetNao?.assetDigit ?? 8)}</div>
                            <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const BackgroundImage = styled.div.attrs({
    className: 'min-w-[90px] w-[90px] h-[90px] sm:min-w-[116px] sm:w-[116px] sm:h-[116px] rounded-[50%] flex justify-center items-center mr-4 sm:mr-6'
})`
    background: linear-gradient(101.26deg, #00144E -5.29%, #003A33 113.82%);
`



export default NaoInfo;
