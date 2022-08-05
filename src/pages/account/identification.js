import React from 'react';
import withTabLayout from 'components/common/layouts/withTabLayout';
import { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import { useSelector } from 'react-redux';
import NeedLogin from 'components/common/NeedLogin';
import { useTranslation } from 'next-i18next'
import MCard from 'components/common/MCard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getS3Url } from 'redux/actions/utils';
import Link from 'next/link';
import { KYC_STATUS } from '../../redux/actions/const';
import QRCode from 'qrcode.react';


const Identification = () => {
    const user = useSelector(state => state.auth?.user);
    const { t, i18n: { language } } = useTranslation()

    const renderStatus = () => {
        if (!user) return null;
        const status = user?.kyc_status;
        const src = getS3Url(`/images/screen/identification/${status === KYC_STATUS.APPROVED ? 'verified' : status === KYC_STATUS.PENDING_APPROVAL ? 'process' : 'not_verified'}.png`);
        const statusName = status === KYC_STATUS.APPROVED ? t('identification:account.congratulations') : status === KYC_STATUS.PENDING_APPROVAL ? t('identification:account.process') : t('identification:account.not_verified');
        const title = status !== KYC_STATUS.APPROVED ? t('identification:account.not_verified_2') : t('identification:account.verified');
        return (
            <>
                <div className="w-[200px] h-[200px] m-auto">
                    <img src={src} alt="" /></div>
                <span className={`pt-8 lg:pt-12 text-base font-bold ${status !== KYC_STATUS.APPROVED ? 'text-red' : ''}`}>{statusName}</span>
                <span className={`text-sm ${status === KYC_STATUS.APPROVED ? 'text-base font-bold text-teal' : 'text-gray-1 font-medium'}`}>{title}</span>
            </>
        )
    }

    const renderInfo = () => {
        if (!user) return null;
        const status = user?.kyc_status;
        return (
            status !== KYC_STATUS.APPROVED ?
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 ">
                    <div className="grid-span-1 flex flex-col justify-between">
                        <div className="font-bold leading-[40px] text-[26px] mb-6">
                            {t('identification:title_2')}
                        </div>
                        <div className="flex items-center mb-[18px]">
                            <img className="w-[32px] h-[32px]" src={getS3Url('/images/screen/identification/ic_person.png')} alt="" />
                            <span className="pl-[16px] font-medium">{t('identification:personal')}</span>
                        </div>
                        <div className="flex items-center mb-[18px] mt-[18px]">
                            <img className="w-[32px] h-[32px]" src={getS3Url('/images/screen/identification/ic_info.png')} alt="" />
                            <span className="pl-[16px] font-medium">{t('identification:government')}</span>
                        </div>
                        <div className="flex items-center mb-[18px] mt-[18px]">
                            <img className="w-[32px] h-[32px]" src={getS3Url('/images/screen/identification/ic_facial.png')} alt="" />
                            <span className="pl-[16px] font-medium">{t('identification:facial')}</span>
                        </div>
                        <div className="flex items-center mt-[18px]">
                            <img className="w-[32px] h-[32px]" src={getS3Url('/images/screen/identification/ic_timer.png')} alt="" />
                            <span className="pl-[16px] font-medium">{t('identification:timer')}</span>
                        </div>
                    </div>
                    <div className="grid-span-1 text-center mt-5 sm:mt-0">
                        <div className="mb-[24px] m-auto rounded-[10px] p-[10px] border-teal border-[1px] w-[160px] h-[160px]">
                            <QRCode
                                value={'account_verification'}
                                size={140}
                            />
                        </div>
                        <span className="text-base font-medium">
                            {t('identification:qr_1')}<br /> {t('identification:qr_2')}</span>
                        <div className="flex mt-[24px] justify-between max-w-[290px] m-auto">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a target="_blank">
                                    <img className="m-auto w-[135px] h-[40px] mr-[20px]" src={getS3Url('/images/screen/homepage/app_store_light.png')} alt="" />
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a target="_blank">
                                    <img className="m-auto w-[135px] h-[40px]" src={getS3Url('/images/screen/homepage/play_store_light.png')} alt="" />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className="font-bold leading-[40px] text-[26px] mb-6">
                        {t('identification:title_3')}
                    </div>
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 ">
                        <div className="grid-span-1 flex flex-col justify-between">
                            <div className="px-7 py-7 flex items-center	hover:shadow-features">
                                <img className="w-[52px] h-[52px] " src={getS3Url('/images/screen/identification/ic_exchange2.png')} alt="" />
                                <div className="pl-[16px] flex flex-col">
                                    <label className="font-bold">{t('identification:buy_sell')}</label>
                                    <span className="text-gray font-medium">{t('identification:price_daily')}</span>
                                </div>
                            </div>
                            <div className="px-7 py-7 flex items-center	hover:shadow-features">
                                <img className="w-[52px] h-[52px]" src={getS3Url('/images/screen/identification/ic_withdraw.png')} alt="" />
                                <div className="pl-[16px] flex flex-col">
                                    <label className="font-bold">{t('identification:withdrawal')}</label>
                                    <span className="text-gray font-medium">{t('identification:unlimited')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid-span-1 flex flex-col justify-between">
                            <div className="px-7 py-7 flex items-center	hover:shadow-features">
                                <img className="w-[52px] h-[52px]" src={getS3Url('/images/screen/identification/ic_wallet_3.png')} alt="" />
                                <div className="pl-[16px] flex flex-col">
                                    <label className="font-bold">{t('identification:deposit')}</label>
                                    <span className="text-gray font-medium">{t('identification:unlimited')}</span>
                                </div>
                            </div>
                            <div className="px-7 py-7 flex items-center	hover:shadow-features">
                                <img className="w-[52px] h-[52px]" src={getS3Url('/images/screen/identification/ic_reward.png')} alt="" />
                                <div className="pl-[16px] flex flex-col">
                                    <label className="font-bold">{t('identification:other')}</label>
                                    <span className="text-gray font-medium">{t('identification:reward')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

    return (
        <div>
            {!user ? <NeedLogin addClass="h-[380px] flex justify-center items-center" />
                :
                <div className="pb-20 lg:pb-24 2xl:pb-32">
                    <div className="font-bold leading-[40px] text-[26px] mb-6">
                        {t('identification:title')}
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-10 gap-4">
                        <MCard addClass="text-center flex flex-col sm:col-span-1 md:col-span-3 px-7 py-8 lg:p-10 xl:px-7 xl:py-8 drop-shadow-onlyLight border border-transparent dark:drop-shadow-none dark:border-divider-dark">
                            {renderStatus()}
                        </MCard>
                        <MCard addClass="sm:col-span-1 md:col-span-7 px-7 py-8 lg:p-10 xl:px-7 xl:py-8 drop-shadow-onlyLight border border-transparent dark:drop-shadow-none dark:border-divider-dark">
                            {renderInfo()}
                        </MCard>
                    </div>
                </div>
            }
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['navbar', 'profile', 'fee-structure', 'identification', 'reward-center'])
    }
})
export default withTabLayout(
    {
        routes: TAB_ROUTES.ACCOUNT
    }
)(Identification)
