import HomeIntroduce from 'src/components/screens/Home/HomeIntroduce';
import HomeMarketTrend from 'src/components/screens/Home/HomeMarketTrend';
import HomeAdditional from 'src/components/screens/Home/HomeAdditional';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import HomeNews from 'src/components/screens/Home/HomeNews';
import Modal from 'src/components/common/ReModal';

import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import Button from 'components/common/Button';

const APP_URL = process.env.APP_URL || 'https://nami.exchange'

const Index = () => {

    return (
        <div className='mt-8'>abc</div>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'home',
            'modal',
            'input',
            'table',
        ])),
    },
})

export default Index
