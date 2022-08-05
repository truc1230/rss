import React, { useMemo, useRef, useState } from 'react';
import Modal from 'components/common/ReModal';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { X } from 'react-feather';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import SwiperCore, { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
SwiperCore.use([Autoplay, Navigation])

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = [];
        return utils.assetConfig.reduce((curr, item) => {
            if (Object.keys(params).find(id => id === String(item.id))) {
                assets.push({
                    assetCode: item.assetCode,
                    value: params[item.id],
                    icon: `/images/coins/128/${item?.id}.png`
                });
            }
            return assets;
        }, [])
    }
); ``

const RewardEventModal = ({ onClose, data }) => {
    const { t, i18n: { language } } = useTranslation()
    const sliderRef = useRef(null)
    const [view, setView] = useState(false);
    const tokens = useSelector(state => getAssets(state, {
        ...data?.reward?.tokens,
    }))

    const slideItem = (item) => {
        return (
            <div className="relative flex justify-center py-[14px] sm:py-[18px]">
                <ItemLabel>
                    <span className="relative top-[-5px] sm:top-0">{formatNumber(item.value, 3) + ' ' + item.assetCode}</span>
                </ItemLabel>
                <div className="relative">
                    <div className="relative w-[53px] sm:w-[65px] sm:h-[65px]">
                        <img src={getS3Url('/images/screen/reward/event_icon.png')} height={'100%'} width={'100%'}
                            className="sm:min-w-[65px] sm:min-h-[65px]" />
                    </div>
                    <ItemIcon>
                        <img src={getS3Url(item.icon)} height={'100%'} width={'100%'} />
                    </ItemIcon>
                </div>
            </div>
        )
    }

    const renderSlide = () => {
        if (!view) {
            return Array.isArray(tokens) && tokens.map((item, index) => (
                <SwiperSlide key={index}>
                    {slideItem(item)}
                </SwiperSlide>
            ))
        } else {
            const size = 9;
            const page = Array.isArray(tokens) && Math.ceil(tokens.length / size)
            const result = [];
            for (let i = 0; i < page; i++) {
                const dataFilter = tokens.slice(i * size, (i + 1) * size);
                result.push(<SwiperSlide key={i}>
                    <div className="flex w-full flex-wrap">
                        {dataFilter.map((item, index) => (
                            <div key={index} className="w-1/3">{slideItem(item, index)}</div>
                        ))}
                    </div>
                </SwiperSlide>
                )
            }
            return result;
        }
    }

    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    }

    return (
        <Modal
            isVisible={true}
            onBackdropCb={onClose}
            containerClassName='!min-w-[342px] w-[342px] h-[472px] p-0 sm:h-[581px] sm:w-[421px] !top-[50%] !border-0 !rounded-[18px] '
        >
            <Background language={language} view={view}>
                <div onClick={onClose} className="absolute right-2 top-2 cursor-pointer"><X /></div>
                <div className='h-full relative'>
                    {view && data?.reward?.num_of_rewards > 9 &&
                        <Button onClick={() => onNavigate(false)}>
                            <ButtonNav />
                        </Button>
                    }
                    <div className="flex relative top-[25%] sm:px-[30px] h-[230px] sm:h-[300px]">
                        <Swiper
                            ref={sliderRef}
                            loop={!(view && data?.reward?.num_of_rewards <= 9)}
                            lazy grabCursor
                            direction={view ? 'vertical' : 'horizontal'}
                            className={`mySwiper !mx-[15px] ${!view ? '' : 'w-full '}`}
                            slidesPerView={view ? 1 : 3}
                            // spaceBetween={10}
                            noSwiping={view && data?.reward?.num_of_rewards <= 9}
                            noSwipingClass='swiper-slide'
                            autoplay={{
                                'delay': 3000,
                                'disableOnInteraction': false
                            }}
                        >
                            {renderSlide()}
                        </Swiper>
                    </div>
                    {view && data?.reward?.num_of_rewards > 9 &&
                        <Button bottom onClick={() => onNavigate(true)}>
                            <ButtonNav />
                        </Button>
                    }
                    <div className="absolute bottom-0 w-full">
                        {!view &&
                            <div className="flex flex-col items-center justify-center font-semibold pb-[15px] sm:pb-[25px] sm:text-[17px] text-sm">
                                <div className=''>{t('reward-center:congratulation')}</div>
                                <div className="text-center whitespace-nowrap">
                                    {t("reward-center:you_have_received")}&nbsp;
                                    <span className="text-teal">{data?.reward?.num_of_rewards}</span>&nbsp;
                                    {t('reward-center:gifts_boxs')}&nbsp;
                                    <span className="text-teal">{data?.reward?.tokens && Object.keys(data?.reward?.tokens).length}</span>&nbsp;
                                    tokens
                                </div>
                            </div>
                        }
                        <div
                            onClick={() => setView(!view)}
                            className='bg-dominant text-center rounded-lg cursor-pointer font-semibold h-[44px]' >
                            <div className='hover:opacity-80 text-sm flex items-center justify-center h-full'>
                                {t(`common:${view ? 'collapse' : 'view_all'}`)}
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        </Modal>
    );
};

const Background = styled.div.attrs({
    className: 'h-full w-full text-white relative p-[24px] sm:px-[23px] sm:py-[35px] !rounded-[18px] select-none'
})`
    background-image:${({ language, view }) => view ? `url(${getS3Url(`/images/screen/reward/event_view_${language}.png`)})` : `url(${getS3Url(`/images/screen/reward/event_6_6_${language}.png`)})`};
    background-position: center;
    background-repeat: no-repeat;     
    background-size: cover;
`

const ItemLabel = styled.div.attrs({
    className: 'absolute top-0 text-center text-[8px] sm:text-xs font-semibold w-[49px] h-[47px] sm:w-[61px] sm:h-[59px] rounded-[6px] truncate px-[5px]'
})`
    background-image:${() => `url(${getS3Url('/images/screen/reward/event_label.png')})`};
    background-position: center;
    background-repeat: no-repeat;     
    background-size: cover;
`

const ItemIcon = styled.div.attrs({
    className: 'text-red w-[41px] h-[41px] sm:w-[51px] sm:h-[51px]'
})`
    position: absolute;
    left: 50%;
    top: 49%;
    transform: translate(-50%,-50%);
    img{
        border-radius: 50%;
    }
`

const Button = styled.div.attrs(({ bottom }) => ({
    className: `m-auto cursor-pointer select-none flex items-center justify-center`
}))`
    width: 19px;
    height: 19px;
    min-width: 19px;
    min-height: 19px;
    position: absolute;
    left: 50%;
    top:${({ bottom }) => bottom ? '83%' : '17%'};
    transform:${({ bottom }) => bottom ? 'translate(-50%,0) rotate(90deg)' : 'translate(-50%,0) rotate(-90deg)'} ;
`

export default RewardEventModal;


const ButtonNav = () => {
    return (
        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 6.63397C14.1667 7.01887 14.1667 7.98112 13.5 8.36602L2.25 14.8612C1.58333 15.2461 0.749999 14.765 0.749999 13.9952L0.75 1.00481C0.75 0.23501 1.58333 -0.246117 2.25 0.138783L13.5 6.63397Z" fill="#00C8BC" />
        </svg>
    )
}



