import { memo, useCallback } from 'react';

import MarketTrendItem from 'src/components/markets/MarketTrendItem';
import useWindowSize from 'hooks/useWindowSize';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';

SwiperCore.use([Autoplay])

const MarketTrend = memo(({ loading, data }) => {
    const { width } = useWindowSize()

    // * Render Handler
    const renderCard = useCallback(() => {
        if (!data) return null
        return data.map(d => (
            <SwiperSlide key={d.s}>
                <MarketTrendItem pair={d}/>
            </SwiperSlide>
        ))
    }, [data])

    const renderSkeleton = useCallback(() => {
        if (width >= 1280) {
            return (
                <div className="flex items-center justify-between">
                    <MarketTrendItem style={{ width: 'calc(96% / 4)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 4)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 4)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 4)' }} pair={null}/>
                </div>
            )
        }

        if (width >= 768) {
            return (
                <div className="flex items-center justify-between">
                    <MarketTrendItem style={{ width: 'calc(96% / 3)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 3)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 3)' }} pair={null}/>
                </div>
            )
        }

        if (width >= 576) {
            return (
                <div className="flex items-center justify-between">
                    <MarketTrendItem style={{ width: 'calc(96% / 2)' }} pair={null}/>
                    <MarketTrendItem style={{ width: 'calc(96% / 2)' }} pair={null}/>
                </div>
            )
        }

        return (
            <div className="flex items-center justify-between">
                <MarketTrendItem style={{ width: 'calc(96% / 1)' }} pair={null}/>
            </div>
        )
    }, [width])

    return (
        <div className="py-6 px-4 lg:px-0">
            {!data ? renderSkeleton()
                : <Swiper
                    loop
                    lazy
                    grabCursor
                    direction="horizontal"
                    className="mySwiper"
                    slidesPerView={1}
                    spaceBetween={10}
                    autoplay={{
                        'delay': 3200,
                        'disableOnInteraction': true
                    }}
                    breakpoints={{
                        '576': {
                            'slidesPerView': 2,
                            'spaceBetween': 20
                        },
                        '768': {
                            'slidesPerView': 3,
                            'spaceBetween': 20
                        },
                        '1280': {
                            'slidesPerView': 4,
                            'spaceBetween': 20
                        }
                    }}>
                    {renderCard()}
                </Swiper>}
        </div>
    )
})

export default MarketTrend
