import { useRouter } from 'next/router';

const SpotDefault = ({ token }) => {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.push('/trade/BTC-USDT', undefined, { shallow: true });
    }
    return null;
};

export default SpotDefault;
//
// export async function getStaticProps(context) {
//     return {
//         redirect: {
//             destination: '/spot/BTC_USDT',
//             permanent: false,
//         },
//     };
// }

//
// export default Authenticated;
