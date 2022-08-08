import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import styled from 'styled-components';
//doc react-slick.neostack.com/docs/api/#swipeToSlide

export default function News() {
    const renderSlides = () =>
        newsData(16).map((v, i) => {
            const { url, category, time, title } = v;
            return (
                <div key={i} className="pr-6">
                    <div className="border border-divider rounded-xl p-4 mb-6 shadow-lg">
                        <img src={url} alt="img" />
                        <div className="flex items-center mt-6 mb-1">
                            <div>{category} /</div>
                            <div className="text-txtSecondary">{time}</div>
                        </div>
                        <div className="font-medium text-[20px] leading-7">{title}</div>
                    </div>
                </div>
            );
        });
    return (
        <NewStyles>
            <Slider
                dots={true}
                slidesToShow={4}
                slidesToScroll={4}
                autoplaySpeed={3000}
                swipeToSlide={true}
                autoplay={false}
            >
                {renderSlides()}
            </Slider>
        </NewStyles>
    );
}

const NewStyles = styled.div`
    overflow-x: hidden;
    .slick-dots {
        position: absolute;
        left: 0;
        bottom: -5px;
    }
    .slick-dots li.slick-active button:before {
        color: red;
    }
`;

const newsData = (num = 16) => {
    const arr = [];
    const data = {
        url: '/images/news1.png',
        category: 'TIN TUC',
        time: '18/07/2022',
        title: 'Nami Insurance - Bảo vệ tài sản số của bạn'
    };
    for (let index = 0; index < num; index++) {
        arr.push(data);
    }
    return arr;
};
