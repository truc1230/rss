import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { LayoutAbc } from '../components/LayoutAbc';

const Index = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full">
            <LayoutAbc />
            <div className="mt-10 text-dominant">{t('home:faq')}</div>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['home']))
    }
});

export default Index;
