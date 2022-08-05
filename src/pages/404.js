import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import Link from 'next/link';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { getS3Url } from 'redux/actions/utils';

const Custom404 = () => {
    const { t } = useTranslation(['404']);
    const router = useRouter();
    const { locale } = router;
    return (
        <MaldivesLayout>
            <div className="flex flex-1 justify-center items-center bg-black h-full">
                <div className="referral-container px-10 xl:px-0 xl:max-w-screen-xl w-full rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center ">
                        <div className="order-2 lg:order-1">
                            <div className="text-6xl font-semibold text-teal">{t('title')}</div>
                            <div className="text-2xl font-bold text-white mb-12 lg:whitespace-pre">
                                {t('subtitle')}
                            </div>
                            <Link href="/" locale={locale}>
                                <button className="btn btn-primary" type="button">{t('button')} <i className="fa-arrow-right" /></button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center text-center order-1 lg:order-2">
                            <img src={getS3Url("/images/bg/bg-error.png")} alt="404" className="lg:max-w-[620px]" />
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', '404', 'navbar', 'footer']),
    },
});
export default Custom404;
