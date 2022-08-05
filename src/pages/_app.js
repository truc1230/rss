/* eslint-disable no-alert, no-console */

import { appWithTranslation, useTranslation } from 'next-i18next';
import 'public/css/font.css';
import 'src/styles/app.scss';

const App = ({
    Component,
    pageProps
}) => {

    const {
        i18n: { language },
    } = useTranslation();
    console.log(language);
    return (
        <>

            <Component {...pageProps} />

        </>
    );
};

export default appWithTranslation(App);
