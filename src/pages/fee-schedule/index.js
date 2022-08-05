import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';

const FeeDefault = () => {
    const router = useRouter()
    if (typeof window !== 'undefined') {
        router.push(PATHS.FEE_STRUCTURES.TRADING, undefined, { shallow: true })
    }
    return null
}

export default FeeDefault
