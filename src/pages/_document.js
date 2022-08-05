import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// import {getLoginUrl} from "src/redux/actions/utils";

class MyDocument extends Document {
    render() {
        return (
            <Html className=''>
                <Head>
                    <link
                        rel='preconnect'
                        href='https://fonts.googleapis.com'
                    />
                    <link
                        rel='preconnect'
                        href='https://fonts.gstatic.com'
                        crossOrigin='true'
                    />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700&display=swap'
                        rel='stylesheet'
                    />
                    <link
                        href='/css/coolicons/coolicons.css'
                        rel='stylesheet'
                    />
                    <script src='/library/trading_view/tv.js' />
                    <script
                        type='text/javascript'
                        src='/library/trading_view/datafeeds/udf/dist/polyfills.js'
                    />
                    <script
                        type='text/javascript'
                        src='/library/trading_view/datafeeds/udf/dist/bundle.js'
                    />

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-PTWQXJB');`,
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '152788662016500');
                        fbq('track', 'PageView');
                    `,
                        }}
                    />
                    <script
                        async
                        src='https://www.googletagmanager.com/gtag/js?id=AW-802059455'
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'AW-802059455');
                                gtag('event', 'conversion', {'send_to': 'AW-802059455/2mHCCL26_YMBEL_puf4C'});
                                `,
                        }}
                    />
                </Head>
                <body>
                    <noscript>
                        <img
                            height='1'
                            width='1'
                            style={{ display: 'none' }}
                            src='https://www.facebook.com/tr?id=927448334500314&ev=PageView&noscript=1'
                        />
                    </noscript>
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TV5NQ44"
                        height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }
}

export default MyDocument
