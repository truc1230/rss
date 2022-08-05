import React, { useContext, useState, useMemo } from 'react';
import Modal from 'components/common/ReModal';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { API_FUTURES_CAMPAIGN_ATTEND } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { useTranslation } from 'next-i18next';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { Errors, PromotionStatus, PromotionName } from 'components/screens/Mobile/Futures/onboardingType';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { useRef } from 'react';

const EventModalMobile = ({ visible, onClose, campaign }) => {
    const { t, i18n: { language } } = useTranslation()
    const context = useContext(AlertContext);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState(campaign)
    const mode = useRef(campaign[0].promotion_name)

    const isUSDT = useMemo(() => {
        return mode.current === PromotionName.ONBOARDING_5USDT && dataSource.find(rs => rs.promotion_name === PromotionName.ONBOARDING_5USDT);
    }, [dataSource, mode.current])

    const _onClose = () => {
        const _dataSource = [...dataSource];
        if (dataSource.length > 1) {
            const index = _dataSource.findIndex(rs => rs.promotion_name === mode.current);
            _dataSource.splice(index, 1);
            mode.current = Object.keys(PromotionName).find(i => i !== mode.current);
            setDataSource(_dataSource);
        } else {
            onClose();
        }
    }

    const onClaim = async () => {
        if (loading) return;
        setLoading(true)
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_FUTURES_CAMPAIGN_ATTEND,
                options: { method: 'POST' },
                params: {
                    promotion_name: mode.current
                }
            });
            if (status === ApiStatus.SUCCESS && data) {
                if (data?.status === PromotionStatus.CLAIMED) {
                    const quoteAsset = data.promotion_name === PromotionName.ONBOARDING_5USDT ? 'USDT' : 'VNDC'
                    context.alert.show('success', t('futures:mobile:title_on_boarding'), t(`futures:mobile:content_on_boarding`, { value: formatNumber(data?.value, 0, 0, true) + ' ' + quoteAsset }), null,
                        null, () => _onClose())
                }
            } else {
                context.alert.show('error', t('futures:mobile:title_on_boarding'), t(`futures:mobile:${Errors[status]}`), null,
                    null, () => _onClose())
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }

    }

    const className = useMemo(() => {
        return typeof window !== 'undefined' ? window.innerWidth < 360 ? 'w-[288px] h-[488px]' : 'w-[325px] h-[531px]' : 'w-[288px] h-[488px]'
    }, [])

    return (
        <Modal isVisible={true}
            onBackdropCb={onClose}
            containerClassName={`${className} !p-0 !top-[50%] !border-0 !rounded-[20px]`}
        >
            <Background language={language} isUSDT={isUSDT}>
                <Button
                    onusMode={true}
                    title={t('futures:mobile:get_now')}
                    type="primary"
                    className={`!h-[51px] !text-[16px] !font-semibold`}
                    componentType="button"
                    onClick={onClaim}
                />
            </Background>
        </Modal>
    );
};

const Background = styled.div.attrs({
    className: 'h-full w-full !rounded-[20px] select-none px-5 py-[23px] flex items-end'
})`
     background-image:${({ language, isUSDT }) => isUSDT ? `url(${getS3Url(`/images/screen/futures/popup_5_${language}.png`)})` : `url(${getS3Url(`/images/screen/futures/popup_onboarding_20k_${language}-min.png`)})`};
    background-position: center;
    background-repeat: no-repeat;     
    background-size: cover;
`
export default EventModalMobile;