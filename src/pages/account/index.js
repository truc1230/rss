import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';

const Account = () => {
    const router = useRouter()

    if (typeof window !== 'undefined') {
        router.push(PATHS.ACCOUNT.PROFILE,
                    undefined,
                    { shallow: true })
    }

    return null
}

export default Account
