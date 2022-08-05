import { useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import { useInterval } from 'react-use';
import { defaultSlider } from 'config/sliders';
import { getMarketWatch } from 'src/redux/actions/market';
import SliderItem from './SliderItem';

const MarketSlider = (props) => {
    const [symbolList, setSymbolList] = useState([]);

    useEffect(async () => {
        await setSymbolList(await getMarketWatch());
    }, []);

    useInterval(async () => {
        await setSymbolList(await getMarketWatch());
    }, 10000);

    const _renderSlider = useMemo(() => {
        if (!(symbolList && symbolList.length)) {
            return null;
        }
        return (
            <div className="my-10 w-full">
                <Slider {...defaultSlider}>
                    {symbolList.slice(0, 20).map((item, index) => (<SliderItem data={item} key={index} />))}
                </Slider>
            </div>
        );
    }, [symbolList]);

    return (
        <>
            {_renderSlider}
        </>
    );
};

export default MarketSlider;
