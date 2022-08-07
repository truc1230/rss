import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import Layout from '../components/Layout';
import { isPlainObject } from '../utils/apply-url-filter';

const Index = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <div className="mt-10 text-dominant">{t('home:faq')}</div>
        </Layout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['home']))
    }
});

export default Index;
