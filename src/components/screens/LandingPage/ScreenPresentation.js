import Link from 'next/link';

import { useCallback } from 'react';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import { useWindowSize } from 'utils/customHooks';
import { getS3Url } from 'redux/actions/utils';

const ScreenPresentation = ({ parentState }) => {
    // Use Hooks
    const { i18n: { language } } = useTranslation()
    const { width } = useWindowSize()

    // Helper
    const renderTitle = useCallback(() => {
        let text

        if (language === LANGUAGE_TAG.VI) {
            text = <>
                Trải nghiệm mới.<br/>
                Hành trình mới.
            </>
        } else {
            text = <>
                New Experiences.<br/>
                New Journey.
            </>
        }

        return <>{text}</>
    }, [language])

    const renderDescription = useCallback(() => {
        let text

        if (language === LANGUAGE_TAG.VI) {
            if (width < 700) {
                text = <>
                    Lấy cảm hứng từ sự tự do, thân thiện và phóng khoáng của<br/>
                    Maldives, Nami Exchange mang đến bản nâng cấp toàn<br/>
                    diện giao diện, tốc độ tăng gấp 3 lần, số lượng cặp giao dịch<br/>
                    tăng gấp 2 lần, tối ưu trải nghiệm giúp giảm 50% thao tác.
                </>
            } else  {
                text = <>
                    Lấy cảm hứng từ sự tự do, thân thiện và phóng khoáng của Maldives,<br/>
                    Nami Exchange mang đến bản nâng cấp toàn diện giao diện, tốc độ tăng gấp 3 lần, số lượng cặp<br/>
                    giao dịch tăng gấp 2 lần, tối ưu trải nghiệm giúp giảm 50% thao tác.
                </>
            }
        } else {
            if (width < 700) {
                text = <>
                    Inspired by the freedom, friendliness and<br/>
                    sophistication of the Maldives,<br/>
                    Nami Exchange brings a comprehensive upgrade of<br/>
                    the interface, the speed is increased 3 times, the<br/>
                    number of trading pairs is doubled, optimizes the<br/>
                    experience to reduce operations by 50%.<br/>
                </>
            } else {
                text = <>
                    Inspired by the freedom, friendliness and sophistication of the Maldives,<br/>
                    Nami Exchange brings a comprehensive upgrade of the interface, the speed is increased 3 times,<br/>
                    the number of trading pairs is doubled, optimizes the experience to reduce operations by 50%.
                </>
            }
        }

        return <>{text}</>
    }, [language, width])

    if (width < 768) {
        return null
    }

    return (
        <div className="landing_page___screen_presentation">
            <div className="landing_page___screen_presentation____left">
                <div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_left_1.png')} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_left_2.png')} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_left_3.png')} alt="Nami Maldives"/>
                    </div>
                </div>
                <div>
                    <div className="landing_page___screen_presentation__item__vertical">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_left_4.png')} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___screen_presentation__item__vertical">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_left_5.png')} alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
            <div className="landing_page___screen_presentation____center">
                <div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_center_1.png')} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_center_2.png')} alt="Nami Maldives"/>
                    </div>
                </div>
                <div className="landing_page___screen_presentation___product_intro">
                    <img className="nami_maldives__logo" src={getS3Url('/images/screen/landing-page/nami_maldives.png')} alt="Nami Maldives"/>
                    <div className="nami_maldives__slogan">
                        {renderTitle()}
                    </div>
                    <div className="nami_maldives__description">
                        {renderDescription()}
                    </div>
                    <div className="nami_maldives__download_app">
                        <Link href="https://apps.apple.com/app/id1480302334">
                            <a className="nami_maldives__download_app__item" target="_blank">
                                <img src={getS3Url('/images/download_app_store.png')} alt="Nami Exchange"/>
                            </a>
                        </Link>
                        <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                            <a className="nami_maldives__download_app__item" target="_blank">
                                <img src={getS3Url('/images/download_play_store.png')} alt="Nami Exchange"/>
                            </a>
                        </Link>
                        <div className="nami_maldives__download_app__item cursor-pointer" onClick={() => parentState({ showQR: true })}>
                            <img src={getS3Url('/images/icon/ic_qr.png')} alt="Nami Exchange"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="landing_page___screen_presentation____right">
                <div>
                    <div className="landing_page___screen_presentation__item__vertical">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_right_1.png')} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___screen_presentation__item__vertical">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_right_2.png')} alt="Nami Maldives"/>
                    </div>
                </div>
                <div>
                    <div>
                        <div className="landing_page___screen_presentation__item__vertical">
                            <img src={getS3Url('/images/screen/landing-page/ip_sp_right_3.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="landing_page___screen_presentation__item__vertical">
                            <img src={getS3Url('/images/screen/landing-page/ip_sp_right_4.png')} alt="Nami Maldives"/>
                        </div>
                    </div>
                    <div className="landing_page___screen_presentation__item__horizontal">
                        <img src={getS3Url('/images/screen/landing-page/ip_sp_right_5.png')} alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScreenPresentation
