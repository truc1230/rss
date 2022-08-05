import { useRouter } from 'next/router';

const SpotDefault = ({ token }) => {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.push('/authenticated/nami', undefined, { shallow: true });
    }
    return null;
};

export default SpotDefault;
