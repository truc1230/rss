import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as fbq from 'src/utils/fpixel';
import * as gtm from 'src/utils/gtm';

const handleRouteChange = (url) => {
    fbq.pageview();
    gtm.pageview(url);
};

const Tracking = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        // This pageview only trigger first time (it is important for Pixel to have real information)
        fbq.pageview();

        router.events.on('routeChangeComplete', handleRouteChange);

        return function cleanup() {
            router.events.off('routeChangeComplete', handleRouteChange);
        }
    }, [router.events]);

    return children;
};

export default Tracking;
