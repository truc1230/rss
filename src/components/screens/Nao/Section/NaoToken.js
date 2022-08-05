import React, { memo } from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import { useWindowSize } from 'utils/customHooks';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const NaoToken = memo(({ onDownload }) => {
    const { width } = useWindowSize();
    const { t } = useTranslation();

    return (
        <section id="nao_token" className="pt-10 sm:pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <TextLiner>{t('nao:nao_token:title')}</TextLiner>
                    <span className="text-sm sm:text-[1rem] text-nao-grey">{t('nao:nao_token:description')}</span>
                </div>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                <CardNao className={`!flex-row items-center !justify-start ${width > 1080 ? '!flex-none' : ''}`}>
                    <img src={getS3Url("/images/nao/ic_nao_large.png")} alt="" width={60} height={60} />
                    <div className="flex flex-col pl-6">
                        <label className="text-nao-text text-sm font-medium leading-6">{t('nao:nao_token:nao_token')}</label>
                        <div className="pt-3">
                            <div className="text-nao-white font-semibold text-[1.375rem] sm:text-2xl leading-8">1,000 VNDC</div>
                            <span className="text-sm text-nao-grey leading-6">$0.025</span>
                        </div>
                    </div>
                </CardNao>
                <CardNao noBg className="!flex-row items-center flex-wrap w-full gap-4 sm:!justify-between">
                    <div className="flex items-center gap-5 max-w-[300px]">
                        <img src={getS3Url("/images/nao/ic_onus.png")} className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]" alt="" />
                        <div className="text-lg sm:text-[1.25rem] text-nao-text font-semibold">{t('nao:nao_token:get_buy_now')}</div>
                    </div>
                    <div className={`flex items-center flex-wrap gap-2 ${width < 390 ? 'justify-center' : 'justify-between'}  w-full sm:w-max sm:flex-nowrap sm:justify-end`}>
                        <img onClick={() => onDownload('app_store')} className="cursor-pointer h-[46px] sm:h-[50] w-[140px] sm:w-[152px]" src={getS3Url("/images/nao/ic_app_store.png")} alt="" />
                        <img onClick={() => onDownload('google_play')} className="cursor-pointer h-[46px] sm:h-[50] w-[154px] sm:w-[169px]" src={getS3Url("/images/nao/ic_google_play.png")} alt="" />
                    </div>
                </CardNao>
            </div>
        </section>
    );
});

export default NaoToken;