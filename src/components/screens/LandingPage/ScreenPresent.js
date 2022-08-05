import Link from 'next/link';

import { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useWindowSize } from 'utils/customHooks';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getS3Url } from 'redux/actions/utils';

const ScreenPresent = ({ parentState }) => {
    // use Hooks
    const { width } = useWindowSize()
    const { i18n: { language }, t } = useTranslation(['modal'])

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



    // render Handler
    const renderMobile = () => {
        return (
            <>
                <div className="landing_page___mb_screen_present__top">
                    <div className="landing_page___mb_screen_present__top__left">
                        <img src={getS3Url(`/images/screen/landing-page/ip_mb_top_left.png`)} alt="Nami Maldives"/>
                    </div>
                    <div className="landing_page___mb_screen_present__top__right">
                        <img src={getS3Url(`/images/screen/landing-page/ip_mb_top_right_1.png`)} alt="Nami Maldives"/>
                        <img src={getS3Url('/images/screen/landing-page/ip_mb_top_right_2.png')} alt="Nami Maldives"/>
                    </div>
                </div>
                <div className="landing_page___mb_screen_present__bott">
                    <div className="">
                        <img src={getS3Url(`/images/screen/landing-page/ip_mb_bott_1.png`)} alt="Nami Maldives"/>
                    </div>
                    <div className="">
                        <img src={getS3Url(`/images/screen/landing-page/ip_mb_bott_2.png`)} alt="Nami Maldives"/>
                    </div>
                    <div className="">
                        <img src={getS3Url(`/images/screen/landing-page/ip_mb_bott_3.png`)} alt="Nami Maldives"/>
                    </div>
                </div>

                <div className="landing_page___mb_screen_present__nami">
                    <img src={getS3Url(`/images/screen/landing-page/nami_maldives.png`)} alt="Nami Maldives"/>
                    <div className="landing_page___mb_screen_present__title">
                        {renderTitle()}
                    </div>
                    <div className="landing_page___mb_screen_present__description">
                        {renderDescription()}
                    </div>
                </div>

                <div className="landing_page___mb_screen_present__button___group">
                    <Link href="https://apps.apple.com/app/id1480302334">
                        <a className="landing_page___mb_screen_present___download__item" target="_blank">
                            <img src={getS3Url('/images/download_app_store.png')} alt="Nami Exchange"/>
                        </a>
                    </Link>
                    <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                        <a className="landing_page___mb_screen_present___download__item" target="_blank">
                            <img src={getS3Url('/images/download_play_store.png')} alt="Nami Exchange"/>
                        </a>
                    </Link>
                    <div className="landing_page___mb_screen_present___download__item" onClick={() => parentState && parentState({ showQR: true })}>
                        <img src={getS3Url('/images/icon/ic_qr.png')} alt="Nami Exchange"/>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="landing_page___screen_present">
            {renderMobile()}
        </div>
    )
}

export default ScreenPresent
