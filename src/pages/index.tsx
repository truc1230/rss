import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import useLanguage from '../hooks/useLanguage';
import Banner from '../sections/Banner';
import News from '../sections/News';

const Index = () => {
    const { t } = useTranslation();
    const [currentLocale, onChangeLang] = useLanguage();
    return (
        <Layout>
            <div className="flex flex-col gap-[120px]">
                <Banner />
                <div className="lg:mx-[80px] font-medium">
                    <div className="text-5xl leading-10 mb-9">tintuc</div>
                    <News />
                </div>
            </div>
        </Layout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['home']))
    }
});

export default Index;
