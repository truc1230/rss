import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { getS3Url } from 'redux/actions/utils';

const Footer = () => {
    const { t } = useTranslation('footer');
    const router = useRouter();
    const { route, locale } = router;
    const menu = [
        {
            name: t('product'),
            submenu: [
                { name: t('nami_exchange'), route: 'https://nami.exchange' },
                { name: t('nami_futures'), route: 'https://nami.futures' },
                { name: t('nami_explained'), route: 'https://explained.nami.exchange' },
                { name: t('nami_trade'), route: 'https://nami.trade' },
                { name: t('nami_io'), route: 'https://nami.io' },
                { name: t('nami_assistant'), route: 'https://nami.assistant' },
                { name: t('nami_today'), route: 'https://nami.today' },
                { name: t('nami_tv'), route: 'https://nami.tv' },
            ],
        },
        {
            name: t('community'),
            submenu: [
                { name: t('social_coingecko'), route: 'https://www.coingecko.com/en/exchanges/nami_exchange' },
                { name: t('social_facebook'), route: 'https://www.facebook.com/nami.trade.official' },
                { name: t('social_twitter'), route: 'https://twitter.com/NamiTrade' },
                { name: t('social_telegram'), route: 'https://t.me/namitradevn' },
                { name: t('social_youtube'), route: 'https://www.youtube.com/channel/UCYAqEagemhtu0MOtnE7rNJQ' },
            ],

        },
        {
            name: t('support'),
            submenu: [
                { name: 'API', route: 'https://namiexchange.github.io/docs/#introduction' },
                { name: 'System Status', route: 'https://nami.exchange/system-status' },

            ],
        },
        {
            name: t('resources'),
            submenu: [
                { name: t('policies'), route: '/privacy' },
                { name: t('terms'), route: '/terms-of-sersvice' },
                { name: t('whitepaper'), route: 'https://nami.exchange/files/whitepaper_vi_1510.pdf' },
                { name: t('team'), route: 'https://ico.nami.trade/#nami-team' },
                { name: t('fee_schedule'), route: 'https://nami.exchange/fee-schedule' },
                { name: t('api'), route: 'https://nami.exchange/settings/api-management' },
            ],
        },
    ];
    return useMemo(() => (
        <footer>
            <div className="bg-darkBlue lg:py-[3.75rem] py-10">
                <div className="nami-container">
                    <div className="grid lg:grid-cols-3">
                        <div className="">
                            <div className="mb-5">
                                <image src={getS3Url("/images/logo/nami-logo.png")} height="40" width="160" />
                            </div>
                            <div className="mb-9">
                                <div className="font-semibold mt-3 text-white">
                                    Change mindset, make giant steps
                                </div>
                            </div>

                        </div>
                        <div className="col-span-2 grid grid-cols-2  lg:grid-cols-4">
                            {menu.map((m, index) => (
                                <div key={index}>
                                    <div className="uppercase text-xs font-bold mb-4 text-teal">
                                        {m.name}
                                    </div>
                                    {m.submenu.map((sub, iSub) => (
                                        <Link href={sub.route} key={iSub} prefetch={false}>
                                            <a className=" text-tiny text-white font-medium hover:text-teal-700 mb-2 last:mb-0 block">{sub.name}</a>
                                        </Link>
                                    ))}
                                    <div />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center bg-darkBlue text-[#83859E] text-xs py-3">
                Copyright © 2019 Nami Corp. All rights reserved.
            </div>
        </footer>
    ), [],
    );
};

export default Footer;
