/* eslint-disable no-alert, no-console */
// @ts-nocheck
// import { appWithTranslation, useTranslation } from 'next-i18next';

import { appWithTranslation, useTranslation } from 'next-i18next';
import '../styles/app.scss';
import '../../public/css/font.css';

const App = ({ Component, pageProps }) => {
    const {
        i18n: { language }
    } = useTranslation();

    return (
        <>
            <Component {...pageProps} />
        </>
    );
};

export default appWithTranslation(App);
