import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { log } from 'utils';

const ExchangeTransfer = () => {

    const router = useRouter()

    useEffect(() => {
        log.d('Exchange Transfer => ', router?.query)
    }, [router?.query])

    return (
        <MaldivesLayout>
            <div>
                ExchangeTransfer
            </div>
        </MaldivesLayout>
    )
}

export default ExchangeTransfer
