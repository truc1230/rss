import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { seasons } from 'components/screens/Nao/Contest/Contest';
import Contest from 'components/screens/Nao/Contest/Contest';

const Season = ({ season }) => {
    const current = seasons[seasons.length - 1];
    return <Contest previous={current?.season !== season?.season} {...season} />
};

export const getServerSideProps = async (context) => {
    const season = seasons?.find(e => e.season === Number(context?.params?.season))
    if (!season) return { notFound: true }
    return {
        props: {
            season: season,
            ...(await serverSideTranslations(context.locale, ['common', 'nao', 'error'])),
        },
    };
};

// export const getStaticPaths = async ({ locales }) => {
//     const paths = []
//     seasons.map(item => {
//         return locales.map((locale) => {
//             return paths.push({
//                 params: { season: item?.season ?? 1, ...item },
//                 locale,
//             })
//         })
//     })
//     return {
//         paths: paths,
//         fallback: false
//     };
// }

// export const getStaticProps = async (context) => {
//     const { params, locale } = context;
//     const season = seasons.find(e => e.season === params?.season)
//     return {
//         props: {
//             season: season ?? {},
//             ...(await serverSideTranslations(locale, ['common', 'nao', 'error'])),
//         },
//     }
// };

export default Season;