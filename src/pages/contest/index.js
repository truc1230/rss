import React from 'react';
import Contest from 'components/screens/Nao/Contest/Contest';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { seasons } from 'components/screens/Nao/Contest/Contest';

const index = () => {
    return <Contest {...seasons[seasons.length - 1]} />
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao', 'error'
        ])),
    },
})

export default index;