import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const Index = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full">
            <LayoutAbc />
            <Header />
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['home']))
    }
});

export default Index;
