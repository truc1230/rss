import { useWindowSize } from 'utils/customHooks';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import Image from 'next/image';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const PaymentAndKYC = () => {
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation(['maldives'])

    return (
        <div className="landing_page___payment_kyc">
            <div className="landing_page___section_title mal-container">
                {t('maldives:landing_page.method_kyc.title')}
                <span style={{marginLeft: 8}} className="text-txtPrimary">{language === LANGUAGE_TAG.VI ? '(sắp ra mắt)' : '(Coming soon)'}</span>
            </div>
            <div className="landing_page___payment_kyc___wrapper mal-container">
                <div className="landing_page___payment_kyc___item landing_page___card">
                    <div>
                        <div className="mal-title__gradient">
                            {t('maldives:landing_page.method_kyc.payment')}
                        </div>
                        <div className="landing_page___payment_kyc___item__description">
                            {t('maldives:landing_page.method_kyc.payment_description')}
                        </div>
                    </div>
                    <div className="landing_page___payment_kyc___item__img">
                        <img src={getS3Url(`/images/screen/landing-page/ip_kyc_1_${language}.png`)} alt="Nami Maldives"/>
                    </div>
                </div>
                <div style={width < 1200 ? {marginTop: 20} : {}}
                     className="landing_page___payment_kyc___item landing_page___card">
                    <div>
                        <div className="mal-title__gradient">
                            KYC
                        </div>
                        <div className="landing_page___payment_kyc___item__description">
                            {t('maldives:landing_page.method_kyc.kyc_description')}
                        </div>
                    </div>
                    {/*<div className="landing_page___payment_kyc___item__img">*/}
                    {/*    <img src={getS3Url(`images/screen/landing-page/ip_kyc_1_${language}.png`)}alt="Nami Maldives"/>*/}
                    {/*</div>*/}
                    <div className="landing_page___payment_kyc___item__with__bubble">
                        <div>
                            <Image src="/images/screen/landing-page/kyc_1.png" width="157" height="152"/>
                        </div>
                        <div className="w-full flex justify-end">
                            <Image src="/images/screen/landing-page/kyc_2.png" width="93" height="90"/>
                        </div>
                        <div>
                            <Image src="/images/screen/landing-page/kyc_3.png" width="134" height="130"/>
                        </div>
                    </div>
                </div>
                <div style={width < 1200 ? {marginTop: 20} : {}} className="landing_page___payment_kyc___item landing_page___card">
                    <div>
                        <div className="mal-title__gradient">
                            {t('maldives:landing_page.method_kyc.depwdl')}
                        </div>
                        <div className="landing_page___payment_kyc___item__description">
                            {t('maldives:landing_page.method_kyc.depwdl_description')}
                        </div>
                    </div>
                    <div className="landing_page___payment_kyc___item__img">
                        <img src={getS3Url(`/images/screen/landing-page/ip_kyc_2_${language}.png`)} alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentAndKYC
