import { ChevronDown, ChevronUp } from 'react-feather';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getS3Url, getV1Url } from 'redux/actions/utils';
import { PATHS } from 'constants/paths';

const PocketFooter = ({ active, parentState }) => {
    const { t, i18n: { language } } = useTranslation(['navbar']);

    return (
        <div className="mal-footer___pocket">
            <div className="mal-footer___pocket___company">
                <div className="mal-footer___pocket__logo">
                    <img src={getS3Url('/images/logo/nami-logo.png')} alt="Nami Exchange" />
                </div>
                <div className="mal-footer___pocket__slogan">
                    Change mindset, make giant steps
                </div>
                <div className="mal-footer___pocket__license">
                    Copyright © 2020 Nami Corporation.<br />
                    All rights reserved.
                </div>
            </div>

            <div className="mal-footer___pocket__links___group">
                <div className="mal-footer___pocket__links___group__item">
                    <div
                        className="mal-footer___pocket__links___group__item__expander"
                        onClick={() => parentState({ active: { about: !active.about } })}
                    >
                        {language === LANGUAGE_TAG.VI ? 'Về Nami Corporation' : 'About Nami Corp'}
                        {active?.about ? <ChevronUp size={16} /> : <ChevronDown size={16} /> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active.about ?
            'mal-footer___pocket__links___group__item__links__active' : ''}`}
                    >
                        <Link href="/terms-of-service">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Điều khoản' : 'Terms of Services'}
                            </a>
                        </Link>
                        <Link href={"/fee-schedule/trading"}>
                            <a>
                                {t('navbar:menu.fee')}
                            </a>
                        </Link>

                        <Link href={`https://nami.exchange/files/whitepaper_${language}_1510.pdf`}>
                            <a className="invisible">
                                Whitepaper
                            </a>
                        </Link>

                        <Link href="/">
                            <a className="invisible">
                                {language === LANGUAGE_TAG.VI ? 'Đối tác kinh doanh' : 'Partners'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="invisible">
                                {language === LANGUAGE_TAG.VI ? 'Nền tảng của Nami' : 'Nami Platform'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="invisible">
                                {language === LANGUAGE_TAG.VI ? 'Thông báo' : 'Notice'}
                            </a>
                        </Link>
                        <Link href="https://ico.nami.trade/#nami-team">
                            <a target="_blank" className="invisible">
                                {t('navbar:menu.about')}
                            </a>
                        </Link>
                    </div>
                </div>

                <div className="mal-footer___pocket__links___group__item">
                    <div
                        className="mal-footer___pocket__links___group__item__expander"
                        onClick={() => parentState({ active: { product: !active.product } })}
                    >
                        {t('navbar:menu.product')}
                        {active?.product ? <ChevronUp size={16} /> : <ChevronDown size={16} /> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active.product ?
            'mal-footer___pocket__links___group__item__links__active' : ''}`}
                    >
                        <Link href="/trade">
                            <a>
                                {t('navbar:menu.spot')}
                            </a>
                        </Link>
                        <Link href="/futures">
                            <a>
                                {t('navbar:menu.futures')}
                            </a>
                        </Link>
                        <Link href={getV1Url('/futures')}>
                            <a>
                                Launchpad
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Copy Trade
                            </a>
                        </Link>
                        <Link href={getV1Url('/farming')}>
                            <a>
                                Farming
                            </a>
                        </Link>
                        <Link href={getV1Url('/staking')}>
                            <a>
                                Staking
                            </a>
                        </Link>
                        <Link href={getV1Url('/reference')}>
                            <a>
                                {t('navbar:submenu.referral')}
                            </a>
                        </Link>
                        <Link href="/swap">
                            <a>
                                {t('navbar:menu.swap')}
                            </a>
                        </Link>
                    </div>
                </div>

                <div className="mal-footer___pocket__links___group__item">
                    <div
                        className="mal-footer___pocket__links___group__item__expander"
                        onClick={() => parentState({ active: { community: !active.community } })}
                    >
                        {language === LANGUAGE_TAG.VI ? 'Cộng đồng' : 'Community'}
                        {active?.community ? <ChevronUp size={16} /> : <ChevronDown size={16} /> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active.community ?
            'mal-footer___pocket__links___group__item__links__active' : ''}`}
                    >
                        <Link href="https://www.facebook.com/namifutures">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_fb.png')} className="mr-3" alt="" width="16" height="16"/> Facebook Fanpage
                            </a>
                        </Link>
                        <Link href="https://www.facebook.com/groups/nami.exchange">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_fb.png')} className="mr-3" alt="" width="16" height="16"/> Facebook Group
                            </a>
                        </Link>
                        <Link href="https://t.me/namitradevn">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_telegram.png')} className="mr-3" alt="" width="16" height="16"/> Telegram Vietnam
                            </a>
                        </Link>
                        <Link href="https://t.me/namitrade">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_telegram.png')} className="mr-3" alt="" width="16" height="16"/> Telegram Global
                            </a>
                        </Link>
                        <Link href="https://twitter.com/NamiTrade">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_twitter.png')} className="mr-3" alt="" width="16" height="16"/> Twitter
                            </a>
                        </Link>
                        <Link href="https://www.reddit.com/r/NAMIcoin">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_reddit.png')} className="mr-3" alt="" width="16" height="16"/> Reddit
                            </a>
                        </Link>
                        <Link href="/support">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_globe.png')} className="mr-3" alt="" width="16" height="16"/> Blog
                            </a>
                        </Link>
                        <Link href={`https://www.coingecko.com/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`}>
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_coingecko.png')} className="mr-3" alt="" width="16" height="16"/> CoinGecko
                            </a>
                        </Link>
                    </div>
                </div>

                <div className="mal-footer___pocket__links___group__item">
                    <div
                        className="mal-footer___pocket__links___group__item__expander"
                        onClick={() => parentState({ active: { support: !active.support } })}
                    >
                        {t('navbar:menu.support')}
                        {active?.support ? <ChevronUp size={16} /> : <ChevronDown size={16} /> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active.support ?
            'mal-footer___pocket__links___group__item__links__active' : ''}`}
                    >
                        <Link href="/support/announcement"
                              className="cursor-pointer">
                            {language === LANGUAGE_TAG.VI ? 'Thông báo' : 'Announcements'}
                        </Link>
                        <Link href="/support"
                              className="cursor-pointer">
                            {language === LANGUAGE_TAG.VI ? 'Trung tâm hỗ trợ' : 'Support Center'}
                        </Link>
                        <a onClick={() => window.fcWidget.open()}
                           className="cursor-pointer">
                            {language === LANGUAGE_TAG.VI ? 'Liên hệ hỗ trợ' : 'Chat with support'}
                        </a>
                        <Link href="/support/faq"
                              className="cursor-pointer">
                            {language === LANGUAGE_TAG.VI ? 'FAQs' : 'FAQs'}
                        </Link>

                        <a onClick={() => window.fcWidget.open()}
                           className="cursor-pointer invisible">
                            {language === LANGUAGE_TAG.VI ? 'Gửi yêu cầu hỗ trợ' : 'Send Ticket'}
                        </a>
                        {/*</Link>*/}
                        <Link href="/">
                            <a className="invisible">
                                {language === LANGUAGE_TAG.VI ? 'Cẩm nang Nami' : 'Nami\'s Handbook'}
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PocketFooter;
