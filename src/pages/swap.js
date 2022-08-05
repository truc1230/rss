import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import SwapIntroduce from 'src/components/screens/Swap/SwapIntroduce';
import SwapModule from 'src/components/screens/Swap/SwapModule';
import useWindowSize from 'hooks/useWindowSize';
import SwapHistory from 'src/components/screens/Swap/SwapHistory';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';
const MaldivesLayout = dynamic(() => import('components/common/layouts/MaldivesLayout'),
    { ssr: false })
const LayoutMobile = dynamic(() => import('components/common/layouts/LayoutMobile'),
    { ssr: false })

const Swap = () => {
    const [pair, setPair] = useState({})
    const { width } = useWindowSize()
    const router = useRouter()

    useEffect(() => {
        const query = router?.query

        if (query?.fromAsset) {
            setPair(prevState => ({ ...prevState, fromAsset: query?.fromAsset }))
        }
        if (query?.toAsset) {
            setPair(prevState => ({ ...prevState, toAsset: query?.toAsset }))
        }
    }, [router])

    const renderContent = () => {
        return (
            <div className="bg-gray-4 dark:bg-darkBlue-1 w-full h-full py-[64px] lg:pb-[74px] xl:pb-[94px]">
                <div className="mal-container flex justify-between pt-[64px] xl:pt-[72px]">
                    {width >= 1024 && <SwapIntroduce />}
                    <SwapModule width={width} pair={pair} />
                </div>
                {width >= 1024 && <SwapHistory width={width} />}
            </div>
        )
    }

    return isMobile ? <LayoutMobile>{renderContent()}</LayoutMobile> : <MaldivesLayout>{renderContent()}</MaldivesLayout>
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert', 'error']),
        },
    };
}
export default Swap
