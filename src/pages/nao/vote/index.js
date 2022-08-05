import 'react';
import { useRouter } from 'next/router';

export default function Vote() {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.back();
    }
    return null;
}
