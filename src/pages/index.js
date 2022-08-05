import HomeIntroduce from 'src/components/screens/Home/HomeIntroduce';
import HomeMarketTrend from 'src/components/screens/Home/HomeMarketTrend';
import HomeAdditional from 'src/components/screens/Home/HomeAdditional';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import HomeNews from 'src/components/screens/Home/HomeNews';
import Modal from 'src/components/common/ReModal';

import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import Button from 'components/common/Button';

const APP_URL = process.env.APP_URL || 'https://nami.exchange'

const Index = () => {
    // * Initial State
    const [state, set] = useState({
        showQR: false,
    })
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    // * Use Hooks
    const { t } = useTranslation(['home', 'modal'])

    // * Render Handler
    const renderQrCodeModal = useCallback(() => {
        return (
            <Modal
                isVisible={state.showQR}
                title={t('modal:scan_qr_to_download')}
                onBackdropCb={() => setState({ showQR: false })}
            >
                <div className='flex items-center justify-center'>
                    <QRCode
                        value={`${APP_URL}#nami_exchange_download_app`}
                        size={128}
                    />
                </div>
                <div className='mt-4 w-full flex flex-row items-center justify-between'>
                    <Button
                        title={t('common:close')}
                        type='secondary'
                        componentType='button'
                        className='!py-2'
                        onClick={() => setState({ showQR: false })}
                    />
                </div>
            </Modal>
        )
    }, [state.showQR])

    return (
        <MaldivesLayout navOverComponent navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className='homepage'>
                <HomeIntroduce parentState={setState} />
                <HomeMarketTrend />
                <HomeNews />
                <HomeAdditional parentState={setState} />
                {renderQrCodeModal()}
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'home',
            'modal',
            'input',
            'table',
        ])),
    },
})

export default Index
