export const defaultSlider = {
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    centerMode: true,
    infinite: true,
    swipe: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
        // {
        //     breakpoint: 1500,
        //     settings: {
        //         slidesToShow: 4,
        //         slidesToScroll: 1,
        //     },
        // },
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1500,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 770,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
            },
        },
        // {
        //     breakpoint: 480,
        //     settings: {
        //         slidesToShow: 1,
        //         slidesToScroll: 1,
        //         centerMode: false,
        //     },
        // },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],
};
