import { useRouter } from 'next/router';

const OrderIndex = () => {
    const router = useRouter()
    if (typeof window !== 'undefined') {
        router.back();
    }
    return null
}

export default OrderIndex
