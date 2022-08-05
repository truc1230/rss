import NextHead from 'next/head';
import {config as configFont, dom} from '@fortawesome/fontawesome-svg-core';
import {useRouter} from 'next/router';
import seoConfigs from '../../config/seo.json'
import SEO from "components/common/SEO";

configFont.autoAddCss = false;

const Head = ({language = 'vi'}) => {
    const router = useRouter();
    const {route} = router;
    const seoConfig = seoConfigs.find(config => {
        const regex = new RegExp(config.url)
        return regex.test(route)
    })[language]

    return (
        <>
            <NextHead>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="manifest" href="/site.webmanifest" key="site-manifest"/>
                <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
                <style>{dom.css()}</style>
            </NextHead>
            <SEO {...seoConfig}/>
        </>
    );
};

export default Head;
