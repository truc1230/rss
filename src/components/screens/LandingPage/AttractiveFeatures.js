import { useWindowSize } from 'utils/customHooks';
import { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const AttractiveFeatures = () => {
    // Use Hooks
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation(['maldives', 'navbar'])

    // Render Handler
    const renderFunction = useCallback(() => {
        let html = null
        if (width < 576) {
            html = <>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_swap.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Swap
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_rocket.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Launchpad
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_staking.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Staking
                        </div>
                    </div>
                </div>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_farming.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Farming
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_wallet.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            {t('navbar:menu.wallet')}
                        </div>
                    </div>
                </div>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_copytrade.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Copy Trades
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_news.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            News
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_explained.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Explained
                        </div>
                    </div>
                </div>
            </>
        } else if (width >= 576) {
            html = <>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_swap.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Swap
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_rocket.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Launchpad
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_staking.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Staking
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_farming.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Farming
                        </div>
                    </div>
                </div>
                <div className="function__wrapper">
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_wallet.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            {t('navbar:menu.wallet')}
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_copytrade.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Copy Trades
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_news.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            News
                        </div>
                    </div>
                    <div className="function__item">
                        <div className="function__item__icon">
                            <img src={getS3Url('/images/icon/ic_explained.png')} alt="Nami Maldives"/>
                        </div>
                        <div className="function__item__label">
                            Explained
                        </div>
                    </div>
                </div>
            </>
        }

        return (
            <div className="landing_page___attractive_features__content__right__function">
                {html}
            </div>
        )
    } ,[width])

    return (
        <div className="landing_page___attractive_features">
            <div className="landing_page___attractive_features__wrapper mal-container">
                <div className="landing_page___section_title">
                    {t('maldives:landing_page.attractive_features.title')}
                </div>
                <div className="landing_page___attractive_features__content">
                    <div className="landing_page___attractive_features__content__left">
                        <div className="landing_page___card">
                            <div className="landing_page___attractive_features__content__left__description">
                                {t('maldives:landing_page.attractive_features.description')}
                            </div>
                            <img src={getS3Url('/images/icon/speaker.png')} alt={null} />
                        </div>
                    </div>
                    <div style={width < 992 ? { marginTop: 20 } : {}}
                         className="landing_page___attractive_features__content__right">
                        <div className="landing_page___card">
                            {renderFunction()}
                        </div>
                    </div>
                </div>
            </div>
            <div style={width < 992 ? { marginTop: 20 } : {}} className="landing_page___portfolio">
                <div className="landing_page___portfolio__wrapper mal-container">
                    <div className="landing_page___card">
                        <div className="landing_page___portfolio__left">
                            <div className="mal-title__gradient">
                                {t('maldives:landing_page.attractive_features.favorite_portfolio')}
                            </div>
                            <div className="landing_page___portfolio__left___content">
                                <div className="landing_page___portfolio__left___content__title">
                                    {t('maldives:landing_page.attractive_features.what_can_you_do')}
                                </div>
                                <div className="landing_page___portfolio__left___content__items">
                                    <div>
                                        <span>&bull;</span> {t('maldives:landing_page.attractive_features.feature_1')}
                                    </div>
                                    <div>
                                        <span>&bull;</span> {t('maldives:landing_page.attractive_features.feature_2')}
                                    </div>
                                    <div>
                                        <span>&bull;</span> {t('maldives:landing_page.attractive_features.feature_3')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="landing_page___portfolio__right">
                            <img src={getS3Url(`/images/screen/landing-page/graphics_portfolio_${language}.png`)} alt="Nami Maldives"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttractiveFeatures
