import NextHead from 'next/head';
import {config as configFont} from '@fortawesome/fontawesome-svg-core';
import {useRouter} from 'next/router';

configFont.autoAddCss = false;

const SupportCenterHead = ({article}) => {
    const router = useRouter();
    const {route} = router;
    const articleUrl = `${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`;
    return (
        <>
            {/* <DefaultSeo {...config} /> */}
            <NextHead>
                <title>{article?.title}</title>
                <meta name="description" content={article?.excerpt}/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="manifest" href="/site.webmanifest" key="site-manifest"/>
                <link rel="canonical" href={articleUrl}/>
                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:creator" content="@Nami"/>
                <meta name="twitter:site" content="@Nami"/>
                <meta property="og:title" content={article?.title}/>
                <meta property="og:description" content={article?.excerpt}/>
                <meta property="og:url" content={articleUrl}
                      key="og-url"/>
                <meta name="twitter:title" content={article?.title}/>
                <meta name="twitter:description" content={article?.excerpt}/>
                <meta name="twitter:url" content={articleUrl}/>

                <meta
                    property="og:image"
                    content={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                    key="fb-image"
                />
                <meta
                    name="twitter:image"
                    content={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                    key="twitter-image"
                />
                <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
            </NextHead>
        </>
    );
};

export default SupportCenterHead;
